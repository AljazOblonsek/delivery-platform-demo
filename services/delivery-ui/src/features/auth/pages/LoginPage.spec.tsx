import { cleanup, fireEvent, render, screen, waitFor } from '@testing-library/react';
import { afterEach, describe, expect, it, vi } from 'vitest';
import { LoginPage } from './LoginPage';
import * as coreModule from '@/core';

const authenticateSpy = vi.fn();

vi.mock('@/core', async (importOriginal) => {
  const original: object = await importOriginal();

  return {
    ...original,
    useAuthStore: () => ({
      authenticate: authenticateSpy,
    }),
  };
});

describe('LoginPage', () => {
  afterEach(() => {
    cleanup();

    vi.clearAllMocks();
  });

  it('should render validation error if entered email is not valid email format', async () => {
    render(<LoginPage />);

    const emailInput = screen.getByTestId('email-input');
    const loginButton = screen.getByTestId('login-button');

    fireEvent.change(emailInput, { target: { value: 'not-a-valid-email' } });
    fireEvent.submit(loginButton);

    expect(await screen.findByTestId('email-error')).toHaveTextContent('Invalid email');
  });

  it('should render validation error if entered password is too short', async () => {
    render(<LoginPage />);

    const passwordInput = screen.getByTestId('password-input');
    const loginButton = screen.getByTestId('login-button');

    fireEvent.change(passwordInput, { target: { value: 'one' } });
    fireEvent.submit(loginButton);

    expect(await screen.findByTestId('password-error')).toHaveTextContent(
      'String must contain at least 8 character(s)'
    );
  });

  it('should render server error if api call to login endpoint is not successful', async () => {
    render(<LoginPage />);

    vi.spyOn(coreModule, 'apiFetch').mockResolvedValueOnce({ ok: false } as Response);

    const emailInput = screen.getByTestId('email-input');
    const passwordInput = screen.getByTestId('password-input');
    const loginButton = screen.getByTestId('login-button');

    fireEvent.change(emailInput, { target: { value: 'john.doe@dp-demo.io' } });
    fireEvent.change(passwordInput, { target: { value: 'Test123!' } });
    fireEvent.submit(loginButton);

    expect(await screen.findByTestId('root-error')).toHaveTextContent('Wrong email or password.');
  });

  it('should authenticate user on successful login', async () => {
    const jwtStub =
      'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJqdGkiOiI2NmM1YjVhNi1hODE2LTQzY2YtOWQ1NS05ODdhZjkxMDdlZTIiLCJzdWIiOiIxIiwiZXhwIjoxNzIyODk4OTQ0LCJpYXQiOjE3MjE4OTg5NDQsImlkIjoiMSIsImVtYWlsIjoiam9obi5kb2VAZHAtZGVtby5pbyIsImZpcnN0bmFtZSI6IkpvaG4iLCJsYXN0bmFtZSI6IkRvZSIsImNvbXBhbnlJZCI6IjEiLCJjb21wYW55TmFtZSI6IkJlZWxpdmVyIn0.7EmiP-ZbICP8QDW5f28iB_Rt37gM-t36gdV267HOQ7w';
    const setItemSpy = vi.spyOn(Storage.prototype, 'setItem');

    render(<LoginPage />);

    vi.spyOn(coreModule, 'apiFetch').mockResolvedValueOnce({
      ok: true,
      json: () => Promise.resolve({ accessToken: jwtStub }),
    } as Response);

    const emailInput = screen.getByTestId('email-input');
    const passwordInput = screen.getByTestId('password-input');
    const loginButton = screen.getByTestId('login-button');

    fireEvent.change(emailInput, { target: { value: 'john.doe@dp-demo.io' } });
    fireEvent.change(passwordInput, { target: { value: 'Test123!' } });
    fireEvent.submit(loginButton);

    await waitFor(() => {
      expect(setItemSpy).toHaveBeenCalledTimes(1);
      expect(setItemSpy).toHaveBeenCalledWith(coreModule.LocalStorageKey.AccessToken, jwtStub);
      expect(authenticateSpy).toHaveBeenCalledTimes(1);
      expect(authenticateSpy).toHaveBeenCalledWith(jwtStub, expect.any(Object));
    });
  });
});
