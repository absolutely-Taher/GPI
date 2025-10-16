import ReactNativeBiometrics, { BiometryTypes } from 'react-native-biometrics';
import * as Keychain from 'react-native-keychain';

const rnBiometrics = new ReactNativeBiometrics();

export const useBiometrics = () => {
  const checkBiometricSupport = async (): Promise<boolean> => {
    try {
      const { available, biometryType } = await rnBiometrics.isSensorAvailable();
      return available && (
        biometryType === BiometryTypes.TouchID ||
        biometryType === BiometryTypes.FaceID ||
        biometryType === BiometryTypes.Biometrics
      );
    } catch (error) {
      return false;
    }
  };

  const authenticate = async (): Promise<boolean> => {
    try {
      const isSupported = await checkBiometricSupport();

      if (!isSupported) {
        // Fallback to password
        return authenticateWithPassword();
      }

      const { success } = await rnBiometrics.simplePrompt({
        promptMessage: 'Unlock GetPayIn Store',
        cancelButtonText: 'Use Password',
      });

      if (!success) {
        // User cancelled or failed - try password fallback
        return authenticateWithPassword();
      }

      return success;
    } catch (error: any) {
      // On error, try password fallback
      return authenticateWithPassword();
    }
  };

  const authenticateWithPassword = async (): Promise<boolean> => {
    try {
      // For password fallback, we'll use Keychain
      const credentials = await Keychain.getGenericPassword();
      return !!credentials;
    } catch (error) {
      return false;
    }
  };

  const savePassword = async (username: string, password: string) => {
    try {
      await Keychain.setGenericPassword(username, password);
    } catch (error) {
      console.error('Failed to save password', error);
    }
  };

  return {
    authenticate,
    checkBiometricSupport,
    savePassword,
  };
};

