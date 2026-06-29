# Backend Integration Sequence

Status: Draft
Last updated: 2026-06-26

This document defines the order for replacing the current frontend prototype store with backend APIs after the frontend review gate is accepted.

## Principle

- Page components stay unchanged as much as possible.
- `src/api/contracts.ts` is the API adapter port.
- `src/api/client.ts` chooses between prototype and HTTP client mode.
- `src/api/config.ts` reads `VITE_AIGC_API_MODE` and `VITE_AIGC_API_BASE_URL`.
- `src/api/mappers.ts` converts backend DTOs into the existing UI types.
- `src/hooks/usePrototypeStore.ts` is replaced gradually, not all at once.
- Every phase must keep the first image-to-video creation flow usable.

## Phase 0: Frontend Gate

Do not start backend integration until these are accepted:

- first image-only creation page is visually accepted;
- homepage and production desk separation is accepted;
- asset library management is accepted;
- credit freeze, settlement, release, recharge, and signup reward states are accepted;
- task detail trace fields are accepted;
- provider failure states are accepted;
- API contract and adapter port are accepted as MVP baseline.

## Phase 1: API Client Shell

Goal: add a real client implementation without changing page behavior.

Scope:

- keep the existing `AigcApiClient` factory against `src/api/contracts.ts`;
- configure `src/api/httpClient.ts` behind `VITE_AIGC_API_MODE=http`;
- keep current prototype data as fallback;
- route DTO responses through `src/api/mappers.ts`;
- add centralized error handling for `ApiResult.error.code`, `message`, and `traceId`.

Verification:

- app loads with fallback data when backend is absent;
- app can switch to backend client behind one config flag;
- no page component imports raw endpoint paths.

## Phase 2: Read-Only Data

Goal: replace seed data that does not mutate credits or assets.

Order:

1. Templates list and template detail.
2. Credit summary, packages, and ledger.
3. Task list and task detail.
4. User assets list.
5. Asset categories list.
6. Reward campaigns list.
7. Auth session read.

Verification:

- template gallery, production desk, tasks, asset library, and credit panel render from API data;
- DTO mapping keeps existing UI copy stable;
- empty and error states are visible.

## Phase 3: Asset Upload And Management

Goal: make user assets real before real generation tasks.

Order:

1. Create upload receipt.
2. Complete upload into an asset.
3. Cancel/retry upload receipt.
4. Rename, category update, archive, restore.
5. Create and delete user asset categories.
6. Signed download URL.

Verification:

- asset picker still prioritizes library assets;
- first grid item remains upload entry;
- unsupported format, oversized file, safety rejection, and retry states are traceable;
- provider-temporary assets expose expiry clearly.

## Phase 4: Generation Task Creation

Goal: connect the core creation path.

Order:

1. Quote selected template and output settings.
2. Create generation task atomically with credit freeze.
3. Poll task detail or task list.
4. Settle successful task and persist output asset.
5. Release frozen credits for failure, timeout, moderation block, or invalid asset.

Verification:

- submit keeps the user in the creation page;
- duplicate submit guard uses idempotency key;
- task detail shows template version, pricing version, workflow, input asset ids, output settings, failure code, and trace ids;
- failure release is visible in credit ledger.

## Phase 5: Auth, Rewards, And Payments

Goal: replace remaining account and payment flows.

Order:

1. Session and phone/password login.
2. QR session create/poll/expiry/rejection.
3. Third-party login start and callback handling.
4. Signup reward claim with risk checks.
5. Activity reward campaign claim with risk checks.
6. Payment order create/poll/cancel.
7. Provider callback reconciliation.

Verification:

- signup reward cannot be repeatedly claimed;
- campaign rewards cannot be repeatedly claimed;
- risk-blocked reward state is visible;
- payment success writes ledger once;
- failed/cancelled/expired orders do not change balance;
- trace ids are available for account and payment errors.

## Stop Conditions

Stop backend integration and return to frontend/spec work if:

- a required backend response cannot map into existing UI types without changing accepted UX;
- an idempotency or ledger rule is ambiguous;
- provider expiry semantics cannot support the current asset library behavior;
- payment or reward states need new user-facing copy.
