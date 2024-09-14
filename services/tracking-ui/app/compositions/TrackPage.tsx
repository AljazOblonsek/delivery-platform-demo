import { Stack } from '@chakra-ui/react';
import NavHeading from '@/app/components/NavHeading';
import { TrackingStepper } from '@/app/compositions/TrackingStepper';
import { Package } from '@/lib/schemas/packageSchema';

type TrackPageProps = {
  packageData: Package;
};

export const TrackPage = ({ packageData }: TrackPageProps) => {
  return (
    <Stack alignItems="center" spacing={8} height={'100vh'}>
      <NavHeading title="Package Tracking" linkHome />
      <TrackingStepper history={packageData.history} />
    </Stack>
  );
};
