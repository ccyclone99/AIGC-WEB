# MVP Boundary and Implementation Backlog

Status: Draft proposal

This document defines the first practical build scope for AIGC Web. It separates frontend prototype validation from the first product-grade generation loop.

## MVP Strategy

Build in two layers:

1. Frontend prototype layer: validate visual direction, template discovery, creation workspace, motion, and core user flow.
2. Product-grade loop layer: implement account, credits, templates, tasks, mock provider, asset storage, and traceability.

Do not start by integrating every real AI provider, payment provider, native app, or advanced admin feature.

## Product-Grade MVP Goal

A logged-in user can:

1. Browse ecommerce-first templates.
2. Choose a product video template or portrait/fashion template.
3. Upload/select assets.
4. Enter simple descriptions/options.
5. See credit cost.
6. Submit generation.
7. Credits are frozen.
8. A mock or real provider worker produces an output.
9. Task status updates.
10. On success, credits settle and user can preview/download/save output.
11. On failure/timeout/block, credits release and user sees clear status.

Admin/Agent can:

1. Inspect the task.
2. See submitted inputs, task events, credit ledger, provider attempts, render attempts if any, and logs.
3. Review template versions.
4. Diagnose failures.

## Phase 0: Current State

Already done:

- Vite + React + TypeScript project initialized.
- Documentation foundation created.
- Requirements and architecture direction captured.
- Technical stack chosen.

## Phase 1: Frontend Prototype Pack

Purpose:

- Decide visual direction before building full app flows.

Build:

- `/prototypes`
- Premium Flip Gallery.
- Cinematic Hover Preview Cards.
- Bento Template Board.
- Before/After Reveal Cards.
- Card-to-Workspace Transition.

Requirements:

- Desktop and mobile responsive.
- Tap alternatives for hover.
- Reduced-motion fallback.
- Realistic ecommerce/portrait placeholder assets.
- Polished UI, not generic dashboard.

Deliverable:

- User reviews prototype options and selects/combines direction.

## Phase 2: Web App Skeleton

Build:

- App shell.
- Home page.
- Template gallery.
- Template detail or overview panel.
- Creation workspace.
- Task center.
- Credit center.
- Asset library.
- Login UI placeholder.

Use:

- Mock data.
- Mock tasks.
- Mock credits.
- Mock generated outputs.

Goal:

- Validate user journey before backend integration.

## Phase 3: Monorepo and Backend Foundation

Reorganize:

```txt
apps/web
apps/api
apps/worker
packages/shared
packages/templates
packages/provider-adapters
packages/render-adapters
```

Add:

- NestJS API.
- PostgreSQL + Prisma.
- Redis + BullMQ.
- S3-compatible storage adapter.
- Docker Compose for local infra.
- Shared TypeScript types.

## Phase 4: Core Data and Business Rules

Implement:

- User.
- UserIdentity.
- UserCreditAccount.
- CreditLedgerEntry.
- TemplateDefinition.
- TemplateVersion.
- Asset.
- GenerationTask.
- GenerationTaskEvent.
- ProviderAttempt.
- AuditLog.

Implement rules:

- Signup bonus idempotency.
- Campaign reward placeholder.
- Credit freeze/settle/release.
- Task state transitions.
- Pricing preview.
- Template version binding.

## Phase 5: Template Engine MVP

Implement:

- Template-as-code package.
- Template schema validation.
- Two initial templates:
  - Product image to ecommerce short video.
  - Portrait/fashion transformation video.
- Template fixtures.
- Pricing rules.
- Input schemas.
- Frontend form rendering from template schema.
- Mock workflow execution.

Do not build:

- Full drag-and-drop template editor.
- Public marketplace.
- Complex brand kit UI.

## Phase 6: Generation Loop With Mock Provider

Implement:

- Asset upload.
- Generation submit.
- Credit freeze.
- Queue job.
- Mock provider adapter.
- Mock renderer adapter if needed.
- ProviderAttempt records.
- Task events.
- Output asset persistence.
- Credit settle on success.
- Credit release on failure/timeout/block.

Why mock first:

- Validates task/credit/logging before provider cost is involved.
- Makes tests stable.
- Allows frontend to finish without waiting on provider selection.

## Phase 7: Admin/Agent Traceability MVP

