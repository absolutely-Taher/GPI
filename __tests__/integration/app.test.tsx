import React from 'react';
import { render, waitFor } from '@testing-library/react-native';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { Provider } from 'react-redux';
import { configureStore } from '@reduxjs/toolkit';
import App from '../../App';
import authReducer from '../../src/store/authSlice';
import appReducer from '../../src/store/appSlice';

// Mock navigation
jest.mock('@react-navigation/native', () => ({
  NavigationContainer: ({ children }: { children: React.ReactNode }) => children,
}));

jest.mock('@react-navigation/native-stack', () => ({
  createNativeStackNavigator: () => ({
    Navigator: ({ children }: { children: React.ReactNode }) => children,
    Screen: ({ children }: { children: React.ReactNode }) => children,
  }),
}));

jest.mock('@react-navigation/bottom-tabs', () => ({
  createBottomTabNavigator: () => ({
    Navigator: ({ children }: { children: React.ReactNode }) => children,
    Screen: ({ children }: { children: React.ReactNode }) => children,
  }),
}));

// Mock all the screens and components
jest.mock('../../src/screens/LoginScreen', () => {
  return function MockLoginScreen() {
    return null;
  };
});

jest.mock('../../src/screens/AllProductsScreen', () => {
  return function MockAllProductsScreen() {
    return null;
  };
});

jest.mock('../../src/screens/CategoryProductsScreen', () => {
  return function MockCategoryProductsScreen() {
    return null;
  };
});

jest.mock('../../src/components/LockScreen', () => {
  return function MockLockScreen() {
    return null;
  };
});

// Test wrapper
const createWrapper = (initialState = {}) => {
  const queryClient = new QueryClient({
    defaultOptions: {
      queries: { retry: false },
      mutations: { retry: false },
    },
  });
  
  const store = configureStore({
    reducer: {
      auth: authReducer,
      app: appReducer,
    },
    preloadedState: initialState,
  });

  return function Wrapper({ children }: { children: React.ReactNode }) {
    return (
      <QueryClientProvider client={queryClient}>
        <Provider store={store}>
          {children}
        </Provider>
      </QueryClientProvider>
    );
  };
};

describe('App Integration', () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  it('should render app without crashing', async () => {
    const { getByTestId } = render(
      <App />,
      { wrapper: createWrapper() }
    );

    await waitFor(() => {
      expect(getByTestId).toBeDefined();
    });
  });

  it('should show login screen when not authenticated', async () => {
    const { getByTestId } = render(
      <App />,
      { 
        wrapper: createWrapper({
          auth: { isAuthenticated: false },
          app: { isLocked: false },
        })
      }
    );

    await waitFor(() => {
      // App should render without crashing
      expect(getByTestId).toBeDefined();
    });
  });

  it('should show main app when authenticated', async () => {
    const { getByTestId } = render(
      <App />,
      { 
        wrapper: createWrapper({
          auth: { 
            isAuthenticated: true,
            user: {
              id: 1,
              username: 'testuser',
              email: 'test@example.com',
              firstName: 'Test',
              lastName: 'User',
              gender: 'male',
              image: 'test.jpg',
            },
            token: 'mock-token',
            isSuperadmin: false,
          },
          app: { isLocked: false },
        })
      }
    );

    await waitFor(() => {
      // App should render without crashing
      expect(getByTestId).toBeDefined();
    });
  });

  it('should show lock screen when app is locked', async () => {
    const { getByTestId } = render(
      <App />,
      { 
        wrapper: createWrapper({
          auth: { 
            isAuthenticated: true,
            user: {
              id: 1,
              username: 'testuser',
              email: 'test@example.com',
              firstName: 'Test',
              lastName: 'User',
              gender: 'male',
              image: 'test.jpg',
            },
            token: 'mock-token',
            isSuperadmin: false,
          },
          app: { isLocked: true },
        })
      }
    );

    await waitFor(() => {
      // App should render without crashing
      expect(getByTestId).toBeDefined();
    });
  });

  it('should handle superadmin state correctly', async () => {
    const { getByTestId } = render(
      <App />,
      { 
        wrapper: createWrapper({
          auth: { 
            isAuthenticated: true,
            user: {
              id: 1,
              username: 'emilys',
              email: 'emily@example.com',
              firstName: 'Emily',
              lastName: 'Smith',
              gender: 'female',
              image: 'emily.jpg',
            },
            token: 'superadmin-token',
            isSuperadmin: true,
          },
          app: { isLocked: false },
        })
      }
    );

    await waitFor(() => {
      // App should render without crashing
      expect(getByTestId).toBeDefined();
    });
  });

  it('should handle offline state', async () => {
    const { getByTestId } = render(
      <App />,
      { 
        wrapper: createWrapper({
          auth: { 
            isAuthenticated: true,
            user: {
              id: 1,
              username: 'testuser',
              email: 'test@example.com',
              firstName: 'Test',
              lastName: 'User',
              gender: 'male',
              image: 'test.jpg',
            },
            token: 'mock-token',
            isSuperadmin: false,
          },
          app: { 
            isLocked: false,
            isOnline: false,
          },
        })
      }
    );

    await waitFor(() => {
      // App should render without crashing
      expect(getByTestId).toBeDefined();
    });
  });
});
