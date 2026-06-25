# Data Model Direction

Status: Draft proposal

This document defines the first-pass core data model for AIGC Web. It is product-level and architecture-level, not final database migration code.

## Data Modeling Principles

- Records that affect money/credits must be append-only or auditable.
- Generation tasks must be reconstructable from stored records.
- Published template versions are immutable.
- User-submitted parameters must be stored exactly as submitted.
- Provider attempts must be recorded separately from generation tasks.
- Credits use a ledger model, not only a mutable balance.
- Corrections should append new records/events rather than overwrite history.
- Agent actions should be logged like human and system actions.

## Core Entities

### User

Represents a registered user.

Key fields:

- id
- displayName
- email
- phone
- loginProvider
- status
- createdAt
- updatedAt

Notes:

- Login method remains open.
- User record should not directly store all credit history.

### UserIdentity

Represents one login method bound to a platform user.

Identity types:

- email
- phone
- wechat
- google
- apple
- oauth_provider
- qr_app

Key fields:

- id
- userId
- provider
- providerUserId
- email nullable
- phone nullable
- verified
- metadata
- createdAt
- lastUsedAt

Rules:

- The pair `provider + providerUserId` should be unique.
- Multiple identities can link to one user.
- Signup bonus is granted to userId once, not per identity.

### QrLoginSession

Represents a short-lived web login session waiting for mobile scan/confirmation.

Key fields:

- id
- sessionTokenHash
- status: created | scanned | confirmed | expired | cancelled | consumed
- scannedByIdentityId nullable
- confirmedUserId nullable
- expiresAt
- consumedAt
- createdAt
- metadata

Rules:

- QR sessions are single-use and short-lived.
- QR content should not contain long-lived login tokens.
- Web polling should be rate-limited.

### UserCreditAccount

Cached summary of user credit state.

Key fields:

- userId
- availableCredits
- frozenCredits
- totalPurchasedCredits
- totalBonusCredits
- totalConsumedCredits
- updatedAt

Notes:

- This is a performance/summary table.
- The credit ledger remains the source of truth.

### CreditLedgerEntry

Append-only record for every credit movement.

Transaction types:

- signup_bonus
- campaign_reward
- recharge_purchase
- admin_grant
- freeze
- settle
- release
- refund
- adjustment
- expiration

Key fields:

- id
- userId
- taskId nullable
- orderId nullable
- type
- amount
- balanceAfter optional
- frozenAfter optional
- idempotencyKey
- reason
- metadata
- createdByType: user | admin | agent | system
- createdById
- createdAt

Rules:

- Every freeze, settle, release, and refund must have an idempotency key.
- Generation-related entries must reference taskId.
- Manual adjustments require a reason.

### RechargeOrder

Payment/recharge record.

Key fields:

- id
- userId
- packageId
- amountPaid
- creditsPurchased
- paymentProvider
- paymentStatus
- providerOrderId
- paidAt
- createdAt

Notes:

- Payment success creates a credit ledger entry.
- Recharge order and credit ledger should be linked but separate.

### CreditCampaign

Defines marketing or activity-based credit rewards.

Campaign types:

- holiday
- referral
- invite
- daily_checkin
- first_generation
- recharge_bonus
- redemption_code
- template_launch
- manual_marketing

Key fields:

- id
- campaignKey
- name
- type
- status
- startAt
- endAt
- rewardCredits
- bonusCredits
- eligibilityRules
- usageLimitPerUser
- totalBudgetCredits
- grantedCredits
- applicableTemplateIds
- expirationPolicy
- createdByType
- createdById
- createdAt
- updatedAt

Notes:

- Campaigns create credit ledger entries with type `campaign_reward`.
- Campaign grants must be idempotent.
- High-impact campaigns should require approval.

### CreditCampaignGrant

Records a user's eligibility/grant for a campaign.

Key fields:

- id
- campaignId
- userId
- ledgerEntryId nullable
- status: pending | granted | rejected | expired | revoked
- idempotencyKey
- reason
- metadata
- createdAt
- grantedAt

Rules:

- The idempotency key prevents duplicate reward grants.
- Grant records help audit why a user did or did not receive activity credits.

### TemplateDefinition

Represents a logical template identity.

Key fields:

- id
- templateKey
- name
- category
- owner
- currentPublishedVersionId
- status
- createdAt
- updatedAt

Notes:

- This is not the full config.
- Versions are stored separately.

### TemplateVersion

Immutable published or draft version of a template.

Key fields:

