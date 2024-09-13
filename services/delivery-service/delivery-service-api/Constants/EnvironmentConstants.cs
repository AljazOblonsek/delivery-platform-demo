namespace delivery_service_api.Constants;

public static class EnvironmentConstants
{
    public const string Environment = "ENVIRONMENT";
    public const string LogLevel = "LOG_LEVEL";

    public const string Port = "PORT";

    public const string PostgresHost = "POSTGRES_HOST";
    public const string PostgresPort = "POSTGRES_PORT";
    public const string PostgresDb = "POSTGRES_DB";
    public const string PostgresUser = "POSTGRES_USER";
    public const string PostgresPassword = "POSTGRES_PASSWORD";

    public const string SmtpHost = "SMTP_HOST";
    public const string SmtpPort = "SMTP_PORT";

    public const string RabbitmqHostname = "RABBITMQ_HOSTNAME";
    public const string RabbitmqPort = "RABBITMQ_PORT";

    public const string PackageNotificationQueueName = "PACKAGE_NOTIFICATION_QUEUE_NAME";

    public const string JwtSecretKey = "JWT_SECRET_KEY";
    public const string JwtExpiresInHours = "JWT_EXPIRES_IN_HOURS";

    public const string TrackNumberMetaPrivateKeyEncryptionSecretKey = "TRACK_NUMBER_META_PRIVATE_KEY_ENCRYPTION_SECRET_KEY";

    public const string TrackUiBaseUrl = "TRACK_UI_BASE_URL";
    public const string DeliveryUiOrigins = "DELIVERY_UI_ORIGINS";

    public const string OtelExportUrl = "OTEL_EXPORT_URL";

    public static readonly List<string> REQUIRED_ENVIRONMENT_VARIABLES = [
        Environment,
        LogLevel,
        Port,
        PostgresHost,
        PostgresPort,
        PostgresDb,
        PostgresUser,
        PostgresPassword,
        SmtpHost,
        SmtpPort,
        RabbitmqHostname,
        RabbitmqPort,
        PackageNotificationQueueName,
        JwtSecretKey,
        JwtExpiresInHours,
        TrackNumberMetaPrivateKeyEncryptionSecretKey,
        TrackUiBaseUrl,
        DeliveryUiOrigins
    ];

    public static readonly List<string> OPTIONAL_ENVIRONMENT_VARIABLES = [
        OtelExportUrl
    ];
}
