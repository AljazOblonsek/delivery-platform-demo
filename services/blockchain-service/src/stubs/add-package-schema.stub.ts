import { faker } from '@faker-js/faker';
import { PackagePayloadType } from '../enums/package-payload-type.enum';
import { PackageStatus } from '../enums/package-status.enum';
import { AddPackageSchema } from '../schemas/add-package.schema';

export const generateAddPackageSchemaStub = (
  data: Partial<AddPackageSchema> = {}
): AddPackageSchema => {
  const defaultOptions: AddPackageSchema = {
    type: PackagePayloadType.AddPackage,
    encryptedPrivateKey: faker.string.uuid(),
    package: {
      id: faker.number.int(),
      trackNumber: faker.string.alphanumeric(10),
      title: faker.commerce.productName(),
      status: faker.helpers.enumValue(PackageStatus),
      updatedAt: faker.date.recent().toISOString(),
      companyName: faker.company.name(),
      companyId: faker.number.int(),
    },
  };

  return { ...defaultOptions, ...data };
};
