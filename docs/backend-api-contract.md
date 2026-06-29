# Backend API Contract

Status: Draft before backend implementation
Last updated: 2026-06-26

This document turns the frontend prototype state into a backend API contract. It should be used after `backend-interface-prep.md` and before creating backend routes.

The matching frontend TypeScript adapter port lives in `src/api/contracts.ts`; DTO-to-UI conversion lives in `src/api/mappers.ts`.

## Conventions

- Base path: `/api`
- Response envelope:

```ts
type ApiResponse<T> = {
  ok: boolean
  data?: T
  error?: {
    code: string
    message: string
    traceId: string
  }
}
```

- Every state-changing request must carry an `idempotencyKey` when it can create credits, tasks, assets, payment orders, or reward grants.
- Frontend-visible records must include stable IDs for traceability.
- Timestamps should use ISO 8601 in backend responses. The prototype currently uses user-facing relative text.

## Auth And Account

| Method | Path | Purpose | Frontend state |
|---|---|---|---|
| `GET` | `/auth/session` | Read current account/session state | top bar, account tab |
| `POST` | `/auth/qr-sessions` | Create QR login session | `waiting` |
| `GET` | `/auth/qr-sessions/:sessionId` | Poll QR login session | `waiting`, `scanned`, `confirmed`, `expired`, `rejected` |
| `POST` | `/auth/qr-sessions/:sessionId/confirm` | Provider/mobile confirmation callback | `confirmed` or `rejected` |
| `POST` | `/auth/third-party/:provider/start` | Start OAuth/third-party login | third-party login entry |
| `POST` | `/auth/signup-reward/claim` | Claim signup bonus | `eligible`, `granted`, `claimed`, `risk_blocked` |
| `GET` | `/reward-campaigns` | List activity reward campaigns | activity/reward entry |
| `POST` | `/reward-campaigns/:campaignId/claim` | Claim campaign credits | reward ledger row |

```ts
type QrLoginSessionDto = {
  id: string
  provider: string
  status: 'waiting' | 'scanned' | 'confirmed' | 'expired' | 'rejected'
  expiresAt: string
  note: string
}

type SignupRewardDto = {
  status: 'eligible' | 'granted' | 'claimed' | 'risk_blocked'
  rewardCredits: number
  ledgerId?: string
  riskChecks: Array<{
    id: string
    label: string
    status: 'pass' | 'review' | 'blocked'
    value: string
    note: string
  }>
}

type RewardCampaignDto = {
  id: string
  title: string
  status: 'available' | 'claimed' | 'risk_blocked' | 'expired' | 'disabled'
  rewardCredits: number
  startsAt: string
  endsAt?: string
  claimLimit: number
  claimedCount: number
  riskChecks: SignupRewardDto['riskChecks']
}
```

Open before backend:

- Decide QR polling interval and expiry duration.
- Decide whether QR session confirmation is first-party app, WeChat, or both.
- Decide risk-blocked appeal/retry wording.

## Templates

| Method | Path | Purpose | Frontend state |
|---|---|---|---|
| `GET` | `/templates` | List published templates | template gallery |
| `GET` | `/templates/:templateId` | Fetch template detail | template modal |
| `POST` | `/templates/:templateId/quote` | Estimate credits and availability | creation submit panel |

```ts
type TemplateDto = {
  id: string
  title: string
  category: string
  scenario: string
  image: string
  videoSrc?: string
  cost: number
  duration: string
  ratio: string
  accent: string
  tags: string[]
  description: string
  config: TemplateConfigDto
}

type TemplateConfigDto = {
  version: string
  workflowType: 'image-to-video' | 'portrait-to-video' | 'video-remix'
  workflowLabel: string
  pricingVersion: string
  pricingMode: 'fixed' | 'dynamic'
  settlement: 'freeze_then_settle'
  inputFields: TemplateInputFieldDto[]
  outputFields: Array<'ratio' | 'duration' | 'resolution' | 'quality'>
  capabilities: string[]
  traceFields: string[]
}
```

Open before backend:

- Decide template publication states: draft, published, paused, archived.
- Decide whether price quote can override template `cost`.

## Assets

| Method | Path | Purpose | Frontend state |
|---|---|---|---|
| `GET` | `/assets` | List user assets | asset library, asset picker |
| `GET` | `/asset-categories` | List system and user categories | asset filter/category manager |
| `POST` | `/asset-categories` | Create user category | asset category manager |
| `DELETE` | `/asset-categories/:categoryId` | Delete user category and move assets to default | asset category manager |
| `POST` | `/assets/uploads` | Create upload receipt/presigned upload target | upload receipt `validating` |
| `POST` | `/assets/uploads/:uploadId/complete` | Finalize uploaded file into asset | `saved`, `rejected`, `failed` |
| `POST` | `/assets/uploads/:uploadId/cancel` | Cancel upload | `cancelled` |
| `PATCH` | `/assets/:assetId` | Rename/update category | asset management |
| `POST` | `/assets/:assetId/archive` | Archive asset | asset management |
| `POST` | `/assets/:assetId/restore` | Restore asset | asset management |
| `POST` | `/assets/:assetId/download-url` | Create signed download URL | download action |

