import { useAuth } from '@/hooks/useAuth/useAuth';
import { routes } from '@/routes/routes';
import { Navigate, useLocation } from 'react-router-dom';
import { Head } from 'vite-react-ssg';
import { CenteredLoader } from '../centeredLoader/CenteredLoader';

export const AuthorizedRoute = ({ children }: { children: React.ReactNode }) => {
  const {
    state: { isAuthorized, isAuthorizing },
  } = useAuth();
  const { pathname } = useLocation();

  if (isAuthorizing) {
    return (
      <>
        <Head>
          <meta name="robots" content="noindex, nofollow" />
        </Head>
        <CenteredLoader isFullscreen />
      </>
    );
  }

  if (!isAuthorized) {
    return (
      <>
        <Head>
          <meta name="robots" content="noindex, nofollow" />
        </Head>
        <Navigate to={routes.login} state={{ from: pathname }} replace />
      </>
    );
  }

  return children;
};
