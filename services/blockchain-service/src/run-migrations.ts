import { join } from 'path';
import { migrate } from 'drizzle-orm/node-postgres/migrator';
import { logger } from './config/logger';
import { DatabaseProvider } from './providers/database.provider';

const runMigrations = async (): Promise<void> => {
  const client = await DatabaseProvider.getInstance().getClient();
  const database = await DatabaseProvider.getInstance().getDatabase();

  await migrate(database, { migrationsFolder: join(process.cwd(), 'migrations') });
  logger.info('Successfully ran migrations.');

  client.end();
};

runMigrations();
