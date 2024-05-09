import { ViteReactSSG } from 'vite-react-ssg';
import { appRoutes } from './app/router/router';
import './index.css';

import { datadogRum } from '@datadog/browser-rum';

if (import.meta.env.MODE === 'production') {
  datadogRum.init({
    applicationId: import.meta.env.VITE_DD_APPLICATION_ID,
    clientToken: import.meta.env.VITE_DD_CLIENT_TOKEN,
    site: 'us5.datadoghq.com',
    service: 'getsalt.ai',
    env: 'prod',
    sessionSampleRate: 100,
    sessionReplaySampleRate: 20,
    trackUserInteractions: true,
    trackResources: true,
    trackLongTasks: true,
    defaultPrivacyLevel: 'mask-user-input',
    version: __COMMIT_HASH__,
  });
}

export const createRoot = ViteReactSSG({ routes: appRoutes });
