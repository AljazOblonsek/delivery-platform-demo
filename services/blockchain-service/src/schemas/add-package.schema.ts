import { z } from 'zod';
import { PackagePayloadType } from '../enums/package-payload-type.enum';
import { packageSchema } from './package.schema';

export const addPackageSchema = z.object({
  type: z.literal(PackagePayloadType.AddPackage),
  encryptedPrivateKey: z.string(),
  package: packageSchema,
});

export type AddPackageSchema = z.infer<typeof addPackageSchema>;
