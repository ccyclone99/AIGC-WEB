# Export, Download, and Sharing Strategy

Status: Draft proposal

This document defines how users access, download, save, and share generated outputs.

## Goals

- Let users retrieve generated videos reliably.
- Support ecommerce platform publishing workflows.
- Keep generated outputs private by default.
- Allow optional public sharing later.
- Support platform-specific export presets.
- Keep asset access secure and auditable.
- Make watermark/export quality rules compatible with credits/plans.

## Principles

- Generated outputs are private to the user by default.
- Download should use platform storage, not provider temporary URLs.
- Sharing should be explicit, revocable, and optionally expiring.
- Export should be tied to the stored Asset and GenerationTask.
- Export quality, watermark, and retention can depend on credit type or plan.
- Task history should remain even if downloadable media expires or is deleted.

## Output Access

After success, user should be able to:

- Preview video.
- Download video.
- Save output to asset library.
- Reuse output or poster in another template if allowed.
- View submitted inputs summary.
- View credit consumption.

MVP required:

- Preview.
- Download.
- Save to asset library.

Future:

- Public share link.
- Social platform direct publish.
- Export variants.
- Batch download.

## Download Flow

Recommended flow:

1. User clicks download.
2. Backend verifies user owns task/output asset.
3. Backend creates short-lived signed download URL.
4. Frontend downloads from object storage/CDN.
5. Download event is logged.

Rules:

- Do not expose permanent private storage URLs.
- Do not use provider temporary URLs.
- Signed URL should expire.
- Download should work after page refresh as long as asset is retained.

## Save To Asset Library

Generated outputs can be saved into the user's asset library.

Rules:

- Save action changes `Asset.libraryStatus` to `saved_to_library` or creates a library reference.
- Saved outputs follow library retention/account policy rather than short task-only retention.
- User can rename or archive saved outputs.

## Public Sharing Links

Can be delayed after MVP.

If implemented:

- Sharing must be explicit.
- Links should be revocable.
- Links can expire.
- Shared page should avoid exposing private task details.
- Takedown/delete should disable the shared link.
- Shared link access should be tracked.

Suggested model:

- `ShareLink`
- assetId
- userId
- visibility
- expiresAt
- revokedAt
- viewCount
- createdAt

## Platform Export Presets

Useful for ecommerce/social workflows.

Examples:

- TikTok/Douyin: 9:16, short vertical video.
- Xiaohongshu: 3:4 or 9:16 depending content type.
- Instagram Reels: 9:16.
- Amazon product video: platform-specific restrictions to confirm.
- Shopify: merchant-friendly MP4 output.
- Taobao/Tmall: platform-specific specs to confirm.

Preset fields:

- aspectRatio
- resolution
- maxDuration
- recommendedDuration
- maxFileSize
- codec
- safeZones
- captionStyle
- watermarkPolicy

MVP:

- Store target platform as a template option.
- Output common ratios such as 9:16, 1:1, 16:9.
- Do not overpromise exact platform compliance until specs are verified.

## Export Variants

Future capability:

- Same generated task can export variants:
  - different ratio
  - different resolution
  - with/without watermark
  - different caption language
  - short/long cut
  - platform-specific version

Rules:

- Export variant can consume additional credits if it requires rendering/generation.
- Pure download of existing output should not consume extra credits unless business decides otherwise.
- Each variant should be an Asset linked to the original task.

## Watermark Rules

Possible policy:

- Free/signup/campaign credits generate watermarked outputs.
- Paid credits can remove watermark, subject to final business policy.
- High-resolution export may cost more credits.
- Watermark removal policy should be clearly shown before generation/export.

Decision:

- Free outputs have watermarks.
- Signup bonus and campaign reward outputs are treated as free outputs unless a campaign explicitly says otherwise.
- Draft/preview outputs can be watermarked even when paid, because they are not final deliverables.

See `docs/draft-preview-hd-strategy.md` for preview/final generation policy.

## Retention and Expiry

Task result assets:

- Available for default retention period.
- Can be saved to asset library for longer retention.

Share links:

- Optional expiry.
- Revocable.

Signed download URLs:

- Short-lived.
- Regenerated on demand.

## Audit and Analytics

Track:

- Preview views.
- Downloads.
- Saves to asset library.
- Share link creation.
- Share link views.
- Export variant generation.
- Watermark removal/export quality changes.

Useful for:

- Product analytics.
- Support disputes.
- Billing/credit questions.
- Template performance analysis.

## Agent Role

Agents can:

- Recommend export presets for new templates.
- Generate platform-specific export settings.
- Diagnose failed downloads.
- Explain why an output expired or was deleted.
- Prepare share/takedown summaries.
- Suggest watermark/credit pricing policy changes.

## MVP Requirements

Required:

- Preview completed video.
- Download completed video through signed URL.
- Save completed output to asset library.
- Output asset linked to task.
- Download event logging.
- Basic ratio options: 9:16, 1:1, 16:9 where template/provider supports them.

Can be delayed:

- Public share links.
- Direct social publishing.
- Export variants.
- Batch download.
- Exact platform compliance presets.
- Watermark removal upsell.

## Open Questions

- Whether all paid-credit final outputs remove watermark automatically or only selected packages/templates.
- Default retention period for generated outputs.
- Whether public sharing is needed in MVP.
- Which platform export specs must be supported first.
- Whether export variants cost additional credits.

## Decision

MVP should support private preview, signed download, and save-to-asset-library. Public sharing and advanced export variants can come later.
