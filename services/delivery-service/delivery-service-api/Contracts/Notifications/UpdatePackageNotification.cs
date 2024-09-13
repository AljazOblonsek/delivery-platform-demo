namespace delivery_service_api.Contracts.Notifications;

public class UpdatePackageNotification
{
    public string Type { get; } = "update-package";
    public PackageNotification Package { get; set; }
}
