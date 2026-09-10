/**
 * Page de profil - protégée par <ProtectedRoute />.
 *
 * On affiche l'`user` du contexte. Le bouton "Rappeler /auth/me" refait l'appel
 * à la demande : c'est l'occasion de montrer, dans l'onglet Network, que la requête
 * part AVEC le cookie sans qu'on ajoute le moindre header à la main.
 */

import { useState } from 'react';
import { useAuth, type PublicUser } from '../auth/AuthContext';
import { api, ApiError } from '../api/client';

export function ProfilePage() {
  const { user } = useAuth();
  const [checked, setChecked] = useState<PublicUser | null>(null);
  const [note, setNote] = useState<string | null>(null);

  async function callMe() {
    setNote(null);
    try {
      const data = await api<{ user: PublicUser }>('/auth/me');
      setChecked(data.user);
      setNote('200 OK - le serveur a reconnu le cookie.');
    } catch (err) {
      setChecked(null);
      setNote(err instanceof ApiError ? `${err.status} - ${err.message}` : 'Erreur réseau');
    }
  }

  return (
    <section className="mx-auto max-w-2xl p-8">
      <h1 className="text-2xl font-bold text-slate-900">Mon profil</h1>
      <p className="mt-2 text-sm text-slate-500">
        Route protégée : accessible uniquement avec un cookie de session valide.
      </p>

      <dl className="mt-6 grid grid-cols-[7rem_1fr] gap-2 rounded-lg bg-slate-100 p-4 text-sm">
        <dt className="font-medium text-slate-500">id</dt>
        <dd className="font-mono text-slate-800">{user?.id}</dd>
        <dt className="font-medium text-slate-500">nom</dt>
        <dd className="text-slate-800">{user?.name}</dd>
        <dt className="font-medium text-slate-500">email</dt>
        <dd className="text-slate-800">{user?.email}</dd>
      </dl>

      <button
        onClick={callMe}
        className="mt-6 rounded-md border border-slate-300 px-4 py-2 text-sm hover:bg-slate-50"
      >
        Rappeler <code>GET /auth/me</code>
      </button>

      {note && <p className="mt-3 text-sm text-slate-600">{note}</p>}
      {checked && (
        <pre className="mt-3 overflow-x-auto rounded-md bg-slate-900 p-4 text-xs text-slate-100">
          {JSON.stringify(checked, null, 2)}
        </pre>
      )}

      <p className="mt-8 rounded-md bg-amber-50 p-3 text-xs text-amber-800">
        Ouvrez la console et tapez <code>document.cookie</code> : le cookie <code>token</code> est{' '}
        <strong>invisible</strong> (HttpOnly). Le JavaScript ne peut pas le lire - donc un script
        malveillant non plus.
      </p>
    </section>
  );
}
