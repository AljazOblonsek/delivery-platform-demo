/* eslint-disable @typescript-eslint/no-unsafe-assignment */

// eslint-disable-next-line no-underscore-dangle, @typescript-eslint/no-explicit-any, @typescript-eslint/no-unsafe-member-access
const { VITE_ENV, VITE_API_URL } = (window as any).__env__;

interface Environment {
  VITE_ENV: 'development' | 'test' | 'production';
  VITE_API_URL: string;
}

const privateEnv: Environment = {
  VITE_ENV,
  VITE_API_URL,
};

export const env = Object.freeze(privateEnv);
