# System Architecture Direction

Status: Draft proposal

This document defines the high-level technical architecture direction for AIGC Web. The system starts as a website but should be designed so future mini program, Android, and iOS clients can reuse the same backend capabilities.

## Architecture Principles

- Web-first, API-first.
- Future clients should consume the same backend APIs as the website.
- Keep user-facing clients thin: frontend handles experience, backend owns business rules.
- Template is the core product asset.
- Generation task is the core runtime unit.
- Credit ledger is the source of truth for user credit changes.
- Long-running generation should be handled by background workers, not synchronous web requests.
- Provider/model integrations should be isolated behind adapters.
- Logs, task events, provider attempts, and credit transactions must be traceable.
- Start with a pragmatic modular backend, then split services only when scale requires it.
- Agent-first operations require structured data, strong validation, and safe operational APIs.

## Recommended High-Level Shape

Use a modular monolith plus background workers for the first production version.

Why:

- Faster to build and easier for Agents to modify safely.
- Easier to keep transactions consistent for tasks and credits.
- Avoids premature microservice complexity.
- Still allows clear module boundaries for later splitting.

Core runtime pieces:

- Web frontend.
- Backend API application.
- Background worker application.
- Database.
- Object storage.
- Queue.
- Log/analytics storage.
- AI provider adapters.
- Admin/Agent operation surface.

## Main Backend Modules

### Auth and User Module

Responsibilities:

- User registration and login.
- User profile.
- Signup bonus credit trigger.
- Session/token management.
- Future client compatibility.

### Template Registry Module

Responsibilities:

- Store published template versions.
- Expose template metadata to frontend.
- Expose template config to backend generation workflow.
- Preserve immutable template versions.
- Support publish, pause, archive, rollback.
- Link repo-defined templates to database-published versions.

### Asset Module

Responsibilities:

- Handle user uploads.
- Store original images.
- Store generated videos and posters.
- Run or record asset inspections.
- Generate secure access URLs.
- Track asset ownership and retention.

### Generation Task Module

Responsibilities:

- Create generation tasks.
- Store submitted parameters.
- Store template version reference.
- Manage task states.
- Emit task events.
- Expose task status and history to users.
- Expose task traceability to admin/Agent.

### Credit Ledger Module

Responsibilities:

- Maintain credit ledger.
- Freeze credits.
- Confirm spend.
- Release frozen credits.
- Process refunds.
- Record signup bonus, recharge, admin grants, adjustments, expiration.
- Guarantee idempotency.

### Pricing Module

Responsibilities:

- Calculate required credits from template pricing rules.
- Store pricing breakdown with each task.
- Keep pricing version traceable.

### Workflow Engine Module

Responsibilities:

- Interpret template workflow steps.
- Execute generation pipeline.
- Handle retries and fallback.
- Record each provider attempt.
- Move task through internal lifecycle states.

### Provider Adapter Module

Responsibilities:

- Normalize external AI/video provider APIs.
- Build provider request payloads.
- Parse provider responses.
- Map provider error codes to internal errors.
- Support retries and fallback providers.
- Avoid leaking provider details into templates or frontend.

### Moderation Module

Responsibilities:

- Check user text and images before generation.
- Check generated outputs if needed.
- Block invalid or policy-violating content.
- Record moderation labels and decisions.

### Admin and Agent Operations Module

Responsibilities:

- Provide searchable task, credit, user, template, provider, and log views.
- Provide safe Agent-facing operation APIs.
- Generate diagnosis summaries.
- Prepare template publish and credit adjustment actions.
- Require approval for high-risk actions.

### Notification Module

Responsibilities:

- Notify frontend when task status changes.
- Future support for email, SMS, app push, or mini program messages.

## Core Data Stores

### Relational Database

Use for strongly consistent business records:

- Users.
- Template published versions.
- Generation tasks.
- Task events.
- Credit ledger.
- Recharge/payment orders.
- Provider attempts.
- Audit logs.

### Object Storage

Use for files:

- Uploaded images.
- Generated videos.
- Posters/thumbnails.
- Preview assets.
- Provider raw file outputs when needed.

### Queue

Use for async work:

- Generation tasks.
- Provider polling.
- Retry scheduling.
- Asset inspection.
- Post-processing.
- Notification dispatch.

### Cache

Use for performance only:

- Session/cache data.
- Template gallery cache.
- User credit balance cache.
- Rate limit counters.

