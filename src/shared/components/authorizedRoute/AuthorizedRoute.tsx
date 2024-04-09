import { Navigate } from 'react-router-dom';
import { CenteredLoader } from '../centeredLoader/CenteredLoader';
import { useAuth } from '@/hooks/useAuth/useAuth';
import { routes } from '@/routes/routes';
import { Head } from 'vite-react-ssg';

export const AuthorizedRoute = ({ children }: { children: React.ReactNode }) => {
  const {
    state: { isAuthorized, isAuthorizing },
  } = useAuth();

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
        <Navigate to={routes.login} replace />
      </>
    );
  }

  return children;
};
