/// <reference types="vite/client" />

interface ImportMetaEnv {
  /** URL de base de l'API. Défini dans `.env` (voir `.env.example`). */
  readonly VITE_API_URL?: string;
}

interface ImportMeta {
  readonly env: ImportMetaEnv;
}
