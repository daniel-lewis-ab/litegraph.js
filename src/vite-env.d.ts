/// <reference types: string;
/* eslint-disable @typescript-eslint/consistent-type-definitions */
interface ImportMetaEnv {
  readonly VITE_FIREBASE_API_KEY: string;
  VITE_FIREBASE_API_KEY: string;
  VITE_FIREBASE_AUTH_DOMAIN: string;
  VITE_API_URL: string;
  VITE_WEBSOCKET_URL: string;
  VITE_IFRAME_URL: string;
  VITE_IMAGE_SERVICE_URL: string;
  VITE_SHOW_IFRAME_LOGS: string;
  VITE_SHOW_WEBSOCKET_LOGS: string;
  VITE_COOKIE_DOMAIN: string;
  VITE_DATOCMS_API_TOKEN: string;
  VITE_DATOCMS_ENVIRONMENT: string;
  VITE_DD_APPLICATION_ID: string;
  VITE_DD_CLIENT_TOKEN: string;

  MODE: 'development' | 'production';
}

interface ImportMeta {
  readonly env: ImportMetaEnv;
}

// Globals
declare const __COMMIT_HASH__: string;
