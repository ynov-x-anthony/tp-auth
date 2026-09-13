/**
 * Wrapper autour de `fetch` pour parler à l'API.
 *
 * ⚠️ Il MANQUE UNE LIGNE : `credentials: 'include'` (voir TODO 1 du workshop).
 * Sans elle, le navigateur n'attache PAS le cookie de session aux requêtes
 * vers l'API (autre origine : :5173 → :3001) → toutes les routes protégées
 * répondent 401, et le login "marche" mais ne connecte personne.
 */

const API_URL = import.meta.env.VITE_API_URL ?? 'http://localhost:3001';

/** Erreur "métier" : porte le code HTTP et le message renvoyé par l'API. */
export class ApiError extends Error {
  constructor(
    public status: number,
    message: string,
  ) {
    super(message);
    this.name = 'ApiError';
  }
}

export async function api<T>(path: string, options: RequestInit = {}): Promise<T> {
  const res = await fetch(API_URL + path, {
    ...options,

    credentials: 'include',

    headers: {
      'Content-Type': 'application/json',
      ...options.headers,
    },
  });

  if (!res.ok) {
    const body = (await res.json().catch(() => null)) as { error?: string } | null;
    throw new ApiError(res.status, body?.error ?? res.statusText);
  }

  if (res.status === 204) {
    return undefined as T;
  }

  return res.json() as Promise<T>;
}