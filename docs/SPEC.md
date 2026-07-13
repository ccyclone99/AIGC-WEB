# AIGC Web SPEC

Status: Draft, frontend prototype baseline updated
Last updated: 2026-07-10

## 1. Overview

AIGC Web is a web-first AIGC content creation platform. The first product surface is a website, with future expansion reserved for mini program, Android, and iOS apps.

The product is not a generic prompt box. Its core value is template-driven creation: platform-built templates package frontend inputs, prompts, model workflows, pricing, validation, rendering, fallback, and audit behavior. Users only choose a template, upload images or select saved assets, add simple descriptions/options, and generate complete videos.

Primary users are ecommerce sellers, ecommerce operators, and product marketing users.

Primary MVP template categories:

- Product image to ecommerce short video.
- Portrait photo to portrait/fashion transformation video.

Current user-facing website navigation:

- `首页`: public product and conversion surface with its own persistent primary-navigation item; the Logo also returns here.
- `创作`: a template-first flow. Users preview and select a template before entering asset input and submission.
- `作品`: the library for complete generation history, generated outputs, and reusable user uploads.
- Active tasks use an in-workspace status area and a conditional global task entry instead of a permanent `进度` page.
- Credits and account actions use the existing top-bar entries and overlays instead of a permanent `我的` page.

The approved navigation and interaction baseline is defined in [template-first-creation-experience-spec.md](./template-first-creation-experience-spec.md). It supersedes the earlier two-entry navigation and direct-to-editor creation decisions.

The homepage and production desk are separate surfaces. The homepage is the public product entry. The production desk is the logged-in production center. Template details can still open in a modal for preview, but serious creation should move into the production desk's creation state, not stay trapped inside a modal.

Page layout principle:

- Each page layout must match the page role.
- Public pages can use stronger brand and conversion presentation.
- Logged-in operational pages should be denser, quieter, and action-oriented.
- Discovery pages should prioritize scanning and comparison.
- Creation inputs are template-defined. Selling-point text is not globally required.
- The first completed MVP template should be an image-only template: the user uploads/selects one image and can generate without writing text.
- Creation states should prioritize the required input for the selected template and the generation action. Advanced settings should be output parameters such as ratio, duration, resolution, and clarity. Template switching, text fields, and multi-product controls should stay secondary unless that template requires them.
- Image replacement should open an asset-library picker rather than switch templates inside the creation surface. The picker should prioritize existing user assets, keep upload as the first grid item, show selected state, and clearly mark preview-only assets that cannot be used by the current template.
- Submitting a generation task should not force navigation to `任务`. The task enters the background, credits are frozen, a toast confirms submission, and the creation surface remains available for the next image/template.
- If the same image, template, and output parameters already have an active background task, the creation surface should show a processing state instead of allowing accidental duplicate submission. Users can change the image or output settings to create a new variant.
- Each generation submit must carry an idempotency key derived from the submitted template version, input asset, and output settings or an equivalent server-issued submit token.
- MVP creation pages should avoid a permanent right-side parameter/checklist panel. Parameters should appear inline, collapsed, or contextually when needed so PC width is used for the media stage and repeated creation.
- Tracking pages should prioritize state, progress, traceability, and recovery actions.
- Task detail must expose structured traceability before backend integration: submitted parameter snapshot, template/pricing version, credit ledger state, provider attempts, render/post-production records, moderation/fallback state, and output asset state.
- Task failure state must distinguish failure stage, reason, error code, retryability, user-facing message, and whether frozen credits were released.
- Account/asset pages should prioritize ownership, retention, credits, and reuse.

Frontend prototype demonstration requirements:

- Before any customer-facing demo, the frontend must satisfy [customer-demo-cleanup-spec.md](./customer-demo-cleanup-spec.md): remove prototype language, hide internal trace/payment/risk controls, and present task/template/credit states in customer-facing language.
- Login/register surfaces can be simulated, but must show QR login, third-party login, signup bonus, and account entry points.
- QR login must distinguish waiting, scanned, confirmed, expired, and rejected states.
- Recharge can be simulated, but package selection, payment order creation, pending/paid/failed/expired states, balance change, and ledger change must be visible.
- Payment order cancellation must be represented before backend integration.
- Upload states must include success, validation failure, user cancellation, retry/reselect, and server-side rejection.
- Video generation can be simulated, but required input validation, product selection, credit pre-freeze, task creation, task progress, task success, task failure/refund, and asset-library entry must be visible.
- Task details must expose traceability context in user-facing language and reserve room for submitted parameters, template version, provider attempts, render attempts, and credit transactions.
- Asset library must expose media type and retention/expiry context because provider-returned resources may expire.

