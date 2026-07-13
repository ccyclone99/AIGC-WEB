import type {
  Asset,
  AssetFilter,
  FilterGroup,
  LedgerRow,
  OutputOptionGroup,
  PaymentOrder,
  QrLoginSession,
  RechargePackage,
  SignupRiskCheck,
  Task,
  TaskStatus,
  Template,
  TemplateCapability,
  TemplateConfig,
  TemplateInputField,
  TemplateWorkflowType,
  UploadReceipt,
} from './types'

export const videoPreviewSrc = 'https://interactive-examples.mdn.mozilla.net/media/cc0-videos/flower.mp4'

export const templateTraceFields = [
  'taskId',
  'templateId',
  'templateVersion',
  'pricingVersion',
  'workflowType',
  'inputAssetIds',
  'outputSettings',
  'creditLedgerIds',
  'providerAttemptIds',
  'renderAttemptIds',
  'moderationRecordIds',
]

const createTemplateConfig = ({
  templateId,
  workflowType,
  workflowLabel,
  inputFields,
  capabilities,
}: {
  templateId: string
  workflowType: TemplateWorkflowType
  workflowLabel: string
  inputFields: TemplateInputField[]
  capabilities: TemplateCapability[]
}): TemplateConfig => ({
  version: `${templateId}@v1`,
  workflowType,
  workflowLabel,
  pricingVersion: 'P-2026-06',
  pricingMode: 'fixed',
  settlement: 'freeze_then_settle',
  inputFields,
  outputFields: ['ratio', 'duration', 'resolution', 'quality'],
  userEditableOutputFields: [],
  capabilities,
  traceFields: templateTraceFields,
})

const productImageInput: TemplateInputField = {
  id: 'productImage',
  label: '商品图',
  required: true,
  acceptedKinds: ['image'],
  maxCount: 1,
  binding: 'imageId',
  help: '第一版只需要一张图片，后端提交时保存为 inputAssetIds。',
}

const portraitInput: TemplateInputField = {
  id: 'portraitImage',
  label: '人像照片',
  required: true,
  acceptedKinds: ['portrait'],
  maxCount: 1,
  binding: 'portraitId',
  help: '需要保留授权和同意记录，后端提交时关联 consent record。',
}

const sourceVideoInput: TemplateInputField = {
  id: 'sourceVideo',
  label: '视频素材',
  required: true,
  acceptedKinds: ['video'],
  maxCount: 1,
  binding: 'videoId',
  help: '视频模板会进入独立制作台，当前仅开放模板预览。',
}

