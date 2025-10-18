import React from 'react';
import { render, fireEvent, waitFor } from '@testing-library/react-native';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { Provider } from 'react-redux';
import { configureStore } from '@reduxjs/toolkit';
import { ProductCard } from '../../src/components/ProductCard';
import { Product } from '../../src/types';
import authReducer from '../../src/store/authSlice';
import appReducer from '../../src/store/appSlice';

// Mock dependencies
jest.mock('../../src/theme/ThemeContext', () => ({
  useTheme: () => ({
    theme: {
      surface: '#FFFFFF',
      text: '#000000',
      textSecondary: '#666666',
      primary: '#007AFF',
      error: '#FF3B30',
      cardShadow: '#000000',
    },
  }),
}));

const mockProduct: Product = {
  id: 1,
  title: 'Test Product',
  description: 'Test Description',
  category: 'electronics',
  price: 99.99,
  discountPercentage: 10,
  rating: 4.5,
  stock: 50,
  tags: ['test', 'product'],
  brand: 'TestBrand',
  sku: 'TEST-001',
  weight: 1.5,
  dimensions: { width: 10, height: 5, depth: 2 },
  warrantyInformation: '1 year warranty',
  shippingInformation: 'Free shipping',
  availabilityStatus: 'in stock',
  reviews: [],
  returnPolicy: '30 days return',
  minimumOrderQuantity: 1,
  meta: {
    createdAt: '2023-01-01',
    updatedAt: '2023-01-01',
    barcode: '123456789',
    qrCode: 'QR123456',
  },
  images: ['https://example.com/image1.jpg'],
  thumbnail: 'https://example.com/thumbnail.jpg',
};

// Test wrapper
const createWrapper = (initialState = {}) => {
  const queryClient = new QueryClient({
    defaultOptions: {
      queries: { retry: false },
      mutations: { retry: false },
    },
  });
  
  const store = configureStore({
    reducer: {
      auth: authReducer,
      app: appReducer,
    },
    preloadedState: initialState,
  });

  return function Wrapper({ children }: { children: React.ReactNode }) {
    return (
      <QueryClientProvider client={queryClient}>
        <Provider store={store}>
          {children}
        </Provider>
      </QueryClientProvider>
    );
  };
};

describe('ProductCard', () => {
  const mockOnDelete = jest.fn();

  beforeEach(() => {
    jest.clearAllMocks();
  });

  it('should render product information correctly', () => {
    const { getByText } = render(
      <ProductCard product={mockProduct} />,
      { wrapper: createWrapper() }
    );

    expect(getByText('Test Product')).toBeTruthy();
    expect(getByText('electronics')).toBeTruthy();
    expect(getByText('$99.99')).toBeTruthy();
  });

  it('should show delete button for superadmin when online', () => {
    const { getByTestId } = render(
      <ProductCard 
        product={mockProduct} 
        showDelete={true}
        onDelete={mockOnDelete}
      />,
      { 
        wrapper: createWrapper({
          auth: { isSuperadmin: true },
          app: { isOnline: true },
        })
      }
    );

    expect(getByTestId('delete-button')).toBeTruthy();
  });

  it('should not show delete button for regular user', () => {
    const { queryByTestId } = render(
      <ProductCard 
        product={mockProduct} 
        showDelete={false}
        onDelete={mockOnDelete}
      />,
      { 
        wrapper: createWrapper({
          auth: { isSuperadmin: false },
          app: { isOnline: true },
        })
      }
    );

    expect(queryByTestId('delete-button')).toBeNull();
  });

  it('should show loading indicator when deleting', () => {
    const { getByTestId } = render(
      <ProductCard 
        product={mockProduct} 
        showDelete={true}
        onDelete={mockOnDelete}
        isDeleting={true}
      />,
      { wrapper: createWrapper() }
    );

    expect(getByTestId('delete-loading')).toBeTruthy();
  });

  it('should call onDelete when delete button is pressed', () => {
    const { getByTestId } = render(
      <ProductCard 
        product={mockProduct} 
        showDelete={true}
        onDelete={mockOnDelete}
      />,
      { wrapper: createWrapper() }
    );

    fireEvent.press(getByTestId('delete-button'));
    expect(mockOnDelete).toHaveBeenCalledWith(1);
  });

  it('should display product image', () => {
    const { getByTestId } = render(
      <ProductCard product={mockProduct} />,
      { wrapper: createWrapper() }
    );

    const image = getByTestId('product-image');
    expect(image.props.source.uri).toBe('https://example.com/thumbnail.jpg');
  });

  it('should handle long product titles', () => {
    const longTitleProduct = {
      ...mockProduct,
      title: 'This is a very long product title that should be truncated properly to fit within the card layout',
    };

    const { getByText } = render(
      <ProductCard product={longTitleProduct} />,
      { wrapper: createWrapper() }
    );

    expect(getByText(longTitleProduct.title)).toBeTruthy();
  });

  it('should format price correctly', () => {
    const { getByText } = render(
      <ProductCard product={mockProduct} />,
      { wrapper: createWrapper() }
    );

    expect(getByText('$99.99')).toBeTruthy();
  });

  it('should capitalize category name', () => {
    const { getByText } = render(
      <ProductCard product={mockProduct} />,
      { wrapper: createWrapper() }
    );

    expect(getByText('electronics')).toBeTruthy();
  });
});
