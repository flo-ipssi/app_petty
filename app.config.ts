// import 'ts-node/register'; // Add this to import TypeScript files
import { ExpoConfig } from 'expo/config';

const config: ExpoConfig = {
  name: 'petty',
  slug: 'petty',
  extra: {
    eas: {
      "projectId": "c5d6cdbd-1bdf-433b-8aee-6f01061ccf5a"
    }
  }
};

export default config;
