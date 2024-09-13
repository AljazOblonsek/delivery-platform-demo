import { relations } from 'drizzle-orm';
import { integer, pgTable, serial, text, varchar } from 'drizzle-orm/pg-core';
import { transactionEntity } from './transaction.entity';

export const trackNumberMetaEntity = pgTable('track_number_metas', {
  id: serial('id').primaryKey(),
  trackNumber: varchar('track_number', { length: 10 }).unique().notNull(),
  encryptedPrivateKey: text('encrypted_private_key').notNull(),
  companyId: integer('company_id').notNull(),
});

export const trackNumberMetaEntityRelations = relations(trackNumberMetaEntity, ({ many }) => ({
  transactions: many(transactionEntity),
}));

export type TrackNumberMetaEntity = typeof trackNumberMetaEntity.$inferSelect;
export type NewTrackNumberMetaEntity = typeof trackNumberMetaEntity.$inferInsert;
