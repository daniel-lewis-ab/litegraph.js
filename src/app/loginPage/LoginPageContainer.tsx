import { signInWithPopup } from 'firebase/auth';
import { auth, githubAuthProvider, googleAuthProvider } from '@/firebase/auth';
import { LoginPage } from './LoginPage';
import { axiosClient } from '@/api/axiosClient';
import { apiEndpoints } from '@/api/apiEndpoints';

export type LoginResponse = {
  access: string;
  refresh: string;
};

export const LoginPageContainer = () => {
  const handleLogin = async (source: 'google' | 'github') => {
    try {
      const result = await signInWithPopup(auth, source === 'github' ? githubAuthProvider : googleAuthProvider);
      const idToken = await result.user.getIdToken();

      if (!idToken) {
        throw new Error('No idToken');
      }

      const response = await axiosClient.post<LoginResponse>(apiEndpoints.login, {
        token: idToken,
      });

      if (!response.data.access) {
        throw new Error('No accessToken');
      }

      return response.data;
    } catch (error) {
      console.error(error);
      throw error;
    }
  };

  return <LoginPage onLogin={handleLogin} />;
};
