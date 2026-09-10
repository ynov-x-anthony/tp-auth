/**
 * Routes d'authentification, montées sur `/auth` (voir index.ts).
 *
 *   POST /auth/login   → vérifie les identifiants, pose le cookie JWT
 *   POST /auth/logout  → efface le cookie
 *   GET  /auth/me      → route protégée : renvoie le profil du porteur du token
 */

import { Router } from 'express';
import type { CookieOptions } from 'express';
import { config } from '../config';
import { findUserByEmail, findUserById } from '../db';
import { verifyPassword } from '../auth/password';
import { signToken } from '../auth/jwt';
import { requireAuth } from '../auth/middleware';
import type { PublicUser, User } from '../types';

export const authRouter = Router();

/**
 * Options du cookie qui transporte le JWT.
 *  - httpOnly : inaccessible à `document.cookie` → à l'abri d'une injection XSS
 *  - sameSite 'lax' : pas envoyé sur des requêtes cross-site tierces (anti-CSRF de base)
 *  - secure : en prod uniquement (HTTPS obligatoire pour transmettre le cookie)
 *  - maxAge : même durée que l'expiration du JWT
 */
const COOKIE_OPTIONS: CookieOptions = {
  httpOnly: true,
  sameSite: 'lax',
  secure: config.isProd,
  path: '/',
  maxAge: config.jwtExpiresInSeconds * 1000, // maxAge est en millisecondes
};

/** Ne jamais renvoyer le passwordHash au client. */
function toPublicUser(user: User): PublicUser {
  return { id: user.id, email: user.email, name: user.name };
}

// ---------------------------------------------------------------------------
// POST /auth/login
// ---------------------------------------------------------------------------
authRouter.post('/login', async (req, res) => {
  const { email, password } = req.body ?? {};

  if (typeof email !== 'string' || typeof password !== 'string') {
    res.status(400).json({ error: 'email et password sont requis' });
    return;
  }

  const user = findUserByEmail(email);
  const passwordOk = user ? await verifyPassword(password, user.passwordHash) : false;

  // Message identique que l'email soit inconnu OU le mot de passe faux :
  // on ne donne aucun indice à un attaquant sur ce qui a échoué.
  if (!user || !passwordOk) {
    res.status(401).json({ error: 'Identifiants invalides' });
    return;
  }

  // Identité prouvée → on fabrique le JWT et on le dépose dans un cookie.
  const token = signToken({ sub: user.id, email: user.email });
  res.cookie(config.cookieName, token, COOKIE_OPTIONS);

  res.json({ user: toPublicUser(user) });
});

// ---------------------------------------------------------------------------
// POST /auth/logout
// ---------------------------------------------------------------------------
authRouter.post('/logout', (_req, res) => {
  // Se déconnecter = supprimer le cookie côté navigateur.
  res.clearCookie(config.cookieName, { path: '/' });
  res.status(204).end();
});

// ---------------------------------------------------------------------------
// GET /auth/me  (protégée par requireAuth)
// ---------------------------------------------------------------------------
authRouter.get('/me', requireAuth, (req, res) => {
  // Grâce à requireAuth, req.user est garanti présent.
  const user = findUserById(req.user!.id);

  if (!user) {
    // Cas rare : token valide mais user supprimé entre-temps.
    res.status(401).json({ error: 'Utilisateur introuvable' });
    return;
  }

  res.json({ user: toPublicUser(user) });
});
