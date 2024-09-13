import { Heading, Link, Stack, Text } from '@chakra-ui/react';
import { DashboardLayout, Routes } from '@/core';

export const HomePage = () => {
  return (
    <DashboardLayout
      title="Home"
      description="Welcome to the Delivery Platform. This is a demo project showcasing the combined usage of everyday work and with blockchain."
    >
      <Heading size="lg">Work</Heading>
      <Stack spacing="20px" fontSize="lg">
        <Text>
          You can navigate to the work tab to scan an example QR code that can be found on{' '}
          <Link
            href={Routes.MockPackages}
            target="_blank"
          >{`${window.location.origin}${Routes.MockPackages}`}</Link>
          .
        </Text>

        <Text>
          The QR code represents a “package” that the delivery company receives for delivery. Each
          QR code has an unique package that was not yet added to our system.
        </Text>

        <Text>
          Scanning the QR code will open up a modal and enable you to perform actions on it based on
          its status.
        </Text>
      </Stack>
    </DashboardLayout>
  );
};
