import { CapacitorConfig } from '@capacitor/cli';

const config: CapacitorConfig = {
  appId: 'ir.mofidshim.app',
  appName: 'mofidshim',
  webDir: 'out',
  server: {
    androidScheme: 'http',
    cleartext: true,
    allowNavigation: ["http://mofidshim.ir:3001/*"]
  },
};

export default config;