- id
- templateId
- version
- status: draft | reviewing | published | paused | archived
- sourceRef
- configSnapshot
- validationReport
- previewAssets
- publishedAt
- publishedByType: admin | agent | system
- publishedById
- createdAt

Rules:

- Once published, configSnapshot should not be mutated.
- Rollback activates or republishes a previous version; it does not edit history.

### TemplateOperationalOverride

Runtime override for published templates.

Key fields:

- id
- templateId
- templateVersionId nullable
- visibility
- sortWeight
- featured
- allowedUserSegments
- effectiveFrom
- effectiveUntil
- reason
- createdByType
- createdById
- createdAt

Notes:

- Lets operations change visibility/order without mutating template config.

### Asset

Represents uploaded or generated media.

Asset types:

- uploaded_image
- generated_image
- generated_video
- poster
- audio
- subtitle
- composition_spec
- provider_raw_output

Key fields:

- id
- ownerUserId nullable
- taskId nullable
- type
- storageKey
- mimeType
- fileSize
- width
- height
- duration
- hash
- source: user_upload | generated | provider | system
- libraryStatus: not_in_library | saved_to_library | archived | deleted
- folderId nullable
- providerUrlExpiresAt nullable
- persistedFromProviderAt nullable
- metadata
- createdAt
- expiresAt nullable

Notes:

- User library assets are retained according to library/account policy.
- Provider-returned URLs may expire, so required outputs should be persisted into platform storage.
- Final user delivery should use platform storage, not provider temporary URLs.

### AssetFolder

Represents an optional folder/collection in a user's asset library.

Key fields:

- id
- userId
- name
- sortWeight
- createdAt
- updatedAt

Notes:

- Folders can be added after the basic asset library if needed.

### AssetInspection

Stores inspection/moderation/quality metadata for assets.

Key fields:

- id
- assetId
- inspectionType
- result
- labels
- warnings
- blockingReasons
- provider
- rawMetadata
- createdAt

### GenerationTask

Represents one user generation submission.

Key fields:

- id
- userId
- templateId
- templateVersionId
- creationMode: template | freeform
- outputMode: preview | final
- parentTaskId nullable
- providerDraftRef nullable
- status
- userVisibleStatus
- submittedInputs
- submittedAssetIds
- pricingBreakdown
- estimatedCredits
- frozenCredits
- finalCreditsSpent
- outputAssetIds
- outputQuality: draft | standard | hd
- watermarkApplied
- errorCode
- errorMessage
- createdAt
- submittedAt
- completedAt
- updatedAt

Rules:

- submittedInputs are stored exactly as submitted.
- status can be a convenience field; events are the detailed history.
- Each task links to the exact template version.

### GenerationTaskEvent

Append-only timeline for task state changes.

Key fields:

- id
- taskId
- previousStatus
- nextStatus
- eventType
- reason
- payload
- actorType: user | admin | agent | system | worker | provider
- actorId
- createdAt

Examples:

- submitted
- validation_passed
- credits_frozen
- queued
- provider_submitted
- retry_scheduled
- provider_failed
- succeeded
- credits_settled
- failed
- credits_released

### ProviderAttempt

Represents one external provider/model call.

Key fields:

- id
- taskId
- workflowStepId
- provider
- model
- attemptNo
- requestId
- requestPayloadSnapshot
- requestPayloadHash
- responseMetadata
- status
- errorCode
- errorMessage
- latencyMs
- startedAt
- completedAt
- createdAt

Rules:

- Do not store secrets.
- Store enough metadata to debug and audit.
- Multiple attempts can exist for one task.

### VideoCompositionRecord

Stores the platform-owned video composition spec for post-production workflows.

Key fields:

- id
- taskId
- templateVersionId
- specVersion
- specSnapshot
- rendererPreference
- selectedRenderer
- renderStatus
- renderOutputAssetId
- createdAt

Notes:

- This stores `VideoCompositionSpec`.
- Useful for reconstruction, preview, rerendering, and debugging.

### RenderAttempt

Represents one render execution, such as Remotion, FFmpeg, cloud renderer, or Jianying/CapCut adapter.

Key fields:

- id
- taskId
- compositionRecordId
- renderer
- attemptNo
- renderPayloadSnapshot
- status
- outputAssetId
- errorCode
- errorMessage
- logsRef
- startedAt
- completedAt
- createdAt

### ModerationRecord

Stores content policy checks.

Key fields:

