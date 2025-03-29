import { createContext, type Dispatch, type ReactNode, type SetStateAction, useEffect, useState } from 'react';
import { projectConstants } from '@/utils/constants';
import type { User } from '@/types/user';

interface AuthContextProps {
  isLogged: boolean | null;
  setIsLogged: Dispatch<SetStateAction<boolean>>;
  user: User | null;
  setUser: Dispatch<SetStateAction<User | null>>;
}

export const AuthContext = createContext<AuthContextProps | undefined>(
  undefined,
);

export const AuthProvider = ({ children }: { children: ReactNode }) => {
  const [user, setUser] = useState<User | null>(null);
  const [isLogged, setIsLogged] = useState<boolean>(() => {
    return !!localStorage.getItem(projectConstants.accessToken);
  });


  useEffect(() => {
    const token = localStorage.getItem(projectConstants.accessToken);
    if (token) {
      setIsLogged(true);
    }
  }, []);

  return (
    <AuthContext.Provider
      value={{
        user,
        isLogged,
        setUser,
        setIsLogged,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
};

export default AuthProvider;
