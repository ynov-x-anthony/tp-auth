/**
 * "Base de données" du TP : un simple fichier JSON géré par lowdb.
 *
 * lowdb charge `db.json` en mémoire au démarrage ; chaque `db.write()` réécrit le fichier.
 * C'est suffisant pour un TP et ça se lit à l'œil nu (ouvrez `server/db.json`).
 */

import { JSONFilePreset } from 'lowdb/node';
import { randomUUID } from 'node:crypto';
import { hashPassword } from './auth/password';
import type { User } from './types';

interface Schema {
  users: User[];
}

/** Forme du fichier au tout premier lancement (avant seed). */
const defaultData: Schema = { users: [] };

/**
 * `db` est prêt à l'emploi après ce `await` (module ESM → top-level await autorisé).
 * Usage : `db.data.users`, puis `await db.write()` pour persister.
 */
export const db = await JSONFilePreset<Schema>('db.json', defaultData);

/**
 * Seed : crée les 2 comptes de démo si la BDD est vide.
 * Les mots de passe sont hachés ici - le fichier ne contient jamais de mot de passe en clair.
 */
async function seed(): Promise<void> {
  if (db.data.users.length > 0) return;

  db.data.users.push(
    {
      id: randomUUID(),
      email: 'alice@ynov.com',
      name: 'Alice',
      passwordHash: await hashPassword('password123'),
    },
    {
      id: randomUUID(),
      email: 'bob@ynov.com',
      name: 'Bob',
      passwordHash: await hashPassword('password123'),
    },
  );

  await db.write();
  console.log('🌱 db.json créé avec 2 comptes de démo (alice@ynov.com / bob@ynov.com - password123)');
}

await seed();

/** Petit helper : retrouver un utilisateur par email (insensible à la casse). */
export function findUserByEmail(email: string): User | undefined {
  const needle = email.trim().toLowerCase();
  return db.data.users.find((u) => u.email.toLowerCase() === needle);
}

/** Retrouver un utilisateur par id. */
export function findUserById(id: string): User | undefined {
  return db.data.users.find((u) => u.id === id);
}
