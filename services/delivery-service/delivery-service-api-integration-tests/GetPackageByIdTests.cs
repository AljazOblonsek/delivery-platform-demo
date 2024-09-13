using delivery_service_api.Contracts.Responses;
using delivery_service_api.Entities;
using delivery_service_api.Enums;
using FluentAssertions;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Net;
using System.Net.Http.Json;
using System.Text;
using System.Threading.Tasks;
using static Microsoft.EntityFrameworkCore.DbLoggerCategory.Database;

namespace delivery_service_api_integration_tests
{
    public class GetPackageByIdTests
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
        public async Task Returns_BadRequest_If_IdIsNegative()
        {
            await app.AuthenticateAsync(app.WorkerJohn);

            var response = await app.Client.GetAsync("api/packages/-1");
            var responseData = await response.Content.ReadAsAsync<ErrorResponse>();

            response.StatusCode.Should().Be(HttpStatusCode.BadRequest);
            responseData.Message.Should().Be("Id must be greater than 0.");
        }

        [Test]
        public async Task Returns_BadRequest_If_IdIsZero()
        {
            await app.AuthenticateAsync(app.WorkerJohn);

            var response = await app.Client.GetAsync("api/packages/0");
            var responseData = await response.Content.ReadAsAsync<ErrorResponse>();

            response.StatusCode.Should().Be(HttpStatusCode.BadRequest);
            responseData.Message.Should().Be("Id must be greater than 0.");
        }

        [Test]
        public async Task Returns_Unauthorized_If_AccessTokenIsMissing()
        {
            var response = await app.Client.GetAsync("api/packages/1");

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
                Status = PackageStatus.InWarehouse,
                CreatedAt = DateTime.UtcNow,
                UpdatedAt = DateTime.UtcNow,
                CompanyId = company.Entity.Id
            });
            await app.DatabaseContext.SaveChangesAsync();

            await app.AuthenticateAsync(app.WorkerJohn);

            var response = await app.Client.GetAsync($"api/packages/{package.Entity.Id}");
            var responseData = await response.Content.ReadAsAsync<ErrorResponse>();

            response.StatusCode.Should().Be(HttpStatusCode.Forbidden);
            responseData.Message.Should().Be("The company does not have access to this package.");
        }

        [Test]
        public async Task Returns_Ok_And_OnlyId_If_PackageIsNotInDatabaseYet()
        {
            int packageId = 1;

            await app.AuthenticateAsync(app.WorkerJohn);

            var response = await app.Client.GetAsync($"api/packages/{packageId}");
            var responseData = await response.Content.ReadAsAsync<PackageResponse>();

            response.StatusCode.Should().Be(HttpStatusCode.OK);
            responseData.Id.Should().Be(packageId);
            responseData.TrackNumber.Should().BeNull();
            responseData.Status.Should().BeNull();
            responseData.CreatedAt.Should().BeNull();
            responseData.UpdatedAt.Should().BeNull();
        }

        [Test]
        public async Task Returns_Ok_And_FullPackageInformation_If_PackageIsInDatabase()
        {
            var package = await app.DatabaseContext.Packages.AddAsync(new PackageEntity
            {
                Id = 1,
                TrackNumber = "TN0007",
                Title = "iPhone 11",
                Status = PackageStatus.InWarehouse,
                CreatedAt = DateTime.UtcNow,
                UpdatedAt = DateTime.UtcNow,
                CompanyId = app.WorkerJohn.CompanyId
            });
            await app.DatabaseContext.SaveChangesAsync();

            await app.AuthenticateAsync(app.WorkerJohn);

            var response = await app.Client.GetAsync($"api/packages/{package.Entity.Id}");
            var responseData = await response.Content.ReadAsAsync<PackageResponse>();

            response.StatusCode.Should().Be(HttpStatusCode.OK);
            responseData.Id.Should().Be(package.Entity.Id);
            responseData.TrackNumber.Should().Be(package.Entity.TrackNumber);
            responseData.Title.Should().Be(package.Entity.Title);
            responseData.Status.Should().Be(package.Entity.Status);
            responseData.CreatedAt.Should().BeCloseTo(package.Entity.CreatedAt, TimeSpan.FromMinutes(1));
            responseData.UpdatedAt.Should().BeCloseTo(package.Entity.UpdatedAt, TimeSpan.FromMinutes(1));
        }
    }
}
