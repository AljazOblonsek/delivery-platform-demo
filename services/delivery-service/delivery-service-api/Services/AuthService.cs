
using System.IdentityModel.Tokens.Jwt;
using System.Security.Claims;
using System.Text;
using delivery_service_api.Constants;
using delivery_service_api.Contracts.Requests;
using delivery_service_api.Contracts.Responses;
using delivery_service_api.Database;
using delivery_service_api.Entities;
using Microsoft.EntityFrameworkCore;
using Microsoft.IdentityModel.Tokens;

namespace delivery_service_api.Services;

public class AuthService : IAuthService
{
    private readonly DatabaseContext _databaseContext;

    public AuthService(DatabaseContext databaseContext)
    {
        _databaseContext = databaseContext;
    }

    public async Task<IResult> LoginAsync(LoginRequest loginRequest)
    {
        var worker = await _databaseContext.Workers
            .Include(e => e.Company)
            .FirstOrDefaultAsync(e => e.Email == loginRequest.Email);

        if (worker == null)
        {
            return Results.Unauthorized();
        }

        if (!BCrypt.Net.BCrypt.Verify(loginRequest.Password, worker.HashedPassword))
        {
            return Results.Unauthorized();
        }

        return Results.Ok(new LoginResponse
        {
            AccessToken = CreateAccessToken(worker)
        });
    }

    private string CreateAccessToken(WorkerEntity worker)
    {

        var signingKey = Encoding.UTF8.GetBytes(Environment.GetEnvironmentVariable(EnvironmentConstants.JwtSecretKey));

        var tokenDescriptor = new SecurityTokenDescriptor
        {
            Subject = new ClaimsIdentity([
                new Claim(JwtRegisteredClaimNames.Jti, Guid.NewGuid().ToString()),
                new Claim("id", worker.Id.ToString()),
                new Claim("email", worker.Email),
                new Claim("firstname", worker.Firstname),
                new Claim("lastname", worker.Lastname),
                new Claim("companyId", worker.Company.Id.ToString()),
                new Claim("companyName", worker.Company.Name)
            ]),
            Expires = DateTime.UtcNow.AddHours(int.Parse(Environment.GetEnvironmentVariable(EnvironmentConstants.JwtExpiresInHours))),
            SigningCredentials = new SigningCredentials(new SymmetricSecurityKey(signingKey), SecurityAlgorithms.HmacSha256Signature)
        };

        var tokenHandler = new JwtSecurityTokenHandler();

        var token = tokenHandler.CreateToken(tokenDescriptor);

        return tokenHandler.WriteToken(token);
    }
}
