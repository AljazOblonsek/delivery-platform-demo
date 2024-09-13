import { cleanup, fireEvent, render, screen } from '@testing-library/react';
import { afterEach, describe, expect, it, vi } from 'vitest';
import { WorkPage } from './WorkPage';

vi.mock('@chakra-ui/react', async (importOriginal) => {
  const original: object = await importOriginal();

  return {
    ...original,
    useBreakpoint: () => vi.fn(),
  };
});

vi.mock('../components/PackageQrScanner', () => ({
  PackageQrScanner: () => <div data-testid="package-qr-scanner">Mock Package QR Scanner</div>,
}));

vi.mock('../components/PackageManualInput', () => ({
  PackageManualInput: () => <div data-testid="package-manual-input">Mock Package Manual Input</div>,
}));

describe('WorkPage', () => {
  afterEach(() => {
    cleanup();
  });

  it('should render qr scanner by default if camera access was granted', async () => {
    // @ts-expect-error We can write to the navigator for sake of test
    navigator.mediaDevices = {
      getUserMedia: vi.fn().mockResolvedValueOnce({
        id: 'back-camera',
        active: true,
      } as MediaStream),
    };

    render(<WorkPage />);

    expect(await screen.findByTestId('package-qr-scanner')).toBeInTheDocument();
  });

  it('should render manual input by default if camera access was granted', async () => {
    // @ts-expect-error We can write to the navigator for sake of test
    navigator.mediaDevices = {
      getUserMedia: vi.fn().mockRejectedValueOnce(new Error('No devices found or access denied.')),
    };

    render(<WorkPage />);

    expect(await screen.findByTestId('package-manual-input')).toBeInTheDocument();
  });

  it('should switch to manual input when manually pressing on the manual input button', async () => {
    // @ts-expect-error We can write to the navigator for sake of test
    navigator.mediaDevices = {
      getUserMedia: vi.fn().mockResolvedValueOnce({
        id: 'back-camera',
        active: true,
      } as MediaStream),
    };

    render(<WorkPage />);

    expect(await screen.findByTestId('package-qr-scanner')).toBeInTheDocument();

    fireEvent.click(screen.getByTestId('select-manual-input-button'));

    expect(await screen.findByTestId('package-manual-input')).toBeInTheDocument();
  });

  it('should switch to qr scanner when manually pressing on the qr scan button', async () => {
    // @ts-expect-error We can write to the navigator for sake of test
    navigator.mediaDevices = {
      getUserMedia: vi.fn().mockRejectedValueOnce(new Error('No devices found or access denied.')),
    };

    render(<WorkPage />);

    expect(await screen.findByTestId('package-manual-input')).toBeInTheDocument();

    fireEvent.click(screen.getByTestId('select-qr-scan-button'));

    expect(await screen.findByTestId('package-qr-scanner')).toBeInTheDocument();
  });
});