Build minimal admin views:

- Task search.
- Task detail timeline.
- Credit ledger lookup.
- Provider attempt lookup.
- Template version list.
- Deterministic failure diagnosis summary from structured records.

Agent support:

- Generate diagnosis summary from structured records.
- Prepare manual credit adjustment proposal, but require approval.

## Phase 8: Real Provider and Render Integration

After mock loop works:

- Choose first real provider for ecommerce/product video.
- Choose first real provider for portrait/fashion if different.
- Implement adapter contract tests.
- Persist provider outputs before URL expiry.
- Add provider cost tracking.
- Add real failure/retry/fallback paths.

Rendering:

- Add Remotion/FFmpeg only when a selected template requires post-production.
- Keep direct provider output path for simple templates.

## Phase 9: Payment/Recharge MVP

If launch needs real payment:

- Choose provider by launch region.
- Implement payment order.
- Implement payment session.
- Verify webhook.
- Grant credits idempotently.

If payment is delayed:

- Keep recharge package/order abstraction.
- Use admin/test credit grants.
- Do not fake balance outside ledger.

## MVP In Scope

User-facing:

- Home page.
- Template gallery.
- Creation workspace for two template categories.
- Login-gated submit.
- Credit balance.
- Task center.
- Asset upload/library.
- Download/save output.
- Basic notifications.

Backend:

- API-first backend.
- Template registry.
- Credit ledger.
- Generation task lifecycle.
- Queue/worker.
- Mock provider.
- Asset storage.
- Audit/task logs.

Admin/Agent:

- Task traceability.
- Credit ledger lookup.
- Template version list.
- Provider attempt records.
- Deterministic diagnosis summary from structured records.

Quality:

- Type/lint.
- Template validation.
- Credit idempotency tests.
- Task lifecycle tests.
- Provider adapter contract tests.
- Frontend E2E smoke.
- Log redaction tests.

## MVP Out of Scope

- Native apps.
- Mini program.
- Public freeform model studio.
- Public user-facing Agent.
- Team workspace UI.
- Full project management.
- Full brand kit editor.
- Drag-and-drop template editor.
- Public template marketplace.
- Advanced recommendation engine.
- Full subscription plans.
- Complex payment/refund policy automation.
- Public share links.
- Direct social publishing.
- Full internationalization.
- Advanced fraud/risk scoring.

## First Two Templates

### Ecommerce Product Short Video

Inputs:

- Product main image.
- Optional detail images.
- Product selling points.
- Target platform.
- Style.
- Duration.
- Aspect ratio.

Output:

- Short product marketing video.
- Watermark if free credits.
- Downloadable MP4.

### Portrait/Fashion Transformation Video

Inputs:

- Portrait image.
- Desired style/outfit direction.
- Optional gender/style preference.
- Duration.
- Aspect ratio.

Output:

- Portrait/fashion transformation video.
- Explicit portrait consent required.
- Watermark if free credits.

## Initial Backlog

### Frontend

- Build prototype route.
- Build selected visual system after review.
- Build app shell.
- Build template gallery.
- Build creation workspace.
- Build task center.
- Build credit center.
- Build asset library.
- Build notification UI.

### Backend

- Add monorepo.
- Add NestJS API.
- Add Prisma/PostgreSQL.
- Add Redis/BullMQ.
- Add storage adapter.
- Implement auth skeleton.
- Implement template registry.
- Implement credit ledger.
- Implement generation tasks.
- Implement mock provider.
- Implement worker.
- Implement audit logs.

### Templates

- Create TemplateConfig schema.
- Create validation CLI.
- Create ecommerce template.
- Create portrait/fashion template.
- Create fixtures.

### Testing

- Credit idempotency tests.
- Task state machine tests.
- Template validation tests.
- Mock provider contract tests.
- Upload validation tests.
- Frontend E2E smoke.

## Readiness Criteria To Start Implementation

Implementation can start when:

- MVP boundary is accepted.
- First visual prototype scope is accepted.
- Technical stack is accepted.
- First two template definitions are accepted at product level.
- Payment real-vs-placeholder decision is made.
- Provider mock-first approach is accepted.

## Decision

Start with frontend prototypes, then build the product-grade mock generation loop before real provider/payment integration.
