/**
 * Types partagés du serveur.
 */

/** Un utilisateur tel qu'il est stocké dans la "BDD" (db.json). */
export interface User {
  id: string;
  email: string;
  name: string;
  /** Hash Argon2id du mot de passe - JAMAIS le mot de passe en clair. */
  passwordHash: string;
}

/** Version "publique" d'un user : ce qu'on accepte de renvoyer au front. */
export interface PublicUser {
  id: string;
  email: string;
  name: string;
}

/** Contenu qu'on met dans le JWT (le "payload"). */
export interface JwtPayload {
  /** subject = id de l'utilisateur (convention JWT). */
  sub: string;
  email: string;
}

/**
 * Augmentation de type : on ajoute `req.user` à l'objet Request d'Express.
 * Après le middleware `requireAuth`, `req.user` est garanti présent.
 */
declare global {
  // eslint-disable-next-line @typescript-eslint/no-namespace
  namespace Express {
    interface Request {
      user?: { id: string; email: string };
    }
  }
}

export {};
