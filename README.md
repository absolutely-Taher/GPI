# GetPayIn Store - React Native Coding Challenge

A minimal 3-page e-commerce store application built with React Native, featuring authentication, auto-lock with biometric unlock, offline support, and product management.

## 🎯 Features

### ✅ Authentication
- Login via DummyJSON API (`/auth/login`)
- Session persistence with MMKV storage
- Automatic session restoration on app launch with biometric prompt
- Superadmin role designation (username: `emilys`)

### 🔒 Auto-Lock & Biometric Security
- **Auto-lock triggers:**
  - After 10 seconds of inactivity
  - When app goes to background
- Biometric authentication (fingerprint/face unlock)
- Password fallback when biometrics unavailable
- Lock overlay obscures all content

### 📦 Product Management
- **All Products Screen:** Displays all products with thumbnail and title
- **Specific Category Screen:** Shows products filtered by "beauty" category
- Pull-to-refresh on both product screens
- Superadmin can delete products (simulated deletion via API)

### 💾 Offline Support
- React Query cache persisted to MMKV
- Instant cached data on app relaunch (online or offline)
- Offline indicator banner when disconnected
- All cached product lists available offline

### 🗂️ Tech Stack
- **React Native** 0.82.0
- **TypeScript** for type safety
- **React Navigation** for routing (Stack & Bottom Tabs)
- **React Query** for data fetching and caching
- **MMKV** for persistent storage
- **Redux Toolkit** for global state management
- **Axios** for HTTP requests
- **react-native-touch-id** for biometric authentication
- **react-native-keychain** for secure credential storage
- **@react-native-community/netinfo** for network detection

## 📱 Screens

### 1. Login Screen
- Username/password input
- Authenticates via DummyJSON `/auth/login`
- Displays test credentials hint
- Saves credentials for biometric fallback

### 2. All Products Screen
- Lists all products from `/products`
- Shows thumbnail, title, price, and category
- Pull-to-refresh support
- **Superadmin only:** Delete button on each product
- Displays "👑 Superadmin Mode" badge when logged in as superadmin

### 3. Specific Category Screen (Beauty)
- Lists products from `/products/category/beauty`
- Same UI as All Products (without delete)
- Pull-to-refresh support
- Shows product count

## 🚀 Setup & Installation

### Prerequisites
- Node.js >= 20
- JDK 17 or 20
- Android Studio with SDK Platform 36
- Android device or emulator

### Installation Steps

1. **Clone the repository**
   ```bash
   git clone <repository-url>
   cd GPI/GPI
   ```

2. **Install dependencies**
   ```bash
   npm install
   ```

3. **Set environment variables (Windows)**
   ```powershell
   # Set JAVA_HOME
   $env:JAVA_HOME="C:\Program Files\Java\jdk-17"
   
   # Set ANDROID_HOME
   $env:ANDROID_HOME="C:\Users\<YourUsername>\AppData\Local\Android\Sdk"
   
   # Update PATH
   $env:PATH="$env:JAVA_HOME\bin;$env:ANDROID_HOME\platform-tools;$env:ANDROID_HOME\tools;$env:PATH"
   ```

4. **Start Metro bundler**
   ```bash
   npm start
   ```

5. **Run on Android** (in a new terminal)
   ```bash
   npm run android
   ```

## 🎮 Usage

### Test Credentials
```
Username: emilys
Password: emilyspass
```
**Note:** `emilys` is designated as the **superadmin** and can delete products.

