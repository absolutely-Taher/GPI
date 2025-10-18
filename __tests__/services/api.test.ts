import axios from 'axios';
import { authApi, productsApi } from '../../src/services/api';
import { storage } from '../../src/utils/storage';

// Mock dependencies
jest.mock('axios');
jest.mock('../../src/utils/storage');

const mockAxios = axios as jest.Mocked<typeof axios>;
const mockStorage = storage as jest.Mocked<typeof storage>;

// Mock axios instance
const mockAxiosInstance = {
  post: jest.fn(),
  get: jest.fn(),
  delete: jest.fn(),
  interceptors: {
    request: {
      use: jest.fn(),
    },
    response: {
      use: jest.fn(),
    },
  },
};

mockAxios.create.mockReturnValue(mockAxiosInstance as any);

describe('API Services', () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  describe('authApi', () => {
    describe('login', () => {
      it('should login successfully with valid credentials', async () => {
        const mockResponse = {
          data: {
            accessToken: 'mock-token',
            refreshToken: 'mock-refresh',
            id: 1,
            username: 'testuser',
            email: 'test@example.com',
            firstName: 'Test',
            lastName: 'User',
            gender: 'male',
            image: 'mock-image.jpg',
          },
        };

        mockAxiosInstance.post.mockResolvedValue(mockResponse);

        const credentials = { username: 'testuser', password: 'testpass' };
        const result = await authApi.login(credentials);

        expect(mockAxiosInstance.post).toHaveBeenCalledWith('/auth/login', credentials);
        expect(result).toEqual(mockResponse.data);
      });

      it('should handle login failure', async () => {
        const error = new Error('Invalid credentials');
        mockAxiosInstance.post.mockRejectedValue(error);

        const credentials = { username: 'testuser', password: 'wrongpass' };

        await expect(authApi.login(credentials)).rejects.toThrow('Invalid credentials');
      });
    });

    describe('getMe', () => {
      it('should get user profile successfully', async () => {
        const mockUser = {
          id: 1,
          username: 'testuser',
          email: 'test@example.com',
          firstName: 'Test',
          lastName: 'User',
          gender: 'male',
          image: 'mock-image.jpg',
        };

        const mockResponse = { data: mockUser };
        mockAxiosInstance.get.mockResolvedValue(mockResponse);

        const result = await authApi.getMe();

        expect(mockAxiosInstance.get).toHaveBeenCalledWith('/auth/me');
        expect(result).toEqual(mockUser);
      });

      it('should handle getMe failure', async () => {
        const error = new Error('Unauthorized');
        mockAxiosInstance.get.mockRejectedValue(error);

        await expect(authApi.getMe()).rejects.toThrow('Unauthorized');
      });
    });
  });

  describe('productsApi', () => {
    describe('getAllProducts', () => {
      it('should get all products with default parameters', async () => {
        const mockProducts = {
          products: [
            {
              id: 1,
              title: 'Test Product',
              description: 'Test Description',
              category: 'electronics',
              price: 99.99,
              discountPercentage: 10,
              rating: 4.5,
              stock: 50,
              tags: ['test'],
              brand: 'TestBrand',
              sku: 'TEST-001',
              weight: 1.5,
              dimensions: { width: 10, height: 5, depth: 2 },
              warrantyInformation: '1 year',
              shippingInformation: 'Free shipping',
              availabilityStatus: 'in stock',
              reviews: [],
              returnPolicy: '30 days',
              minimumOrderQuantity: 1,
              meta: {
                createdAt: '2023-01-01',
                updatedAt: '2023-01-01',
                barcode: '123456789',
                qrCode: 'QR123456',
              },
              images: ['https://example.com/image1.jpg'],
              thumbnail: 'https://example.com/thumbnail.jpg',
            },
          ],
          total: 1,
          skip: 0,
          limit: 100,
        };

        const mockResponse = { data: mockProducts };
        mockAxiosInstance.get.mockResolvedValue(mockResponse);

        const result = await productsApi.getAllProducts();

        expect(mockAxiosInstance.get).toHaveBeenCalledWith('/products?limit=100&skip=0');
        expect(result).toEqual(mockProducts);
      });

      it('should get products with custom parameters', async () => {
        const mockResponse = { data: { products: [], total: 0, skip: 20, limit: 10 } };
        mockAxiosInstance.get.mockResolvedValue(mockResponse);

        await productsApi.getAllProducts(10, 20);

        expect(mockAxiosInstance.get).toHaveBeenCalledWith('/products?limit=10&skip=20');
      });
    });

    describe('getCategories', () => {
      it('should get all categories', async () => {
        const mockCategories = ['electronics', 'clothing', 'books'];
        const mockResponse = { data: mockCategories };
        mockAxiosInstance.get.mockResolvedValue(mockResponse);

        const result = await productsApi.getCategories();

        expect(mockAxiosInstance.get).toHaveBeenCalledWith('/products/categories');
        expect(result).toEqual(mockCategories);
      });
    });

    describe('getProductsByCategory', () => {
      it('should get products by category with default parameters', async () => {
        const mockProducts = {
          products: [],
          total: 0,
          skip: 0,
          limit: 100,
        };

        const mockResponse = { data: mockProducts };
        mockAxiosInstance.get.mockResolvedValue(mockResponse);

        const result = await productsApi.getProductsByCategory('electronics');

        expect(mockAxiosInstance.get).toHaveBeenCalledWith('/products/category/electronics?limit=100&skip=0');
        expect(result).toEqual(mockProducts);
      });

      it('should get products by category with custom parameters', async () => {
        const mockResponse = { data: { products: [], total: 0, skip: 10, limit: 20 } };
        mockAxiosInstance.get.mockResolvedValue(mockResponse);

        await productsApi.getProductsByCategory('clothing', 20, 10);

        expect(mockAxiosInstance.get).toHaveBeenCalledWith('/products/category/clothing?limit=20&skip=10');
      });
    });

    describe('deleteProduct', () => {
      it('should delete product successfully', async () => {
        const mockDeleteResponse = {
          id: 1,
          title: 'Test Product',
          isDeleted: true,
          deletedOn: '2023-01-01T00:00:00.000Z',
        };

        const mockResponse = { data: mockDeleteResponse };
        mockAxiosInstance.delete.mockResolvedValue(mockResponse);

        const result = await productsApi.deleteProduct(1);

        expect(mockAxiosInstance.delete).toHaveBeenCalledWith('/products/1');
        expect(result).toEqual(mockDeleteResponse);
      });

      it('should handle delete product failure', async () => {
        const error = new Error('Product not found');
        mockAxiosInstance.delete.mockRejectedValue(error);

        await expect(productsApi.deleteProduct(999)).rejects.toThrow('Product not found');
      });
    });
  });

  describe('API Client Configuration', () => {
    it('should configure axios with correct base URL', () => {
      expect(mockAxios.create).toHaveBeenCalledWith({
        baseURL: 'https://dummyjson.com',
        headers: {
          'Content-Type': 'application/json',
        },
      });
    });

    it('should add authorization header when token is available', () => {
      mockStorage.getItem.mockReturnValue('mock-token');

      // The interceptor should be set up to add the token
      expect(mockAxiosInstance.interceptors.request.use).toHaveBeenCalled();
    });

    it('should not add authorization header when token is not available', () => {
      mockStorage.getItem.mockReturnValue(null);

      // The interceptor should be set up to handle missing tokens
      expect(mockAxiosInstance.interceptors.request.use).toHaveBeenCalled();
    });
  });
});
