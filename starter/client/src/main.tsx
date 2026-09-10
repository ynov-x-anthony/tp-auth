import { StrictMode } from 'react';
import { createRoot } from 'react-dom/client';
import { RouterProvider } from 'react-router-dom';
import { AuthProvider } from './auth/AuthContext';
import { router } from './router';
import './index.css';

createRoot(document.getElementById('root')!).render(
  <StrictMode>
    {/* AuthProvider : rend `user` / `login` / `logout` disponibles partout.
        Il n'utilise aucun hook de router → il peut rester au-dessus du RouterProvider. */}
    <AuthProvider>
      {/* RouterProvider : branche l'arbre de routes décrit dans router.tsx
          (React Router v7, data mode - remplace <BrowserRouter>). */}
      <RouterProvider router={router} />
    </AuthProvider>
  </StrictMode>,
);
