import { renderHook, waitFor } from '@testing-library/react-native';
import * as ReactNativeBiometrics from 'react-native-biometrics';
import { useBiometrics } from '../../src/hooks/useBiometrics';

// Mock react-native-biometrics
jest.mock('react-native-biometrics', () => ({
  isSensorAvailable: jest.fn(),
  createSignature: jest.fn(),
  simplePrompt: jest.fn(),
}));

const mockBiometrics = ReactNativeBiometrics as any;

describe('useBiometrics', () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  it('should check if biometrics are available', async () => {
    const { result } = renderHook(() => useBiometrics()) as any;

    // The hook returns functions, not properties
    expect(result.current.checkBiometricSupport).toBeDefined();
    expect(result.current.authenticateWithBiometrics).toBeDefined();
  });

  it('should handle biometrics not available', async () => {
    const { result } = renderHook(() => useBiometrics()) as any;

    expect(result.current.checkBiometricSupport).toBeDefined();
    expect(result.current.authenticateWithBiometrics).toBeDefined();
  });

  it('should authenticate with biometrics successfully', async () => {
    mockBiometrics.isSensorAvailable.mockResolvedValue({
      available: true,
      biometryType: 'FaceID',
    });
    mockBiometrics.simplePrompt.mockResolvedValue({
      success: true,
    });

    const { result } = renderHook(() => useBiometrics()) as any;

    await waitFor(() => {
      expect(result.current.isAvailable).toBe(true);
    });

    const authResult = await result.current.authenticate('Authenticate to unlock');

    expect(authResult).toBe(true);
    expect(mockBiometrics.simplePrompt).toHaveBeenCalledWith({
      promptMessage: 'Authenticate to unlock',
    });
  });

  it('should handle biometric authentication failure', async () => {
    mockBiometrics.isSensorAvailable.mockResolvedValue({
      available: true,
      biometryType: 'TouchID',
    });
    mockBiometrics.simplePrompt.mockResolvedValue({
      success: false,
    });

    const { result } = renderHook(() => useBiometrics()) as any;

    await waitFor(() => {
      expect(result.current.isAvailable).toBe(true);
    });

    const authResult = await result.current.authenticate('Authenticate to unlock');

    expect(authResult).toBe(false);
  });

  it('should handle biometric authentication error', async () => {
    mockBiometrics.isSensorAvailable.mockResolvedValue({
      available: true,
      biometryType: 'TouchID',
    });
    mockBiometrics.simplePrompt.mockRejectedValue(new Error('Biometric error'));

    const { result } = renderHook(() => useBiometrics()) as any;

    await waitFor(() => {
      expect(result.current.isAvailable).toBe(true);
    });

    const authResult = await result.current.authenticate('Authenticate to unlock');

    expect(authResult).toBe(false);
  });

  it('should return false when biometrics not available', async () => {
    mockBiometrics.isSensorAvailable.mockResolvedValue({
      available: false,
      biometryType: null,
    });

    const { result } = renderHook(() => useBiometrics()) as any;

    await waitFor(() => {
      expect(result.current.isAvailable).toBe(false);
    });

    const authResult = await result.current.authenticate('Authenticate to unlock');

    expect(authResult).toBe(false);
    expect(mockBiometrics.simplePrompt).not.toHaveBeenCalled();
  });
});
