// Modern retail design tokens - brand green (#006B35) + paper neutrals (#FFFef9)
// Font family: Ubuntu (weights: 300=Light, 400=Regular, 500=Medium, 700=Bold)
export const lightTheme = {
  fontFamily: 'Ubuntu',
  primary: '#006B35',
  primaryAlt: '#0A7A45',
  secondary: '#006B35',
  background: '#FFFef9',
  surface: '#FFFFFF',
  surfaceAlt: '#FFFBF1',
  text: '#0E0E0C',
  textSecondary: '#5F5F5F',
  textTertiary: '#C2C2C2',
  border: '#E7E2D9',
  borderStrong: '#CFCAC0',
  error: '#D64545',
  success: '#1F8E57',
  warning: '#B38F00',
  info: '#006B35',
  muted: '#C2C2C2',
  
  // Card colors
  card: '#FFFFFF',
  cardShadow: 'rgba(17,24,39,0.12)',
  outline: '#E7E2D9',
  
  // Lock screen
  lockOverlay: 'rgba(0, 0, 0, 0.95)',
  lockText: '#FFFFFF',
  
  // Badge
  superadminBadge: 'rgba(0,107,53,0.15)',
  superadminText: '#006B35',
  
  // Offline
  offlineBanner: '#B38F00',
  offlineText: '#FFFFFF',
  
  // Input
  inputBackground: '#FFFFFF',
  inputBorder: '#E7E2D9',
  inputPlaceholder: '#C2C2C2',
  
  // Radii
  radiusXl: 24,
  radiusLg: 16,
  radiusMd: 12,
  radiusSm: 8,
};

export const darkTheme = {
  fontFamily: 'Ubuntu',
  primary: '#27A065',
  primaryAlt: '#19C47A',
  secondary: '#27A065',
  background: '#0A0F0D',
  surface: '#0F1714',
  surfaceAlt: '#14211B',
  text: '#FFFef9',
  textSecondary: '#C2C2C2',
  textTertiary: '#8F8F8F',
  border: '#1E2A24',
  borderStrong: '#26362E',
  error: '#F07070',
  success: '#31B277',
  warning: '#C8A52A',
  info: '#27A065',
  muted: '#8F8F8F',
  
  // Card colors
  card: '#0F1714',
  cardShadow: 'rgba(0,0,0,0.50)',
  outline: '#1E2A24',
  
  // Lock screen
  lockOverlay: 'rgba(0, 0, 0, 0.98)',
  lockText: '#FFFef9',
  
  // Badge
  superadminBadge: 'rgba(39,160,101,0.20)',
  superadminText: '#27A065',
  
  // Offline
  offlineBanner: '#C8A52A',
  offlineText: '#000000',
  
  // Input
  inputBackground: '#14211B',
  inputBorder: '#1E2A24',
  inputPlaceholder: '#8F8F8F',
  
  // Radii
  radiusXl: 24,
  radiusLg: 16,
  radiusMd: 12,
  radiusSm: 8,
};

export type Theme = typeof lightTheme;

