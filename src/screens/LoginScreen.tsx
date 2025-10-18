import React, { useState } from 'react';
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  StyleSheet,
  ActivityIndicator,
  KeyboardAvoidingView,
  Platform,
  ScrollView,
  Alert,
} from 'react-native';
import Icon from 'react-native-vector-icons/MaterialCommunityIcons';
import { useLogin } from '../hooks/useAuth';
import { useTheme } from '../theme/ThemeContext';

export const LoginScreen: React.FC = () => {
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const { mutate: login, isPending, error } = useLogin();
  const { theme, toggleTheme, isDark } = useTheme();

  const handleLogin = async () => {
    if (!username || !password) {
      Alert.alert(
        '⚠️ Error',
        'Please enter both username and password',
        [{ text: 'OK', style: 'default' }]
      );
      return;
    }

    console.log('=== LOGIN ATTEMPT FROM SCREEN ===');
    console.log('Username:', username);
    console.log('Password length:', password.length);

    login(
      { username, password },
      {
        onSuccess: (data) => {
          console.log('=== LOGIN SUCCESS CALLBACK IN SCREEN ===');
          console.log('Login completed successfully');
        },
        onError: (err: any) => {
          console.log('=== LOGIN FAILED ===');
          console.error('Login error:', err);
          Alert.alert(
            '❌ Login Failed',
            err.response?.data?.message || 'Invalid credentials. Please try again.',
            [{ text: 'OK', style: 'default' }]
          );
        },
      }
    );
  };

  return (
    <KeyboardAvoidingView
      behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
      style={[styles.container, { backgroundColor: theme.background }]}
    >
      <ScrollView
        contentContainerStyle={styles.scrollContent}
        keyboardShouldPersistTaps="handled"
      >
        {/* Header with brand green gradient simulation */}
        <View style={[styles.header, { backgroundColor: theme.primary }]}>
          <TouchableOpacity
            onPress={toggleTheme}
            style={styles.themeToggle}
            accessibilityLabel={`Switch to ${isDark ? 'light' : 'dark'} mode`}
            accessibilityRole="button"
          >
            <Icon name={isDark ? 'weather-sunny' : 'weather-night'} size={22} color="#FFFFFF" />
          </TouchableOpacity>
          <View style={styles.headerContent}>
            <Icon name="shopping" size={64} color="#FFFFFF" />
            <Text style={styles.headerTitle}>GetPayIn Store</Text>
          </View>
        </View>

        {/* Form Card */}
        <View style={styles.formContainer}>
          <View style={[styles.formCard, { 
            backgroundColor: theme.surface,
            shadowColor: theme.cardShadow,
            borderColor: theme.outline || theme.border,
          }]}>
            <Text style={[styles.title, { color: theme.text }]}>Welcome Back</Text>
            <Text style={[styles.subtitle, { color: theme.textSecondary }]}>Login to continue shopping</Text>

            <View style={styles.form}>
              <TextInput
                style={[styles.input, { 
                  backgroundColor: theme.inputBackground, 
                  borderColor: theme.inputBorder,
                  color: theme.text 
                }]}
                placeholder="Username"
                placeholderTextColor={theme.inputPlaceholder}
                value={username}
                onChangeText={setUsername}
                autoCapitalize="none"
                autoCorrect={false}
                editable={!isPending}
              />

              <TextInput
                style={[styles.input, { 
                  backgroundColor: theme.inputBackground, 
                  borderColor: theme.inputBorder,
                  color: theme.text 
                }]}
                placeholder="Password"
                placeholderTextColor={theme.inputPlaceholder}
                value={password}
                onChangeText={setPassword}
                secureTextEntry
                autoCapitalize="none"
                autoCorrect={false}
                editable={!isPending}
                onSubmitEditing={handleLogin}
              />

              <TouchableOpacity
                style={[styles.button, { backgroundColor: theme.primary }, isPending && styles.buttonDisabled]}
                onPress={handleLogin}
                disabled={isPending}
                accessibilityLabel="Login"
                accessibilityRole="button"
              >
                {isPending ? (
                  <ActivityIndicator color="#FFFFFF" />
                ) : (
                  <Text style={styles.buttonText}>Login</Text>
                )}
              </TouchableOpacity>

            </View>
          </View>
        </View>
      </ScrollView>
    </KeyboardAvoidingView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  scrollContent: {
    flexGrow: 1,
  },
  header: {
    height: 200,
    borderBottomLeftRadius: 24,
    borderBottomRightRadius: 24,
    justifyContent: 'flex-end',
    paddingBottom: 32,
  },
  themeToggle: {
    position: 'absolute',
    top: 48,
    right: 16,
    padding: 8,
    backgroundColor: 'rgba(255,255,255,0.2)',
    borderRadius: 20,
    minWidth: 44,
    minHeight: 44,
    justifyContent: 'center',
    alignItems: 'center',
    zIndex: 1,
  },
  headerContent: {
    alignItems: 'center',
  },
  headerTitle: {
    fontSize: 24,
    fontWeight: '700',
    color: '#FFFFFF',
    marginTop: 12,
  },
  formContainer: {
    marginTop: -20,
    paddingHorizontal: 16,
  },
  formCard: {
    borderRadius: 24,
    padding: 24,
    shadowOffset: { width: 0, height: 8 },
    shadowOpacity: 0.12,
    shadowRadius: 24,
    elevation: 6,
    borderWidth: 1,
  },
  title: {
    fontSize: 24,
    fontWeight: '700',
    marginBottom: 8,
    textAlign: 'center',
    fontFamily: 'Ubuntu',
  },
  subtitle: {
    fontSize: 16,
    marginBottom: 24,
    textAlign: 'center',
    fontFamily: 'Ubuntu',
    fontWeight: '400',
  },
  form: {
    width: '100%',
  },
  input: {
    borderRadius: 12,
    paddingHorizontal: 16,
    paddingVertical: 14,
    fontSize: 16,
    marginBottom: 16,
    borderWidth: 1,
    fontFamily: 'Ubuntu',
    fontWeight: '400',
  },
  button: {
    borderRadius: 12,
    paddingVertical: 16,
    alignItems: 'center',
    marginTop: 8,
    minHeight: 52,
  },
  buttonDisabled: {
    opacity: 0.6,
  },
  buttonText: {
    color: '#FFFFFF',
    fontSize: 18,
    fontWeight: '700',
    fontFamily: 'Ubuntu',
  },
  hint: {
    marginTop: 24,
    padding: 16,
    borderRadius: 12,
    borderWidth: 1,
  },
  hintText: {
    fontSize: 14,
    marginBottom: 4,
    fontFamily: 'Ubuntu',
    fontWeight: '400',
  },
  hintTextSmall: {
    fontSize: 12,
    marginTop: 4,
    fontStyle: 'italic',
    fontFamily: 'Ubuntu',
    fontWeight: '300',
  },
});

