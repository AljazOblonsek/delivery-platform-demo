import { LocalStorageKey } from '../enums';
import { useAuthStore } from '../stores';
import { env } from '@/env';

const apiUrl = `${env.VITE_API_URL}/api`;

interface ApiFetchRequestInit extends Omit<RequestInit, 'headers'> {
  headers?: Record<string, string>;
}

export const apiFetch = async (input: RequestInfo | URL, init?: ApiFetchRequestInit) => {
  try {
    let headers: Record<string, string> = {};

    if (init?.headers) {
      headers = { ...init.headers };
    }

    const authStore = useAuthStore.getState();

    if (authStore.accessToken) {
      headers.Authorization = `Bearer ${authStore.accessToken}`;
    }

    const response = await fetch(`${apiUrl}${input}`, { ...init, headers });

    if (response.status !== 401) {
      return response;
    }

    if (input.toString().includes('login')) {
      return response;
    }

    authStore.unauthenticate();
    localStorage.removeItem(LocalStorageKey.AccessToken);
    return response;
  } catch (error: unknown) {
    console.warn('An unknown error occurred: ', String(error));
    throw error;
  }
};
