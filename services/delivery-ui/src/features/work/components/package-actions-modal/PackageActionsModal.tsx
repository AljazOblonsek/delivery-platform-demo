import { Modal, ModalContent, ModalOverlay, useBreakpoint, useToast } from '@chakra-ui/react';
import { useRef, useState } from 'react';
import { scanPackage } from '../../api/scan-package';
import { PackageAction } from '../../enums/package-action.enum';
import { FetchedPackage } from '../../types/fetched-package.type';
import { getPackageActionsModalScreen } from '../../utils/get-package-actions-modal-screen.util';
import { zIndex } from '@/core';

interface PackageActionsModalProps {
  fetchedPackage: FetchedPackage | null;
  setFetchedPackage: (fetchedPackage: FetchedPackage | null) => void;
}

export const PackageActionsModal = ({
  fetchedPackage,
  setFetchedPackage,
}: PackageActionsModalProps) => {
  const toast = useToast();
  const initialRef = useRef(null);
  const breakpoint = useBreakpoint();
  const [isLoading, setIsLoading] = useState(false);

  const modalSize = breakpoint === 'base' || breakpoint === 'sm' ? 'xs' : 'lg';

  const PackageModalScreen = getPackageActionsModalScreen(fetchedPackage?.status);

  const onActionClick = async (packageAction: PackageAction) => {
    if (!fetchedPackage) {
      return;
    }

    setIsLoading(true);

    const scanPackageResponse = await scanPackage(
      fetchedPackage.id,
      fetchedPackage.title ?? 'Unknown Package',
      packageAction
    );

    if (!scanPackageResponse.success) {
      toast({
        title: 'Error',
        description: scanPackageResponse.message,
        status: 'error',
        isClosable: true,
        position: 'top',
        duration: 2000,
      });
      setIsLoading(false);
      return;
    }

    toast({
      title: 'Success',
      description: 'Successfully updated package.',
      status: 'success',
      isClosable: true,
      position: 'top',
      duration: 2000,
    });
    setIsLoading(false);
    setFetchedPackage(null);
  };

  return (
    <Modal
      isOpen={!!fetchedPackage}
      onClose={() => {
        setFetchedPackage(null);
      }}
      initialFocusRef={initialRef}
      size={modalSize}
    >
      <ModalOverlay />
      <ModalContent
        data-testid="modal-content"
        containerProps={{
          zIndex: zIndex.modal,
        }}
      >
        {!!fetchedPackage && (
          <PackageModalScreen
            fetchedPackage={fetchedPackage}
            onActionClick={onActionClick}
            onCancelClick={() => {
              setFetchedPackage(null);
            }}
            isLoading={isLoading}
          />
        )}
      </ModalContent>
    </Modal>
  );
};
