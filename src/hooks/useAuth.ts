import { useMutation } from '@tanstack/react-query';
import * as Keychain from 'react-native-keychain';
import { authApi } from '../services/api';
import { useAppDispatch } from '../store';
import { setCredentials, logout as logoutAction } from '../store/authSlice';
import { setItem, removeItem, setObject } from '../utils/storage';
import { LoginCredentials, User } from '../types';

export const useLogin = () => {
  const dispatch = useAppDispatch();

  return useMutation({
    mutationFn: (credentials: LoginCredentials) => authApi.login(credentials),
    onSuccess: async (data, variables) => {
      console.log('=== useLogin onSuccess ===');
      console.log('Login data:', data);
      console.log('Login variables:', variables);
      
      const user: User = {
        id: data.id,
        username: data.username,
        email: data.email,
        firstName: data.firstName,
        lastName: data.lastName,
        gender: data.gender,
        image: data.image,
      };

      // Store credentials
      setItem('auth_token', data.accessToken);
      setObject('user_data', user);

      // Save password to keychain for biometric fallback
      console.log('Saving credentials to keychain from useLogin...');
      try {
        await Keychain.setGenericPassword(variables.username, variables.password);
        console.log('Credentials saved to keychain successfully from useLogin');
        
        // Verify the save
        const verification = await Keychain.getGenericPassword();
        if (verification) {
          console.log('Verification from useLogin - username:', verification.username);
          console.log('Verification from useLogin - password length:', verification.password.length);
        }
      } catch (error) {
        console.error('Failed to save credentials to keychain from useLogin:', error);
      }

      // Update Redux state
      dispatch(setCredentials({ user, token: data.accessToken }));
    },
  });
};

export const useLogout = () => {
  const dispatch = useAppDispatch();

  return async () => {
    console.log('=== LOGOUT ===');
    // Clear storage
    removeItem('auth_token');
    removeItem('user_data');

    // Clear keychain credentials
    try {
      await Keychain.resetGenericPassword();
      console.log('Keychain credentials cleared');
    } catch (error) {
      console.error('Failed to clear keychain:', error);
    }

    // Update Redux state
    dispatch(logoutAction());
  };
};

export const useRestoreSession = () => {
  const dispatch = useAppDispatch();

  return useMutation({
    mutationFn: async () => {
      return await authApi.getMe();
    },
    onSuccess: (user, variables) => {
      const token = variables as any; // Token is passed as context
      dispatch(setCredentials({ user, token }));
    },
  });
};

