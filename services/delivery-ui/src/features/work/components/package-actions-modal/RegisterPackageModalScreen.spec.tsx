import { Modal } from '@chakra-ui/react';
import { cleanup, fireEvent, render, screen, waitFor } from '@testing-library/react';
import { afterEach, describe, expect, it, vi } from 'vitest';
import { PackageAction } from '../../enums/package-action.enum';
import { RegisterPackageModalScreen } from './RegisterPackageModalScreen';

describe('RegisterPackageModalScreen', () => {
  afterEach(() => {
    cleanup();
  });

  it('should render `N/A` in description if package title is falsy', () => {
    render(
      <Modal isOpen={true} onClose={vi.fn()}>
        <RegisterPackageModalScreen
          fetchedPackage={{ id: 1 }}
          onActionClick={vi.fn()}
          onCancelClick={vi.fn()}
          isLoading={false}
        />
      </Modal>
    );

    expect(screen.getByTestId('modal-body')).toHaveTextContent(
      'Are you sure you want to register package N/A for your delivery company and save it in warehouse?'
    );
  });

  it('should render package title in description if package title is provided', () => {
    const packageTitleStub = 'iPhone 11';

    render(
      <Modal isOpen={true} onClose={vi.fn()}>
        <RegisterPackageModalScreen
          fetchedPackage={{ id: 1, title: packageTitleStub }}
          onActionClick={vi.fn()}
          onCancelClick={vi.fn()}
          isLoading={false}
        />
      </Modal>
    );

    expect(screen.getByTestId('modal-body')).toHaveTextContent(
      `Are you sure you want to register package ${packageTitleStub} for your delivery company and save it in warehouse?`
    );
  });

  it('should trigger `onActionClick` function with action `AddToWarehouse` on register button click', async () => {
    const onActionClickSpy = vi.fn();

    render(
      <Modal isOpen={true} onClose={vi.fn()}>
        <RegisterPackageModalScreen
          fetchedPackage={{ id: 1 }}
          onActionClick={onActionClickSpy}
          onCancelClick={vi.fn()}
          isLoading={false}
        />
      </Modal>
    );

    fireEvent.click(screen.getByTestId('register-button'));

    await waitFor(() => {
      expect(onActionClickSpy).toHaveBeenCalledTimes(1);
      expect(onActionClickSpy).toHaveBeenCalledWith(PackageAction.AddToWarehouse);
    });
  });

  it('should trigger `onCancelClick` function on cancel button click', async () => {
    const onCancelClickSpy = vi.fn();

    render(
      <Modal isOpen={true} onClose={vi.fn()}>
        <RegisterPackageModalScreen
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
