import { storage, getItem, setItem, removeItem, getObject, setObject } from '../../src/utils/storage';

// Mock MMKV
const mockMMKV = {
  getString: jest.fn(),
  set: jest.fn(),
  delete: jest.fn(),
  getNumber: jest.fn(),
  setNumber: jest.fn(),
  getBoolean: jest.fn(),
  setBoolean: jest.fn(),
  getAllKeys: jest.fn(),
  clearAll: jest.fn(),
};

jest.mock('react-native-mmkv', () => ({
  MMKV: jest.fn(() => mockMMKV),
}));

describe('Storage Utils', () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  describe('getItem', () => {
    it('should get string value from storage', () => {
      mockMMKV.getString.mockReturnValue('test-value');

      const result = getItem('test-key');

      expect(mockMMKV.getString).toHaveBeenCalledWith('test-key');
      expect(result).toBe('test-value');
    });

    it('should return undefined for non-existent key', () => {
      mockMMKV.getString.mockReturnValue(undefined);

      const result = getItem('non-existent-key');

      expect(result).toBeUndefined();
    });

    it('should handle null values', () => {
      mockMMKV.getString.mockReturnValue(null);

      const result = getItem('null-key');

      expect(result).toBeNull();
    });
  });

  describe('setItem', () => {
    it('should set string value in storage', () => {
      setItem('test-key', 'test-value');

      expect(mockMMKV.set).toHaveBeenCalledWith('test-key', 'test-value');
    });

    it('should handle empty string values', () => {
      setItem('empty-key', '');

      expect(mockMMKV.set).toHaveBeenCalledWith('empty-key', '');
    });

    it('should handle special characters in values', () => {
      const specialValue = 'test@#$%^&*()_+{}|:"<>?[]\\;\',./';
      setItem('special-key', specialValue);

      expect(mockMMKV.set).toHaveBeenCalledWith('special-key', specialValue);
    });
  });

  describe('removeItem', () => {
    it('should remove item from storage', () => {
      removeItem('test-key');

      expect(mockMMKV.delete).toHaveBeenCalledWith('test-key');
    });

    it('should handle removing non-existent key', () => {
      removeItem('non-existent-key');

      expect(mockMMKV.delete).toHaveBeenCalledWith('non-existent-key');
    });
  });

  describe('getObject', () => {
    it('should get and parse JSON object from storage', () => {
      const mockObject = { name: 'John', age: 30, city: 'New York' };
      mockMMKV.getString.mockReturnValue(JSON.stringify(mockObject));

      const result = getObject('object-key');

      expect(mockMMKV.getString).toHaveBeenCalledWith('object-key');
      expect(result).toEqual(mockObject);
    });

    it('should return undefined for non-existent key', () => {
      mockMMKV.getString.mockReturnValue(undefined);

      const result = getObject('non-existent-key');

      expect(result).toBeUndefined();
    });

    it('should handle invalid JSON gracefully', () => {
      mockMMKV.getString.mockReturnValue('invalid-json');

      const result = getObject('invalid-key');

      expect(result).toBeUndefined();
    });

    it('should handle null values', () => {
      mockMMKV.getString.mockReturnValue(null);

      const result = getObject('null-key');

      expect(result).toBeNull();
    });

    it('should handle complex nested objects', () => {
      const complexObject = {
        user: {
          id: 1,
          profile: {
            name: 'John Doe',
            preferences: {
              theme: 'dark',
              notifications: true,
            },
          },
        },
        metadata: {
          createdAt: '2023-01-01',
          updatedAt: '2023-01-02',
        },
      };
      mockMMKV.getString.mockReturnValue(JSON.stringify(complexObject));

      const result = getObject('complex-key');

      expect(result).toEqual(complexObject);
    });
  });

  describe('setObject', () => {
    it('should stringify and store object in storage', () => {
      const testObject = { name: 'John', age: 30 };

      setObject('object-key', testObject);

      expect(mockMMKV.set).toHaveBeenCalledWith('object-key', JSON.stringify(testObject));
    });

    it('should handle null objects', () => {
      setObject('null-key', null);

      expect(mockMMKV.set).toHaveBeenCalledWith('null-key', 'null');
    });

    it('should handle undefined objects', () => {
      setObject('undefined-key', undefined);

      expect(mockMMKV.set).toHaveBeenCalledWith('undefined-key', 'undefined');
    });

    it('should handle complex nested objects', () => {
      const complexObject = {
        user: {
          id: 1,
          profile: {
            name: 'John Doe',
            preferences: {
              theme: 'dark',
              notifications: true,
            },
          },
        },
        metadata: {
          createdAt: '2023-01-01',
          updatedAt: '2023-01-02',
        },
      };

      setObject('complex-key', complexObject);

      expect(mockMMKV.set).toHaveBeenCalledWith('complex-key', JSON.stringify(complexObject));
    });

    it('should handle arrays', () => {
      const arrayObject = [1, 2, 3, { name: 'test' }, [4, 5, 6]];

      setObject('array-key', arrayObject);

      expect(mockMMKV.set).toHaveBeenCalledWith('array-key', JSON.stringify(arrayObject));
    });
  });

  describe('storage instance', () => {
    it('should provide access to MMKV instance methods', () => {
      expect(storage).toBeDefined();
      expect(typeof storage.getString).toBe('function');
      expect(typeof storage.set).toBe('function');
      expect(typeof storage.delete).toBe('function');
    });

    it('should handle getAllKeys', () => {
      const mockKeys = ['key1', 'key2', 'key3'];
      mockMMKV.getAllKeys.mockReturnValue(mockKeys);

      const keys = storage.getAllKeys();

      expect(mockMMKV.getAllKeys).toHaveBeenCalled();
      expect(keys).toEqual(mockKeys);
    });

    it('should handle clearAll', () => {
      storage.clearAll();

      expect(mockMMKV.clearAll).toHaveBeenCalled();
    });
  });

  describe('error handling', () => {
    it('should handle storage errors gracefully in getItem', () => {
      mockMMKV.getString.mockImplementation(() => {
        throw new Error('Storage error');
      });

      expect(() => getItem('error-key')).toThrow('Storage error');
    });

    it('should handle storage errors gracefully in setItem', () => {
      mockMMKV.set.mockImplementation(() => {
        throw new Error('Storage error');
      });

      expect(() => setItem('error-key', 'value')).toThrow('Storage error');
    });

    it('should handle JSON parsing errors in getObject', () => {
      mockMMKV.getString.mockReturnValue('{"invalid": json}');

      const result = getObject('invalid-json-key');

      expect(result).toBeUndefined();
    });
  });
});
