import { QueryClient } from '@tanstack/react-query';
import { createSyncStoragePersister } from '@tanstack/react-query-persist-client';
import { storage } from './storage';

// Create a custom persister using MMKV
export const clientStorage = {
  getItem: (key: string) => {
    const value = storage.getString(key);
    return value ? value : null;
  },
  setItem: (key: string, value: string) => {
    storage.set(key, value);
  },
  removeItem: (key: string) => {
    storage.delete(key);
  },
};

export const persister = createSyncStoragePersister({
  storage: clientStorage,
});

export const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      gcTime: 1000 * 60 * 60 * 24, // 24 hours
      staleTime: 1000 * 60 * 5, // 5 minutes
      retry: 2,
      refetchOnWindowFocus: false,
    },
  },
});

