import { Box, Spinner } from '@chakra-ui/react';
import { ReactNode } from 'react';
import { Redirect } from 'wouter';
import { Routes, colors } from '@/core';

interface OnlyGuestRouteProps {
  isInitialized: boolean;
  isAuthenticated: boolean;
  children: ReactNode;
}

/**
 * @description This component automatically redirects user to dashboard if they are alread authenticated.
 * @description It is usually used on authentication pages because only users that are not logged in yet can access them.
 */
export const OnlyGuestRoute = ({
  isInitialized,
  isAuthenticated,
  children,
}: OnlyGuestRouteProps) => {
  if (!isInitialized) {
    return (
      <Box height="100vh" display="flex" alignItems="center" justifyContent="center">
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
    );
  }

  if (isAuthenticated) {
    // eslint-disable-next-line @typescript-eslint/no-unsafe-assignment, @typescript-eslint/no-unsafe-member-access
    return <Redirect to={history.state?.from || Routes.Home} />;
  }

  return children;
};
