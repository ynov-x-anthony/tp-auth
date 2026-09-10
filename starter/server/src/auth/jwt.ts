/**
 * Création et vérification des JWT (JSON Web Tokens).
 *
 * Un JWT = `base64(header).base64(payload).signature`
 *   - header  : { alg: "HS256", typ: "JWT" }
 *   - payload : nos données { sub, email, iat, exp }  ← LISIBLE par tous, PAS chiffré
 *   - signature: HMAC_SHA256(header + "." + payload, JWT_SECRET)
 *
 * Le serveur ne stocke rien : il recalcule la signature avec son secret et la compare.
 * Si quelqu'un modifie le payload, la signature ne correspond plus → token rejeté.
 */

import jwt from 'jsonwebtoken';
import { config } from '../config';
import type { JwtPayload } from '../types';

/** Signe un token contenant l'id (`sub`) et l'email de l'utilisateur. */
export function signToken(payload: JwtPayload): string {
  return jwt.sign(payload, config.jwtSecret, {
    expiresIn: config.jwtExpiresInSeconds, // ajoute automatiquement `exp` (et `iat`)
  });
}

/**
 * Vérifie la signature ET l'expiration.
 * Lève une erreur (`JsonWebTokenError` / `TokenExpiredError`) si le token est invalide.
 * L'appelant (le middleware) attrape cette erreur et répond 401.
 */
export function verifyToken(token: string): JwtPayload {
  const decoded = jwt.verify(token, config.jwtSecret);

  // `jwt.verify` renvoie `string | JwtPayload` au sens de la lib ; on restreint à notre forme.
  if (typeof decoded === 'string' || !('sub' in decoded) || !('email' in decoded)) {
    throw new Error('Payload de token inattendu');
  }

  return { sub: String(decoded.sub), email: String(decoded.email) };
}
