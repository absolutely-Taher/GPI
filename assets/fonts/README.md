# Ubuntu Font Setup

## Download Ubuntu Fonts

1. Go to: https://fonts.google.com/specimen/Ubuntu
2. Click "Get font" then "Download all"
3. Extract the downloaded ZIP file
4. Copy these font files to this directory (`assets/fonts/`):

### Required Font Files:
```
Ubuntu-Light.ttf
Ubuntu-Regular.ttf
Ubuntu-Medium.ttf
Ubuntu-Bold.ttf
Ubuntu-LightItalic.ttf
Ubuntu-Italic.ttf
Ubuntu-MediumItalic.ttf
Ubuntu-BoldItalic.ttf
```

## After Adding Fonts

Run these commands:

### For React Native 0.69+:
```bash
npx react-native-asset
```

### Or manually link (if above doesn't work):
```bash
npx react-native link
```

## Font Usage in Code

After linking, use the font family name `'Ubuntu'` with appropriate weights:

```typescript
{
  fontFamily: 'Ubuntu',
  fontWeight: '300',  // Light
  fontWeight: '400',  // Regular
  fontWeight: '500',  // Medium  
  fontWeight: '700',  // Bold
}
```

## Android Specific (if manual setup needed)

Place fonts in: `android/app/src/main/assets/fonts/`

## iOS Specific (if manual setup needed)

1. Add fonts to Xcode project
2. Update `Info.plist` with font names

