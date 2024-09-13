using System.Text.Json.Serialization;

namespace delivery_service_api.Enums;

[JsonConverter(typeof(JsonStringEnumConverter))]
public enum PackageAction
{
    AddToWarehouse = 0,
    StartDelivery = 1,
    ReturnToWarehouse = 2,
    Deliver = 3
}
