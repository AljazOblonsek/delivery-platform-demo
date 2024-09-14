import { Box, Heading, Stack, Text } from '@chakra-ui/react';
import { TrackingForm } from '@/app/compositions/TrackingForm';
import routes from '@/lib/constants/routes';

export const HomePage = async () => {
  return (
    <Box as={'form'} action={routes.TRACK} method="GET">
      <Stack alignItems={'center'} height={'100%'}>
        <Stack alignItems={'center'}>
          <Heading size={['lg', 'xl']}>Package Tracking</Heading>
          <Text fontSize={['lg', 'xl']}>
            Enter your tracking information below to get the latest update on your shipment status.
          </Text>
        </Stack>
        <TrackingForm />
      </Stack>
    </Box>
  );
};
