import React, { useState } from 'react';
import {
  View,
  Text,
  FlatList,
  StyleSheet,
  RefreshControl,
  ActivityIndicator,
  TouchableOpacity,
  Alert,
} from 'react-native';
import { useAllProducts, useDeleteProduct } from '../hooks/useProducts';
import { useAppSelector } from '../store';
import { ProductCard } from '../components/ProductCard';
import { OfflineIndicator } from '../components/OfflineIndicator';
import { Product } from '../types';
import { useTheme } from '../theme/ThemeContext';
import { resetActivityTimer } from '../hooks/useAutoLock';

export const AllProductsScreen: React.FC = () => {
  const { data, isLoading, refetch, isFetching } = useAllProducts();
  const { mutate: deleteProduct, isPending: isDeleting } = useDeleteProduct();
  const { isSuperadmin } = useAppSelector((state) => state.auth);
  const { isOnline } = useAppSelector((state) => state.app);
  const { theme } = useTheme();
  const [deletingId, setDeletingId] = useState<number | null>(null);

  const handleDelete = (productId: number) => {
    // Prevent delete when offline
    if (!isOnline) {
      Alert.alert(
        '📡 Offline',
        'Delete is not available while offline. Please connect to the internet and try again.',
        [{ text: 'OK', style: 'default' }]
      );
      return;
    }

    console.log('handleDelete called with productId:', productId);
    setDeletingId(productId);
    
    deleteProduct(productId, {
      onSuccess: (data) => {
        console.log('Product deleted successfully:', data);
        setDeletingId(null);
        
        // Show success message
        Alert.alert(
          '✅ Success',
          `Product deleted successfully${data.isDeleted ? ' (simulated)' : ''}`,
          [{ text: 'OK', style: 'default' }]
        );
      },
      onError: (error: any) => {
        console.error('Failed to delete product:', error);
        setDeletingId(null);
        
        // Show error message with better network error detection
        const isNetworkError = error.message === 'Network Error' || !error.response;
        
        Alert.alert(
          '❌ Delete Failed',
          isNetworkError 
            ? 'Network error. Please check your internet connection and try again.'
            : error.response?.data?.message || error.message || 'Failed to delete product. Please try again.',
          [{ text: 'OK', style: 'default' }]
        );
      },
    });
  };

  const renderItem = ({ item }: { item: Product }) => (
    <ProductCard
      product={item}
      showDelete={isSuperadmin && isOnline}
      onDelete={handleDelete}
      isDeleting={deletingId === item.id}
    />
  );

  const renderEmpty = () => {
    if (isLoading) {
      return (
        <View style={styles.centerContainer}>
          <ActivityIndicator size="large" color={theme.primary} />
          <Text style={[styles.loadingText, { color: theme.textSecondary }]}>
            Loading products...
          </Text>
        </View>
      );
    }

    return (
      <View style={styles.centerContainer}>
        <Text style={[styles.emptyText, { color: theme.textTertiary }]}>
          No products found
        </Text>
        <TouchableOpacity
          style={[styles.retryButton, { backgroundColor: theme.primary }]}
          onPress={() => refetch()}
        >
          <Text style={styles.retryText}>Retry</Text>
        </TouchableOpacity>
      </View>
    );
  };

  return (
    <View style={[styles.container, { backgroundColor: theme.background }]}>
      <OfflineIndicator />
      <FlatList
        data={data?.products || []}
        renderItem={renderItem}
        keyExtractor={(item) => item.id.toString()}
        contentContainerStyle={styles.listContent}
        ListEmptyComponent={renderEmpty}
        onScroll={resetActivityTimer}
        scrollEventThrottle={400}
        refreshControl={
          <RefreshControl
            refreshing={isFetching && !isLoading}
            onRefresh={refetch}
            tintColor={theme.primary}
          />
        }
      />
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  listContent: {
    paddingVertical: 8,
    flexGrow: 1,
  },
  centerContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    paddingVertical: 60,
  },
  loadingText: {
    marginTop: 12,
    fontSize: 16,
    fontFamily: 'Ubuntu',
    fontWeight: '400',
  },
  emptyText: {
    fontSize: 18,
    marginBottom: 20,
    fontFamily: 'Ubuntu',
    fontWeight: '500',
  },
  retryButton: {
    paddingHorizontal: 24,
    paddingVertical: 12,
    borderRadius: 8,
  },
  retryText: {
    color: '#FFFFFF',
    fontSize: 16,
    fontWeight: '600',
    fontFamily: 'Ubuntu',
  },
});

