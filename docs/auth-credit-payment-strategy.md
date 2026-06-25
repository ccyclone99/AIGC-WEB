# Auth, Credit, and Payment Strategy

Status: Draft proposal

This document defines the account, signup bonus, credit recharge, order, payment, and credit settlement direction for AIGC Web.

## Goals

- Users must log in before consuming credits.
- New users receive signup bonus credits.
- Users can buy credits through recharge packages.
- Credit balance must be accurate and auditable.
- Payment success must reliably grant credits exactly once.
- Failed, timed-out, or blocked generation should release frozen credits.
- Future mini program, Android, and iOS clients should reuse the same account and credit backend.

## Account Model

Recommended account direction:

- Single user account across web, mini program, Android, and iOS.
- Login methods can expand over time.
- User identity should be separated from login provider identity.

Suggested entities:

- `User`: platform user identity.
- `UserIdentity`: login method binding, such as email, phone, WeChat, Google, Apple.
- `UserSession`: active session or refresh-token records if needed.
- `QrLoginSession`: short-lived QR scan login session.

## Login Methods

Recommended staged approach:

### MVP

- Email + verification code or password.
- Phone + SMS code if the launch market requires it.
- QR code scan login if the target user base is mobile-first or WeChat-oriented.
- Third-party link/OAuth login for lower-friction account creation.

### Near Future

- WeChat login for mini program/China-oriented user flows.
- Google login for global web users.
- Apple login for iOS app.
- Other third-party providers depending on market and traffic channel, such as TikTok/Douyin, Facebook, or Instagram.

Decision criteria:

- Target launch region.
- Payment provider requirements.
- User acquisition channels.
- Compliance and SMS/email cost.

## QR Code and Third-Party Login

QR code scan login and third-party login should be supported as identity methods that bind to the same platform user account.

### QR Code Login

Use cases:

- Desktop web users scan with a mobile app or identity provider.
- WeChat-oriented login flow.
- Future mini program/app account linking.

Recommended flow:

1. Web backend creates a short-lived login QR session.
2. Frontend displays QR code.
3. Mobile identity provider or app scans QR code.
4. User confirms login on the mobile side.
5. Backend marks QR session as confirmed.
6. Web frontend polls or receives an event.
7. Backend creates a web session for the linked platform user.

Security requirements:

- QR login session must be short-lived.
- QR login session must be single-use.
- QR login must require user confirmation on the mobile side.
- Expired, confirmed, cancelled, and consumed states must be explicit.
- Polling endpoint must be rate-limited.
- QR content should not expose long-lived tokens.

Suggested QR login states:

- created
- scanned
- confirmed
- expired
- cancelled
- consumed

### Third-Party Link/OAuth Login

Supported provider candidates:

- WeChat
- Google
- Apple
- TikTok/Douyin if useful for creator/ecommerce acquisition
- Facebook/Instagram if useful for overseas ecommerce sellers

Recommended flow:

1. User selects a provider.
2. Backend creates OAuth state/nonce.
3. User authenticates with provider.
4. Provider redirects or callbacks to backend.
5. Backend verifies state/nonce and provider response.
6. Backend finds or creates `UserIdentity`.
7. Backend links to an existing `User` or creates a new `User`.
8. Backend creates session.

Security requirements:

- Verify OAuth state/nonce.
- Store provider user ID and provider name as a unique identity pair.
- Avoid trusting unverified email or phone claims.
- Support account linking and conflict handling.
- Do not issue signup bonus multiple times across linked identities.
- Log identity linking and unlinking.

### Account Linking

One platform user can have multiple identities:

- email
- phone
- WeChat
- Google
- Apple
- QR/app identity
- other OAuth providers

Rules:

- Signup bonus belongs to the platform user, not each identity.
- Credit account belongs to the platform user.
- Recharge orders belong to the platform user.
- Generation tasks belong to the platform user.
- Linking a new identity should not create a second credit account.

## Login-Gated Generation

Rules:

