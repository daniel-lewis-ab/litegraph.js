import { useAuth } from '@/hooks/useAuth/useAuth';
import { FirebaseError } from '@firebase/util';
import { toast } from 'react-hot-toast';
import { NavLink, Navigate, useLocation } from 'react-router-dom';

import { PostLoginResponse } from '@/api/types';
import { CLEAR_TOKENS, SET_TOKENS } from '@/context/authContext/authReducer';
import { routes } from '@/routes/routes';
import { Button } from '@/shared/components/button/Button';
import { GitHubIcon } from '@/shared/components/icons/GithubIcon';
import { GoogleIcon } from '@/shared/components/icons/GoogleIcon';
import { LogoFull } from '@/shared/components/icons/LogoFull';
import { PublicLayout } from '@/shared/components/publicLayout/PublicLayout';
import { links } from '@/shared/components/publicLayout/components/PublicLinks';
import img from './promo.jpg';

type LoginPageProps = {
  onLogin(source: 'github' | 'google'): Promise<PostLoginResponse | undefined>;
};

export const LoginPage = ({ onLogin }: LoginPageProps) => {
  const {
    state: { isAuthorized },
    dispatch,
  } = useAuth();
  const location = useLocation();

  if (isAuthorized) {
    const redirectPath = location.state?.from || routes.workflows;
    return <Navigate to={redirectPath} />;
  }

  const handleLogin = async (source: 'github' | 'google') => {
    try {
      const tokens = await onLogin(source);

      dispatch({ type: SET_TOKENS, accessToken: tokens?.access, refreshToken: tokens?.refresh });
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
    <>
      <header className="fixed left-0 top-0 z-[100] w-full">
        <PublicLayout.Container className="mx-auto py-6">
          <nav
            className="rounded-xl font-medium sm:flex sm:items-center sm:justify-between lg:translate-x-[-7.5px] lg:translate-y-[-2px]"
            aria-label="Global"
          >
            <NavLink className="flex-none dark:text-white md:min-w-[200px]" to={routes.home} title="Salt AI">
              <LogoFull className="w-12 md:w-16" />
            </NavLink>
          </nav>
        </PublicLayout.Container>
      </header>
      <main className="flex h-screen w-full flex-row">
        <div className="light flex flex-1 bg-surface-2">
          <div className="flex flex-1 flex-col items-start justify-center p-6 md:px-9 lg:px-[20%]">
            <div className="mx-auto flex w-full flex-col justify-center space-y-4 text-center">
              <h1 className="text-3xl font-medium xl:text-4xl">Login or sign up</h1>
              <p className="text-base text-text-subtle">Start building and sharing your workflows with the world.</p>

              <Button size="lg" color="secondary" variant="glass" onClick={() => handleLogin('google')}>
                <div className="flex space-x-3">
                  <GoogleIcon />
                  <span>Continue with Google</span>
                </div>
              </Button>
              <Button size="lg" color="secondary" variant="glass" onClick={() => handleLogin('github')}>
                <div className="flex space-x-3">
                  <GitHubIcon />
                  <span>Continue with Github</span>
                </div>
              </Button>
              <p className="text-sm leading-[150%] text-text-subtle">
                By creating an account, you agree to the{' '}
                <a href={links.legal.terms.href} className="underline">
                  Terms of Service
                </a>{' '}
                and acknowledge that you have read and understood our{' '}
                <a href={links.legal.privacy.href} className="underline">
                  Privacy Policy
                </a>
                .
              </p>
            </div>
          </div>
        </div>
        <div className="relative hidden flex-1 md:block">
          {/* <div className="absolute inset-0 h-full w-full bg-[radial-gradient(#6161C4,transparent_1px)] [background-size:26px_26px]"></div> */}
          <img src={img} className="h-full w-full object-contain" />
        </div>
      </main>
    </>
  );
};
