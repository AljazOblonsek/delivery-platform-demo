import { eq } from 'drizzle-orm';
import { WalletEntity, walletEntity } from '../entities/wallet.entity';
import { DatabaseProvider } from '../providers/database.provider';

export const getWalletByCompanyId = async (companyId: number): Promise<WalletEntity | null> => {
  const database = await DatabaseProvider.getInstance().getDatabase();

  const wallets = await database
    .select()
    .from(walletEntity)
    .where(eq(walletEntity.companyId, companyId));

  const wallet = wallets.at(0);

  if (!wallet) {
    return null;
  }

  return wallet;
};
