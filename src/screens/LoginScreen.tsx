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
import { useLogin } from '../hooks/useAuth';
import { useTheme } from '../theme/ThemeContext';

export const LoginScreen: React.FC = () => {
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const { mutate: login, isPending, error } = useLogin();
  const { theme } = useTheme();

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
        <View style={styles.content}>
          <Text style={styles.logo}>🛍️</Text>
          <Text style={[styles.title, { color: theme.text }]}>GetPayIn Store</Text>
          <Text style={[styles.subtitle, { color: theme.textSecondary }]}>Login to continue</Text>

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
            >
              {isPending ? (
                <ActivityIndicator color="#FFFFFF" />
              ) : (
                <Text style={styles.buttonText}>Login</Text>
              )}
            </TouchableOpacity>

            <View style={[styles.hint, { backgroundColor: theme.primary + '20' }]}>
              <Text style={[styles.hintText, { color: theme.primary }]}>💡 Test credentials:</Text>
              <Text style={[styles.hintText, { color: theme.primary }]}>Username: emilys</Text>
              <Text style={[styles.hintText, { color: theme.primary }]}>Password: emilyspass</Text>
              <Text style={[styles.hintTextSmall, { color: theme.textSecondary }]}>(emilys is superadmin)</Text>
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
  content: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    padding: 20,
  },
  logo: {
    fontSize: 80,
    marginBottom: 20,
  },
  title: {
    fontSize: 32,
    fontWeight: 'bold',
    marginBottom: 10,
  },
  subtitle: {
    fontSize: 16,
    marginBottom: 40,
  },
  form: {
    width: '100%',
    maxWidth: 400,
  },
  input: {
    borderRadius: 10,
    paddingHorizontal: 16,
    paddingVertical: 14,
    fontSize: 16,
    marginBottom: 16,
    borderWidth: 1,
  },
  button: {
    borderRadius: 10,
    paddingVertical: 16,
    alignItems: 'center',
    marginTop: 10,
  },
  buttonDisabled: {
    opacity: 0.6,
  },
  buttonText: {
    color: '#FFFFFF',
    fontSize: 18,
    fontWeight: '600',
  },
  hint: {
    marginTop: 30,
    padding: 16,
    borderRadius: 10,
  },
  hintText: {
    fontSize: 14,
    marginBottom: 4,
  },
  hintTextSmall: {
    fontSize: 12,
    marginTop: 4,
    fontStyle: 'italic',
  },
});

