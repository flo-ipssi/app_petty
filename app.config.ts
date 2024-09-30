import { ExpoConfig } from 'expo/config';

const config: ExpoConfig = {
  name: 'petty',
  slug: 'petty',
  version: '1.0.0',
  orientation: 'portrait',
  icon: './assets/images/icon.png',
  scheme: 'petty',
  userInterfaceStyle: 'automatic',
  splash: {
    image: './assets/images/splash.png',
    resizeMode: 'contain',
    backgroundColor: '#ffffff',
  },
  assetBundlePatterns: ['**/*'],
  ios: {
    supportsTablet: true,
  },
  android: {

    adaptiveIcon: {
      // foregroundImage: './assets/images/adaptive-icon.png',
      foregroundImage: './assets/logos/label-icon.png',
      backgroundColor: '#ffffff',
    },
    permissions: ['INTERNET'],
    package: "com.floipssi.petty"
  },
  web: {
    bundler: 'metro',
    output: 'static',
    favicon: './assets/images/favicon.png',
  },
  plugins: ['expo-router'],
  experiments: {
    typedRoutes: true,
  },
  extra: {
    eas: {
      projectId: 'c5d6cdbd-1bdf-433b-8aee-6f01061ccf5a',
    },
  },
};

export default config;
