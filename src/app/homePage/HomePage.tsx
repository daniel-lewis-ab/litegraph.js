import { routes } from '@/routes/routes';
import { Navigate } from 'react-router-dom';

// Scott - here is home page
export const HomePage = () => <Navigate to={routes.workflows} />;
