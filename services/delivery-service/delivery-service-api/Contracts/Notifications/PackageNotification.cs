namespace delivery_service_api.Contracts.Notifications;

public class PackageNotification
{
    public int Id { get; set; }
    public string TrackNumber { get; set; }
    public string Title { get; set; }
    public string Status { get; set; }
    public DateTime UpdatedAt { get; set; }
    public string CompanyName { get; set; }
    public int CompanyId { get; set; }
}
