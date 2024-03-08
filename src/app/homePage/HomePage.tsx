import { routes } from '@/routes/routes';
import { Navigate } from 'react-router-dom';

export const HomePage = () => <Navigate to={routes.workflows} />;
