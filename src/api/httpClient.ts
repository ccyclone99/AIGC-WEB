import type {
  AigcApiClient,
  ApiResult,
  AssetDto,
  CreateGenerationTaskRequest,
  CreatePaymentOrderRequest,
  CreateUploadRequest,
  GenerationTaskDto,
  PaymentOrderDto,
  SignupRewardDto,
  TemplateDto,
  TemplateQuoteDto,
  TemplateQuoteRequest,
  UpdateAssetRequest,
  UploadReceiptDto,
} from './contracts'
import type { AssetKind, AssetStatus } from '../types'

type HttpClientOptions = {
  baseUrl?: string
  fetchImpl?: typeof fetch
  timeoutMs?: number
}

export function createHttpAigcApiClient({ baseUrl = '/api', fetchImpl = fetch, timeoutMs = 15_000 }: HttpClientOptions = {}): AigcApiClient {
  const request = async <T>(path: string, init?: RequestInit): Promise<ApiResult<T>> => {
    const controller = new AbortController()
    const handleExternalAbort = () => controller.abort()
    init?.signal?.addEventListener('abort', handleExternalAbort, { once: true })
    const timeout = globalThis.setTimeout(() => controller.abort(), timeoutMs)

    try {
      const response = await fetchImpl(`${baseUrl}${path}`, {
        ...init,
        headers: {
          Accept: 'application/json',
          ...(init?.body ? { 'Content-Type': 'application/json' } : {}),
          ...(init?.headers ?? {}),
        },
        credentials: 'include',
        signal: controller.signal,
      })
      const responseText = await response.text()
      let payload: unknown

      try {
        payload = responseText ? JSON.parse(responseText) : undefined
      } catch {
        return clientError(
          'INVALID_JSON_RESPONSE',
          '服务返回了无法解析的数据。',
          response.headers.get('x-trace-id') ?? 'missing-trace-id',
        )
      }

      if (!isApiResult<T>(payload)) {
        return clientError(
          'INVALID_API_ENVELOPE',
          '服务响应格式与客户端约定不一致。',
          response.headers.get('x-trace-id') ?? 'missing-trace-id',
        )
      }

      if (!response.ok && payload.ok) {
        return {
          ok: false,
          error: {
            code: `HTTP_${response.status}`,
            message: response.statusText || '请求失败',
            traceId: response.headers.get('x-trace-id') ?? 'missing-trace-id',
          },
        }
      }

      return payload
    } catch (error) {
      const timedOut = error instanceof DOMException && error.name === 'AbortError'
      return {
        ok: false,
        error: {
          code: timedOut ? 'REQUEST_TIMEOUT' : 'NETWORK_ERROR',
          message: timedOut ? '请求超时，请稍后重试。' : error instanceof Error ? error.message : '网络请求失败',
          traceId: 'client-network-error',
          retryable: true,
        },
      }
    } finally {
      globalThis.clearTimeout(timeout)
      init?.signal?.removeEventListener('abort', handleExternalAbort)
    }
  }

  const post = <T>(path: string, body?: unknown) =>
    request<T>(path, {
      method: 'POST',
      body: body === undefined ? undefined : JSON.stringify(body),
    })

  const patch = <T>(path: string, body?: unknown) =>
    request<T>(path, {
      method: 'PATCH',
      body: body === undefined ? undefined : JSON.stringify(body),
    })

  const deleteRequest = <T>(path: string) => request<T>(path, { method: 'DELETE' })

  return {
    auth: {
      getSession: () => request('/auth/session'),
      createQrSession: (provider) => post('/auth/qr-sessions', { provider }),
      getQrSession: (sessionId) => request(`/auth/qr-sessions/${pathSegment(sessionId)}`),
      claimSignupReward: (idempotencyKey) => post<SignupRewardDto>('/auth/signup-reward/claim', { idempotencyKey }),
      listRewardCampaigns: () => request('/reward-campaigns'),
      claimRewardCampaign: (campaignId, idempotencyKey) =>
        post(`/reward-campaigns/${pathSegment(campaignId)}/claim`, { idempotencyKey }),
    },
    templates: {
      list: () => request<TemplateDto[]>('/templates'),
      get: (templateId) => request<TemplateDto>(`/templates/${pathSegment(templateId)}`),
      quote: (quoteRequest: TemplateQuoteRequest) =>
        post<TemplateQuoteDto>(`/templates/${pathSegment(quoteRequest.templateId)}/quote`, quoteRequest),
    },
    assets: {
      list: (params) => request<AssetDto[]>(withQuery('/assets', params)),
      listCategories: () => request('/asset-categories'),
      createCategory: (name, idempotencyKey) => post('/asset-categories', { name, idempotencyKey }),
      deleteCategory: (categoryId) => deleteRequest(`/asset-categories/${pathSegment(categoryId)}`),
      createUpload: (uploadRequest: CreateUploadRequest) => post<UploadReceiptDto>('/assets/uploads', uploadRequest),
      completeUpload: (uploadId) => post<UploadReceiptDto>(`/assets/uploads/${pathSegment(uploadId)}/complete`),
      cancelUpload: (uploadId) => post<UploadReceiptDto>(`/assets/uploads/${pathSegment(uploadId)}/cancel`),
      update: (assetId, updateRequest: UpdateAssetRequest) => patch<AssetDto>(`/assets/${pathSegment(assetId)}`, updateRequest),
      archive: (assetId) => post<AssetDto>(`/assets/${pathSegment(assetId)}/archive`),
      restore: (assetId) => post<AssetDto>(`/assets/${pathSegment(assetId)}/restore`),
      createDownloadUrl: (assetId) => post(`/assets/${pathSegment(assetId)}/download-url`),
    },
    generationTasks: {
      create: (taskRequest: CreateGenerationTaskRequest) => post<GenerationTaskDto>('/generation-tasks', taskRequest),
      list: () => request<GenerationTaskDto[]>('/generation-tasks'),
      get: (taskId) => request<GenerationTaskDto>(`/generation-tasks/${pathSegment(taskId)}`),
      cancel: (taskId, idempotencyKey) => post<GenerationTaskDto>(`/generation-tasks/${pathSegment(taskId)}/cancel`, { idempotencyKey }),
      retry: (taskId, idempotencyKey) => post<GenerationTaskDto>(`/generation-tasks/${pathSegment(taskId)}/retry`, { idempotencyKey }),
    },
    credits: {
      summary: () => request('/credits/summary'),
      ledger: () => request('/credits/ledger'),
      packages: () => request('/credits/packages'),
    },
    payments: {
      createOrder: (orderRequest: CreatePaymentOrderRequest) => post<PaymentOrderDto>('/payments/orders', orderRequest),
      getOrder: (orderId) => request<PaymentOrderDto>(`/payments/orders/${pathSegment(orderId)}`),
      cancelOrder: (orderId, idempotencyKey) => post<PaymentOrderDto>(`/payments/orders/${pathSegment(orderId)}/cancel`, { idempotencyKey }),
    },
  }
}

function pathSegment(value: string) {
  return encodeURIComponent(value)
}

function isApiResult<T>(payload: unknown): payload is ApiResult<T> {
  if (!payload || typeof payload !== 'object' || !('ok' in payload)) return false
  const result = payload as { ok: unknown; data?: unknown; error?: unknown }
  if (result.ok === true) return 'data' in result
  if (result.ok !== false || !result.error || typeof result.error !== 'object') return false
  const error = result.error as { code?: unknown; message?: unknown; traceId?: unknown }
  return typeof error.code === 'string' && typeof error.message === 'string' && typeof error.traceId === 'string'
}

function clientError<T>(code: string, message: string, traceId: string): ApiResult<T> {
  return { ok: false, error: { code, message, traceId } }
}

function withQuery(path: string, params?: { status?: AssetStatus; type?: string; kind?: AssetKind }) {
  if (!params) return path

  const query = new URLSearchParams()
  if (params.status) query.set('status', params.status)
  if (params.type) query.set('type', params.type)
  if (params.kind) query.set('kind', params.kind)

  const queryString = query.toString()
  return queryString ? `${path}?${queryString}` : path
}
