import { Route, Switch } from 'wouter';
import { NotFoundPage } from './NotFoundPage';
import { OnlyGuestRoute } from './guards/OnlyGuestRoute';
import { PrivateRoute } from './guards/PrivateRoute';
import { Routes, useAuthStore } from '@/core';
import { LoginPage } from '@/features/auth';
import { HomePage } from '@/features/home';
import { MockPackagesPage } from '@/features/mock';
import { ProfilePage } from '@/features/profile';
import { WorkPage } from '@/features/work';

export const AppRouter = () => {
  const { isInitialized, isAuthenticated } = useAuthStore((state) => ({
    isInitialized: state.isInitialized,
    isAuthenticated: state.isAuthenticated,
  }));

  return (
    <Switch>
      <Route
        path={Routes.Login}
        component={() => (
          <OnlyGuestRoute isInitialized={isInitialized} isAuthenticated={isAuthenticated()}>
            <LoginPage />
          </OnlyGuestRoute>
        )}
      />
      <Route
        path={Routes.Home}
        component={() => (
          <PrivateRoute isInitialized={isInitialized} isAuthenticated={isAuthenticated()}>
            <HomePage />
          </PrivateRoute>
        )}
      />
      <Route
        path={Routes.Work}
        component={() => (
          <PrivateRoute isInitialized={isInitialized} isAuthenticated={isAuthenticated()}>
            <WorkPage />
          </PrivateRoute>
        )}
      />
      <Route
        path={Routes.Profile}
        component={() => (
          <PrivateRoute isInitialized={isInitialized} isAuthenticated={isAuthenticated()}>
            <ProfilePage />
          </PrivateRoute>
        )}
      />
      <Route path={Routes.MockPackages} component={() => <MockPackagesPage />} />
      <Route component={() => <NotFoundPage />} />
    </Switch>
  );
};
