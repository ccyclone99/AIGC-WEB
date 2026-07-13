import type { Asset, AssetFilter, OutputSettings, Task, Template } from './types'

export const templateInputLabel = (template: Template) => {
  const requiredFields = template.config.inputFields.filter((field) => field.required)
  if (requiredFields.length === 0) return '无需输入'
  return requiredFields.map((field) => field.label).join(' / ')
}

export const outputDefaultsForTemplate = (template: Template): OutputSettings => ({
  ratio: template.ratio,
  duration: template.duration,
  resolution: '1080p',
  quality: '高清',
})

export const userEditableOutputFieldsForTemplate = (template: Template) =>
  template.config.userEditableOutputFields ?? []

export const sameOutputSettings = (left: OutputSettings, right: OutputSettings) =>
  left.ratio === right.ratio &&
  left.duration === right.duration &&
  left.resolution === right.resolution &&
  left.quality === right.quality

export const canUseAssetForGeneration = (asset: Asset) =>
  asset.status === 'library' && ['image', 'portrait', 'logo'].includes(asset.kind)

export const canUseAssetForTemplate = (asset: Asset, template: Template) => {
  const acceptedKinds = template.config.inputFields.flatMap((field) => field.acceptedKinds)
  return asset.status === 'library' && acceptedKinds.includes(asset.kind)
}

export const generatedOutputName = (task: Task) => {
  const readableTitle = task.title
    .replace(/\.[a-z0-9]{2,5}$/i, '')
    .replace(/[\\/:*?"<>|]+/g, '-')
    .replace(/\s*[·•]\s*/g, '-')
    .trim()
  return `${readableTitle || '生成视频'}-成片.mp4`
}

export const isExpiringAsset = (asset: Asset) => {
  if (asset.expires.includes('即将过期')) return true
  const daysUntilExpiry = asset.expires.match(/(\d+)\s*天后过期/)
  return daysUntilExpiry ? Number(daysUntilExpiry[1]) <= 7 : false
}

export const filterAssetByCategory = (asset: Asset, filter: AssetFilter) => {
  if (filter === '全部') return asset.status === 'library'
  if (filter === '即将过期') return asset.status === 'library' && isExpiringAsset(asset)
  if (filter === '已归档') return asset.status === 'archived'
  if (filter === '品牌标识') return asset.status === 'library' && asset.kind === 'logo'
  return asset.status === 'library' && asset.type === filter
}

const idempotencyToken = (value: string) =>
  encodeURIComponent(value.trim().toLowerCase())
    .toLowerCase()
    .trim()
    .replace(/%40/g, '@')
    .replace(/%/g, '')
    .replace(/[^a-z0-9@-]+/g, '-')
    .replace(/^-+|-+$/g, '')

export const generationIdempotencyKey = (template: Template, asset: Asset, settings: OutputSettings) =>
  [
    'gen',
    template.config.version,
    asset.id,
    settings.ratio,
    settings.duration,
    settings.resolution,
    settings.quality,
  ]
    .map(idempotencyToken)
    .join(':')
