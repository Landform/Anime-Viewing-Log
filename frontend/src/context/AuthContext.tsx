// frontend/src/context/AuthContext.tsx

import { createContext, useState, ReactNode } from 'react';
import { useAuth } from '../context/AuthContext';


type User = {
  id: number;
  username: string;
};

type AuthContextType = {
  user: User | null;
  login: (userData: User) => void;
  logout: () => void;
};

/**
 * Creates the actual React Context. We export it here so our custom hook
 * in a different file can access it.
 */
export const AuthContext = createContext<AuthContextType | undefined>(undefined);

/**
 * This is a React component that will wrap our entire application.
 * Its job is to hold the authentication state and provide it to all
 * of its children components.
 */
export const AuthProvider = ({ children }: { children: ReactNode }) => {
  const [user, setUser] = useState<User | null>(null);

  const login = (userData: User) => {
    setUser(userData);
  };

  const logout = () => {
    setUser(null);
  };

  const value = { user, login, logout };

  return (
    <AuthContext.Provider value={value}>
      {children}
    </AuthContext.Provider>
  );
};

// The useAuth hook has been moved to frontend/src/hooks/useAuth.ts