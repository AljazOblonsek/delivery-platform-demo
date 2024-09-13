using delivery_service_api.Enums;

namespace delivery_service_api.Constants;

public static class PackageConstants
{
    public static readonly Dictionary<PackageStatus, List<PackageAction>> StatusToActionsMap = new Dictionary<PackageStatus, List<PackageAction>>()
    {
        {
            PackageStatus.InWarehouse,
            new List<PackageAction>() { PackageAction.StartDelivery }
        },
        {
            PackageStatus.InDelivery,
            new List<PackageAction>() { PackageAction.ReturnToWarehouse, PackageAction.Deliver }
        },
        {
            PackageStatus.Delivered,
            new List<PackageAction>() { }
        }
    };

    public static readonly Dictionary<PackageAction, PackageStatus> ActionToStatusMap = new Dictionary<PackageAction, PackageStatus>()
    {
        { PackageAction.AddToWarehouse, PackageStatus.InWarehouse },
        { PackageAction.StartDelivery, PackageStatus.InDelivery },
        { PackageAction.ReturnToWarehouse, PackageStatus.InWarehouse },
        { PackageAction.Deliver, PackageStatus.Delivered }
    };
}
