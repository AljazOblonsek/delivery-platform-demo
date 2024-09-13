
using System.Text;
using delivery_service_api.Database;
using Microsoft.EntityFrameworkCore;

namespace delivery_service_api.Services;

public class TrackNumberService : ITrackNumberService
{
    private readonly ILogger<TrackNumberService> _logger;
    private readonly DatabaseContext _databaseContext;

    public TrackNumberService(ILogger<TrackNumberService> logger, DatabaseContext databaseContext)
    {
        _logger = logger;
        _databaseContext = databaseContext;
    }

    public async Task<string> GenerateUniqueTrackNumberAsync()
    {
        string trackNumber = string.Empty;

        do
        {
            trackNumber = GenerateRandomTrackNumber();
            _logger.LogDebug("Generated a new track number {trackNumber}.", trackNumber);
        } while (await _databaseContext.Packages.AnyAsync(e => e.TrackNumber == trackNumber));

        _logger.LogDebug("Generated track number {trackNumber} is unique and successfuly created.", trackNumber);

        return trackNumber;
    }

    private string GenerateRandomTrackNumber()
    {
        var random = new Random();
        var stringBuilder = new StringBuilder("TN");

        for (int i = 0; i < 8; i++)
        {
            stringBuilder.Append(random.Next(0, 10));
        }

        return stringBuilder.ToString();
    }
}
