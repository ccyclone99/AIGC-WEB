# Deployment and Release Strategy

Status: Draft proposal

This document defines environment, deployment, release, rollback, and Agent-driven delivery requirements for AIGC Web.

## Goals

- Support safe Agent-driven development.
- Separate local, staging, and production environments.
- Keep secrets out of code and logs.
- Validate templates before publish.
- Release frontend, backend, workers, and templates safely.
- Support rollback for code and template versions.
- Avoid breaking paid users, credits, generation tasks, and provider integrations.

## Environment Strategy

Use at least three environments:

### Local

Purpose:

- Agent and developer implementation.
- Mock providers.
- Mock payment callbacks.
- Local templates and fixtures.

Rules:

- Use local `.env` excluded from Git.
- Use mock or sandbox providers.
- Do not use production API keys.
- Use seed data and fake assets.

### Staging

Purpose:

- Integration testing.
- Realistic queue/worker/render testing.
- Provider sandbox testing where possible.
- Payment sandbox testing.
- Template review before production.

Rules:

- Separate database, storage, queue, and secrets.
- Use staging provider keys.
- Use payment sandbox.
- Use restricted admin access.

### Production

Purpose:

- Real users, real credits, real payments, real providers.

Rules:

- Production secrets only.
- Strict admin permissions.
- Audit logging required.
- Monitoring and alerts enabled.
- Manual approval for high-risk changes.

## Deployable Units

Core units:

- Web frontend.
- Backend API.
- Background worker.
- Renderer worker if separate.
- Admin/Agent operation surface.
- Template definitions.
- Database migrations.

Release sequencing matters when schema or template changes affect runtime.

## Template Release Flow

1. Agent creates or updates template config/code.
2. Agent creates fixtures and preview assets.
3. Run template validation.
4. Run pricing tests.
5. Run workflow dry-run.
6. Run frontend preview.
7. Run provider payload validation.
8. Human reviews preview and risk notes.
9. Publish new immutable template version to staging.
10. Test with staging tasks.
11. Approve production publish.
12. Production stores published template version snapshot.

Rules:

- Never mutate a published template version.
- Rollback activates previous version or publishes a rollback version.
- Generation tasks always reference exact template version.

## Code Release Flow

Recommended flow:

1. Agent makes code changes.
2. Agent runs targeted tests locally.
3. Open review/change summary.
4. CI runs type check, lint, unit, integration, template, and contract tests.
5. Deploy to staging.
6. Run staging smoke tests.
7. Approve production release.
8. Deploy production.
9. Run production smoke checks.
10. Monitor metrics and errors.

## Database Migration Strategy

Rules:

- Migrations must be versioned.
- Avoid destructive migrations in normal releases.
- Use backward-compatible expand/contract migrations when possible.
- Schema changes that affect workers must be coordinated.
- Migrations touching credit ledger, payment, or tasks need extra review.
- Always test migrations on staging data.

Suggested pattern:

1. Add new fields/tables.
2. Deploy code that writes both old and new if needed.
3. Backfill.
4. Switch reads.
5. Remove old fields later after confidence.

## Worker Release Strategy

Workers process long-running jobs, so deployment needs care.

Rules:

- Workers should gracefully stop accepting new jobs before shutdown.
- In-progress jobs should finish or be safely retried.
- Jobs must be idempotent.
- Worker version should be recorded in task events/provider attempts where useful.
- Queue messages should include schema version if payload format can change.

## Rollback Strategy

Rollback targets:

- Frontend release.
- Backend API release.
- Worker release.
- Template version.
- Provider routing config.
- Campaign configuration.

Rules:

- Code rollback must not corrupt tasks or credits.
- Template rollback should not edit historical task versions.
- Provider routing rollback should be audited.
- Campaign rollback/pause should preserve grant history.
- Database rollback should be avoided if data was already written in new format; prefer forward fix.

## Feature Flags

Use feature flags for:

- New templates.
- New provider adapters.
- New renderers.
- New pricing rules.
- New frontend prototypes.
- Campaigns.
- Payment providers.

Flags should support:

- Environment targeting.
- User segment targeting.
- Percentage rollout.
- Immediate disable.
- Audit logs.

## CI Quality Gates

Required before release:

- Type check.
- Lint.
- Unit tests.
- Credit ledger tests.
- Task lifecycle tests.
- Template validation tests.
- Provider adapter contract tests.
- Render adapter contract tests.
- Log redaction tests.
- Security/secret scan.

Optional but recommended:

- Frontend E2E smoke.
- Visual screenshot checks.
- Staging smoke generation with mock provider.

## Production Smoke Checks

After production release:

- Home page loads.
- Template gallery loads.
- User can log in.
- Pricing preview works.
- Test generation with mock/internal template if available.
- Task status updates.
- Credit balance reads.
- Admin task search works.
- Worker health check passes.
- Queue is processing.

## Agent-Driven Release Responsibilities

Agent should:

- Generate release notes.
- Identify impacted modules.
- Run targeted tests.
- Summarize migration risk.
- Summarize template changes.
- Prepare rollback instructions.
- Watch post-release metrics.
- Generate incident summary if rollback is needed.

Human approval required:

- Production release.
- Database migrations touching credits/payments/tasks.
- Template production publish.
- Provider routing changes.
- Payment provider changes.
- Campaign launch with significant budget.

## MVP Release Scope

Required:

- Local and staging environments.
- CI for type/lint/tests.
- Template validation gate.
- Mock provider in staging.
- Separate environment secrets.
- Production deployment checklist.
- Manual production approval.
- Basic rollback plan.

Can be delayed:

- Full canary release.
- Blue/green deployment.
- Advanced feature flag platform.
- Automated rollback.
- Multi-region deployment.

## Open Questions

- Hosting platform.
- CI/CD provider.
- Database host.
- Queue provider.
- Object storage provider.
- Secret manager.
- Feature flag implementation.
- Whether staging uses real paid providers or only sandbox/mock.

## Decision

Use separated environments, CI quality gates, immutable template releases, careful database migrations, idempotent worker jobs, and Agent-generated release summaries. High-risk production changes require human approval.