## 2. Goals

- Let users generate complete videos without writing prompts.
- Make templates the core product asset.
- Support high-flexibility Agent-authored templates.
- Provide a polished, premium frontend experience.
- Support login, credits, recharge, signup bonus, activity rewards, and credit settlement.
- Make every generation task traceable down to inputs, template version, pricing, provider attempts, render attempts, credit transactions, and errors.
- Support direct AI generation and post-production workflows.
- Avoid provider lock-in through adapters.
- Use an Agent-first development and operations model.
- Start with web while keeping future mini program/native app support possible.

## 3. Non-Goals

Not in MVP:

- Native apps or mini program.
- Public freeform model studio.
- Team workspace UI.
- Full project management.
- Full brand kit editor.
- Drag-and-drop template editor.
- Public template marketplace.
- Advanced recommendation engine.
- Subscription plans.
- Public share links.
- Direct social publishing.
- Full internationalization.
- Advanced fraud/risk scoring.

## 4. Target Users

Primary:

- Ecommerce sellers.
- Ecommerce operators.
- Product marketers.

Secondary/future:

- Portrait/fashion creators.
- Social media content creators.
- Agencies and ecommerce teams.
- Advanced users using a future Model Studio.

## 5. Core Product Model

### Template-Driven Creation

Templates are versioned product assets. A template can define:

- Metadata and publication status.
- User inputs.
- Frontend layout hints.
- Validation rules.
- Pricing rules.
- Prompt composition.
- Model/provider workflow.
- Video composition/rendering rules.
- Fallback behavior.
- Moderation.
- Audit coverage.
- Test fixtures.

See [template-config-design.md](./template-config-design.md).

### Agent-First Development

Humans describe product intent. Agents generate or modify code/config, run validations/tests, create previews, summarize changes, and prepare publish actions. Humans approve high-risk or externally visible changes.

There are three separate Agent meanings:

- Development Agent: modifies repository code/config/templates and runs validation.
- Internal operations Agent: assists admins with diagnosis, summaries, proposals, and analysis.
- User-facing Agent: a future product feature where end users chat with an assistant.

This applies to:

- Template creation.
- Provider adapter changes.
- Pricing changes.
- Admin diagnostics.
- Support investigations.
- Release summaries.

MVP requires Agent-driven development and Agent-ready operations. It does not require a public user-facing chat Agent or a fully autonomous internal operations Agent. The first implementation can use structured records and deterministic diagnosis summaries while keeping the system ready for deeper Agent automation.

See [agent-operating-model.md](./agent-operating-model.md).

## 6. User Experience

MVP user path:

1. User visits website.
2. User sees ecommerce video creation as the main value.
3. User browses templates.
4. User selects ecommerce or portrait/fashion template.
5. User uploads assets or selects from asset library.
6. MVP first template only requires one image. Optional text appears only when a specific template requires it.
7. User sees estimated credit cost.
8. User logs in if needed.
9. User submits generation.
10. User tracks task status.
11. User previews, downloads, and saves output.

Frontend quality is mandatory. Motion/card interactions should be explored through prototypes before final visual selection.

Frontend complexity should be reduced through lightweight pages plus overlays:

- `创作` opens with a 9:16 template-preview feed; the user explicitly chooses a template before entering the editor.
- `全部模板` is a dedicated secondary page with categories and optional search, not a primary-navigation item.
- Template use routes into the production editor state, not a cramped drawer or modal.
- Ordinary templates hide advanced settings and use recommended output values. Only fields explicitly enabled by a template are user-editable.
- Template configuration must follow the frontend-approved contract for inputs, output settings, capabilities, pricing version, settlement, and trace fields.
- Task detail opens a task drawer.
- Filters use popovers or bottom sheets.
- Credit/recharge actions use modals.
- Media previews use lightboxes.

See:

- [frontend-polish-spec.md](./frontend-polish-spec.md)
- [mainstream-design-research-and-ui-proposal.md](./mainstream-design-research-and-ui-proposal.md)
- [frontend-ux-direction.md](./frontend-ux-direction.md)
- [motion-prototype-plan.md](./motion-prototype-plan.md)
- [frontend-overlay-interaction-spec.md](./frontend-overlay-interaction-spec.md)
- [template-config-contract.md](./template-config-contract.md)

## 7. MVP Scope

### In Scope

User-facing:

- Home page.
- Template-first creation discovery plus a dedicated all-templates page.
- Creation workspace for two template categories.
- Login-gated submit.
- Credit balance.
- Works library containing generation history and reusable uploads, with active task status available inside creation.
- Asset upload and user-managed asset library.
- Completed video preview.
- Signed download.
- Save output to asset library.
- Basic in-app notifications.

