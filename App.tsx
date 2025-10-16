/**
 * GetPayIn Store - React Native Coding Challenge
 * @format
 */

import React from 'react';
import { StatusBar } from 'react-native';
import { SafeAreaProvider } from 'react-native-safe-area-context';
import { Provider } from 'react-redux';
import { QueryClientProvider } from '@tanstack/react-query';
import { PersistQueryClientProvider } from '@tanstack/react-query-persist-client';
import { GestureHandlerRootView } from 'react-native-gesture-handler';
import { store } from './src/store';
import { queryClient, persister } from './src/utils/queryClient';
import { AppNavigator } from './src/navigation';
import { useNetworkStatus } from './src/hooks/useNetworkStatus';
import { useAutoLock } from './src/hooks/useAutoLock';

function AppContent() {
  useNetworkStatus();
  useAutoLock();

  return <AppNavigator />;
}

function App() {
  return (
    <GestureHandlerRootView style={{ flex: 1 }}>
      <Provider store={store}>
        <PersistQueryClientProvider
          client={queryClient}
          persistOptions={{ persister }}
        >
          <SafeAreaProvider>
            <StatusBar barStyle="dark-content" />
            <AppContent />
          </SafeAreaProvider>
        </PersistQueryClientProvider>
      </Provider>
    </GestureHandlerRootView>
  );
}

export default App;
