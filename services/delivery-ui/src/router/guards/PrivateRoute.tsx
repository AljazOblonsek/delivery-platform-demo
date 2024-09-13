import { Box, Spinner } from '@chakra-ui/react';
import { ReactNode } from 'react';
import { Redirect, useLocation } from 'wouter';
import { Routes, colors } from '@/core';

interface PrivateRouteProps {
  isInitialized: boolean;
  isAuthenticated: boolean;
  children: ReactNode;
}

export const PrivateRoute = ({ isInitialized, isAuthenticated, children }: PrivateRouteProps) => {
  const [location] = useLocation();

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

  if (!isAuthenticated) {
    return <Redirect to={Routes.Login} state={{ from: location }} replace />;
  }

  return children;
};
