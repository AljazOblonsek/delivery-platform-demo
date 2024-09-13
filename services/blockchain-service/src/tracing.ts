import { OTLPTraceExporter } from '@opentelemetry/exporter-trace-otlp-grpc';
import { AmqplibInstrumentation } from '@opentelemetry/instrumentation-amqplib';
import { NodeSDK } from '@opentelemetry/sdk-node';
import { SimpleSpanProcessor } from '@opentelemetry/sdk-trace-base';
import { env } from './config/env';

const oltpTraceExporter = new OTLPTraceExporter({
  url: env.OTEL_EXPORT_URL,
});

const openTelemetrySdk = new NodeSDK({
  serviceName: 'blockchain-service',
  spanProcessors: [new SimpleSpanProcessor(oltpTraceExporter)],
  instrumentations: [new AmqplibInstrumentation()],
});

openTelemetrySdk.start();
