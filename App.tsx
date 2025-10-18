/**
 * GetPayIn Store - React Native Coding Challenge
 * @format
 */

import React from 'react';
import { StatusBar, View, TouchableWithoutFeedback } from 'react-native';
import { SafeAreaProvider } from 'react-native-safe-area-context';
import { Provider } from 'react-redux';
import { QueryClientProvider } from '@tanstack/react-query';
import { PersistQueryClientProvider } from '@tanstack/react-query-persist-client';
import { GestureHandlerRootView } from 'react-native-gesture-handler';
import { store } from './src/store';
import { queryClient, persister } from './src/utils/queryClient';
import { AppNavigator } from './src/navigation';
import { useNetworkStatus } from './src/hooks/useNetworkStatus';
import { useAutoLock, resetActivityTimer } from './src/hooks/useAutoLock';
import { ThemeProvider, useTheme } from './src/theme/ThemeContext';

function AppContent() {
  useNetworkStatus();
  useAutoLock();
  const { theme, isDark } = useTheme();

  return (
    <View 
      style={{ flex: 1, backgroundColor: theme.background }}
      onStartShouldSetResponder={() => {
        resetActivityTimer();
        return false; // Don't capture, let events pass through
      }}
      onMoveShouldSetResponder={() => {
        resetActivityTimer();
        return false; // Don't capture, let events pass through
      }}
    >
      <StatusBar barStyle={isDark ? 'light-content' : 'dark-content'} />
      <AppNavigator />
    </View>
  );
}

function App() {
  return (
    <GestureHandlerRootView style={{ flex: 1 }}>
      <Provider store={store}>
        <ThemeProvider>
          <PersistQueryClientProvider
            client={queryClient}
            persistOptions={{
              persister,
              maxAge: 1000 * 60 * 60 * 24, // 24 hours
              dehydrateOptions: {
                shouldDehydrateQuery: (query) => {
                  // Only persist successful queries, not pending or errored ones
                  return query.state.status === 'success';
                },
              },
            }}
          >
            <SafeAreaProvider>
              <AppContent />
            </SafeAreaProvider>
          </PersistQueryClientProvider>
        </ThemeProvider>
      </Provider>
    </GestureHandlerRootView>
  );
}

export default App;
