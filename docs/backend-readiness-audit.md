# Backend Readiness Audit

Status: Phase 1 ready
Last updated: 2026-06-26

This audit states what backend work can start now and what must still wait.

## Current Decision

The project is ready to start the first backend slice:

- API client shell;
- read-only templates;
- read-only credit summary, packages, and ledger;
- read-only task list/detail;
- read-only asset list and categories;
- read-only reward campaigns;
- read-only session state.

The project is not yet ready to start these backend mutations:

- real upload and object storage;
- generation task creation against providers;
- credit freeze/settlement/release as real money-adjacent operations;
- payment order creation and callback reconciliation;
- signup or campaign reward claim;
- provider API key management and provider job execution.

## Evidence

- `src/App.tsx` is a thin composition shell.
- `src/hooks/usePrototypeStore.ts` loads read-only data through `aigcApiClient` and keeps fallback prototype state.
- `src/api/contracts.ts` defines the `AigcApiClient` port.
- `src/api/httpClient.ts` implements endpoint calls.
- `src/api/prototypeClient.ts` implements local fallback behavior.
- `src/api/config.ts` switches client mode with `VITE_AIGC_API_MODE`.
- `src/api/mappers.ts` isolates DTO-to-UI conversion.
- `docs/backend-api-contract.md` defines endpoint and DTO baseline.
- `docs/backend-first-replacement-checklist.md` defines the first backend handoff slice.
- `docs/backend-integration-sequence.md` defines phased integration order.

## Verified Gates

- Page components do not need to import endpoint paths.
- App can run in prototype mode without a backend.
- Read-only DTOs can map into current UI types.
- Asset categories and reward campaigns are represented in the API contract.
- First image-to-video creation stays in the current frontend interaction model.

## Remaining Before Mutation APIs

- Choose backend stack and repository layout.
- Choose database schema and migration approach.
- Choose auth/session provider.
- Choose object storage and upload signing flow.
- Choose payment provider and webhook idempotency rules.
- Choose provider secret strategy and provider execution model.
- Define mock provider responses for success, provider error, moderation block, timeout, and invalid asset.

## Start Recommendation

Start backend with `docs/backend-first-replacement-checklist.md`.

Do not start with generation, payment, or provider integrations.
