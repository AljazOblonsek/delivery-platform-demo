using delivery_service_api.Contracts.Requests;

namespace delivery_service_api.Services;

public interface IAuthService
{
    public Task<IResult> LoginAsync(LoginRequest loginRequest);
}
