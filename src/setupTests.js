import '@testing-library/jest-dom'
import { vi } from 'vitest'
import { API_BASE_URL } from './utils/constants'

// Mock localStorage
const localStorageMock = {
  getItem: vi.fn(),
  setItem: vi.fn(),
  clear: vi.fn(),
  removeItem: vi.fn(),
};
global.localStorage = localStorageMock;

// Mock fetch
global.fetch = vi.fn();

// Mock environment variables
vi.mock('./utils/constants', () => ({
  API_BASE_URL: 'http://localhost:3000'
}));
