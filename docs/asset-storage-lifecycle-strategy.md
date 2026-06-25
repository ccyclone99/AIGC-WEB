# Asset Storage and Lifecycle Strategy

Status: Draft proposal

This document defines how AIGC Web stores, serves, validates, expires, and deletes uploaded and generated media assets.

## Goals

- Safely store user uploads and generated outputs.
- Provide each user with a reusable asset library.
- Support image uploads, generated videos, posters, audio, subtitles, render artifacts, and provider raw outputs.
- Control storage costs through retention policies.
- Protect private user assets.
- Support signed upload/download URLs.
- Support takedown and deletion workflows.
- Keep assets traceable to users, tasks, templates, providers, and render attempts.
- Persist provider-returned files before provider URLs expire.

## Asset Categories

### User Uploads

Examples:

- Product main images.
- Product detail images.
- Portrait/person photos.
- Logos.
- Saved assets in the user's asset library.

Characteristics:

- User-owned.
- Potentially sensitive.
- Must be tied to user.
- May be tied to a task, project, folder, or reusable asset library item.
- Requires validation and moderation.

### Generated Outputs

Examples:

- Final videos.
- Posters/thumbnails.
- Generated images.
- Generated clips.

Characteristics:

- User-facing.
- Download/share capable.
- Must be linked to generation task.
- May have retention policy.

### Intermediate Assets

Examples:

- Preprocessed images.
- AI-generated keyframes.
- Temporary video clips.
- Render inputs.
- Render logs.

Characteristics:

- Usually not user-facing.
- Useful for debugging/rerendering.
- Can have shorter retention.

### Provider Raw Outputs

Examples:

- Original files returned by provider before normalization.
- Provider metadata files.
- Temporary provider URLs that must be downloaded before expiry.

Characteristics:

- Useful for debugging.
- May contain provider-specific formats.
- Should be retained only as needed.
- Provider-hosted URLs may expire, so the platform must download and persist required outputs into platform storage.

### Template Preview Assets

Examples:

- Sample videos.
- Template cover images.
- Prototype preview assets.

Characteristics:

- Public or semi-public.
- Versioned with templates where possible.

## Storage Architecture

Use an S3-compatible storage adapter.

Recommended buckets or prefixes:

- `uploads/`
- `generated/`
- `intermediate/`
- `provider-raw/`
- `template-previews/`
- `public-assets/`
- `render-logs/`

Do not scatter provider-specific storage code across the app. All storage access should go through a storage module/adapter.

## Asset Records

Every stored file should have an `Asset` record.

Important fields:

- assetId
- ownerUserId
- taskId
- type
- storageKey
- mimeType
- fileSize
- width
- height
- duration
- hash
- source
- visibility
- libraryStatus
- folderId
- providerUrlExpiresAt
- persistedFromProviderAt
- metadata
- createdAt
- expiresAt
- deletedAt

Visibility values:

- private
- user_accessible
- public_template
- internal_only

Library status values:

- not_in_library
- saved_to_library
- archived
- deleted

## User Asset Library

Each user should have a personal asset library.

Purpose:

- Reuse product images across multiple templates.
- Reuse generated videos/posters.
- Store brand assets such as logos.
- Keep successful outputs organized.
- Reduce repeated uploads.

Initial capabilities:

- View uploaded images.
- View generated videos and posters.
- Save generated output to library.
- Use library asset in a new generation task.
- Rename asset.
- Delete/archive asset.
- Filter by type: product image, portrait, logo, generated video, poster.

Future capabilities:

- Folders/collections.
- Tags.
- Brand kits.
- Favorite assets.
- Search.
- Bulk operations.
- Team/shared asset libraries.

Rules:

- Asset library items must still obey ownership and access checks.
- Deleting a library item should not break historical task audit records; the task can retain metadata even if file access is removed.
- Assets used in completed tasks should keep task references for traceability.
- Users should be able to save generated results intentionally; otherwise default retention may apply.

## Upload Flow

Recommended flow:

1. User requests upload slot.
2. Backend validates intended file type, size, and template context.
3. Backend creates temporary upload token or signed upload URL.
4. User uploads directly to object storage.
5. Frontend notifies backend upload complete.
6. Backend verifies object exists and inspects metadata.
7. Backend creates/updates `Asset` record.
8. Asset validation/moderation runs before generation.

Library upload flow:

1. User uploads an asset directly to the asset library.
2. Backend validates and inspects the asset.
3. Asset is marked `saved_to_library`.
4. User can select it later in a template workspace.

