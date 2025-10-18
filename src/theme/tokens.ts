export const light = {
  mode: 'light' as const,
  colors: {
    bg: '#FFFef9',
    surface: '#FFFFFF',
    surfaceAlt: '#FFFBF1',
    textPrimary: '#0E0E0C',
    textSecondary: '#5F5F5F',
    primary: '#006B35',
    primaryAlt: '#0A7A45',
    accent: '#006B35',
    success: '#1F8E57',
    warning: '#B38F00',
    error: '#D64545',
    outline: '#E7E2D9',
    outlineStrong: '#CFCAC0',
    muted: '#C2C2C2',
    cardShadow: 'rgba(17,24,39,0.12)',
  },
};

export const dark = {
  mode: 'dark' as const,
  colors: {
    bg: '#0A0F0D',
    surface: '#0F1714',
    surfaceAlt: '#14211B',
    textPrimary: '#FFFef9',
    textSecondary: '#C2C2C2',
    primary: '#27A065',
    primaryAlt: '#19C47A',
    accent: '#27A065',
    success: '#31B277',
    warning: '#C8A52A',
    error: '#F07070',
    outline: '#1E2A24',
    outlineStrong: '#26362E',
    muted: '#8F8F8F',
    cardShadow: 'rgba(0,0,0,0.50)',
  },
};

export type ThemeMode = 'light' | 'dark';
export type Theme = typeof light | typeof dark;

