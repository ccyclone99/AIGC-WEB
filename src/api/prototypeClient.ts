import {
  baseAssetFilters,
  customAssetFilterSeed,
  initialAssets,
  initialLedgerRows,
  initialPaymentOrder,
  initialQrLoginSession,
  initialTasks,
  initialUploadReceipt,
  rechargePackages,
  signupRiskChecks,
  templates,
} from '../prototypeData'
import type { Asset, LedgerRow, PaymentOrder, QrLoginSession, Task, Template, UploadReceipt } from '../types'
import type {
  AigcApiClient,
  ApiResult,
  AssetCategoryDto,
  AssetDto,
  CreateGenerationTaskRequest,
  CreatePaymentOrderRequest,
  CreateUploadRequest,
  GenerationTaskDto,
  LedgerRowDto,
  PaymentOrderDto,
  QrLoginSessionDto,
  RewardCampaignDto,
  SessionDto,
  SignupRewardDto,
  TemplateDto,
  TemplateQuoteRequest,
  UploadReceiptDto,
} from './contracts'

const traceId = 'prototype-client'

export function createPrototypeAigcApiClient(): AigcApiClient {
  return {
    auth: {
      getSession: async () =>
        ok<SessionDto>({
          authenticated: false,
          creditBalance: 1280,
          frozenCredits: 138,
        }),
      createQrSession: async (provider) =>
        ok<QrLoginSessionDto>(toQrDto({ ...initialQrLoginSession, id: `QR-${Date.now()}`, provider })),
      getQrSession: async () => ok<QrLoginSessionDto>(toQrDto(initialQrLoginSession)),
      claimSignupReward: async () =>
        ok<SignupRewardDto>({
          status: 'granted',
          rewardCredits: 300,
          ledgerId: 'L-SIGNUP-PROTOTYPE',
          riskChecks: signupRiskChecks,
        }),
      listRewardCampaigns: async () => ok<RewardCampaignDto[]>([signupCampaign()]),
      claimRewardCampaign: async (campaignId) =>
        campaignId === 'CAMPAIGN-SIGNUP'
          ? ok<RewardCampaignDto>({ ...signupCampaign(), status: 'claimed', claimedCount: 1 })
          : notFound('活动不存在'),
    },
    templates: {
      list: async () => ok<TemplateDto[]>(templates.map(toTemplateDto)),
      get: async (templateId) => {
        const template = templates.find((item) => item.id === templateId)
        return template ? ok<TemplateDto>(toTemplateDto(template)) : notFound('模板不存在')
      },
      quote: async (request: TemplateQuoteRequest) => {
        const template = templates.find((item) => item.id === request.templateId)
        return template
          ? ok({
              templateId: template.id,
              pricingVersion: template.config.pricingVersion,
              estimatedCredits: template.cost,
              available: true,
            })
          : notFound('模板不存在')
      },
    },
    assets: {
      list: async (params) => {
        const assets = initialAssets
          .filter((asset) => (params?.status ? asset.status === params.status : true))
          .filter((asset) => (params?.type ? asset.type === params.type : true))
          .filter((asset) => (params?.kind ? asset.kind === params.kind : true))
          .map(toAssetDto)
        return ok<AssetDto[]>(assets)
      },
      listCategories: async () => ok<AssetCategoryDto[]>(assetCategories()),
      createCategory: async (name) =>
        ok<AssetCategoryDto>({
          id: `CAT-${name.trim()}`,
          name: name.trim(),
          scope: 'user',
          assetCount: 0,
          createdAt: nowIso(),
        }),
      deleteCategory: async () => ok({ movedAssetCount: 0 }),
      createUpload: async (request: CreateUploadRequest) =>
        ok<UploadReceiptDto>({
          id: `UP-${Date.now()}`,
          fileName: request.fileName,
          status: 'validating',
          progress: 18,
          source: request.source,
          message: '正在校验文件格式、大小和资产入库参数。',
          uploadUrl: `/prototype-upload/${request.idempotencyKey}`,
        }),
      completeUpload: async (uploadId) =>
        ok<UploadReceiptDto>({
          ...toUploadReceiptDto(initialUploadReceipt),
          id: uploadId,
          status: 'saved',
          progress: 100,
          assetId: initialAssets[0].id,
          message: '图片已保存为资产，可直接用于生成任务。',
        }),
      cancelUpload: async (uploadId) =>
        ok<UploadReceiptDto>({
          ...toUploadReceiptDto(initialUploadReceipt),
          id: uploadId,
          status: 'cancelled',
          progress: 0,
          message: '上传流程已取消，未创建新的资产记录。',
        }),
      update: async (assetId, request) => {
        const asset = initialAssets.find((item) => item.id === assetId)
        return asset ? ok<AssetDto>(toAssetDto({ ...asset, ...request })) : notFound('资产不存在')
      },
      archive: async (assetId) => updateAssetStatus(assetId, 'archived'),
      restore: async (assetId) => updateAssetStatus(assetId, 'library'),
      createDownloadUrl: async (assetId) =>
        initialAssets.some((asset) => asset.id === assetId)
          ? ok({ url: `/prototype-download/${assetId}`, expiresAt: minutesFromNow(15) })
          : notFound('资产不存在'),
    },
    generationTasks: {
      create: async (request: CreateGenerationTaskRequest) =>
        ok<GenerationTaskDto>(
          toTaskDto({
            id: `T-PROTOTYPE-${Date.now()}`,
            title: `${request.templateId} 生成任务`,
            status: 'queued',
            progress: 8,
            cost: templates.find((template) => template.id === request.templateId)?.cost ?? 0,
            updated: '刚刚',
            image: initialAssets[0]?.image ?? templates[0].image,
            params: {
              ...request.outputSettings,
              templateId: request.templateId,
              templateVersion: request.templateVersion,
              pricingVersion: request.pricingVersion,
              workflowType: request.workflowType,
              imageId: request.inputAssetIds[0] ?? '',
              idempotencyKey: request.idempotencyKey,
            },
          }),
        ),
      list: async () => ok<GenerationTaskDto[]>(initialTasks.map(toTaskDto)),
      get: async (taskId) => {
        const task = initialTasks.find((item) => item.id === taskId)
        return task ? ok<GenerationTaskDto>(toTaskDto(task)) : notFound('任务不存在')
      },
      cancel: async (taskId) => taskAction(taskId, 'refunded'),
      retry: async (taskId) => taskAction(taskId, 'queued'),
    },
    credits: {
      summary: async () => ok({ balance: 1280, frozenCredits: 138 }),
      ledger: async () => ok<LedgerRowDto[]>(initialLedgerRows.map(toLedgerDto)),
      packages: async () => ok(rechargePackages),
    },
    payments: {
      createOrder: async (request: CreatePaymentOrderRequest) => {
        const pack = rechargePackages.find((item) => item.name === request.packageName) ?? rechargePackages[0]
        return ok<PaymentOrderDto>(
          toPaymentOrderDto({
            ...initialPaymentOrder,
            id: `PAY-${Date.now()}`,
            packageName: pack.name,
            amount: pack.price,
            credits: pack.credits,
            channel: request.channel,
            status: 'pending',
            createdAt: '刚刚',
          }),
        )
      },
      getOrder: async () => ok<PaymentOrderDto>(toPaymentOrderDto(initialPaymentOrder)),
      cancelOrder: async (orderId) =>
        ok<PaymentOrderDto>(toPaymentOrderDto({ ...initialPaymentOrder, id: orderId, status: 'cancelled' })),
    },
  }
}

