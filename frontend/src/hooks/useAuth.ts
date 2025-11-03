// frontend/src/hooks/useAuth.ts

import { useContext } from 'react';
// We import the Context definition from its new, single-purpose file.
import { AuthContext, AuthContextType } from '../context/AuthContext';

/**
 * This custom hook simplifies accessing the AuthContext.
 * It ensures the context is used within an AuthProvider.
 */
export const useAuth = (): AuthContextType => {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};