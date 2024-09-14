import { getContract } from '@/lib/ethers/getContract';
import { packageHistorySchema } from '@/lib/schemas/packageHistory.schema';
import { Package, packageSchema } from '@/lib/schemas/packageSchema';
import { decrypt } from '@/lib/utils/encryption';

export const getPackage = async (trackingNumber: string, secretKey: string) => {
  const contract = getContract();
  try {
    const packageResponse = await contract.getPackage(trackingNumber);
    const parsedPackageResponse = packageSchema.safeParse(packageResponse.toObject());

    if (!parsedPackageResponse.success) {
      throw new Error("There's been an error while parsing response.");
    }

    const decryptedHistory: string[] = [];

    for (const s of parsedPackageResponse.data.encryptedInformation) {
      decryptedHistory.push(JSON.parse(decrypt({ data: s, secretKey })));
    }

    const parsedHistory = packageHistorySchema.safeParse(decryptedHistory);

    if (!parsedHistory.success) {
      throw new Error("There's been an error while reading package history.");
    }

    const packageData: Package = {
      trackNumber: parsedPackageResponse.data.trackNumber,
      deliveryCompanyAddress: parsedPackageResponse.data.deliveryCompanyAddress,
      history: parsedHistory.data,
    };

    return packageData;
  } catch (e) {
    throw new Error(
      "There's been an error with retrieving your package data. Please check your inputs."
    );
  }
};
