// frontend/src/context/AuthProvider.tsx

import { useState, ReactNode } from 'react';
// We import the Context definition and User type from our new, simplified file.
import { AuthContext, User } from './AuthContext';

/**
 * This component's only job is to provide the authentication state 
 * (user, login, logout) to all of its children components.
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