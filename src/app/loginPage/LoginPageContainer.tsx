import { signInWithPopup } from 'firebase/auth';
import { auth, googleAuthProvider } from '@/firebase/auth';
import { LoginPage } from './LoginPage';
import { axiosClient } from '@/api/axiosClient';
import { apiEndpoints } from '@/api/apiEndpoints';

export type LoginResponse = {
  accessToken: string;
  refreshToken: string;
};

export const LoginPageContainer = () => {
  // @TODO: Remove when google back working
  const mockGoogle = true;
  const handleLogin = async () => {
    try {
      let idToken = 'mocked token';
      if (!mockGoogle) {
        const result = await signInWithPopup(auth, googleAuthProvider);
        idToken = await result.user.getIdToken();
      }

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
      throw error;
    }
  };

  return <LoginPage onSubmit={handleLogin} />;
};
