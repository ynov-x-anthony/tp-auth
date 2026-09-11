/**
 * Page de connexion : formulaire contrôlé (useState) → appelle `login()` du contexte.
 *
 * Le formulaire (JSX) est déjà écrit. Il te reste à remplir `handleSubmit` (TODO 3).
 */

import { useState, type FormEvent } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../auth/AuthContext';
import { ApiError } from '../api/client';

export function LoginPage() {
  const { login } = useAuth();
  const navigate = useNavigate();

  const [email, setEmail] = useState('alice@ynov.com');
  const [password, setPassword] = useState('password123');
  const [error, setError] = useState<string | null>(null);
  const [submitting, setSubmitting] = useState(false);

  async function handleSubmit(e: FormEvent) {
    e.preventDefault();

    // ┌──────────────────────────────── TODO 3 ────────────────────────────────┐
    // │ 1. setError(null); setSubmitting(true);                                │
    // │ 2. try {                                                               │
    // │      await login(email, password);   // AuthContext fait le POST       │
    // │      navigate('/profile');           // succès → page protégée         │
    // │    } catch (err) {                                                     │
    // │      setError(err instanceof ApiError ? err.message : 'Erreur');       │
    // │    } finally {                                                         │
    // │      setSubmitting(false);                                             │
    // │    }                                                                   │
    // └───────────────────────────────────────────────────────────────────────┘

    setError(null);
    setSubmitting(true);

    try {
      await login(email, password);
      navigate('/profile');
    } catch (err) {
      setError(err instanceof ApiError ? err.message : 'Erreur');
    } finally {
      setSubmitting(false); 
    }
  }

  return (
    <section className="mx-auto max-w-sm p-8">
      <h1 className="text-2xl font-bold text-slate-900">Connexion</h1>

      <form onSubmit={handleSubmit} className="mt-6 space-y-4">
        <div>
          <label htmlFor="email" className="block text-sm font-medium text-slate-700">
            Email
          </label>
          <input
            id="email"
            type="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            required
            className="mt-1 w-full rounded-md border border-slate-300 px-3 py-2 outline-none focus:border-slate-500"
          />
        </div>

        <div>
          <label htmlFor="password" className="block text-sm font-medium text-slate-700">
            Mot de passe
          </label>
          <input
            id="password"
            type="password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            required
            className="mt-1 w-full rounded-md border border-slate-300 px-3 py-2 outline-none focus:border-slate-500"
          />
        </div>

        {error && <p className="rounded-md bg-red-50 px-3 py-2 text-sm text-red-700">{error}</p>}

        <button
          type="submit"
          disabled={submitting}
          className="w-full rounded-md bg-slate-800 px-4 py-2 text-white hover:bg-slate-700 disabled:opacity-50"
        >
          {submitting ? 'Connexion…' : 'Se connecter'}
        </button>
      </form>

      <p className="mt-4 text-xs text-slate-500">
        Comptes de test : <code>alice@ynov.com</code> / <code>bob@ynov.com</code> - mot de passe{' '}
        <code>password123</code>
      </p>
    </section>
  );
}
