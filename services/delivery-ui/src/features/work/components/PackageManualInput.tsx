import { Button, FormControl, FormErrorMessage, FormLabel, Input, Stack } from '@chakra-ui/react';
import { zodResolver } from '@hookform/resolvers/zod';
import { useForm } from 'react-hook-form';
import { getPackageById } from '../api/get-package-by-id';
import { FetchedPackage } from '../types/fetched-package.type';
import { MockPackageSchema, mockPackageSchema } from '@/core';

const mockPackageResolver = zodResolver(mockPackageSchema);

interface PackageManualInputProps {
  /**
   * Triggered after package has been scanned and fetched from backend.
   */
  onProcessComplete: (fetchedPackage: FetchedPackage) => void | Promise<void>;
}

export const PackageManualInput = ({ onProcessComplete }: PackageManualInputProps) => {
  const form = useForm<MockPackageSchema>({ resolver: mockPackageResolver });

  const onSubmit = async (data: MockPackageSchema) => {
    form.clearErrors('root');

    const packageResponse = await getPackageById(data.id);

    if (!packageResponse.success) {
      form.setError('root', { message: packageResponse.message });
      return;
    }

    onProcessComplete({ ...packageResponse.data, title: packageResponse.data.title ?? data.title });
  };

  return (
    <Stack spacing={6} as="form" onSubmit={form.handleSubmit(onSubmit)}>
      <Stack spacing={5}>
        <FormControl isInvalid={!!form.formState.errors.id}>
          <FormLabel htmlFor="id">Id</FormLabel>
          <Input
            id="id"
            type="text"
            placeholder="1"
            data-testid="id-input"
            {...form.register('id')}
          />
          <FormErrorMessage data-testid="id-error">
            {form.formState.errors.id?.message}
          </FormErrorMessage>
        </FormControl>
        <FormControl isInvalid={!!form.formState.errors.title}>
          <FormLabel htmlFor="title">Title</FormLabel>
          <Input
            id="title"
            type="text"
            placeholder="iPhone 11"
            data-testid="title-input"
            {...form.register('title')}
          />
          <FormErrorMessage data-testid="title-error">
            {form.formState.errors.title?.message}
          </FormErrorMessage>
        </FormControl>
        <FormControl isInvalid={!!form.formState.errors.root}>
          <FormErrorMessage data-testid="root-error">
            {form.formState.errors.root?.message}
          </FormErrorMessage>
        </FormControl>
      </Stack>

      <Button
        isLoading={form.formState.isSubmitting}
        type="submit"
        data-testid="scan-package-button"
      >
        Scan Package
      </Button>
    </Stack>
  );
};
