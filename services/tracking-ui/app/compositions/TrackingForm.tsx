'use client';

import { Button, FormControl, FormLabel, Input, Stack } from '@chakra-ui/react';
import { useState } from 'react';

export const TrackingForm = () => {
  const [trackingNumber, setTrackingNumber] = useState<string>('');
  const [secretKey, setSecretKey] = useState<string>('');

  return (
    <Stack mt={16} spacing={4} w={['100%', '75%', '50%', '35%']}>
      <FormControl>
        <FormLabel mb={0}>Tracking number</FormLabel>
        <Input
          value={trackingNumber}
          onChange={(e) => setTrackingNumber(e.target.value)}
          name={'trackNumber'}
          placeholder="12345ABCDEF"
        />
      </FormControl>
      <FormControl>
        <FormLabel mb={0}>Secret key</FormLabel>
        <Input
          value={secretKey}
          onChange={(e) => setSecretKey(e.target.value)}
          name={'secretKey'}
          placeholder="backtrack coffee doorbell"
        />
      </FormControl>
      <Button isDisabled={!trackingNumber || !secretKey} type={'submit'} mt={2} variant="primary">
        Track Package
      </Button>
    </Stack>
  );
};
