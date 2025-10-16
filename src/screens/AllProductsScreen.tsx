import React from 'react';
import {
  View,
  Text,
  FlatList,
  StyleSheet,
  RefreshControl,
  ActivityIndicator,
  TouchableOpacity,
} from 'react-native';
import { useAllProducts, useDeleteProduct } from '../hooks/useProducts';
import { useAppSelector } from '../store';
import { ProductCard } from '../components/ProductCard';
import { OfflineIndicator } from '../components/OfflineIndicator';
import { Product } from '../types';
import { useAutoLock } from '../hooks/useAutoLock';

export const AllProductsScreen: React.FC = () => {
  const { data, isLoading, refetch, isFetching } = useAllProducts();
  const { mutate: deleteProduct } = useDeleteProduct();
  const { isSuperadmin } = useAppSelector((state) => state.auth);
  const { resetTimer } = useAutoLock();

  const handleDelete = (productId: number) => {
    deleteProduct(productId, {
      onSuccess: () => {
        // Product deleted successfully (simulated)
      },
    });
  };

  const handleScroll = () => {
    resetTimer();
  };

  const renderItem = ({ item }: { item: Product }) => (
    <ProductCard
      product={item}
      showDelete={isSuperadmin}
      onDelete={handleDelete}
    />
  );

  const renderEmpty = () => {
    if (isLoading) {
      return (
        <View style={styles.centerContainer}>
          <ActivityIndicator size="large" color="#007AFF" />
          <Text style={styles.loadingText}>Loading products...</Text>
        </View>
      );
    }

    return (
      <View style={styles.centerContainer}>
        <Text style={styles.emptyText}>No products found</Text>
        <TouchableOpacity style={styles.retryButton} onPress={() => refetch()}>
          <Text style={styles.retryText}>Retry</Text>
        </TouchableOpacity>
      </View>
    );
  };

  return (
    <View style={styles.container}>
      <OfflineIndicator />
      <FlatList
        data={data?.products || []}
        renderItem={renderItem}
        keyExtractor={(item) => item.id.toString()}
        contentContainerStyle={styles.listContent}
        ListEmptyComponent={renderEmpty}
        refreshControl={
          <RefreshControl
            refreshing={isFetching && !isLoading}
            onRefresh={refetch}
            tintColor="#007AFF"
          />
        }
        onScroll={handleScroll}
        scrollEventThrottle={400}
      />
      {isSuperadmin && (
        <View style={styles.superadminBadge}>
          <Text style={styles.superadminText}>👑 Superadmin Mode</Text>
        </View>
      )}
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#F5F5F5',
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
    color: '#666666',
  },
  emptyText: {
    fontSize: 18,
    color: '#999999',
    marginBottom: 20,
  },
  retryButton: {
    backgroundColor: '#007AFF',
    paddingHorizontal: 24,
    paddingVertical: 12,
    borderRadius: 8,
  },
  retryText: {
    color: '#FFFFFF',
    fontSize: 16,
    fontWeight: '600',
  },
  superadminBadge: {
    position: 'absolute',
    top: 10,
    right: 10,
    backgroundColor: '#FFD700',
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 20,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.2,
    shadowRadius: 3,
    elevation: 4,
  },
  superadminText: {
    color: '#000000',
    fontSize: 12,
    fontWeight: 'bold',
  },
});

