import { QueryClient } from '@tanstack/react-query';
import type { PersistedClient, Persister } from '@tanstack/react-query-persist-client';
import { storage } from './storage';

const CACHE_KEY = 'REACT_QUERY_OFFLINE_CACHE';

// Create a custom persister using MMKV that implements the Persister interface
export const persister: Persister = {
  persistClient: async (client: PersistedClient) => {
    try {
      storage.set(CACHE_KEY, JSON.stringify(client));
    } catch (error) {
      console.error('Failed to persist query client:', error);
    }
  },
  restoreClient: async (): Promise<PersistedClient | undefined> => {
    try {
      const cached = storage.getString(CACHE_KEY);
      if (!cached) return undefined;
      return JSON.parse(cached);
    } catch (error) {
      console.error('Failed to restore query client:', error);
      return undefined;
    }
  },
  removeClient: async () => {
    try {
      storage.delete(CACHE_KEY);
    } catch (error) {
      console.error('Failed to remove query client cache:', error);
    }
  },
};

export const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      gcTime: 1000 * 60 * 60 * 24, // 24 hours
      staleTime: 1000 * 60 * 5, // 5 minutes
      retry: 2,
      refetchOnWindowFocus: false,
      networkMode: 'offlineFirst', // Use cache when offline instead of failing
    },
  },
});

