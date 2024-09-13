import { faker } from '@faker-js/faker';
import { TransactionEntity } from '../entities/transaction.entity';

export const generateTransactionEntityStub = (
  data: Partial<TransactionEntity> = {}
): TransactionEntity => {
  const defaultOptions: TransactionEntity = {
    id: faker.number.int(),
    txId: faker.string.uuid(),
    createdAt: faker.date.recent(),
    walletId: faker.number.int(),
  };

  return { ...defaultOptions, ...data };
};
