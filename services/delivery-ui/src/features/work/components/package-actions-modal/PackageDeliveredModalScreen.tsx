import { Button, ModalBody, ModalCloseButton, ModalHeader, Stack, Text } from '@chakra-ui/react';
import { PackageActionsModalScreenProps } from '../../types/package-actions-modal-screen-props.type';

export const PackageDeliveredModalScreen = ({
  fetchedPackage,
  onCancelClick,
}: PackageActionsModalScreenProps) => (
  <>
    <ModalHeader>Package Delivered</ModalHeader>
    <ModalCloseButton />
    <ModalBody paddingBottom="1rem">
      <Text data-testid="modal-body">
        Package{' '}
        <Text fontWeight="bold" as="span">
          {fetchedPackage.title ?? 'N/A'} ({fetchedPackage.trackNumber ?? 'N/A'})
        </Text>{' '}
        has been delivered.
      </Text>
      <Stack marginTop="1rem">
        <Button variant="outline" onClick={onCancelClick} data-testid="cancel-button">
          Close
        </Button>
      </Stack>
    </ModalBody>
  </>
);
