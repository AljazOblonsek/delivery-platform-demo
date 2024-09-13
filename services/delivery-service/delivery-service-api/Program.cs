using System.Globalization;
using System.Text;
using delivery_service_api.Constants;
using delivery_service_api.Database;
using delivery_service_api.Endpoints;
using delivery_service_api.Helpers;
using delivery_service_api.Middleware;
using delivery_service_api.Services;
using FluentValidation;
using Microsoft.AspNetCore.Authentication.JwtBearer;
using Microsoft.AspNetCore.Http;
using Microsoft.EntityFrameworkCore;
using Microsoft.IdentityModel.Tokens;
using Microsoft.OpenApi.Models;
using OpenTelemetry.Logs;
using OpenTelemetry.Metrics;
using OpenTelemetry.Resources;
using OpenTelemetry.Trace;

var builder = WebApplication.CreateBuilder(args);

Dotenv.Load("./.env");

ValidatorOptions.Global.LanguageManager.Culture = new CultureInfo("en-US");

string logLevel = Environment.GetEnvironmentVariable(EnvironmentConstants.LogLevel);
string environment = Environment.GetEnvironmentVariable(EnvironmentConstants.Environment);
string otelExportUrl = Environment.GetEnvironmentVariable(EnvironmentConstants.OtelExportUrl);

builder.Logging
    .AddFilter("Microsoft.EntityFrameworkCore.*", environment == "migrations" ? LogLevel.Information : LogLevel.Warning)
    .AddFilter("Microsoft.AspNetCore", LogLevel.Warning)
    .SetMinimumLevel(logLevel switch
    {
        "error" => LogLevel.Error,
        "warning" => LogLevel.Warning,
        "info" => LogLevel.Information,
        "debug" => LogLevel.Debug,
        _ => LogLevel.Information
    });

builder.Services.AddTransient(provider =>
{
    var loggerFactory = provider.GetRequiredService<ILoggerFactory>();
    return loggerFactory.CreateLogger("Root");
});

if (!string.IsNullOrEmpty(otelExportUrl))
{
    builder.Logging.AddOpenTelemetry(logging =>
    {
        logging.AttachLogsToActivityEvent();
        logging.AddOtlpExporter(options => options.Endpoint = new Uri(otelExportUrl));
    });

    builder.Services.AddOpenTelemetry()
    .ConfigureResource(resource => resource.AddService("delivery-service-api"))
    .WithMetrics(metrics =>
    {
        metrics.AddAspNetCoreInstrumentation()
            .AddHttpClientInstrumentation();

        metrics.AddOtlpExporter(options => options.Endpoint = new Uri(otelExportUrl));
    })
    .WithTracing(tracing =>
    {
        tracing.AddAspNetCoreInstrumentation()
            .AddHttpClientInstrumentation()
            .AddEntityFrameworkCoreInstrumentation()
            .AddSource(nameof(IRabbitMQService));

        tracing.AddOtlpExporter(options => options.Endpoint = new Uri(otelExportUrl));
    });
}

builder.Configuration.AddEnvironmentVariables();

builder.Services.AddCors();
builder.Services.AddAuthentication(JwtBearerDefaults.AuthenticationScheme)
    .AddJwtBearer(options =>
    {
        options.TokenValidationParameters = new TokenValidationParameters
        {
            ValidateIssuerSigningKey = true,
            IssuerSigningKey = new SymmetricSecurityKey(Encoding.UTF8.GetBytes(builder.Configuration.GetValue<string>("JWT_SECRET_KEY"))),
            ValidateIssuer = false,
            ValidateAudience = false,
            ValidateLifetime = true

        };
    });
