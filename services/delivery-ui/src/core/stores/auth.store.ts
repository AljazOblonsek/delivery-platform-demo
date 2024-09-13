import { create } from 'zustand';
import { devtools } from 'zustand/middleware';
import { User } from '../types';
import { env } from '@/env';

interface AuthStoreState {
  isInitialized: boolean;
  isAuthenticated: () => boolean;
  accessToken: string | null;
  user: User | null;
}

interface AuthStoreActions {
  authenticate: (accessToken: string, user: User) => void;
  unauthenticate: () => void;
}

export const useAuthStore = create<AuthStoreState & AuthStoreActions>()(
  devtools(
    (set, get) => ({
      isInitialized: false,
      isAuthenticated: () => {
        return get().isInitialized && get().accessToken !== null;
      },
      accessToken: null,
      user: null,

      authenticate: (accessToken: string, user: User) => {
        set({ accessToken, user, isInitialized: true });
      },
      unauthenticate: () => {
        set({ accessToken: null, user: null, isInitialized: true });
      },
    }),
    {
      name: 'auth-store',
      enabled: env.VITE_ENV === 'development',
    }
  )
);
