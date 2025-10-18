# ⚡ Quick Start Guide - Run the App

> **First time?** Complete the [RUN_APP_GUIDE.md](./RUN_APP_GUIDE.md) one-time setup first!

## 🏃 Run the App (Every Time)

### Step 1: Start Emulator
Open Android Studio → Device Manager → Click ▶️ Play button

### Step 2: Verify Connection
```powershell
adb devices
```
✅ Should show your emulator/device listed

### Step 3: Start Metro Bundler
```powershell
npm start
```
✅ Keep this terminal running

### Step 4: Run the App (New Terminal)
```powershell
npm run android
```
✅ Wait 2-5 minutes for first build, then app will launch automatically

---

## 🔑 Test Credentials

```
Username: emilys
Password: emilyspass
```

---

## 🐛 Quick Troubleshooting

| Issue | Solution |
|-------|----------|
| `adb is not recognized` | Restart Cursor/IDE after setting env vars |
| `No devices connected` | Start emulator first, wait for full boot |
| `License not accepted` | Run: `sdkmanager --licenses` |
| Build fails with wrong SDK path | Check `android/local.properties` has correct path |
| Metro shows "No apps connected" | Normal until you run `npm run android` |
| Can't connect to dev server | Run: `adb reverse tcp:8081 tcp:8081` |

---

## 📖 Need More Help?

See [RUN_APP_GUIDE.md](./RUN_APP_GUIDE.md) for detailed instructions and full troubleshooting guide.

---

## 🎯 Features to Test

After logging in:
- ✅ Browse All Products tab
- ✅ Browse Beauty tab  
- ✅ Delete products (superadmin only)
- ✅ Wait 10 seconds → Auto-lock
- ✅ Press home button → App locks
- ✅ Unlock with biometrics
- ✅ Turn off WiFi → Offline mode with cached data

