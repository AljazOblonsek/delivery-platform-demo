import { RegisterPackageModalScreen } from '../components/package-actions-modal/RegisterPackageModalScreen';
import { PACKAGE_STATUS_TO_MODAL_SCREEN_MAP } from '../constants/package-status-to-modal-screen-map.constant';
import { PackageStatus } from '../enums/package-status.enum';
import { PackageActionsModalScreenProps } from '../types/package-actions-modal-screen-props.type';

export const getPackageActionsModalScreen = (
  packageStatus?: PackageStatus
): ((props: PackageActionsModalScreenProps) => JSX.Element) => {
  if (!packageStatus) {
    return RegisterPackageModalScreen;
  }

  return PACKAGE_STATUS_TO_MODAL_SCREEN_MAP[packageStatus];
};
