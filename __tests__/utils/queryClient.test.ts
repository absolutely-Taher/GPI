import { QueryClient } from '@tanstack/react-query';
import { persister, queryClient } from '../../src/utils/queryClient';
import { storage } from '../../src/utils/storage';

// Mock storage
jest.mock('../../src/utils/storage', () => ({
  storage: {
    set: jest.fn(),
    getString: jest.fn(),
    delete: jest.fn(),
  },
}));

const mockStorage = storage as jest.Mocked<typeof storage>;

describe('Query Client Configuration', () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  describe('persister', () => {
    it('should persist client data to storage', async () => {
      const mockClient = {
        clientState: {
          queries: [],
          mutations: [],
        },
        buster: 'test-buster',
        timestamp: Date.now(),
      };

      await persister.persistClient(mockClient);

      expect(mockStorage.set).toHaveBeenCalledWith(
        'REACT_QUERY_OFFLINE_CACHE',
        JSON.stringify(mockClient)
      );
    });

    it('should handle persist errors gracefully', async () => {
      const mockClient = {
        clientState: { queries: [], mutations: [] },
        buster: 'test-buster',
        timestamp: Date.now(),
      };

      mockStorage.set.mockImplementation(() => {
        throw new Error('Storage error');
      });

      // Should not throw
      await expect(persister.persistClient(mockClient)).resolves.not.toThrow();
    });

    it('should restore client data from storage', async () => {
      const mockClientData = {
        clientState: {
          queries: [
            {
              queryKey: ['products'],
              queryHash: 'products-hash',
              state: {
                status: 'success',
                data: { products: [] },
                dataUpdatedAt: Date.now(),
              },
            },
          ],
          mutations: [],
        },
        buster: 'test-buster',
        timestamp: Date.now(),
      };

      mockStorage.getString.mockReturnValue(JSON.stringify(mockClientData));

      const result = await persister.restoreClient();

      expect(mockStorage.getString).toHaveBeenCalledWith('REACT_QUERY_OFFLINE_CACHE');
      expect(result).toEqual(mockClientData);
    });

    it('should return undefined when no cached data exists', async () => {
      mockStorage.getString.mockReturnValue(undefined);

      const result = await persister.restoreClient();

      expect(result).toBeUndefined();
    });

    it('should return undefined for invalid JSON', async () => {
      mockStorage.getString.mockReturnValue('invalid-json');

      const result = await persister.restoreClient();

      expect(result).toBeUndefined();
    });

    it('should handle restore errors gracefully', async () => {
      mockStorage.getString.mockImplementation(() => {
        throw new Error('Storage error');
      });

      const result = await persister.restoreClient();

      expect(result).toBeUndefined();
    });

    it('should remove client data from storage', async () => {
      await persister.removeClient();

      expect(mockStorage.delete).toHaveBeenCalledWith('REACT_QUERY_OFFLINE_CACHE');
    });

    it('should handle remove errors gracefully', async () => {
      mockStorage.delete.mockImplementation(() => {
        throw new Error('Storage error');
      });

      // Should not throw
      await expect(persister.removeClient()).resolves.not.toThrow();
    });
  });

  describe('queryClient configuration', () => {
    it('should have correct default options', () => {
      expect(queryClient).toBeInstanceOf(QueryClient);
    });

    it('should have offline-first network mode', () => {
      const defaultOptions = queryClient.getDefaultOptions();
      
      expect(defaultOptions.queries?.networkMode).toBe('offlineFirst');
    });

    it('should have appropriate cache and stale times', () => {
      const defaultOptions = queryClient.getDefaultOptions();
      
      expect(defaultOptions.queries?.gcTime).toBe(1000 * 60 * 60 * 24); // 24 hours
      expect(defaultOptions.queries?.staleTime).toBe(1000 * 60 * 5); // 5 minutes
    });

    it('should have retry configuration', () => {
      const defaultOptions = queryClient.getDefaultOptions();
      
      expect(defaultOptions.queries?.retry).toBe(2);
    });

    it('should not refetch on window focus', () => {
      const defaultOptions = queryClient.getDefaultOptions();
      
      expect(defaultOptions.queries?.refetchOnWindowFocus).toBe(false);
    });
  });

  describe('persister integration', () => {
    it('should handle complex client state', async () => {
      const complexClient = {
        clientState: {
          queries: [
            {
              queryKey: ['products', { category: 'electronics' }],
              queryHash: 'products-electronics-hash',
              state: {
                status: 'success',
                data: {
                  products: [
                    { id: 1, name: 'Laptop', price: 999 },
                    { id: 2, name: 'Phone', price: 699 },
                  ],
                },
                dataUpdatedAt: Date.now(),
              },
            },
            {
              queryKey: ['user'],
              queryHash: 'user-hash',
              state: {
                status: 'success',
                data: { id: 1, name: 'John Doe' },
                dataUpdatedAt: Date.now(),
              },
            },
          ],
          mutations: [
            {
              mutationKey: ['deleteProduct'],
              mutationHash: 'delete-product-hash',
              state: {
                status: 'success',
                data: { id: 1, deleted: true },
                dataUpdatedAt: Date.now(),
              },
            },
          ],
        },
        buster: 'complex-buster',
        timestamp: Date.now(),
      };

      await persister.persistClient(complexClient);

      expect(mockStorage.set).toHaveBeenCalledWith(
        'REACT_QUERY_OFFLINE_CACHE',
        JSON.stringify(complexClient)
      );

      mockStorage.getString.mockReturnValue(JSON.stringify(complexClient));

      const restored = await persister.restoreClient();

      expect(restored).toEqual(complexClient);
    });

    it('should handle empty client state', async () => {
      const emptyClient = {
        clientState: {
          queries: [],
          mutations: [],
        },
        buster: 'empty-buster',
        timestamp: Date.now(),
      };

      await persister.persistClient(emptyClient);

      expect(mockStorage.set).toHaveBeenCalledWith(
        'REACT_QUERY_OFFLINE_CACHE',
        JSON.stringify(emptyClient)
      );
    });
  });
});
