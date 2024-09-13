import { join } from 'path';
import { defineConfig } from 'drizzle-kit';
import { env } from './config/env';

export default defineConfig({
  schema: './src/entities/*.ts',
  out: join(process.cwd(), 'migrations'),
  dialect: 'postgresql',
  dbCredentials: {
    host: env.POSTGRES_HOST,
    port: env.POSTGRES_PORT,
    user: env.POSTGRES_USER,
    password: env.POSTGRES_PASSWORD,
    database: env.POSTGRES_DB,
  },
});