function ok<T>(data: T): ApiResult<T> {
  return { ok: true, data, traceId }
}

function notFound<T>(message: string): ApiResult<T> {
  return {
    ok: false,
    error: {
      code: 'PROTOTYPE_NOT_FOUND',
      message,
      traceId,
    },
  }
}

function toTemplateDto(template: Template): TemplateDto {
  return { ...template, publicationStatus: 'published' }
}

function toAssetDto(asset: Asset): AssetDto {
  return {
    id: asset.id,
    name: asset.name,
    type: asset.type,
    kind: asset.kind,
    image: asset.image,
    videoSrc: asset.videoSrc,
    expiresLabel: asset.expires,
    status: asset.status,
    source: asset.source,
  }
}

function toUploadReceiptDto(receipt: UploadReceipt): UploadReceiptDto {
  return { ...receipt }
}

function toQrDto(session: QrLoginSession): QrLoginSessionDto {
  return {
    id: session.id,
    provider: session.provider,
    status: session.status,
    expiresAt: minutesFromNow(2),
    note: session.note,
  }
}

function toTaskDto(task: Task): GenerationTaskDto {
  const outputSettings = {
    ratio: task.params?.ratio ?? '9:16',
    duration: task.params?.duration ?? '8s',
    resolution: task.params?.resolution ?? '1080p',
    quality: task.params?.quality ?? '高清',
  }

  return {
    id: task.id,
    title: task.title,
    status: task.status,
    progress: task.progress,
    cost: task.cost,
    updatedAt: nowIso(),
    image: task.image,
    videoSrc: task.videoSrc,
    params: {
      templateId: task.params?.templateId ?? 'unknown-template',
      templateVersion: task.params?.templateVersion ?? 'unknown@v1',
      pricingVersion: task.params?.pricingVersion ?? 'P-2026-06',
      workflowType: task.params?.workflowType ?? 'image-to-video',
      inputAssetIds: task.params?.imageId ? [task.params.imageId] : [],
      outputSettings,
      idempotencyKey: task.params?.idempotencyKey ?? `prototype:${task.id}`,
    },
    failure: task.failure,
    ledgerIds: initialLedgerRows.filter((row) => row.refId === task.id).map((row) => row.id),
    providerAttemptIds: [`PA-${task.id}`],
    renderAttemptIds: [`RA-${task.id}`],
    moderationRecordIds: [`MR-${task.id}`],
    outputAssetId: task.status === 'success' ? `A-OUT-${task.id}` : undefined,
  }
}

