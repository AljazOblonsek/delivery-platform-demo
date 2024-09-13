using System.Diagnostics;
using System.Text;
using System.Text.Json;
using delivery_service_api.Constants;
using OpenTelemetry;
using OpenTelemetry.Context.Propagation;
using RabbitMQ.Client;

namespace delivery_service_api.Services;

public class RabbitMQService : IRabbitMQService
{
    private readonly ILogger<RabbitMQService> _logger;
    private static readonly ActivitySource _activitySource = new ActivitySource(nameof(IRabbitMQService));
    private static readonly TextMapPropagator _textMapPropagator = Propagators.DefaultTextMapPropagator;

    public RabbitMQService(ILogger<RabbitMQService> logger)
    {
        _logger = logger;
    }

    public void SendMessage<T>(string queueName, T message)
    {
        _logger.LogInformation("Attempting add to queue {queueName} with message content {message}.", queueName, JsonSerializer.Serialize(message));

        var connectionFactory = new ConnectionFactory()
        {
            HostName = Environment.GetEnvironmentVariable(EnvironmentConstants.RabbitmqHostname),
            Port = int.Parse(Environment.GetEnvironmentVariable(EnvironmentConstants.RabbitmqPort))
        };
        var connection = connectionFactory.CreateConnection();

        using (var channel = connection.CreateModel())
        {
            using var activity = _activitySource.StartActivity($"{queueName} send", ActivityKind.Producer);

            var properties = channel.CreateBasicProperties();

            ActivityContext activityContextToInject;

            if (activity != null)
            {
                activityContextToInject = activity.Context;
            }
            else if (Activity.Current != null)
            {
                activityContextToInject = Activity.Current.Context;
            }

            _textMapPropagator.Inject(new PropagationContext(activityContextToInject, Baggage.Current), properties, InjectTraceContextIntoBasicProperties);

            activity.SetTag("messaging.system", "rabbitmq");
            activity.SetTag("messaging.destination_kind", "queue");
            activity.SetTag("messaging.destination", "");
            activity.SetTag("messaging.rabbitmq.routing_key", queueName);

            var messageJson = JsonSerializer.Serialize(message, new JsonSerializerOptions
            {
                PropertyNamingPolicy = JsonNamingPolicy.CamelCase,
            });

            _logger.LogInformation("Sending message to queue {queueName} with payload {messageJson}.", queueName, messageJson);

            channel.BasicPublish("", queueName, false, properties, Encoding.UTF8.GetBytes(messageJson));
        }
    }

    private void InjectTraceContextIntoBasicProperties(IBasicProperties properties, string key, string value)
    {
        if (properties.Headers == null)
        {
            properties.Headers = new Dictionary<string, object>();
        }

        properties.Headers[key] = value;
    }
}
