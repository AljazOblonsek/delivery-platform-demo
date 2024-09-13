using System.Diagnostics;
using System.Text.Json;
using delivery_service_api.Constants;
using delivery_service_api.Contracts.Mails;
using delivery_service_api.Contracts.Notifications;
using delivery_service_api.Contracts.Requests;
using delivery_service_api.Contracts.Responses;
using delivery_service_api.Database;
using delivery_service_api.Entities;
using delivery_service_api.Enums;
using delivery_service_api.Extensions;
using delivery_service_api.Helpers;
using Microsoft.EntityFrameworkCore;

namespace delivery_service_api.Services;

public class PackageService : IPackageService
{
    private readonly DatabaseContext _databaseContext;
    private readonly ILogger<PackageService> _logger;
    private readonly IRabbitMQService _rabbitmqService;
    private readonly IMailService _mailService;
    private readonly ITrackNumberService _trackNumberService;
    private readonly IHttpContextAccessor _httpContextAccessor;

    public PackageService(DatabaseContext databaseContext, ILogger<PackageService> logger, IRabbitMQService rabbitmqService, IMailService mailService, ITrackNumberService trackNumberService, IHttpContextAccessor httpContextAccessor)
    {
        _databaseContext = databaseContext;
        _logger = logger;
        _rabbitmqService = rabbitmqService;
        _mailService = mailService;
        _trackNumberService = trackNumberService;
        _httpContextAccessor = httpContextAccessor;
    }

    public async Task<IResult> GetPackageById(int packageId)
    {
        if (packageId <= 0)
        {
            return Results.BadRequest(new ErrorResponse
            {
                Message = "Id must be greater than 0."
            });
        }

        var package = await _databaseContext.Packages.FirstOrDefaultAsync(e => e.Id == packageId);

        if (package == null)
        {
            return Results.Ok(new PackageResponse
            {
                Id = packageId,
            });
        }

        var workerCompanyId = int.Parse(_httpContextAccessor.HttpContext.User.Claims.Where(e => e.Type == "companyId").FirstOrDefault().Value);

        if (package.CompanyId != workerCompanyId)
        {
            return Results.Json(new ErrorResponse
            {
                Message = "The company does not have access to this package."
            }, statusCode: 403);
        }

        return Results.Ok(new PackageResponse
        {
            Id = package.Id,
            TrackNumber = package.TrackNumber,
            Title = package.Title,
            Status = package.Status,
            CreatedAt = package.CreatedAt,
            UpdatedAt = package.UpdatedAt,
        });
    }

