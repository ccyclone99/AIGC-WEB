# Admin Console Direction

Status: Draft proposal

The admin/operator console is the internal control center for template publishing, generation traceability, credit operations, provider monitoring, and issue resolution. The operating model should be Agent-first: Agents or deterministic automation perform routine analysis, propose changes, generate configs, run validations, and prepare actions; humans approve high-risk changes and final publication.

## Admin Console Principles

- Admin UI is for review, control, traceability, and Agent supervision, not heavy manual template authoring.
- Complex template creation and modification should remain Agent-driven.
- Routine operations should be Agent-assisted or Agent-executed with guardrails.
- Humans should focus on intent, approval, exception handling, and business judgment.
- Every operational action that affects templates, user credits, generation status, or published content must be audited.
- Operators should be able to reconstruct any generation task from stored records.
- Admin workflows should prioritize reliability, accountability, and fast troubleshooting.

## Agent-First Operation Model

The default workflow should be:

1. Human states an intent or asks a question.
2. Agent gathers related records, logs, configs, and metrics.
3. Agent explains the finding and proposes an action.
4. Agent runs validation/simulation where possible.
5. Human approves only when the action is high-risk or externally visible.
6. Agent applies the change or prepares a publishable artifact.
7. System records the full audit trail.

Examples:

- "Why did task X fail?" Agent retrieves task timeline, provider attempts, error payloads, credit status, and explains root cause.
- "Create a new TikTok-style product video template." Agent creates template config, fixtures, pricing, validation, and preview.
- "Pause templates using provider Y if failure rate is too high." Agent checks metrics and proposes or applies policy-based pause.
- "Refund this user if the task really failed." Agent verifies task state and credit ledger, then prepares refund action with reason.

## Automation Levels

### Level 1: Agent Suggests

- Agent analyzes and recommends.
- Human manually approves or executes.

### Level 2: Agent Prepares

- Agent creates changes, runs validation, and prepares an action.
- Human approves before execution.

### Level 3: Agent Executes With Guardrails

- Agent executes low-risk predefined operations automatically.
- System logs everything and notifies humans when needed.

### Level 4: Fully Automated Policy

- System executes deterministic policies without human review, such as releasing credits for timed-out tasks.

Recommended MVP:

- Level 4 for deterministic credit release/refund on failed or timed-out generation.
- Level 3 for low-risk deterministic diagnostics and report generation.
- Level 2 for template publishing, provider config changes, and manual credit adjustments.
- Level 1 for ambiguous user disputes or policy exceptions.

MVP does not require a full LLM-powered admin copilot. It requires structured records and diagnosis surfaces that Agents can use.

## Roles

### Super Admin

- Full access.
- Manage admin users and permissions.
- Manage system settings, providers, payment settings, and credit policies.

### Template Operator

- Review Agent-generated template changes and previews.
- Preview templates.
- Publish, pause, archive, sort, and feature templates.
- Review template versions and rollback when needed.
- Use Agent summaries instead of manually inspecting raw template config where possible.

### Support Operator

- Ask Agent to search users and generation tasks.
- Inspect task status, submitted parameters, logs, refund state, and output records.
- Handle user disputes.
- Review Agent-generated root-cause summaries and proposed resolutions.
- Approve safe operational actions, such as retry if allowed or manual refund if policy permits.

### Finance/Credit Operator

- View recharge orders and credit ledger.
- Review Agent-prepared credit grants or adjustments with approval/audit.
- Export credit and payment records if needed.

## Main Modules

### Dashboard

Purpose:

- Give operators a quick view of platform health.
- Let Agents surface anomalies and recommended actions.

Suggested metrics:

- Generation task volume.
- Success rate.
- Failure rate.
- Timeout rate.
- Average generation time.
- Credit consumption.
- Recharge amount.
- Provider error rate.
- Top templates.

### Template Review

Purpose:

- Review and publish Agent-authored templates.

Capabilities:

- View template metadata.
- Compare template versions.
- Preview frontend form.
- Run or view validation results.
- View pricing calculation examples.
- View sample fixtures.
- Publish new version.
- Pause or archive a version.
- Roll back to previous version.
- Manage visibility, category, sort order, and featured status.
- View Agent-generated change summary, risk notes, and validation results.
- Request Agent revisions in natural language.

