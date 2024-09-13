using System.Runtime.Serialization;
using delivery_service_api.Enums;

namespace delivery_service_api.Extensions;

public static class PackageStatusExtensions
{
    public static string ToEnumString(this PackageStatus packageStatus)
    {
        var attributes = (EnumMemberAttribute[])packageStatus
           .GetType()
           .GetField(packageStatus.ToString())
           .GetCustomAttributes(typeof(EnumMemberAttribute), false);
        return attributes.Length > 0 ? attributes[0].Value.ToString() : string.Empty;
    }
}
