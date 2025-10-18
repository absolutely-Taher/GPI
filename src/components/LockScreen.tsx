import React, { useEffect, useState, useRef } from 'react';
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  ActivityIndicator,
  TextInput,
  Alert,
} from 'react-native';
import { useAppDispatch } from '../store';
import { setLocked } from '../store/appSlice';
import { useBiometrics } from '../hooks/useBiometrics';
import { useTheme } from '../theme/ThemeContext';

export const LockScreen: React.FC = () => {
  const dispatch = useAppDispatch();
  const {
    authenticateWithBiometrics,
    authenticateWithPassword,
    checkBiometricSupport,
  } = useBiometrics();
  const [isAuthenticating, setIsAuthenticating] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [showPasswordInput, setShowPasswordInput] = useState(false);
  const [password, setPassword] = useState('');
  const [biometricsAvailable, setBiometricsAvailable] = useState(false);
  const hasAttemptedBiometrics = useRef(false);
  const { theme } = useTheme();

  useEffect(() => {
    // Reset the attempt flag when component mounts
    hasAttemptedBiometrics.current = false;
    
    // Check biometric support and trigger auth
    const initBiometrics = async () => {
      const { available } = await checkBiometricSupport();
      setBiometricsAvailable(available);
      
      if (available && !hasAttemptedBiometrics.current) {
        hasAttemptedBiometrics.current = true;
        // Small delay to ensure the lock screen is fully rendered
        setTimeout(() => {
          handleBiometricUnlock();
        }, 300);
      } else {
        // Show password input if biometrics not available
        setShowPasswordInput(true);
      }
    };
    
    initBiometrics();
  }, []);

  const handleBiometricUnlock = async () => {
    setIsAuthenticating(true);
    setError(null);

    // Add a timeout to prevent infinite loading
    const timeoutId = setTimeout(() => {
      console.log('Biometric authentication timed out');
      setIsAuthenticating(false);
      setError('Authentication timed out. Please try again.');
      setShowPasswordInput(true);
    }, 30000); // 30 second timeout

    try {
      const result = await authenticateWithBiometrics();
      clearTimeout(timeoutId);

      if (result.success) {
        dispatch(setLocked(false));
      } else if (result.cancelled) {
        setError('Authentication cancelled. Use password to unlock.');
        setShowPasswordInput(true);
      } else {
        setError(result.error || 'Biometric authentication failed.');
        setShowPasswordInput(true);
      }
    } catch (err) {
      clearTimeout(timeoutId);
      console.error('Biometric unlock error:', err);
      setError('Authentication error. Please use password.');
      setShowPasswordInput(true);
    } finally {
      setIsAuthenticating(false);
    }
  };

  const handlePasswordUnlock = async () => {
    if (!password.trim()) {
      setError('Please enter your password');
      return;
    }

    setIsAuthenticating(true);
    setError(null);

    try {
      console.log('Attempting password unlock with password length:', password.length);
      const success = await authenticateWithPassword(password);

      if (success) {
        console.log('Password authentication successful');
        dispatch(setLocked(false));
      } else {
        console.log('Password authentication failed');
        setError('Incorrect password. Please try again.');
        setPassword('');
      }
    } catch (err) {
      console.error('Password unlock error:', err);
      setError('Authentication error. Please try again.');
    } finally {
      setIsAuthenticating(false);
    }
  };

  return (
    <View style={[styles.container, { backgroundColor: theme.lockOverlay }]}>
      <View style={styles.content}>
        <Text style={styles.lockIcon}>🔒</Text>
        <Text style={[styles.title, { color: theme.lockText }]}>App Locked</Text>
        <Text style={[styles.subtitle, { color: theme.textSecondary }]}>
          {showPasswordInput
            ? 'Enter your password to unlock'
            : 'Unlock using biometrics'}
        </Text>

        {showPasswordInput ? (
          <View style={styles.passwordContainer}>
            <TextInput
              style={[styles.passwordInput, { 
                backgroundColor: theme.inputBackground,
                borderColor: theme.inputBorder,
                color: theme.text
              }]}
              placeholder="Enter password"
              placeholderTextColor={theme.inputPlaceholder}
              secureTextEntry
              value={password}
              onChangeText={setPassword}
              autoFocus
              editable={!isAuthenticating}
              onSubmitEditing={handlePasswordUnlock}
            />
            <TouchableOpacity
              style={[styles.button, { backgroundColor: theme.primary }, isAuthenticating && styles.buttonDisabled]}
              onPress={handlePasswordUnlock}
              disabled={isAuthenticating}
            >
              {isAuthenticating ? (
                <ActivityIndicator size="small" color="#FFFFFF" />
              ) : (
                <Text style={styles.buttonText}>Unlock</Text>
              )}
            </TouchableOpacity>

            {biometricsAvailable && (
              <TouchableOpacity
                style={styles.biometricButton}
                onPress={() => {
                  setShowPasswordInput(false);
                  setPassword('');
                  setError(null);
                  hasAttemptedBiometrics.current = false;
                  handleBiometricUnlock();
                }}
                disabled={isAuthenticating}
              >
                <Text style={[styles.biometricButtonText, { color: theme.primary }]}>
                  Use Biometrics Instead
                </Text>
              </TouchableOpacity>
            )}
          </View>
        ) : (
          <>
            {isAuthenticating ? (
              <View>
                <ActivityIndicator
                  size="large"
                  color={theme.primary}
                  style={styles.loader}
                />
                <Text style={[styles.loadingText, { color: theme.textSecondary }]}>
                  Waiting for authentication...
                </Text>
                <TouchableOpacity
                  style={[styles.textButton, { marginTop: 30 }]}
                  onPress={() => {
                    setIsAuthenticating(false);
                    setShowPasswordInput(true);
                    setError(null);
                  }}
                >
                  <Text style={[styles.textButtonText, { color: theme.primary }]}>Cancel & Use Password</Text>
                </TouchableOpacity>
              </View>
            ) : (
              <>
                <TouchableOpacity
                  style={[styles.button, { backgroundColor: theme.primary }]}
                  onPress={handleBiometricUnlock}
                >
                  <Text style={styles.buttonText}>Unlock with Biometrics</Text>
                </TouchableOpacity>
                <TouchableOpacity
                  style={styles.textButton}
                  onPress={() => {
                    setShowPasswordInput(true);
                    setError(null);
                  }}
                >
                  <Text style={[styles.textButtonText, { color: theme.primary }]}>Use Password Instead</Text>
                </TouchableOpacity>
              </>
            )}
          </>
        )}

        {error && <Text style={[styles.error, { color: theme.error }]}>{error}</Text>}
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    ...StyleSheet.absoluteFillObject,
    justifyContent: 'center',
    alignItems: 'center',
    zIndex: 9999,
  },
  content: {
    alignItems: 'center',
    padding: 20,
    width: '100%',
    maxWidth: 400,
  },
  lockIcon: {
    fontSize: 80,
    marginBottom: 20,
  },
  title: {
    fontSize: 28,
    fontWeight: 'bold',
    marginBottom: 10,
  },
  subtitle: {
    fontSize: 16,
    marginBottom: 40,
    textAlign: 'center',
  },
  passwordContainer: {
    width: '100%',
    alignItems: 'center',
  },
  passwordInput: {
    width: '100%',
    borderRadius: 10,
    paddingHorizontal: 20,
    paddingVertical: 15,
    fontSize: 16,
    marginBottom: 20,
    borderWidth: 1,
  },
  button: {
    paddingHorizontal: 40,
    paddingVertical: 15,
    borderRadius: 10,
    minWidth: 200,
    width: '100%',
  },
  buttonDisabled: {
    opacity: 0.6,
  },
  buttonText: {
    color: '#FFFFFF',
    fontSize: 18,
    fontWeight: '600',
    textAlign: 'center',
  },
  textButton: {
    marginTop: 20,
    paddingVertical: 10,
  },
  textButtonText: {
    fontSize: 16,
    textAlign: 'center',
  },
  biometricButton: {
    marginTop: 15,
    paddingVertical: 10,
  },
  biometricButtonText: {
    fontSize: 16,
    textAlign: 'center',
  },
  loader: {
    marginVertical: 20,
  },
  loadingText: {
    fontSize: 14,
    textAlign: 'center',
    marginTop: 10,
  },
  error: {
    marginTop: 20,
    fontSize: 14,
    textAlign: 'center',
    paddingHorizontal: 20,
  },
});

