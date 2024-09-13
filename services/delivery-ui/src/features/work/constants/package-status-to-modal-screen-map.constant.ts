import { DeliverPackageModalScreen } from '../components/package-actions-modal/DeliverPackageModalScreen';
import { PackageDeliveredModalScreen } from '../components/package-actions-modal/PackageDeliveredModalScreen';
import { PickupPackageModalScreen } from '../components/package-actions-modal/PickupPackageModalScreen';
import { PackageStatus } from '../enums/package-status.enum';

export const PACKAGE_STATUS_TO_MODAL_SCREEN_MAP = {
  [PackageStatus.InWarehouse]: PickupPackageModalScreen,
  [PackageStatus.InDelivery]: DeliverPackageModalScreen,
  [PackageStatus.Delivered]: PackageDeliveredModalScreen,
};