### Other Test Users
You can also use any user from [DummyJSON users list](https://dummyjson.com/users):
- Username: `michaelw`, Password: `michaelwpass`
- Username: `sophiab`, Password: `sophiabpass`

### Navigation
- **All Products Tab:** Browse all products, delete as superadmin
- **Beauty Tab:** Browse beauty category products
- **Sign Out Tab:** Tap to sign out (with confirmation)

### Testing Auto-Lock
1. Login to the app
2. Wait 10 seconds without interaction → App locks
3. Or press home button to background app → App locks
4. Unlock screen appears with biometric prompt

### Testing Offline Mode
1. Login and browse products
2. Turn off WiFi/mobile data
3. Close and reopen app
4. Cached products still visible with offline banner

## 🏗️ Project Structure

```
src/
├── components/        # Reusable UI components
│   ├── LockScreen.tsx
│   ├── OfflineIndicator.tsx
│   └── ProductCard.tsx
├── hooks/            # Custom React hooks
│   ├── useAuth.ts
│   ├── useAutoLock.ts
│   ├── useBiometrics.ts
│   ├── useNetworkStatus.ts
│   └── useProducts.ts
├── navigation/       # React Navigation setup
│   └── index.tsx
├── screens/          # Screen components
│   ├── AllProductsScreen.tsx
│   ├── CategoryProductsScreen.tsx
│   └── LoginScreen.tsx
├── services/         # API integration
│   └── api.ts
├── store/           # Redux Toolkit store
│   ├── appSlice.ts
│   ├── authSlice.ts
│   └── index.ts
├── types/           # TypeScript type definitions
│   └── index.ts
└── utils/           # Utility functions
    ├── queryClient.ts
    └── storage.ts
```

## 📋 Configuration Details

### Chosen Category
**Beauty** - The Specific Category screen filters products from the "beauty" category.

### Superadmin User
**Username:** `emilys` - This user has delete permissions on the All Products screen.

### Cache Strategy
- **React Query** with MMKV persistence
- 24-hour garbage collection time
- 5-minute stale time
- Cache survives app restarts
- Instant data display on relaunch

## ⚖️ Trade-offs & Decisions

### What I Built
✅ Clean, minimal UI focusing on functionality
✅ Robust error handling for network failures
✅ Efficient caching strategy with instant offline access
✅ Simple but effective lock screen implementation
✅ Proper TypeScript typing throughout

### What I Simplified
- **No advanced animations** - Focused on core functionality over polish
- **Basic UI styling** - Professional but minimal design
- **Simulated delete** - DummyJSON returns `isDeleted` but doesn't persist
- **Single category** - Only "beauty" category for the specific screen
- **Basic error messages** - Simple alerts instead of toast notifications

### "If I Had More Time"

#### Features
- 🎨 **Dark mode support** - System theme detection and toggle
- 🔍 **Search & filtering** - Search products by name, filter by price/rating
- 📱 **Product details screen** - Full product view with images, reviews, specs
- 🛒 **Shopping cart** - Add to cart, manage quantities
- 📊 **Analytics** - Track user interactions, popular products
- 🔄 **Optimistic updates** - Immediate UI feedback before API response
- 📷 **Image caching** - Persist product images for true offline mode
- 🌐 **i18n support** - Multi-language support

#### Technical Improvements
- ⚡ **Code splitting** - Lazy load screens and components
- 🧪 **Unit & E2E tests** - Jest, Testing Library, Detox
- 📦 **CD/CI pipeline** - Automated builds and deployments
- 🔐 **Enhanced security** - Encrypted storage, certificate pinning
- 🎭 **Skeleton screens** - Loading placeholders instead of spinners
- 🔄 **Pull-to-refresh animations** - Smooth, branded animations
- 📈 **Performance monitoring** - React Native Performance, Sentry
- 🎯 **Accessibility** - Screen reader support, high contrast mode

#### Architecture
- 🏗️ **Feature-based structure** - Organize by feature instead of type
- 🔌 **Plugin system** - Modular feature additions
- 📚 **Storybook** - Component documentation and testing
- 🎨 **Design system** - Consistent UI components library

## 🐛 Known Limitations

1. **Biometric fallback** - Password fallback uses Keychain, not a custom PIN
2. **Delete persistence** - Deletes don't persist (DummyJSON limitation)
3. **Network detection** - May have slight delay on connection changes
4. **Auto-lock precision** - Timer resets on scroll, may extend beyond 10s with continuous interaction
5. **Image caching** - Product images require network (not cached offline)

## 📦 Dependencies Justification

### Core Dependencies
- `@react-navigation/*` - Industry standard for React Native navigation
- `@tanstack/react-query` - Best-in-class data fetching with caching
- `react-native-mmkv` - Fastest key-value storage for React Native
- `@reduxjs/toolkit` - Modern Redux with less boilerplate
- `react-redux` - React bindings for Redux

### Feature Dependencies
- `react-native-touch-id` - Simple biometric authentication (5.1k⭐)
- `react-native-keychain` - Secure credential storage (3.1k⭐)
- `@react-native-community/netinfo` - Official network detection
- `axios` - Popular HTTP client with interceptors
- `react-native-gesture-handler` - Better touch handling (6.2k⭐)

All dependencies are well-maintained, popular, and necessary for the requirements.

## 🎯 Acceptance Checklist

- ✅ Login authenticates via DummyJSON
- ✅ Token stored and applied to API requests
- ✅ Session restored on launch with biometric prompt
- ✅ Auto-lock after 10s inactivity
- ✅ Auto-lock when app backgrounds
- ✅ Lock overlay obscures all content
- ✅ Biometric unlock works
- ✅ Password fallback when biometrics unavailable
- ✅ All Products screen renders with pull-to-refresh
- ✅ Offline banner shows when disconnected
- ✅ Specific Category screen shows filtered list
- ✅ Superadmin can delete products (simulated)
- ✅ React Query cache persists to MMKV
- ✅ Cache rehydrates on cold start (instant lists)
- ✅ Cached data available offline

## 📝 License

This project is created for the GetPayIn coding challenge.

---

**Built with ❤️ using React Native**
