# Observability and SLO Strategy

Status: Draft proposal

This document defines metrics, logs, tracing, dashboards, and alerting requirements for AIGC Web.

## Goals

- Detect generation failures quickly.
- Track provider health and cost.
- Track queue and rendering bottlenecks.
- Verify credit settlement correctness.
- Detect signup/campaign abuse.
- Support Agent diagnosis with structured data.
- Give operators clear dashboards and actionable alerts.

## Observability Principles

- Every generation task should have a traceable timeline.
- Every provider call should be measured.
- Every render attempt should be measured.
- Every credit transaction should be auditable.
- User-facing status and internal status should both be observable.
- Logs must be structured and redacted.
- Metrics should be tagged by template, provider, model, renderer, region, and status where possible.
- Alerts should be action-oriented, not noisy.

## Core IDs

Use stable IDs across logs, metrics, and traces:

- userId
- taskId
- templateId
- templateVersionId
- workflowStepId
- providerAttemptId
- renderAttemptId
- creditLedgerEntryId
- rechargeOrderId
- campaignId
- requestId
- traceId

## Key Metrics

### Generation Metrics

- generation_submitted_count
- generation_success_count
- generation_failed_count
- generation_timeout_count
- generation_blocked_count
- generation_refunded_count
- generation_success_rate
- generation_average_duration_seconds
- generation_p95_duration_seconds
- generation_queue_wait_seconds
- generation_retry_count
- generation_fallback_count

Dimensions:

- templateId
- templateVersionId
- category
- provider
- model
- renderer
- userSegment

### Provider Metrics

- provider_request_count
- provider_success_count
- provider_error_count
- provider_timeout_count
- provider_rate_limited_count
- provider_latency_seconds
- provider_cost_estimated
- provider_cost_actual
- provider_fallback_used_count

Dimensions:

- provider
- model
- capability
- errorCode
- region

### Render Metrics

- render_submitted_count
- render_success_count
- render_failed_count
- render_duration_seconds
- render_queue_wait_seconds
- render_output_size_bytes

Dimensions:

- renderer
- templateId
- aspectRatio
- duration
- resolution

### Credit Metrics

- credit_freeze_count
- credit_settle_count
- credit_release_count
- credit_refund_count
- credit_adjustment_count
- credit_issued_signup_bonus
- credit_issued_campaign_reward
- credit_issued_recharge
- credit_consumed_generation
- frozen_credit_total
- available_credit_total

Important checks:

- Frozen credits should not grow without corresponding in-progress tasks.
- Failed/timed-out tasks should eventually release credits.
- Duplicate idempotency keys should be rejected and monitored.

### Payment Metrics

- recharge_order_created_count
- recharge_order_paid_count
- recharge_order_failed_count
- payment_webhook_received_count
- payment_webhook_failed_count
- payment_credit_grant_count
- chargeback_count

### Abuse Metrics

- signup_count
- signup_bonus_granted_count
- signup_bonus_held_count
- signup_bonus_denied_count
- accounts_per_ip
- accounts_per_device
- verification_code_send_count
- campaign_reward_claim_count
- campaign_reward_denied_count
- generation_submit_rate_by_user
- upload_rejection_count

### Frontend UX Metrics

- template_gallery_view_count
- template_detail_view_count
- creation_started_count
- upload_success_count
- upload_failed_count
- pricing_preview_count
- login_prompt_shown_count
- generation_submit_click_count
- task_result_view_count
- download_click_count

Funnels:

- Home -> Template -> Creation -> Submit -> Success.
- Creation -> Login -> Submit.
- Recharge -> Payment -> Credit grant.

## Logs

Required structured logs:

- API request logs.
- Auth/login logs.
- Upload logs.
- Generation task logs.
- Provider attempt logs.
- Render attempt logs.
- Credit ledger logs.
- Payment webhook logs.
- Admin/Agent operation logs.
- Moderation logs.

Required log fields:

- timestamp
- level
- service
- eventType
- requestId
- traceId
- userId if available
- taskId if available
- providerAttemptId if available
- renderAttemptId if available
- message
- safe metadata

Redaction:

- Never log API keys, auth headers, cookies, OAuth tokens, payment tokens, signed URLs, or raw secrets.
- Redact sensitive personal information unless required for diagnosis and permitted.

