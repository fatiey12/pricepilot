import type { CapacitorConfig } from '@capacitor/cli';

const config: CapacitorConfig = {
  appId: 'com.pricepilot.app',
  appName: 'PricePilot',
  webDir: 'dist',

  server: {
    androidScheme: 'http'
  }
};

export default config;