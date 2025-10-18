# 🚀 How to Run This App - Complete Guide

This guide will help you run the React Native app without facing the same issues every time.

## 📋 Prerequisites Check

Before running the app, ensure you have:
- ✅ **Node.js** (>= 20) - Check with `node --version`
- ✅ **JDK 17 or 20** - Check with `java -version`
- ✅ **Android Studio** installed
- ✅ **Android SDK Platform 36** installed via Android Studio

---

## ⚙️ ONE-TIME SETUP (Fix adb issues permanently)

### Step 1: Find Your Android SDK Path

1. Open **Android Studio**
2. Go to **File** → **Settings** (or **Configure** → **Settings** from welcome screen)
3. Navigate to **Appearance & Behavior** → **System Settings** → **Android SDK**
4. Copy the **Android SDK Location** path (usually: `C:\Users\YourUsername\AppData\Local\Android\Sdk`)
5. **IMPORTANT:** This should be the SDK path (ending in `\Sdk`), NOT the Android Studio installation path

### Step 2: Set Environment Variables Permanently (Windows)

1. Press `Win + X` and select **System**
2. Click **Advanced system settings** (right side)
3. Click **Environment Variables** button
4. Under **User variables**, click **New** and add:
   - **Variable name:** `ANDROID_HOME`
   - **Variable value:** Your SDK path (e.g., `C:\Users\YourUsername\AppData\Local\Android\Sdk`)

5. Find **Path** variable under **User variables**, click **Edit**
6. Click **New** and add these three paths:
   ```
   %ANDROID_HOME%\platform-tools
   %ANDROID_HOME%\tools
   %ANDROID_HOME%\tools\bin
   ```

7. Click **OK** on all windows

### Step 3: Accept Android SDK Licenses

**Option A: Using Android Studio (Easiest)**
1. Open **Android Studio**
2. Click **More Actions** → **SDK Manager**
3. Go to **SDK Tools** tab
4. Check **"NDK (Side by side)"** if not already checked
5. Click **"Apply"** and accept all licenses

**Option B: Using Command Line**
```powershell
# Replace YourUsername with your actual Windows username
& "C:\Users\YourUsername\AppData\Local\Android\Sdk\cmdline-tools\latest\bin\sdkmanager.bat" --licenses
```
Type `y` and press Enter for each license prompt.

### Step 4: Create local.properties File

1. Navigate to your project's `android` folder
2. Create a file named `local.properties` if it doesn't exist
3. Add this line (replace `YourUsername`):
   ```
   sdk.dir=C\:\\Users\\YourUsername\\AppData\\Local\\Android\\Sdk
   ```
4. Save the file

**Note:** Use double backslashes (`\\`) in the path!

### Step 5: Create an Android Emulator

1. Open **Android Studio**
2. Click **More Actions** → **Virtual Device Manager**
3. Click **"Create Device"** (+ button)
4. Select a device (e.g., **Pixel 6**) → **Next**
5. Select a system image (e.g., **API 36**) → Download if needed → **Next**
6. Click **Finish**

### Step 6: Verify Setup

