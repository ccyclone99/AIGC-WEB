# Technical Stack Decision

Status: Draft decision

This document defines the recommended technical stack for AIGC Web. The goal is to choose a stack that is Agent-friendly, type-safe, maintainable, queue/worker capable, and suitable for future web, mini program, Android, and iOS clients.

## Decision Principles

- Prefer one primary language across frontend, backend, workers, templates, and renderers.
- Prefer strong typing and schema validation.
- Prefer boring, proven infrastructure over novelty.
- Keep backend API-first so future clients can reuse it.
- Use modular monolith first, not premature microservices.
- Keep media/rendering work in workers, not API requests.
- Keep provider integrations behind adapters.
- Keep deployments container-friendly and cloud-portable.

## Primary Language

Use TypeScript across:

- Frontend web app.
- Backend API.
- Background workers.
- Template definitions.
- Provider adapters.
- Render adapters.
- Test suites.

Why:

- Shared types between template config, API, frontend, and worker logic.
- Easier for Agents to modify consistently.
- Aligns with React, Remotion, Node backend, and schema tooling.

## Frontend Stack

Recommended:

- React.
- Vite.
- TypeScript.
- React Router or TanStack Router for routing.
- TanStack Query for server state.
- Zustand for lightweight local UI state if needed.
- Tailwind CSS for utility styling.
- Radix UI primitives for accessible base components.
- Motion for React for card/transition animations.
- Lucide icons.
- Playwright for E2E and visual interaction checks.

Rationale:

- The current project already uses Vite + React + TypeScript.
- Vite is fast for Agent-driven iteration and prototypes.
- React pairs naturally with Remotion for video templates.
- Motion for React covers the planned card flip/hover/shared-layout prototypes.

Notes:

- If SEO/content marketing becomes central later, evaluate adding prerendering or a separate content/landing layer.
- Do not migrate to a heavier SSR framework unless there is a clear need.

## Backend Stack

Recommended:

- Node.js.
- TypeScript.
- NestJS with Fastify adapter where useful.
- Zod for template/config/runtime schema validation.
- Prisma ORM.
- PostgreSQL.
- Redis.
- BullMQ for queues.
- Pino for structured logging.
- OpenTelemetry for traces/metrics.
- Sentry for application error monitoring.

Rationale:

- NestJS gives clear modules for auth, templates, tasks, credits, assets, providers, admin/Agent operations, and workers.
- Prisma works well with PostgreSQL and migrations.
- BullMQ is a Redis-backed queue suitable for background jobs and worker processing.
- PostgreSQL is a strong default for transactional records such as credit ledger, tasks, template versions, and audit logs.

## Database

Recommended:

- PostgreSQL as the source of truth.
- Prisma Migrate for schema migrations.

Use PostgreSQL for:

- Users.
- User identities.
- Credit ledger.
- Recharge orders.
- Campaigns.
- Templates and template versions.
- Generation tasks and task events.
- Provider attempts.
- Render attempts.
- Audit logs.

Do not use cache as source of truth for credits or tasks.

## Queue and Worker

Recommended:

- Redis + BullMQ.
- Separate worker process from API process.

Queues:

- generation
- provider-polling
- rendering
- asset-inspection
- notification
- cleanup

Rules:

- Jobs must be idempotent.
- Job payloads should include task ID and schema version.
- Workers should gracefully shutdown.
- Worker events should write task events and logs.

## Object Storage

Recommended:

- S3-compatible object storage abstraction.

Use for:

- Uploaded images.
- Generated videos.
- Posters/thumbnails.
- Temporary provider outputs.
- Render logs/artifacts if needed.

Provider can be chosen later:

- AWS S3.
- Cloudflare R2.
- Tencent COS.
- Alibaba OSS.
- MinIO for local/staging.

The application should depend on a storage adapter, not direct provider-specific code everywhere.

## Video Rendering Stack

Recommended:

- Remotion for programmable template composition.
- FFmpeg for media processing/finalization.
- Provider direct output for simple templates.
- Cloud JSON-to-video APIs as optional fallback or acceleration.
- Jianying/CapCut only as optional adapter after official/stable API access is verified.

Why:

- Remotion is React/TypeScript-friendly and fits Agent-generated video templates.
- FFmpeg is the dependable base tool for transcoding, stitching, audio/video processing, and final packaging.

## Template System Tooling

Recommended:

- Template definitions as TypeScript config modules.
- Zod schemas for validation.
- Fixture files per template.
- Template validation CLI.
- Preview route/page for frontend form rendering.
- Mock provider and mock renderer for dry-runs.

