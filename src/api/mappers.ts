import type {
  Asset,
  LedgerRow,
  PaymentOrder,
  QrLoginSession,
  Task,
  Template,
  UploadReceipt,
} from '../types'
import type {
  AssetDto,
  GenerationTaskDto,
  LedgerRowDto,
  PaymentOrderDto,
  QrLoginSessionDto,
  TemplateDto,
  UploadReceiptDto,
} from './contracts'

export function mapTemplateDto(dto: TemplateDto): Template {
  const { publicationStatus: _publicationStatus, ...template } = dto
  return template
}

export function mapAssetDto(dto: AssetDto): Asset {
  return {
    id: dto.id,
    name: dto.name,
    type: dto.type,
    kind: dto.kind,
    image: dto.image,
    videoSrc: dto.videoSrc,
    expires: dto.expiresLabel || formatExpiryLabel(dto.expiresAt),
    status: dto.status,
    source: dto.source,
  }
}

export function mapUploadReceiptDto(dto: UploadReceiptDto): UploadReceipt {
  return {
    id: dto.id,
    fileName: dto.fileName,
    status: dto.status,
    progress: dto.progress,
    source: dto.source,
    message: dto.message,
  }
}

export function mapQrLoginSessionDto(dto: QrLoginSessionDto): QrLoginSession {
  return {
    id: dto.id,
    provider: dto.provider,
    status: dto.status,
    expiresIn: formatCountdown(dto.expiresAt),
    note: dto.note,
  }
}

export function mapGenerationTaskDto(dto: GenerationTaskDto): Task {
  return {
    id: dto.id,
    title: dto.title,
    status: dto.status,
    progress: dto.progress,
    cost: dto.cost,
    updated: formatRelativeTime(dto.updatedAt),
    image: dto.image,
    videoSrc: dto.videoSrc,
    failure: dto.failure,
    params: {
      ...dto.params.outputSettings,
      templateId: dto.params.templateId,
      templateVersion: dto.params.templateVersion,
      pricingVersion: dto.params.pricingVersion,
      workflowType: dto.params.workflowType,
      imageId: dto.params.inputAssetIds[0] ?? '',
      idempotencyKey: dto.params.idempotencyKey,
    },
  }
}

export function mapLedgerRowDto(dto: LedgerRowDto): LedgerRow {
  return {
    id: dto.id,
    title: dto.title,
    amount: dto.amount,
    source: dto.source,
    kind: dto.kind,
    status: dto.status,
    refId: dto.refId,
    time: formatRelativeTime(dto.createdAt),
    note: dto.note,
  }
}

export function mapPaymentOrderDto(dto: PaymentOrderDto): PaymentOrder {
  return {
    id: dto.id,
    packageId: dto.packageId,
    packageName: dto.packageName,
    amountMinor: dto.amountMinor,
    currency: dto.currency,
    amount: dto.amount,
    credits: dto.credits,
    status: dto.status,
    channel: dto.channel,
    createdAt: formatRelativeTime(dto.createdAt),
    expiresIn: formatCountdown(dto.expiresAt),
    note: dto.note,
  }
}

export function formatRelativeTime(value: string) {
  const date = new Date(value)
  if (Number.isNaN(date.getTime())) return value

  const diffMs = Date.now() - date.getTime()
  if (diffMs < 60_000) return '刚刚'
  if (diffMs < 60 * 60_000) return `${Math.floor(diffMs / 60_000)} 分钟前`
  if (diffMs < 24 * 60 * 60_000) return `${Math.floor(diffMs / (60 * 60_000))} 小时前`
  if (diffMs < 30 * 24 * 60 * 60_000) return `${Math.floor(diffMs / (24 * 60 * 60_000))} 天前`

  return date.toLocaleDateString('zh-CN')
}

export function formatCountdown(value?: string) {
  if (!value) return '永久保存'

  const date = new Date(value)
  if (Number.isNaN(date.getTime())) return value

  const remainingMs = date.getTime() - Date.now()
  if (remainingMs <= 0) return '已过期'

  const remainingMinutes = Math.ceil(remainingMs / 60_000)
  if (remainingMinutes < 60) return `${String(remainingMinutes).padStart(2, '0')}:00`

  const remainingHours = Math.ceil(remainingMs / (60 * 60_000))
  if (remainingHours < 24) return `${remainingHours} 小时后过期`

  return `${Math.ceil(remainingMs / (24 * 60 * 60_000))} 天后过期`
}

function formatExpiryLabel(value?: string) {
  if (!value) return '永久保存'
  return formatCountdown(value)
}
