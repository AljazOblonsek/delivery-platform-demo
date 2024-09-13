import { HardhatEthersSigner } from '@nomicfoundation/hardhat-ethers/src/signers';
import { ethers } from 'hardhat';
import { Delivery } from '../typechain-types';

describe('Delivery:SmartContract', () => {
  let owner: HardhatEthersSigner;
  let deliveryCompany1: HardhatEthersSigner;
  let deliveryCompany2: HardhatEthersSigner;
  let unknownUser: HardhatEthersSigner;
  let contract: Delivery;

  beforeEach(async () => {
    const signers = await ethers.getSigners();

    owner = signers[0] as unknown as HardhatEthersSigner;
    deliveryCompany1 = signers[1] as unknown as HardhatEthersSigner;
    deliveryCompany2 = signers[2] as unknown as HardhatEthersSigner;
    unknownUser = signers[3] as unknown as HardhatEthersSigner;

    const contractFactory = await ethers.getContractFactory('Delivery');
    contract = await contractFactory.deploy({ from: owner.address });
  });

  it('should be defined', () => {
    expect(owner).toBeDefined();
    expect(deliveryCompany1).toBeDefined();
    expect(deliveryCompany2).toBeDefined();
    expect(unknownUser).toBeDefined();
    expect(contract).toBeDefined();
  });

  describe('addDeliveryCompanyAddress', () => {
    it('should add address to array of delivery addresses', async () => {
      await contract.addDeliveryCompanyAddress(deliveryCompany1.address);

      expect(await contract.deliveryCompanyAddresses(0)).toBe(deliveryCompany1.address);
    });

    it('should throw an error if address is already in the delivery company array', async () => {
      await contract.addDeliveryCompanyAddress(deliveryCompany1.address);

      await expect(contract.addDeliveryCompanyAddress(deliveryCompany1.address)).rejects.toThrow(
        expect.objectContaining({
          message: expect.stringContaining('Address is already in the list'),
        })
      );
    });

    it('should throw an error if anyone else the owner is trying to add delivery company address', async () => {
      await expect(
        contract.connect(unknownUser).addDeliveryCompanyAddress(deliveryCompany1.address)
      ).rejects.toThrow(
        expect.objectContaining({
          message: expect.stringContaining('Not owner'),
        })
      );
    });
  });

  describe('getPackage', () => {
    it('should get package by track number', async () => {
      const packageDtoStub = {
        trackNumber: 'JDA007',
        encryptedInformation: 'some-encrypted-information',
      };

      await contract.addDeliveryCompanyAddress(deliveryCompany1.address);
      await contract.connect(deliveryCompany1).addPackage(packageDtoStub);

      const foundPackage = await contract.getPackage(packageDtoStub.trackNumber);

      expect(foundPackage.trackNumber).toBe(packageDtoStub.trackNumber);
    });

    it('should throw an error if package is not found by track number', async () => {
      const packageDtoStub = {
        trackNumber: 'JDA007',
        encryptedInformation: 'some-encrypted-information',
      };

      await expect(contract.getPackage(packageDtoStub.trackNumber)).rejects.toThrow(
        expect.objectContaining({
          message: expect.stringContaining('Package with given track number not found'),
        })
      );
    });
  });

  describe('addPackage', () => {
    it('should add package to array of packages', async () => {
      const packageDtoStub = {
        trackNumber: 'JDA007',
        encryptedInformation: 'some-encrypted-information',
      };

      await contract.addDeliveryCompanyAddress(deliveryCompany1.address);

      await contract.connect(deliveryCompany1).addPackage(packageDtoStub);

      const addedPackage = await contract.getPackage(packageDtoStub.trackNumber);

      expect(addedPackage.trackNumber).toBe(packageDtoStub.trackNumber);
      expect(addedPackage.deliveryCompanyAddress).toBe(deliveryCompany1.address);
      expect(addedPackage.encryptedInformation.length).toBe(1);
      expect(addedPackage.encryptedInformation[0]).toBe(packageDtoStub.encryptedInformation);
    });

    it('should throw an error if package with same track number already exists in the array', async () => {
      const packageDtoStub = {
        trackNumber: 'JDA007',
        encryptedInformation: 'some-encrypted-information',
      };

      await contract.addDeliveryCompanyAddress(deliveryCompany1.address);

      await contract.connect(deliveryCompany1).addPackage(packageDtoStub);
      await expect(contract.connect(deliveryCompany1).addPackage(packageDtoStub)).rejects.toThrow(
        expect.objectContaining({
          message: expect.stringContaining('Package with given track number already exists'),
        })
      );
    });

    it('should throw an error if the address trying to add package is not amongst the delivery copmpany addresses', async () => {
      await expect(
        contract.connect(deliveryCompany1).addPackage({
          trackNumber: 'JDA007',
          encryptedInformation: 'some-encrypted-information',
        })
      ).rejects.toThrow(
        expect.objectContaining({
          message: expect.stringContaining('Not a delivery company'),
        })
      );
    });
  });

  describe('updatePackage', () => {
    it('should update package in the array of packages', async () => {
      const packageDtoStub = {
        trackNumber: 'JDA007',
        encryptedInformation: 'some-encrypted-information',
      };

      await contract.addDeliveryCompanyAddress(deliveryCompany1.address);
      await contract.connect(deliveryCompany1).addPackage(packageDtoStub);

      const updatePackageDtoStub = {
        trackNumber: 'JDA007',
        encryptedInformation: 'another-encrypted-information',
      };

      await contract.connect(deliveryCompany1).updatePackage(updatePackageDtoStub);

      const updatedPackage = await contract.getPackage(packageDtoStub.trackNumber);

      expect(updatedPackage.trackNumber).toBe(packageDtoStub.trackNumber);
      expect(updatedPackage.deliveryCompanyAddress).toBe(deliveryCompany1.address);
      expect(updatedPackage.encryptedInformation.length).toBe(2);
      expect(updatedPackage.encryptedInformation[0]).toBe(packageDtoStub.encryptedInformation);
      expect(updatedPackage.encryptedInformation[1]).toBe(
        updatePackageDtoStub.encryptedInformation
      );
    });

    it('should throw an error if package with provided track number is not found in the array', async () => {
      const packageDtoStub = {
        trackNumber: 'JDA007',
        encryptedInformation: 'some-encrypted-information',
      };

      await contract.addDeliveryCompanyAddress(deliveryCompany1.address);

      await expect(
        contract.connect(deliveryCompany1).updatePackage(packageDtoStub)
      ).rejects.toThrow(
        expect.objectContaining({
          message: expect.stringContaining('Package with given track number not found'),
        })
      );
    });

    it('should throw an error if the address trying to update package is not its owner', async () => {
      const packageDtoStub = {
        trackNumber: 'JDA007',
        encryptedInformation: 'some-encrypted-information',
      };

      await contract.addDeliveryCompanyAddress(deliveryCompany1.address);
      await contract.addDeliveryCompanyAddress(deliveryCompany2.address);
      await contract.connect(deliveryCompany1).addPackage(packageDtoStub);

      const updatePackageDtoStub = {
        trackNumber: 'JDA007',
        encryptedInformation: 'another-encrypted-information',
      };

      await expect(
        contract.connect(deliveryCompany2).updatePackage(updatePackageDtoStub)
      ).rejects.toThrow(
        expect.objectContaining({
          message: expect.stringContaining('You are not allowed to update this package'),
        })
      );
    });

    it('should throw an error if the address trying to update package is not amongst the delivery copmpany addresses', async () => {
      await expect(
        contract.connect(deliveryCompany1).updatePackage({
          trackNumber: 'JDA007',
          encryptedInformation: 'some-encrypted-information',
        })
      ).rejects.toThrow(
        expect.objectContaining({
          message: expect.stringContaining('Not a delivery company'),
        })
      );
    });
  });
});
