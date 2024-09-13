import { ContractTransactionResponse } from 'ethers';
import { env } from '../config/env';
import { logger } from '../config/logger';
import { getTrackNumberMetaByTrackNumber } from '../repositories/track-number-meta.repository';
import { createTransaction } from '../repositories/transaction.repository';
import { getWalletByCompanyId } from '../repositories/wallet.repository';
import { updatePackageSchema } from '../schemas/update-package.schema';
import { decrypt, encrypt } from '../utils/encryption';
import { getContractWithWallet } from '../utils/ethereum';

export const updatePackageHandler = async (payload: unknown): Promise<void> => {
  logger.info({ payload }, 'Update package flow started.');

  const parsedPayload = updatePackageSchema.parse(payload);

  const wallet = await getWalletByCompanyId(parsedPayload.package.companyId);

  if (!wallet) {
    logger.error(`Company with id ${parsedPayload.package.companyId} does not have a wallet.`);
    throw new Error(`Company with id ${parsedPayload.package.companyId} does not have a wallet.`);
  }

  const trackNumberMeta = await getTrackNumberMetaByTrackNumber(parsedPayload.package.trackNumber);

  if (!trackNumberMeta) {
    logger.error(
      `Track number meta with ${parsedPayload.package.trackNumber} identifier does not exist.`
    );
    throw new Error(
      `Track number meta with ${parsedPayload.package.trackNumber} identifier does not exist.`
    );
  }

  const walletPrivateKey = decrypt({
    data: wallet.encryptedPrivateKey,
    secretKey: env.WALLET_PRIVATE_KEY_ENCRYPTION_SECRET_KEY,
  });
  const packagePrivateKey = decrypt({
    data: trackNumberMeta.encryptedPrivateKey,
    secretKey: env.TRACK_NUMBER_META_PRIVATE_KEY_ENCRYPTION_SECRET_KEY,
  });

  const contract = getContractWithWallet(walletPrivateKey);

  const encryptedInformation = encrypt({
    data: JSON.stringify(parsedPayload.package),
    secretKey: packagePrivateKey,
  });

  const updatePackageResponse: ContractTransactionResponse = await contract.updatePackage({
    trackNumber: trackNumberMeta.trackNumber,
    encryptedInformation,
  });

  const transaction = await createTransaction({
    txId: updatePackageResponse.hash,
    packagePayloadType: parsedPayload.type,
    encryptedInformation,
    createdAt: new Date(),
    walletId: wallet.id,
    trackNumberMetaId: trackNumberMeta.id,
  });

  if (!transaction) {
    logger.error('Broadcasted transaction to ethereum network but could not save it to database.');
  }

  logger.info({ parsedPayload }, 'Update package flow successfully processed.');
};
