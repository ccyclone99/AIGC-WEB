import { describe, expect, it, vi } from 'vitest'

import { createHttpAigcApiClient } from './httpClient'

const response = (body: unknown, status = 200) =>
  new Response(JSON.stringify(body), {
    status,
    headers: { 'Content-Type': 'application/json', 'x-trace-id': 'trace-test' },
  })

describe('HTTP API client', () => {
  it('encodes dynamic path segments and accepts a valid API envelope', async () => {
    const fetchMock = vi.fn(async (_input: RequestInfo | URL, _init?: RequestInit) =>
      response({ ok: true, data: { id: 'template' }, traceId: 'trace-test' }),
    )
    const client = createHttpAigcApiClient({ fetchImpl: fetchMock as typeof fetch })

    const result = await client.templates.get('template/with space')

    expect(result.ok).toBe(true)
    expect(fetchMock.mock.calls[0]?.[0]).toBe('/api/templates/template%2Fwith%20space')
  })

  it('returns a typed client error for malformed JSON', async () => {
    const fetchImpl = (async () => new Response('<html>bad gateway</html>', { status: 502 })) as typeof fetch
    const client = createHttpAigcApiClient({ fetchImpl })

    const result = await client.auth.getSession()

    expect(result).toMatchObject({ ok: false, error: { code: 'INVALID_JSON_RESPONSE' } })
  })

  it('times out requests that never resolve', async () => {
    const fetchImpl = ((_input: RequestInfo | URL, init?: RequestInit) =>
      new Promise<Response>((_resolve, reject) => {
        init?.signal?.addEventListener('abort', () => reject(new DOMException('Aborted', 'AbortError')), { once: true })
      })) as typeof fetch
    const client = createHttpAigcApiClient({ fetchImpl, timeoutMs: 5 })

    const result = await client.auth.getSession()

    expect(result).toMatchObject({ ok: false, error: { code: 'REQUEST_TIMEOUT', retryable: true } })
  })
})
