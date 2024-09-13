import { Button, FormControl, FormLabel, Input, Stack } from '@chakra-ui/react';
import { useLocation } from 'wouter';
import { DashboardLayout, Routes } from '@/core';

export const ProfilePage = () => {
  const [_, setLocation] = useLocation();

  return (
    <DashboardLayout title="Profile" description="Information about your profile.">
      <Stack spacing={20} as="form">
        <Stack spacing={5} fontSize="lg">
          <FormControl>
            <FormLabel htmlFor="email">Email</FormLabel>
            <Input id="email" variant="filled" disabled={true} value="john.doe@gmail.com" />
          </FormControl>
          <FormControl>
            <FormLabel htmlFor="firstname">Firstname</FormLabel>
            <Input id="firstname" variant="filled" disabled={true} value="John" />
          </FormControl>
          <FormControl>
            <FormLabel htmlFor="lastname">Lastname</FormLabel>
            <Input id="firstname" variant="filled" disabled={true} value="Doe" />
          </FormControl>
          <FormControl>
            <FormLabel htmlFor="deliverycompany">Delivery company</FormLabel>
            <Input
              id="deliverycompany"
              variant="filled"
              disabled={true}
              value="Beeliver Delivers"
            />
          </FormControl>
        </Stack>

        <Button
          onClick={() => {
            setLocation(Routes.Login);
          }}
        >
          Logout
        </Button>
      </Stack>
    </DashboardLayout>
  );
};
