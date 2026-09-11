/**
 * Wrapper autour de `fetch` pour parler à l'API.
 *
 * `credentials: 'include'` (TODO 1) : le front (:5173) et l'API (:3001) sont sur deux
 * origines différentes. Sans cette option, le navigateur n'envoie pas le cookie httpOnly
 * posé au login → toutes les routes protégées répondent 401.
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
