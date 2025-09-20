// src/main.tsx (Corrected and Verified)

import React from 'react';
import ReactDOM from 'react-dom/client';
import { createBrowserRouter, RouterProvider } from 'react-router-dom';

// Import the main layout component
import App from './App.tsx';

// Import the page components with the correct paths
import LoginPage from './pages/LoginPage.tsx';
import DashboardPage from './pages/DashboardPage.tsx'; // Corrected path

// Import the global stylesheet
import './styles.css';

// This is where we define all the routes for our application
const router = createBrowserRouter([
  {
    path: '/',
    element: <App />, // The App component provides the layout (Topbar, etc.)
    children: [
      // This is the default page that will render at the '/' path
      {
        index: true,
        element: <LoginPage />,
      },
      // This is the explicit login page route
      {
        path: 'login',
        element: <LoginPage />,
      },
      // This is the dashboard route for authenticated users
      {
        path: 'dashboard',
        element: <DashboardPage />,
      },
    ],
  },
]);

// This tells React to render our router into the HTML
ReactDOM.createRoot(document.getElementById('root')!).render(
  <React.StrictMode>
    <RouterProvider router={router} />
  </React.StrictMode>,
);