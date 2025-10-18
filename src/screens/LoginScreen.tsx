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
  Animated,
  Dimensions,
} from 'react-native';
import Icon from 'react-native-vector-icons/MaterialCommunityIcons';
import { useLogin } from '../hooks/useAuth';
import { useTheme } from '../theme/ThemeContext';

const { width, height } = Dimensions.get('window');

// Decorative Background Pattern Component - Clean & Organized
const BackgroundPattern: React.FC<{ theme: any }> = ({ theme }) => {
  return (
    <View style={styles.patternContainer}>
      {/* Top-Right Large Circle */}
      <View
        style={[
          styles.circlePattern,
          {
            width: 250,
            height: 250,
            borderRadius: 125,
            backgroundColor: theme.primary,
            opacity: 0.06,
            top: -80,
            right: -80,
          },
        ]}
      />

      {/* Bottom-Left Large Circle */}
      <View
        style={[
          styles.circlePattern,
          {
            width: 200,
            height: 200,
            borderRadius: 100,
            backgroundColor: theme.primary,
            opacity: 0.05,
            bottom: -60,
            left: -60,
          },
        ]}
      />

      {/* Diagonal Waves Pattern - Top to Bottom */}
      {Array.from({ length: 8 }).map((_, i) => (
        <View
          key={`wave-${i}`}
          style={[
            styles.linePattern,
            {
              width: 150,
              height: 1.5,
              backgroundColor: theme.primary,
              opacity: 0.08,
              top: 80 + i * 80,
              left: -50 + i * 30,
              transform: [{ rotate: '25deg' }],
            },
          ]}
        />
      ))}

      {/* Organized Dot Grid Pattern */}
      {Array.from({ length: 48 }).map((_, i) => {
        const row = Math.floor(i / 8);
        const col = i % 8;
        return (
          <View
            key={`dot-${i}`}
            style={[
              styles.dotPattern,
              {
                width: 4,
                height: 4,
                borderRadius: 2,
                backgroundColor: theme.primary,
                opacity: 0.1,
                left: 20 + col * 48,
                top: 100 + row * 100,
              },
            ]}
          />
        );
      })}

      {/* Corner Accent Squares - Top Left */}
      <View
        style={[
          styles.squarePattern,
          {
            width: 40,
            height: 40,
            borderWidth: 2,
            borderColor: theme.primary,
            opacity: 0.08,
            top: 20,
            left: 20,
            transform: [{ rotate: '15deg' }],
          },
        ]}
      />

      {/* Corner Accent Squares - Bottom Right */}
      <View
        style={[
          styles.squarePattern,
          {
            width: 35,
            height: 35,
            borderWidth: 2,
            borderColor: theme.primary,
            opacity: 0.08,
            bottom: 100,
            right: 25,
            transform: [{ rotate: '15deg' }],
          },
        ]}
      />

      {/* Circular Ring Accents */}
      {[
        { size: 60, top: 150, left: width - 90 },
        { size: 45, top: height - 200, left: 50 },
        { size: 50, top: height / 2, left: 30 },
      ].map((ring, i) => (
        <View
          key={`ring-${i}`}
          style={[
            styles.circlePattern,
            {
              width: ring.size,
              height: ring.size,
              borderRadius: ring.size / 2,
              borderWidth: 2,
              borderColor: theme.primary,
              opacity: 0.09,
              top: ring.top,
              left: ring.left,
            },
          ]}
        />
      ))}

      {/* Geometric Line Accents - Organized Pattern */}
      {[
        { width: 80, height: 2, top: 180, left: 40, rotate: '0deg' },
        { width: 60, height: 2, top: 195, left: 45, rotate: '0deg' },
        { width: 90, height: 2, top: height - 180, right: 30, rotate: '0deg' },
        { width: 70, height: 2, top: height - 165, right: 35, rotate: '0deg' },
      ].map((line, i) => (
        <View
          key={`accent-line-${i}`}
          style={[
            styles.linePattern,
            {
              width: line.width,
              height: line.height,
              backgroundColor: theme.primary,
              opacity: 0.1,
              top: line.top,
              left: line.left,
              right: line.right,
              transform: [{ rotate: line.rotate }],
            },
          ]}
        />
      ))}

      {/* Small Accent Circles - Strategic Placement */}
      {[
        { size: 12, top: 120, left: width - 50, opacity: 0.12 },
        { size: 10, top: 280, left: 60, opacity: 0.1 },
        { size: 14, top: height - 150, left: width - 70, opacity: 0.11 },
        { size: 11, top: height / 2 + 50, left: width - 40, opacity: 0.1 },
      ].map((circle, i) => (
        <View
          key={`accent-circle-${i}`}
          style={[
            styles.circlePattern,
            {
              width: circle.size,
              height: circle.size,
              borderRadius: circle.size / 2,
              backgroundColor: theme.primary,
              opacity: circle.opacity,
              top: circle.top,
              left: circle.left,
            },
          ]}
        />
      ))}
    </View>
  );
};

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
      {/* Background Pattern */}
      <BackgroundPattern theme={theme} />
      
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
    fontFamily: 'Ubuntu-Bold',
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
    fontFamily: 'Ubuntu-Bold',
  },
  subtitle: {
    fontSize: 16,
    marginBottom: 24,
    textAlign: 'center',
    fontFamily: 'Ubuntu-Regular',
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
    fontFamily: 'Ubuntu-Regular',
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
    fontFamily: 'Ubuntu-Bold',
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
    fontFamily: 'Ubuntu-Regular',
    fontWeight: '400',
  },
  hintTextSmall: {
    fontSize: 12,
    marginTop: 4,
    fontStyle: 'italic',
    fontFamily: 'Ubuntu-Light',
    fontWeight: '300',
  },
  // Pattern Background Styles
  patternContainer: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    overflow: 'hidden',
  },
  circlePattern: {
    position: 'absolute',
  },
  dotPattern: {
    position: 'absolute',
  },
  linePattern: {
    position: 'absolute',
  },
  squarePattern: {
    position: 'absolute',
    borderRadius: 8,
  },
});

