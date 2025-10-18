/**
 * Font utility for React Native Android compatibility
 * 
 * On Android, fontWeight doesn't automatically resolve to the correct font file.
 * We need to specify the exact font family name for each weight.
 */

export type FontWeight = '300' | '400' | '500' | '600' | '700' | 'normal' | 'bold';

/**
 * Get the correct Ubuntu font family name for a given weight
 * Use this instead of combining fontFamily with fontWeight
 */
export const getUbuntuFont = (weight: FontWeight = '400'): string => {
  switch (weight) {
    case '300':
      return 'Ubuntu-Light';
    case '400':
    case 'normal':
      return 'Ubuntu-Regular';
    case '500':
      return 'Ubuntu-Medium';
    case '600':
    case '700':
    case 'bold':
      return 'Ubuntu-Bold';
    default:
      return 'Ubuntu-Regular';
  }
};

/**
 * Font style preset for easy use in StyleSheet
 * Usage: ...fonts.regular or ...fonts.bold
 */
export const fonts = {
  light: {
    fontFamily: 'Ubuntu-Light',
    fontWeight: '300' as const,
  },
  regular: {
    fontFamily: 'Ubuntu-Regular',
    fontWeight: '400' as const,
  },
  medium: {
    fontFamily: 'Ubuntu-Medium',
    fontWeight: '500' as const,
  },
  semiBold: {
    fontFamily: 'Ubuntu-Bold',
    fontWeight: '600' as const,
  },
  bold: {
    fontFamily: 'Ubuntu-Bold',
    fontWeight: '700' as const,
  },
};

