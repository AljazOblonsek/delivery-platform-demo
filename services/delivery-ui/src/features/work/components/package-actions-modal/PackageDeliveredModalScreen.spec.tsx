import { Modal } from '@chakra-ui/react';
import { cleanup, fireEvent, render, screen, waitFor } from '@testing-library/react';
import { afterEach, describe, expect, it, vi } from 'vitest';
import { PackageDeliveredModalScreen } from './PackageDeliveredModalScreen';

describe('PackageDeliveredModalScreen', () => {
  afterEach(() => {
    cleanup();
  });

  it('should render `N/A` in description if package title or track number is falsy', () => {
    render(
      <Modal isOpen={true} onClose={vi.fn()}>
        <PackageDeliveredModalScreen
          fetchedPackage={{ id: 1 }}
          onActionClick={vi.fn()}
          onCancelClick={vi.fn()}
          isLoading={false}
        />
      </Modal>
    );

    expect(screen.getByTestId('modal-body')).toHaveTextContent(
      'Package N/A (N/A) has been delivered.'
    );
  });

  it('should render package title and track number in description if they are provided', () => {
    const packageTitleStub = 'iPhone 11';
    const packageTrackNumberStub = 'TN007';

    render(
      <Modal isOpen={true} onClose={vi.fn()}>
        <PackageDeliveredModalScreen
          fetchedPackage={{ id: 1, title: packageTitleStub, trackNumber: packageTrackNumberStub }}
          onActionClick={vi.fn()}
          onCancelClick={vi.fn()}
          isLoading={false}
        />
      </Modal>
    );

    expect(screen.getByTestId('modal-body')).toHaveTextContent(
      `Package ${packageTitleStub} (${packageTrackNumberStub}) has been delivered.`
    );
  });

  it('should trigger `onCancelClick` function on cancel button click', async () => {
    const onCancelClickSpy = vi.fn();

    render(
      <Modal isOpen={true} onClose={vi.fn()}>
        <PackageDeliveredModalScreen
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