1. **Close all PowerShell/Command Prompt windows**
2. **Close and restart your IDE (Cursor/VS Code)** - This is important!
3. Open a **new PowerShell** window (or use IDE's integrated terminal)
4. Run: `adb version`
5. You should see something like:
   ```
   Android Debug Bridge version 1.0.41
   Version 36.0.0-13206524
   Installed as C:\Users\YourUsername\AppData\Local\Android\Sdk\platform-tools\adb.exe
   ```

✅ **If you see the version, you're all set!**
❌ **If "adb is not recognized" still appears:**
   - Make sure you closed **all** terminal windows
   - **Restart your IDE** (very important - IDEs don't pick up new env vars until restarted)
   - If still not working, restart your computer

---

## 🏃 HOW TO RUN THE APP (Every Time)

### Method 1: Using Android Emulator (Recommended for Testing)

#### Start Emulator First
1. Open **Android Studio**
2. Click **More Actions** → **Virtual Device Manager** (or **Tools** → **Device Manager**)
3. Click the ▶️ **Play** button next to any emulator
4. Wait for emulator to fully boot (you'll see the home screen)

#### Run the App
Open **PowerShell** in your project directory and run:

```powershell
# Terminal 1: Start Metro Bundler
npm start
```

In a **new PowerShell window**:
```powershell
# Terminal 2: Build and run on emulator
npm run android
```

### Method 2: Using Physical Android Device

#### Enable Developer Options on Your Phone
1. Go to **Settings** → **About Phone**
2. Tap **Build Number** 7 times (enables Developer Options)
3. Go back to **Settings** → **System** → **Developer Options**
4. Enable **USB Debugging**
5. Connect phone to PC via USB cable
6. Allow USB debugging when prompted on phone

#### Verify Device Connection
```powershell
adb devices
```
You should see your device listed. If not, troubleshoot USB connection.

#### Setup Port Forwarding
```powershell
adb reverse tcp:8081 tcp:8081
```

#### Run the App
```powershell
# Terminal 1: Start Metro Bundler
npm start
```

In a **new PowerShell window**:
```powershell
# Terminal 2: Build and run on device
npm run android
```

---

## 🔄 EVERYDAY WORKFLOW (Quick Reference)

Once setup is complete, follow these steps **every time** you want to run the app:

### Step 1: Start Emulator/Connect Device
- **Emulator:** Open Android Studio → Device Manager → Start emulator
- **Physical Device:** Connect via USB, ensure USB debugging is on

### Step 2: Verify Connection
```powershell
adb devices
```
✅ You should see your device/emulator listed

### Step 3: Start Metro Bundler
```powershell
npm start
```
✅ Keep this terminal running

### Step 4: Run the App (New Terminal)
```powershell
npm run android
```
✅ App will build and install automatically

### Step 5: Wait for App to Launch
- First build takes 2-5 minutes
- Subsequent builds are faster (30 seconds - 1 minute)
- App will open automatically when ready

---

## 🐛 COMMON ISSUES & SOLUTIONS

### Issue 1: "adb is not recognized"
**Solution:** 
- Complete the **ONE-TIME SETUP** above
- **Close and restart your IDE (Cursor/VS Code)** - Most common fix!
- Close all terminal windows and open new ones
- If still not working, restart your computer

**Note:** If `adb` works in regular PowerShell but not in your IDE's integrated terminal, you just need to restart the IDE!

### Issue 2: "No devices connected"
**Solutions:**
- **For Emulator:** 
  - Start emulator from Android Studio first
  - Wait until it fully boots before running `npm run android`
  - Run `adb devices` to verify it's detected
  
- **For Physical Device:**
  - Enable USB debugging
  - Try different USB cable/port
  - Install device USB drivers (from manufacturer website)
  - Run `adb kill-server` then `adb start-server`

### Issue 3: Metro bundler says "No apps connected"
**Solution:**
- This is **normal** if no device/emulator is running
- Start your emulator or connect device first
- Then run `npm run android` in a separate terminal
- The app will auto-connect to Metro when it launches

### Issue 4: Build fails with "ANDROID_HOME not found"
**Solution:**
- Verify `ANDROID_HOME` is set: `echo $env:ANDROID_HOME`
- If empty, redo **Step 2** in ONE-TIME SETUP
- Restart terminal/computer after setting

### Issue 5: "Could not connect to development server"
**Solutions:**
- **For Emulator:** It should work automatically
- **For Physical Device on same WiFi:**
  - Shake device → Dev Menu → Settings → Debug server host
  - Enter: `YOUR_PC_IP:8081` (find PC IP with `ipconfig`)
  
- **For Physical Device via USB:**
  - Run: `adb reverse tcp:8081 tcp:8081`
  - Restart app

### Issue 6: "INSTALL_FAILED_INSUFFICIENT_STORAGE"
**Solution:**
- Free up space on device/emulator
- Or uninstall old version: `adb uninstall com.gpi`

### Issue 7: Red screen with errors in app
**Solution:**
- Check Metro terminal for error details
- Try: Press `R` in Metro terminal to reload
- Or shake device → Reload
- If still failing, clear cache: `npm start --reset-cache`

### Issue 8: "LicenceNotAcceptedException" or "NDK license not accepted"
**Error Message:** `Failed to install the following Android SDK packages as some licences have not been accepted`

**Solution:**
1. Open **Android Studio** → **SDK Manager** → **SDK Tools** tab
2. Check **"NDK (Side by side)"** → Click **Apply**
3. Accept all licenses when prompted
4. Or run: `sdkmanager --licenses` (see Step 3 in ONE-TIME SETUP)

### Issue 9: Build fails with wrong SDK path
**Error Message:** `Using Android SDK: C:\Program Files\Android\Android Studio`

**Solution:**
- Create/edit `android/local.properties` file
- Add correct SDK path:
  ```
  sdk.dir=C\:\\Users\\YourUsername\\AppData\\Local\\Android\\Sdk
  ```
- Make sure to use double backslashes (`\\`)
- **DO NOT** use the Android Studio installation path!

### Issue 10: "No emulators found"
**Solution:**
- Create an emulator in Android Studio (see Step 5 in ONE-TIME SETUP)
- Or connect a physical device via USB with USB debugging enabled
- Make sure emulator is fully booted before running `npm run android`

---

## 🎯 TEST CREDENTIALS

Once the app launches successfully, use these credentials:

```
Username: emilys
Password: emilyspass
```

**Features to test:**
- ✅ Login with credentials above
- ✅ Browse All Products tab
- ✅ Browse Beauty tab
- ✅ Delete products (only works with `emilys` - superadmin)
- ✅ Wait 10 seconds → Auto-lock triggers
- ✅ Press home button → App locks
- ✅ Unlock with biometrics

---

## 📱 QUICK COMMANDS CHEATSHEET

```powershell
# Check if adb is working
adb devices

# List all connected devices
adb devices -l

# Restart adb server (if device not showing)
adb kill-server
adb start-server

# Port forwarding for physical device
adb reverse tcp:8081 tcp:8081

# Install app manually
npm run android

# Start Metro only
npm start

# Clear Metro cache
npm start --reset-cache

# Uninstall app from device
adb uninstall com.gpi

# View device logs (debugging)
adb logcat | findstr "ReactNative"
```

---

## 🔧 ADVANCED: If Nothing Works

### Nuclear Option - Complete Clean Build
```powershell
# 1. Stop all processes (Metro, emulator, etc.)

# 2. Clean Android build
cd android
./gradlew clean
cd ..

# 3. Clear Metro cache
npm start --reset-cache

# 4. In new terminal, rebuild
npm run android
```

### Reinstall Dependencies
```powershell
# Delete node_modules and reinstall
rm -r node_modules
rm package-lock.json
npm install

# Clean Android build
cd android
./gradlew clean
cd ..

# Start fresh
npm start
# (new terminal)
npm run android
```

---

## 💡 PRO TIPS

1. **Keep Metro Running:** Never close the Metro terminal while developing
2. **Use Emulator:** Faster iteration than physical device
3. **Fast Refresh:** Edit code and save - changes appear automatically (no rebuild needed)
4. **Reload App:** Press `R` in Metro terminal or shake device → Reload
5. **Debug Menu:** Shake device or press `Ctrl+M` (emulator) for dev menu
6. **Network Issues:** Always check Metro terminal first for errors
7. **First Build:** Takes 3-5 minutes, subsequent builds are much faster

---

## ✅ SUCCESS CHECKLIST

Before reporting issues, verify:
- [ ] `adb devices` shows your device/emulator
- [ ] Metro bundler is running (`npm start`)
- [ ] Device/emulator has USB debugging enabled
- [ ] ANDROID_HOME environment variable is set
- [ ] You waited for emulator to fully boot
- [ ] You're running commands in project root directory
- [ ] Node version is >= 20 (`node --version`)

---

**Need Help?** Check the error message in:
1. Metro terminal (where you ran `npm start`)
2. Build terminal (where you ran `npm run android`)
3. Device/emulator app screen (red error screen)

Most issues are solved by restarting Metro, rebuilding, or checking device connection!

