namespace delivery_service_api.Services;

public interface ITrackNumberService
{
    Task<string> GenerateUniqueTrackNumberAsync();
}
