import React from 'react';
import ReactDOM from 'react-dom/client';
import { createBrowserRouter, RouterProvider } from 'react-router-dom';
import App from './App';
import LoginPage from './pages/login/page';
import SignupPage from './pages/signup/page';
import DashboardPage from './pages/dashboard/page';
import NewBlogPage from './pages/newblog/page';
import SettingsPage from './pages/settings/page';
import DemoBlogPage from './pages/demo/page';
import ExplorePage from './pages/explore/page';
import './styles/main.css';

const router = createBrowserRouter([
  {
    path: '/',
    element: <App />,
  },
  {
    path: '/login',
    element: <LoginPage />,
  },
  {
    path: '/signup',
    element: <SignupPage />,
  },
  {
    path: '/dashboard',
    element: <DashboardPage />,
  },
  {
    path: '/newblog',
    element: <NewBlogPage />,
  },
  {
    path: '/settings',
    element: <SettingsPage />,
  },
  {
    path: '/explore',
    element: <ExplorePage />,
  },
  {
    path: '/demo/:id',
    element: <DemoBlogPage />,
  },
]);

ReactDOM.createRoot(document.getElementById('root')!).render(
  <React.StrictMode>
    <RouterProvider router={router} />
  </React.StrictMode>
);