- Users can browse templates without login.
- Users can fill a template form without login if technically feasible.
- Users must log in before submitting generation or consuming credits.
- Login should not clear filled creation inputs.
- If a user is not logged in at submit time, preserve local draft and return them to the creation flow after login.

## Signup Bonus Credits

Rules:

- Grant bonus credits once per user after successful registration.
- Record bonus as a `CreditLedgerEntry` with type `signup_bonus`.
- Use an idempotency key such as `signup_bonus:{userId}`.
- Bonus amount should be configurable in admin/system settings.
- Bonus credits may have expiration if business requires it.

Open decisions:

- Bonus amount.
- Whether bonus credits can remove watermark.
- Whether bonus credits can be used on all templates.
- Whether abuse controls are needed before granting bonus.

## Credit Recharge Packages

Users buy fixed credit packages.

Suggested package fields:

- packageId
- displayName
- credits
- bonusCredits
- price
- currency
- region
- enabled
- sortWeight
- promotionLabel

Example package structure:

```ts
CreditPackage = {
  packageId: "credits_100",
  displayName: "100 Credits",
  credits: 100,
  bonusCredits: 10,
  price: 9.99,
  currency: "USD",
  enabled: true
}
```

## Recharge Order Flow

1. User selects a credit package.
2. Backend creates `RechargeOrder` with status `pending`.
3. Backend creates provider payment session/order.
4. User completes payment with provider.
5. Provider sends webhook/callback.
6. Backend verifies webhook signature.
7. Backend marks order as paid.
8. Backend creates credit ledger entry with type `recharge_purchase`.
9. User credit account is updated.
10. User sees updated balance.

Critical rule:

- Payment webhook processing must be idempotent. A repeated webhook must not grant credits twice.

## Payment Providers

Provider selection depends on launch region.

Potential directions:

### Global Web

- Stripe.
- PayPal as optional later.

### China-oriented Web / Mini Program

- WeChat Pay.
- Alipay.

### iOS App

- Apple In-App Purchase may be required for digital content/credits depending on app behavior and platform policy.

### Android App

- Google Play Billing may be required depending on distribution channel and app behavior.
- Alternative Android channels may require regional payment options.

Important:

- App store payment policy can affect how credits are sold inside iOS/Android apps.
- Web credits and app-purchased credits may need policy review before cross-platform use.

## Credit Ledger Rules

Credit ledger remains the source of truth.

Transaction types:

- signup_bonus
- campaign_reward
- recharge_purchase
- admin_grant
- freeze
- settle
- release
- refund
- adjustment
- expiration

Generation credit lifecycle:

1. Estimate credits.
2. Freeze credits on accepted submission.
3. Confirm spend on success.
4. Release credits on failure, timeout, or block.

Recharge lifecycle:

1. Payment order created.
2. Payment confirmed.
3. Credits granted exactly once.

## Idempotency Requirements

Required idempotency keys:

- Signup bonus: `signup_bonus:{userId}`
- Payment grant: `payment_grant:{paymentProvider}:{providerOrderId}`
- Task freeze: `task_freeze:{taskId}`
- Task settle: `task_settle:{taskId}`
- Task release: `task_release:{taskId}:{reason}`
- Manual adjustment: generated unique operation ID

## Balance Display

User-facing balance should show:

- Available credits.
- Frozen credits if any.
- Recent credit activity.

Credit center should show:

- Signup bonus.
- Recharge purchase.
- Campaign reward.
- Generation freeze.
- Generation spend.
- Release/refund.
- Admin adjustment if any.

## Campaign Credit Rewards

The credit system should reserve support for activity/campaign-based credit rewards.

Use cases:

- Holiday promotions.
- New template launch campaigns.
- Invite/referral rewards.
- First generation reward.
- Daily check-in reward.
- Recharge bonus campaign.
- Limited-time ecommerce seller campaign.
- Coupon/code redemption.
- Manual marketing campaign grants.

Recommended model:

