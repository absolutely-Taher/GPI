import React from 'react';
import { render, fireEvent, waitFor } from '@testing-library/react-native';
import { Provider } from 'react-redux';
import { configureStore } from '@reduxjs/toolkit';
import { LockScreen } from '../../src/components/LockScreen';
import authReducer from '../../src/store/authSlice';
import appReducer from '../../src/store/appSlice';

// Mock dependencies
jest.mock('../../src/theme/ThemeContext', () => ({
  useTheme: () => ({
    theme: {
      background: '#000000',
      surface: '#FFFFFF',
      text: '#000000',
      textSecondary: '#666666',
      primary: '#007AFF',
      error: '#FF3B30',
    },
  }),
}));

jest.mock('../../src/hooks/useBiometrics', () => ({
  useBiometrics: () => ({
    isAvailable: true,
    biometryType: 'TouchID',
    authenticate: jest.fn().mockResolvedValue(true),
  }),
}));

// Test wrapper
const createWrapper = (initialState = {}) => {
  const store = configureStore({
    reducer: {
      auth: authReducer,
      app: appReducer,
    },
    preloadedState: initialState,
  });

  return function Wrapper({ children }: { children: React.ReactNode }) {
    return (
      <Provider store={store}>
        {children}
      </Provider>
    );
  };
};

describe('LockScreen', () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  it('should render lock screen with biometric prompt', () => {
    const { getByText, getByTestId } = render(
      <LockScreen />,
      { 
        wrapper: createWrapper({
          auth: { isAuthenticated: true },
          app: { isLocked: true },
        })
      }
    );

    expect(getByText('App Locked')).toBeTruthy();
    expect(getByText('Use biometric authentication to unlock')).toBeTruthy();
    expect(getByTestId('biometric-button')).toBeTruthy();
  });

  it('should show password fallback option', () => {
    const { getByText } = render(
      <LockScreen />,
      { 
        wrapper: createWrapper({
          auth: { isAuthenticated: true },
          app: { isLocked: true },
        })
      }
    );

    expect(getByText('Use Password Instead')).toBeTruthy();
  });

  it('should handle biometric authentication', async () => {
    const mockAuthenticate = jest.fn().mockResolvedValue(true);
    
    jest.doMock('../../src/hooks/useBiometrics', () => ({
      useBiometrics: () => ({
        isAvailable: true,
        biometryType: 'TouchID',
        authenticate: mockAuthenticate,
      }),
    }));

    const { getByTestId } = render(
      <LockScreen />,
      { 
        wrapper: createWrapper({
          auth: { isAuthenticated: true },
          app: { isLocked: true },
        })
      }
    );

    fireEvent.press(getByTestId('biometric-button'));

    await waitFor(() => {
      expect(mockAuthenticate).toHaveBeenCalledWith('Unlock with biometric authentication');
    });
  });

  it('should show password input when fallback is selected', () => {
    const { getByText, getByTestId } = render(
      <LockScreen />,
      { 
        wrapper: createWrapper({
          auth: { isAuthenticated: true },
          app: { isLocked: true },
        })
      }
    );

    fireEvent.press(getByText('Use Password Instead'));

    expect(getByTestId('password-input')).toBeTruthy();
    expect(getByText('Enter your password')).toBeTruthy();
  });

  it('should handle password authentication', async () => {
    const { getByText, getByTestId } = render(
      <LockScreen />,
      { 
        wrapper: createWrapper({
          auth: { isAuthenticated: true },
          app: { isLocked: true },
        })
      }
    );

    // Switch to password mode
    fireEvent.press(getByText('Use Password Instead'));

    // Enter password
    const passwordInput = getByTestId('password-input');
    fireEvent.changeText(passwordInput, 'testpassword');

    // Submit password
    fireEvent.press(getByTestId('unlock-button'));

    await waitFor(() => {
      // Should attempt to unlock
      expect(getByTestId('unlock-button')).toBeTruthy();
    });
  });

  it('should show error for incorrect password', async () => {
    const { getByText, getByTestId } = render(
      <LockScreen />,
      { 
        wrapper: createWrapper({
          auth: { isAuthenticated: true },
          app: { isLocked: true },
        })
      }
    );

    // Switch to password mode
    fireEvent.press(getByText('Use Password Instead'));

    // Enter incorrect password
    const passwordInput = getByTestId('password-input');
    fireEvent.changeText(passwordInput, 'wrongpassword');

    // Submit password
    fireEvent.press(getByTestId('unlock-button'));

    await waitFor(() => {
      expect(getByText('Incorrect password')).toBeTruthy();
    });
  });

  it('should show biometric icon based on biometry type', () => {
    const { getByTestId } = render(
      <LockScreen />,
      { 
        wrapper: createWrapper({
          auth: { isAuthenticated: true },
          app: { isLocked: true },
        })
      }
    );

    const biometricIcon = getByTestId('biometric-icon');
    expect(biometricIcon).toBeTruthy();
  });

  it('should handle biometric authentication failure', async () => {
    const mockAuthenticate = jest.fn().mockResolvedValue(false);
    
    jest.doMock('../../src/hooks/useBiometrics', () => ({
      useBiometrics: () => ({
        isAvailable: true,
        biometryType: 'FaceID',
        authenticate: mockAuthenticate,
      }),
    }));

    const { getByTestId } = render(
      <LockScreen />,
      { 
        wrapper: createWrapper({
          auth: { isAuthenticated: true },
          app: { isLocked: true },
        })
      }
    );

    fireEvent.press(getByTestId('biometric-button'));

    await waitFor(() => {
      expect(mockAuthenticate).toHaveBeenCalled();
    });
  });

  it('should not render when app is not locked', () => {
    const { queryByText } = render(
      <LockScreen />,
      { 
        wrapper: createWrapper({
          auth: { isAuthenticated: true },
          app: { isLocked: false },
        })
      }
    );

    expect(queryByText('App Locked')).toBeNull();
  });

  it('should not render when user is not authenticated', () => {
    const { queryByText } = render(
      <LockScreen />,
      { 
        wrapper: createWrapper({
          auth: { isAuthenticated: false },
          app: { isLocked: true },
        })
      }
    );

    expect(queryByText('App Locked')).toBeNull();
  });
});
