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
import { useCategoryProducts } from '../hooks/useProducts';
import { useAppSelector } from '../store';
import { ProductCard } from '../components/ProductCard';
import { OfflineIndicator } from '../components/OfflineIndicator';
import { Product } from '../types';
import { useAutoLock } from '../hooks/useAutoLock';

export const CategoryProductsScreen: React.FC = () => {
  const { selectedCategory } = useAppSelector((state) => state.app);
  const { data, isLoading, refetch, isFetching } =
    useCategoryProducts(selectedCategory);
  const { resetTimer } = useAutoLock();

  const handleScroll = () => {
    resetTimer();
  };

  const renderItem = ({ item }: { item: Product }) => (
    <ProductCard product={item} />
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
      <View style={styles.header}>
        <Text style={styles.categoryTitle}>
          {selectedCategory.charAt(0).toUpperCase() + selectedCategory.slice(1)}{' '}
          Products
        </Text>
        <Text style={styles.productCount}>
          {data?.total || 0} {data?.total === 1 ? 'item' : 'items'}
        </Text>
      </View>
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
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#F5F5F5',
  },
  header: {
    backgroundColor: '#FFFFFF',
    padding: 16,
    borderBottomWidth: 1,
    borderBottomColor: '#E0E0E0',
  },
  categoryTitle: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#000000',
    marginBottom: 4,
  },
  productCount: {
    fontSize: 14,
    color: '#666666',
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
});

