import axios from 'axios';
import {
  AuthResponse,
  LoginCredentials,
  User,
  ProductsResponse,
  DeleteProductResponse,
} from '../types';
import { getItem } from '../utils/storage';

const API_BASE_URL = 'https://dummyjson.com';

const apiClient = axios.create({
  baseURL: API_BASE_URL,
  headers: {
    'Content-Type': 'application/json',
  },
});

// Add token to requests
apiClient.interceptors.request.use((config) => {
  const token = getItem('auth_token');
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

// Auth APIs
export const authApi = {
  login: async (credentials: LoginCredentials): Promise<AuthResponse> => {
    const response = await apiClient.post<AuthResponse>(
      '/auth/login',
      credentials
    );
    return response.data;
  },

  getMe: async (): Promise<User> => {
    const response = await apiClient.get<User>('/auth/me');
    return response.data;
  },
};

// Products APIs
export const productsApi = {
  getAllProducts: async (limit = 100, skip = 0): Promise<ProductsResponse> => {
    const response = await apiClient.get<ProductsResponse>(
      `/products?limit=${limit}&skip=${skip}`
    );
    return response.data;
  },

  getCategories: async (): Promise<string[]> => {
    const response = await apiClient.get<string[]>('/products/categories');
    return response.data;
  },

  getProductsByCategory: async (
    category: string,
    limit = 100,
    skip = 0
  ): Promise<ProductsResponse> => {
    const response = await apiClient.get<ProductsResponse>(
      `/products/category/${category}?limit=${limit}&skip=${skip}`
    );
    return response.data;
  },

  deleteProduct: async (id: number): Promise<DeleteProductResponse> => {
    const response = await apiClient.delete<DeleteProductResponse>(
      `/products/${id}`
    );
    return response.data;
  },
};

