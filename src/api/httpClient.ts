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
}

export function createHttpAigcApiClient({ baseUrl = '/api', fetchImpl = fetch }: HttpClientOptions = {}): AigcApiClient {
  const request = async <T>(path: string, init?: RequestInit): Promise<ApiResult<T>> => {
    try {
      const response = await fetchImpl(`${baseUrl}${path}`, {
        headers: {
          'Content-Type': 'application/json',
          ...(init?.headers ?? {}),
        },
        credentials: 'include',
        ...init,
      })
      const payload = (await response.json()) as ApiResult<T>

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
      return {
        ok: false,
        error: {
          code: 'NETWORK_ERROR',
          message: error instanceof Error ? error.message : '网络请求失败',
          traceId: 'client-network-error',
          retryable: true,
        },
      }
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
      getQrSession: (sessionId) => request(`/auth/qr-sessions/${sessionId}`),
      claimSignupReward: (idempotencyKey) => post<SignupRewardDto>('/auth/signup-reward/claim', { idempotencyKey }),
      listRewardCampaigns: () => request('/reward-campaigns'),
      claimRewardCampaign: (campaignId, idempotencyKey) =>
        post(`/reward-campaigns/${campaignId}/claim`, { idempotencyKey }),
    },
    templates: {
      list: () => request<TemplateDto[]>('/templates'),
      get: (templateId) => request<TemplateDto>(`/templates/${templateId}`),
      quote: (quoteRequest: TemplateQuoteRequest) =>
        post<TemplateQuoteDto>(`/templates/${quoteRequest.templateId}/quote`, quoteRequest),
    },
    assets: {
      list: (params) => request<AssetDto[]>(withQuery('/assets', params)),
      listCategories: () => request('/asset-categories'),
      createCategory: (name, idempotencyKey) => post('/asset-categories', { name, idempotencyKey }),
      deleteCategory: (categoryId) => deleteRequest(`/asset-categories/${categoryId}`),
      createUpload: (uploadRequest: CreateUploadRequest) => post<UploadReceiptDto>('/assets/uploads', uploadRequest),
      completeUpload: (uploadId) => post<UploadReceiptDto>(`/assets/uploads/${uploadId}/complete`),
      cancelUpload: (uploadId) => post<UploadReceiptDto>(`/assets/uploads/${uploadId}/cancel`),
      update: (assetId, updateRequest: UpdateAssetRequest) => patch<AssetDto>(`/assets/${assetId}`, updateRequest),
      archive: (assetId) => post<AssetDto>(`/assets/${assetId}/archive`),
      restore: (assetId) => post<AssetDto>(`/assets/${assetId}/restore`),
      createDownloadUrl: (assetId) => post(`/assets/${assetId}/download-url`),
    },
    generationTasks: {
      create: (taskRequest: CreateGenerationTaskRequest) => post<GenerationTaskDto>('/generation-tasks', taskRequest),
      list: () => request<GenerationTaskDto[]>('/generation-tasks'),
      get: (taskId) => request<GenerationTaskDto>(`/generation-tasks/${taskId}`),
      cancel: (taskId, idempotencyKey) => post<GenerationTaskDto>(`/generation-tasks/${taskId}/cancel`, { idempotencyKey }),
      retry: (taskId, idempotencyKey) => post<GenerationTaskDto>(`/generation-tasks/${taskId}/retry`, { idempotencyKey }),
    },
    credits: {
      summary: () => request('/credits/summary'),
      ledger: () => request('/credits/ledger'),
      packages: () => request('/credits/packages'),
    },
    payments: {
      createOrder: (orderRequest: CreatePaymentOrderRequest) => post<PaymentOrderDto>('/payments/orders', orderRequest),
      getOrder: (orderId) => request<PaymentOrderDto>(`/payments/orders/${orderId}`),
      cancelOrder: (orderId, idempotencyKey) => post<PaymentOrderDto>(`/payments/orders/${orderId}/cancel`, { idempotencyKey }),
    },
  }
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
