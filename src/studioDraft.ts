import type { OutputSettings } from './types'

export const studioDraftStorageKey = 'aigc-studio-draft-v1'

export type StoredStudioDraft = {
  templateId?: string
  assetId?: string
  outputSettings?: OutputSettings
}

const isNonEmptyString = (value: unknown): value is string =>
  typeof value === 'string' && value.trim().length > 0

const allowedOutputValues: Record<keyof OutputSettings, readonly string[]> = {
  ratio: ['9:16', '4:5', '1:1', '16:9'],
  duration: ['6s', '8s', '10s', '12s'],
  resolution: ['720p', '1080p', '2K'],
  quality: ['标准', '高清', '超清'],
}

const isOutputSettings = (value: unknown): value is OutputSettings => {
  if (!value || typeof value !== 'object') return false
  const settings = value as Record<string, unknown>
  return (
    isNonEmptyString(settings.ratio) && allowedOutputValues.ratio.includes(settings.ratio) &&
    isNonEmptyString(settings.duration) && allowedOutputValues.duration.includes(settings.duration) &&
    isNonEmptyString(settings.resolution) && allowedOutputValues.resolution.includes(settings.resolution) &&
    isNonEmptyString(settings.quality) && allowedOutputValues.quality.includes(settings.quality)
  )
}

export const parseStoredStudioDraft = (raw: string | null): StoredStudioDraft => {
  if (!raw) return {}

  try {
    const value: unknown = JSON.parse(raw)
    if (!value || typeof value !== 'object') return {}
    const draft = value as Record<string, unknown>

    return {
      ...(isNonEmptyString(draft.templateId) ? { templateId: draft.templateId } : {}),
      ...(isNonEmptyString(draft.assetId) ? { assetId: draft.assetId } : {}),
      ...(isOutputSettings(draft.outputSettings) ? { outputSettings: draft.outputSettings } : {}),
    }
  } catch {
    return {}
  }
}

export const serializeStudioDraft = (draft: StoredStudioDraft) => JSON.stringify(draft)
