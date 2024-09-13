import { faker } from '@faker-js/faker';
import { WalletEntity } from '../entities/wallet.entity';

export const generateWalletEntityStub = (data: Partial<WalletEntity> = {}): WalletEntity => {
  const defaultOptions: WalletEntity = {
    id: faker.number.int(),
    address: faker.finance.ethereumAddress(),
    encryptedPrivateKey: faker.string.uuid(),
    companyId: faker.number.int(),
  };

  return { ...defaultOptions, ...data };
};
