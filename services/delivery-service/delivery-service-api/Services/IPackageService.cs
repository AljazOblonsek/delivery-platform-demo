using delivery_service_api.Contracts.Requests;

namespace delivery_service_api.Services;

public interface IPackageService
{
    public Task<IResult> GetPackageById(int packageId);
    public Task<IResult> ScanPackage(ScanPackageRequest scanPackageRequest);
}
