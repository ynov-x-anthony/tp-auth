/**
 * Barre de navigation. Affiche des liens différents selon l'état d'authentification.
 */

import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../auth/AuthContext';

export function Navbar() {
  const { user, status, logout } = useAuth();
  const navigate = useNavigate();

  async function handleLogout() {
    await logout();
    navigate('/login');
  }

  return (
    <nav className="flex items-center gap-4 border-b border-slate-200 bg-white px-6 py-3">
      <Link to="/" className="font-semibold text-slate-800">
        TP&nbsp;Auth
      </Link>
      <Link to="/" className="text-sm text-slate-600 hover:text-slate-900">
        Accueil
      </Link>
      {status !== 'anonymous' &&
      <Link to="/profile" className="text-sm text-slate-600 hover:text-slate-900">
        Profil
      </Link>}

      <div className="ml-auto flex items-center gap-3 text-sm">
        {status === 'authenticated' && user ? (
          <>
            <span className="text-slate-500">
              Connecté : <strong className="text-slate-800">{user.email}</strong>
            </span>
            <button
              onClick={handleLogout}
              className="rounded-md bg-slate-800 px-3 py-1.5 text-white hover:bg-slate-700"
            >
              Se déconnecter
            </button>
          </>
        ) : status === 'anonymous' ? (
          <Link
            to="/login"
            className="rounded-md bg-slate-800 px-3 py-1.5 text-white hover:bg-slate-700"
          >
            Se connecter
          </Link>
        ) : (
          <span className="text-slate-400">…</span>
        )}
      </div>
    </nav>
  );
}
