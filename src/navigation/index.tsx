import React, { useEffect } from 'react';
import { NavigationContainer } from '@react-navigation/native';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import { TouchableOpacity, Text, Alert } from 'react-native';
import Icon from 'react-native-vector-icons/MaterialCommunityIcons';
import { useAppSelector } from '../store';
import { useLogout, useRestoreSession } from '../hooks/useAuth';
import { LoginScreen } from '../screens/LoginScreen';
import { AllProductsScreen } from '../screens/AllProductsScreen';
import { CategoryProductsScreen } from '../screens/CategoryProductsScreen';
import { LockScreen } from '../components/LockScreen';
import { getItem, getObject } from '../utils/storage';
import { RootStackParamList, AuthStackParamList, MainTabParamList } from '../types';
import { useTheme } from '../theme/ThemeContext';

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
          onPress: async () => {
            await logout();
          },
        },
      ],
      { cancelable: true }
    );
  }, []);

  return null;
};

const MainNavigator = () => {
  const { theme, toggleTheme, isDark } = useTheme();
  const { isSuperadmin } = useAppSelector((state) => state.auth);
  
  return (
    <MainTab.Navigator
      screenOptions={{
        tabBarActiveTintColor: theme.primary,
        tabBarInactiveTintColor: theme.muted || theme.textTertiary,
        tabBarStyle: {
          backgroundColor: theme.surface,
          borderTopColor: theme.outline || theme.border,
          borderTopWidth: 1,
          height: 60,
          paddingBottom: 8,
          paddingTop: 8,
        },
        tabBarLabelStyle: {
          fontSize: 12,
          fontWeight: '600',
          fontFamily: 'Ubuntu',
        },
        headerStyle: {
          backgroundColor: theme.primary,
          elevation: 0,
          shadowOpacity: 0,
        },
        headerTintColor: '#FFFFFF',
        headerTitleStyle: {
          fontWeight: '700',
          fontSize: 20,
          fontFamily: 'Ubuntu',
        },
        headerRight: () => (
          <TouchableOpacity
            onPress={toggleTheme}
            style={{ 
              marginRight: 16, 
              padding: 8,
              backgroundColor: 'rgba(255,255,255,0.2)',
              borderRadius: 20,
              minWidth: 44,
              minHeight: 44,
              justifyContent: 'center',
              alignItems: 'center',
            }}
            accessibilityLabel={`Switch to ${isDark ? 'light' : 'dark'} mode`}
            accessibilityRole="button"
          >
            <Icon name={isDark ? 'weather-sunny' : 'weather-night'} size={22} color="#FFFFFF" />
          </TouchableOpacity>
        ),
      }}
    >
      <MainTab.Screen
        name="AllProducts"
        component={AllProductsScreen}
        options={{
          title: isSuperadmin ? 'All Products 👑' : 'All Products',
          tabBarLabel: 'All',
          tabBarIcon: ({ color }) => <Icon name="shopping" size={24} color={color} />,
        }}
      />
      <MainTab.Screen
        name="CategoryProducts"
        component={CategoryProductsScreen}
        options={{
          title: 'Beauty',
          tabBarLabel: 'Beauty',
          tabBarIcon: ({ color }) => <Icon name="lipstick" size={24} color={color} />,
        }}
      />
      <MainTab.Screen
        name="SignOut"
        component={SignOutScreen}
        options={{
          title: 'Sign Out',
          tabBarLabel: 'Sign Out',
          tabBarIcon: ({ color }) => <Icon name="logout" size={24} color={color} />,
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
  const { theme, isDark } = useTheme();

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

