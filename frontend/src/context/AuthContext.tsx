// frontend/src/context/AuthContext.tsx

import { createContext } from 'react';

type User = {
  id: number;
  username: string;
};

export type AuthContextType = {
  user: User | null;
  login: (userData: User) => void;
  logout: () => void;
};

/**
 * Creates the actual React Context. This file ONLY defines the context's shape.
 * The implementation is in AuthProvider.tsx.
 */
export const AuthContext = createContext<AuthContextType | undefined>(undefined);