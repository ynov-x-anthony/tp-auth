/**
 * Page d'accueil - publique (aucune authentification requise).
 */

import { Link } from 'react-router-dom';
import { useAuth } from '../auth/AuthContext';

export function HomePage() {
  const { status, user } = useAuth();

  return (
    <section className="mx-auto max-w-2xl p-8">
      <h1 className="text-2xl font-bold text-slate-900">Bienvenue 👋</h1>
      <p className="mt-3 text-slate-600">
        Cette page est <strong>publique</strong>. La page <code>/profile</code> est{' '}
        <strong>protégée</strong> : elle exige un cookie de session valide.
      </p>

      <div className="mt-6 rounded-lg bg-slate-100 p-4 text-sm text-slate-700">
        État courant :{' '}
        {status === 'loading' && <span>vérification en cours…</span>}
        {status === 'anonymous' && (
          <span>
            non connecté - <Link to="/login" className="underline">se connecter</Link>
          </span>
        )}
        {status === 'authenticated' && user && (
          <span>
            connecté en tant que <strong>{user.name}</strong> ({user.email}) -{' '}
            <Link to="/profile" className="underline">voir le profil</Link>
          </span>
        )}
      </div>
    </section>
  );
}
