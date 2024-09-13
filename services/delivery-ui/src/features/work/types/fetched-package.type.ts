import { PackageStatus } from '../enums/package-status.enum';

export type FetchedPackage = {
  id: number;
  trackNumber?: string;
  title?: string;
  status?: PackageStatus;
  createdAt?: string;
  updatedAt?: string;
};
