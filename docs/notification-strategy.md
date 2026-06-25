# Notification Strategy

Status: Draft proposal

This document defines notification requirements for user-facing events, admin/operator alerts, and Agent-assisted summaries.

## Goals

- Let users know when long-running generation tasks complete or fail.
- Confirm credit/payment/campaign events clearly.
- Notify users about refunds/releases when tasks fail or time out.
- Support future web, mini program, Android, and iOS channels.
- Avoid noisy notifications.
- Keep notification records auditable.

## Notification Principles

- In-app notifications are the MVP baseline.
- Email/SMS/push can be added by channel and region later.
- Critical account/credit/payment events should be visible in account history even if external notification fails.
- Notification delivery should be asynchronous.
- Notifications should reference task/order/credit IDs where useful.
- Do not include sensitive provider payloads, raw prompts, API keys, or private media URLs in notifications.

## Notification Channels

### MVP

- In-app notification center.
- Task center status updates.
- Optional email for account/payment if needed.

### Future

- Email.
- SMS.
- WeChat/mini program service notifications.
- Web push.
- iOS push.
- Android push.
- Admin alert channels such as Slack/Feishu/DingTalk/email.

## User Notification Events

### Generation

- Task submitted.
- Task started.
- Task completed.
- Task failed.
- Task timed out.
- Task blocked by content policy.
- Credits released/refunded after failure.

MVP display:

- Task center should always show these states.
- In-app notifications should highlight completed, failed, refunded, and blocked tasks.

### Credits

- Signup bonus granted.
- Campaign reward granted.
- Recharge credits granted.
- Credits frozen for generation.
- Credits spent after success.
- Credits released/refunded.
- Manual adjustment.
- Credit expiration warning if expiration is introduced.

### Payment

- Recharge order created.
- Payment successful.
- Payment failed.
- Payment pending.
- Payment refunded or chargeback if supported.

### Campaigns

- Campaign reward available.
- Campaign reward claimed.
- Campaign ending soon if user is eligible.

### Account/Security

- Login from new device/location if risk controls require it.
- Identity linked/unlinked.
- Password changed if password login exists.
- QR login confirmed.

## Admin and Agent Notifications

Admin/operator alerts:

- Provider failure spike.
- Queue backlog.
- Render failure spike.
- Payment webhook failures.
- Frozen credits not releasing.
- Campaign budget nearing limit.
- Signup bonus abuse spike.
- Manual approval required for template publish.
- Manual approval required for high-impact campaign.
- Manual approval required for credit adjustment proposal.

Agent summaries:

- Daily provider health summary.
- Daily generation success/failure summary.
- Credit anomaly summary.
- Campaign performance summary.
- Suspicious signup cluster summary.

## Notification Data Model

Suggested entities:

### Notification

Key fields:

- id
- userId nullable
- audience: user | admin | system
- type
- title
- body
- status: unread | read | archived
- severity: info | success | warning | error
- relatedResourceType
- relatedResourceId
- metadata
- createdAt
- readAt

### NotificationDelivery

Key fields:

- id
- notificationId
- channel
- destination
- status: pending | sent | failed | skipped
- provider
- providerMessageId
- errorCode
- errorMessage
- sentAt
- createdAt

## Notification Delivery Rules

- Create notification record first.
- Queue external delivery.
- Retry transient delivery failures.
- Do not block task/payment/credit flow on notification delivery.
- Store delivery result.
- User-facing state must not rely only on notification delivery.

## Frontend UX

MVP:

- Header notification icon.
- Notification dropdown or page.
- Task center remains source of truth for generation status.
- Credit center remains source of truth for credit history.

Notification style:

- Concise.
- Action-oriented.
- Link to task, credit record, or order.
- No raw technical errors for users.

Examples:

- "Your product video is ready."
- "Generation failed and 20 credits were released."
- "Your recharge was successful."
- "Your campaign reward has been added."

## Agent Role

Agents can:

- Generate notification copy variants.
- Summarize incidents for admins.
- Recommend alert threshold changes.
- Explain failed notification deliveries.
- Prepare user-facing support text for failed tasks.

Agents should not:

- Send external mass notifications without approval.
- Include sensitive task details in notifications.

## MVP Requirements

Required:

- Notification record model.
- In-app notification center.
- Task completion/failure/refund notifications.
- Recharge success/failure notifications if payment is enabled.
- Campaign reward notification.
- Admin approval-required notifications.
- Async delivery architecture.

Can be delayed:

- SMS.
- Mobile push.
- WeChat service notifications.
- Web push.
- Advanced notification preferences.
- Bulk marketing notifications.

## Open Questions

- Whether MVP includes email notifications.
- Which admin alert channel to use.
- Notification retention period.
- Whether users can disable non-critical notifications.
- Final notification copy style.

## Decision

Use in-app notifications and task/credit centers as MVP baseline. External notification channels can be added later through delivery adapters.
