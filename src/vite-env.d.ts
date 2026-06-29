/// <reference types="vite/client" />

interface ImportMetaEnv {
  readonly VITE_AIGC_API_MODE?: 'prototype' | 'http'
  readonly VITE_AIGC_API_BASE_URL?: string
}

interface ImportMeta {
  readonly env: ImportMetaEnv
}
