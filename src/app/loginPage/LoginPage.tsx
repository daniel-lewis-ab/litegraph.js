import { LogoFull } from '@/shared/components/icons/LogoFull';
import { Navigate, useNavigate } from 'react-router-dom';
import { useAuth } from '@/hooks/useAuth/useAuth';
import { toast } from 'react-hot-toast';
import { LoginResponse } from './LoginPageContainer';
import { CLEAR_TOKENS, SET_TOKENS } from '@/context/authContext/authReducer';

const GoogleIcon = ({ className }: { className?: string }) => (
  <svg className={className} width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
    <g clipPath="url(#clip0_4163_60226)">
      <path
        d="M23.2257 12.4827C23.2257 11.5404 23.1492 10.8527 22.9838 10.1396H12.2236V14.3927H18.5396C18.4123 15.4497 17.7247 17.0414 16.1966 18.111L16.1752 18.2534L19.5773 20.889L19.813 20.9125C21.9777 18.9133 23.2257 15.9717 23.2257 12.4827Z"
        fill="#4285F4"
      />
      <path
        d="M12.2239 23.689C15.3182 23.689 17.9159 22.6702 19.8133 20.913L16.1969 18.1115C15.2291 18.7864 13.9302 19.2575 12.2239 19.2575C9.19327 19.2575 6.62104 17.2584 5.70411 14.4951L5.56971 14.5065L2.0321 17.2443L1.98584 17.3729C3.87044 21.1167 7.74155 23.689 12.2239 23.689Z"
        fill="#34A853"
      />
      <path
        d="M5.70388 14.4943C5.46194 13.7812 5.32192 13.0171 5.32192 12.2276C5.32192 11.4381 5.46194 10.6741 5.69115 9.96099L5.68474 9.80911L2.1028 7.02734L1.98561 7.08309C1.20887 8.63664 0.763184 10.3812 0.763184 12.2276C0.763184 14.074 1.20887 15.8185 1.98561 17.3721L5.70388 14.4943Z"
        fill="#FBBC05"
      />
      <path
        d="M12.2239 5.19894C14.3759 5.19894 15.8275 6.12851 16.6553 6.90533L19.8897 3.74731C17.9032 1.9009 15.3182 0.767578 12.2239 0.767578C7.74155 0.767578 3.87044 3.3398 1.98584 7.08354L5.69139 9.96143C6.62104 7.19818 9.19327 5.19894 12.2239 5.19894Z"
        fill="#EB4335"
      />
    </g>
    <defs>
      <clipPath id="clip0_4163_60226">
        <rect width="23" height="23" fill="white" transform="translate(0.5 0.767578)" />
      </clipPath>
    </defs>
  </svg>
);

type LoginPageProps = {
  onSubmit(): Promise<LoginResponse | undefined>;
};

export const LoginPage = ({ onSubmit }: LoginPageProps) => {
  const {
    state: { isAuthorized },
    dispatch,
  } = useAuth();
  const navigate = useNavigate();

  if (isAuthorized) {
    return <Navigate to="/" replace />;
  }

  const handleGoogleLogin = async () => {
    try {
      const tokens = await onSubmit();

      dispatch({ type: SET_TOKENS, accessToken: tokens?.accessToken, refreshToken: tokens?.refreshToken });
      navigate('/');
    } catch (error) {
      console.log('1');
      console.error(error);
      toast.error('Failed to sign in');
      dispatch({ type: CLEAR_TOKENS });
    }
  };

  return (
    <main className="flex h-screen w-full flex-row">
      <div className="flex flex-1">
        <div className="flex flex-1 flex-col items-start justify-center md:px-9 lg:px-24">
          <LogoFull className="mb-14" />
          <h1 className="mb-14 text-5xl font-bold">Sign in salt with</h1>
          <button
            className="bg-foreground flex w-full max-w-md flex-row justify-center rounded-lg py-3"
            onClick={handleGoogleLogin}
          >
            <GoogleIcon />
            <p className="text-black ml-5 font-semibold">Sign in with Google</p>
          </button>
        </div>
      </div>
      <div className="relative flex-1">
        <div className="absolute inset-0 h-full w-full bg-[radial-gradient(#6161C4,transparent_1px)] [background-size:26px_26px]"></div>
      </div>
    </main>
  );
};
