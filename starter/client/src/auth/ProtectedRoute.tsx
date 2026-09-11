/**
 * ProtectedRoute : une "garde" de route.
 *
 * Utilisée comme route parente dans router.tsx (React Router v7, data mode) :
 *   { element: <ProtectedRoute />, children: [{ path: '/profile', element: <ProfilePage /> }] }
 *
 * Tout ce qui est à l'intérieur ne s'affiche QUE si l'utilisateur est authentifié.
 */

import { Navigate, Outlet } from 'react-router-dom';
import { useAuth } from './AuthContext';

export function ProtectedRoute() {
  const { status } = useAuth();

  if (status === 'loading') {
    return <p className="p-8 text-center">Chargement…</p>;
  }

  if (status === 'anonymous') {
    return <Navigate to="/login" replace />;
  }

  return <Outlet />;
}
