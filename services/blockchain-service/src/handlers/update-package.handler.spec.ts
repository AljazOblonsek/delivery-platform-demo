import { faker } from '@faker-js/faker';
import { beforeAll, beforeEach, describe, expect, it, mock, spyOn } from 'bun:test';
import { Contract } from 'ethers';
import { logger } from '../config/logger';
import * as trackNumberMetaRepository from '../repositories/track-number-meta.repository';
import * as transactionRepository from '../repositories/transaction.repository';
import * as walletRepository from '../repositories/wallet.repository';
import { generateTrackNumberMetaEntityStub } from '../stubs/track-number-meta-entity.stub';
import { generateTransactionEntityStub } from '../stubs/transaction-entity.stub';
import { generateUpdatePackageSchemaStub } from '../stubs/update-package-schema.stub';
import { generateWalletEntityStub } from '../stubs/wallet-entity.stub';
import * as encryption from '../utils/encryption';
import * as ethereum from '../utils/ethereum';
import { updatePackageHandler } from './update-package.handler';

describe('updatePackageHandler', () => {
  beforeAll(() => {
    logger.level = 'silent';
  });

  beforeEach(() => {
    spyOn(encryption, 'decrypt').mockReturnValue(faker.string.uuid());
    spyOn(encryption, 'encrypt').mockReturnValue(faker.string.uuid());
  });

  it('should throw an error if company does not have a wallet', () => {
    const updatePackageStub = generateUpdatePackageSchemaStub();

    spyOn(walletRepository, 'getWalletByCompanyId').mockResolvedValueOnce(null);

    expect(updatePackageHandler(updatePackageStub)).rejects.toThrow(
      `Company with id ${updatePackageStub.package.companyId} does not have a wallet.`
    );
  });

  it('should throw an error if track number meta is not found by track number', () => {
    const updatePackageStub = generateUpdatePackageSchemaStub();

    spyOn(walletRepository, 'getWalletByCompanyId').mockResolvedValueOnce(
      generateWalletEntityStub()
    );
    spyOn(trackNumberMetaRepository, 'getTrackNumberMetaByTrackNumber').mockResolvedValueOnce(null);

    expect(updatePackageHandler(updatePackageStub)).rejects.toThrow(
      `Track number meta with ${updatePackageStub.package.trackNumber} identifier does not exist.`
    );
  });

  it('should call `updatePackage` method on smart contract', async () => {
    const updatePackageStub = generateUpdatePackageSchemaStub();
    const trackNumberMetaEntityStub = generateTrackNumberMetaEntityStub({
      trackNumber: updatePackageStub.package.trackNumber,
    });

    const updatePackageMock = mock().mockResolvedValue({ hash: faker.string.uuid() });

    spyOn(walletRepository, 'getWalletByCompanyId').mockResolvedValueOnce(
      generateWalletEntityStub()
    );
    spyOn(trackNumberMetaRepository, 'getTrackNumberMetaByTrackNumber').mockResolvedValueOnce(
      trackNumberMetaEntityStub
    );
    spyOn(ethereum, 'getContractWithWallet').mockReturnValueOnce({
      updatePackage: updatePackageMock,
    } as unknown as Contract);
    spyOn(transactionRepository, 'createTransaction').mockResolvedValueOnce(
      generateTransactionEntityStub()
    );

    await updatePackageHandler(updatePackageStub);

    expect(updatePackageMock).toHaveBeenCalledTimes(1);
    expect(updatePackageMock).toHaveBeenCalledWith({
      trackNumber: updatePackageStub.package.trackNumber,
      encryptedInformation: expect.any(String),
    });
  });

  it('should log an error if transaction information could not be saved to the database', async () => {
    const updatePackageStub = generateUpdatePackageSchemaStub();
    const trackNumberMetaEntityStub = generateTrackNumberMetaEntityStub({
      trackNumber: updatePackageStub.package.trackNumber,
    });

    const updatePackageMock = mock().mockResolvedValue({ hash: faker.string.uuid() });
    const errorSpy = spyOn(logger, 'error');

    spyOn(walletRepository, 'getWalletByCompanyId').mockResolvedValueOnce(
      generateWalletEntityStub()
    );
    spyOn(trackNumberMetaRepository, 'getTrackNumberMetaByTrackNumber').mockResolvedValueOnce(
      trackNumberMetaEntityStub
    );
    spyOn(ethereum, 'getContractWithWallet').mockReturnValueOnce({
      updatePackage: updatePackageMock,
    } as unknown as Contract);
    spyOn(transactionRepository, 'createTransaction').mockResolvedValueOnce(null);

    await updatePackageHandler(updatePackageStub);

    expect(updatePackageMock).toHaveBeenCalledTimes(1);
    expect(errorSpy).toHaveBeenCalledWith(
      'Broadcasted transaction to ethereum network but could not save it to database.'
    );
  });
});