builder.Services.AddAuthorization();
builder.Services.AddValidatorsFromAssemblyContaining<Program>();
builder.Services.AddDbContext<DatabaseContext>(options =>
{
    string postgresHost = Environment.GetEnvironmentVariable(EnvironmentConstants.PostgresHost);
    string postgresPort = Environment.GetEnvironmentVariable(EnvironmentConstants.PostgresPort);
    string postgresDb = Environment.GetEnvironmentVariable(EnvironmentConstants.PostgresDb);
    string postgresUser = Environment.GetEnvironmentVariable(EnvironmentConstants.PostgresUser);
    string postgresPassword = Environment.GetEnvironmentVariable(EnvironmentConstants.PostgresPassword);

    options.UseNpgsql($"Host={postgresHost};Port={postgresPort};Database={postgresDb};Username={postgresUser};Password={postgresPassword}");
});
builder.Services.AddHttpContextAccessor();
builder.Services.AddScoped<IRabbitMQService, RabbitMQService>();
builder.Services.AddScoped<IMailService, MailService>();
builder.Services.AddScoped<IAuthService, AuthService>();
builder.Services.AddScoped<ITrackNumberService, TrackNumberService>();
builder.Services.AddScoped<IPackageService, PackageService>();
builder.Services.AddEndpointsApiExplorer();
builder.Services.AddSwaggerGen(options =>
{
    options.SwaggerDoc("v1", new OpenApiInfo
    {
        Title = "Delivery Service API",
        Description = "<p>The Delivery Service API is the main entry point for calls from our frontend applications. This description provides essential information on how to interact with the API.</p>"
    + "<p><b>Demo Logins</b></p>"
    + "<p>For demonstration purposes, the database includes two companies and three workers. Use these credentials to authenticate and make requests as specific workers.</p>"
    + "<ul>"
        + "<li><b>Beeliver</b> (Id: 1)</li>"
        + "<ul>"
            + "<li>Worker (Id: 1) - Email: <code>john.doe@dp-demo.io</code>, Password: <code>Test123!</code></li>"
            + "<li>Worker (Id: 2) - Email: <code>emily.santos@dp-demo.io</code>, Password: <code>Test123!</code></li>"
        + "</ul>"
        + "<li><b>WeShip</b> (Id: 2)</li>"
        + "<ul>"
            + "<li>Worker (Id: 3) - Email: <code>michael.ford@dp-demo.io</code>, Password: <code>Test123!</code></li>"
        + "</ul>"
    + "</ul>"
    + "<p><b>Example Package Process Flow</b></p>"
    + "<p>This section outlines an example flow to authenticate, add a package to the warehouse, and perform actions on it. Refer to the endpoint descriptions for detailed information.</p>"
    + "<ol>"
        + "<li>Authenticate a worker at <b>/api/auth/login</b> using the demo logins above.</li>"
        + "<li>Retrieve the access token from the response, press the <b>Authorize</b> button on the top right, and use <b>bearer your-access-token</b> to authorize API requests.</li>"
        + "<li>Use <b>/api/packages/scan</b> to add a package to the warehouse. Populate the request body with an Id (any number above 0) and a title. The action must be <b>AddToWarehouse</b> for the initial scan.</li>"
        + "<li>Send the request to receive a 200 OK response with the new package information.</li>"
        + "<li>Change the <b>action</b> in the request body to <b>StartDelivery</b> and resend the request to update the package status to 'In Delivery'.</li>"
        + "<li>To complete the process, change the <b>action</b> to <b>Deliver</b> to finish delivery or <b>ReturnToWarehouse</b> to return the package.</li>"
    + "</ol>",
        Version = "v1"
    });

    options.AddSecurityDefinition(
        "Bearer",
        new OpenApiSecurityScheme
        {
            Name = "Authorization",
            Type = SecuritySchemeType.ApiKey,
            In = ParameterLocation.Header,
            Scheme = "Bearer",
            BearerFormat = "JWT",
            Description = "JWT Authorization header using the Bearer scheme. Example: `Authorization: Bearer <token>`."
        }
    );
});

var app = builder.Build();

app.UseSwagger();
app.UseSwaggerUI();

app.UseMiddleware<ExceptionHandlingMiddleware>();

app.MapAuthEndpoints();
app.MapPackageEndpoints();

app.UseCors(policy =>
{
    policy
        .WithOrigins(Environment.GetEnvironmentVariable(EnvironmentConstants.DeliveryUiOrigins).Split(","))
        .AllowAnyHeader()
        .AllowAnyMethod();
});

app.UseAuthentication();
app.UseAuthorization();

app.Run($"http://[::]:{Environment.GetEnvironmentVariable(EnvironmentConstants.Port)}");

// Hacky way to make the Program class accessible in integration tests
public partial class Program { }
