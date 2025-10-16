import React from 'react';
import { View, Text, StyleSheet } from 'react-native';
import { useAppSelector } from '../store';

export const OfflineIndicator: React.FC = () => {
  const { isOnline } = useAppSelector((state) => state.app);

  if (isOnline) {
    return null;
  }

  return (
    <View style={styles.container}>
      <Text style={styles.text}>📡 Offline - Showing cached data</Text>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    backgroundColor: '#FF9500',
    paddingVertical: 8,
    paddingHorizontal: 16,
    alignItems: 'center',
  },
  text: {
    color: '#FFFFFF',
    fontSize: 14,
    fontWeight: '600',
  },
});

