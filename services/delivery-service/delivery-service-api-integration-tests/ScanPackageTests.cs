using delivery_service_api.Constants;
using delivery_service_api.Contracts.Mails;
using delivery_service_api.Contracts.Notifications;
using delivery_service_api.Contracts.Requests;
using delivery_service_api.Contracts.Responses;
using delivery_service_api.Entities;
using delivery_service_api.Enums;
using delivery_service_api.Services;
using FluentAssertions;
using Microsoft.Extensions.DependencyInjection;
using NSubstitute;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Net;
using System.Net.Http.Json;
using System.Text;
using System.Threading.Tasks;

namespace delivery_service_api_integration_tests
{
    public class ScanPackageTests
    {
        private TestBootstrap app;

        [SetUp]
        public async Task Setup()
        {
            app = await new TestBootstrap().Setup();
        }

        [TearDown]
        public async Task Teardown()
        {
            await app.Teardown();
        }

        [Test]
        public async Task Returns_BadRequest_If_ActionIsNotAddToWarehouseWhenPackageIsAddedForTheFirstTime()
        {
            await app.AuthenticateAsync(app.WorkerJohn);

            var response = await app.Client.PatchAsJsonAsync("api/packages/scan", new ScanPackageRequest
            {
                Id = 1,
                Title = "iPhone 2024",
                Action = PackageAction.StartDelivery
            });
            var responseData = await response.Content.ReadAsAsync<ErrorResponse>();

            response.StatusCode.Should().Be(HttpStatusCode.BadRequest);
            responseData.Message.Should().Be("When package does not exist yet you can only use `AddToWarehouse` action.");
        }

        [Test]
        public async Task Returns_BadRequest_If_ProvidedActionCannotBePerformedOnCurrentPackageStatus()
        {
            var package = await app.DatabaseContext.Packages.AddAsync(new PackageEntity
            {
                Id = 1,
                TrackNumber = "TN0007",
                Status = PackageStatus.InWarehouse,
                CreatedAt = DateTime.UtcNow,
                UpdatedAt = DateTime.UtcNow,
                CompanyId = app.WorkerJohn.CompanyId
            });
            await app.DatabaseContext.SaveChangesAsync();

            await app.AuthenticateAsync(app.WorkerJohn);

            var response = await app.Client.PatchAsJsonAsync("api/packages/scan", new ScanPackageRequest
            {
                Id = 1,
                Title = "iPhone 2024",
                Action = PackageAction.AddToWarehouse
            });
            var responseData = await response.Content.ReadAsAsync<ErrorResponse>();

            response.StatusCode.Should().Be(HttpStatusCode.BadRequest);
            responseData.Message.Should().Contain("Provided action cannot be performed on this package. Available actions: ");
        }

        [Test]
        public async Task Returns_Unauthorized_If_AccessTokenIsMissing()
        {
            var response = await app.Client.PatchAsJsonAsync("api/packages/scan", new ScanPackageRequest
            {
                Id = 1,
                Title = "iPhone 2024",
                Action = PackageAction.AddToWarehouse
            });

            response.StatusCode.Should().Be(HttpStatusCode.Unauthorized);
        }

        [Test]
        public async Task Returns_Forbidden_If_WorkersCompanyDoesNotHaveAccessToPackage()
        {
            var company = await app.DatabaseContext.Companies.AddAsync(new CompanyEntity
            {
                Name = "WeShip"
            });
            await app.DatabaseContext.SaveChangesAsync();


            var package = await app.DatabaseContext.Packages.AddAsync(new PackageEntity
            {
                Id = 1,
                TrackNumber = "TN0007",
                Title = "iPhone 11",
                Status = PackageStatus.InWarehouse,
                CreatedAt = DateTime.UtcNow,
                UpdatedAt = DateTime.UtcNow,
                CompanyId = company.Entity.Id
            });
            await app.DatabaseContext.SaveChangesAsync();

            await app.AuthenticateAsync(app.WorkerJohn);

            var response = await app.Client.PatchAsJsonAsync("api/packages/scan", new ScanPackageRequest
            {
                Id = package.Entity.Id,
                Title = "iPhone 11",
                Action = PackageAction.StartDelivery
            });
            var responseData = await response.Content.ReadAsAsync<ErrorResponse>();

            response.StatusCode.Should().Be(HttpStatusCode.Forbidden);
            responseData.Message.Should().Be("The company does not have access to this package.");
        }

