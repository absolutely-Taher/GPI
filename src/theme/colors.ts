export const lightTheme = {
  primary: '#007AFF',
  secondary: '#5856D6',
  background: '#F5F5F5',
  surface: '#FFFFFF',
  text: '#000000',
  textSecondary: '#666666',
  textTertiary: '#999999',
  border: '#E0E0E0',
  error: '#FF3B30',
  success: '#34C759',
  warning: '#FF9500',
  info: '#007AFF',
  
  // Card colors
  card: '#FFFFFF',
  cardShadow: '#000',
  
  // Lock screen
  lockOverlay: 'rgba(0, 0, 0, 0.95)',
  lockText: '#FFFFFF',
  
  // Badge
  superadminBadge: '#FFD700',
  superadminText: '#000000',
  
  // Offline
  offlineBanner: '#FF9500',
  offlineText: '#FFFFFF',
  
  // Input
  inputBackground: '#FFFFFF',
  inputBorder: '#E0E0E0',
  inputPlaceholder: '#999999',
};

export const darkTheme = {
  primary: '#0A84FF',
  secondary: '#5E5CE6',
  background: '#000000',
  surface: '#1C1C1E',
  text: '#FFFFFF',
  textSecondary: '#EBEBF5',
  textTertiary: '#EBEBF599',
  border: '#38383A',
  error: '#FF453A',
  success: '#32D74B',
  warning: '#FF9F0A',
  info: '#0A84FF',
  
  // Card colors
  card: '#1C1C1E',
  cardShadow: '#000',
  
  // Lock screen
  lockOverlay: 'rgba(0, 0, 0, 0.98)',
  lockText: '#FFFFFF',
  
  // Badge
  superadminBadge: '#FFD60A',
  superadminText: '#000000',
  
  // Offline
  offlineBanner: '#FF9F0A',
  offlineText: '#000000',
  
  // Input
  inputBackground: '#2C2C2E',
  inputBorder: '#48484A',
  inputPlaceholder: '#EBEBF599',
};

export type Theme = typeof lightTheme;

