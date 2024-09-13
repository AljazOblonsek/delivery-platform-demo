import { cleanup, fireEvent, render, screen, waitFor } from '@testing-library/react';
import { afterEach, describe, expect, it, vi } from 'vitest';
import * as getPackageByIdModule from '../api/get-package-by-id';
import { PackageManualInput } from './PackageManualInput';
import { MockPackageSchema } from '@/core';

describe('PackageManualInput', () => {
  afterEach(() => {
    cleanup();

    vi.clearAllMocks();
  });

  it('should render validation error if entered id is not a number', async () => {
    const onProcessCompleteSpy = vi.fn();

    render(<PackageManualInput onProcessComplete={onProcessCompleteSpy} />);

    const idInput = screen.getByTestId('id-input');
    const scanPackageButton = screen.getByTestId('scan-package-button');

    fireEvent.change(idInput, { target: { value: 'not-a-number' } });
    fireEvent.submit(scanPackageButton);

    expect(await screen.findByTestId('id-error')).toHaveTextContent(
      'Expected number, received nan'
    );
    expect(onProcessCompleteSpy).not.toHaveBeenCalled();
  });

  it('should render validation error if entered id is negative', async () => {
    const onProcessCompleteSpy = vi.fn();

    render(<PackageManualInput onProcessComplete={onProcessCompleteSpy} />);

    const idInput = screen.getByTestId('id-input');
    const scanPackageButton = screen.getByTestId('scan-package-button');

    fireEvent.change(idInput, { target: { value: '-5' } });
    fireEvent.submit(scanPackageButton);

    expect(await screen.findByTestId('id-error')).toHaveTextContent(
      'Number must be greater than 0'
    );
    expect(onProcessCompleteSpy).not.toHaveBeenCalled();
  });

  it('should render validation error if entered id is zero', async () => {
    const onProcessCompleteSpy = vi.fn();

    render(<PackageManualInput onProcessComplete={onProcessCompleteSpy} />);

    const idInput = screen.getByTestId('id-input');
    const scanPackageButton = screen.getByTestId('scan-package-button');

    fireEvent.change(idInput, { target: { value: '0' } });
    fireEvent.submit(scanPackageButton);

    expect(await screen.findByTestId('id-error')).toHaveTextContent(
      'Number must be greater than 0'
    );
    expect(onProcessCompleteSpy).not.toHaveBeenCalled();
  });

  it('should render validation error if entered title is too short', async () => {
    const onProcessCompleteSpy = vi.fn();

    render(<PackageManualInput onProcessComplete={onProcessCompleteSpy} />);

    const titleInput = screen.getByTestId('title-input');
    const scanPackageButton = screen.getByTestId('scan-package-button');

    fireEvent.change(titleInput, { target: { value: 'a' } });
    fireEvent.submit(scanPackageButton);

    expect(await screen.findByTestId('title-error')).toHaveTextContent(
      'String must contain at least 3 character(s)'
    );
    expect(onProcessCompleteSpy).not.toHaveBeenCalled();
  });

  it('should render server error if api call to fetch package fails', async () => {
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

    render(<PackageManualInput onProcessComplete={onProcessCompleteSpy} />);

    const idInput = screen.getByTestId('id-input');
    const titleInput = screen.getByTestId('title-input');
    const scanPackageButton = screen.getByTestId('scan-package-button');

    fireEvent.change(idInput, { target: { value: mockPackageSchemaStub.id } });
    fireEvent.change(titleInput, { target: { value: mockPackageSchemaStub.title } });
    fireEvent.submit(scanPackageButton);

    expect(await screen.findByTestId('root-error')).toHaveTextContent(apiErrorMessageStub);
    expect(onProcessCompleteSpy).not.toHaveBeenCalled();
  });

  it('should trigger `onProcessComplete` function when process is successful', async () => {
    const mockPackageSchemaStub: MockPackageSchema = {
      id: 1,
      title: 'iPhone 11',
    };
    const onProcessCompleteSpy = vi.fn();

    vi.spyOn(getPackageByIdModule, 'getPackageById').mockResolvedValueOnce({
      success: true,
      data: mockPackageSchemaStub,
    });

    render(<PackageManualInput onProcessComplete={onProcessCompleteSpy} />);

    const idInput = screen.getByTestId('id-input');
    const titleInput = screen.getByTestId('title-input');
    const scanPackageButton = screen.getByTestId('scan-package-button');

    fireEvent.change(idInput, { target: { value: mockPackageSchemaStub.id } });
    fireEvent.change(titleInput, { target: { value: mockPackageSchemaStub.title } });
    fireEvent.submit(scanPackageButton);

    await waitFor(() => {
      expect(onProcessCompleteSpy).toHaveBeenCalledTimes(1);
      expect(onProcessCompleteSpy).toHaveBeenCalledWith({
        id: mockPackageSchemaStub.id,
        title: mockPackageSchemaStub.title,
      });
    });
  });
});