        [Test]
        public async Task Returns_Ok_And_CreatesNewPackage_If_PackageWithSameIdIsNotInDatabaseYet()
        {
            var scanPackageRequest = new ScanPackageRequest
            {
                Id = 1,
                Title = "iPhone 11",
                Action = PackageAction.AddToWarehouse
            };

            await app.AuthenticateAsync(app.WorkerJohn);

            var response = await app.Client.PatchAsJsonAsync("api/packages/scan", scanPackageRequest);
            var responseData = await response.Content.ReadAsAsync<PackageResponse>();

            response.StatusCode.Should().Be(HttpStatusCode.OK);
            responseData.Id.Should().Be(scanPackageRequest.Id);
            responseData.TrackNumber.Should().BeOfType<string>();
            responseData.Title.Should().Be(scanPackageRequest.Title);
            responseData.Status.Should().Be(PackageStatus.InWarehouse);
            responseData.CreatedAt.Should().BeCloseTo(DateTime.UtcNow, TimeSpan.FromMinutes(1));
            responseData.UpdatedAt.Should().BeCloseTo(DateTime.UtcNow, TimeSpan.FromMinutes(1));

            // Assert that email service was called to send email with package tracking information
            app.MailServiceMock.Received().SendTrackPackageMailAsync(Arg.Is<TrackPackageMail>(e =>
                e.CompanyName == app.Company.Name 
                && e.PackageTitle == scanPackageRequest.Title
                && e.TrackNumber == responseData.TrackNumber
                && e.TrackSecretKey is string
            ));

            // Assert that rabbitmq service was called to send create notification for the blockchain service
            app.RabbitMQServiceMock.Received().SendMessage<AddPackageNotification>(
                Environment.GetEnvironmentVariable(EnvironmentConstants.PackageNotificationQueueName),
                Arg.Is<AddPackageNotification>(e =>
                    e.Type == "add-package"
                    && e.EncryptedPrivateKey is string
                    && e.Package.Id == scanPackageRequest.Id
                    && e.Package.TrackNumber == responseData.TrackNumber
                    && e.Package.Title == scanPackageRequest.Title
                    && e.Package.Status == "IN_WAREHOUSE"
                    && e.Package.UpdatedAt is DateTime
                    && e.Package.CompanyName == app.Company.Name
                    && e.Package.CompanyId == app.WorkerJohn.CompanyId
                )
            );
        }

        [Test]
        public async Task Returns_Ok_And_UpdatesPackage_If_PackageWithSameIdAlreadyExistsInDatabase()
        {
            var now = DateTime.UtcNow;
            var package = await app.DatabaseContext.Packages.AddAsync(new PackageEntity
            {
                Id = 1,
                TrackNumber = "TN0007",
                Title = "iPhone 11",
                Status = PackageStatus.InWarehouse,
                CreatedAt = now,
                UpdatedAt = now,
                CompanyId = app.Company.Id
            });
            await app.DatabaseContext.SaveChangesAsync();

            var scanPackageRequest = new ScanPackageRequest
            {
                Id = package.Entity.Id,
                Title = package.Entity.Title,
                Action = PackageAction.StartDelivery
            };

            await app.AuthenticateAsync(app.WorkerJohn);

            var response = await app.Client.PatchAsJsonAsync("api/packages/scan", scanPackageRequest);
            var responseData = await response.Content.ReadAsAsync<PackageResponse>();

            response.StatusCode.Should().Be(HttpStatusCode.OK);
            responseData.Id.Should().Be(scanPackageRequest.Id);
            responseData.TrackNumber.Should().Be(package.Entity.TrackNumber);
            responseData.Title.Should().Be(scanPackageRequest.Title);
            responseData.Status.Should().Be(PackageStatus.InDelivery);
            responseData.CreatedAt.Should().BeCloseTo(DateTime.UtcNow, TimeSpan.FromMinutes(1));
            responseData.UpdatedAt.Should().BeAfter(now);

            // Assert that rabbitmq service was called to send update notification for the blockchain service
            app.RabbitMQServiceMock.Received().SendMessage<UpdatePackageNotification>(
                Environment.GetEnvironmentVariable(EnvironmentConstants.PackageNotificationQueueName),
                Arg.Is<UpdatePackageNotification>(e =>
                    e.Type == "update-package"
                    && e.Package.Id == scanPackageRequest.Id
                    && e.Package.TrackNumber == responseData.TrackNumber
                    && e.Package.Title == scanPackageRequest.Title
                    && e.Package.Status == "IN_DELIVERY"
                    && e.Package.UpdatedAt is DateTime
                    && e.Package.CompanyName == app.Company.Name
                    && e.Package.CompanyId == app.WorkerJohn.CompanyId
                )
            );
        }
    }
}
