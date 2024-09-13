import { Button, ModalBody, ModalCloseButton, ModalHeader, Stack, Text } from '@chakra-ui/react';
import { PackageAction } from '../../enums/package-action.enum';
import { PackageActionsModalScreenProps } from '../../types/package-actions-modal-screen-props.type';

export const DeliverPackageModalScreen = ({
  fetchedPackage,
  onActionClick,
  onCancelClick,
  isLoading,
}: PackageActionsModalScreenProps) => (
  <>
    <ModalHeader>Deliver Package</ModalHeader>
    <ModalCloseButton />
    <ModalBody paddingBottom="1rem">
      <Text data-testid="modal-body">
        Do you want to mark package{' '}
        <Text fontWeight="bold" as="span">
          {fetchedPackage.title ?? 'N/A'} ({fetchedPackage.trackNumber ?? 'N/A'})
        </Text>{' '}
        as delivered or return it to warehouse?
      </Text>
      <Stack spacing={2} marginTop="1rem">
        <Button
          onClick={() => {
            onActionClick(PackageAction.Deliver);
          }}
          isDisabled={isLoading}
          data-testid="deliver-button"
        >
          Deliver
        </Button>
        <Button
          onClick={() => {
            onActionClick(PackageAction.ReturnToWarehouse);
          }}
          isDisabled={isLoading}
          data-testid="return-to-warehouse-button"
        >
          Return to Warehouse
        </Button>
        <Button
          variant="outline"
          onClick={onCancelClick}
          isDisabled={isLoading}
          data-testid="cancel-button"
        >
          Cancel
        </Button>
      </Stack>
    </ModalBody>
  </>
);
