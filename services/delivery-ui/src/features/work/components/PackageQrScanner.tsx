import { useToast } from '@chakra-ui/react';
import { Scanner } from '@yudiel/react-qr-scanner';
import { getPackageById } from '../api/get-package-by-id';
import { FetchedPackage } from '../types/fetched-package.type';
import { mockPackageSchema } from '@/core';

interface PackageQrScannerProps {
  /**
   * Pauses the scanner at the last scan frame.
   */
  isPaused: boolean;
  /**
   * Triggered after package has been scanned and fetched from backend.
   */
  onProcessComplete: (fetchedPackage: FetchedPackage) => void | Promise<void>;
}

export const PackageQrScanner = ({ isPaused, onProcessComplete }: PackageQrScannerProps) => {
  const toast = useToast();

  return (
    <Scanner
      formats={['qr_code']}
      paused={isPaused}
      allowMultiple={true}
      scanDelay={2000}
      onScan={async (detectedCodes) => {
        const detectedCode = detectedCodes.at(0);

        if (!detectedCode) {
          toast({
            title: 'Error',
            description: 'No QR codes detected. Please try again.',
            status: 'error',
            isClosable: true,
            position: 'top',
            duration: 2000,
          });
          return;
        }

        let parsedJsonValue = null;

        try {
          parsedJsonValue = JSON.parse(detectedCode.rawValue);
        } catch (error: unknown) {
          toast({
            title: 'Error',
            description:
              'An error occurred while trying to read value from QR code. Try to scan the code again.',
            status: 'error',
            isClosable: true,
            position: 'top',
            duration: 2000,
          });
          return;
        }

        const parsedSchema = mockPackageSchema.safeParse(parsedJsonValue);

        if (!parsedSchema.success) {
          toast({
            title: 'Error',
            description: 'QR code scan was successful but could not validate its data. Try again.',
            status: 'error',
            isClosable: true,
            position: 'top',
            duration: 2000,
          });
          return;
        }

        const packageResponse = await getPackageById(parsedSchema.data.id);

        if (!packageResponse.success) {
          toast({
            title: 'Error',
            description: packageResponse.message,
            status: 'error',
            isClosable: true,
            position: 'top',
            duration: 2000,
          });
          return;
        }

        onProcessComplete({
          ...packageResponse.data,
          title: packageResponse.data.title ?? parsedSchema.data.title,
        });
      }}
    />
  );
};
