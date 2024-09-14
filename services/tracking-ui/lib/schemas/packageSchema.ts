import { z } from 'zod';
import { PackageHistoryType } from '@/lib/schemas/packageHistory.schema';

export const packageSchema = z.object({
  trackNumber: z.string(),
  deliveryCompanyAddress: z.string(),
  encryptedInformation: z.array(z.string()),
});

export type PackageType = Omit<z.infer<typeof packageSchema>, 'encryptedInformation'>;

export type Package = PackageType & {
  history: PackageHistoryType;
};
