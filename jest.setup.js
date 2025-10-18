// Jest setup for React Native testing

// Mock react-native-vector-icons
jest.mock('react-native-vector-icons/MaterialCommunityIcons', () => 'Icon');

// Mock react-native-keychain
jest.mock('react-native-keychain', () => ({
  setGenericPassword: jest.fn(() => Promise.resolve(true)),
  getGenericPassword: jest.fn(() => Promise.resolve(false)),
  resetGenericPassword: jest.fn(() => Promise.resolve(true)),
}));

// Mock react-native-biometrics
jest.mock('react-native-biometrics', () => {
  const mockBiometricsInstance = {
    isSensorAvailable: jest.fn(() => Promise.resolve({ available: true, biometryType: 'FaceID' })),
    simplePrompt: jest.fn(() => Promise.resolve({ success: true })),
    createSignature: jest.fn(),
  };
  
  const MockBiometrics = jest.fn(() => mockBiometricsInstance);
  
  return {
    default: MockBiometrics,
    __esModule: true,
  };
});

// Mock react-native-mmkv
const mockMMKVInstance = {
  getString: jest.fn((key) => undefined),
  set: jest.fn(),
  delete: jest.fn(),
  getNumber: jest.fn(),
  setNumber: jest.fn(),
  getBoolean: jest.fn(),
  setBoolean: jest.fn(),
  getAllKeys: jest.fn(() => []),
  clearAll: jest.fn(),
  contains: jest.fn(() => false),
};

jest.mock('react-native-mmkv', () => ({
  MMKV: jest.fn(() => mockMMKVInstance),
}));

// Mock storage utils
jest.mock('./src/utils/storage', () => ({
  storage: mockMMKVInstance,
  setItem: jest.fn(),
  getItem: jest.fn(),
  setObject: jest.fn(),
  getObject: jest.fn(),
  removeItem: jest.fn(),
  clearAll: jest.fn(),
}));

// Mock @react-native-community/netinfo
jest.mock('@react-native-community/netinfo', () => ({
  addEventListener: jest.fn(() => jest.fn()),
  removeEventListener: jest.fn(),
  fetch: jest.fn(() => Promise.resolve({ isConnected: true, isInternetReachable: true })),
}));

// Mock axios
jest.mock('axios', () => ({
  default: {
    create: jest.fn(() => ({
      interceptors: {
        request: { use: jest.fn(), eject: jest.fn() },
        response: { use: jest.fn(), eject: jest.fn() },
      },
      get: jest.fn(),
      post: jest.fn(),
      put: jest.fn(),
      delete: jest.fn(),
      patch: jest.fn(),
    })),
  },
  create: jest.fn(() => ({
    interceptors: {
      request: { use: jest.fn(), eject: jest.fn() },
      response: { use: jest.fn(), eject: jest.fn() },
    },
    get: jest.fn(),
    post: jest.fn(),
    put: jest.fn(),
    delete: jest.fn(),
    patch: jest.fn(),
  })),
}));

// Mock react-native-safe-area-context
jest.mock('react-native-safe-area-context', () => ({
  useSafeAreaInsets: () => ({ top: 0, bottom: 0, left: 0, right: 0 }),
  SafeAreaProvider: ({ children }) => children,
  SafeAreaView: ({ children }) => children,
}));

// Mock react-native-screens
jest.mock('react-native-screens', () => ({
  enableScreens: jest.fn(),
}));

// Mock react-native-gesture-handler
jest.mock('react-native-gesture-handler', () => {
  const View = require('react-native').View;
  return {
    GestureHandlerRootView: View,
    PanGestureHandler: View,
    TapGestureHandler: View,
    State: {},
    Directions: {},
  };
});

// Mock React Navigation
jest.mock('@react-navigation/native', () => {
  return {
    ...jest.requireActual('@react-navigation/native'),
    useNavigation: () => ({
      navigate: jest.fn(),
      dispatch: jest.fn(),
      goBack: jest.fn(),
      setOptions: jest.fn(),
    }),
    useRoute: () => ({
      params: {},
      key: 'test-route',
      name: 'TestScreen',
    }),
    useFocusEffect: jest.fn(),
    NavigationContainer: ({ children }) => children,
  };
});

// Global test setup
global.console = {
  ...console,
  // Suppress console.log in tests unless explicitly needed
  log: jest.fn(),
  debug: jest.fn(),
  info: jest.fn(),
  warn: jest.fn(),
  error: jest.fn(),
};
