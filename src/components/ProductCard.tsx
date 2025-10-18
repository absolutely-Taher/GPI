import React, { useRef, useEffect } from 'react';
import {
  View,
  Text,
  Image,
  StyleSheet,
  TouchableOpacity,
  Alert,
  ActivityIndicator,
  Animated,
} from 'react-native';
import { Product } from '../types';
import { useTheme } from '../theme/ThemeContext';

interface ProductCardProps {
  product: Product;
  onDelete?: (id: number) => void;
  showDelete?: boolean;
  isDeleting?: boolean;
}

export const ProductCard: React.FC<ProductCardProps> = ({
  product,
  onDelete,
  showDelete = false,
  isDeleting = false,
}) => {
  const { theme } = useTheme();
  const scaleAnim = useRef(new Animated.Value(0)).current;
  const fadeAnim = useRef(new Animated.Value(0)).current;

  useEffect(() => {
    Animated.parallel([
      Animated.spring(scaleAnim, {
        toValue: 1,
        tension: 50,
        friction: 7,
        useNativeDriver: true,
      }),
      Animated.timing(fadeAnim, {
        toValue: 1,
        duration: 300,
        useNativeDriver: true,
      }),
    ]).start();
  }, []);

  const handleDelete = () => {
    Alert.alert(
      'Delete Product',
      `Are you sure you want to delete "${product.title}"?`,
      [
        { text: 'Cancel', style: 'cancel' },
        {
          text: 'Delete',
          style: 'destructive',
          onPress: () => {
            console.log('Delete confirmed for product:', product.id);
            onDelete?.(product.id);
          },
        },
      ]
    );
  };

  return (
    <Animated.View
      style={[
        styles.container,
        {
          backgroundColor: theme.card,
          borderColor: theme.border,
          opacity: fadeAnim,
          transform: [{ scale: scaleAnim }],
        },
        isDeleting && styles.containerDeleting,
      ]}
    >
      <Image source={{ uri: product.thumbnail }} style={styles.image} />
      <View style={styles.content}>
        <Text style={[styles.title, { color: theme.text }]} numberOfLines={2}>
          {product.title}
        </Text>
        <Text style={[styles.price, { color: theme.primary }]}>
          ${product.price.toFixed(2)}
        </Text>
        <Text style={[styles.category, { color: theme.textSecondary }]}>
          {product.category}
        </Text>
      </View>
      {showDelete && (
        <View style={styles.deleteButton}>
          {isDeleting ? (
            <ActivityIndicator size="small" color={theme.error} />
          ) : (
            <TouchableOpacity onPress={handleDelete}>
              <Text style={styles.deleteText}>🗑️</Text>
            </TouchableOpacity>
          )}
        </View>
      )}
    </Animated.View>
  );
};

const styles = StyleSheet.create({
  container: {
    flexDirection: 'row',
    borderRadius: 12,
    marginHorizontal: 16,
    marginVertical: 8,
    padding: 12,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
    borderWidth: 1,
  },
  containerDeleting: {
    opacity: 0.5,
  },
  image: {
    width: 80,
    height: 80,
    borderRadius: 8,
    backgroundColor: '#F0F0F0',
  },
  content: {
    flex: 1,
    marginLeft: 12,
    justifyContent: 'center',
  },
  title: {
    fontSize: 16,
    fontWeight: '600',
    marginBottom: 4,
  },
  price: {
    fontSize: 18,
    fontWeight: 'bold',
    marginBottom: 4,
  },
  category: {
    fontSize: 12,
    textTransform: 'capitalize',
  },
  deleteButton: {
    justifyContent: 'center',
    alignItems: 'center',
    paddingHorizontal: 12,
  },
  deleteText: {
    fontSize: 24,
  },
});

