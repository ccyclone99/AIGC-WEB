# Backend Interface Prep

Status: Draft
Last updated: 2026-06-26

This document defines the frontend-to-backend boundary that must be stable before backend implementation starts.

Use [backend-api-contract.md](./backend-api-contract.md) for the endpoint and DTO table derived from this prep document, [backend-integration-sequence.md](./backend-integration-sequence.md) for the replacement order, [backend-first-replacement-checklist.md](./backend-first-replacement-checklist.md) for the first backend handoff slice, and [backend-readiness-audit.md](./backend-readiness-audit.md) for the current start/no-start decision.

## Current Frontend Source Boundaries

- `src/types.ts`: shared UI/domain types that should guide initial API DTO names, including template, task, asset, ledger, payment order, upload receipt, and signup risk states.
- `src/api/contracts.ts`: frontend API adapter port and DTO contracts for auth, templates, assets, generation tasks, credits, and payments.
- `src/api/mappers.ts`: DTO-to-UI mappers for backend timestamps, expiry labels, generation input snapshots, ledger rows, assets, payments, QR sessions, and upload receipts.
- `src/api/client.ts`: API client factory that can return the local prototype client or the HTTP client.
- `src/api/config.ts`: environment-driven API client entry using `VITE_AIGC_API_MODE` and `VITE_AIGC_API_BASE_URL`.
- `src/api/httpClient.ts`: HTTP implementation of `AigcApiClient` using the endpoint paths in `backend-api-contract.md`.
- `src/api/prototypeClient.ts`: local fallback implementation of `AigcApiClient` backed by prototype seed data.
- `src/prototypeData.ts`: current local seed data for templates, assets, tasks, credit packages, payment order, upload receipt, signup risk checks, filters, and ledger rows.
- `src/hooks/usePrototypeStore.ts`: current local prototype state and mutation boundary for navigation, templates, assets, uploads, generation tasks, credits, payments, auth, and overlays. This is the first replacement point for an API-backed store.
- `src/domain.ts`: pure frontend business helpers for template input labels, output defaults, asset eligibility, category filtering, and duplicate output comparison.
- `src/viewModels.ts`: shared user-facing copy for task state, credit state, QR login state, signup reward, risk status, failure labels, and asset empty states. Backend state enums should map here first during API integration.
- `src/components/AuthPanel.tsx`: login/register, QR login state, signup reward, and signup risk checks.
- `src/components/AssetPicker.tsx`: creation asset picker, category filtering, usable/preview-only asset handling, and upload receipt actions.
- `src/components/CreditPanel.tsx`: credit balance, payment order lifecycle, package selection, and ledger rows.
- `src/components/HomeView.tsx`: first-viewport product positioning, primary entry points, and use-case routing for the public website surface.
- `src/components/MeView.tsx`: thin personal-space shell that owns tab selection and composes asset, credit, and account panels.
- `src/components/AssetManager.tsx`: user asset library management, upload receipt handling, category CRUD, archive/restore, reuse, download, and expiring asset states.
- `src/components/AccountPanel.tsx`: account login/register surface, QR login, signup reward, and account security/binding summary.
- `src/components/TopBar.tsx`: application-level navigation, credit entry, and account entry shell.
- `src/components/OverlayPrimitives.tsx`: shared modal, drawer, sheet, lightbox, and toast primitives used by the prototype overlays.
- `src/components/AppOverlays.tsx`: overlay content orchestration for template detail, task detail, credits, auth, filters, asset picker, preview, and toast.
- `src/components/PageTitle.tsx`: shared page title block for page-level views.
- `src/components/StudioPage.tsx`: first image-only creation console, including selected asset state, output settings, duplicate active-task guard, estimated credit freeze copy, submit readiness, and background task summary.
- `src/components/TaskDetail.tsx`: task traceability, task failure details, credit state, and output asset actions.
- `src/components/TasksView.tsx`: task list page, task lifecycle summary, and task row credit/status presentation.
- `src/components/TemplatesView.tsx`: template gallery, template detail contract view, video-template support state, and template filter sheet content.
- `src/components/UploadReceiptPanel.tsx`: upload receipt status, retry, and cancel UI.
- `src/components/WorkbenchView.tsx`: visible `生产台` production hub, creation entry, running task summary, recent assets, and credit status entry.
- `src/App.tsx`: thin page composition shell that wires the prototype store into page components and overlays.

Backend integration should switch `src/api/config.ts` from prototype mode to HTTP mode behind `VITE_AIGC_API_MODE`, route responses through `src/api/mappers.ts`, then replace `src/prototypeData.ts` and `src/hooks/usePrototypeStore.ts` gradually. It should not require rewriting page components first.

## API Groups Needed

### Auth and Account

Required capabilities:

- session status;
- login by phone/code or password;
- QR login status polling;
- third-party login callback;
- registration;
- signup bonus claim result;
- account risk flags that affect bonus and generation submit.

Current frontend coverage:

- QR login has `waiting`, `scanned`, `confirmed`, `expired`, and `rejected` status types and visible UI states;
- signup reward has `eligible`, `granted`, `claimed`, and `risk_blocked` status types;
- the account surface shows reward state and device/IP/phone risk checks;
- reward claim writes a `reward` ledger row and prevents repeat claim in local state.

Remaining gap before backend:

- QR polling interval, single-use token invalidation, and provider callback error copy still need final API-level wording;
- retry and appeal states for risk-blocked reward claims are defined.