Never make cache the source of truth for credits or tasks.

### Log/Analytics Store

Use for:

- Provider errors.
- System logs.
- Operational metrics.
- Agent diagnosis context.
- Product analytics.

## Generation Submission Flow

1. User opens a template.
2. Frontend loads published template metadata and form schema.
3. User uploads assets and fills simple inputs.
4. Backend validates inputs and asset references.
5. Backend calculates credit cost from template pricing.
6. User submits generation.
7. Backend creates task with submitted parameters and template version.
8. Backend freezes required credits with an idempotency key.
9. Backend enqueues generation job.
10. Worker executes template workflow.
11. Worker records provider attempts and task events.
12. If generation succeeds, backend stores output and confirms credit spend.
13. If generation fails, times out, or is blocked, backend releases frozen credits.
14. User sees final task status and output/refund state.

## Task and Credit Consistency

Important consistency rules:

- Task creation and credit freeze should be transactional or use reliable compensation.
- Credit freeze, settle, release, and refund must be idempotent.
- Worker retry must not duplicate credit operations.
- Task state transitions should be append-only event records.
- The latest task state can be stored as a convenience field, but event history remains authoritative.
- Corrections should append new records rather than mutate historical records.

## API Boundary Direction

Public user APIs:

- Auth/register/login/logout.
- Current user profile.
- Template list/detail.
- Asset upload.
- Pricing preview.
- Generation submit.
- Task list/detail.
- Credit balance/ledger.
- Recharge packages/orders.

Admin/Agent APIs:

- Task search/detail/diagnosis.
- Credit ledger search.
- User search.
- Template version review/publish/pause/rollback.
- Provider attempt/error search.
- Manual adjustment proposal/approval.
- Agent operation records.

Internal worker APIs:

- Fetch task payload.
- Lock task.
- Update task state.
- Record provider attempt.
- Store output.
- Settle or release credits.

## Provider Adapter Direction

Every provider adapter should expose a normalized interface:

- Validate provider config.
- Build request payload.
- Submit job.
- Poll job status if async.
- Download output.
- Map errors.
- Report metrics.

Provider adapters should record:

- Provider name.
- Model/version.
- Request ID.
- Request payload hash or safe payload snapshot.
- Response metadata.
- Error code.
- Latency.
- Retry count.

Sensitive provider secrets must never be stored in template configs or task records.

## Secret Management Direction

Provider API keys and other secrets must be handled through a dedicated secret management layer.

Rules:

- Do not store raw secrets in repository files.
- Do not store raw secrets in template configs.
- Do not send secrets to the frontend.
- Do not write secrets into task records, provider attempts, audit logs, or error logs.
- Use secret references in provider configuration.
- Keep separate secrets for local, staging, and production.
- Support rotation without changing template definitions.
- Redact provider request headers, auth fields, signed URLs, and sensitive payload fields before logging.

Local development can use ignored `.env` files. Production should use a real secret manager or encrypted runtime configuration.

## Agent-First Architecture Requirements

Agents need structured and safe access to:

- Template definitions.
- Validation reports.
- Task timelines.
- Credit ledger.
- Provider attempts.
- Error logs.
- System metrics.

Agents should be able to:

- Generate or update template configs.
- Run validation and preview checks.
- Diagnose task failures.
- Prepare credit adjustment proposals.
- Prepare provider incident summaries.
- Suggest template fallback updates.

Agents should not automatically execute high-risk actions without approval:

- Publishing templates.
- Changing provider secrets/settings.
- Issuing manual credit adjustments.
- Bulk pausing templates.
- Changing payment/credit policies.

## MVP Technical Scope

Required:

- API-first backend.
- Published template registry.
- User auth placeholder or real auth depending on launch scope.
- Asset upload/storage abstraction.
- Generation task records and state machine.
- Credit ledger with freeze/settle/release.
- Async worker and queue abstraction.
- Provider adapter interface.
- Admin/Agent task traceability.
- Basic structured logs.

Can be delayed:

- Full microservice split.
- Complex analytics warehouse.
- Multi-region deployment.
- Enterprise permission system.
- Full visual template builder.
- Multiple payment providers if not needed for launch.

## Open Technical Questions

- Final backend framework and language.
- Final database choice.
- Queue implementation.
- Object storage provider.
- Payment provider.
- Login methods.
- Initial AI/video provider(s).
- Whether first MVP needs real provider integration or mocked generation for frontend/prototype validation.
