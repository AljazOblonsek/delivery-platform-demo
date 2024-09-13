namespace delivery_service_api.Contracts.Notifications;

public class AddPackageNotification
{
    public string Type { get; } = "add-package";
    public string EncryptedPrivateKey { get; set; }
    public PackageNotification Package { get; set; }
}
