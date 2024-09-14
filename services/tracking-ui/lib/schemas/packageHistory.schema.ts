import { z } from 'zod';
import { PackageStatus } from '@/lib/enums/package-status.enum';

export const packageHistoryItemSchema = z.object({
  id: z.number(),
  trackNumber: z.string(),
  title: z.string(),
  status: z.nativeEnum(PackageStatus),
  updatedAt: z.string().datetime(),
  companyName: z.string(),
  companyId: z.number(),
});

export const packageHistorySchema = z.array(packageHistoryItemSchema);

export type PackageHistoryType = z.infer<typeof packageHistorySchema>;
