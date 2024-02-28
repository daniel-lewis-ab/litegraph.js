import { ReactNode, createContext, useCallback, useEffect, useMemo, useState } from 'react';
import { onIdTokenChanged, User, signOut } from 'firebase/auth';
import { auth } from '@/firebase/auth';

type AuthContextType = {
  currentUser: User | null;
  isAuthorizing: boolean;
  logout: () => Promise<void>;
};

export const AuthContext = createContext<AuthContextType | undefined>(undefined);

type AuthContextProviderProps = {
  children: ReactNode;
};

export const AuthContextProvider = ({ children }: AuthContextProviderProps) => {
  const [currentUser, setCurrentUser] = useState<null | User>(null);
  const [isAuthorizing, setIsAuthorizing] = useState(true);

  useEffect(() => {
    const unsubscribe = onIdTokenChanged(auth, (user) => {
      if (user) {
        setCurrentUser(user);
      } else {
        setCurrentUser(null);
      }
      setIsAuthorizing(false);
    });

    return unsubscribe;
  }, []);

  const logout = useCallback(async () => {
    await signOut(auth);
  }, []);

  const value = useMemo(
    () => ({
      currentUser,
      isAuthorizing,
      logout,
    }),
    [currentUser, isAuthorizing, logout],
  );

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
};