### Templates

Required capabilities:

- list published templates;
- fetch template detail by id/version;
- expose `Template.config`;
- expose preview image/video;
- expose pricing version and cost estimate;
- expose whether the template can be used by the current user.

First API shape:

```ts
GET /api/templates
GET /api/templates/:templateId
POST /api/templates/:templateId/quote
```

The frontend expects template records to preserve:

- `id`
- `title`
- `category`
- `scenario`
- `image`
- `videoSrc`
- `cost`
- `duration`
- `ratio`
- `tags`
- `description`
- `config.version`
- `config.workflowType`
- `config.pricingVersion`
- `config.inputFields`
- `config.outputFields`
- `config.capabilities`
- `config.traceFields`

### Assets

Required capabilities:

- upload image asset;
- list user assets by status/category/kind;
- rename asset;
- update category;
- archive/restore asset;
- download or sign asset URL;
- mark expiry/retention state;
- persist provider outputs into user assets.

First API shape:

```ts
GET /api/assets
POST /api/assets/uploads
PATCH /api/assets/:assetId
POST /api/assets/:assetId/archive
POST /api/assets/:assetId/restore
POST /api/assets/:assetId/download-url
```

Current frontend coverage:

- upload receipts have `idle`, `validating`, `uploading`, `saved`, `failed`, `cancelled`, and `rejected` status types;
- asset picker and asset library show the latest upload receipt, progress, source, file name, and request id;
- unsupported format and oversized file paths produce failed upload receipts;
- server-side safety/content rejection has a visible rejected state;
- upload receipt UI exposes cancel for in-progress uploads and retry/reselect for failed, cancelled, or rejected uploads.

Remaining gap before backend:

- expired or provider-temporary assets need stronger renewal/save-permanently actions.

### Generation Tasks

Required capabilities:

- validate task input against `Template.config`;
- create task and freeze credits atomically;
- list tasks;
- fetch task detail with traceability;
- poll or subscribe to task status;
- expose provider/render/moderation attempts;
- expose output asset;
- release frozen credits on failure, timeout, or review block.

First API shape:

```ts
POST /api/generation-tasks
GET /api/generation-tasks
GET /api/generation-tasks/:taskId
POST /api/generation-tasks/:taskId/cancel
```

Task creation payload must snapshot:

- `templateId`
- `templateVersion`
- `pricingVersion`
- `workflowType`
- `inputAssetIds`
- `outputSettings`
- `idempotencyKey`

Current frontend coverage:

- submit duplicate active-task handling is visible for the same template, template version, image, and output settings;
- frontend task creation now generates `idempotencyKey` from template version, input asset, and output settings;
- task details snapshot template version, pricing version, workflow, input asset, and output settings;
- task details expose `idempotencyKey`;
- task failure details now include stage, reason, error code, retryability, and message;
- visible failure examples include provider error, moderation block, and invalid input asset.

Remaining gap before backend:

- backend must decide whether frontend-generated generation idempotency keys are accepted directly or wrapped by a server-issued submit token;
- cancel/retry actions still need API-level payloads and copy.

### Credits and Payments

Required capabilities:

- current balance and frozen credits;
- package list;
- create recharge order;
- payment status polling/callback;
- credit ledger list;
- freeze, settlement, release, recharge, and reward rows.

First API shape:

```ts
GET /api/credits/summary
GET /api/credits/ledger
GET /api/credits/packages
POST /api/payments/orders
GET /api/payments/orders/:orderId
```

Current frontend coverage:

- payment orders have `idle`, `pending`, `paid`, `failed`, `cancelled`, and `expired` status types;
- credit panel creates a pending order before settlement;
- paid orders write recharge ledger rows, while failed/expired orders do not change balance;
- pending orders can be cancelled from the credit panel;
- freeze, settlement, release, recharge, and reward ledger rows have structured ids, status, references, time, note, source, and signed amount.

Remaining gap before backend:

- payment callback polling and provider-specific error copy still need final interaction wording;
- activity reward beyond signup still needs campaign-level records.

## Backend Readiness Gate

Backend work should start only when these are true:

- frontend modules are split enough that API replacement does not touch unrelated page markup;
- the first image-only creation flow is visually accepted;
- auth/bonus abuse states are represented;
- asset upload and management states are complete enough for real network failures;
- task detail has stable trace fields;
- credit/payment states have stable user-facing language;
- one backend-ready API contract exists for templates, assets, tasks, and credits.

Current status: ready for the first read-only backend slice, but not ready for mutation-heavy backend work. The code has completed the first required module split, extracted home/production-desk/account/asset/auth/payment/asset-picker/studio/task-detail panels, isolated overlay orchestration, moved local prototype mutations into a hook boundary, and added a typed frontend API adapter with prototype and HTTP clients. Read-only templates, credit summary/packages/ledger, tasks, assets, asset categories, reward campaigns, and session state can now be integrated behind `VITE_AIGC_API_MODE=http`.

Immediate frontend boundary work before backend:

- keep `src/App.tsx` as a thin composition shell;
- start with the read-only backend slice described in `docs/backend-first-replacement-checklist.md`;
- delay generation, upload, payment, and reward-claim mutations until backend stack, database, secret strategy, object storage, payment provider, and provider mock behavior are selected;
- continue routing status copy through `src/viewModels.ts` so API enum changes are localized;
- add browser-level smoke coverage for the first image-only creation loop, asset picker, task detail, credit order, and account reward states.
