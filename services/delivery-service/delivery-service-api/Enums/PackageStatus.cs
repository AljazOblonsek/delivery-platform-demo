using System.Runtime.Serialization;
using System.Text.Json.Serialization;

namespace delivery_service_api.Enums;

[JsonConverter(typeof(JsonStringEnumConverter))]
public enum PackageStatus
{
    [EnumMember(Value = "IN_WAREHOUSE")]
    InWarehouse = 0,
    [EnumMember(Value = "IN_DELIVERY")]
    InDelivery = 1,
    [EnumMember(Value = "DELIVERED")]
    Delivered = 2
}
