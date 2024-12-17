import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import { BrowserRouter, useNavigate } from 'react-router-dom';
import { vi, describe, test, expect, beforeEach } from 'vitest';
import Login from '../pages/Login';
import { API_BASE_URL } from '../utils/constants';

// Create a mock navigate function
const mockNavigate = vi.fn();

// Mock localStorage
const localStorageMock = {
  getItem: vi.fn(),
  setItem: vi.fn(),
  clear: vi.fn()
};
Object.defineProperty(window, 'localStorage', { value: localStorageMock });

// Mock react-router-dom
vi.mock('react-router-dom', async () => {
  const actual = await vi.importActual('react-router-dom');
  return {
    ...actual,
    useNavigate: () => mockNavigate
  };
});

// Mock LoadingIndicator component since it might have animations
vi.mock('../components/LoadingIndicator', () => ({
  default: () => <div data-testid="loading">Loading...</div>
}));

describe('Login Component', () => {
  beforeEach(() => {
    // Clear all mocks before each test
    vi.clearAllMocks();
    localStorageMock.clear();
    
    // Reset fetch mock
    global.fetch = vi.fn();
  });

  test('renders login form correctly', () => {
    render(
      <BrowserRouter>
        <Login />
      </BrowserRouter>
    );

    // Check if important elements are rendered
    expect(screen.getByText('Masuk atau Daftar')).toBeInTheDocument();
    expect(screen.getByPlaceholderText('email@students.mikroskil.ac.id')).toBeInTheDocument();
    expect(screen.getByRole('button', { name: /lanjutkan/i })).toBeInTheDocument();
  });

  test('validates email format', async () => {
    render(
      <BrowserRouter>
        <Login />
      </BrowserRouter>
    );

    const emailInput = screen.getByPlaceholderText('email@students.mikroskil.ac.id');
    const submitButton = screen.getByRole('button', { name: /lanjutkan/i });

    // Test with invalid email
    fireEvent.change(emailInput, { target: { value: 'invalid.email@gmail.com' } });
    fireEvent.click(submitButton);

    // Should show invalid domain modal
    await waitFor(() => {
      expect(screen.getByText('Gunakan email Mikroskil Anda')).toBeInTheDocument();
    });
  });

  test('handles successful email check for existing user', async () => {
    // Mock successful API response for existing user
    global.fetch.mockResolvedValueOnce({
      ok: true,
      json: async () => ({ exists: true }),
    });

    render(
      <BrowserRouter>
        <Login />
      </BrowserRouter>
    );

    const emailInput = screen.getByPlaceholderText('email@students.mikroskil.ac.id');
    const submitButton = screen.getByRole('button', { name: /lanjutkan/i });

    // Set email value
    fireEvent.change(emailInput, { target: { value: 'test@students.mikroskil.ac.id' } });
    
    // Submit form
    fireEvent.click(submitButton);

    // First wait for the API call to complete
    await waitFor(() => {
      expect(global.fetch).toHaveBeenCalledWith(
        `${API_BASE_URL}/api/accounts/check-email`,
        expect.any(Object)
      );
    });

    // Then check localStorage and navigation
    expect(localStorageMock.setItem).toHaveBeenCalledWith('tempEmail', 'test@students.mikroskil.ac.id');
    expect(mockNavigate).toHaveBeenCalledWith('/login-password');
  });

  test('handles successful email check for new user', async () => {
    // Mock successful API response for new user
    global.fetch.mockResolvedValueOnce({
      ok: true,
      json: async () => ({ exists: false }),
    });

    render(
      <BrowserRouter>
        <Login />
      </BrowserRouter>
    );

    const emailInput = screen.getByPlaceholderText('email@students.mikroskil.ac.id');
    const submitButton = screen.getByRole('button', { name: /lanjutkan/i });

    fireEvent.change(emailInput, { target: { value: 'test@students.mikroskil.ac.id' } });
    fireEvent.click(submitButton);

    await waitFor(() => {
      expect(screen.getByText('Email Belum terdaftar')).toBeInTheDocument();
    });
  });

  test('handles network error', async () => {
    // Mock network error
    global.fetch.mockRejectedValueOnce(new Error('Network error'));

    render(
      <BrowserRouter>
        <Login />
      </BrowserRouter>
    );

    const emailInput = screen.getByPlaceholderText('email@students.mikroskil.ac.id');
    const submitButton = screen.getByRole('button', { name: /lanjutkan/i });

    fireEvent.change(emailInput, { target: { value: 'test@students.mikroskil.ac.id' } });
    fireEvent.click(submitButton);

    await waitFor(() => {
      expect(screen.getByText('Network error')).toBeInTheDocument();
    });
  });

  test('handles API error', async () => {
    // Mock API error response
    global.fetch.mockResolvedValueOnce({
      ok: false,
      json: async () => ({ error: 'API error' }),
    });

    render(
      <BrowserRouter>
        <Login />
      </BrowserRouter>
    );

    const emailInput = screen.getByPlaceholderText('email@students.mikroskil.ac.id');
    const submitButton = screen.getByRole('button', { name: /lanjutkan/i });

    fireEvent.change(emailInput, { target: { value: 'test@students.mikroskil.ac.id' } });
    fireEvent.click(submitButton);

    await waitFor(() => {
      expect(screen.getByText(/API error/i)).toBeInTheDocument();
    });
  });
});
