import React, { useEffect, useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  ActivityIndicator,
} from 'react-native';
import { useAppDispatch } from '../store';
import { setLocked } from '../store/appSlice';
import { useBiometrics } from '../hooks/useBiometrics';

export const LockScreen: React.FC = () => {
  const dispatch = useAppDispatch();
  const { authenticate } = useBiometrics();
  const [isAuthenticating, setIsAuthenticating] = useState(false);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    // Automatically trigger biometric auth when lock screen appears
    handleUnlock();
  }, []);

  const handleUnlock = async () => {
    setIsAuthenticating(true);
    setError(null);

    try {
      const success = await authenticate();

      if (success) {
        dispatch(setLocked(false));
      } else {
        setError('Authentication failed. Please try again.');
      }
    } catch (err) {
      setError('Authentication error. Please try again.');
    } finally {
      setIsAuthenticating(false);
    }
  };

  return (
    <View style={styles.container}>
      <View style={styles.content}>
        <Text style={styles.lockIcon}>🔒</Text>
        <Text style={styles.title}>App Locked</Text>
        <Text style={styles.subtitle}>
          Unlock using biometrics or password
        </Text>

        {isAuthenticating ? (
          <ActivityIndicator size="large" color="#007AFF" style={styles.loader} />
        ) : (
          <TouchableOpacity style={styles.button} onPress={handleUnlock}>
            <Text style={styles.buttonText}>Unlock</Text>
          </TouchableOpacity>
        )}

        {error && <Text style={styles.error}>{error}</Text>}
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    ...StyleSheet.absoluteFillObject,
    backgroundColor: 'rgba(0, 0, 0, 0.95)',
    justifyContent: 'center',
    alignItems: 'center',
    zIndex: 9999,
  },
  content: {
    alignItems: 'center',
    padding: 20,
  },
  lockIcon: {
    fontSize: 80,
    marginBottom: 20,
  },
  title: {
    fontSize: 28,
    fontWeight: 'bold',
    color: '#FFFFFF',
    marginBottom: 10,
  },
  subtitle: {
    fontSize: 16,
    color: '#CCCCCC',
    marginBottom: 40,
    textAlign: 'center',
  },
  button: {
    backgroundColor: '#007AFF',
    paddingHorizontal: 40,
    paddingVertical: 15,
    borderRadius: 10,
    minWidth: 200,
  },
  buttonText: {
    color: '#FFFFFF',
    fontSize: 18,
    fontWeight: '600',
    textAlign: 'center',
  },
  loader: {
    marginVertical: 20,
  },
  error: {
    color: '#FF3B30',
    marginTop: 20,
    fontSize: 14,
    textAlign: 'center',
  },
});

