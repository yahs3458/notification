import type { CapacitorConfig } from '@capacitor/cli';

const config: CapacitorConfig = {
  appId: 'notification.ionic.starter',
  appName: 'notification',
  webDir: 'www',
  server: {
    androidScheme: 'https',
    'cleartext': true
  },
  plugins: {
    CapacitorHttp: {
      enabled: true,
    },
    PushNotifications: {
      presentationOptions: ["badge", "sound", "alert"],
    },
  }
};

export default config;
