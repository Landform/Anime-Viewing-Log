// frontend/src/context/AuthContext.tsx

import { createContext } from 'react';

// Define the "shape" of the User object
export type User = {
  id: number;
  username: string;
};

// Define the "shape" of the context's value
export type AuthContextType = {
  user: User | null;
  login: (userData: User) => void;
  logout: () => void;
};

/**
 * Creates the React Context. This file ONLY defines the context's shape.
 * - The provider component is in AuthProvider.tsx.
 * - The consumer hook is in hooks/useAuth.ts.
 */
export const AuthContext = createContext<AuthContextType | undefined>(undefined);