import { Navigate } from 'react-router-dom';
import CenteredLoader from '../centeredLoader/CenteredLoader';
import { useAuth } from '@/hooks/useAuth/useAuth';
import { routes } from '@/routes/routes';

export const AuthorizedRoute = ({ children }: { children: React.ReactNode }) => {
  const {
    state: { isAuthorized, isAuthorizing },
  } = useAuth();

  if (isAuthorizing) {
    return <CenteredLoader isFullscreen />;
  }

  if (!isAuthorized) {
    return <Navigate to={routes.login} replace />;
  }

  return children;
};
