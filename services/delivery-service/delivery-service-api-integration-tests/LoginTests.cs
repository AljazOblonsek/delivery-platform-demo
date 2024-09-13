using System.Net;
using delivery_service_api.Contracts.Requests;
using delivery_service_api.Contracts.Responses;
using FluentAssertions;

namespace delivery_service_api_integration_tests
{
    public class LoginTests
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
        public async Task Returns_Unauthorized_If_EmailIsNotFound()
        {
            var response = await app.Client.PostAsJsonAsync("api/auth/login", new LoginRequest
            {
                Email = "unknown.user@dpd-test.io",
                Password = "Test123!"
            });

            response.StatusCode.Should().Be(HttpStatusCode.Unauthorized);
        }

        [Test]
        public async Task Returns_Unauthorized_If_PasswordIsWrong()
        {
            var response = await app.Client.PostAsJsonAsync("api/auth/login", new LoginRequest
            {
                Email = app.WorkerJohn.Email,
                Password = "SomeRandomPassword123!"
            });

            response.StatusCode.Should().Be(HttpStatusCode.Unauthorized);
        }

        [Test]
        public async Task Returns_Ok_And_AccessToken_If_InformationIsCorrect()
        {
            var response = await app.Client.PostAsJsonAsync("api/auth/login", new LoginRequest
            {
                Email = app.WorkerJohn.Email,
                Password = app.WorkerJohn.Password
            });
            var responseData = await response.Content.ReadAsAsync<LoginResponse>();

            response.StatusCode.Should().Be(HttpStatusCode.OK);
            responseData.AccessToken.Should().BeOfType<string>();
        }
    }
}