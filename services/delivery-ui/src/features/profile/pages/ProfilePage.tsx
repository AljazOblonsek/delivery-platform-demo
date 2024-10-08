import { Button, FormControl, FormLabel, Input, Stack } from '@chakra-ui/react';
import { DashboardLayout, LocalStorageKey, useAuthStore } from '@/core';

export const ProfilePage = () => {
  const { user, unauthenticate } = useAuthStore((state) => ({
    user: state.user,
    unauthenticate: state.unauthenticate,
  }));

  return (
    <DashboardLayout title="Profile" description="Information about your profile.">
      <Stack spacing={10} as="form">
        <Stack spacing={5} fontSize="lg">
          <FormControl>
            <FormLabel htmlFor="email">Email</FormLabel>
            <Input
              id="email"
              data-testid="email-input"
              variant="filled"
              disabled={true}
              value={user?.email}
            />
          </FormControl>
          <FormControl>
            <FormLabel htmlFor="firstname">Firstname</FormLabel>
            <Input
              id="firstname"
              data-testid="firstname-input"
              variant="filled"
              disabled={true}
              value={user?.firstname}
            />
          </FormControl>
          <FormControl>
            <FormLabel htmlFor="lastname">Lastname</FormLabel>
            <Input
              id="firstname"
              data-testid="lastname-input"
              variant="filled"
              disabled={true}
              value={user?.lastname}
            />
          </FormControl>
          <FormControl>
            <FormLabel htmlFor="delivery-company">Delivery company</FormLabel>
            <Input
              id="delivery-company"
              data-testid="delivery-company-input"
              variant="filled"
              disabled={true}
              value={user?.companyName}
            />
          </FormControl>
        </Stack>

        <Button
          onClick={() => {
            localStorage.removeItem(LocalStorageKey.AccessToken);
            unauthenticate();
          }}
          data-testid="logout-button"
        >
          Logout
        </Button>
      </Stack>
    </DashboardLayout>
  );
};