### Generation Tasks

Purpose:

- Trace every generation task end to end.
- Allow Agent-assisted root-cause analysis for any task.

Search filters:

- Task ID.
- User ID/email/phone.
- Template ID and version.
- Status.
- Time range.
- Provider.
- Error code.
- Credit transaction ID.

Task detail should show:

- User.
- Template and version.
- Submitted parameters.
- Uploaded asset references and inspection result.
- Pricing calculation.
- Credit freeze/settle/release records.
- Task status timeline.
- Provider attempts.
- Provider request/response metadata.
- Retry history.
- Output files.
- Error details.
- Operator actions.
- Agent diagnosis summary.
- Suggested next action.

### Credit Ledger

Purpose:

- Audit all credit changes.
- Support Agent-verified credit settlement and dispute handling.

Capabilities:

- View user balance.
- View frozen credits.
- View all credit transactions.
- Filter by transaction type.
- Link generation-related transactions to tasks.
- Link recharge-related transactions to payment orders.
- Manual adjustment with reason and approval record.
- Agent-prepared adjustment proposal with evidence.

### Users

Purpose:

- Support account and customer service workflows.

Capabilities:

- Search user.
- View registration time and login methods.
- View credit balance.
- View task history.
- View recharge history.
- View credit ledger.
- View risk/moderation flags if any.

### Provider Monitor

Purpose:

- Monitor external AI/video model providers.
- Let Agents detect abnormal failure rates, timeout spikes, or fallback overuse.

Capabilities:

- Provider status.
- Success/failure rate.
- Average latency.
- Error code distribution.
- Recent failed requests.
- Rate limit visibility.
- Fallback provider usage.
- Agent recommendations, such as pause provider, reduce traffic, switch fallback, or raise alert.

### Error Log Center

Purpose:

- Debug system and provider failures.
- Give Agents enough structured data to explain failures without manual log digging.

Capabilities:

- Search by task ID, provider attempt ID, user ID, template version, request ID, and error code.
- View structured error details.
- View retry and fallback decisions.
- Export logs for technical debugging if permitted.
- Agent-generated incident summary.

### Settings

Purpose:

- System-level operational configuration.

Capabilities:

- Signup bonus credits.
- Recharge packages.
- Payment methods.
- Provider configs.
- Global retry/timeout defaults.
- Storage retention.
- Admin permission settings.

## Audit Requirements

Audit logs are required for:

- Agent analysis requests and generated recommendations when they lead to an operational action.
- Agent-executed actions.
- Template publish, pause, archive, rollback.
- Template visibility/order/featured changes.
- Manual credit grant, adjustment, refund, or correction.
- User account risk/status changes.
- Provider configuration changes.
- Task operational actions such as retry, cancel, manual fail, or manual refund.
- Admin permission changes.

Each audit entry should include:

- Actor.
- Actor type: human, Agent, system policy.
- Action.
- Target resource.
- Before value.
- After value.
- Reason.
- Timestamp.
- IP/session metadata if available.

## MVP Admin Scope

Required:

- Task search and task detail traceability.
- Credit ledger lookup.
- Basic user lookup.
- Template version listing and publish/pause controls.
- Provider attempt/error visibility.
- Manual credit adjustment with reason.
- Agent task diagnosis summary.
- Agent-generated template review summary.
- Agent-prepared manual credit adjustment proposal.
- Automated deterministic credit release/refund for failed or timed-out tasks.

Can be delayed:

- Full visual template editor.
- Advanced analytics dashboard.
- Complex approval workflow.
- Bulk exports.
- Multi-level enterprise permissions.
- Fully autonomous high-risk operations.

## Operational Safety Rules

- Manual credit actions must require a reason.
- Dangerous actions should require confirmation and be audited.
- High-risk Agent actions must require human approval before execution.
- Low-risk Agent diagnostics can run automatically.
- Operators should not be able to edit immutable task records.
- Corrections should be appended as new records/events, not overwrite history.
- Published template versions should not be mutated in place.
- Rollback should publish or activate a previous version rather than editing history.
