import { z } from 'zod';

export const mockPackageSchema = z.object({
  id: z.coerce.number().positive(),
  title: z.string().min(3),
});

export type MockPackageSchema = z.infer<typeof mockPackageSchema>;
