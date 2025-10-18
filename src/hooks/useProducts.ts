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
    mutationFn: (productId: number) => {
      console.log('Deleting product:', productId);
      return productsApi.deleteProduct(productId);
    },
    onMutate: async (productId) => {
      console.log('onMutate - productId:', productId);
      
      // Cancel any outgoing refetches
      await queryClient.cancelQueries({ queryKey: ['products'] });

      // Snapshot the previous value
      const previousProducts = queryClient.getQueryData(['products', 'all']);

      // Optimistically update to remove the product from UI
      queryClient.setQueryData(['products', 'all'], (old: any) => {
        if (!old) return old;
        return {
          ...old,
          products: old.products.filter((p: any) => p.id !== productId),
          total: old.total - 1,
        };
      });

      // Return context with previous data for rollback
      return { previousProducts };
    },
    onSuccess: (data, productId) => {
      console.log('Delete success:', data);
      // Don't invalidate - keep the optimistic update until manual refresh
      // Since deletion is simulated, auto-refetch would bring the product back
    },
    onError: (error, productId, context) => {
      console.error('Delete failed:', error);
      // Rollback to previous state on error
      if (context?.previousProducts) {
        queryClient.setQueryData(['products', 'all'], context.previousProducts);
      }
    },
  });
};

