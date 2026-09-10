/**
 * AuthContext : l'état "qui suis-je ?" partagé dans toute l'application.
 *
 * On expose :
 *   - user    : le profil courant, ou null
 *   - status  : 'loading' (on interroge le serveur) | 'authenticated' | 'anonymous'
 *   - login(email, password)
 *   - logout()
 *
 * Point clé : au montage, on appelle GET /auth/me. Si le cookie httpOnly est encore
 * valide (ex. après un F5), le serveur répond 200 + le profil → on est "déjà connecté"
 * sans avoir stocké quoi que ce soit côté JS.
 */

import {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useMemo,
  useState,
  type ReactNode,
} from 'react';
import { api, ApiError } from '../api/client';

export interface PublicUser {
  id: string;
  email: string;
  name: string;
}

type Status = 'loading' | 'authenticated' | 'anonymous';

interface AuthContextValue {
  user: PublicUser | null;
  status: Status;
  login: (email: string, password: string) => Promise<void>;
  logout: () => Promise<void>;
}

const AuthContext = createContext<AuthContextValue | null>(null);

export function AuthProvider({ children }: { children: ReactNode }) {
  const [user, setUser] = useState<PublicUser | null>(null);
  const [status, setStatus] = useState<Status>('loading');

  // --- Au démarrage : "est-ce que je suis déjà connecté ?" -------------------
  useEffect(() => {
    let cancelled = false;

    api<{ user: PublicUser }>('/auth/me')
      .then((data) => {
        if (cancelled) return;
        setUser(data.user);
        setStatus('authenticated');
      })
      .catch((err) => {
        if (cancelled) return;
        // 401 = cas NORMAL : pas (ou plus) de session valide.
        if (err instanceof ApiError && err.status === 401) {
          setUser(null);
          setStatus('anonymous');
        } else {
          // vraie erreur (API éteinte...) : on considère l'utilisateur comme anonyme.
          console.error('Échec de /auth/me :', err);
          setUser(null);
          setStatus('anonymous');
        }
      });

    return () => {
      cancelled = true;
    };
  }, []);

  // --- Connexion -----------------------------------------------------------
  const login = useCallback(async (email: string, password: string) => {
    const data = await api<{ user: PublicUser }>('/auth/login', {
      method: 'POST',
      body: JSON.stringify({ email, password }),
    });
    // Le serveur a posé le cookie dans sa réponse ; nous, on met juste à jour l'UI.
    setUser(data.user);
    setStatus('authenticated');
  }, []);

  // --- Déconnexion -------------------------------------------------------------
  const logout = useCallback(async () => {
    await api('/auth/logout', { method: 'POST' }); // le serveur efface le cookie
    setUser(null);
    setStatus('anonymous');
  }, []);

  const value = useMemo<AuthContextValue>(
    () => ({ user, status, login, logout }),
    [user, status, login, logout],
  );

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
}

/** Hook d'accès au contexte. Lève si utilisé hors d'un <AuthProvider>. */
export function useAuth(): AuthContextValue {
  const ctx = useContext(AuthContext);
  if (!ctx) {
    throw new Error('useAuth doit être utilisé à l’intérieur d’un <AuthProvider>');
  }
  return ctx;
}
