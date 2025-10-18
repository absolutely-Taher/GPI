# Ubuntu Fonts Fix Summary

## Issue
Ubuntu fonts were not displaying in the React Native Android app despite being installed and linked.

## Root Cause
**Android-specific behavior:** On Android, React Native doesn't automatically match `fontFamily: 'Ubuntu'` combined with `fontWeight` to the correct font file (Ubuntu-Regular.ttf, Ubuntu-Bold.ttf, etc.).

## Solution
Changed font references from generic `fontFamily: 'Ubuntu'` to specific font file names:

### Before (Not Working on Android):
```typescript
{
  fontFamily: 'Ubuntu',
  fontWeight: '700',
}
```

### After (Works on Android):
```typescript
{
  fontFamily: 'Ubuntu-Bold',
}
```

## Font Mapping
| Weight | Old Style | New Style |
|--------|-----------|-----------|
| Light (300) | `fontFamily: 'Ubuntu'`, `fontWeight: '300'` | `fontFamily: 'Ubuntu-Light'` |
| Regular (400) | `fontFamily: 'Ubuntu'`, `fontWeight: '400'` | `fontFamily: 'Ubuntu-Regular'` |
| Medium (500) | `fontFamily: 'Ubuntu'`, `fontWeight: '500'` | `fontFamily: 'Ubuntu-Medium'` |
| Bold (700) | `fontFamily: 'Ubuntu'`, `fontWeight: '700'` | `fontFamily: 'Ubuntu-Bold'` |

## Files Updated

### 1. Created Font Utility
- **File:** `src/utils/fonts.ts`
- **Purpose:** Helper functions for consistent font usage
- **Exports:** `getUbuntuFont()` function and `fonts` presets

### 2. Updated Screen Components
- ✅ `src/screens/LoginScreen.tsx`
- ✅ `src/screens/AllProductsScreen.tsx`
- ✅ `src/screens/CategoryProductsScreen.tsx`

### 3. Updated Components
- ✅ `src/components/ProductCard.tsx`

### 4. Updated Navigation
- ✅ `src/navigation/index.tsx`

## Technical Details

### Font Files Location
```
android/app/src/main/assets/fonts/
├── Ubuntu-Bold.ttf
├── Ubuntu-BoldItalic.ttf
├── Ubuntu-Italic.ttf
├── Ubuntu-Light.ttf
├── Ubuntu-LightItalic.ttf
├── Ubuntu-Medium.ttf
├── Ubuntu-MediumItalic.ttf
└── Ubuntu-Regular.ttf
```

### Linking Method
Fonts were linked using `npx react-native-asset` which automatically:
- Copies fonts to `android/app/src/main/assets/fonts/`
- Updates iOS Xcode project
- Registers fonts with the app

## Why This Happens
Android's font system requires explicit font family names for each style/weight combination. Unlike iOS, which can interpolate font weights from a base font family, Android needs each font file to be referenced by its exact filename (without the .ttf extension).

## Best Practices Going Forward

### Option 1: Use Specific Font Names (Current Implementation)
```typescript
const styles = StyleSheet.create({
  title: {
    fontFamily: 'Ubuntu-Bold',  // Specific font file
  },
});
```

### Option 2: Use Font Utility Helper
```typescript
import { fonts } from '../utils/fonts';

const styles = StyleSheet.create({
  title: {
    ...fonts.bold,  // Provides: fontFamily: 'Ubuntu-Bold', fontWeight: '700'
  },
});
```

### Option 3: Use getUbuntuFont() Function
```typescript
import { getUbuntuFont } from '../utils/fonts';

const styles = StyleSheet.create({
  title: {
    fontFamily: getUbuntuFont('700'),  // Returns: 'Ubuntu-Bold'
  },
});
```

## Verification
To verify fonts are working:
1. Build and run the app: `npm run android`
2. Check that text appears in Ubuntu font (clean, modern typeface)
3. Different weights should have visible differences (light, regular, bold)

## Notes
- iOS typically doesn't have this issue as it handles fontWeight automatically
- This is a common gotcha when working with custom fonts in React Native Android
- Always test custom fonts on an actual Android device or emulator

