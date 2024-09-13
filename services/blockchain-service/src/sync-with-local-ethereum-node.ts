import { setTimeout } from 'node:timers/promises';
import { asc, eq } from 'drizzle-orm';
import { ContractTransactionResponse } from 'ethers';
import { env } from './config/env';
import { logger } from './config/logger';
import { trackNumberMetaEntity } from './entities/track-number-meta.entity';
import { transactionEntity } from './entities/transaction.entity';
import { walletEntity } from './entities/wallet.entity';
import { PackagePayloadType } from './enums/package-payload-type.enum';
import { DatabaseProvider } from './providers/database.provider';
import { decrypt } from './utils/encryption';
import { getContract, getContractWithWallet } from './utils/ethereum';

/**
 * The local ethereum node from hardhat does not support persistence.
 * Hardhat dockerfile takes care of deploying the contract and adding initial wallets to it - but it does not know anything about our past actions to it.
 * This script goes thru the database, traverses all transactions in order and add them to the contract - syncing the database and smart contract.
 */
const syncWithLocalEthereumNode = async (): Promise<void> => {
  logger.info('Started sync of database with local ethereum node.');

  if (env.ETHEREUM_PROVIDER !== 'localhost') {
    logger.warn(
      `External ethereum node is used (${env.ETHEREUM_PROVIDER}) - not local. Exiting sync process.`
    );
    return;
  }

  const client = await DatabaseProvider.getInstance().getClient();
  const database = await DatabaseProvider.getInstance().getDatabase();

  const wallets = await database.select().from(walletEntity);

  if (wallets.length <= 0) {
    logger.info('No wallets found in database. Exiting sync process - not needed.');
    await client.end();
    return;
  }

  const contract = getContract();

  let isLocalEthereumNodeReady = false;

  while (!isLocalEthereumNodeReady) {
    try {
      await contract.deliveryCompanyAddresses(wallets.length - 1);
      isLocalEthereumNodeReady = true;
    } catch {
      logger.info(
        'The smart contract on local ethereum node is still not ready... Retrying sync in 3 seconds.'
      );
    }

    await setTimeout(3000);
  }

  logger.info('Smart contract is ready. Starting with sync process.');

  const trackNumberMetas = await database.select().from(trackNumberMetaEntity);

  for (const trackNumberMeta of trackNumberMetas) {
    try {
      await contract.getPackage(trackNumberMeta.trackNumber);
    } catch (e: unknown) {
      const error = e as Error;

      // When this error occurrs local ethereum node is out of sync with our database for this package
      if (error.message.includes('Package with given track number not found')) {
        logger.info(
          `Package with track number ${trackNumberMeta.trackNumber} is not synced... Syncing now.`
        );

        const transactionsForCurrentPackage = await database
          .select()
          .from(transactionEntity)
          .innerJoin(walletEntity, eq(transactionEntity.walletId, walletEntity.id))
          .orderBy(asc(transactionEntity.createdAt))
          .where(eq(transactionEntity.trackNumberMetaId, trackNumberMeta.id));

        for (const transaction of transactionsForCurrentPackage) {
          if (transaction.transactions.packagePayloadType == PackagePayloadType.AddPackage) {
            const contractWithWallet = getContractWithWallet(
              decrypt({
                data: transaction.wallets.encryptedPrivateKey,
                secretKey: env.WALLET_PRIVATE_KEY_ENCRYPTION_SECRET_KEY,
              })
            );

            const addPackageResponse: ContractTransactionResponse =
              await contractWithWallet.addPackage({
                trackNumber: trackNumberMeta.trackNumber,
                encryptedInformation: transaction.transactions.encryptedInformation,
              });

            await database
              .update(transactionEntity)
              .set({ txId: addPackageResponse.hash })
              .where(eq(transactionEntity.id, transaction.transactions.id));
          } else {
            const contractWithWallet = getContractWithWallet(
              decrypt({
                data: transaction.wallets.encryptedPrivateKey,
                secretKey: env.WALLET_PRIVATE_KEY_ENCRYPTION_SECRET_KEY,
              })
            );

            const updatePackageResponse: ContractTransactionResponse =
              await contractWithWallet.updatePackage({
                trackNumber: trackNumberMeta.trackNumber,
                encryptedInformation: transaction.transactions.encryptedInformation,
              });

            await database
              .update(transactionEntity)
              .set({ txId: updatePackageResponse.hash })
              .where(eq(transactionEntity.id, transaction.transactions.id));
          }
        }

        logger.info(
          `Package with track number ${trackNumberMeta.trackNumber} successfully synced.`
        );
      }
    }
  }

  await client.end();

  logger.info('Sync with local ethereum node done.');
};

syncWithLocalEthereumNode();