    public async Task<IResult> ScanPackage(ScanPackageRequest scanPackageRequest)
    {
        _logger.LogInformation("Scan package flow started. {scanPackageRequest}", JsonSerializer.Serialize(scanPackageRequest));

        var package = await _databaseContext.Packages
            .Include(e => e.Company)
            .FirstOrDefaultAsync(e => e.Id == scanPackageRequest.Id);

        var workerId = int.Parse(_httpContextAccessor.HttpContext.User.Claims.Where(e => e.Type == "id").FirstOrDefault().Value);
        var workerCompanyId = int.Parse(_httpContextAccessor.HttpContext.User.Claims.Where(e => e.Type == "companyId").FirstOrDefault().Value);

        if (package == null)
        {
            if (scanPackageRequest.Action != PackageAction.AddToWarehouse)
            {
                return Results.BadRequest(new ErrorResponse
                {
                    Message = "When package does not exist yet you can only use `AddToWarehouse` action."
                });
            }

            var newPackage = await _databaseContext.Packages.AddAsync(new PackageEntity
            {
                Id = scanPackageRequest.Id,
                TrackNumber = await _trackNumberService.GenerateUniqueTrackNumberAsync(),
                Title = scanPackageRequest.Title,
                Status = PackageStatus.InWarehouse,
                CreatedAt = DateTime.UtcNow,
                UpdatedAt = DateTime.UtcNow,
                CompanyId = workerCompanyId,
                WorkerId = workerId
            });
            await _databaseContext.SaveChangesAsync();
            await newPackage.Reference("Company").LoadAsync();

            _logger.LogInformation("New package was created with id `{id}` and track number `{trackNumber}`.", newPackage.Entity.Id, newPackage.Entity.TrackNumber);

            string encryptedPrivateKey = PassphraseHelper.GeneratePassphrase();

            await _mailService.SendTrackPackageMailAsync(new TrackPackageMail
            {
                CompanyName = newPackage.Entity.Company.Name,
                PackageTitle = newPackage.Entity.Title,
                TrackNumber = newPackage.Entity.TrackNumber,
                TrackSecretKey = encryptedPrivateKey,
            });

            _logger.LogInformation("Email for package `{trackNumber}` tracking was sent.", newPackage.Entity.TrackNumber);

            _rabbitmqService.SendMessage(
                Environment.GetEnvironmentVariable(EnvironmentConstants.PackageNotificationQueueName),
                new AddPackageNotification
                {
                    EncryptedPrivateKey = AesEncryptionHelper.Encrypt(
                        encryptedPrivateKey,
                        Environment.GetEnvironmentVariable(EnvironmentConstants.TrackNumberMetaPrivateKeyEncryptionSecretKey)
                    ),
                    Package = new PackageNotification
                    {
                        Id = newPackage.Entity.Id,
                        TrackNumber = newPackage.Entity.TrackNumber,
                        Title = newPackage.Entity.Title,
                        Status = newPackage.Entity.Status.ToEnumString(),
                        UpdatedAt = newPackage.Entity.UpdatedAt,
                        CompanyName = newPackage.Entity.Company.Name,
                        CompanyId = newPackage.Entity.Company.Id,
                    }
                }
            );

            _logger.LogInformation("Sent add package notification to queue for package {trackNumber}.", newPackage.Entity.TrackNumber);

            return Results.Ok(new PackageResponse
            {
                Id = newPackage.Entity.Id,
                TrackNumber = newPackage.Entity.TrackNumber,
                Title = newPackage.Entity.Title,
                Status = newPackage.Entity.Status,
                CreatedAt = newPackage.Entity.CreatedAt,
                UpdatedAt = newPackage.Entity.UpdatedAt,
            });
        }

        if (package.CompanyId != workerCompanyId)
        {
            return Results.Json(new ErrorResponse
            {
                Message = "The company does not have access to this package."
            }, statusCode: 403);
        }

        if (!PackageConstants.StatusToActionsMap.TryGetValue(package.Status, out var packageActions))
        {
            return Results.Json(new ErrorResponse
            {
                Message = "Unable to get available actions for this package."
            }, statusCode: 500);
        }

        if (!packageActions.Contains(scanPackageRequest.Action))
        {
            return Results.BadRequest(new ErrorResponse
            {
                Message = $"Provided action cannot be performed on this package. Available actions: {string.Join(", ", packageActions.Select(e => $"`{e}`"))}."
            });
        }

        if (!PackageConstants.ActionToStatusMap.TryGetValue(scanPackageRequest.Action, out var newStatus))
        {
            return Results.Json(new ErrorResponse
            {
                Message = "Unable to get target status for this action."
            }, statusCode: 500);
        }

        package.Status = newStatus;
        package.UpdatedAt = DateTime.UtcNow;
        await _databaseContext.SaveChangesAsync();

        _logger.LogInformation("Package with id `{id}` has been updated with new status `{status}`.", package.Id, package.Status.ToString());

        _rabbitmqService.SendMessage(
            Environment.GetEnvironmentVariable(EnvironmentConstants.PackageNotificationQueueName),
            new UpdatePackageNotification
            {
                Package = new PackageNotification
                {
                    Id = package.Id,
                    TrackNumber = package.TrackNumber,
                    Title = package.Title,
                    Status = package.Status.ToEnumString(),
                    UpdatedAt = package.UpdatedAt,
                    CompanyName = package.Company.Name,
                    CompanyId = package.Company.Id,
                }
            }
        );

        _logger.LogInformation("Sent update package notification to queue for package {trackNumber}.", package.TrackNumber);

        return Results.Ok(new PackageResponse
        {
            Id = package.Id,
            TrackNumber = package.TrackNumber,
            Title = package.Title,
            Status = package.Status,
            CreatedAt = package.CreatedAt,
            UpdatedAt = package.UpdatedAt,
        });
    }
}
