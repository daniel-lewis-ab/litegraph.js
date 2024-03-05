import { LoginPage } from './LoginPage';
import { axiosClient } from '@/api/axiosClient';
import { apiEndpoints } from '@/api/apiEndpoints';
import { signInWithPopup } from 'firebase/auth';
import { auth, googleAuthProvider } from '@/firebase/auth';

export type LoginResponse = {
  accessToken: string;
  refreshToken: string;
};

export const LoginPageContainer = () => {
  const handleLogin = async () => {
    try {
      const result = await signInWithPopup(auth, googleAuthProvider);
      const idToken = result.user.getIdToken();
      if (!idToken) {
        throw new Error('No idToken');
      }

      const response = await axiosClient.post<LoginResponse>(apiEndpoints.login, {
        idToken: idToken,
      });

      // @TODO: Save opt-in info
      if (!response.data.accessToken) {
        throw new Error('No accessToken');
      }

      return response.data;
    } catch (error) {
      console.error(error);
    }
  };

  return <LoginPage onSubmit={handleLogin} />;
};
