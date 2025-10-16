import { useEffect, useRef } from 'react';
import { AppState, AppStateStatus } from 'react-native';
import { useAppDispatch, useAppSelector } from '../store';
import { setLocked } from '../store/appSlice';

const LOCK_TIMEOUT = 10000; // 10 seconds

export const useAutoLock = () => {
  const dispatch = useAppDispatch();
  const { isAuthenticated } = useAppSelector((state) => state.auth);
  const timerRef = useRef<NodeJS.Timeout | null>(null);
  const appState = useRef(AppState.currentState);

  const resetTimer = () => {
    if (timerRef.current) {
      clearTimeout(timerRef.current);
    }

    if (isAuthenticated) {
      timerRef.current = setTimeout(() => {
        dispatch(setLocked(true));
      }, LOCK_TIMEOUT);
    }
  };

  const handleAppStateChange = (nextAppState: AppStateStatus) => {
    if (
      appState.current.match(/active/) &&
      nextAppState.match(/inactive|background/)
    ) {
      // App went to background - lock immediately
      if (isAuthenticated) {
        dispatch(setLocked(true));
      }
    } else if (
      appState.current.match(/inactive|background/) &&
      nextAppState === 'active'
    ) {
      // App came to foreground - reset timer
      resetTimer();
    }

    appState.current = nextAppState;
  };

  useEffect(() => {
    const subscription = AppState.addEventListener(
      'change',
      handleAppStateChange
    );

    // Start timer on mount
    resetTimer();

    return () => {
      if (timerRef.current) {
        clearTimeout(timerRef.current);
      }
      subscription.remove();
    };
  }, [isAuthenticated]);

  return { resetTimer };
};