Backend:

- API-first backend.
- Template registry.
- Credit ledger.
- Generation task lifecycle.
- Queue/worker.
- Mock provider.
- Asset storage.
- Audit/task logs.

Backend should not start from page-local assumptions. Before implementation, use [backend-interface-prep.md](./backend-interface-prep.md) to confirm API groups, frontend states, payload snapshots, idempotency, credit/payment states, and traceability fields. Use [backend-api-contract.md](./backend-api-contract.md) as the MVP endpoint and DTO baseline.

Admin/Agent:

- Task traceability.
- Credit ledger lookup.
- Template version list.
- Provider attempt records.
- Deterministic diagnosis summary from structured records.

See [mvp-boundary-and-backlog.md](./mvp-boundary-and-backlog.md).

### Current Frontend Code Boundary

The prototype has started separating backend-facing concepts from page markup:

- `src/types.ts`: shared template, task, asset, ledger, account, and output-setting types.
- `src/prototypeData.ts`: replaceable local seed data for templates, tasks, assets, credit packages, payment order, upload receipt, signup risk checks, filters, and ledger rows.
- `src/domain.ts`: pure business helpers for template input labels, output defaults, asset eligibility, category filtering, and output comparison.
- `src/hooks/usePrototypeStore.ts`: local prototype state boundary that can later be replaced by API-backed slices.
- `src/api/*`: frontend API contract placeholders and mapping boundary for backend integration.
- `src/components/HomeView.tsx`: public product entry.
- `src/components/StudioPage.tsx`: unified creation surface with template switching, generation controls, active task status, and recent results.
- `src/components/TemplatePicker.tsx`: in-workspace template discovery and compatibility confirmation.
- `src/components/WorksView.tsx`: generated works, task states, recovery actions, and reusable upload management.
- `src/components/AuthPanel.tsx`: QR login, third-party login entry, signup reward, and signup risk checks.
- `src/components/AssetPicker.tsx`: creation asset selection, category filtering, upload entry, and preview-only asset states.
- `src/components/AssetManager.tsx`: user-managed asset library.
- `src/components/CreditPanel.tsx`: payment order lifecycle, credit summary, recharge packages, and ledger display.
- `src/components/TaskDetail.tsx`: task traceability, failure reason, credit state, and output actions.
- `src/components/UploadReceiptPanel.tsx`: upload status, cancellation, and retry/reselect actions.
- `src/components/AppOverlays.tsx` and `src/components/OverlayPrimitives.tsx`: modal, drawer, sheet, lightbox, toast, and asset-picker orchestration.
- `src/App.tsx`: current page composition.

Backend integration should replace local data/state in controlled slices rather than directly rewriting the full UI.

The first backend implementation should follow [backend-api-contract.md](./backend-api-contract.md) for auth, templates, assets, generation tasks, credits, and payments.

### First Templates

MVP ecommerce product short video:

- Required input: one product image.
- Optional inputs such as detail images, selling points, target platform, and style should remain template-dependent advanced fields, not required fields in the first runnable flow.
- User-visible advanced settings should focus on output parameters first:
  - aspect ratio;
  - duration;
  - resolution;
  - quality.
- The creation surface should allow submission without writing a prompt or filling a selling-point description.
- Submitted tasks must snapshot the selected template, input asset, output settings, pricing version, and credit-freeze record.

Reserved ecommerce variants:

- Detail-image enhanced product video.
- Selling-point subtitle product video.
- Platform-specific ad creative.
- Style/filter-driven product visual.

Portrait/fashion transformation:

- Portrait image.
- Desired style/outfit direction.
- Optional gender/style preference.
- Duration.
- Aspect ratio.
- Explicit portrait consent.

## 8. Credits and Pricing

Users must log in before consuming credits.

Credit sources:

- Signup bonus.
- Campaign/activity rewards.
- Recharge purchase.
- Admin grant.
- Refund/adjustment.

Credit lifecycle for generation:

1. Estimate credits.
2. Freeze credits when task is accepted.
3. Settle credits when task succeeds.
4. Release credits when task fails, times out, or is blocked before generation.

Credit ledger records must be structured, not plain text rows. Each ledger entry should include:

- ledger ID;
- transaction kind: freeze, settlement, release, recharge, reward, admin adjustment;
- transaction status: frozen, settled, released, credited, granted, adjusted;
- signed amount;
- related task/payment/campaign/admin reference ID;
- user-facing title/source/note;
- creation time and idempotency key.

Rules:

- Fixed and dynamic template pricing are supported.
- Pricing version and breakdown must be stored per task.
- Free outputs have watermarks.
- Signup bonus and campaign reward outputs are watermarked.
- Paid-credit final outputs can be no-watermark depending on final package policy.
- Preview/draft outputs can remain watermarked.
- Provider/render/storage costs are tracked separately from user credit price.

See:

- [auth-credit-payment-strategy.md](./auth-credit-payment-strategy.md)
- [pricing-plan-watermark-strategy.md](./pricing-plan-watermark-strategy.md)
- [draft-preview-hd-strategy.md](./draft-preview-hd-strategy.md)

## 9. Auth and Accounts

One platform user can bind multiple login identities:

- Email.
- Phone.
- QR scan login.
- WeChat.
- Google.
- Apple.
- Future OAuth providers.

Credits, recharge orders, generation tasks, and assets belong to the platform user/workspace, not to an individual login identity.

Signup bonus is granted once per platform user and must use an idempotency key.

Anti-bonus-farming requires multiple risk signals, not IP limits alone.

## 10. Tasks and Generation

Every generation submission creates a `GenerationTask`.

Task records store:

- User.
- Template and template version.
- `creationMode`: template or freeform.
- `outputMode`: preview or final.
- Submitted inputs.
- Submitted assets.
- Pricing breakdown.
- Credits frozen/settled.
- Provider attempts.
- Render attempts.
- Output assets.
- Error state.
- Watermark state.

Task events are append-only and record state transitions.

User-visible states:

- Waiting.
- Generating.
- Succeeded.
- Failed.
- Timed out.
- Blocked.
- Refunded.

See:

- [data-model-direction.md](./data-model-direction.md)
- [project-draft-history-strategy.md](./project-draft-history-strategy.md)

## 11. Video Composition and Rendering

Not every template is a single model call. Supported workflow types:

- Direct AI output.
- AI generation plus editing/post-production.
- Pure composition.
- Multi-step hybrid workflows.

The platform owns an intermediate `VideoCompositionSpec` for timeline/composition workflows. Renderer adapters execute it through Remotion, FFmpeg, cloud render APIs, or future renderers.

Recommended MVP direction:

- Direct provider output for simple templates.
- Remotion + FFmpeg for structured ecommerce composition.
- Jianying/CapCut only as optional adapter after official stable API/business access is confirmed.

See [video-composition-rendering-strategy.md](./video-composition-rendering-strategy.md).

## 12. AI Provider Strategy

Templates request capabilities, not provider APIs.

Capability examples:

- Text to video.
- Image to video.
- Draft/preview video generation.
- Video editing.
- Subject/reference video.
- Image generation/editing.
- Upscaling.
- Voice/music/captions.
- Moderation.

Provider differences are isolated in adapters. API keys and secrets use secret references and never appear in templates, frontend code, task records, or logs.

MVP rollout:

1. Adapter layer and mock provider.
2. One primary real provider plus one fallback/aggregator if needed.
3. Capability-based routing after metrics exist.

See [ai-provider-strategy.md](./ai-provider-strategy.md).

## 13. Assets and Storage

Each user has an asset library.

The asset library is user-managed, not only a passive system output list. Users must be able to manage their own reusable uploads and generated outputs.

Assets include:

- User uploads.
- Generated videos.
- Posters.
- Intermediate files.
- Provider raw outputs.
- Template previews.
- Render logs.

Rules:

- Use S3-compatible object storage.
- Every file has an `Asset` record.
- Private user assets use signed URLs.
- Provider temporary URLs must be downloaded and persisted before expiry.
- Generated outputs can be saved to asset library.
- Users can upload, preview, download, rename, delete/archive, and reuse library assets in new generation tasks.
- Users can filter assets by media type and retention/expiry state.
- Deletion/takedown disables access and records audit metadata.
- Deleting or archiving a library item must not break historical task traceability; task records keep metadata and asset references needed for audit.

See [asset-storage-lifecycle-strategy.md](./asset-storage-lifecycle-strategy.md).

## 14. Admin and Agent Operations

Admin is an Agent-ready operations surface, not a heavy manual configuration tool.

MVP admin/Agent capabilities:

- Task search/detail.
- Task timeline.
- Credit ledger lookup.
- Provider attempt lookup.
- Template version list.
- Deterministic diagnosis summaries from structured records.
- Manual credit adjustment proposal and approval.

High-risk Agent actions require human approval:

- Template publish.
- Provider routing changes.
- Credit adjustments.
- Payment/provider settings.
- Large campaigns.

See [admin-console-direction.md](./admin-console-direction.md).

## 15. Compliance, Security, and Abuse

Required MVP controls:

- Upload rights confirmation.
- Portrait consent.
- Prohibited content policy.
- Pre-generation moderation placeholder or integration.
- Task-linked consent and moderation records.
- No user asset training without explicit separate consent.
- Secret management and log redaction.
- Rate limits for registration, login, upload, generation, payment order creation, campaign claims.
- Anti-bonus-farming trust gate.
- Audit logs for credit and template operations.

See:

- [content-compliance-rights-strategy.md](./content-compliance-rights-strategy.md)
- [security-abuse-strategy.md](./security-abuse-strategy.md)

## 16. Notifications and Support

MVP notifications:

- In-app notification center.
- Task completion/failure/refund.
- Recharge status if payment enabled.
- Campaign reward.
- Admin approval-required alerts.

Support:

- Task detail has report-issue action.
- Agent creates diagnosis summary from task, credit, provider, render, payment, and audit records.
- Automatic refunds are rule-based.
- Manual/goodwill credits require reason and approval.

See:

- [notification-strategy.md](./notification-strategy.md)
- [support-dispute-refund-strategy.md](./support-dispute-refund-strategy.md)

## 17. Analytics and Observability

Product analytics should track:

- Template discovery.
- Creation funnel.
- Login interruption.
- Credit/recharge funnel.
- Draft preview funnel.
- Campaign funnel.
- Result download/save.

Operational observability should track:

- Generation success/failure/timeout.
- Provider latency/error/cost.
- Render success/duration.
- Credit freeze/settle/release.
- Payment webhook status.
- Signup/campaign abuse.
- Queue health.

See:

- [product-analytics-growth-strategy.md](./product-analytics-growth-strategy.md)
- [observability-slo-strategy.md](./observability-slo-strategy.md)

## 18. Technical Stack

Decision:

- TypeScript-first.
- React + Vite frontend.
- NestJS backend.
- PostgreSQL + Prisma.
- Redis + BullMQ.
- S3-compatible object storage.
- Remotion + FFmpeg rendering.
- Zod validation.
- Vitest + Playwright testing.
- Pino + OpenTelemetry + Sentry.
- Docker-first deployment.
- Monorepo when backend work starts.

See [technical-stack-decision.md](./technical-stack-decision.md).

## 19. Testing and Release

Required quality gates:

- Type check.
- Lint.
- Template schema validation.
- Credit idempotency tests.
- Task lifecycle tests.
- Provider adapter contract tests.
- Render adapter contract tests.
- Frontend E2E smoke.
- Log redaction tests.

Release model:

- Local, staging, production environments.
- Template validation/publish flow.
- Code CI gates.
- Staging smoke tests.
- Human approval for production/high-risk changes.
- Rollback strategy for code, templates, provider routing, and campaigns.

See:

- [testing-quality-strategy.md](./testing-quality-strategy.md)
- [deployment-release-strategy.md](./deployment-release-strategy.md)

## 20. Future Reserved Capabilities

Reserved but not MVP:

- Team/workspace sharing.
- Public freeform Model Studio.
- Public user-facing Agent.
- Subscriptions.
- Advanced brand kit editor.
- Public share links.
- Direct social publishing.
- Native apps and mini program.
- Internationalization.

See:

- [team-permission-strategy.md](./team-permission-strategy.md)
- [freeform-creation-strategy.md](./freeform-creation-strategy.md)
- [multi-platform-adaptation-strategy.md](./multi-platform-adaptation-strategy.md)

## 21. Open Decisions Before Product-Grade MVP

These do not block frontend prototype work, but block production MVP:

- First launch region and primary UI language.
- First production login method.
- Whether MVP payment is real or admin/test credits only.
- First payment provider if real payment is enabled.
- Signup bonus amount and abuse-control threshold.
- First recharge packages and prices.
- Whether recharge package bonus credits are paid-equivalent or promotional.
- Whether all paid-credit final outputs remove watermark automatically or only selected packages/templates.
- First real video provider for ecommerce product video.
- First real video provider for portrait/fashion transformation, if different.
- Initial object storage provider and CDN direction.
- Exact media retention durations for uploads, final outputs, intermediates, provider raw outputs, and render logs.
- Which frontend motion prototype is selected.
- Whether public freeform mode stays internal-only after MVP or becomes a paid/pro feature.

## 22. Implementation Start Recommendation

Start implementation with:

1. Frontend prototype pack.
2. Selected visual direction.
3. Web app skeleton with mock data.
4. Monorepo/backend foundation.
5. Template schema and two initial templates.
6. Mock generation loop with real credit/task lifecycle.

Do not start with real provider/payment integration until the mock task-credit-asset loop is verified.
