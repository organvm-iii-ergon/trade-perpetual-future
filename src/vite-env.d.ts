/// <reference types="vite/client" />

interface ImportMetaEnv {
  readonly VITE_RPC_ENDPOINT: string
  readonly VITE_DRIFT_ENV: string
  readonly VITE_DRIFT_BUILDER_CODE: string
}

interface ImportMeta {
  readonly env: ImportMetaEnv
}
