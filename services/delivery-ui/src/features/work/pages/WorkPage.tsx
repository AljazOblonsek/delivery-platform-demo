import { Box, Button, ButtonGroup, Spinner } from '@chakra-ui/react';
import { useEffect, useState } from 'react';
import { PackageManualInput } from '../components/PackageManualInput';
import { PackageQrScanner } from '../components/PackageQrScanner';
import { PackageActionsModal } from '../components/package-actions-modal/PackageActionsModal';
import { FetchedPackage } from '../types/fetched-package.type';
import { DashboardLayout, colors } from '@/core';

export const WorkPage = () => {
  const [isRequestingCameraAccess, setIsRequestingCameraAccess] = useState(true);
  const [inputType, setInputType] = useState<'qrScan' | 'manual'>('manual');
  const [fetchedPackage, setFetchedPackage] = useState<FetchedPackage | null>(null);

  useEffect(() => {
    const requestCameraAccess = async () => {
      setIsRequestingCameraAccess(true);
      // await new Promise((r) => setTimeout(r, 5000));

      try {
        await navigator.mediaDevices.getUserMedia({ video: true });
        setInputType('qrScan');
      } catch {
        setIsRequestingCameraAccess(false);
      } finally {
        setIsRequestingCameraAccess(false);
      }
    };

    requestCameraAccess();
  }, []);

  const onScanProcessComplete = (fetchedPackage: FetchedPackage) => {
    setFetchedPackage(fetchedPackage);
  };

  return (
    <>
      <PackageActionsModal fetchedPackage={fetchedPackage} setFetchedPackage={setFetchedPackage} />
      <DashboardLayout
        title="Work"
        description="Use the scanner below to scan a QR code on the package or manually enter the package information."
      >
        <Box>
          {isRequestingCameraAccess ? (
            <Box display="flex" alignItems="center" justifyContent="center">
              <Spinner
                thickness="0.4rem"
                speed="1s"
                height="5rem"
                width="5rem"
                data-testid="loading-spinner"
                emptyColor={colors.muted}
                color={colors.primary}
              />
            </Box>
          ) : (
            <>
              <ButtonGroup size="sm" isAttached marginBottom="1.7rem" width="100%">
                <Button
                  width="50%"
                  variant={inputType === 'qrScan' ? 'outline' : undefined}
                  onClick={() => {
                    if (inputType === 'qrScan') {
                      return;
                    }

                    setInputType('qrScan');
                  }}
                  data-testid="select-qr-scan-button"
                >
                  QR Scanner
                </Button>
                <Button
                  width="50%"
                  variant={inputType === 'manual' ? 'outline' : undefined}
                  onClick={() => {
                    if (inputType === 'manual') {
                      return;
                    }

                    setInputType('manual');
                  }}
                  data-testid="select-manual-input-button"
                >
                  Manual Input
                </Button>
              </ButtonGroup>

              {inputType === 'qrScan' ? (
                <PackageQrScanner
                  isPaused={fetchedPackage !== null}
                  onProcessComplete={onScanProcessComplete}
                />
              ) : (
                <PackageManualInput onProcessComplete={onScanProcessComplete} />
              )}
            </>
          )}
        </Box>
      </DashboardLayout>
    </>
  );
};
