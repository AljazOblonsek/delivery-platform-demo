import { z } from 'zod';
import { emptyStringToUndefined } from '../utils/empty-string-to-undefined';

const envSchema = z.object({
  PORT: z.coerce.number().default(8001),
  ENVIRONMENT: z.preprocess(
    emptyStringToUndefined,
    z.enum(['development', 'production', 'test']).default('production')
  ),
  LOG_LEVEL: z.preprocess(emptyStringToUndefined, z.enum(['debug', 'info']).default('info')),

  POSTGRES_HOST: z.preprocess(emptyStringToUndefined, z.string()),
  POSTGRES_PORT: z.coerce.number(),
  POSTGRES_DB: z.preprocess(emptyStringToUndefined, z.string()),
  POSTGRES_USER: z.preprocess(emptyStringToUndefined, z.string()),
  POSTGRES_PASSWORD: z.preprocess(emptyStringToUndefined, z.string()),

  RABBITMQ_PROTOCOL: z.preprocess(
    emptyStringToUndefined,
    z.enum(['amqp', 'amqps']).default('amqp')
  ),
  RABBITMQ_HOSTNAME: z.preprocess(emptyStringToUndefined, z.string()),
  RABBITMQ_PORT: z.coerce.number(),

  PACKAGE_NOTIFICATION_QUEUE_NAME: z.preprocess(emptyStringToUndefined, z.string()),

  WALLET_PRIVATE_KEY_ENCRYPTION_SECRET_KEY: z.preprocess(emptyStringToUndefined, z.string()),
  TRACK_NUMBER_META_PRIVATE_KEY_ENCRYPTION_SECRET_KEY: z.preprocess(
    emptyStringToUndefined,
    z.string()
  ),

  ETHEREUM_PROVIDER: z.preprocess(
    emptyStringToUndefined,
    z.enum(['localhost', 'sepolia']).default('localhost')
  ),
  LOCAL_NODE_URL: z.preprocess(emptyStringToUndefined, z.string().optional()),
  INFURA_API_KEY: z.preprocess(emptyStringToUndefined, z.string().optional()),

  DEPLOYMENT_WALLET_PRIVATE_KEY: z.preprocess(emptyStringToUndefined, z.string()),
  CONTRACT_ADDRESS: z.preprocess(emptyStringToUndefined, z.string()),

  OTEL_EXPORT_URL: z.preprocess(emptyStringToUndefined, z.string().optional()),
});

const parsedEnv = envSchema.safeParse(process.env);

if (!parsedEnv.success) {
  throw new Error(
    `An error occurred during parsing env. Details: ${JSON.stringify(parsedEnv.error.issues)}.`
  );
}

export const env = Object.freeze(parsedEnv.data);
