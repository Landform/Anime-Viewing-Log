import React from 'react';
import ReactDOM from 'react-dom/client';
import { createBrowserRouter, RouterProvider } from 'react-router-dom';
import axios from 'axios';

// --- Global Axios Configuration ---

// Get the base URL from Vite's environment variables.
// In development, this will be '/api' (for the proxy).
// In production, this will be 'https://backend-smdp.onrender.com'.
const API_BASE_URL = import.meta.env.VITE_API_BASE_URL;

// Set the base URL for all Axios requests
axios.defaults.baseURL = API_BASE_URL;

// Keep your existing defaults for CSRF and session handling
axios.defaults.withCredentials = true;
axios.defaults.xsrfHeaderName = "X-CSRFTOKEN";
axios.defaults.xsrfCookieName = "csrftoken";


// --- Context Providers ---
import { AuthProvider } from './context/AuthProvider.tsx';

// --- Component Imports ---
import App from './App.tsx';
import LoginPage from './pages/LoginPage.tsx';
import RegistrationPage from './pages/RegistrationPage.tsx';
import DashboardPage from './pages/DashboardPage.tsx';
import SearchPage from './pages/SearchPage.tsx';
import AnimeDetailPage from './pages/AnimeDetailPage.tsx';
import ViewingHistoryPage from './pages/ViewingHistoryPage.tsx';
import UserProfilePage from './pages/UserProfilePage.tsx';
import ExplorePage from './pages/ExplorePage.tsx'; // Import the new page

// --- Stylesheet Import ---
import './styles.css';

// --- Router Definition ---
const router = createBrowserRouter([
  {
    path: '/',
    element: <App />,
    children: [
      { index: true, element: <LoginPage /> },
      { path: 'login', element: <LoginPage /> },
      { path: 'register', element: <RegistrationPage /> },
      { path: 'dashboard', element: <DashboardPage /> },
      { path: 'search', element: <SearchPage /> },
      { path: 'anime/:id', element: <AnimeDetailPage /> },
      { path: 'history', element: <ViewingHistoryPage /> },
      { path: 'profile', element: <UserProfilePage /> },
      { path: 'explore', element: <ExplorePage /> }, // Add the new route
    ],
  },
]);

// --- Application Rendering ---
ReactDOM.createRoot(document.getElementById('root')!).render(
  <React.StrictMode>
    <AuthProvider>
      <RouterProvider router={router} />
    </AuthProvider>
  </React.StrictMode>,
);