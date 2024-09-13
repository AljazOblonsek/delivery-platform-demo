using delivery_service_api.Contracts.Requests;
using delivery_service_api.Contracts.Responses;
using delivery_service_api.Services;
using FluentValidation;

namespace delivery_service_api.Endpoints;

public static class AuthEndpoints
{
    public static void MapAuthEndpoints(this IEndpointRouteBuilder app)
    {
        app.MapPost("/api/auth/login", async (LoginRequest loginRequest, IValidator<LoginRequest> validator, IAuthService authService) =>
        {
            var validationResult = await validator.ValidateAsync(loginRequest);

            if (!validationResult.IsValid)
            {
                return Results.BadRequest(new ErrorResponse
                {
                    Message = validationResult.ToString()
                });
            }

            return await authService.LoginAsync(loginRequest);
        })
        .WithName("AuthLogin")
        .WithTags("Auth")
        .WithSummary("Attempts to login worker with email and password.")
        .Produces<LoginResponse>(StatusCodes.Status200OK)
        .Produces<ErrorResponse>(StatusCodes.Status400BadRequest)
        .Produces(StatusCodes.Status401Unauthorized)
        .WithOpenApi(operation =>
        {
            operation.Responses["200"].Description = "Successfuly logs in and returns access token.";
            operation.Responses["400"].Description = "Invalid body.";
            operation.Responses["401"].Description = "Wrong email or password.";
            return operation;
        });
    }
}
