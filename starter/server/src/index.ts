/**
 * Point d'entrée du serveur.
 *
 * Ordre des middlewares (important) :
 *   1. cors(...)        → autorise le front (origine précise) + l'échange de cookies
 *   2. express.json()   → parse les corps JSON en req.body
 *   3. cookieParser()   → parse l'entête Cookie en req.cookies
 *   4. routes
 *   5. 404 + gestionnaire d'erreurs
 */

import express from 'express';
import cors from 'cors';
import cookieParser from 'cookie-parser';
import { config } from './config';
import { authRouter } from './routes/auth.routes';

const app = express();

// --- 1. CORS -----------------------------------------------------------------
// Le front (http://localhost:5173) et l'API (http://localhost:3001) sont sur des
// origines différentes. Pour que le navigateur envoie/reçoive le cookie :
//   - `origin` doit être une origine PRÉCISE (jamais "*" avec des credentials)
//   - `credentials: true` renvoie l'entête Access-Control-Allow-Credentials
app.use(
  cors({
    origin: config.clientOrigin,
    credentials: true,
  }),
);

// --- 2. Corps JSON ---------------------------------------------------------------
app.use(express.json());

// --- 3. Cookies ----------------------------------------------------------------
app.use(cookieParser());

// --- 4. Routes ---------------------------------------------------------------
app.get('/health', (_req, res) => {
  res.json({ ok: true });
});

app.use('/auth', authRouter);

// --- 5. 404 + erreurs ------------------------------------------------------------
app.use((_req, res) => {
  res.status(404).json({ error: 'Route inconnue' });
});

app.use(
  (err: unknown, _req: express.Request, res: express.Response, _next: express.NextFunction) => {
    console.error(err);
    res.status(500).json({ error: 'Erreur serveur' });
  },
);

app.listen(config.port, () => {
  console.log(`🚀 API prête sur http://localhost:${config.port}`);
  console.log(`   CORS autorisé pour ${config.clientOrigin}`);
});
