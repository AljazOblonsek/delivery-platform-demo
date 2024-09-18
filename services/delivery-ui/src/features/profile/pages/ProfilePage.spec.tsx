import { cleanup, fireEvent, render, screen, waitFor } from '@testing-library/react';
import { afterEach, describe, expect, it, vi } from 'vitest';
import { ProfilePage } from './ProfilePage';
import { User } from '@/core';

const userStub: User = {
  id: '1',
  email: 'john.doe@dp-demo.io',
  firstname: 'John',
  lastname: 'Doe',
  companyId: '1',
  companyName: 'Beeliver',
};

const unauthenticateSpy = vi.fn();

vi.mock('@/core', async (importOriginal) => {
  const original: object = await importOriginal();

  return {
    ...original,
    useAuthStore: () => ({
      user: userStub,
      unauthenticate: unauthenticateSpy,
    }),
  };
});

describe('ProfilePage', () => {
  afterEach(() => {
    cleanup();

    vi.clearAllMocks();
  });

  it('should render user information from the auth store on form', async () => {
    render(<ProfilePage />);

    expect(await screen.findByTestId('email-input')).toHaveValue(userStub.email);
    expect(await screen.findByTestId('firstname-input')).toHaveValue(userStub.firstname);
    expect(await screen.findByTestId('lastname-input')).toHaveValue(userStub.lastname);
    expect(await screen.findByTestId('delivery-company-input')).toHaveValue(userStub.companyName);
  });

  it('should unauthenticate user on logout button click', async () => {
    render(<ProfilePage />);

    const logoutButton = screen.getByTestId('logout-button');

    fireEvent.click(logoutButton);

    await waitFor(() => {
      expect(unauthenticateSpy).toHaveBeenCalledTimes(1);
    });
  });
});
