import { relations } from 'drizzle-orm';
import { integer, pgTable, serial, text, varchar } from 'drizzle-orm/pg-core';
import { transactionEntity } from './transaction.entity';

export const walletEntity = pgTable('wallets', {
  id: serial('id').primaryKey(),
  address: varchar('address', { length: 42 }).unique().notNull(),
  encryptedPrivateKey: text('encrypted_private_key').notNull(),
  companyId: integer('company_id').unique().notNull(),
});

export const walletEntityRelations = relations(walletEntity, ({ many }) => ({
  transactions: many(transactionEntity),
}));

export type WalletEntity = typeof walletEntity.$inferSelect;
export type NewWalletEntity = typeof walletEntity.$inferInsert;
