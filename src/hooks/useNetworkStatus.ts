import { useEffect } from 'react';
import NetInfo from '@react-native-community/netinfo';
import { useAppDispatch } from '../store';
import { setOnline } from '../store/appSlice';

export const useNetworkStatus = () => {
  const dispatch = useAppDispatch();

  useEffect(() => {
    const unsubscribe = NetInfo.addEventListener((state) => {
      dispatch(setOnline(state.isConnected ?? false));
    });

    return () => {
      unsubscribe();
    };
  }, [dispatch]);
};

