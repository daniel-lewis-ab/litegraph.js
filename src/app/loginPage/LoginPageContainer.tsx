import { signInWithPopup } from 'firebase/auth';
import { auth, googleAuthProvider } from '@/firebase/auth';
import { LoginPage } from './LoginPage';

export const LoginPageContainer = () => {
  const handleLogin = async () => {
    const result = await signInWithPopup(auth, googleAuthProvider);
    const idToken = result.user.getIdToken();
    console.log(idToken);
  };

  return <LoginPage onSubmit={handleLogin} />;
};
