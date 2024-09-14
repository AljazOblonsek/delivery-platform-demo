'use client';

import { Box, Text } from '@chakra-ui/react';
import NavHeading from '@/app/components/NavHeading';

type TrackErrorProps = {
  message?: string;
};

export default function TrackError({ message }: TrackErrorProps) {
  return (
    <Box>
      <NavHeading title={"There's been an error."} linkHome />
      <Text>{message || "Unknown error occurred. We're sorry."}</Text>
    </Box>
  );
}
