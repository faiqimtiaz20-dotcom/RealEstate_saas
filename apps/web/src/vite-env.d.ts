/// <reference types="vite/client" />

interface ImportMetaEnv {
  readonly VITE_API_BASE_URL?: string;
  /** When `"true"`, dashboard loads from `GET /v1/dashboard/summary?range=` instead of mocks. */
  readonly VITE_DASHBOARD_LIVE_API?: string;
}

interface ImportMeta {
  readonly env: ImportMetaEnv;
}
