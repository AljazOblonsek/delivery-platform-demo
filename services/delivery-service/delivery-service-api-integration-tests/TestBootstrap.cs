using delivery_service_api.Constants;
using delivery_service_api.Contracts.Requests;
using delivery_service_api.Contracts.Responses;
using delivery_service_api.Database;
using delivery_service_api.Entities;
using delivery_service_api.Helpers;
using delivery_service_api.Services;
using Microsoft.AspNetCore.Mvc.Testing;
using Microsoft.EntityFrameworkCore;
using Microsoft.Extensions.DependencyInjection;
using Microsoft.Extensions.DependencyInjection.Extensions;
using Microsoft.Extensions.Hosting;
using NSubstitute;
using System.Net;
using System.Net.Http.Headers;

namespace delivery_service_api_integration_tests
{
    public class TestWebApplicationFactory : WebApplicationFactory<Program>
    {
        protected override IHostBuilder CreateHostBuilder()
        {
            return base.CreateHostBuilder().UseEnvironment("IntegrationTests");
        }
    }

    public class Worker : WorkerEntity
    {
        public string Password { get; set; }
    }

    public class TestBootstrap
    {
        public HttpClient Client;
        public CompanyEntity Company;
        public Worker WorkerJohn;
        public Worker WorkerEmily;
        public DatabaseContext DatabaseContext;
        public IMailService MailServiceMock;
        public IRabbitMQService RabbitMQServiceMock;

        public async Task<TestBootstrap> Setup()
        {
            string workingDirectory = Environment.CurrentDirectory;
            string projectDirectory = Directory.GetParent(workingDirectory).Parent.Parent.FullName;

            Dotenv.Load(Path.Combine(projectDirectory, "./.env.test"));

            string postgresHost = Environment.GetEnvironmentVariable(EnvironmentConstants.PostgresHost);
            string postgresPort = Environment.GetEnvironmentVariable(EnvironmentConstants.PostgresPort);
            string postgresDb = $"{Environment.GetEnvironmentVariable(EnvironmentConstants.PostgresDb)}-{Guid.NewGuid()}";
            string postgresUser = Environment.GetEnvironmentVariable(EnvironmentConstants.PostgresUser);
            string postgresPassword = Environment.GetEnvironmentVariable(EnvironmentConstants.PostgresPassword);
            string databaseConnectionString = $"Host={postgresHost};Port={postgresPort};Database={postgresDb};Username={postgresUser};Password={postgresPassword}";

            var options = new DbContextOptionsBuilder<DatabaseContext>()
                .UseNpgsql(databaseConnectionString)
                .Options;

            var testDatabaseContext = new DatabaseContext(options);
            await testDatabaseContext.Database.EnsureCreatedAsync();
            DatabaseContext = testDatabaseContext;

            var appFactory = new WebApplicationFactory<Program>().WithWebHostBuilder(builder =>
            {
                builder.ConfigureServices(services =>
                {
                    var databaseDescriptor = services.SingleOrDefault(s => s.ServiceType == typeof(DbContextOptions<DatabaseContext>));

                    if (databaseDescriptor != null)
                    {
                        services.Remove(databaseDescriptor);
                    }

                    services.AddDbContext<DatabaseContext>(options =>
                    {
                        options.UseNpgsql(databaseConnectionString);
                    });

                    MailServiceMock = Substitute.For<IMailService>();
                    RabbitMQServiceMock = Substitute.For<IRabbitMQService>();

                    services.RemoveAll<IMailService>();
                    services.RemoveAll<IRabbitMQService>();

                    services.AddScoped<IMailService>(_ => MailServiceMock);
                    services.AddScoped<IRabbitMQService>(_ => RabbitMQServiceMock);
                });

            });

            var serviceScopeFactory = appFactory.Services.GetRequiredService<IServiceScopeFactory>();

            using (var serviceScope = serviceScopeFactory.CreateScope())
            {
                var databaseContext = serviceScope.ServiceProvider.GetService<DatabaseContext>();

                var company = await databaseContext.Companies.AddAsync(new CompanyEntity
                {
                    Name = "Beeliver"
                });
                await databaseContext.SaveChangesAsync();

                var workerJohn = await databaseContext.Workers.AddAsync(new WorkerEntity
                {
                    Firstname = "John",
                    Lastname = "Doe",
                    Email = "john.doe@dpd-test.io",
                    HashedPassword = BCrypt.Net.BCrypt.HashPassword("Test123!"),
                    CompanyId = company.Entity.Id
                });
                var workerEmily = await databaseContext.Workers.AddAsync(new WorkerEntity
                {
                    Firstname = "Emily",
                    Lastname = "Santos",
                    Email = "emily.santos@dpd-test.io",
                    HashedPassword = BCrypt.Net.BCrypt.HashPassword("Test123!"),
                    CompanyId = company.Entity.Id
                });
                await databaseContext.SaveChangesAsync();

                Company = company.Entity;
                WorkerJohn = new Worker
                {
                    Id = workerJohn.Entity.Id,
                    Firstname = workerJohn.Entity.Firstname,
                    Lastname = workerJohn.Entity.Lastname,
                    Email = workerJohn.Entity.Email,
                    HashedPassword = workerJohn.Entity.HashedPassword,
                    CompanyId = workerJohn.Entity.CompanyId,
                    Password = "Test123!"
                };
                WorkerEmily = new Worker
                {
                    Id = workerEmily.Entity.Id,
                    Firstname = workerEmily.Entity.Firstname,
                    Lastname = workerEmily.Entity.Lastname,
                    Email = workerEmily.Entity.Email,
                    HashedPassword = workerEmily.Entity.HashedPassword,
                    CompanyId = workerEmily.Entity.CompanyId,
                    Password = "Test123!"
                };
            }

            Client = appFactory.CreateClient();

            return this;
        }

        public async Task Teardown()
        {
            await DatabaseContext.Database.EnsureDeletedAsync();
        }

        public async Task AuthenticateAsync(Worker worker)
        {
            Client.DefaultRequestHeaders.Authorization = new AuthenticationHeaderValue("bearer", await GetJwtAsync(worker));
        }

        private async Task<string> GetJwtAsync(Worker worker)
        {
            var attemptLogin = await Client.PostAsJsonAsync("api/auth/login", new LoginRequest
            {
                Email = worker.Email,
                Password = worker.Password
            });

            if (attemptLogin.StatusCode != HttpStatusCode.OK)
            {
                throw new Exception($"Failure trying to authenticate user: {await attemptLogin.Content.ReadAsStringAsync()}");
            }

            return (await attemptLogin.Content.ReadAsAsync<LoginResponse>()).AccessToken;
        }

    }
}
