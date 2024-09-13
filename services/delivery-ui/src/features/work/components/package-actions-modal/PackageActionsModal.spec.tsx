import { cleanup, fireEvent, render, screen, waitFor } from '@testing-library/react';
import { afterEach, describe, expect, it, vi } from 'vitest';
import * as scanPackageModule from '../../api/scan-package';
import { PackageStatus } from '../../enums/package-status.enum';
import { PackageActionsModal } from './PackageActionsModal';

const toastSpy = vi.fn();

vi.mock('@chakra-ui/react', async (importOriginal) => {
  const original: object = await importOriginal();

  return {
    ...original,
    useBreakpoint: () => vi.fn(),
    useToast: () => toastSpy,
  };
});

describe('PackageActionsModal', () => {
  afterEach(() => {
    cleanup();

    vi.clearAllMocks();
  });

  it('should not render modal content if `fetchedPackage` property is null', () => {
    render(<PackageActionsModal fetchedPackage={null} setFetchedPackage={vi.fn()} />);

    expect(screen.queryByTestId('modal-content')).not.toBeInTheDocument();
  });

  it('should render modal content if `fetchedPackage` property is provided', () => {
    render(<PackageActionsModal fetchedPackage={{ id: 1 }} setFetchedPackage={vi.fn()} />);

    expect(screen.queryByTestId('modal-content')).toBeInTheDocument();
  });

  it('should render register package screen if fetched package status is falsy', () => {
    render(<PackageActionsModal fetchedPackage={{ id: 1 }} setFetchedPackage={vi.fn()} />);

    expect(screen.queryByText('Register Package')).toBeInTheDocument();
  });

  it('should render pickup package screen if fetched package status is `InWarehouse`', () => {
    render(
      <PackageActionsModal
        fetchedPackage={{ id: 1, status: PackageStatus.InWarehouse }}
        setFetchedPackage={vi.fn()}
      />
    );

    expect(screen.queryByText('Pickup Package')).toBeInTheDocument();
  });

  it('should render deliver package screen if fetched package status is `InDelivery`', () => {
    render(
      <PackageActionsModal
        fetchedPackage={{ id: 1, status: PackageStatus.InDelivery }}
        setFetchedPackage={vi.fn()}
      />
    );

    expect(screen.queryByText('Deliver Package')).toBeInTheDocument();
  });

  it('should render package delivered screen if fetched package status is `Delivered`', () => {
    render(
      <PackageActionsModal
        fetchedPackage={{ id: 1, status: PackageStatus.Delivered }}
        setFetchedPackage={vi.fn()}
      />
    );

    expect(screen.queryByText('Package Delivered')).toBeInTheDocument();
  });

  it('should render error toast if action failed and keep the modal opened', async () => {
    const errorMessageStub = 'An error occurred while trying to scan package.';
    const setFetchedPackageSpy = vi.fn();

    vi.spyOn(scanPackageModule, 'scanPackage').mockResolvedValueOnce({
      success: false,
      message: errorMessageStub,
    });

    render(
      <PackageActionsModal fetchedPackage={{ id: 1 }} setFetchedPackage={setFetchedPackageSpy} />
    );

    fireEvent.click(screen.getByTestId('register-button'));

    await waitFor(() => {
      expect(toastSpy).toHaveBeenCalledTimes(1);
      expect(toastSpy).toHaveBeenCalledWith({
        title: 'Error',
        description: errorMessageStub,
        status: 'error',
        isClosable: true,
        position: 'top',
        duration: 2000,
      });
      expect(setFetchedPackageSpy).not.toHaveBeenCalled();
    });
  });

  it('should render success toast and close the modal on successful action', async () => {
    const setFetchedPackageSpy = vi.fn();

    vi.spyOn(scanPackageModule, 'scanPackage').mockResolvedValueOnce({
      success: true,
      data: {
        id: 1,
      },
    });

    render(
      <PackageActionsModal fetchedPackage={{ id: 1 }} setFetchedPackage={setFetchedPackageSpy} />
    );

    fireEvent.click(screen.getByTestId('register-button'));

    await waitFor(() => {
      expect(toastSpy).toHaveBeenCalledTimes(1);
      expect(toastSpy).toHaveBeenCalledWith({
        title: 'Success',
        description: 'Successfully updated package.',
        status: 'success',
        isClosable: true,
        position: 'top',
        duration: 2000,
      });
      expect(setFetchedPackageSpy).toHaveBeenCalledTimes(1);
      expect(setFetchedPackageSpy).toHaveBeenCalledWith(null);
    });
  });
});
