import React from 'react';
import { View, Text, StyleSheet } from 'react-native';
import { useAppSelector } from '../store';
import { useTheme } from '../theme/ThemeContext';

export const OfflineIndicator: React.FC = () => {
  const { isOnline } = useAppSelector((state) => state.app);
  const { theme } = useTheme();

  if (isOnline) {
    return null;
  }

  return (
    <View style={[styles.container, { backgroundColor: theme.offlineBanner }]}>
      <Text style={[styles.text, { color: theme.offlineText }]}>
        📡 Offline - Showing cached data
      </Text>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    paddingVertical: 8,
    paddingHorizontal: 16,
    alignItems: 'center',
  },
  text: {
    fontSize: 14,
    fontWeight: '600',
  },
});

