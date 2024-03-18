import { LogoFull } from '@/shared/components/icons/LogoFull';
import { Navigate, useNavigate } from 'react-router-dom';
import { useAuth } from '@/hooks/useAuth/useAuth';
import { FirebaseError } from '@firebase/util';
import { toast } from 'react-hot-toast';

import { CLEAR_TOKENS, SET_TOKENS } from '@/context/authContext/authReducer';
import { GoogleIcon } from '@/shared/components/icons/GoogleIcon';
import { GitHubIcon } from '@/shared/components/icons/GithubIcon';
import { PostLoginResponse } from '@/api/types';
import { routes } from '@/routes/routes';

type LoginPageProps = {
  onLogin(source: 'github' | 'google'): Promise<PostLoginResponse | undefined>;
};

export const LoginPage = ({ onLogin }: LoginPageProps) => {
  const {
    state: { isAuthorized },
    dispatch,
  } = useAuth();
  const navigate = useNavigate();

  if (isAuthorized) {
    return <Navigate to={routes.workflows} replace />;
  }

  const handleLogin = async (source: 'github' | 'google') => {
    try {
      const tokens = await onLogin(source);

      dispatch({ type: SET_TOKENS, accessToken: tokens?.access, refreshToken: tokens?.refresh });
      navigate(routes.home);
    } catch (error) {
      if (error instanceof FirebaseError) {
        if (error.code === 'auth/account-exists-with-different-credential') {
          toast.error('Account exists with a different sign-in method');
        } else {
          toast.error('Failed to sign in');
        }
      } else {
        toast.error('Failed to sign in');
      }
      dispatch({ type: CLEAR_TOKENS });
    }
  };

  return (
    <main className="flex h-screen w-full flex-row">
      <div className="flex flex-1">
        <div className="flex flex-1 flex-col items-start justify-center p-6 md:px-9 lg:px-24">
          <LogoFull className="mb-14" />
          <h1 className="mb-14 text-5xl font-bold">Login or sign up</h1>
          <button
            className="flex w-full max-w-md flex-row justify-center rounded-lg bg-surface-12 py-3 transition-all hover:opacity-95 active:opacity-90"
            onClick={() => handleLogin('google')}
          >
            <GoogleIcon />
            <p className="ml-5 font-semibold text-black">Sign in with Google</p>
          </button>
          <button
            className="mt-3 flex w-full max-w-md flex-row justify-center rounded-lg bg-surface-12 py-3 transition-all hover:opacity-95 active:opacity-90"
            onClick={() => handleLogin('github')}
          >
            <GitHubIcon />
            <p className="ml-5 font-semibold text-black">Sign in with Github</p>
          </button>
        </div>
      </div>
      <div className="relative hidden flex-1 md:block">
        <div className="absolute inset-0 h-full w-full bg-[radial-gradient(#6161C4,transparent_1px)] [background-size:26px_26px]"></div>
      </div>
    </main>
  );
};
