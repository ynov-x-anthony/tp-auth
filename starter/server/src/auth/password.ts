/**
 * Hachage des mots de passe avec Argon2id.
 *
 * Argon2id (gagnant de la Password Hashing Competition 2015, algo recommandé par l'OWASP) :
 *  - intègre un "sel" aléatoire dans chaque hash (2 mots de passe identiques → hash différents) ;
 *  - est "memory-hard" : il exige beaucoup de RAM par calcul, ce qui neutralise les attaques
 *    massivement parallèles sur GPU/ASIC - le point faible de bcrypt ;
 *  - "id" = combine Argon2i (résistant aux attaques par canaux auxiliaires) et Argon2d
 *    (résistant au crackage GPU) ;
 *  - est à sens unique : on ne "déchiffre" jamais un hash, on RE-hache la saisie et on compare.
 *
 * On utilise `@node-rs/argon2` : binaire précompilé (Rust / napi-rs), donc `npm install`
 * fonctionne partout sans toolchain de build - comme le faisait `bcryptjs`.
 *
 * Le hash produit est une chaîne PHC auto-décrite qui embarque déjà tous les paramètres :
 *   $argon2id$v=19$m=19456,t=2,p=1$<sel base64>$<hash base64>
 * → `verifyPassword` n'a besoin QUE de cette chaîne pour tout recalculer.
 */

import { hash, verify, Algorithm } from '@node-rs/argon2';

/**
 * Paramètres de coût - recommandations OWASP pour Argon2id :
 *  - memoryCost  : 19 Mio de RAM par calcul (19456 Kio)
 *  - timeCost    : 2 itérations
 *  - parallelism : 1
 * Imperceptible pour un login unique (~50 ms), ruineux pour du brute-force massif.
 * (Ce sont aussi les valeurs par défaut de la lib ; on les fixe pour que ce soit explicite.)
 */
const OPTIONS = {
  algorithm: Algorithm.Argon2id,
  memoryCost: 19456,
  timeCost: 2,
  parallelism: 1,
} as const;

/** Transforme un mot de passe en clair en hash stockable. */
export async function hashPassword(plain: string): Promise<string> {
  return hash(plain, OPTIONS);
}

/** Vrai si `plain` correspond au `hash` déjà stocké. */
export async function verifyPassword(plain: string, hash: string): Promise<boolean> {
  try {
    return await verify(hash, plain);
  } catch {
    // Hash absent / format inattendu (ex. ancien hash bcrypt en base) → refus propre.
    return false;
  }
}
