import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest';
import createFetchMock from 'vitest-fetch-mock';
import { LocalStorageKey } from '../enums';
import { useAuthStore } from '../stores';
import { apiFetch } from './api-fetch.util';
import { env } from '@/env';

const fetchMocker = createFetchMock(vi);

describe('apiFetch', () => {
  beforeEach(() => {
    fetchMocker.enableMocks();
  });

  afterEach(() => {
    fetchMocker.mockRestore();
  });

  it('should correctly setup apiUrl based on env and provided request url', async () => {
    await apiFetch('/test');

    expect(fetch).toBeCalledWith(`${env.VITE_API_URL}/api/test`, { headers: {} });
  });

  it('should not set jwt access token to headers if it does not exist in authStore', async () => {
    vi.spyOn(useAuthStore, 'getState').mockReturnValueOnce({
      accessToken: null,
    } as ReturnType<typeof useAuthStore.getState>);

    await apiFetch('/test');

    expect(fetch).toBeCalledWith(`${env.VITE_API_URL}/api/test`, { headers: {} });
  });

  it('should set jwt access token to headers if it can get it from authStore', async () => {
    const accessTokenStub = 'mock-access-token';

    vi.spyOn(useAuthStore, 'getState').mockReturnValueOnce({
      accessToken: accessTokenStub,
    } as ReturnType<typeof useAuthStore.getState>);

    await apiFetch('/test');

    expect(fetch).toBeCalledWith(`${env.VITE_API_URL}/api/test`, {
      headers: { Authorization: `Bearer ${accessTokenStub}` },
    });
  });

  it('should correctly join headers if additional ones are provided', async () => {
    const accessTokenStub = 'mock-access-token';

    vi.spyOn(useAuthStore, 'getState').mockReturnValueOnce({
      accessToken: accessTokenStub,
    } as ReturnType<typeof useAuthStore.getState>);

    await apiFetch('/test', { headers: { 'Content-Type': 'application/json' } });

    expect(fetch).toBeCalledWith(`${env.VITE_API_URL}/api/test`, {
      headers: { Authorization: `Bearer ${accessTokenStub}`, 'Content-Type': 'application/json' },
    });
  });

  it('should return original response if status is not 401', async () => {
    const statusStub = 200;

    fetchMocker.mockResponseOnce(() => ({ status: statusStub }));

    const response = await apiFetch('/test');

    expect(response.status).toBe(statusStub);
  });

  it("should immediately return 401 response if status is 401 and pathname includes 'login'", async () => {
    const statusStub = 401;

    const unauthenticateSpy = vi.fn();
    vi.spyOn(useAuthStore, 'getState').mockReturnValueOnce({
      unauthanticate: unauthenticateSpy,
    } as unknown as ReturnType<typeof useAuthStore.getState>);
    const removeItemSpy = vi.spyOn(Storage.prototype, 'removeItem');

    fetchMocker.mockResponseOnce(() => ({ status: 401 }));

    const response = await apiFetch('/auth/login');

    expect(response.status).toBe(statusStub);
    expect(unauthenticateSpy).not.toHaveBeenCalled();
    expect(removeItemSpy).not.toHaveBeenCalled();
  });

  it("should return 401 response and unauthenticate user if pathame does not include 'login'", async () => {
    const statusStub = 401;

    const unauthenticateSpy = vi.fn();
    vi.spyOn(useAuthStore, 'getState').mockReturnValueOnce({
      unauthenticate: unauthenticateSpy,
    } as unknown as ReturnType<typeof useAuthStore.getState>);
    const removeItemSpy = vi.spyOn(Storage.prototype, 'removeItem');

    fetchMocker.mockResponseOnce(() => ({ status: 401 }));

    const response = await apiFetch('/packages');

    expect(response.status).toBe(statusStub);
    expect(unauthenticateSpy).toHaveBeenCalledTimes(1);
    expect(removeItemSpy).toHaveBeenCalledTimes(1);
    expect(removeItemSpy).toHaveBeenCalledWith(LocalStorageKey.AccessToken);
  });
});
