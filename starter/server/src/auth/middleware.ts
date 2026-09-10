/**
 * Middleware `requireAuth` : protège les routes qui exigent d'être connecté.
 *
 * À CHAQUE requête protégée, il faut re-prouver l'identité. Ici, la preuve = un JWT valide.
 * On accepte le token de DEUX façons :
 *   1. le cookie `token` (cas du navigateur : envoyé automatiquement) ;
 *   2. le header `Authorization: Bearer <token>` (cas Postman / curl / autre API).
 *
 * Les deux transportent exactement la même chose : le JWT.
 */

import type { NextFunction, Request, Response } from 'express';
import { config } from '../config';
import { verifyToken } from './jwt';

/** Extrait le token de la requête : cookie en priorité, sinon header Authorization. */
function extractToken(req: Request): string | null {
  // 1. Cookie (posé par /auth/login, renvoyé tout seul par le navigateur)
  const fromCookie = req.cookies?.[config.cookieName];
  if (typeof fromCookie === 'string' && fromCookie.length > 0) {
    return fromCookie;
  }

  // 2. Header "Authorization: Bearer eyJhbGci..."
  const header = req.headers.authorization;
  if (header?.startsWith('Bearer ')) {
    return header.slice('Bearer '.length).trim();
  }

  return null;
}

export function requireAuth(req: Request, res: Response, next: NextFunction): void {
  const token = extractToken(req);

  if (!token) {
    res.status(401).json({ error: 'Non authentifié' });
    return;
  }

  try {
    const payload = verifyToken(token); // lève si signature/expiration KO
    req.user = { id: payload.sub, email: payload.email };
    next();
  } catch {
    res.status(401).json({ error: 'Token invalide ou expiré' });
  }
}
