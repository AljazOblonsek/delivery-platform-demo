using delivery_service_api.Contracts.Requests;
using delivery_service_api.Contracts.Responses;
using delivery_service_api.Services;
using FluentValidation;
using Microsoft.OpenApi.Models;

namespace delivery_service_api.Endpoints;

public static class PackageEndpoints
{
    public static void MapPackageEndpoints(this IEndpointRouteBuilder app)
    {
        app.MapGet("/api/packages/{id:int}", async (int id, IPackageService packageService) =>
        {
            return await packageService.GetPackageById(id);
        })
        .RequireAuthorization()
        .WithName("GetPackageById")
        .WithTags("Packages")
        .WithSummary("Gets package by id and returns information about it.")
        .WithDescription(
            "<p>The endpoint's response varies based on whether the package with the provided ID exists in the database:</p>" +
            "<ul>" +
                "<li><b>If the package does not exist:</b> Only the `id` is returned, all other properties are null.</li>" +
                "<li><b>If the package exists:</b> Guard checks (e.g., company ownership) are performed, and all properties are provided.</li>" +
            "</ul>"
        )
        .Produces<PackageResponse>(StatusCodes.Status200OK)
        .Produces<ErrorResponse>(StatusCodes.Status400BadRequest)
        .Produces(StatusCodes.Status401Unauthorized)
        .Produces<ErrorResponse>(StatusCodes.Status403Forbidden)
        .WithOpenApi(operation =>
        {
            operation.Responses["200"].Description = "Returns information about the package.";
            operation.Responses["400"].Description = "Invalid id parameter provided.";
            operation.Responses["401"].Description = "Unauthorized.";
            operation.Responses["403"].Description = "Worker does not have access to this package information.";

            operation.Security.Add(new OpenApiSecurityRequirement {
                {
                    new OpenApiSecurityScheme
                    {
                        Reference = new OpenApiReference
                        {
                            Type = ReferenceType.SecurityScheme,
                            Id = "Bearer"
                        }
                    },
                    new List<string>()
                }
            });

            return operation;
        });

        app.MapPatch("/api/packages/scan", async (ScanPackageRequest scanPackageRequest, IValidator<ScanPackageRequest> validator, IPackageService packageService) =>
        {
            var validationResult = await validator.ValidateAsync(scanPackageRequest);

            if (!validationResult.IsValid)
            {
                return Results.BadRequest(new ErrorResponse
                {
                    Message = validationResult.ToString()
                });
            }

            return await packageService.ScanPackage(scanPackageRequest);
        })
        .RequireAuthorization()
        .WithName("ScanPackage")
        .WithTags("Packages")
        .WithSummary("Attempts to update the package status.")
        .WithDescription(
            "<p>This endpoint performs an `upsert` based on the ID in the request body:</p>" +
            "<ul>" +
                "<li><b>If the package does not exist:</b> A new package is created for the logged-in worker's company.</li>" +
                "<li><b>If the package exists:</b> Guard checks (e.g., company ownership) are performed, and the package is updated.</li>" +
            "</ul>" +
            "<p>Actions based on the package's status:</p>" +
             "<ul>" +
                "<li><b>Does not exist:</b> `AddToWarehouse`</li>" +
                "<li><b>Status `InWarehouse`:</b> `StartDelivery`</li>" +
                "<li><b>Status `InDelivery`:</b> `ReturnToWarehouse`, `Deliver`</li>" +
            "</ul>"
        )
        .Produces<PackageResponse>(StatusCodes.Status200OK)
        .Produces<ErrorResponse>(StatusCodes.Status400BadRequest)
        .Produces(StatusCodes.Status401Unauthorized)
        .Produces<ErrorResponse>(StatusCodes.Status403Forbidden)
        .Produces<ErrorResponse>(StatusCodes.Status500InternalServerError)
        .WithOpenApi(operation =>
        {
            operation.Responses["200"].Description = "The package was successfully updated.";
            operation.Responses["400"].Description = "Invalid body or wrong action is trying to be executed on the package.";
            operation.Responses["401"].Description = "Unauthorized.";
            operation.Responses["403"].Description = "Worker does not have access to this package information.";
            operation.Responses["500"].Description = "Unable to find action that was provided or wrong string was passed into the action property.";

            operation.Security.Add(new OpenApiSecurityRequirement {
                {
                    new OpenApiSecurityScheme
                    {
                        Reference = new OpenApiReference
                        {
                            Type = ReferenceType.SecurityScheme,
                            Id = "Bearer"
                        }
                    },
                    new List<string>()
                }
            });

            return operation;
        });
    }
}
