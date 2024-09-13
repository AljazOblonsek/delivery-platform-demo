import { Button, ModalBody, ModalCloseButton, ModalHeader, Stack, Text } from '@chakra-ui/react';
import { PackageAction } from '../../enums/package-action.enum';
import { PackageActionsModalScreenProps } from '../../types/package-actions-modal-screen-props.type';

export const RegisterPackageModalScreen = ({
  fetchedPackage,
  onActionClick,
  onCancelClick,
  isLoading,
}: PackageActionsModalScreenProps) => (
  <>
    <ModalHeader>Register Package</ModalHeader>
    <ModalCloseButton />
    <ModalBody paddingBottom="1rem">
      <Text data-testid="modal-body">
        Are you sure you want to register package{' '}
        <Text fontWeight="bold" as="span">
          {fetchedPackage.title ?? 'N/A'}
        </Text>{' '}
        for your delivery company and save it in warehouse?
      </Text>
      <Stack spacing={2} marginTop="1rem">
        <Button
          onClick={() => {
            onActionClick(PackageAction.AddToWarehouse);
          }}
          isLoading={isLoading}
          data-testid="register-button"
        >
          Register
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
