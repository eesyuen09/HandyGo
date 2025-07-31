import "dotenv/config";

export default {
  expo: {
    name: "HandyGo",
    slug: "handygo",
    version: "1.0.0",
    orientation: "portrait",
    icon: "./assets/handygo-logo.png",
    userInterfaceStyle: "light",
    newArchEnabled: true,
    splash: {
      image: "./assets/handygo-logo.png",
      resizeMode: "contain",
      backgroundColor: "#ffffff",
    },
    assetBundlePatterns: ["**/*"],
    fonts: {
      "Sora-Regular": "./assets/fonts/Sora-VariableFont_wght.ttf",
      "Inter-Regular": "./assets/fonts/Inter-Regular.ttf",
    },
    ios: {
      supportsTablet: true,
      bundleIdentifier: "com.eesyuen.HandyGo",
      infoPlist: {
        ITSAppUsesNonExemptEncryption: false,
      },
    },
    android: {
      adaptiveIcon: {
        foregroundImage: "./assets/handygo-logo.png",
        backgroundColor: "#ffffff",
      },
      edgeToEdgeEnabled: true,
      package: "com.eesyuen.HandyGo",
    },
    web: {
      favicon: "./assets/handygo-logo.png",
    },
    plugins: ["expo-web-browser", "expo-font"],
    extra: {
      eas: {
        projectId: "9ea46c82-7e55-4bed-a197-d422c4f36f6b",
      },
    },
    updates: {
      url: "https://u.expo.dev/ef2c6889-53df-4a86-bd2b-be15db7bd7c9",
    },
    runtimeVersion: {
      policy: "appVersion",
    },
    extra: {
      eas: {
        projectId: "ef2c6889-53df-4a86-bd2b-be15db7bd7c9",
      },
      updates: {
        url: "https://u.expo.dev/ef2c6889-53df-4a86-bd2b-be15db7bd7c9",
      },
      runtimeVersion: {
        policy: "appVersion",
      },
      firebaseApiKey: process.env.FIREBASE_API_KEY,
      firebaseAuthDomain: process.env.FIREBASE_AUTH_DOMAIN,
      firebaseProjectId: process.env.FIREBASE_PROJECT_ID,
      firebaseStorageBucket: process.env.FIREBASE_STORAGE_BUCKET,
      firebaseMessagingSenderId: process.env.FIREBASE_MESSAGING_SENDER_ID,
      firebaseAppId: process.env.FIREBASE_APP_ID,
      firebaseMeasurementId: process.env.FIREBASE_MEASUREMENT_ID,
      pricingApiUrl: process.env.PRICING_API_URL,
    },
  },
};
