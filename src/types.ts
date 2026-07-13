export type ViewId = 'home' | 'workbench' | 'templates' | 'works'
export type CreationStage = 'choose' | 'edit'
export type WorksSection = 'generations' | 'assets'
export type AccountSection = 'profile' | 'security' | 'notifications' | 'help'
export type OverlayType =
  | 'template'
  | 'templatePicker'
  | 'task'
  | 'credits'
  | 'account'
  | 'filters'
  | 'lightbox'
  | 'auth'
  | 'assetPicker'
  | null
export type TaskStatus = 'queued' | 'running' | 'rendering' | 'review' | 'success' | 'refunded'
export type AuthMode = 'login' | 'register'
export type OutputSettingKey = 'ratio' | 'duration' | 'resolution' | 'quality'
export type AssetKind = 'image' | 'video' | 'portrait' | 'poster' | 'logo'
export type AssetStatus = 'library' | 'archived'
export type AssetFilter = string
export type LedgerKind = 'freeze' | 'settlement' | 'release' | 'recharge' | 'reward'
export type LedgerStatus = 'frozen' | 'settled' | 'released' | 'credited' | 'granted'
export type TaskFailureReason = 'provider_error' | 'timeout' | 'moderation_block' | 'asset_invalid'
export type TaskFailureStage = 'input' | 'provider' | 'render' | 'moderation'
export type PaymentOrderStatus = 'idle' | 'pending' | 'paid' | 'failed' | 'cancelled' | 'expired'
export type SignupRewardStatus = 'eligible' | 'granted' | 'claimed' | 'risk_blocked'
export type RiskCheckStatus = 'pass' | 'review' | 'blocked'
export type UploadReceiptStatus = 'idle' | 'validating' | 'uploading' | 'saved' | 'failed' | 'cancelled' | 'rejected'
export type QrLoginStatus = 'waiting' | 'scanned' | 'confirmed' | 'expired' | 'rejected'
export type TemplateWorkflowType = 'image-to-video' | 'portrait-to-video' | 'video-remix'
export type TemplateCapability =
  | 'image-to-video'
  | 'portrait-reference'
  | 'video-editing'
  | 'composition-render'
  | 'moderation'
  | 'asset-persist'

export type TemplateInputField = {
  id: string
  label: string
  required: boolean
  acceptedKinds: AssetKind[]
  maxCount: number
  binding: 'imageId' | 'videoId' | 'portraitId'
  help: string
}

export type TemplateConfig = {
  version: string
  workflowType: TemplateWorkflowType
  workflowLabel: string
  pricingVersion: string
  pricingMode: 'fixed' | 'dynamic'
  settlement: 'freeze_then_settle'
  inputFields: TemplateInputField[]
  outputFields: OutputSettingKey[]
  userEditableOutputFields?: OutputSettingKey[]
  capabilities: TemplateCapability[]
  traceFields: string[]
}

export type OutputSettings = {
  ratio: string
  duration: string
  resolution: string
  quality: string
}

export type Template = {
  id: string
  title: string
  category: string
  scenario: string
  image: string
  videoSrc?: string
  cost: number
  duration: string
  ratio: string
  accent: string
  tags: string[]
  description: string
  config: TemplateConfig
}

export type Task = {
  id: string
  title: string
  status: TaskStatus
  progress: number
  cost: number
  updated: string
  image: string
  videoSrc?: string
  failure?: TaskFailure
  params?: OutputSettings & {
    templateId: string
    templateVersion: string
    pricingVersion: string
    workflowType: TemplateWorkflowType
    imageId: string
    idempotencyKey: string
  }
}

export type TaskFailure = {
  reason: TaskFailureReason
  stage: TaskFailureStage
  code: string
  retryable: boolean
  message: string
}

export type Asset = {
  id: string
  name: string
  type: string
  kind: AssetKind
  image: string
  videoSrc?: string
  expires: string
  status: AssetStatus
  source: string
}

export type SessionState = {
  authenticated: boolean
  user?: {
    id: string
    displayName: string
    avatarUrl?: string
    phoneMasked?: string
  }
}

export type LedgerRow = {
  id: string
  title: string
  amount: string
  source: string
  kind: LedgerKind
  status: LedgerStatus
  refId: string
  time: string
  note: string
}

export type ToastState = {
  title: string
  text: string
} | null

export type PreviewMedia = {
  title: string
  image: string
  kind: 'image' | 'video'
  videoSrc?: string
}

export type PaymentOrder = {
  id: string
  packageId: string
  packageName: string
  amountMinor: number
  currency: 'CNY'
  amount: string
  credits: number
  status: PaymentOrderStatus
  channel: string
  createdAt: string
  expiresIn: string
  note: string
}

export type SignupRiskCheck = {
  id: string
  label: string
  status: RiskCheckStatus
  value: string
  note: string
}

export type UploadReceipt = {
  id: string
  fileName: string
  status: UploadReceiptStatus
  progress: number
  source: string
  message: string
}

export type QrLoginSession = {
  id: string
  provider: string
  status: QrLoginStatus
  expiresIn: string
  note: string
}

export type RechargePackage = {
  id: string
  name: string
  amountMinor: number
  currency: 'CNY'
  price: string
  credits: number
  bonus: string
}

export type FilterGroup = {
  title: string
  items: string[]
}

export type OutputOptionGroup = {
  key: OutputSettingKey
  label: string
  options: string[]
  hint: string
}
