// frontend/src/context/AuthProvider.tsx

import { useState, ReactNode } from 'react';
import { AuthContext } from './AuthContext'; // Import the context definition

type User = {
  id: number;
  username: string;
};

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