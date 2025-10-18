# 🔧 Quick Setup Guide - Fonts & Icons

## ✅ Step 1: Clean and Rebuild (For Icons)

I've added the vector icons configuration to `android/app/build.gradle`. Now rebuild:

```bash
cd android
./gradlew clean
cd ..
npx react-native run-android
```

This will fix the icons showing as X.

---

## 🔤 Step 2: Setup Ubuntu Font

### **Option A: Download Fonts Manually (Recommended)**

1. **Download Ubuntu Fonts:**
   - Visit: https://fonts.google.com/specimen/Ubuntu
   - Click the "Get font" button
   - Click "Download all"
   - Extract the ZIP file

2. **Create Directory:**
   ```bash
   mkdir -p assets/fonts
   ```

3. **Copy Font Files:**
   Copy these 8 files from the extracted folder to `assets/fonts/`:
   ```
   Ubuntu-Light.ttf
   Ubuntu-LightItalic.ttf
   Ubuntu-Regular.ttf
   Ubuntu-Italic.ttf
   Ubuntu-Medium.ttf
   Ubuntu-MediumItalic.ttf
   Ubuntu-Bold.ttf
   Ubuntu-BoldItalic.ttf
   ```

4. **Link the Fonts:**
   ```bash
   npx react-native-asset
   ```

5. **Rebuild the App:**
   ```bash
   cd android
   ./gradlew clean
   cd ..
   npx react-native run-android
   ```

### **Option B: Quick Setup with Direct Links**

If you want to download fonts via command line:

**For PowerShell (Windows):**

```powershell
# Create directory
New-Item -ItemType Directory -Force -Path assets/fonts

# Download fonts (you'll need to do this manually from Google Fonts)
# Then copy the .ttf files to assets/fonts/
```

---

## 🧪 Verify Setup

After rebuilding, check:

### **Icons Working:**
- ✅ Delete icon on product cards (trash can)
- ✅ Shopping bag icon on login screen
- ✅ Sun/Moon icons for theme toggle
- ✅ Shopping bag, lipstick, logout icons in tabs

### **Font Working:**
- ✅ Text looks cleaner and more modern
- ✅ Consistent typography across screens
- ✅ Check login screen titles first

---

## 🐛 Troubleshooting

### **Icons Still Showing as X**

1. **Verify the line was added:**
   - Open `android/app/build.gradle`
   - Check last line: `apply from: file("../../node_modules/react-native-vector-icons/fonts.gradle")`

2. **Clean build:**
   ```bash
   cd android
   ./gradlew clean
   ./gradlew assembleDebug
   cd ..
   ```

3. **Uninstall and reinstall app:**
   ```bash
   # Uninstall from device
   adb uninstall com.gpi
   
   # Rebuild
   npx react-native run-android
   ```

### **Font Not Applied**

1. **Check font files exist:**
   ```bash
   ls assets/fonts/
   ```
   Should show 8 Ubuntu .ttf files

2. **Check react-native.config.js exists** in root directory

3. **Re-link fonts:**
   ```bash
   npx react-native-asset
   ```

4. **Clear cache and rebuild:**
   ```bash
   npx react-native start --reset-cache
   
   # In another terminal
   cd android
   ./gradlew clean
   cd ..
   npx react-native run-android
   ```

5. **Manual Android Setup (if auto-link fails):**
   - Copy font files to: `android/app/src/main/assets/fonts/`
   - Rebuild

### **Font Fallback**

If Ubuntu font doesn't load, the app will gracefully fall back to system font. The app will still work perfectly, just without the custom font styling.

---

## 📝 Quick Command Reference

```bash
# 1. Clean and rebuild (for icons)
cd android && ./gradlew clean && cd .. && npx react-native run-android

# 2. Link fonts (after adding .ttf files)
npx react-native-asset

# 3. Full clean rebuild (if issues persist)
cd android && ./gradlew clean && cd ..
npx react-native start --reset-cache
# In new terminal: npx react-native run-android

# 4. Uninstall app from device
adb uninstall com.gpi
```

---

## ⏱️ Expected Time

- **Icons fix:** 2-3 minutes (rebuild)
- **Font setup:** 5-10 minutes (download + link + rebuild)

---

## ✅ Final Checklist

- [ ] Line added to `android/app/build.gradle`
- [ ] Cleaned and rebuilt Android
- [ ] Icons showing (not X symbols)
- [ ] 8 Ubuntu font files in `assets/fonts/`
- [ ] Ran `npx react-native-asset`
- [ ] Rebuilt app after font linking
- [ ] Ubuntu font applied (text looks modern)

---

## 🎉 Success!

Once both are working:
- ✨ Clean Material icons throughout
- 🔤 Beautiful Ubuntu typography
- 🎨 Professional, polished appearance

**Your modern UI is complete!** 🚀