- Campaign definitions are separate from credit ledger entries.
- When a user qualifies for a campaign reward, the system creates a credit ledger entry with type `campaign_reward`.
- Every campaign reward must have an idempotency key to prevent duplicate grants.

Suggested campaign fields:

- campaignId
- name
- type
- status
- startAt
- endAt
- rewardCredits
- bonusCredits
- eligibilityRules
- usageLimitPerUser
- totalBudgetCredits
- grantedCredits
- applicableTemplates
- expirationPolicy
- createdBy
- createdAt

Campaign reward rules:

- Reward conditions should be explicit and auditable.
- Rewards can be automatic or require code redemption.
- Reward credits may have expiration if business requires it.
- Campaign budget should prevent unlimited credit issuance.
- Campaign rewards should be visible in the user's credit history.
- Agent can generate campaign setup proposals, but high-impact campaigns require approval.

Suggested idempotency keys:

- Invite reward: `campaign:{campaignId}:invite:{inviterUserId}:{inviteeUserId}`
- Check-in reward: `campaign:{campaignId}:checkin:{userId}:{date}`
- Code redemption: `campaign:{campaignId}:code:{code}:{userId}`
- First generation reward: `campaign:{campaignId}:first_generation:{userId}`
- Recharge bonus: `campaign:{campaignId}:order:{orderId}`

## Refund and Chargeback Handling

Generation failure refund:

- Release frozen credits if not settled.
- If settled incorrectly, create compensating refund ledger entry.

Payment refund/chargeback:

- Needs separate business rules.
- If payment is refunded externally, platform may deduct corresponding credits or mark account negative depending on policy.
- If credits were already spent, account may need risk handling.

Open decisions:

- Whether cash refunds are supported.
- How to handle chargebacks after credits are spent.
- Whether credits expire.
- Whether credits are transferable.

## Abuse Prevention

Signup bonus can be abused.

Suggested controls:

- Rate limit registration and verification attempts.
- Device/IP risk checks.
- Require email/phone verification before bonus.
- Do not grant signup bonus purely on account creation; grant only after the configured trust gate passes.
- Use IP/device/email/phone/OAuth/reward-claim signals together rather than relying only on IP limits.
- Support bonus hold/deny state for suspicious accounts.
- Monitor duplicate payment methods or suspicious patterns.
- Limit bonus usage on high-cost templates if needed.
- Agent-generated abuse reports for suspicious users.

## Admin and Agent Operations

Agent can:

- Diagnose credit issues.
- Verify whether signup bonus was granted.
- Verify payment webhook and ledger consistency.
- Prepare manual adjustment proposal.
- Summarize user credit history.
- Detect duplicate grant attempts.

Human approval required:

- Manual credit grants or corrections.
- Payment/chargeback policy exceptions.
- Changing recharge package pricing.
- Changing signup bonus amount.

## MVP Recommendation

Minimum product-grade implementation:

- User login.
- Signup bonus credit grant.
- Credit balance.
- Credit ledger.
- Generation freeze/settle/release.
- Recharge package model.
- Payment order model.
- Payment provider abstraction.
- Webhook idempotency.
- Credit center history.

If payment is not ready for first prototype:

- Keep credit ledger and packages.
- Use admin/test grants.
- Do not fake the ledger model.
- Add payment provider later behind the order abstraction.

## Open Questions

- First launch region and primary UI language.
- First production login method.
- Whether production MVP uses real payment or admin/test credit grants.
- First payment provider if real payment is enabled.
- Signup bonus amount and abuse-control threshold.
- Initial recharge packages and prices.
- Whether credits expire.
- Whether recharge package bonus credits are paid-equivalent or promotional.
- Whether all paid-credit final outputs remove watermark automatically or only selected packages/templates.
- Whether iOS/Android will use app store payments or web purchase flow.

## Decision

Use account-based login, signup bonus ledger grant, recharge packages, payment orders, idempotent payment webhooks, and credit ledger as the source of truth.