- id
- taskId nullable
- assetId nullable
- phase: pre_generation | post_generation
- targetType: text | image | video | audio
- result: pass | warn | block
- labels
- reasons
- provider
- rawMetadata
- createdAt

### AuditLog

Records human, Agent, and system operational actions.

Key fields:

- id
- actorType: user | admin | agent | system
- actorId
- action
- targetType
- targetId
- beforeSnapshot
- afterSnapshot
- reason
- metadata
- createdAt

Used for:

- Template publish/pause/archive/rollback.
- Credit adjustments.
- Provider config changes.
- Admin permission changes.
- Agent-executed or Agent-prepared operations.

### AgentOperation

Records Agent-driven operational work.

Key fields:

- id
- requestedByType
- requestedById
- operationType
- intent
- status
- inputRefs
- outputSummary
- proposedActions
- validationResults
- approvalStatus
- approvedBy
- executedActionRefs
- createdAt
- completedAt

Examples:

- template_generation
- task_diagnosis
- credit_adjustment_proposal
- provider_incident_summary
- config_change_proposal

### ProviderConfig

Stores provider configuration metadata.

Key fields:

- id
- provider
- displayName
- status
- capabilities
- rateLimitPolicy
- timeoutPolicy
- fallbackPriority
- configMetadata
- secretRef
- createdAt
- updatedAt

Rules:

- Secrets should be stored in secret manager, not directly in database.

## Entity Relationships

```txt
User
  -> UserIdentity
  -> QrLoginSession
  -> GenerationTask
  -> CreditLedgerEntry
  -> RechargeOrder
  -> CreditCampaignGrant
  -> AssetFolder
  -> Asset

CreditCampaign
  -> CreditCampaignGrant
  -> CreditLedgerEntry

TemplateDefinition
  -> TemplateVersion
  -> TemplateOperationalOverride

GenerationTask
  -> TemplateVersion
  -> GenerationTaskEvent
  -> CreditLedgerEntry
  -> ProviderAttempt
  -> VideoCompositionRecord
  -> RenderAttempt
  -> ModerationRecord
  -> Asset

VideoCompositionRecord
  -> RenderAttempt
  -> Asset

AgentOperation
  -> AuditLog
  -> TemplateVersion / GenerationTask / CreditLedgerEntry / ProviderConfig
```

## Task Status Model

Internal statuses:

- draft
- submitted
- validating
- validation_failed
- credits_freezing
- credits_frozen
- queued
- provider_submitting
- provider_processing
- retrying
- composing
- rendering
- post_processing
- succeeded
- settling
- settled
- failed
- timed_out
- blocked
- refunding
- refunded

User-visible statuses:

- waiting
- generating
- succeeded
- failed
- timed_out
- blocked
- refunded

## Credit Invariants

- Available credits cannot go below zero.
- Frozen credits cannot go below zero.
- Settle cannot exceed frozen amount for the task.
- Release/refund cannot exceed frozen/spent amount according to transaction type.
- Duplicate idempotency keys must not create duplicate ledger entries.
- Every manual adjustment must include actor and reason.

## Traceability Checklist

For every generation task, admin/Agent should be able to see:

- User.
- Template ID and version.
- Submitted parameters.
- Uploaded assets.
- Asset inspection results.
- Pricing calculation.
- Credit freeze/settle/release/refund entries.
- Task event timeline.
- Provider attempts.
- Video composition spec if used.
- Render attempts if used.
- Moderation records.
- Output assets.
- Error details.
- Agent/human/system actions.

## MVP Data Model Scope

Required:

- User.
- UserIdentity.
- QrLoginSession.
- UserCreditAccount.
- CreditLedgerEntry.
- CreditCampaign.
- CreditCampaignGrant.
- TemplateDefinition.
- TemplateVersion.
- Asset.
- AssetFolder.
- AssetInspection.
- GenerationTask.
- GenerationTaskEvent.
- ProviderAttempt.
- VideoCompositionRecord.
- RenderAttempt.
- ModerationRecord.
- AuditLog.

Can be delayed if necessary:

- RechargeOrder if payment is not in the first prototype.
- ProviderConfig UI, though provider metadata still needs config somewhere.
- AgentOperation as a full table, if Agent activity can initially be represented through AuditLog and files.
- TemplateOperationalOverride if template visibility can initially live on TemplateVersion.

## Open Questions

- Which database will be used?
- Do we need multi-tenant organization/team accounts?
- How long should generated assets be retained?
- How long should detailed provider payload snapshots be retained?
- Which fields require encryption or redaction?
- What exact login methods and payment providers will be used?
