/**
 * Layout racine de l'application (route parente dans router.tsx).
 *
 * Il n'y a plus de <Routes>/<Route> ici : l'arbre des routes est décrit dans
 * `src/router.tsx` (React Router v7, data mode). Ce composant se contente
 * d'afficher le châssis commun - la Navbar - et de rendre la route active
 * à l'emplacement de <Outlet />.
 */

import { Outlet } from 'react-router-dom';
import { Navbar } from './components/Navbar';

export default function App() {
  return (
    <div className="min-h-screen bg-slate-50 text-slate-900">
      <Navbar />
      <Outlet />
    </div>
  );
}
