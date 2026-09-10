/**
 * Configuration centralisée du serveur.
 *
 * On lit `process.env` UNE fois ici, avec une valeur de repli pour le dev.
 * Le reste du code importe `config`, jamais `process.env` directement.
 */

export const config = {
  /** Port d'écoute de l'API. */
  port: Number(process.env.PORT ?? 3001),

  /**
   * Secret de signature des JWT.
   * En production ce serait une longue chaîne aléatoire fournie par l'environnement,
   * et l'app refuserait de démarrer sans. Ici on tolère un repli pour le TP.
   */
  jwtSecret: process.env.JWT_SECRET ?? 'dev-secret-not-for-production',

  /** Durée de vie du token ET du cookie, en secondes (ici 1 heure). */
  jwtExpiresInSeconds: 60 * 60,

  /** Nom du cookie qui transporte le JWT. */
  cookieName: 'token',

  /** Origine autorisée à parler à l'API (le front Vite). Doit être précise avec `credentials`. */
  clientOrigin: process.env.CLIENT_ORIGIN ?? 'http://localhost:5173',

  /** true en production → active `Secure` sur le cookie (HTTPS obligatoire). */
  isProd: process.env.NODE_ENV === 'production',
};