## Tracing

Trace long-running generation through:

1. Submit API request.
2. Credit freeze.
3. Queue enqueue.
4. Worker pickup.
5. Asset inspection.
6. Provider request.
7. Provider polling/callback.
8. Composition/rendering.
9. Output storage.
10. Credit settlement/release.
11. Notification/status update.

Trace should help answer:

- Where did time go?
- Which provider/model failed?
- Was credit settlement correct?
- Did retry/fallback happen?
- Was output generated but delivery failed?

## Dashboards

### Executive/Product Dashboard

- Total generations.
- Success rate.
- Active users.
- Template usage.
- Credit consumption.
- Recharge revenue.
- Top templates.

### Operations Dashboard

- Queue depth.
- Average/p95 generation time.
- Failure/timeout rate.
- Refund/release rate.
- Provider health.
- Renderer health.
- Recent incidents.

### Provider Dashboard

- Provider success rate.
- Provider latency.
- Error distribution.
- Cost estimate.
- Fallback usage.
- Rate limits.

### Credit/Payment Dashboard

- Credits issued.
- Credits consumed.
- Frozen credits.
- Recharge orders.
- Webhook failures.
- Chargebacks/refunds.
- Manual adjustments.

### Abuse Dashboard

- Signup bonus grants/holds/denials.
- Accounts per IP/device.
- Campaign reward claims.
- Verification spikes.
- Suspicious users/clusters.

## Alerts

Recommended alert categories:

### Generation Alerts

- Success rate drops below threshold.
- Timeout rate rises above threshold.
- Queue wait exceeds threshold.
- Generation duration p95 exceeds threshold.
- Failed tasks not releasing credits.

### Provider Alerts

- Provider error rate spikes.
- Provider latency spikes.
- Rate-limit errors increase.
- Provider cost spikes unexpectedly.
- Fallback usage spikes.

### Render Alerts

- Renderer failure rate increases.
- Render queue backlog grows.
- Render duration p95 exceeds threshold.

### Credit/Payment Alerts

- Payment webhook failures.
- Duplicate idempotency key anomalies.
- Frozen credits growing abnormally.
- Manual credit adjustments spike.
- Campaign budget nearing or exceeding limit.

### Abuse Alerts

- Signup bonus grant spike.
- Many accounts from same IP/device/subnet.
- Verification send spike.
- Campaign reward claim spike.
- Free-credit generation spike without recharge.

## Draft SLOs

Initial internal targets:

- Generation task status should be visible within 2 seconds after submit.
- Credit freeze should complete within 2 seconds for normal load.
- 95% of non-provider API requests should respond within 1 second.
- 95% of task status reads should respond within 500 ms.
- Failed/timed-out tasks should release credits within 60 seconds of final failure decision.
- Payment webhook credit grant should complete within 30 seconds after verified payment event.

Generation success and duration SLOs depend on selected providers and templates, so they should be set after provider testing.

## Agent Role

Agents should:

- Generate incident summaries.
- Diagnose failed tasks from traces/logs.
- Detect abnormal provider behavior.
- Detect abnormal credit issuance.
- Recommend provider fallback/routing changes.
- Recommend rate-limit tuning.
- Prepare daily/weekly operational summaries.

High-risk Agent actions require approval:

- Changing provider routing.
- Changing credit pricing.
- Pausing high-volume templates.
- Adjusting campaign budgets.

## MVP Observability Scope

Required:

- Structured logs with request/task/provider/render/credit IDs.
- Basic generation metrics.
- Basic provider metrics.
- Credit freeze/settle/release metrics.
- Payment webhook metrics if payment is enabled.
- Queue depth and worker error metrics.
- Admin task timeline view.
- Agent-readable task diagnosis data.
- Basic alerts for provider failure, queue backlog, credit release failure, and webhook failure.

Can be delayed:

- Full distributed tracing UI.
- Advanced product analytics.
- Complex anomaly detection.
- Data warehouse.
- Real-time executive dashboard.

## Open Questions

- Observability stack choice.
- Alert channels.
- Initial thresholds.
- Data retention duration for logs and metrics.
- Whether to separate product analytics from operational telemetry.

## Decision

Observability is part of MVP architecture. The platform must be able to explain task failures, provider issues, credit settlement, and abuse patterns from structured logs and metrics.
