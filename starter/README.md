# auth-tp-starter - le TP

**Le backend est fourni, complet et fonctionnel.** On ne le touche pas.
Le travail est **côté React** : 3 petits points à compléter.

## Lancer

```bash
npm install
npm run dev        # API :3001 (prête)  +  front :5173
```

Comptes de test : `alice@ynov.com` / `bob@ynov.com` - `password123`.

## Ce que tu dois faire (énoncé complet : <https://antho-instructor.github.io/workshop-auth/>)

| # | Fichier | À faire | Taille |
|---|---------|---------|--------|
| **TODO 1** | `client/src/api/client.ts` | ajouter `credentials: 'include'` dans le `fetch` | 1 ligne |
| **TODO 2** | `client/src/auth/ProtectedRoute.tsx` | gérer `status` : `loading` / `anonymous` / authentifié | 3 lignes |
| **TODO 3** | `client/src/pages/LoginPage.tsx` | remplir `handleSubmit` (appel à `login()` + `navigate`) | ~8 lignes |

Cherche les blocs `TODO 1` / `TODO 2` / `TODO 3` dans le code.

## Fourni et fonctionnel (à lire, pas à réécrire)

**Backend** (`server/`) - identique à `solution/server/` :
`config.ts`, `types.ts`, `db.ts` (seed lowdb), `auth/password.ts` (hash **Argon2id**),
`auth/jwt.ts`, `auth/middleware.ts` (`requireAuth`), `routes/auth.routes.ts`,
`index.ts` (CORS + cookies).

**Frontend** (`client/`) - tout sauf les 3 TODO :
`auth/AuthContext.tsx` (`user` / `status` / `login` / `logout` + `/auth/me` au montage),
`pages/ProfilePage.tsx`, `pages/HomePage.tsx`, `components/Navbar.tsx`,
`router.tsx` (arbre des routes - React Router v7 *data mode*, `createBrowserRouter`),
`App.tsx` (layout : Navbar + `<Outlet />`), `main.tsx` (`<RouterProvider>`).

En cas de blocage : le corrigé est dans `../solution/`.




## État du TP (complété)

Les 3 TODOs ont été implémentés :
- TODO 1 : `credentials: 'include'` ajouté dans `client.ts`
- TODO 2 : gestion des 3 états dans `ProtectedRoute.tsx`
- TODO 3 : `handleSubmit` implémenté dans `LoginPage.tsx`

Testé : connexion, F5 (session conservée), déconnexion, cookie HttpOnly invisible en JS.