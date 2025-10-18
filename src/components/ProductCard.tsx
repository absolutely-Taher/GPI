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
import Icon from 'react-native-vector-icons/MaterialCommunityIcons';
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
          backgroundColor: theme.surface,
          borderColor: theme.outline || theme.border,
          opacity: fadeAnim,
          transform: [{ scale: scaleAnim }],
          shadowColor: theme.cardShadow,
        },
        isDeleting && styles.containerDeleting,
      ]}
    >
      <Image 
        source={{ uri: product.thumbnail }} 
        style={[styles.image, { backgroundColor: theme.surfaceAlt || theme.background }]} 
      />
      <View style={styles.content}>
        <Text style={[styles.title, { color: theme.text }]} numberOfLines={2}>
          {product.title}
        </Text>
        <Text style={[styles.category, { color: theme.textSecondary }]}>
          {product.category}
        </Text>
        <Text style={[styles.price, { color: theme.primary }]}>
          ${product.price.toFixed(2)}
        </Text>
      </View>
      {showDelete && (
        <View style={styles.deleteButton}>
          {isDeleting ? (
            <ActivityIndicator size="small" color={theme.error} />
          ) : (
            <TouchableOpacity 
              onPress={handleDelete}
              hitSlop={{ top: 10, bottom: 10, left: 10, right: 10 }}
              accessibilityLabel={`Delete ${product.title}`}
              accessibilityRole="button"
            >
              <Icon name="delete-outline" size={26} color={theme.error} />
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
    borderRadius: 16,
    marginHorizontal: 16,
    marginVertical: 8,
    padding: 12,
    shadowOffset: { width: 0, height: 8 },
    shadowOpacity: 0.12,
    shadowRadius: 24,
    elevation: 6,
    borderWidth: 1,
  },
  containerDeleting: {
    opacity: 0.5,
  },
  image: {
    width: 72,
    height: 72,
    borderRadius: 12,
  },
  content: {
    flex: 1,
    marginLeft: 12,
    justifyContent: 'center',
  },
  title: {
    fontSize: 16,
    fontWeight: '700',
    marginBottom: 4,
    fontFamily: 'Ubuntu',
  },
  category: {
    fontSize: 13,
    textTransform: 'capitalize',
    marginBottom: 6,
    fontFamily: 'Ubuntu',
    fontWeight: '400',
  },
  price: {
    fontSize: 18,
    fontWeight: '700',
    fontFamily: 'Ubuntu',
  },
  deleteButton: {
    justifyContent: 'center',
    alignItems: 'center',
    paddingHorizontal: 12,
    minWidth: 44,
    minHeight: 44,
  },
});