Why:

- Agents can edit TypeScript configs safely.
- Schema validation catches broken templates before publish.
- Fixtures make template behavior testable.

## Auth Stack

Recommended direction:

- Backend-owned auth module in NestJS.
- `User` and `UserIdentity` model controlled by our database.
- Secure HTTP-only sessions for web.
- Token/session strategy that can support mobile clients later.
- OAuth connectors for third-party providers.
- QR login implemented as first-party backend flow.

Why:

- Supports email, phone, QR, WeChat, Google, Apple, and future providers under one identity model.
- Avoids being locked into a hosted auth provider that may not fit mini program/app requirements.

## Payment Stack

Recommended direction:

- Payment provider abstraction.
- Stripe first if global web launch is first.
- WeChat Pay/Alipay if China-oriented launch is first.
- Apple IAP and Google Play Billing evaluated before native app credit sales.

Rules:

- Payment provider callbacks/webhooks must be verified and idempotent.
- Payment orders are separate from credit ledger.
- Credit grants happen only after verified payment success.

## Admin and Agent Operations

Recommended:

- Build admin routes in the same frontend app initially under protected `/admin`.
- Use backend role permissions.
- Agent operations exposed through safe backend APIs and audit logs.

Reason:

- Faster MVP.
- Shared design system.
- Can split admin into separate app later if needed.

## Testing Stack

Recommended:

- Vitest for unit/integration tests.
- Playwright for frontend E2E and interaction testing.
- Mock provider adapters.
- Mock renderer adapter.
- Template validation CLI in CI.

Focus:

- Credit ledger idempotency.
- Task lifecycle.
- Provider adapter contracts.
- Template validation.
- Login and payment flows.
- Frontend creation flow.

## Observability Stack

Recommended:

- Pino structured logs.
- OpenTelemetry instrumentation.
- Sentry for application errors and frontend/backend error tracking.
- Metrics export compatible with Prometheus/Grafana or hosted observability later.

Keep logs redacted and structured.

## Deployment Stack

Recommended:

- Docker-first services.
- Separate containers/processes for frontend build serving, backend API, workers, and renderer workers.
- Docker Compose for local infrastructure.
- Production can run on any container-friendly platform.

Local services:

- PostgreSQL.
- Redis.
- MinIO or local S3-compatible storage.
- Mock provider.
- Mock payment.

Production provider can be selected later based on target region and budget.

## Monorepo Direction

Recommended:

- Use a monorepo when backend is added.

Suggested package layout:

```txt
apps/web
apps/api
apps/worker
apps/renderer-worker
packages/templates
packages/shared
packages/provider-adapters
packages/render-adapters
packages/config
```

The current Vite app can become `apps/web` when the repo is reorganized.

## Initial Implementation Order

1. Keep current Vite React web app.
2. Add docs/spec and frontend prototypes.
3. Convert to monorepo when backend work starts.
4. Add NestJS API.
5. Add PostgreSQL + Prisma.
6. Add Redis + BullMQ worker.
7. Add template validation package.
8. Add mock provider and mock renderer.
9. Add credit ledger/task lifecycle.
10. Add real provider/payment integrations after core flow works.

## References

- Vite guide: https://vite.dev/guide/
- React build tooling guidance: https://react.dev/learn/build-a-react-app-from-scratch
- NestJS queues: https://docs.nestjs.com/techniques/queues
- NestJS Prisma recipe: https://docs.nestjs.com/recipes/prisma
- Prisma PostgreSQL quickstart: https://www.prisma.io/docs/prisma-orm/quickstart/postgresql
- Prisma Migrate: https://www.prisma.io/docs/orm/prisma-migrate
- BullMQ docs: https://docs.bullmq.io/
- Remotion server-side rendering: https://www.remotion.dev/docs/ssr
- Remotion renderer APIs: https://www.remotion.dev/docs/renderer
- Playwright: https://playwright.dev/
- OpenTelemetry JavaScript: https://opentelemetry.io/docs/languages/js/
- Sentry React: https://docs.sentry.io/platforms/javascript/guides/react/
- Sentry Node: https://docs.sentry.io/platforms/javascript/guides/node/

## Decision

Use a TypeScript-first stack: React + Vite frontend, NestJS backend, PostgreSQL + Prisma, Redis + BullMQ workers, S3-compatible object storage, Remotion + FFmpeg rendering, Zod template validation, Vitest/Playwright testing, Pino/OpenTelemetry/Sentry observability, and Docker-first deployment.