const templateSeeds: Array<Omit<Template, 'example'>> = [
  {
    id: 'watch',
    title: '精品表款 8 秒转场',
    category: '商品展示',
    scenario: '高客单商品',
    image:
      'https://images.unsplash.com/photo-1523275335684-37898b6baf30?auto=format&fit=crop&w=900&q=80',
    cost: 168,
    duration: '8s',
    ratio: '9:16',
    accent: '#d54f38',
    tags: ['主图', '质感', '礼赠'],
    description: '适合手表、香氛、礼盒和小家电，强调材质、光影和镜头节奏。',
    config: createTemplateConfig({
      templateId: 'watch',
      workflowType: 'image-to-video',
      workflowLabel: '图片生成视频',
      inputFields: [productImageInput],
      capabilities: ['image-to-video', 'composition-render', 'moderation', 'asset-persist'],
    }),
  },
  {
    id: 'sneaker',
    title: '潮鞋爆款节奏',
    category: '投放短视频',
    scenario: '鞋服新品推广',
    image:
      'https://images.unsplash.com/photo-1542291026-7eec264c27ff?auto=format&fit=crop&w=900&q=80',
    cost: 138,
    duration: '6s',
    ratio: '1:1',
    accent: '#0f9d7a',
    tags: ['抖音', '快节奏', '字幕'],
    description: '用快速切换、字幕节奏和平台比例生成适合投放的商品短视频。',
    config: createTemplateConfig({
      templateId: 'sneaker',
      workflowType: 'image-to-video',
      workflowLabel: '图片生成视频',
      inputFields: [productImageInput],
      capabilities: ['image-to-video', 'composition-render', 'moderation', 'asset-persist'],
    }),
  },
  {
    id: 'beauty',
    title: '美妆成分展示',
    category: '商品展示',
    scenario: '小红书种草',
    image:
      'https://images.unsplash.com/photo-1522335789203-aabd1fc54bc9?auto=format&fit=crop&w=900&q=80',
    cost: 198,
    duration: '10s',
    ratio: '4:5',
    accent: '#6f55d9',
    tags: ['小红书', '柔光', '成分'],
    description: '适合护肤、美妆和香氛，将成分、功效、场景感封装进模板。',
    config: createTemplateConfig({
      templateId: 'beauty',
      workflowType: 'image-to-video',
      workflowLabel: '图片生成视频',
      inputFields: [productImageInput],
      capabilities: ['image-to-video', 'composition-render', 'moderation', 'asset-persist'],
    }),
  },
  {
    id: 'portrait',
    title: '都市写真换装',
    category: '人像写真',
    scenario: '写真/变装',
    image:
      'https://images.unsplash.com/photo-1496747611176-843222e1e57c?auto=format&fit=crop&w=900&q=80',
    cost: 228,
    duration: '8s',
    ratio: '9:16',
    accent: '#c08a22',
    tags: ['人像', '换装', '授权'],
    description: '上传人像照片，选择服装和风格方向，生成写真感短视频。',
    config: createTemplateConfig({
      templateId: 'portrait',
      workflowType: 'portrait-to-video',
      workflowLabel: '人像生成视频',
      inputFields: [portraitInput],
      capabilities: ['portrait-reference', 'image-to-video', 'moderation', 'asset-persist'],
    }),
  },
  {
    id: 'bag',
    title: '包袋细节巡游',
    category: '商品展示',
    scenario: '详情页增强',
    image:
      'https://images.unsplash.com/photo-1547949003-9792a18a2601?auto=format&fit=crop&w=900&q=80',
    cost: 176,
    duration: '9s',
    ratio: '4:5',
    accent: '#3157a4',
    tags: ['详情页', '局部', '高级'],
    description: '围绕材质、五金、容量和细节生成适合详情页的商品展示视频。',
    config: createTemplateConfig({
      templateId: 'bag',
      workflowType: 'image-to-video',
      workflowLabel: '图片生成视频',
      inputFields: [productImageInput],
      capabilities: ['image-to-video', 'composition-render', 'moderation', 'asset-persist'],
    }),
  },
  {
    id: 'coffee',
    title: '食品饮品氛围片',
    category: '投放短视频',
    scenario: '生活方式',
    image:
      'https://images.unsplash.com/photo-1514432324607-a09d9b4aefdd?auto=format&fit=crop&w=900&q=80',
    cost: 156,
    duration: '7s',
    ratio: '9:16',
    accent: '#8b5a2b',
    tags: ['食品', '氛围', '转场'],
    description: '给食品、咖啡、茶饮类商品增加场景氛围和轻量字幕包装。',
    config: createTemplateConfig({
      templateId: 'coffee',
      workflowType: 'image-to-video',
      workflowLabel: '图片生成视频',
      inputFields: [productImageInput],
      capabilities: ['image-to-video', 'composition-render', 'moderation', 'asset-persist'],
    }),
  },
  {
    id: 'video-polish',
    title: '已有视频投放翻新',
    category: '视频二创',
    scenario: '素材二创',
    image:
      'https://images.unsplash.com/photo-1492619375914-88005aa9e8fb?auto=format&fit=crop&w=900&q=80',
    videoSrc: videoPreviewSrc,
    cost: 188,
    duration: '12s',
    ratio: '9:16',
    accent: '#2f6f73',
    tags: ['视频输入', '投放', '字幕'],
    description: '上传已有商品视频，自动重排节奏、补字幕、加卖点卡点，生成适合投放的新版本。',
    config: createTemplateConfig({
      templateId: 'video-polish',
      workflowType: 'video-remix',
      workflowLabel: '视频二创包装',
      inputFields: [sourceVideoInput],
      capabilities: ['video-editing', 'composition-render', 'moderation', 'asset-persist'],
    }),
  },
  {
    id: 'talking-cut',
    title: '口播视频切片包装',
    category: '视频二创',
    scenario: '达人/直播切片',
    image:
      'https://images.unsplash.com/photo-1590602847861-f357a9332bbc?auto=format&fit=crop&w=900&q=80',
    videoSrc: videoPreviewSrc,
    cost: 166,
    duration: '15s',
    ratio: '9:16',
    accent: '#b35b7b',
    tags: ['口播', '字幕', '切片'],
    description: '上传口播或直播片段，自动提炼高光、生成字幕和标题包装，适合达人种草内容。',
    config: createTemplateConfig({
      templateId: 'talking-cut',
      workflowType: 'video-remix',
      workflowLabel: '视频二创包装',
      inputFields: [sourceVideoInput],
      capabilities: ['video-editing', 'composition-render', 'moderation', 'asset-persist'],
    }),
  },
  {
    id: 'video-product-card',
    title: '视频素材商品卡包装',
    category: '视频二创',
    scenario: '详情页/投流',
    image:
      'https://images.unsplash.com/photo-1516321318423-f06f85e504b3?auto=format&fit=crop&w=900&q=80',
    videoSrc: videoPreviewSrc,
    cost: 178,
    duration: '10s',
    ratio: '4:5',
    accent: '#5867a8',
    tags: ['视频输入', '商品卡', '后期'],
    description: '上传一段商品实拍视频，模板自动增加商品信息卡、价格位、字幕和转场包装。',
    config: createTemplateConfig({
      templateId: 'video-product-card',
      workflowType: 'video-remix',
      workflowLabel: '视频二创包装',
      inputFields: [sourceVideoInput],
      capabilities: ['video-editing', 'composition-render', 'moderation', 'asset-persist'],
    }),
  },
]

