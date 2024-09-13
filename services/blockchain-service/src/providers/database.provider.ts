import { NodePgDatabase, drizzle } from 'drizzle-orm/node-postgres';
import { Client } from 'pg';
import { env } from '../config/env';

export class DatabaseProvider {
  private static instance: DatabaseProvider;
  private client: Client | null = null;
  private database: NodePgDatabase | null = null;

  static getInstance(): DatabaseProvider {
    if (!this.instance) {
      this.instance = new DatabaseProvider();
    }

    return this.instance;
  }

  async getClient(): Promise<Client> {
    if (!this.client) {
      this.client = new Client({
        host: env.POSTGRES_HOST,
        port: env.POSTGRES_PORT,
        user: env.POSTGRES_USER,
        password: env.POSTGRES_PASSWORD,
        database: env.POSTGRES_DB,
      });
      await this.client.connect();
    }

    return this.client;
  }

  async getDatabase(): Promise<NodePgDatabase> {
    if (!this.client) {
      this.client = new Client({
        host: env.POSTGRES_HOST,
        port: env.POSTGRES_PORT,
        user: env.POSTGRES_USER,
        password: env.POSTGRES_PASSWORD,
        database: env.POSTGRES_DB,
      });
      await this.client.connect();
    }

    if (!this.database) {
      this.database = drizzle(this.client);
    }

    return this.database;
  }
}
