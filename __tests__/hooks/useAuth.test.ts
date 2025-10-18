import React from 'react';
import { renderHook, waitFor } from '@testing-library/react-native';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { Provider } from 'react-redux';
import { configureStore } from '@reduxjs/toolkit';
import * as Keychain from 'react-native-keychain';
import { useLogin, useLogout, useRestoreSession } from '../../src/hooks/useAuth';
import { authApi } from '../../src/services/api';
import authReducer from '../../src/store/authSlice';

// Mock dependencies
jest.mock('react-native-keychain');
jest.mock('../../src/services/api');
jest.mock('../../src/utils/storage', () => ({
  storage: {
    getString: jest.fn(),
    set: jest.fn(),
    delete: jest.fn(),
  },
  setItem: jest.fn(),
  getItem: jest.fn(),
  removeItem: jest.fn(),
  setObject: jest.fn(),
  getObject: jest.fn(),
}));

const mockKeychain = Keychain as jest.Mocked<typeof Keychain>;
const mockAuthApi = authApi as jest.Mocked<typeof authApi>;

// Test wrapper
const createWrapper = () => {
  const queryClient = new QueryClient({
    defaultOptions: {
      queries: { retry: false },
      mutations: { retry: false },
    },
  });
  
  const store = configureStore({
    reducer: {
      auth: authReducer,
    },
  });

  return function Wrapper({ children }: { children: React.ReactNode }) {
    return React.createElement(
      QueryClientProvider,
      { client: queryClient },
      React.createElement(Provider, { store, children })
    );
  };
};

describe('useAuth hooks', () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  describe('useLogin', () => {
    it('should login successfully and save credentials', async () => {
      const mockAuthResponse = {
        accessToken: 'mock-token',
        refreshToken: 'mock-refresh',
        id: 1,
        username: 'testuser',
        email: 'test@example.com',
        firstName: 'Test',
        lastName: 'User',
        gender: 'male',
        image: 'mock-image.jpg',
      };

      mockAuthApi.login.mockResolvedValue(mockAuthResponse);
      mockKeychain.setGenericPassword.mockResolvedValue(true as any);
      mockKeychain.getGenericPassword.mockResolvedValue({
        username: 'testuser',
        password: 'testpass',
        service: '',
        storage: '',
      } as any);

      const { result } = renderHook(() => useLogin(), {
        wrapper: createWrapper(),
      });

      const credentials = { username: 'testuser', password: 'testpass' };
      result.current.mutate(credentials);

      await waitFor(() => {
        expect(result.current.isSuccess).toBe(true);
      });

      const { setItem, setObject } = require('../../src/utils/storage');
      
      expect(mockAuthApi.login).toHaveBeenCalledWith(credentials);
      expect(setItem).toHaveBeenCalledWith('auth_token', 'mock-token');
      expect(setObject).toHaveBeenCalledWith('user_data', expect.objectContaining({
        id: 1,
        username: 'testuser',
        email: 'test@example.com',
      }));
      expect(mockKeychain.setGenericPassword).toHaveBeenCalledWith('testuser', 'testpass');
    });

    it('should handle login failure', async () => {
      const error = new Error('Login failed');
      mockAuthApi.login.mockRejectedValue(error);

      const { result } = renderHook(() => useLogin(), {
        wrapper: createWrapper(),
      });

      const credentials = { username: 'testuser', password: 'wrongpass' };
      result.current.mutate(credentials);

      await waitFor(() => {
        expect(result.current.isError).toBe(true);
      });

      expect(result.current.error).toEqual(error);
    });
  });

  describe('useLogout', () => {
    it('should logout and clear all stored data', async () => {
      mockKeychain.resetGenericPassword.mockResolvedValue(true as any);

      const { result } = renderHook(() => useLogout(), {
        wrapper: createWrapper(),
      });

      await result.current();

      const { removeItem } = require('../../src/utils/storage');
      expect(removeItem).toHaveBeenCalledWith('auth_token');
      expect(removeItem).toHaveBeenCalledWith('user_data');
      expect(mockKeychain.resetGenericPassword).toHaveBeenCalled();
    });

    it('should handle keychain reset failure gracefully', async () => {
      const error = new Error('Keychain reset failed');
      mockKeychain.resetGenericPassword.mockRejectedValue(error);

      const { result } = renderHook(() => useLogout(), {
        wrapper: createWrapper(),
      });

      // Should not throw
      await expect(result.current()).resolves.not.toThrow();
    });
  });

  describe('useRestoreSession', () => {
    it('should restore session successfully', async () => {
      const mockUser = {
        id: 1,
        username: 'testuser',
        email: 'test@example.com',
        firstName: 'Test',
        lastName: 'User',
        gender: 'male',
        image: 'mock-image.jpg',
      };

      mockAuthApi.getMe.mockResolvedValue(mockUser);

      const { result } = renderHook(() => useRestoreSession(), {
        wrapper: createWrapper(),
      });

      result.current.mutate('mock-token' as any);

      await waitFor(() => {
        expect(result.current.isSuccess).toBe(true);
      });

      expect(mockAuthApi.getMe).toHaveBeenCalled();
    });

    it('should handle restore session failure', async () => {
      const error = new Error('Session restore failed');
      mockAuthApi.getMe.mockRejectedValue(error);

      const { result } = renderHook(() => useRestoreSession(), {
        wrapper: createWrapper(),
      });

      result.current.mutate('invalid-token' as any);

      await waitFor(() => {
        expect(result.current.isError).toBe(true);
      });

      expect(result.current.error).toEqual(error);
    });
  });
});
