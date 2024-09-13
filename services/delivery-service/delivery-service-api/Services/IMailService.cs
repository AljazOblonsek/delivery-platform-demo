using delivery_service_api.Contracts.Mails;

namespace delivery_service_api.Services;

public interface IMailService
{
    Task SendTrackPackageMailAsync(TrackPackageMail trackPackageMail);
}
