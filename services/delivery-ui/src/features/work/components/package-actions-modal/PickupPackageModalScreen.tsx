import { Button, ModalBody, ModalCloseButton, ModalHeader, Stack, Text } from '@chakra-ui/react';
import { PackageAction } from '../../enums/package-action.enum';
import { PackageActionsModalScreenProps } from '../../types/package-actions-modal-screen-props.type';

export const PickupPackageModalScreen = ({
  fetchedPackage,
  onActionClick,
  onCancelClick,
  isLoading,
}: PackageActionsModalScreenProps) => (
  <>
    <ModalHeader>Pickup Package</ModalHeader>
    <ModalCloseButton />
    <ModalBody paddingBottom="1rem">
      <Text data-testid="modal-body">
        Are you sure you want to pickup package{' '}
        <Text fontWeight="bold" as="span">
          {fetchedPackage.title ?? 'N/A'} ({fetchedPackage.trackNumber ?? 'N/A'})
        </Text>{' '}
        for delivery?
      </Text>
      <Stack spacing={2} marginTop="1rem">
        <Button
          onClick={() => {
            onActionClick(PackageAction.StartDelivery);
          }}
          isLoading={isLoading}
          data-testid="pickup-button"
        >
          Pickup
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
