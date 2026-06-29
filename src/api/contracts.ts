import type {
  AssetKind,
  AssetStatus,
  LedgerKind,
  LedgerStatus,
  OutputSettings,
  PaymentOrderStatus,
  QrLoginStatus,
  RechargePackage,
  RiskCheckStatus,
  SignupRewardStatus,
  TaskFailure,
  TaskStatus,
  Template,
  TemplateConfig,
  TemplateWorkflowType,
  UploadReceiptStatus,
} from '../types'

export type ApiErrorDto = {
  code: string
  message: string
  traceId: string
  retryable?: boolean
}

export type ApiResult<T> =
  | {
      ok: true
      data: T
      traceId: string
    }
  | {
      ok: false
      error: ApiErrorDto
    }

export type SessionDto = {
  authenticated: boolean
  user?: {
    id: string
    displayName: string
    avatarUrl?: string
    phoneMasked?: string
  }
  creditBalance: number
  frozenCredits: number
}

export type QrLoginSessionDto = {
  id: string
  provider: string
  status: QrLoginStatus
  expiresAt: string
  note: string
}

export type SignupRewardDto = {
  status: SignupRewardStatus
  rewardCredits: number
  ledgerId?: string
  riskChecks: Array<{
    id: string
    label: string
    status: RiskCheckStatus
    value: string
    note: string
  }>
}

export type RewardCampaignDto = {
  id: string
  title: string
  status: 'available' | 'claimed' | 'risk_blocked' | 'expired' | 'disabled'
  rewardCredits: number
  startsAt: string
  endsAt?: string
  claimLimit: number
  claimedCount: number
  riskChecks: SignupRewardDto['riskChecks']
}

export type TemplateDto = Template & {
  publicationStatus: 'draft' | 'published' | 'paused' | 'archived'
  config: TemplateConfig
}

export type TemplateQuoteRequest = {
  templateId: string
  templateVersion: string
  inputAssetIds: string[]
  outputSettings: OutputSettings
}

export type TemplateQuoteDto = {
  templateId: string
  pricingVersion: string
  estimatedCredits: number
  available: boolean
  unavailableReason?: string
}

export type AssetDto = {
  id: string
  name: string
  type: string
  kind: AssetKind
  image: string
  expiresAt?: string
  expiresLabel: string
  status: AssetStatus
  source: string
}

export type AssetCategoryDto = {
  id: string
  name: string
  scope: 'system' | 'user'
  assetCount: number
  createdAt: string
}

export type CreateUploadRequest = {
  fileName: string
  contentType: string
  size: number
  source: string
  idempotencyKey: string
}

export type UploadReceiptDto = {
  id: string
  fileName: string
  status: UploadReceiptStatus
  progress: number
  source: string
  message: string
  assetId?: string
  uploadUrl?: string
}

export type UpdateAssetRequest = {
  name?: string
  type?: string
}

export type DownloadUrlDto = {
  url: string
  expiresAt: string
}

export type CreateGenerationTaskRequest = {
  templateId: string
  templateVersion: string
  pricingVersion: string
  workflowType: TemplateWorkflowType
  inputAssetIds: string[]
  outputSettings: OutputSettings
  idempotencyKey: string
}

export type GenerationTaskDto = {
  id: string
  title: string
  status: TaskStatus
  progress: number
  cost: number
  updatedAt: string
  image: string
  params: CreateGenerationTaskRequest
  failure?: TaskFailure
  ledgerIds: string[]
  providerAttemptIds: string[]
  renderAttemptIds: string[]
  moderationRecordIds: string[]
  outputAssetId?: string
}

export type CreditSummaryDto = {
  balance: number
  frozenCredits: number
}

export type LedgerRowDto = {
  id: string
  title: string
  amount: string
  source: string
  kind: LedgerKind
  status: LedgerStatus
  refId: string
  createdAt: string
  note: string
  idempotencyKey: string
}

export type PaymentOrderDto = {
  id: string
  packageName: string
  amount: string
  credits: number
  status: PaymentOrderStatus
  channel: string
  createdAt: string
  expiresAt: string
  note: string
}

export type CreatePaymentOrderRequest = {
  packageName: string
  channel: string
  idempotencyKey: string
}

export type AigcApiClient = {
  auth: {
    getSession: () => Promise<ApiResult<SessionDto>>
    createQrSession: (provider: string) => Promise<ApiResult<QrLoginSessionDto>>
    getQrSession: (sessionId: string) => Promise<ApiResult<QrLoginSessionDto>>
    claimSignupReward: (idempotencyKey: string) => Promise<ApiResult<SignupRewardDto>>
    listRewardCampaigns: () => Promise<ApiResult<RewardCampaignDto[]>>
    claimRewardCampaign: (campaignId: string, idempotencyKey: string) => Promise<ApiResult<RewardCampaignDto>>
  }
  templates: {
    list: () => Promise<ApiResult<TemplateDto[]>>
    get: (templateId: string) => Promise<ApiResult<TemplateDto>>
    quote: (request: TemplateQuoteRequest) => Promise<ApiResult<TemplateQuoteDto>>
  }
  assets: {
    list: (params?: { status?: AssetStatus; type?: string; kind?: AssetKind }) => Promise<ApiResult<AssetDto[]>>
    listCategories: () => Promise<ApiResult<AssetCategoryDto[]>>
    createCategory: (name: string, idempotencyKey: string) => Promise<ApiResult<AssetCategoryDto>>
    deleteCategory: (categoryId: string) => Promise<ApiResult<{ movedAssetCount: number }>>
    createUpload: (request: CreateUploadRequest) => Promise<ApiResult<UploadReceiptDto>>
    completeUpload: (uploadId: string) => Promise<ApiResult<UploadReceiptDto>>
    cancelUpload: (uploadId: string) => Promise<ApiResult<UploadReceiptDto>>
    update: (assetId: string, request: UpdateAssetRequest) => Promise<ApiResult<AssetDto>>
    archive: (assetId: string) => Promise<ApiResult<AssetDto>>
    restore: (assetId: string) => Promise<ApiResult<AssetDto>>
    createDownloadUrl: (assetId: string) => Promise<ApiResult<DownloadUrlDto>>
  }
  generationTasks: {
    create: (request: CreateGenerationTaskRequest) => Promise<ApiResult<GenerationTaskDto>>
    list: () => Promise<ApiResult<GenerationTaskDto[]>>
    get: (taskId: string) => Promise<ApiResult<GenerationTaskDto>>
    cancel: (taskId: string, idempotencyKey: string) => Promise<ApiResult<GenerationTaskDto>>
    retry: (taskId: string, idempotencyKey: string) => Promise<ApiResult<GenerationTaskDto>>
  }
  credits: {
    summary: () => Promise<ApiResult<CreditSummaryDto>>
    ledger: () => Promise<ApiResult<LedgerRowDto[]>>
    packages: () => Promise<ApiResult<RechargePackage[]>>
  }
  payments: {
    createOrder: (request: CreatePaymentOrderRequest) => Promise<ApiResult<PaymentOrderDto>>
    getOrder: (orderId: string) => Promise<ApiResult<PaymentOrderDto>>
    cancelOrder: (orderId: string, idempotencyKey: string) => Promise<ApiResult<PaymentOrderDto>>
  }
}
