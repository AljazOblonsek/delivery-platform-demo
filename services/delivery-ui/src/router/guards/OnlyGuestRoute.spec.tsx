import { cleanup, render, screen } from '@testing-library/react';
import { afterEach, describe, expect, it, vi } from 'vitest';
import { Redirect } from 'wouter';
import { OnlyGuestRoute } from './OnlyGuestRoute';
import { Routes } from '@/core';

vi.mock('wouter', () => ({
  Redirect: vi.fn(),
}));

describe('OnlyGuestRoute', () => {
  afterEach(() => {
    cleanup();

    vi.clearAllMocks();
  });

  it('should render loading spinner if app is not initialized', () => {
    render(
      <OnlyGuestRoute isInitialized={false} isAuthenticated={false}>
        <div>Content</div>
      </OnlyGuestRoute>
    );

    expect(screen.queryByTestId('loading-spinner')).toBeInTheDocument();
  });

  it('should render redirect element if user is authenticated and redirect to from state if it exists', () => {
    const fromStub = '/dashboard';

    // @ts-expect-error It is ok to reassingn history in test
    // eslint-disable-next-line no-global-assign
    history = {
      state: {
        from: fromStub,
      },
    };

    render(
      <OnlyGuestRoute isInitialized={true} isAuthenticated={true}>
        <div>Content</div>
      </OnlyGuestRoute>
    );

    expect(Redirect).toHaveBeenCalledTimes(1);
    expect(Redirect).toHaveBeenCalledWith(
      {
        to: fromStub,
      },
      expect.anything()
    );
  });

  it('should render redirect element if user is authenticated and redirect to home by default', () => {
    // @ts-expect-error It is ok to reassingn history in test
    // eslint-disable-next-line no-global-assign
    history = {
      state: {},
    };

    render(
      <OnlyGuestRoute isInitialized={true} isAuthenticated={true}>
        <div>Content</div>
      </OnlyGuestRoute>
    );

    expect(Redirect).toHaveBeenCalledTimes(1);
    expect(Redirect).toHaveBeenCalledWith(
      {
        to: Routes.Home,
      },
      expect.anything()
    );
  });

  it('should render children element if user is not authenticated', () => {
    render(
      <OnlyGuestRoute isInitialized={true} isAuthenticated={false}>
        <div>Content</div>
      </OnlyGuestRoute>
    );

    expect(screen.queryByText('Content')).toBeInTheDocument();
  });
});
