import { Navigate } from 'react-router-dom';
import CenteredLoader from '../centeredLoader/CenteredLoader';
import { useAuth } from '@/hooks/useAuth/useAuth';

export const AuthorizedRoute = ({ children }: { children: React.ReactNode }) => {
  const {
    state: { isAuthorized, isAuthorizing },
  } = useAuth();

  if (isAuthorizing) {
    return <CenteredLoader isFullscreen />;
  }

  if (!isAuthorized) {
    return <Navigate to="/login" replace />;
  }

  return children;
};
