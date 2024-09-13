using delivery_service_api.Enums;

namespace delivery_service_api.Contracts.Responses;

public class PackageResponse
{
    public int Id { get; set; }
    public string? TrackNumber { get; set; }
    public string? Title { get; set; }
    public PackageStatus? Status { get; set; }
    public DateTime? CreatedAt { get; set; }
    public DateTime? UpdatedAt { get; set; }
}
