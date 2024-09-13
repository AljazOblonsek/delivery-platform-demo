import {
  NewTransactionEntity,
  TransactionEntity,
  transactionEntity,
} from '../entities/transaction.entity';
import { DatabaseProvider } from '../providers/database.provider';

export const createTransaction = async (
  data: NewTransactionEntity
): Promise<TransactionEntity | null> => {
  const database = await DatabaseProvider.getInstance().getDatabase();

  const transactions = await database.insert(transactionEntity).values(data).returning();

  const transaction = transactions.at(0);

  if (!transaction) {
    return null;
  }

  return transaction;
};
