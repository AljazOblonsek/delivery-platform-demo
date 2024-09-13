import { z } from 'zod';
import { PackagePayloadType } from '../enums/package-payload-type.enum';
import { packageSchema } from './package.schema';

export const updatePackageSchema = z.object({
  type: z.literal(PackagePayloadType.UpdatePackage),
  package: packageSchema,
});

export type UpdatePackageSchema = z.infer<typeof updatePackageSchema>;