function toLedgerDto(row: LedgerRow): LedgerRowDto {
  return {
    id: row.id,
    title: row.title,
    amount: row.amount,
    source: row.source,
    kind: row.kind,
    status: row.status,
    refId: row.refId,
    createdAt: nowIso(),
    note: row.note,
    idempotencyKey: `ledger:${row.id}`,
  }
}

function toPaymentOrderDto(order: PaymentOrder): PaymentOrderDto {
  return {
    id: order.id,
    packageName: order.packageName,
    amount: order.amount,
    credits: order.credits,
    status: order.status,
    channel: order.channel,
    createdAt: nowIso(),
    expiresAt: minutesFromNow(15),
    note: order.note,
  }
}

function assetCategories(): AssetCategoryDto[] {
  const categoryNames = [...baseAssetFilters, ...customAssetFilterSeed].filter(
    (name) => !['全部', '即将过期', '已归档'].includes(name),
  )

  return categoryNames.map((name) => ({
    id: `CAT-${name}`,
    name,
    scope: customAssetFilterSeed.includes(name) ? 'user' : 'system',
    assetCount: initialAssets.filter((asset) => asset.type === name).length,
    createdAt: nowIso(),
  }))
}

function signupCampaign(): RewardCampaignDto {
  return {
    id: 'CAMPAIGN-SIGNUP',
    title: '新用户注册赠送',
    status: 'available',
    rewardCredits: 300,
    startsAt: nowIso(),
    claimLimit: 1,
    claimedCount: 0,
    riskChecks: signupRiskChecks,
  }
}

function updateAssetStatus(assetId: string, status: Asset['status']) {
  const asset = initialAssets.find((item) => item.id === assetId)
  return asset ? ok<AssetDto>(toAssetDto({ ...asset, status })) : notFound<AssetDto>('资产不存在')
}

function taskAction(taskId: string, status: Task['status']) {
  const task = initialTasks.find((item) => item.id === taskId)
  return task ? ok<GenerationTaskDto>(toTaskDto({ ...task, status })) : notFound<GenerationTaskDto>('任务不存在')
}

function nowIso() {
  return new Date().toISOString()
}

function minutesFromNow(minutes: number) {
  return new Date(Date.now() + minutes * 60_000).toISOString()
}
