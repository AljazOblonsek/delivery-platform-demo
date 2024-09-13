import { count } from 'drizzle-orm';
import { env } from './config/env';
import { logger } from './config/logger';
import { walletEntity } from './entities/wallet.entity';
import { DatabaseProvider } from './providers/database.provider';
import { encrypt } from './utils/encryption';
import { getWallet } from './utils/ethereum';

const setupForLocalDevelopment = async (): Promise<void> => {
  const walletsJson = process.env.LOCAL_DEVELOPMENT_SETUP_DATA;

  if (!walletsJson) {
    logger.error(
      'You must provide contents of the `/scripts/startup/local-development-setup-data.json` as `LOCAL_DEVELOPMENT_SETUP_DATA` environment variable when running this file.'
    );
    return;
  }

  const wallets = JSON.parse(walletsJson) as {
    deliveryWalletOnePrivateKey: string;
    deliveryWalletTwoPrivateKey: string;
  };

  const client = await DatabaseProvider.getInstance().getClient();
  const database = await DatabaseProvider.getInstance().getDatabase();

  const walletsCount = await database.select({ count: count() }).from(walletEntity);

  if (walletsCount[0].count > 0) {
    logger.info('Blockchain service is already set up for development.');
    await client.end();
    return;
  }

  const deliveryWallets = [
    getWallet(wallets.deliveryWalletOnePrivateKey),
    getWallet(wallets.deliveryWalletTwoPrivateKey),
  ];

  // Add wallets in db
  for (let i = 0; i < deliveryWallets.length; i++) {
    await database
      .insert(walletEntity)
      .values({
        address: deliveryWallets[i].address,
        encryptedPrivateKey: encrypt({
          data: deliveryWallets[i].privateKey,
          secretKey: env.WALLET_PRIVATE_KEY_ENCRYPTION_SECRET_KEY,
        }),
        companyId: i + 1,
      })
      .returning();

    logger.info(`Successfully added wallet for company id ${i + 1} to the database.`);
  }

  await client.end();

  logger.info('Successfuly set up blockchain service for local development.');
};

setupForLocalDevelopment();
