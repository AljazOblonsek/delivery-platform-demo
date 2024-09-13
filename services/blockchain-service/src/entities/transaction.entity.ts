import { relations } from 'drizzle-orm';
import { integer, pgEnum, pgTable, serial, text, timestamp, varchar } from 'drizzle-orm/pg-core';
import { PackagePayloadType } from '../enums/package-payload-type.enum';
import { enumToPgEnum } from '../utils/enum-to-pg-enum';
import { trackNumberMetaEntity } from './track-number-meta.entity';
import { walletEntity } from './wallet.entity';

export const pgPackagePayloadType = pgEnum('PackagePayloadType', enumToPgEnum(PackagePayloadType));

export const transactionEntity = pgTable('transactions', {
  id: serial('id').primaryKey(),
  txId: varchar('tx_id', { length: 66 }).unique().notNull(),
  packagePayloadType: pgPackagePayloadType('package_payload_type').notNull(),
  encryptedInformation: text('encrypted_information').notNull(),
  createdAt: timestamp('created_at').notNull(),
  walletId: integer('wallet_id')
    .notNull()
    .references(() => walletEntity.id),
  trackNumberMetaId: integer('track_number_meta_id')
    .notNull()
    .references(() => trackNumberMetaEntity.id),
});

export const transactionEntityRelations = relations(transactionEntity, ({ one }) => ({
  wallet: one(walletEntity, {
    fields: [transactionEntity.walletId],
    references: [walletEntity.id],
  }),
  trackNumberMeta: one(trackNumberMetaEntity, {
    fields: [transactionEntity.trackNumberMetaId],
    references: [trackNumberMetaEntity.id],
  }),
}));

export type TransactionEntity = typeof transactionEntity.$inferSelect;
export type NewTransactionEntity = typeof transactionEntity.$inferInsert;
