import { ContractTransactionResponse } from 'ethers';
import { env } from '../config/env';
import { logger } from '../config/logger';
import {
  createTrackNumberMeta,
  getTrackNumberMetaByTrackNumber,
} from '../repositories/track-number-meta.repository';
import { createTransaction } from '../repositories/transaction.repository';
import { getWalletByCompanyId } from '../repositories/wallet.repository';
import { addPackageSchema } from '../schemas/add-package.schema';
import { decrypt, encrypt } from '../utils/encryption';
import { getContractWithWallet } from '../utils/ethereum';

export const addPackageHandler = async (payload: unknown): Promise<void> => {
  logger.info({ payload }, 'Add package flow started.');

  const parsedPayload = addPackageSchema.parse(payload);

  const wallet = await getWalletByCompanyId(parsedPayload.package.companyId);

  if (!wallet) {
    logger.error(`Company with id ${parsedPayload.package.companyId} does not have a wallet.`);
    throw new Error(`Company with id ${parsedPayload.package.companyId} does not have a wallet.`);
  }

  const trackNumberMeta = await getTrackNumberMetaByTrackNumber(parsedPayload.package.trackNumber);

  if (trackNumberMeta) {
    logger.error(
      `Track number meta with ${parsedPayload.package.trackNumber} identifier already exists.`
    );
    throw new Error(
      `Track number meta with ${parsedPayload.package.trackNumber} identifier already exists.`
    );
  }

  const newTrackNumberMeta = await createTrackNumberMeta({
    trackNumber: parsedPayload.package.trackNumber,
    encryptedPrivateKey: parsedPayload.encryptedPrivateKey,
    companyId: parsedPayload.package.companyId,
  });

  if (!newTrackNumberMeta) {
    logger.error('New track number meta could not be created.');
    throw new Error('New track number meta could not be created.');
  }

  const walletPrivateKey = decrypt({
    data: wallet.encryptedPrivateKey,
    secretKey: env.WALLET_PRIVATE_KEY_ENCRYPTION_SECRET_KEY,
  });
  const packagePrivateKey = decrypt({
    data: parsedPayload.encryptedPrivateKey,
    secretKey: env.TRACK_NUMBER_META_PRIVATE_KEY_ENCRYPTION_SECRET_KEY,
  });

  const contract = getContractWithWallet(walletPrivateKey);

  const encryptedInformation = encrypt({
    data: JSON.stringify(parsedPayload.package),
    secretKey: packagePrivateKey,
  });

  const addPackageResponse: ContractTransactionResponse = await contract.addPackage({
    trackNumber: parsedPayload.package.trackNumber,
    encryptedInformation,
  });

  const transaction = await createTransaction({
    txId: addPackageResponse.hash,
    packagePayloadType: parsedPayload.type,
    encryptedInformation,
    createdAt: new Date(),
    walletId: wallet.id,
    trackNumberMetaId: newTrackNumberMeta.id,
  });

  if (!transaction) {
    logger.error('Broadcasted transaction to ethereum network but could not save it to database.');
  }

  logger.info({ parsedPayload }, 'Add package flow successfully processed.');
};