Rules:

- Do not trust file extension alone.
- Validate MIME/content type.
- Enforce max file size.
- Enforce max dimensions/duration where applicable.
- Run moderation/inspection before expensive generation.

## Download and Sharing

Private user assets:

- Use short-lived signed URLs.
- Verify user owns or is allowed to access the task/asset.

Public template previews:

- Can use public CDN URLs.

Generated user videos:

- Default should be private to the user.
- Public sharing links can be added later with explicit user action.
- Shared links should be revocable.

## Provider Output Persistence

Many providers return temporary URLs or files that expire after a short window. The platform must treat provider URLs as temporary input, not final storage.

Required behavior:

1. Provider attempt receives output URL or file reference.
2. Worker downloads required output before expiry.
3. Worker stores output in platform object storage.
4. Worker creates or updates Asset record.
5. Worker records original provider URL metadata only if safe and useful.
6. Final user delivery uses platform storage URL, not provider URL.

Rules:

- Do not expose provider temporary URLs to users as final output.
- Store provider URL expiry time when available.
- If provider output download fails before expiry, task should retry download or mark provider output retrieval failure.
- Keep provider raw output retention shorter than final user output retention.
- Final output hash/size/duration should be recorded after persistence.

## Retention Policy

Suggested initial defaults:

- User library assets: retained until user deletes, plan limits apply, or account policy requires cleanup.
- Task-only user uploads: 30 to 90 days after task completion unless user saves to library.
- Final generated outputs: 30 to 180 days depending on plan/business policy.
- Generated outputs saved to user library: retained until user deletes, plan limits apply, or account policy requires cleanup.
- Intermediate assets: 7 to 30 days.
- Provider raw outputs: 7 to 30 days.
- Render logs: 30 to 90 days.
- Audit logs and credit/task records: longer retention, separate from media files.
- Template preview assets: retained while template is active.

Exact numbers are business/legal decisions and can vary by plan.

## Deletion and Takedown

Deletion types:

- User-requested deletion.
- Expiration cleanup.
- Moderation/takedown.
- Admin/Agent operational deletion.

Rules:

- Delete or disable access to storage object.
- Mark `Asset.deletedAt`.
- Keep audit records for deletion action.
- Generated task history can retain metadata even if media file is deleted.
- Public/shared links must stop working after deletion/takedown.

## Asset Inspection

Inspection can include:

- File readability.
- Dimensions.
- Duration.
- Hashing.
- Duplicate detection.
- Basic quality checks.
- NSFW/policy moderation.
- Face/person detection for portrait templates.
- Product detection for ecommerce templates.
- Watermark detection as warning.

Inspection results should be stored in `AssetInspection`.

## Cost Management

Controls:

- Retention policies.
- Lifecycle cleanup jobs.
- Compression/transcoding.
- Thumbnail/poster generation.
- Avoid storing unnecessary duplicate intermediates.
- Track storage usage by user/task/template.
- Cleanup abandoned uploads.

## Security Requirements

- Use signed URLs for private upload/download.
- Use server-side validation after upload.
- Do not expose raw storage keys where avoidable.
- Restrict admin asset access by role.
- Log sensitive asset access.
- Redact signed URLs from logs.
- Separate public template assets from private user assets.

## Agent Role

Agent can:

- Trace asset usage by task.
- Diagnose missing or invalid assets.
- Recommend cleanup policies.
- Generate storage cost reports.
- Prepare takedown summaries.
- Detect orphaned assets.

Agent should not:

- Expose private user media unnecessarily.
- Delete user assets without policy/approval unless automated expiration applies.

## MVP Requirements

Required:

- Asset record model.
- User asset library.
- S3-compatible storage adapter.
- Signed upload/download URLs.
- Upload file type/size validation.
- Asset inspection placeholder or implementation.
- User ownership checks.
- Private generated video access.
- Provider output persistence before provider URL expiry.
- Cleanup job for abandoned uploads/intermediate assets.

Can be delayed:

- Public sharing links.
- Advanced storage tiering.
- Per-plan retention.
- Duplicate media deduplication.
- Full malware scanning pipeline.

## Open Questions

- Exact storage provider.
- Exact retention periods.
- Whether users can pin/save outputs beyond default retention.
- Public sharing link policy.
- CDN provider.
- Whether generated outputs are watermarked by credit type/plan.

## Decision

Use S3-compatible object storage through a storage adapter, store every media object as an Asset record, use signed URLs for private user media, and enforce lifecycle cleanup for cost and privacy.