```ts
type AssetDto = {
  id: string
  name: string
  type: string
  kind: 'image' | 'video' | 'portrait' | 'poster' | 'logo'
  image: string
  expiresAt?: string
  expiresLabel: string
  status: 'library' | 'archived'
  source: string
}

type AssetCategoryDto = {
  id: string
  name: string
  scope: 'system' | 'user'
  assetCount: number
  createdAt: string
}

type UploadReceiptDto = {
  id: string
  fileName: string
  status: 'idle' | 'validating' | 'uploading' | 'saved' | 'failed' | 'cancelled' | 'rejected'
  progress: number
  source: string
  message: string
  assetId?: string
}
```

Open before backend:

- Decide direct-to-object-storage upload flow.
- Decide provider-temporary asset renewal and permanent-save behavior.
- Decide server-side rejection codes for virus scan, content safety, file corruption, and unsupported dimensions.

## Generation Tasks

| Method | Path | Purpose | Frontend state |
|---|---|---|---|
| `POST` | `/generation-tasks` | Create generation task and freeze credits atomically | background task strip |
| `GET` | `/generation-tasks` | List user tasks | task page, production-desk queue |
| `GET` | `/generation-tasks/:taskId` | Fetch traceable task detail | task drawer |
| `POST` | `/generation-tasks/:taskId/cancel` | Cancel active task if allowed | future cancel action |
| `POST` | `/generation-tasks/:taskId/retry` | Retry with same snapshot or new idempotency key | future retry action |

```ts
type CreateGenerationTaskRequest = {
  templateId: string
  templateVersion: string
  pricingVersion: string
  workflowType: 'image-to-video' | 'portrait-to-video' | 'video-remix'
  inputAssetIds: string[]
  outputSettings: {
    ratio: string
    duration: string
    resolution: string
    quality: string
  }
  idempotencyKey: string
}

type GenerationTaskDto = {
  id: string
  title: string
  status: 'queued' | 'running' | 'rendering' | 'review' | 'success' | 'refunded'
  progress: number
  cost: number
  updatedAt: string
  image: string
  params: CreateGenerationTaskRequest
  failure?: {
    reason: 'provider_error' | 'timeout' | 'moderation_block' | 'asset_invalid'
    stage: 'input' | 'provider' | 'render' | 'moderation'
    code: string
    retryable: boolean
    message: string
  }
  ledgerIds: string[]
  providerAttemptIds: string[]
  renderAttemptIds: string[]
  moderationRecordIds: string[]
  outputAssetId?: string
}
```

Open before backend:

- Decide whether frontend-generated generation idempotency keys are accepted directly or wrapped by a server-issued submit token.
- Decide task event delivery: polling first, WebSocket/SSE later.
- Decide cancelable statuses.
- Decide retry behavior: same params, changed params, or new task fork.

## Credits And Payments

| Method | Path | Purpose | Frontend state |
|---|---|---|---|
| `GET` | `/credits/summary` | Balance and frozen credits | top bar, credit panel |
| `GET` | `/credits/ledger` | Ledger rows | credit panel |
| `GET` | `/credits/packages` | Recharge packages | credit panel |
| `POST` | `/payments/orders` | Create payment order | `pending` |
| `GET` | `/payments/orders/:orderId` | Poll payment order | `pending`, `paid`, `failed`, `cancelled`, `expired` |
| `POST` | `/payments/orders/:orderId/cancel` | Cancel pending order | `cancelled` |
| `POST` | `/payments/webhooks/:provider` | Provider payment callback | backend only |

```ts
type CreditSummaryDto = {
  balance: number
  frozenCredits: number
}

type LedgerRowDto = {
  id: string
  title: string
  amount: string
  source: string
  kind: 'freeze' | 'settlement' | 'release' | 'recharge' | 'reward'
  status: 'frozen' | 'settled' | 'released' | 'credited' | 'granted'
  refId: string
  createdAt: string
  note: string
  idempotencyKey: string
}

type PaymentOrderDto = {
  id: string
  packageName: string
  amount: string
  credits: number
  status: 'idle' | 'pending' | 'paid' | 'failed' | 'cancelled' | 'expired'
  channel: string
  createdAt: string
  expiresAt: string
  note: string
}
```

Open before backend:

- Decide first payment provider.
- Decide webhook idempotency key rules.
- Decide how app-store/native payments will map into credit ledger later.

## Backend Start Gate

Backend can start after these are accepted:

- first backend stack and repo layout are chosen;
- API contract above is approved as MVP baseline;
- provider/payment/auth secrets strategy is selected;
- mock provider behavior is defined for success, provider error, moderation block, timeout, and asset-invalid paths;
- database models are mapped from these DTOs.
