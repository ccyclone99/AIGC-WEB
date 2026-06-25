# Draft Preview and HD Final Strategy

Status: Draft decision

This document defines how AIGC Web should handle low-cost preview/draft generation, HD/final generation, and watermark rules.

## Decisions

- Free outputs have watermarks.
- Outputs generated with signup bonus credits, campaign reward credits, or other free promotional credits should be watermarked by default.
- Paid-credit outputs can be eligible for no-watermark output, subject to final business rules.
- Do not build product flow around one specific model's draft mode.
- Do reserve a generic "draft preview" capability in templates, provider adapters, pricing, and task lifecycle.

## Why Not Build Around One Model

Some video models or aggregators expose low-cost draft/preview modes. For example, Runware's Seedance 1.5 Pro docs describe a `draft` option that generates a fast 480p preview and a `draftId` that can be used to produce full quality output from an approved draft. AI SDK's ByteDance provider docs also describe `draft` as a Seedance 1.5 Pro option, with 480p preview for rapid iteration.

However, not every provider/model supports this capability. If the product flow is hard-coded around Seedance-specific draft behavior, it creates vendor lock-in and makes fallback/provider switching harder.

Therefore:

- Treat draft preview as a provider capability.
- Allow templates to opt in.
- Allow provider adapters to implement it when supported.
- Fall back to normal generation when not supported.

## Capability Model

Provider adapter should declare:

```ts
previewCapability = {
  supportsDraftPreview: boolean,
  previewResolution?: "480p" | "720p" | string,
  supportsFinalizeFromDraft?: boolean,
  draftReferenceField?: "draftId" | string,
  previewCostMultiplier?: number,
  previewWatermarkRequired?: boolean
}
```

Template config can declare:

```ts
preview = {
  enabled: true,
  mode: "provider_draft" | "composition_preview" | "low_res_render" | "disabled",
  userFacingLabel: "Preview first",
  previewCredits: 2,
  finalCredits: 20,
  allowFinalizeFromPreview: true
}
```

## Preview Modes

### Provider Draft Preview

Use when provider supports native draft preview and optional finalization from draft.

Flow:

1. User submits preview generation.
2. Credits for preview are frozen/settled.
3. Provider creates low-cost/low-resolution preview.
4. Preview is persisted into platform storage.
5. User can approve and generate full-quality final.
6. If provider supports draft reference, final generation uses the draft reference.
7. Final generation consumes final credits.

Pros:

- Lower cost for iteration.
- Better user confidence before paying for final.

Risks:

- Provider-specific.
- Preview-to-final consistency may vary.
- More task states and UX complexity.

### Composition Preview

Use for Remotion/FFmpeg template-heavy workflows.

Flow:

- Generate low-resolution/watermarked preview of the composition using existing assets and placeholders or generated clips.

Pros:

- Not dependent on one model.
- Useful for ecommerce templates with text/layout/CTA.

Risks:

- Does not preview the exact AI video model output if model generation is the main creative component.

### Low-Resolution Render

Use when final composition can be rendered cheaply at lower resolution.

Pros:

- Good for checking layout, captions, logo placement, and timing.

Risks:

- Still requires generated assets if the AI step is expensive.

## Recommended Product Policy

MVP:

- Do not require preview-first flow.
- Keep simple "generate final video" flow as default.
- Add schema/data support for preview mode.
- Add provider adapter capability flags for draft preview.
- For templates/providers that support cheap preview, expose it as an optional advanced choice, not the default main flow.

Later:

- If preview mode improves conversion or reduces refund/support pressure, promote it in selected templates.
- Use A/B testing to decide whether preview-first should be default for expensive templates.

## Pricing Rules

Possible model:

- Preview costs a small number of credits.
- Final generation costs normal credits.
- If final generation reuses a provider draft and provider charges less, reflect that in pricing.
- If preview fails technically, release/refund preview credits.
- If preview succeeds but user dislikes it, preview credits are consumed.
- Final generation failure releases/refunds final frozen credits.

Important:

- Preview and final should be separate ledger entries.
- Preview task and final task should be linked.
- User should clearly see that preview is lower quality/watermarked and final generation costs more.

## Watermark Rules

Default:

- Free/signup/campaign preview outputs: watermarked.
- Free/signup/campaign final outputs: watermarked.
- Paid-credit preview outputs: can still be watermarked to indicate preview quality.
- Paid-credit final outputs: eligible for no watermark if business policy allows.

Watermark metadata should be stored on the output Asset:

- watermarkApplied
- watermarkReason
- creditSource
- exportPolicy

## Task Model

GenerationTask should support:

- outputMode: `preview` | `final`
- parentTaskId nullable
- previewTaskId nullable
- finalTaskId nullable
- providerDraftRef nullable
- previewApprovedAt nullable
- outputQuality: `draft` | `standard` | `hd`
- watermarkApplied

## UX Guidance

Keep UI simple:

- Default button: "Generate video".
- Optional secondary action when supported: "Generate preview".
- Clearly explain preview is lower quality and may include watermark.
- After preview success, show "Generate HD final".
- Do not force every template into a two-step flow.

## When Preview Is Worth It

Use preview mode when:

- Final generation is expensive.
- Template has high uncertainty.
- User input can produce many creative directions.
- Provider supports preview cheaply.
- Preview-to-final consistency is acceptable.
- The extra UX step does not reduce conversion too much.

Avoid preview mode when:

- Final generation is cheap.
- Template output is deterministic/composition-heavy.
- Preview is not representative of final quality.
- Provider does not support reliable finalize-from-draft.
- User wants fast one-click output.

## Agent Role

Agents can:

- Detect providers/templates that support preview mode.
- Add preview capability to provider adapters.
- Add preview pricing to templates.
- Analyze preview-to-final conversion.
- Recommend whether preview should be shown or hidden for each template.
- Compare preview cost versus final generation cost.

## References

- Runware Seedance 1.5 Pro docs: https://runware.ai/docs/models/bytedance-seedance-1-5-pro
- AI SDK ByteDance provider docs: https://ai-sdk.dev/providers/ai-sdk-providers/bytedance
- BytePlus ModelArk video generation API: https://docs.byteplus.com/en/docs/ModelArk/1520757

## Decision

Reserve draft preview as a generic provider/template capability, not a Seedance-specific product flow. MVP should support the data and adapter abstraction, while exposing preview only for templates where it is clearly useful.
