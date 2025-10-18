import ReactNativeBiometrics, { BiometryTypes } from 'react-native-biometrics';
import * as Keychain from 'react-native-keychain';

const rnBiometrics = new ReactNativeBiometrics();

export const useBiometrics = () => {
  const checkBiometricSupport = async (): Promise<{
    available: boolean;
    biometryType?: string;
  }> => {
    try {
      const { available, biometryType } = await rnBiometrics.isSensorAvailable();
      const isSupported = available && (
        biometryType === BiometryTypes.TouchID ||
        biometryType === BiometryTypes.FaceID ||
        biometryType === BiometryTypes.Biometrics
      );
      return { available: isSupported, biometryType };
    } catch (error) {
      console.error('Error checking biometric support:', error);
      return { available: false };
    }
  };

  const authenticateWithBiometrics = async (): Promise<{
    success: boolean;
    cancelled?: boolean;
    error?: string;
  }> => {
    try {
      const { available } = await checkBiometricSupport();

      if (!available) {
        return { success: false, error: 'Biometrics not available' };
      }

      const { success } = await rnBiometrics.simplePrompt({
        promptMessage: 'Unlock GetPayIn Store',
        cancelButtonText: 'Cancel',
      });

      return { success, cancelled: !success };
    } catch (error: any) {
      console.error('Biometric authentication error:', error);
      if (error.message?.includes('cancel') || error.name === 'UserCancel') {
        return { success: false, cancelled: true };
      }
      return { success: false, error: error.message || 'Authentication failed' };
    }
  };

  const authenticateWithPassword = async (inputPassword: string): Promise<boolean> => {
    try {
      const credentials = await Keychain.getGenericPassword();
      
      if (!credentials) {
        console.log('No credentials stored in keychain');
        return false;
      }

      console.log('Stored username:', credentials.username);
      console.log('Input password length:', inputPassword.length);
      console.log('Stored password length:', credentials.password.length);
      
      // Trim both passwords to avoid whitespace issues
      const storedPassword = credentials.password.trim();
      const enteredPassword = inputPassword.trim();
      
      console.log('Password match:', storedPassword === enteredPassword);

      // Compare the input password with the stored password
      return storedPassword === enteredPassword;
    } catch (error) {
      console.error('Password authentication error:', error);
      return false;
    }
  };

  const getStoredCredentials = async (): Promise<{
    username: string;
    password: string;
  } | null> => {
    try {
      const credentials = await Keychain.getGenericPassword();
      if (!credentials) {
        return null;
      }
      return {
        username: credentials.username,
        password: credentials.password,
      };
    } catch (error) {
      console.error('Failed to get stored credentials', error);
      return null;
    }
  };

  const savePassword = async (username: string, password: string) => {
    try {
      console.log('Saving credentials for username:', username);
      console.log('Password length being saved:', password.length);
      await Keychain.setGenericPassword(username, password);
      console.log('Credentials saved successfully');
      
      // Verify the save by reading back
      const verification = await Keychain.getGenericPassword();
      if (verification) {
        console.log('Verification - stored username:', verification.username);
        console.log('Verification - password length:', verification.password.length);
      }
    } catch (error) {
      console.error('Failed to save password', error);
    }
  };

  return {
    authenticateWithBiometrics,
    authenticateWithPassword,
    checkBiometricSupport,
    savePassword,
    getStoredCredentials,
  };
};

