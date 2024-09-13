import { cleanup, fireEvent, render, screen, waitFor } from '@testing-library/react';
import { IDetectedBarcode } from '@yudiel/react-qr-scanner';
import { afterEach, describe, expect, it, vi } from 'vitest';
import * as getPackageByIdModule from '../api/get-package-by-id';
import { PackageQrScanner } from './PackageQrScanner';
import { MockPackageSchema } from '@/core';

vi.mock('@yudiel/react-qr-scanner', () => ({
  Scanner: ({ onScan }: { onScan: (detectedCodes: IDetectedBarcode[]) => void }) => (
    <div>
      <button
        data-testid="trigger-mock-scan"
        onClick={(e) => {
          const event = e as unknown as { target: { value?: string } };
          onScan(
            event.target.value
              ? [
                  {
                    boundingBox: { x: 1, y: 1, width: 1, height: 1 },
                    cornerPoints: [],
                    format: '',
                    rawValue: event.target.value,
                  },
                ]
              : []
          );
        }}
      >
        Trigger Mock Scan
      </button>
    </div>
  ),
}));

const toastSpy = vi.fn();

vi.mock('@chakra-ui/react', async (importOriginal) => {
  const original: object = await importOriginal();

  return {
    ...original,
    useToast: () => toastSpy,
  };
});

describe('PackageQrScanner', () => {
  afterEach(() => {
    cleanup();

    vi.clearAllMocks();
  });

  it('should render error toast if no qr code is detected', async () => {
    const onProcessCompleteSpy = vi.fn();

    render(<PackageQrScanner isPaused={false} onProcessComplete={onProcessCompleteSpy} />);

    fireEvent.click(screen.getByTestId('trigger-mock-scan'), { target: { value: undefined } });

    await waitFor(() => {
      expect(toastSpy).toHaveBeenCalledTimes(1);
      expect(toastSpy).toHaveBeenCalledWith({
        title: 'Error',
        description: 'No QR codes detected. Please try again.',
        status: 'error',
        isClosable: true,
        position: 'top',
        duration: 2000,
      });
      expect(onProcessCompleteSpy).not.toHaveBeenCalled();
    });
  });

  it('should render error toast if raw value from qr code cannot be json parsed', async () => {
    const onProcessCompleteSpy = vi.fn();

    render(<PackageQrScanner isPaused={false} onProcessComplete={onProcessCompleteSpy} />);

    fireEvent.click(screen.getByTestId('trigger-mock-scan'), {
      target: { value: 'not_a_json_string' },
    });

    await waitFor(() => {
      expect(toastSpy).toHaveBeenCalledTimes(1);
      expect(toastSpy).toHaveBeenCalledWith({
        title: 'Error',
        description:
          'An error occurred while trying to read value from QR code. Try to scan the code again.',
        status: 'error',
        isClosable: true,
        position: 'top',
        duration: 2000,
      });
      expect(onProcessCompleteSpy).not.toHaveBeenCalled();
    });
  });

  it('should render error toast if raw value could be json parsed but fails zod validation', async () => {
    const onProcessCompleteSpy = vi.fn();

    render(<PackageQrScanner isPaused={false} onProcessComplete={onProcessCompleteSpy} />);

    fireEvent.click(screen.getByTestId('trigger-mock-scan'), {
      target: {
        value: JSON.stringify({
          id: 1,
          randomProperty: 'random-value',
        }),
      },
    });

    await waitFor(() => {
      expect(toastSpy).toHaveBeenCalledTimes(1);
      expect(toastSpy).toHaveBeenCalledWith({
        title: 'Error',
        description: 'QR code scan was successful but could not validate its data. Try again.',
        status: 'error',
        isClosable: true,
        position: 'top',
        duration: 2000,
      });
      expect(onProcessCompleteSpy).not.toHaveBeenCalled();
    });
  });

  it('should render error toast if api call to fetch package fails', async () => {
    const mockPackageSchemaStub: MockPackageSchema = {
      id: 1,
      title: 'iPhone 11',
    };
    const apiErrorMessageStub = 'Failed trying to get package from API.';
    const onProcessCompleteSpy = vi.fn();

    vi.spyOn(getPackageByIdModule, 'getPackageById').mockResolvedValueOnce({
      success: false,
      message: apiErrorMessageStub,
    });

    render(<PackageQrScanner isPaused={false} onProcessComplete={onProcessCompleteSpy} />);

    fireEvent.click(screen.getByTestId('trigger-mock-scan'), {
      target: {
        value: JSON.stringify(mockPackageSchemaStub),
      },
    });

    await waitFor(() => {
      expect(toastSpy).toHaveBeenCalledTimes(1);
      expect(toastSpy).toHaveBeenCalledWith({
        title: 'Error',
        description: apiErrorMessageStub,
        status: 'error',
        isClosable: true,
        position: 'top',
        duration: 2000,
      });
      expect(onProcessCompleteSpy).not.toHaveBeenCalled();
    });
  });

  it('should trigger `onProcessComplete` function when process is successful', async () => {
    const mockPackageSchemaStub: MockPackageSchema = {
      id: 1,
      title: 'iPhone 11',
    };
    const onProcessCompleteSpy = vi.fn();

    vi.spyOn(getPackageByIdModule, 'getPackageById').mockResolvedValueOnce({
      success: true,
      data: {
        id: mockPackageSchemaStub.id,
        title: mockPackageSchemaStub.title,
      },
    });

    render(<PackageQrScanner isPaused={false} onProcessComplete={onProcessCompleteSpy} />);

    fireEvent.click(screen.getByTestId('trigger-mock-scan'), {
      target: {
        value: JSON.stringify(mockPackageSchemaStub),
      },
    });

    await waitFor(() => {
      expect(onProcessCompleteSpy).toHaveBeenCalledTimes(1);
      expect(onProcessCompleteSpy).toHaveBeenCalledWith({
        id: mockPackageSchemaStub.id,
        title: mockPackageSchemaStub.title,
      });
    });
  });
});