export const templates: Template[] = templateSeeds.map((template) => {
  const inputIsVideo = template.config.workflowType === 'video-remix'

  return {
    ...template,
    example: {
      input: {
        label: inputIsVideo ? '示例原视频' : '示例上传图片',
        kind: inputIsVideo ? 'video' : 'image',
        image: template.image,
        videoSrc: inputIsVideo ? template.videoSrc : undefined,
      },
      output: {
        label: '模板完成效果',
        kind: 'video',
        image: template.image,
        videoSrc: videoPreviewSrc,
      },
    },
  }
})

export const initialTasks: Task[] = [
  {
    id: 'T-240625-019',
    title: '潮鞋爆款节奏',
    templateTitle: '潮鞋爆款节奏',
    status: 'rendering',
    progress: 72,
    cost: 138,
    updated: '2 分钟前',
    createdAt: '2026-07-13T18:36:00+08:00',
    sourceAssetName: '红色运动鞋主图.jpg',
    image: templates[1].image,
    params: {
      templateId: 'sneaker',
      templateVersion: 'sneaker@v1',
      pricingVersion: 'P-2026-06',
      workflowType: 'image-to-video',
      imageId: 'A-SNEAKER-MAIN',
      idempotencyKey: 'gen:sneaker@v1:A-SNEAKER-MAIN:1-1:6s:1080p:hd',
      ratio: '1:1',
      duration: '6s',
      resolution: '1080p',
      quality: '高清',
    },
  },
  {
    id: 'T-240625-018',
    title: '精品表款 8 秒转场',
    templateTitle: '精品表款 8 秒转场',
    status: 'success',
    progress: 100,
    cost: 168,
    updated: '18 分钟前',
    createdAt: '2026-07-13T18:12:00+08:00',
    completedAt: '2026-07-13T18:20:00+08:00',
    sourceAssetName: '白色腕表主图.jpg',
    image: templates[0].image,
    videoSrc: videoPreviewSrc,
    output: {
      format: 'MP4',
      size: '18.6 MB',
      expiresAt: '2026-08-12T18:20:00+08:00',
      retentionLabel: '保存 30 天',
    },
    params: {
      templateId: 'watch',
      templateVersion: 'watch@v1',
      pricingVersion: 'P-2026-06',
      workflowType: 'image-to-video',
      imageId: 'A-WATCH-MAIN',
      idempotencyKey: 'gen:watch@v1:A-WATCH-MAIN:1-1:8s:1080p:hd',
      ratio: '9:16',
      duration: '8s',
      resolution: '1080p',
      quality: '高清',
    },
  },
  {
    id: 'T-240625-017',
    title: '美妆成分展示',
    templateTitle: '美妆成分展示',
    status: 'refunded',
    progress: 100,
    cost: 198,
    updated: '42 分钟前',
    createdAt: '2026-07-13T17:48:00+08:00',
    failedAt: '2026-07-13T17:56:00+08:00',
    sourceAssetName: '精华液主图.jpg',
    image: templates[2].image,
    failure: {
      reason: 'provider_error',
      stage: 'provider',
      code: 'PROVIDER_502_RETRY_EXHAUSTED',
      retryable: true,
      message: '生成服务暂时异常，积分已经退回。',
    },
    params: {
      templateId: 'beauty',
      templateVersion: 'beauty@v1',
      pricingVersion: 'P-2026-06',
      workflowType: 'image-to-video',
      imageId: 'A-BEAUTY-MAIN',
      idempotencyKey: 'gen:beauty@v1:A-BEAUTY-MAIN:4-5:10s:1080p:hd',
      ratio: '4:5',
      duration: '10s',
      resolution: '1080p',
      quality: '高清',
    },
  },
  {
    id: 'T-240625-016',
    title: '包袋细节巡游',
    templateTitle: '包袋细节巡游',
    status: 'refunded',
    progress: 100,
    cost: 176,
    updated: '1 小时前',
    createdAt: '2026-07-13T17:06:00+08:00',
    failedAt: '2026-07-13T17:14:00+08:00',
    sourceAssetName: '黑色通勤包主图.jpg',
    image: templates[4].image,
    failure: {
      reason: 'moderation_block',
      stage: 'moderation',
      code: 'MODERATION_RIGHTS_REVIEW_BLOCKED',
      retryable: false,
      message: '素材需要重新确认授权，积分已经退回。',
    },
    params: {
      templateId: 'bag',
      templateVersion: 'bag@v1',
      pricingVersion: 'P-2026-06',
      workflowType: 'image-to-video',
      imageId: 'A-BAG-MAIN',
      idempotencyKey: 'gen:bag@v1:A-BAG-MAIN:4-5:9s:1080p:hd',
      ratio: '4:5',
      duration: '9s',
      resolution: '1080p',
      quality: '高清',
    },
  },
  {
    id: 'T-240625-015',
    title: '精品表款 8 秒转场',
    templateTitle: '精品表款 8 秒转场',
    status: 'refunded',
    progress: 100,
    cost: 168,
    updated: '2 小时前',
    createdAt: '2026-07-13T16:12:00+08:00',
    failedAt: '2026-07-13T16:18:00+08:00',
    sourceAssetName: '腕表主图-模糊.jpg',
    image: templates[0].image,
    failure: {
      reason: 'asset_invalid',
      stage: 'input',
      code: 'INPUT_IMAGE_TOO_BLURRY',
      retryable: true,
      message: '图片清晰度不足，积分已经退回。',
    },
    params: {
      templateId: 'watch',
      templateVersion: 'watch@v1',
      pricingVersion: 'P-2026-06',
      workflowType: 'image-to-video',
      imageId: 'A-WATCH-BLURRY',
      idempotencyKey: 'gen:watch@v1:A-WATCH-BLURRY:9-16:8s:1080p:hd',
      ratio: '9:16',
      duration: '8s',
      resolution: '1080p',
      quality: '高清',
    },
  },
]

