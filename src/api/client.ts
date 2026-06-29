import type { AigcApiClient } from './contracts'
import { createHttpAigcApiClient } from './httpClient'
import { createPrototypeAigcApiClient } from './prototypeClient'

export type ApiClientMode = 'prototype' | 'http'

type ApiClientOptions = {
  mode?: ApiClientMode
  baseUrl?: string
}

export function createAigcApiClient({ mode = 'prototype', baseUrl }: ApiClientOptions = {}): AigcApiClient {
  if (mode === 'http') return createHttpAigcApiClient({ baseUrl })
  return createPrototypeAigcApiClient()
}
