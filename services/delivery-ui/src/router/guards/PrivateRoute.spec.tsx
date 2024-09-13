import { cleanup, render, screen } from '@testing-library/react';
import { afterEach, describe, expect, it, vi } from 'vitest';
import { Redirect } from 'wouter';
import { PrivateRoute } from './PrivateRoute';
import { Routes } from '@/core';

const currentLocationStub = '/dashboard';

vi.mock('wouter', () => ({
  useLocation: () => [currentLocationStub],
  Redirect: vi.fn(),
}));

describe('PrivateRoute', () => {
  afterEach(() => {
    cleanup();
  });

  it('should render loading spinner if app is not initialized', () => {
    render(
      <PrivateRoute isInitialized={false} isAuthenticated={false}>
        <div>Content</div>
      </PrivateRoute>
    );

    expect(screen.queryByTestId('loading-spinner')).toBeInTheDocument();
  });

  it('should render redirect element if user is not authenticated', () => {
    render(
      <PrivateRoute isInitialized={true} isAuthenticated={false}>
        <div>Content</div>
      </PrivateRoute>
    );

    expect(Redirect).toHaveBeenCalledTimes(1);
    expect(Redirect).toHaveBeenCalledWith(
      {
        to: Routes.Login,
        state: { from: currentLocationStub },
        replace: true,
      },
      expect.anything()
    );
  });

  it('should render children element if user is authenticated', () => {
    render(
      <PrivateRoute isInitialized={true} isAuthenticated={true}>
        <div>Content</div>
      </PrivateRoute>
    );

    expect(screen.queryByText('Content')).toBeInTheDocument();
  });
});