export const initialAssets: Asset[] = [
  {
    id: 'A-WATCH-MAIN',
    name: '白色腕表主图.jpg',
    type: '商品主图',
    kind: 'image',
    image: templates[0].image,
    expires: '永久保存',
    status: 'library',
    source: '用户上传',
  },
  {
    id: 'A-SNEAKER-OUTPUT',
    name: '潮鞋短视频.mp4',
    type: '生成视频',
    kind: 'video',
    image: templates[1].image,
    videoSrc: videoPreviewSrc,
    expires: '29 天后过期',
    status: 'library',
    source: '生成结果',
  },
  {
    id: 'A-PORTRAIT-REF',
    name: '海边人像参考.jpg',
    type: '人像素材',
    kind: 'portrait',
    image: templates[3].image,
    expires: '使用前确认肖像授权',
    status: 'library',
    source: '用户上传',
  },
]

export const initialLedgerRows: LedgerRow[] = [
  {
    id: 'L-240625-004',
    title: '潮鞋爆款节奏',
    amount: '-138',
    source: '生成预留',
    kind: 'freeze',
    status: 'frozen',
    refId: 'T-240625-019',
    time: '2 分钟前',
    note: '生成时暂时预留，未完成会自动退回。',
  },
  {
    id: 'L-240625-003',
    title: '精品表款 8 秒转场',
    amount: '-168',
    source: '视频生成',
    kind: 'settlement',
    status: 'settled',
    refId: 'T-240625-018',
    time: '18 分钟前',
    note: '视频已生成并保存到素材。',
  },
  {
    id: 'L-240625-002',
    title: '美妆成分展示',
    amount: '+198',
    source: '自动退回',
    kind: 'release',
    status: 'released',
    refId: 'T-240625-017',
    time: '42 分钟前',
    note: '本次未生成成功，积分已经退回。',
  },
  {
    id: 'L-240625-001B',
    title: '包袋细节巡游',
    amount: '+176',
    source: '自动退回',
    kind: 'release',
    status: 'released',
    refId: 'T-240625-016',
    time: '1 小时前',
    note: '素材需要重新确认授权，积分已经退回。',
  },
  {
    id: 'L-240625-001A',
    title: '精品表款 8 秒转场',
    amount: '+168',
    source: '自动退回',
    kind: 'release',
    status: 'released',
    refId: 'T-240625-015',
    time: '2 小时前',
    note: '图片未通过检查，积分已经退回。',
  },
  {
    id: 'L-240625-001',
    title: '新用户注册奖励',
    amount: '+300',
    source: '活动赠送',
    kind: 'reward',
    status: 'granted',
    refId: 'CAMPAIGN-SIGNUP',
    time: '今天',
    note: '注册活动赠送积分，每个账号限领一次。',
  },
]

