namespace delivery_service_api.Services;

public interface IRabbitMQService
{
    void SendMessage<T>(string queueName, T message);
}
