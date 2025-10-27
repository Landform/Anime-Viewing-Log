// frontend/src/hooks/useAuth.ts

import { useContext } from 'react';
// We import the context itself from its original location.
import { AuthContext } from '../context/AuthProvider.tsx';

/**
 * This is a custom hook that simplifies accessing the AuthContext.
 * Instead of importing 'useContext' and 'AuthContext' in every component,
 * we can just import and use this 'useAuth' hook.
 */
export const useAuth = () => {
  const context = useContext(AuthContext);
  // This check ensures that we never try to use the context outside of the AuthProvider.
  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};