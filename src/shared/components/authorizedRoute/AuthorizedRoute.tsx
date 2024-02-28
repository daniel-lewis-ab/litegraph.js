import { Navigate } from 'react-router-dom';
import FullScreenLoader from '../fullScreenLoader/FullScreenLoader';
import { useAuth } from '@/hooks/useAuth/useAuth';

export const AuthorizedRoute = ({ children }: { children: React.ReactNode }) => {
  const { isAuthorizing, currentUser } = useAuth();

  if (isAuthorizing) {
    return <FullScreenLoader />;
  }

  if (!currentUser) {
    return <Navigate to="/login" replace />;
  }

  return children;
};
