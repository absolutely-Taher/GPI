import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { productsApi } from '../services/api';

export const useAllProducts = () => {
  return useQuery({
    queryKey: ['products', 'all'],
    queryFn: () => productsApi.getAllProducts(),
  });
};

export const useCategoryProducts = (category: string) => {
  return useQuery({
    queryKey: ['products', 'category', category],
    queryFn: () => productsApi.getProductsByCategory(category),
    enabled: !!category,
  });
};

export const useDeleteProduct = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (productId: number) => productsApi.deleteProduct(productId),
    onSuccess: () => {
      // Invalidate and refetch products
      queryClient.invalidateQueries({ queryKey: ['products'] });
    },
  });
};

