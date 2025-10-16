import React, { useEffect } from 'react';
import { NavigationContainer } from '@react-navigation/native';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import { TouchableOpacity, Text, Alert } from 'react-native';
import { useAppSelector } from '../store';
import { useLogout, useRestoreSession } from '../hooks/useAuth';
import { LoginScreen } from '../screens/LoginScreen';
import { AllProductsScreen } from '../screens/AllProductsScreen';
import { CategoryProductsScreen } from '../screens/CategoryProductsScreen';
import { LockScreen } from '../components/LockScreen';
import { getItem, getObject } from '../utils/storage';
import { RootStackParamList, AuthStackParamList, MainTabParamList } from '../types';

const RootStack = createNativeStackNavigator<RootStackParamList>();
const AuthStack = createNativeStackNavigator<AuthStackParamList>();
const MainTab = createBottomTabNavigator<MainTabParamList>();

const AuthNavigator = () => {
  return (
    <AuthStack.Navigator screenOptions={{ headerShown: false }}>
      <AuthStack.Screen name="Login" component={LoginScreen} />
    </AuthStack.Navigator>
  );
};

const SignOutScreen = () => {
  const logout = useLogout();

  useEffect(() => {
    Alert.alert(
      'Sign Out',
      'Are you sure you want to sign out?',
      [
        { text: 'Cancel', style: 'cancel' },
        {
          text: 'Sign Out',
          style: 'destructive',
          onPress: logout,
        },
      ],
      { cancelable: true }
    );
  }, []);

  return null;
};

const MainNavigator = () => {
  return (
    <MainTab.Navigator
      screenOptions={{
        tabBarActiveTintColor: '#007AFF',
        tabBarInactiveTintColor: '#8E8E93',
        headerStyle: {
          backgroundColor: '#FFFFFF',
        },
        headerTintColor: '#000000',
        headerTitleStyle: {
          fontWeight: 'bold',
        },
      }}
    >
      <MainTab.Screen
        name="AllProducts"
        component={AllProductsScreen}
        options={{
          title: 'All Products',
          tabBarLabel: 'All Products',
          tabBarIcon: ({ color }) => <Text style={{ fontSize: 20 }}>🛍️</Text>,
        }}
      />
      <MainTab.Screen
        name="CategoryProducts"
        component={CategoryProductsScreen}
        options={{
          title: 'Beauty Products',
          tabBarLabel: 'Beauty',
          tabBarIcon: ({ color }) => <Text style={{ fontSize: 20 }}>💄</Text>,
        }}
      />
      <MainTab.Screen
        name="SignOut"
        component={SignOutScreen}
        options={{
          title: 'Sign Out',
          tabBarLabel: 'Sign Out',
          tabBarIcon: ({ color }) => <Text style={{ fontSize: 20 }}>🚪</Text>,
        }}
        listeners={({ navigation }) => ({
          tabPress: (e) => {
            e.preventDefault();
            navigation.navigate('SignOut');
          },
        })}
      />
    </MainTab.Navigator>
  );
};

export const AppNavigator = () => {
  const { isAuthenticated, token } = useAppSelector((state) => state.auth);
  const { isLocked } = useAppSelector((state) => state.app);
  const { mutate: restoreSession } = useRestoreSession();

  useEffect(() => {
    // Check for existing session on app start
    const checkSession = async () => {
      const storedToken = getItem('auth_token');
      const storedUser = getObject('user_data');

      if (storedToken && storedUser) {
        // We have stored credentials, restore session
        restoreSession(storedToken as any, {
          onError: () => {
            // If restore fails, user will need to login again
          },
        });
      }
    };

    checkSession();
  }, []);

  return (
    <NavigationContainer>
      <RootStack.Navigator screenOptions={{ headerShown: false }}>
        {isAuthenticated ? (
          <RootStack.Screen name="Main" component={MainNavigator} />
        ) : (
          <RootStack.Screen name="Auth" component={AuthNavigator} />
        )}
      </RootStack.Navigator>
      {isLocked && isAuthenticated && <LockScreen />}
    </NavigationContainer>
  );
};

