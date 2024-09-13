import { z } from 'zod';
import { PackageStatus } from '../enums/package-status.enum';

export const packageSchema = z.object({
  id: z.number(),
  trackNumber: z.string(),
  title: z.string(),
  status: z.nativeEnum(PackageStatus),
  updatedAt: z.string().datetime(),
  companyName: z.string(),
  companyId: z.number(),
});

export type PackageSchema = z.infer<typeof packageSchema>;
