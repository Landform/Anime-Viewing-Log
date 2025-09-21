import { createContext, useState, useContext, ReactNode } from 'react';

/**
 * Defines the "shape" of our User object for type safety with TypeScript.
 * This matches the user data we send back from our Django login view.
 */
type User = {
  id: number;
  username: string;
};

/**
 * Defines the "shape" of the value that our AuthContext will provide.
 * It includes the user object (or null) and the login/logout functions.
 */
type AuthContextType = {
  user: User | null;
  login: (userData: User) => void;
  logout: () => void;
};

/**
 * Creates the actual React Context. We initialize it as 'undefined'
 * and will provide a real value in the AuthProvider component.
 */
const AuthContext = createContext<AuthContextType | undefined>(undefined);

/**
 * This is a React component that will wrap our entire application.
 * Its job is to hold the authentication state and provide it to all
 * of its children components.
 * @param {ReactNode} children - The child components to be rendered (our entire app).
 */
export const AuthProvider = ({ children }: { children: ReactNode }) => {
  // This is the actual state variable that holds the user object or null.
  const [user, setUser] = useState<User | null>(null);

  // This function will be called from the LoginPage to set the user in the global state.
  const login = (userData: User) => {
    setUser(userData);
  };

  // This function will be called from the Topbar to clear the user from the global state.
  const logout = () => {
    setUser(null);
  };

  // We package our state and functions into a single 'value' object.
  const value = { user, login, logout };

  // The Provider component makes the 'value' object available to any
  // child component that asks for it.
  return (
    <AuthContext.Provider value={value}>
      {children}
    </AuthContext.Provider>
  );
};

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