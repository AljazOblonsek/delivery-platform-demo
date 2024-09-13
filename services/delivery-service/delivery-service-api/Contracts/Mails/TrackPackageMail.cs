namespace delivery_service_api.Contracts.Mails;

public class TrackPackageMail
{
    public string CompanyName { get; set; }
    public string PackageTitle { get; set; }
    public string TrackNumber { get; set; }
    public string TrackSecretKey { get; set; }

}