export const activeStatuses: TaskStatus[] = ['queued', 'running', 'rendering', 'review']

export const rechargePackages: RechargePackage[] = [
  { id: 'starter-300', name: '入门包', amountMinor: 2900, currency: 'CNY', price: '¥29', credits: 300, bonus: '适合轻量试用' },
  { id: 'standard-1200', name: '标准包', amountMinor: 9900, currency: 'CNY', price: '¥99', credits: 1200, bonus: '电商日常推荐' },
  { id: 'growth-4000', name: '增长包', amountMinor: 29900, currency: 'CNY', price: '¥299', credits: 4000, bonus: '适合批量制作' },
]

export const initialPaymentOrder: PaymentOrder = {
  id: 'PAY-READY',
  packageId: 'standard-1200',
  packageName: '标准包',
  amountMinor: 9900,
  currency: 'CNY',
  amount: '¥99',
  credits: 1200,
  status: 'idle',
  channel: '微信/支付宝',
  createdAt: '待创建',
  expiresIn: '15 分钟',
  note: '选择充值包后创建支付订单，支付完成后积分到账。',
}

export const signupRiskChecks: SignupRiskCheck[] = [
  {
    id: 'device',
    label: '账号',
    status: 'pass',
    value: '可领取',
    note: '每个账号限领一次活动积分。',
  },
  {
    id: 'ip',
    label: '活动',
    status: 'review',
    value: '确认中',
    note: '活动积分按页面规则发放。',
  },
  {
    id: 'phone',
    label: '手机号',
    status: 'pass',
    value: '可领取',
    note: '部分活动可能需要完成手机号验证。',
  },
]

export const initialUploadReceipt: UploadReceipt = {
  id: 'UPLOAD-READY',
  fileName: '等待上传',
  status: 'idle',
  progress: 0,
  source: '素材',
  message: '上传后的图片会自动保存。',
}

export const initialQrLoginSession: QrLoginSession = {
  id: 'QR-LOGIN-READY',
  provider: '微信扫码',
  status: 'waiting',
  expiresIn: '02:00',
  note: '二维码短期有效，手机端确认后才会登录。',
}

export const filterGroups: FilterGroup[] = [
  { title: '内容类型', items: ['商品展示', '投放短视频', '视频二创', '人像写真'] },
  { title: '输入要求', items: ['只需图片', '人像照片', '视频素材'] },
  { title: '输出比例', items: ['9:16', '4:5', '1:1'] },
  { title: '积分区间', items: ['100-150', '150-200', '200+'] },
]

export const outputOptionGroups: OutputOptionGroup[] = [
  { key: 'ratio', label: '画面比例', options: ['9:16', '4:5', '1:1', '16:9'], hint: '按投放平台选择。' },
  { key: 'duration', label: '视频长度', options: ['6s', '8s', '10s', '12s'], hint: '越长越适合展示细节。' },
  { key: 'resolution', label: '输出分辨率', options: ['720p', '1080p', '2K'], hint: '默认 1080p。' },
  { key: 'quality', label: '画质', options: ['标准', '高清', '超清'], hint: '超清会保留更多细节。' },
]

export const baseAssetFilters: AssetFilter[] = ['全部', '商品主图', '人像素材', '生成视频', '品牌标识', '即将过期', '已归档']
export const customAssetFilterSeed: AssetFilter[] = []
export const maxUploadSize = 8 * 1024 * 1024
export const showTaskDevControls = false
