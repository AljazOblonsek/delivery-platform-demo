import { Modal } from '@chakra-ui/react';
import { cleanup, fireEvent, render, screen, waitFor } from '@testing-library/react';
import { afterEach, describe, expect, it, vi } from 'vitest';
import { PackageAction } from '../../enums/package-action.enum';
import { PickupPackageModalScreen } from './PickupPackageModalScreen';

describe('PickupPackageModalScreen', () => {
  afterEach(() => {
    cleanup();
  });

  it('should render `N/A` in description if package title or track number is falsy', () => {
    render(
      <Modal isOpen={true} onClose={vi.fn()}>
        <PickupPackageModalScreen
          fetchedPackage={{ id: 1 }}
          onActionClick={vi.fn()}
          onCancelClick={vi.fn()}
          isLoading={false}
        />
      </Modal>
    );

    expect(screen.getByTestId('modal-body')).toHaveTextContent(
      'Are you sure you want to pickup package N/A (N/A) for delivery?'
    );
  });

  it('should render package title and track number in description if they are provided', () => {
    const packageTitleStub = 'iPhone 11';
    const packageTrackNumberStub = 'TN007';

    render(
      <Modal isOpen={true} onClose={vi.fn()}>
        <PickupPackageModalScreen
          fetchedPackage={{ id: 1, title: packageTitleStub, trackNumber: packageTrackNumberStub }}
          onActionClick={vi.fn()}
          onCancelClick={vi.fn()}
          isLoading={false}
        />
      </Modal>
    );

    expect(screen.getByTestId('modal-body')).toHaveTextContent(
      `Are you sure you want to pickup package ${packageTitleStub} (${packageTrackNumberStub}) for delivery?`
    );
  });

  it('should trigger `onActionClick` function with action `StartDelivery` on pickup button click', async () => {
    const onActionClickSpy = vi.fn();

    render(
      <Modal isOpen={true} onClose={vi.fn()}>
        <PickupPackageModalScreen
          fetchedPackage={{ id: 1 }}
          onActionClick={onActionClickSpy}
          onCancelClick={vi.fn()}
          isLoading={false}
        />
      </Modal>
    );

    fireEvent.click(screen.getByTestId('pickup-button'));

    await waitFor(() => {
      expect(onActionClickSpy).toHaveBeenCalledTimes(1);
      expect(onActionClickSpy).toHaveBeenCalledWith(PackageAction.StartDelivery);
    });
  });

  it('should trigger `onCancelClick` function on cancel button click', async () => {
    const onCancelClickSpy = vi.fn();

    render(
      <Modal isOpen={true} onClose={vi.fn()}>
        <PickupPackageModalScreen
          fetchedPackage={{ id: 1 }}
          onActionClick={vi.fn()}
          onCancelClick={onCancelClickSpy}
          isLoading={false}
        />
      </Modal>
    );

    fireEvent.click(screen.getByTestId('cancel-button'));

    await waitFor(() => {
      expect(onCancelClickSpy).toHaveBeenCalledTimes(1);
    });
  });
});
