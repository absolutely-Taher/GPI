import { useEffect, useRef, useCallback } from 'react';
import { AppState, AppStateStatus } from 'react-native';
import { useAppDispatch, useAppSelector } from '../store';
import { setLocked } from '../store/appSlice';

const LOCK_TIMEOUT = 10000; // 10 seconds

// Global ref for activity time - shared across all hook instances
const globalLastActivityTime = { current: Date.now() };

// Global function to reset timer
export const resetActivityTimer = () => {
  globalLastActivityTime.current = Date.now();
};

export const useAutoLock = () => {
  const dispatch = useAppDispatch();
  const { isAuthenticated } = useAppSelector((state) => state.auth);
  const { isLocked } = useAppSelector((state) => state.app);
  const intervalRef = useRef<NodeJS.Timeout | null>(null);
  const appState = useRef(AppState.currentState);
  
  // Store latest values in refs to avoid recreation
  const isAuthenticatedRef = useRef(isAuthenticated);
  const isLockedRef = useRef(isLocked);
  
  useEffect(() => {
    isAuthenticatedRef.current = isAuthenticated;
    isLockedRef.current = isLocked;
  }, [isAuthenticated, isLocked]);

  // Reset activity time when unlocking
  useEffect(() => {
    if (isAuthenticated && !isLocked) {
      // Reset the timer when the app becomes unlocked
      globalLastActivityTime.current = Date.now();
    }
  }, [isAuthenticated, isLocked]);

  // Check periodically if we should lock
  useEffect(() => {
    if (!isAuthenticated || isLocked) {
      return;
    }

    // Check every second if enough time has passed since last activity
    intervalRef.current = setInterval(() => {
      const timeSinceActivity = Date.now() - globalLastActivityTime.current;
      
      if (timeSinceActivity >= LOCK_TIMEOUT && isAuthenticatedRef.current && !isLockedRef.current) {
        dispatch(setLocked(true));
        if (intervalRef.current) {
          clearInterval(intervalRef.current);
          intervalRef.current = null;
        }
      }
    }, 1000); // Check every second

    return () => {
      if (intervalRef.current) {
        clearInterval(intervalRef.current);
        intervalRef.current = null;
      }
    };
  }, [isAuthenticated, isLocked, dispatch]);

  const handleAppStateChange = useCallback((nextAppState: AppStateStatus) => {
    if (
      appState.current.match(/active/) &&
      nextAppState.match(/inactive|background/)
    ) {
      // App went to background - lock immediately
      if (isAuthenticated) {
        dispatch(setLocked(true));
        if (intervalRef.current) {
          clearInterval(intervalRef.current);
          intervalRef.current = null;
        }
      }
    } else if (
      appState.current.match(/inactive|background/) &&
      nextAppState === 'active'
    ) {
      // App came to foreground - reset activity time if unlocked
      if (!isLocked) {
        globalLastActivityTime.current = Date.now();
      }
    }

    appState.current = nextAppState;
  }, [isAuthenticated, isLocked, dispatch]);

  useEffect(() => {
    const subscription = AppState.addEventListener(
      'change',
      handleAppStateChange
    );

    return () => {
      subscription.remove();
    };
  }, [handleAppStateChange]);

  return { resetTimer: resetActivityTimer };
};

