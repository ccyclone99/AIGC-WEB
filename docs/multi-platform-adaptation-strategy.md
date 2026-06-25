# Multi-Platform Adaptation Strategy

Status: Draft proposal

This document defines how AIGC Web should reserve support for future mini program, Android, and iOS clients while starting as a website.

## Goals

- Launch as web first.
- Reuse backend APIs for future clients.
- Avoid frontend assumptions that block mobile app or mini program.
- Prepare for app-store payment constraints.
- Prepare for mobile upload, login, notification, and asset-library experiences.

## Principles

- Backend is API-first.
- Business rules live in backend, not web-only frontend.
- Templates provide client-renderable schemas.
- Avoid web-only assumptions in task, asset, credit, and payment models.
- Keep mobile clients thin and consistent with web.
- Do not implement native apps in MVP.

## Client Types

### Web

MVP primary client.

Capabilities:

- Full template discovery.
- Creation workspace.
- Asset upload/library.
- Task center.
- Credit center.
- Payment/recharge.
- Admin/Agent console.

### Mini Program

Future client.

Likely constraints:

- Platform login.
- Platform payment rules.
- File upload limitations.
- Service notification restrictions.
- WebView or native mini program UI constraints.
- Review/compliance requirements.

### Android App

Future client.

Consider:

- Google Play Billing if distributed through Google Play and selling digital credits.
- Alternative channel payments for non-Google distribution.
- Push notifications.
- Native media picker/upload.
- Background task status notifications.

### iOS App

Future client.

Consider:

- Apple In-App Purchase rules for digital goods/credits.
- Apple login requirements in some cases.
- Push notifications.
- Photo library permissions.
- App review rules around AI-generated content.

## API Design Requirements

Public APIs should be client-neutral:

- Auth.
- Template list/detail.
- Asset upload.
- Pricing preview.
- Generation submit.
- Task list/detail.
- Credit balance/ledger.
- Recharge packages/orders.
- Notification list.
- Asset library.

API responses should not assume web layout.

Templates should expose:

- Input schema.
- Validation rules.
- Display hints.
- Supported platforms/ratios.
- Pricing preview.

Each client can render the form appropriately.

## Authentication

Support identity binding:

- Email.
- Phone.
- QR login.
- WeChat.
- Google.
- Apple.
- Future platform identities.

Rules:

- One platform user can bind multiple identities.
- Credits/tasks/assets belong to platform user/workspace.
- Native tokens/sessions can be client-specific but map to same user.

## Payment Considerations

Web:

- Stripe/PayPal or WeChat Pay/Alipay depending on launch region.

Mini Program:

- Platform payment likely required.

iOS:

- Apple IAP may be required for digital credits/content.

Android:

- Google Play Billing may be required for Google Play distribution.

Important:

- Payment provider abstraction is required.
- App-store-purchased credits and web-purchased credits may need policy review before cross-use.
- Pricing packages may differ by platform due to app-store fees.

## Upload and Asset Library

Mobile clients need:

- Camera/photo library upload.
- Progress feedback.
- Retry/resume if possible.
- Compression before upload where appropriate.
- Asset library browsing.

Backend should support:

- Signed upload URLs.
- Upload session records.
- Asset validation after upload.
- Ownership checks.

## Task Status and Notifications

All clients need:

- Task status polling or realtime updates.
- Task center.
- In-app notifications.

Future mobile:

- Push notifications for completion/failure/refund.
- Mini program service notifications where allowed.

## UI Adaptation

Web creation workspace:

- Can use two-column layout with sticky preview/cost panel.

Mobile/mini program:

- Step-by-step layout.
- Persistent bottom action bar.
- Simplified template cards.
- Upload-first flow.
- Avoid hover-only interactions.
- Card flip/hover prototypes need tap alternatives.

## Feature Parity Strategy

MVP web has full capability.

Future clients can start with:

- Template browsing.
- Creation submission.
- Task result viewing.
- Asset library.
- Credits balance.

Admin/Agent console can remain web-only.

## Data Model Implications

Store:

- clientType on sessions and important events.
- platform on payment order.
- platform on notification delivery.
- platform on analytics events.
- device/app version where available.

Do not:

- Tie tasks to web-only state.
- Tie credits to one client.
- Store frontend-only form state as final business record.

## MVP Requirements

Required:

- API-first backend design.
- Client-neutral template schemas.
- Responsive web frontend.
- No hover-only critical interactions.
- Auth model supports future identity providers.
- Payment abstraction supports future platform-specific providers.
- Analytics includes clientType.

Can be delayed:

- Actual mini program.
- Actual Android/iOS app.
- Push notifications.
- App-store payments.
- Native upload optimizations.

## Open Questions

- First future client: mini program, Android, or iOS?
- First launch region.
- Whether app users can use web-purchased credits.
- Whether app-store rules require separate app credit balance.
- Which mobile notifications are required.

## Decision

Build web first, but keep backend, template schemas, auth, payment, assets, notifications, and analytics client-neutral. Admin/Agent console can remain web-only.
