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
import { useTheme } from '../theme/ThemeContext';
import { resetActivityTimer } from '../hooks/useAutoLock';

export const CategoryProductsScreen: React.FC = () => {
  const { selectedCategory } = useAppSelector((state) => state.app);
  const { data, isLoading, refetch, isFetching } =
    useCategoryProducts(selectedCategory);
  const { theme } = useTheme();

  const renderItem = ({ item }: { item: Product }) => (
    <ProductCard product={item} />
  );

  const renderEmpty = () => {
    if (isLoading) {
      return (
        <View style={styles.centerContainer}>
          <ActivityIndicator size="large" color={theme.primary} />
          <Text style={[styles.loadingText, { color: theme.textSecondary }]}>Loading products...</Text>
        </View>
      );
    }

    return (
      <View style={styles.centerContainer}>
        <Text style={[styles.emptyText, { color: theme.textTertiary }]}>No products found</Text>
        <TouchableOpacity style={[styles.retryButton, { backgroundColor: theme.primary }]} onPress={() => refetch()}>
          <Text style={styles.retryText}>Retry</Text>
        </TouchableOpacity>
      </View>
    );
  };

  return (
    <View style={[styles.container, { backgroundColor: theme.background }]}>
      <OfflineIndicator />
      <View style={[styles.header, { backgroundColor: theme.surface, borderBottomColor: theme.border }]}>
        <Text style={[styles.categoryTitle, { color: theme.text }]}>
          {selectedCategory.charAt(0).toUpperCase() + selectedCategory.slice(1)}{' '}
          Products
        </Text>
        <Text style={[styles.productCount, { color: theme.textSecondary }]}>
          {data?.total || 0} {data?.total === 1 ? 'item' : 'items'}
        </Text>
      </View>
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
  header: {
    padding: 16,
    borderBottomWidth: 1,
  },
  categoryTitle: {
    fontSize: 24,
    fontWeight: 'bold',
    marginBottom: 4,
  },
  productCount: {
    fontSize: 14,
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
  },
  emptyText: {
    fontSize: 18,
    marginBottom: 20,
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
  },
});

