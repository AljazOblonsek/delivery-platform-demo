import { Modal } from '@chakra-ui/react';
import { cleanup, fireEvent, render, screen, waitFor } from '@testing-library/react';
import { afterEach, describe, expect, it, vi } from 'vitest';
import { PackageAction } from '../../enums/package-action.enum';
import { DeliverPackageModalScreen } from './DeliverPackageModalScreen';

describe('DeliverPackageModalScreen', () => {
  afterEach(() => {
    cleanup();
  });

  it('should render `N/A` in description if package title or track number is falsy', () => {
    render(
      <Modal isOpen={true} onClose={vi.fn()}>
        <DeliverPackageModalScreen
          fetchedPackage={{ id: 1 }}
          onActionClick={vi.fn()}
          onCancelClick={vi.fn()}
          isLoading={false}
        />
      </Modal>
    );

    expect(screen.getByTestId('modal-body')).toHaveTextContent(
      'Do you want to mark package N/A (N/A) as delivered or return it to warehouse?'
    );
  });

  it('should render package title and track number in description if they are provided', () => {
    const packageTitleStub = 'iPhone 11';
    const packageTrackNumberStub = 'TN007';

    render(
      <Modal isOpen={true} onClose={vi.fn()}>
        <DeliverPackageModalScreen
          fetchedPackage={{ id: 1, title: packageTitleStub, trackNumber: packageTrackNumberStub }}
          onActionClick={vi.fn()}
          onCancelClick={vi.fn()}
          isLoading={false}
        />
      </Modal>
    );

    expect(screen.getByTestId('modal-body')).toHaveTextContent(
      `Do you want to mark package ${packageTitleStub} (${packageTrackNumberStub}) as delivered or return it to warehouse?`
    );
  });

  it('should trigger `onActionClick` function with action `Deliver` on deliver button click', async () => {
    const onActionClickSpy = vi.fn();

    render(
      <Modal isOpen={true} onClose={vi.fn()}>
        <DeliverPackageModalScreen
          fetchedPackage={{ id: 1 }}
          onActionClick={onActionClickSpy}
          onCancelClick={vi.fn()}
          isLoading={false}
        />
      </Modal>
    );

    fireEvent.click(screen.getByTestId('deliver-button'));

    await waitFor(() => {
      expect(onActionClickSpy).toHaveBeenCalledTimes(1);
      expect(onActionClickSpy).toHaveBeenCalledWith(PackageAction.Deliver);
    });
  });

  it('should trigger `onActionClick` function with action `ReturnToWarehouse` on return to warehouse button click', async () => {
    const onActionClickSpy = vi.fn();

    render(
      <Modal isOpen={true} onClose={vi.fn()}>
        <DeliverPackageModalScreen
          fetchedPackage={{ id: 1 }}
          onActionClick={onActionClickSpy}
          onCancelClick={vi.fn()}
          isLoading={false}
        />
      </Modal>
    );

    fireEvent.click(screen.getByTestId('return-to-warehouse-button'));

    await waitFor(() => {
      expect(onActionClickSpy).toHaveBeenCalledTimes(1);
      expect(onActionClickSpy).toHaveBeenCalledWith(PackageAction.ReturnToWarehouse);
    });
  });

  it('should trigger `onCancelClick` function on cancel button click', async () => {
    const onCancelClickSpy = vi.fn();

    render(
      <Modal isOpen={true} onClose={vi.fn()}>
        <DeliverPackageModalScreen
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
