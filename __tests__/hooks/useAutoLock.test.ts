import React from 'react';
import { renderHook, act } from '@testing-library/react-native';
import { Provider } from 'react-redux';
import { configureStore } from '@reduxjs/toolkit';
import { useAutoLock } from '../../src/hooks/useAutoLock';
import appReducer from '../../src/store/appSlice';
import authReducer from '../../src/store/authSlice';

// Mock AppState
const mockAddEventListener = jest.fn();
const mockRemoveEventListener = jest.fn();

jest.mock('react-native/Libraries/AppState/AppState', () => ({
  addEventListener: mockAddEventListener,
  removeEventListener: mockRemoveEventListener,
  currentState: 'active',
}));

// Test wrapper
const createWrapper = (initialState = {}) => {
  const store = configureStore({
    reducer: {
      app: appReducer,
      auth: authReducer,
    },
    preloadedState: initialState,
  });

  return function Wrapper({ children }: { children: React.ReactNode }) {
    return React.createElement(Provider, { store, children });
  };
};

describe('useAutoLock', () => {
  beforeEach(() => {
    jest.clearAllMocks();
    jest.useFakeTimers();
  });

  afterEach(() => {
    jest.useRealTimers();
  });

  it('should lock app after inactivity timeout', () => {
    const { result } = renderHook(() => useAutoLock(), {
      wrapper: createWrapper({
        auth: { isAuthenticated: true },
        app: { isLocked: false },
      }),
    });

    // Fast-forward time by 10 seconds (inactivity timeout)
    act(() => {
      jest.advanceTimersByTime(10000);
    });

    expect(result.current.isLocked).toBe(true);
  });

  it('should not lock app if user is not authenticated', () => {
    const { result } = renderHook(() => useAutoLock(), {
      wrapper: createWrapper({
        auth: { isAuthenticated: false },
        app: { isLocked: false },
      }),
    });

    act(() => {
      jest.advanceTimersByTime(10000);
    });

    expect(result.current.isLocked).toBe(false);
  });

  it('should reset timer on activity', () => {
    const { result } = renderHook(() => useAutoLock(), {
      wrapper: createWrapper({
        auth: { isAuthenticated: true },
        app: { isLocked: false },
      }),
    });

    // Advance time by 5 seconds
    act(() => {
      jest.advanceTimersByTime(5000);
    });

    expect(result.current.isLocked).toBe(false);

    // Reset activity timer
    act(() => {
      result.current.resetActivityTimer();
    });

    // Advance time by another 5 seconds (total 10 seconds from reset)
    act(() => {
      jest.advanceTimersByTime(5000);
    });

    expect(result.current.isLocked).toBe(true);
  });

  it('should lock app when backgrounded', () => {
    const { result } = renderHook(() => useAutoLock(), {
      wrapper: createWrapper({
        auth: { isAuthenticated: true },
        app: { isLocked: false },
      }),
    });

    // Simulate app going to background
    act(() => {
      const backgroundListener = mockAddEventListener.mock.calls.find(
        (call: any) => call[0] === 'change'
      )?.[1];
      backgroundListener?.('background');
    });

    expect(result.current.isLocked).toBe(true);
  });

  it('should unlock app when foregrounded', () => {
    const { result } = renderHook(() => useAutoLock(), {
      wrapper: createWrapper({
        auth: { isAuthenticated: true },
        app: { isLocked: true },
      }),
    });

    // Simulate app coming to foreground
    act(() => {
      const foregroundListener = mockAddEventListener.mock.calls.find(
        (call: any) => call[0] === 'change'
      )?.[1];
      foregroundListener?.('active');
    });

    expect(result.current.isLocked).toBe(false);
  });

  it('should clean up listeners on unmount', () => {
    const { unmount } = renderHook(() => useAutoLock(), {
      wrapper: createWrapper(),
    });

    unmount();

    expect(mockRemoveEventListener).toHaveBeenCalled();
  });
});
