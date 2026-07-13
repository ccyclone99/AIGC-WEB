import { describe, expect, it } from 'vitest'

import {
  canUseAssetForTemplate,
  generatedOutputName,
  generationIdempotencyKey,
  isExpiringAsset,
  outputDefaultsForTemplate,
  userEditableOutputFieldsForTemplate,
} from './domain'
import { initialAssets, initialTasks, templates } from './prototypeData'

describe('template asset constraints', () => {
  it('accepts product images and rejects portrait references for product templates', () => {
    expect(canUseAssetForTemplate(initialAssets[0], templates[1])).toBe(true)
    expect(canUseAssetForTemplate(initialAssets[2], templates[1])).toBe(false)
  })

  it('accepts portrait references for portrait templates', () => {
    expect(canUseAssetForTemplate(initialAssets[2], templates[3])).toBe(true)
  })
})

describe('template editor visibility', () => {
  it('hides output settings by default and only returns explicitly enabled fields', () => {
    expect(userEditableOutputFieldsForTemplate(templates[0])).toEqual([])
    expect(userEditableOutputFieldsForTemplate({
      ...templates[0],
      config: { ...templates[0].config, userEditableOutputFields: ['ratio'] },
    })).toEqual(['ratio'])
  })
})

describe('generation helpers', () => {
  it('creates a stable idempotency key and changes it with output settings', () => {
    const defaults = outputDefaultsForTemplate(templates[0])
    const first = generationIdempotencyKey(templates[0], initialAssets[0], defaults)
    const second = generationIdempotencyKey(templates[0], initialAssets[0], defaults)
    const changed = generationIdempotencyKey(templates[0], initialAssets[0], { ...defaults, quality: '超清' })

    expect(first).toBe(second)
    expect(changed).not.toBe(first)
  })

  it('uses a readable, filesystem-safe output name', () => {
    expect(generatedOutputName({ ...initialTasks[1], title: '潮鞋爆款节奏 · 海边人像参考.jpg' })).toBe(
      '潮鞋爆款节奏-海边人像参考-成片.mp4',
    )
  })
})

describe('asset expiry', () => {
  it('only treats assets expiring within seven days as urgent', () => {
    expect(isExpiringAsset({ ...initialAssets[0], expires: '7 天后过期' })).toBe(true)
    expect(isExpiringAsset({ ...initialAssets[0], expires: '8 天后过期' })).toBe(false)
  })
})
