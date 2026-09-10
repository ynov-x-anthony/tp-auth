/**
 * Configuration des routes - React Router v7 en "data mode" (`createBrowserRouter`).
 *
 * On décrit l'arbre des routes comme un TABLEAU d'objets, au lieu du JSX
 * `<Routes><Route/></Routes>` (le "declarative mode", présenté par React Router
 * comme du code legacy d'avant la v7).
 *
 *   { element: <App /> }                 → layout commun (Navbar + <Outlet />)
 *     ├─ { path: '/',       element: <HomePage /> }     publique
 *     ├─ { path: '/login',  element: <LoginPage /> }    publique
 *     ├─ { element: <ProtectedRoute /> }                garde d'auth
 *     │    └─ { path: '/profile', element: <ProfilePage /> }   protégée
 *     └─ { path: '*', element: <Navigate to="/" replace /> }   catch-all
 *
 * Chaque route parente rend ses enfants à l'emplacement de son <Outlet />.
 */

import { createBrowserRouter, Navigate } from 'react-router-dom';
import App from './App';
import { ProtectedRoute } from './auth/ProtectedRoute';
import { HomePage } from './pages/HomePage';
import { LoginPage } from './pages/LoginPage';
import { ProfilePage } from './pages/ProfilePage';

export const router = createBrowserRouter([
  {
    element: <App />,
    children: [
      { path: '/', element: <HomePage /> },
      { path: '/login', element: <LoginPage /> },

      // Tout ce qui est sous cette route parente exige d'être authentifié.
      {
        element: <ProtectedRoute />,
        children: [{ path: '/profile', element: <ProfilePage /> }],
      },

      { path: '*', element: <Navigate to="/" replace /> },
    ],
  },
]);
