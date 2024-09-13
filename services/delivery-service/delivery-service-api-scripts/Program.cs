using delivery_service_api.Constants;
using delivery_service_api.Database;
using delivery_service_api.Entities;
using delivery_service_api.Helpers;
using Microsoft.EntityFrameworkCore;

if (args.Length != 1)
{
    Console.WriteLine($"Usage: dotnet run <setup-for-local-development|run-migrations>");
    return;
}

Dotenv.Load("./.env");


if (args[0] == "setup-for-local-development")
{
    string companyOneName = "Beeliver";
    string companyTwoName = "WeShip";
    string workerJohnAtCompanyOneEmail = "john.doe@dp-demo.io";
    string workerEmilyAtCompanyOneEmail = "emily.santos@dp-demo.io";
    string workerMichaelAtCompanyTwoEmail = "michael.ford@dp-demo.io";
    string demoPassword = "Test123!";

    void PrintDemoDataInformation()
    {
        Console.WriteLine($"Company: {companyOneName}");
        Console.WriteLine($"  Worker: Email - {workerJohnAtCompanyOneEmail}, Password - {demoPassword}");
        Console.WriteLine($"  Worker: Email - {workerEmilyAtCompanyOneEmail}, Password - {demoPassword}");
        Console.WriteLine($"Company: {companyTwoName}");
        Console.WriteLine($"  Worker: Email - {workerMichaelAtCompanyTwoEmail}, Password - {demoPassword}");
    }

    Console.WriteLine("Starting setup of delivery service for local development.");

    string postgresHost = Environment.GetEnvironmentVariable(EnvironmentConstants.PostgresHost);
    string postgresPort = Environment.GetEnvironmentVariable(EnvironmentConstants.PostgresPort);
    string postgresDb = Environment.GetEnvironmentVariable(EnvironmentConstants.PostgresDb);
    string postgresUser = Environment.GetEnvironmentVariable(EnvironmentConstants.PostgresUser);
    string postgresPassword = Environment.GetEnvironmentVariable(EnvironmentConstants.PostgresPassword);

    string databaseConnectionString = $"Host={postgresHost};Port={postgresPort};Database={postgresDb};Username={postgresUser};Password={postgresPassword}";

    var options = new DbContextOptionsBuilder<DatabaseContext>()
                .UseNpgsql(databaseConnectionString)
                .Options;

    var databaseContext = new DatabaseContext(options);

    var companiesCount = await databaseContext.Companies.CountAsync();
    var workersCount = await databaseContext.Companies.CountAsync();

    if (companiesCount > 0 && workersCount > 0)
    {
        Console.WriteLine("Database of delivery service is already set up.");
        PrintDemoDataInformation();
        return;
    }

    var companyOne = await databaseContext.Companies.AddAsync(new CompanyEntity
    {
        Id = 1,
        Name = companyOneName
    });
    var companyTwo = await databaseContext.Companies.AddAsync(new CompanyEntity
    {
        Id = 2,
        Name = companyTwoName
    });
    await databaseContext.SaveChangesAsync();

    var workerJohnAtCompanyOne = await databaseContext.Workers.AddAsync(new WorkerEntity
    {
        Firstname = "John",
        Lastname = "Doe",
        Email = workerJohnAtCompanyOneEmail,
        HashedPassword = BCrypt.Net.BCrypt.HashPassword(demoPassword),
        CompanyId = companyOne.Entity.Id
    });
    var workerEmilyAtCompanyOne = await databaseContext.Workers.AddAsync(new WorkerEntity
    {
        Firstname = "Emily",
        Lastname = "Santos",
        Email = workerEmilyAtCompanyOneEmail,
        HashedPassword = BCrypt.Net.BCrypt.HashPassword(demoPassword),
        CompanyId = companyOne.Entity.Id
    });
    var workerMichaelAtCompanyTwo = await databaseContext.Workers.AddAsync(new WorkerEntity
    {
        Firstname = "Michael",
        Lastname = "Ford",
        Email = workerMichaelAtCompanyTwoEmail,
        HashedPassword = BCrypt.Net.BCrypt.HashPassword(demoPassword),
        CompanyId = companyTwo.Entity.Id
    });
    await databaseContext.SaveChangesAsync();

    Console.WriteLine("Successfully setup delivery service for local development.");
    PrintDemoDataInformation();
}
else if (args[0] == "run-migrations")
{
    Console.WriteLine("Starting to run migrations for delivery service.");

    string postgresHost = Environment.GetEnvironmentVariable(EnvironmentConstants.PostgresHost);
    string postgresPort = Environment.GetEnvironmentVariable(EnvironmentConstants.PostgresPort);
    string postgresDb = Environment.GetEnvironmentVariable(EnvironmentConstants.PostgresDb);
    string postgresUser = Environment.GetEnvironmentVariable(EnvironmentConstants.PostgresUser);
    string postgresPassword = Environment.GetEnvironmentVariable(EnvironmentConstants.PostgresPassword);

    string databaseConnectionString = $"Host={postgresHost};Port={postgresPort};Database={postgresDb};Username={postgresUser};Password={postgresPassword}";

    var options = new DbContextOptionsBuilder<DatabaseContext>()
                .UseNpgsql(databaseConnectionString)
                .Options;

    var databaseContext = new DatabaseContext(options);

    await databaseContext.Database.MigrateAsync();

    Console.WriteLine("Successfully finished migration process.");
}
