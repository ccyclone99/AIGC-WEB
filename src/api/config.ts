import { createAigcApiClient, type ApiClientMode } from './client'

const apiMode = (import.meta.env.VITE_AIGC_API_MODE ?? 'prototype') as ApiClientMode
const apiBaseUrl = import.meta.env.VITE_AIGC_API_BASE_URL ?? '/api'

export const aigcApiClient = createAigcApiClient({
  mode: apiMode,
  baseUrl: apiBaseUrl,
})

export const aigcApiConfig = {
  mode: apiMode,
  baseUrl: apiBaseUrl,
}
