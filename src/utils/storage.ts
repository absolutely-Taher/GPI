import { MMKV } from 'react-native-mmkv';

export const storage = new MMKV();

export const StorageKeys = {
  AUTH_TOKEN: 'auth_token',
  USER_DATA: 'user_data',
  QUERY_CACHE: 'query_cache',
} as const;

// Helper functions for storing and retrieving data
export const setItem = (key: string, value: string) => {
  storage.set(key, value);
};

export const getItem = (key: string): string | undefined => {
  return storage.getString(key);
};

export const setObject = <T>(key: string, value: T) => {
  storage.set(key, JSON.stringify(value));
};

export const getObject = <T>(key: string): T | null => {
  const item = storage.getString(key);
  return item ? JSON.parse(item) : null;
};

export const removeItem = (key: string) => {
  storage.delete(key);
};

export const clearAll = () => {
  storage.clearAll();
};

