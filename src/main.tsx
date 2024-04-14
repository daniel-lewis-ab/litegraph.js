import { ViteReactSSG } from 'vite-react-ssg';
import { appRoutes } from './app/router/router';
import './index.css';

export const createRoot = ViteReactSSG({ routes: appRoutes });
