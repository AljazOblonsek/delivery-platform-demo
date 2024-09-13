import { faker } from '@faker-js/faker';
import { beforeAll, beforeEach, describe, expect, it, mock, spyOn } from 'bun:test';
import { Contract } from 'ethers';
import { logger } from '../config/logger';
import * as trackNumberMetaRepository from '../repositories/track-number-meta.repository';
import * as transactionRepository from '../repositories/transaction.repository';
import * as walletRepository from '../repositories/wallet.repository';
import { generateAddPackageSchemaStub } from '../stubs/add-package-schema.stub';
import { generateTrackNumberMetaEntityStub } from '../stubs/track-number-meta-entity.stub';
import { generateTransactionEntityStub } from '../stubs/transaction-entity.stub';
import { generateWalletEntityStub } from '../stubs/wallet-entity.stub';
import * as encryption from '../utils/encryption';
import * as ethereum from '../utils/ethereum';
import { addPackageHandler } from './add-package.handler';

describe('addPackageHandler', () => {
  beforeAll(() => {
    logger.level = 'silent';
  });

  beforeEach(() => {
    spyOn(encryption, 'decrypt').mockReturnValue(faker.string.uuid());
    spyOn(encryption, 'encrypt').mockReturnValue(faker.string.uuid());
  });

  it('should throw an error if company does not have a wallet', () => {
    const addPackageStub = generateAddPackageSchemaStub();

    spyOn(walletRepository, 'getWalletByCompanyId').mockResolvedValueOnce(null);

    expect(addPackageHandler(addPackageStub)).rejects.toThrow(
      `Company with id ${addPackageStub.package.companyId} does not have a wallet.`
    );
  });

  it('should throw an error if track number meta already exits for this track number', () => {
    const addPackageStub = generateAddPackageSchemaStub();

    spyOn(walletRepository, 'getWalletByCompanyId').mockResolvedValueOnce(
      generateWalletEntityStub()
    );
    spyOn(trackNumberMetaRepository, 'getTrackNumberMetaByTrackNumber').mockResolvedValueOnce(
      generateTrackNumberMetaEntityStub({ trackNumber: addPackageStub.package.trackNumber })
    );

    expect(addPackageHandler(addPackageStub)).rejects.toThrow(
      `Track number meta with ${addPackageStub.package.trackNumber} identifier already exists.`
    );
  });

  it('should throw an error if new track number meta creation failed', () => {
    const addPackageStub = generateAddPackageSchemaStub();

    spyOn(walletRepository, 'getWalletByCompanyId').mockResolvedValueOnce(
      generateWalletEntityStub()
    );
    spyOn(trackNumberMetaRepository, 'getTrackNumberMetaByTrackNumber').mockResolvedValueOnce(null);
    spyOn(trackNumberMetaRepository, 'createTrackNumberMeta').mockResolvedValueOnce(null);

    expect(addPackageHandler(addPackageStub)).rejects.toThrow(
      'New track number meta could not be created.'
    );
  });

  it('should call `addPackage` method on smart contract', async () => {
    const addPackageStub = generateAddPackageSchemaStub();

    const addPackageMock = mock().mockResolvedValue({ hash: faker.string.uuid() });

    spyOn(walletRepository, 'getWalletByCompanyId').mockResolvedValueOnce(
      generateWalletEntityStub()
    );
    spyOn(trackNumberMetaRepository, 'getTrackNumberMetaByTrackNumber').mockResolvedValueOnce(null);
    spyOn(trackNumberMetaRepository, 'createTrackNumberMeta').mockResolvedValueOnce(
      generateTrackNumberMetaEntityStub()
    );
    spyOn(ethereum, 'getContractWithWallet').mockReturnValueOnce({
      addPackage: addPackageMock,
    } as unknown as Contract);
    spyOn(transactionRepository, 'createTransaction').mockResolvedValueOnce(
      generateTransactionEntityStub()
    );

    await addPackageHandler(addPackageStub);

    expect(addPackageMock).toHaveBeenCalledTimes(1);
    expect(addPackageMock).toHaveBeenCalledWith({
      trackNumber: addPackageStub.package.trackNumber,
      encryptedInformation: expect.any(String),
    });
  });

  it('should log an error if transaction information could not be saved to the database', async () => {
    const addPackageStub = generateAddPackageSchemaStub();

    const addPackageMock = mock().mockResolvedValue({ hash: faker.string.uuid() });
    const errorSpy = spyOn(logger, 'error');

    spyOn(walletRepository, 'getWalletByCompanyId').mockResolvedValueOnce(
      generateWalletEntityStub()
    );
    spyOn(trackNumberMetaRepository, 'getTrackNumberMetaByTrackNumber').mockResolvedValueOnce(null);
    spyOn(trackNumberMetaRepository, 'createTrackNumberMeta').mockResolvedValueOnce(
      generateTrackNumberMetaEntityStub()
    );
    spyOn(ethereum, 'getContractWithWallet').mockReturnValueOnce({
      addPackage: addPackageMock,
    } as unknown as Contract);
    spyOn(transactionRepository, 'createTransaction').mockResolvedValueOnce(null);

    await addPackageHandler(addPackageStub);
    expect(addPackageMock).toHaveBeenCalledTimes(1);
    expect(errorSpy).toHaveBeenCalledWith(
      'Broadcasted transaction to ethereum network but could not save it to database.'
    );
  });
});
