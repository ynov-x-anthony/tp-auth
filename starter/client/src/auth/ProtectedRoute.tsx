/**
 * ProtectedRoute : une "garde" de route.
 *
 * Utilisée comme route parente dans router.tsx (React Router v7, data mode) :
 *   { element: <ProtectedRoute />, children: [{ path: '/profile', element: <ProfilePage /> }] }
 *
 * Tout ce qui est à l'intérieur ne s'affiche QUE si l'utilisateur est authentifié.
 *
 * ⚠️ Version actuelle : elle laisse TOUJOURS passer (elle ne protège rien).
 *    Ouvre /profile sans être connecté pour le constater, puis corrige (TODO 2).
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

  // ┌────────────────────────────── TODO 2 ────────────────────────────────┐
  // │ Gère les 3 valeurs possibles de `status` :                             │
  // │                                                                       │
  // │   • 'loading'       → on ne sait pas encore (le /auth/me est en cours).│
  // │                       return <p className="p-8 text-center">Chargement…</p>;
  // │                                                                       │
  // │   • 'anonymous'     → pas connecté → renvoyer vers la page de login :  │
  // │                       return <Navigate to="/login" replace />;         │
  // │                                                                       │
  // │   • 'authenticated' → OK → afficher la route enfant :                  │
  // │                       return <Outlet />;                               │
  // └───────────────────────────────────────────────────────────────────────┘

  console.log('[ProtectedRoute] status =', status); // repère utile - à retirer une fois corrigé
  return <Outlet />;
}
