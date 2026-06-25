# Testing and Quality Strategy

Status: Draft proposal

This document defines the testing and quality strategy for AIGC Web. The platform will be Agent-driven, template-driven, credit-based, provider-integrated, and workflow-heavy, so automated validation must protect the core business rules.

## Goals

- Keep Agent-generated code/config safe.
- Prevent credit double-charge, double-refund, or duplicate reward grants.
- Validate templates before publishing.
- Validate provider adapters despite different external APIs.
- Verify generation task lifecycle behavior.
- Verify frontend creation flows and motion prototypes.
- Ensure logs/audits are complete and redacted.
- Support fast iteration without breaking critical flows.

## Testing Principles

- Test core business rules more deeply than UI decoration.
- Every template must be schema-validated and dry-run before publish.
- Every provider adapter must pass contract tests.
- Every credit operation must be idempotency-tested.
- Every high-risk workflow should have simulation tests.
- Agent changes must run relevant validation automatically.
- Mock providers and fake renderers are required for reliable tests.
- Tests should cover success, failure, timeout, retry, fallback, block, and refund paths.

## Test Layers

### 1. Static Checks

Purpose:

- Catch basic code/config problems early.

Checks:

- TypeScript type checking.
- Linting.
- Template schema validation.
- JSON/config validation.
- Secret scanning.
- Dependency audit.

### 2. Unit Tests

Target:

- Pricing rules.
- Credit ledger functions.
- Idempotency keys.
- Template validation helpers.
- Provider error mapping.
- Workflow state transitions.
- Moderation decision mapping.
- Risk score helpers.

### 3. Integration Tests

Target:

- Auth + signup bonus.
- Payment webhook + credit grant.
- Generation submit + credit freeze + queue enqueue.
- Worker success + credit settle.
- Worker failure + credit release.
- Provider retry/fallback.
- Asset upload + validation.
- Campaign reward grant.
- Admin/Agent approval flows.

### 4. Contract Tests

Target:

- Provider adapters.
- Renderer adapters.
- Payment provider adapters.
- Storage adapter.
- Queue adapter.

Provider adapter contract tests:

- Build payload from normalized request.
- Mock success.
- Mock retryable error.
- Mock policy block.
- Mock timeout.
- Mock rate limit.
- Normalize output asset.
- Redact secrets in logs.

Renderer adapter contract tests:

- Accept `VideoCompositionSpec`.
- Validate timeline.
- Render success mock.
- Render failure mock.
- Output asset registration.
- Logs redacted.

### 5. Template Tests

Every template should include fixtures.

Required:

- Input schema validation.
- Required fields.
- Asset constraints.
- Pricing calculation.
- Prompt rendering dry-run.
- Workflow dry-run.
- Provider payload validation.
- Layout/form preview validation.
- Fallback policy validation.
- Audit coverage validation.

Template publish gate:

- A template cannot be published if required validations fail.

### 6. End-to-End Tests

User-facing flows:

- Browse templates.
- Fill creation form.
- Upload images.
- See price estimate.
- Login when required without losing form data.
- Submit generation.
- See task status.
- See completed result.
- See failed/refunded result.
- View credit history.

Admin/Agent flows:

- Search task.
- View task timeline.
- Diagnose failed task.
- Review template version.
- Approve publish.
- Prepare and approve credit adjustment.

### 7. Visual and Motion QA

Required for frontend quality:

- Desktop and mobile screenshots.
- Card flip behavior.
- Hover preview behavior.
- Bento layout responsiveness.
- Before/after reveal behavior.
- Reduced-motion fallback.
- Text does not overflow.
- No incoherent overlaps.
- Upload and task states look polished.

For 3D/motion prototypes:

- Verify nonblank rendering.
- Verify interaction works.
- Verify mobile fallback works.
- Verify reduced-motion mode works.

### 8. Security Tests

Target:

- Auth route protection.
- User cannot access other users' tasks/assets.
- Admin permissions.
- QR login expiry and single-use.
- OAuth state/nonce verification.
- Upload type/size validation.
- Rate limits.
- Log redaction.
- Secret scanning.
- Payment webhook signature verification.

### 9. Observability Tests

Target:

- Logs include task/provider/render/credit IDs.
- Logs redact secrets.
- Metrics emitted for task submit/success/failure.
- Credit release alert path test.
- Provider failure alert path test.
- Payment webhook failure alert path test.

## Critical Test Scenarios

### Credit Scenarios

- Signup bonus granted once.
- Campaign reward granted once.
- Duplicate payment webhook grants credits once.
- Duplicate generation submit cannot double-freeze.
- Successful task settles frozen credits once.
- Failed task releases frozen credits once.
- Timeout task releases frozen credits once.
- Manual adjustment requires reason.

### Task Scenarios

- Valid task succeeds.
- Invalid input blocks before credit freeze.
- Moderation block releases credits if already frozen.
- Provider retry succeeds.
- Provider retry exhausts and releases credits.
- Fallback provider succeeds.
- Render failure releases credits if final output cannot be delivered.
- Output quality dissatisfaction does not automatically refund.

### Provider Scenarios

- Provider auth failure.
- Provider rate limit.
- Provider timeout.
- Provider policy block.
- Provider malformed response.
- Provider output download failure.
- Provider cost metadata missing.

### Abuse Scenarios

- Multiple accounts from same IP/device.
- Disposable email registration.
- Repeated campaign claims.
- Verification code spam.
- High-frequency generation from bonus credits.

## Agent-Driven Quality Workflow

When Agent changes code/config:

1. Identify affected modules.
2. Run targeted tests.
3. Run template validations if templates changed.
4. Run provider adapter contract tests if adapters changed.
5. Run credit/task tests if settlement logic changed.
6. Generate summary of changes and test results.
7. Require human approval for high-risk changes.

Agent should also generate:

- Test fixtures for new templates.
- Provider mock responses.
- Failure-case tests for new workflow steps.
- Visual screenshots for frontend prototype changes.

## MVP Testing Scope

Required:

- Type check and lint.
- Template schema validation.
- Credit ledger unit tests.
- Task lifecycle tests.
- Mock provider integration tests.
- Mock renderer integration tests.
- Auth/login flow tests.
- Upload validation tests.
- Frontend creation flow E2E test.
- Log redaction test.

Can be delayed:

- Full cross-browser matrix.
- Load testing.
- Advanced chaos testing.
- Full visual regression suite.
- Complete provider sandbox suite for every supplier.

## Open Questions

- Test framework choice.
- E2E/browser automation choice.
- Whether visual regression snapshots are required before MVP.
- CI/CD platform.
- Required coverage thresholds.
- Load test target numbers.

## Decision

Testing must be built around the risky parts: templates, credits, tasks, provider adapters, rendering, auth, uploads, and auditability. Agent-driven development requires automated validation gates before publish or release.
