import { describe, expect, it } from 'vitest'

import { parseStoredStudioDraft, serializeStudioDraft, type StoredStudioDraft } from './studioDraft'

const validDraft: StoredStudioDraft = {
  templateId: 'watch',
  assetId: 'A-WATCH-MAIN',
  outputSettings: {
    ratio: '9:16',
    duration: '8s',
    resolution: '1080p',
    quality: '高清',
  },
}

describe('stored studio draft', () => {
  it('round-trips a valid draft', () => {
    expect(parseStoredStudioDraft(serializeStudioDraft(validDraft))).toEqual(validDraft)
  })

  it('ignores malformed JSON and non-object values', () => {
    expect(parseStoredStudioDraft('{broken')).toEqual({})
    expect(parseStoredStudioDraft('null')).toEqual({})
    expect(parseStoredStudioDraft('[]')).toEqual({})
  })

  it('keeps valid identifiers but drops unsupported output settings', () => {
    expect(parseStoredStudioDraft(JSON.stringify({
      templateId: 'watch',
      assetId: 42,
      outputSettings: { ratio: 'banana', duration: '8s', resolution: '1080p', quality: '高清' },
    }))).toEqual({ templateId: 'watch' })
  })
})
