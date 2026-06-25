# Support, Dispute, and Refund Strategy

Status: Draft proposal

This document defines customer support, dispute handling, refund rules, and Agent-assisted investigation workflows.

## Goals

- Give users a clear path when something goes wrong.
- Resolve credit disputes using traceable task and ledger records.
- Avoid manual log digging through Agent-assisted diagnosis.
- Keep refund rules consistent.
- Preserve audit records for all support actions.
- Prevent abuse of refund/support channels.

## Support Principles

- Task, credit, payment, and asset records are the source of truth.
- Agent should prepare investigation summaries for support.
- Human approval is required for policy exceptions and manual credit adjustments.
- Support actions should append records, not mutate history.
- User-facing explanations should be clear and non-technical.
- AI output quality dissatisfaction is not automatic technical failure.

## Common Support Cases

### Generation Failed

Expected handling:

- System should automatically release frozen credits.
- User sees failed status and release/refund state.
- Support can inspect task timeline, provider attempts, render attempts, and credit ledger.

### Generation Timed Out

Expected handling:

- System marks task timed out.
- Frozen credits are released.
- User sees timeout reason and credit release.

### Content Blocked

Expected handling:

- If blocked before generation, credits should not be consumed.
- If already frozen, credits are released.
- User sees a policy-safe explanation.

### User Dislikes Output Quality

Expected handling:

- Not automatic refund by default.
- User may be guided to regenerate, use another template, or contact support.
- Support can see whether task technically succeeded.
- Optional goodwill credit can require approval and audit.

### Credits Missing or Incorrect

Expected handling:

- Agent checks credit ledger, task IDs, payment orders, campaign grants, and idempotency keys.
- If system error is found, Agent prepares adjustment proposal.
- Human approves high-risk/manual adjustments.

### Recharge Not Arrived

Expected handling:

- Check payment order and webhook event.
- Verify provider payment status.
- If paid but grant failed, create idempotent credit grant.
- If payment failed/pending, show correct status.

### Duplicate Charge or Duplicate Credit Issue

Expected handling:

- Check payment provider event ID.
- Check idempotency key.
- Check credit ledger.
- Resolve with compensating ledger entry if needed.

### Takedown or Rights Complaint

Expected handling:

- Trace output to task, user, uploaded assets, template, provider, and moderation records.
- Disable public/share access if required.
- Preserve audit record.
- Escalate legally sensitive cases.

## Refund Policy Direction

Automatic credit release/refund:

- Technical generation failure.
- Timeout after final failure decision.
- Input/moderation block before generation.
- Provider/render failure preventing final output delivery.

No automatic refund:

- User dislikes AI style/output quality.
- User changed mind after successful output.
- User submitted wrong input but task succeeded.
- User did not review generated output before external publishing.

Manual/goodwill credit:

- Can be granted by support/finance with reason.
- Requires audit log.
- May require approval above threshold.

Cash refund:

- Separate from credit refund.
- Depends on payment provider, regional law, and business policy.
- Needs later policy decision.

## Support Ticket Model

Suggested entity:

```ts
SupportTicket = {
  id,
  userId,
  type,
  status,
  priority,
  relatedTaskId,
  relatedCreditLedgerEntryId,
  relatedOrderId,
  relatedAssetId,
  userMessage,
  agentSummary,
  resolution,
  createdAt,
  updatedAt,
  closedAt
}
```

Ticket types:

- generation_failed
- output_quality
- credit_issue
- payment_issue
- content_blocked
- takedown_request
- account_issue
- other

## Agent-Assisted Investigation

Agent should generate summaries such as:

- What happened?
- Was the task technically successful?
- Were credits frozen, settled, released, or refunded?
- Did provider fail?
- Did renderer fail?
- Was content blocked?
- Was payment verified?
- Is there evidence of duplicate credit grant or duplicate charge?
- Suggested resolution.

Agent summary should include references:

- taskId
- creditLedgerEntryIds
- providerAttemptIds
- renderAttemptIds
- orderId
- auditLogIds

Agent should not:

- Promise refunds without policy.
- Reveal raw provider payloads or sensitive logs to users.
- Make final legal determinations.

## User-Facing Support UX

MVP:

- Task detail has "Report issue" action.
- Credit ledger entries can link to support.
- Payment order page can link to support.
- Basic support form.

Support form should collect:

- Issue type.
- Related task/order if known.
- User message.
- Optional screenshot/upload if needed later.

User should see:

- Ticket submitted.
- Status.
- Resolution summary.

## Admin Support UX

Support operator should see:

- Ticket.
- User.
- Related task/order/credit.
- Agent diagnosis summary.
- Timeline.
- Suggested resolution.
- Action buttons allowed by role:
  - mark resolved
  - request more info
  - prepare goodwill credit
  - escalate
  - disable share link

## Abuse Prevention

Support/refund abuse controls:

- Track refund/goodwill credit frequency by user.
- Track repeated quality complaints.
- Track campaign/free-credit users requesting excessive support.
- Limit automatic issue submissions per user if abused.
- Require approval for repeated manual credits.

## MVP Requirements

Required:

- Basic support ticket model.
- Report issue from task detail.
- Agent-generated task/credit diagnosis summary.
- Manual credit adjustment proposal with reason.
- Audit log for support actions.
- Clear automatic refund/release status in task and credit center.

Can be delayed:

- Full helpdesk integration.
- Live chat.
- Email ticket threading.
- SLA management.
- Knowledge base.
- Rights-holder portal.

## Open Questions

- Whether support is in-app only or email-based at launch.
- Manual goodwill credit thresholds.
- Cash refund policy.
- Support SLA targets.
- Whether output quality complaints get any limited courtesy regeneration.

## Decision

Use Agent-assisted support workflows backed by task timelines, credit ledger, provider attempts, render attempts, and audit logs. Automatic refunds remain rule-based; exceptions require audited human approval.
