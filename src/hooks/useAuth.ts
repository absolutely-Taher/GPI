import { useMutation } from '@tanstack/react-query';
import { authApi } from '../services/api';
import { useAppDispatch } from '../store';
import { setCredentials, logout as logoutAction } from '../store/authSlice';
import { setItem, removeItem, setObject } from '../utils/storage';
import { LoginCredentials, User } from '../types';

export const useLogin = () => {
  const dispatch = useAppDispatch();

  return useMutation({
    mutationFn: (credentials: LoginCredentials) => authApi.login(credentials),
    onSuccess: (data) => {
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

      // Update Redux state
      dispatch(setCredentials({ user, token: data.accessToken }));
    },
  });
};

export const useLogout = () => {
  const dispatch = useAppDispatch();

  return () => {
    // Clear storage
    removeItem('auth_token');
    removeItem('user_data');

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

