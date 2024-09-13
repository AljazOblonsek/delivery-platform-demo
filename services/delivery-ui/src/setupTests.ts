import * as matchers from '@testing-library/jest-dom/matchers';
import { expect } from 'vitest';

expect.extend(matchers);

// @ts-expect-error Our environment is taken from window object - setting it up for tests here
window.__env__ = {
  VITE_ENV: 'test',
  VITE_API_URL: 'http://localhost:8000',
};
