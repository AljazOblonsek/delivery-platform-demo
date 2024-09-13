import { PackageAction } from '../enums/package-action.enum';
import { FetchedPackage } from './fetched-package.type';

export type PackageActionsModalScreenProps = {
  fetchedPackage: FetchedPackage;
  onActionClick: (packageAction: PackageAction) => void;
  onCancelClick: () => void;
  isLoading: boolean;
};
