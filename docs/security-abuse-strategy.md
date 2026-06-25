# Security and Abuse Prevention Strategy

Status: Draft proposal

This document defines baseline security and abuse-prevention requirements for AIGC Web. The platform handles user accounts, credits, payments, uploaded media, generated videos, provider API keys, and admin/Agent operations, so security needs to be part of the product architecture from the beginning.

## Security Principles

- Protect credits like money-equivalent value.
- Treat user uploads and generated outputs as sensitive user data.
- Never expose provider secrets to frontend, templates, task records, or logs.
- Use append-only/auditable records for credit and operational actions.
- Rate limit costly actions.
- Use least privilege for admin and Agent operations.
- Block obvious abuse before it reaches expensive AI providers.
- Log enough to investigate without leaking secrets or sensitive data.

## Threat Areas

### Account Abuse

Risks:

- Signup bonus farming.
- Fake accounts.
- Credential stuffing.
- OAuth account takeover.
- QR login session hijacking.

Controls:

- Email/phone verification before bonus grants where needed.
- Rate limit registration and login attempts.
- Device/IP risk scoring.
- CAPTCHA or equivalent friction only when risk is high.
- OAuth state/nonce verification.
- Short-lived, single-use QR login sessions.
- Login notifications for suspicious activity if needed.

## Anti-Bonus-Farming Strategy

Signup bonus and campaign rewards should not be granted purely because a new account row was created. They should be granted after the account passes a configurable trust gate.

### Why IP Limit Alone Is Not Enough

IP limits help, but cannot be the only defense:

- Users can switch networks, VPNs, proxies, mobile data, or cloud IPs.
- Many real users can share one IP, such as offices, schools, shops, or public networks.
- Aggressive IP blocking can hurt legitimate users.

IP should be one signal in a broader risk system.

### Recommended Signals

Use a combined risk score from:

- IP address and subnet.
- Device fingerprint or stable anonymous device ID.
- Browser/session fingerprint.
- Email domain reputation.
- Phone number verification and region.
- OAuth provider trust level.
- Registration velocity.
- Verification-code request velocity.
- Number of accounts from same IP/device/payment method.
- Failed login and failed verification patterns.
- Repeated campaign reward claims.
- Suspicious referral loops.
- Disposable email detection.
- Proxy/VPN/datacenter IP detection if available.
- Payment method reuse after recharge is introduced.

### Bonus Grant Modes

Recommended configurable modes:

1. `grant_after_verified_identity`
   Grant signup bonus only after email/phone/OAuth verification.

2. `grant_after_first_intent`
   Grant bonus only after user starts a real creation flow, not immediately after registration.

3. `grant_limited_trial`
   Grant small trial credits first, with larger bonus only after a stronger action such as verified phone or first successful generation.

4. `grant_with_risk_hold`
   High-risk users enter review/hold state and do not receive bonus immediately.

### Suggested MVP Policy

For MVP:

- Require verified email/phone or trusted third-party login before signup bonus.
- Add per-IP and per-device registration limits.
- Add per-IP and per-device verification-code send limits.
- Add per-user, per-IP, and per-device campaign reward claim limits.
- Delay bonus grant until verification is complete.
- Keep bonus amount small enough that abuse is not catastrophic.
- Log risk signals with signup bonus grant records.
- Allow Agent to produce suspicious signup/bonus reports.

### Example Limits To Tune

Initial values should be configurable, but a starting point could be:

- Max accounts per IP per hour.
- Max accounts per IP per day.
- Max accounts per device per day.
- Max verification sends per phone/email per hour.
- Max verification sends per IP per hour.
- Max signup bonus grants per IP/subnet per day.
- Max campaign claims per user/device/IP per campaign.

These are product/security settings, not hard-coded business logic.

### User Experience

When risk is low:

- Registration should feel smooth.

When risk is medium:

- Require verification or CAPTCHA.

When risk is high:

- Delay or deny bonus grant.
- Allow account creation but restrict free-credit use.
- Show a neutral message such as "Bonus verification is pending" rather than exposing exact risk rules.

### Agent Role

Agent should:

- Summarize suspicious signup clusters.
- Identify repeated IP/device/email-domain patterns.
- Recommend limit tuning.
- Prepare campaign abuse reports.
- Explain why a bonus was held or denied based on logged signals.

Agent should not reveal exact anti-abuse thresholds to end users.

### Credit Abuse

Risks:

- Duplicate signup bonus.
- Duplicate campaign reward.
- Duplicate payment webhook credit grant.
- Double freeze/release/refund.
- Manual credit adjustment abuse.

Controls:

- Idempotency keys for every credit grant, freeze, settle, release, and refund.
- Credit ledger as source of truth.
- Manual adjustment requires reason and audit.
- High-impact campaign rewards require approval.
- Agent checks for duplicate grants and suspicious patterns.
- Alerts for abnormal credit issuance or consumption.

### Payment Abuse

Risks:

- Webhook spoofing.
- Replay attacks.
- Chargebacks after credits are spent.
- Payment/order mismatch.

Controls:

- Verify payment webhook signatures.
- Store provider event IDs and process idempotently.
- Match payment amount, currency, package, and user/order.
- Track chargebacks/refunds.
- Define policy for spent credits after payment reversal.

### Upload Abuse

Risks:

- Malware or unsafe files.
- Oversized files.
- Unsupported formats.
- NSFW or illegal content.
- Non-consensual person images.
- Storage abuse.

Controls:

- File type validation using content inspection, not only extension.
- File size limits.
- Image/video dimension limits.
- Virus/malware scan if available.
- Moderation before generation.
- Asset ownership checks.
- Temporary upload expiration.
- Signed upload/download URLs.

### Generation Abuse

Risks:

- Users triggering expensive jobs repeatedly.
- Prompt/content policy abuse.
- Attempts to generate infringing, deceptive, or harmful content.
- Automated scraping of free/bonus credits.

Controls:

- Rate limit generation by user/IP/device.
- Require login before generation.
- Freeze credits before enqueueing expensive work.
- Pre-generation moderation.
- Template-level blocked content rules.
- Queue limits and concurrent task limits.
- Cost budget limits per user/account.

### Provider Secret Abuse

Risks:

- API key leakage.
- Secrets printed in logs.
- Secrets committed to repository.
- Agents accidentally exposing keys.

Controls:

- Secret manager or encrypted runtime config.
- `.env` excluded from Git for local development.
- Secret references instead of raw keys.
- Log redaction tests.
- Separate keys by environment.
- Rotation and revocation process.
- Agents work with `secretRef`, not raw secrets.

### Admin and Agent Abuse

Risks:

- Unauthorized credit changes.
- Publishing unsafe templates.
- Changing provider routes incorrectly.
- Reading sensitive user assets unnecessarily.
- Agent executing high-risk actions without approval.

Controls:

- Role-based access control.
- Approval for high-risk actions.
- Audit logs for all admin/Agent operations.
- Immutable historical records.
- Least-privilege Agent operation APIs.
- Sensitive asset access logging.
- Admin session security and optional MFA.

## Rate Limiting Requirements

Rate limit:

- Registration.
- Login.
- Verification code send.
- QR login polling.
- Asset upload.
- Pricing preview.
- Generation submit.
- Payment order creation.
- Campaign reward claim.
- Admin/Agent diagnostic requests if expensive.

Rate limits should be configurable and observable.

## Permission Model

Suggested roles:

- user
- support_operator
- template_operator
- finance_operator
- admin
- super_admin
- agent_readonly
- agent_operator
- system_worker

Rules:

- Users can access only their own tasks/assets/credits.
- Support can inspect tasks but not issue credits without permission.
- Finance can review and prepare credit adjustments.
- Template operators can review/publish templates.
- Provider secrets are not readable through normal admin UI.
- Agent permissions should be scoped by operation type.

## Data Protection

Requirements:

- Encrypt sensitive data at rest where supported.
- Use TLS for all external traffic.
- Store passwords only with strong hashing if password login is used.
- Avoid storing raw provider secrets.
- Redact logs.
- Use signed URLs for assets.
- Restrict public sharing links.
- Support asset deletion/expiration.

## Log Redaction Policy

Redact:

- API keys.
- Auth headers.
- Cookies/session tokens.
- OAuth tokens.
- Payment tokens.
- Signed URLs.
- Phone/email where full value is not needed.
- User-uploaded personal data when not needed for diagnostics.

Keep:

- Request IDs.
- Task IDs.
- Provider IDs.
- Error codes.
- Timing/latency.
- Payload hashes.
- Safe metadata.

## Abuse Monitoring

Metrics and alerts:

- Signup bonus grant rate.
- Signup bonus hold/deny rate.
- Campaign reward grant rate.
- Accounts per IP/device/subnet.
- Failed login rate.
- Verification send rate.
- Upload rejection rate.
- Generation submission rate.
- Provider cost spikes.
- Credit issuance spikes.
- Refund/release spikes.
- Payment webhook failures.
- Admin credit adjustment volume.

Agent should generate periodic abuse and anomaly summaries.

## MVP Security Scope

Required:

- Login/session baseline.
- Idempotent credit operations.
- Payment webhook verification if payment is enabled.
- Upload type/size validation.
- Pre-generation moderation placeholder or integration.
- Generation rate limiting.
- Secret management via environment/secret references.
- Log redaction rules.
- Basic role separation for admin/Agent actions.
- Audit logs for credit and template operations.

Can be delayed:

- Full risk scoring system.
- Advanced fraud detection.
- Dedicated malware scanning pipeline.
- Enterprise-grade RBAC.
- Full SIEM integration.

## Open Questions

- Initial auth provider and session approach.
- Whether MFA is required for admins at launch.
- CAPTCHA provider or alternative risk friction.
- Exact rate-limit thresholds.
- Malware scanning provider.
- Secret manager implementation.
- Public sharing link policy.

## Decision

Security and abuse prevention are part of MVP architecture. Credits, uploads, provider usage, and admin/Agent operations must be protected from the beginning.
