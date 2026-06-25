# Requirements Notes

This file records the evolving product discussion before it is consolidated into the formal SPEC.

## Product Direction

- Project name: AIGC Web
- Current state: React + TypeScript + Vite starter app
- Product form: Start as a website first. Later expansion targets include mini program, Android app, and iOS app.
- Target audience: General public users who want to create AIGC content.
- Primary target users: Ecommerce sellers, ecommerce operators, and product marketing users.
- Core positioning: A template-driven AIGC content creation platform.
- Key differentiation: Users should not need to write prompts. They upload images and/or provide simple descriptions, then generate a complete video through predefined templates.
- Template ownership: Templates are built by the platform team, not end users in the first product direction.
- Template requirement: Templates must be highly flexible because they encapsulate both frontend input experience and backend generation logic.
- Business model direction: Users log in to the website and consume site credits/points to generate desired outputs.
- Credit acquisition: Users can receive signup bonus credits and buy credits through recharge.
- Credit charging modes: The platform should support both fixed template credit cost and variable cost based on generation options.
- Failed generation policy: Credits should be refunded when generation fails.
- Reliability direction: The system should include fallback strategies to reduce visible generation failures.
- Frontend quality requirement: The website UI/UX must be highly polished and visually strong. Frontend design requires dedicated discussion before implementation.
- Credit settlement direction: Use a pre-authorization model. Credits are frozen when a generation task is submitted, confirmed as spent after successful completion, and released/refunded when the task fails or times out.
- Traceability direction: Every generation record must be traceable down to the exact submitted parameters, template version, model/provider request metadata, error state, and credit transaction.

## Confirmed Decisions

- The first implementation surface is a web app.
- The long-term product should be designed with later mini program, Android, and iOS expansion in mind.
- The primary generated artifact is a complete video.
- Template consumers should only perform simple actions such as uploading images and entering descriptions.
- Prompt engineering should be hidden behind platform-provided templates.
- MVP priority template category 1: Product image to ecommerce short video.
- MVP priority template category 2: Portrait photo to portrait/fashion transformation video.
- Ecommerce users are the primary target segment for the first phase.
- The website should use a credit/points consumption model.
- Users must log in before consuming credits to generate content.
- New users can receive signup bonus credits.
- Users can purchase credits through recharge.
- Credit deduction supports both fixed template pricing and dynamic pricing.
- Credit settlement should use pre-deduction/freeze: freeze credits at task submission, confirm deduction after successful completion, and release/refund frozen credits on failure or timeout.
- Credits must be refunded/released if generation fails.
- AI output quality issues are not considered generation failure by default and should not trigger automatic refund.
- Generation workflows should include fallback strategies for retryable failures, provider errors, invalid inputs, moderation blocks, and timeouts.
- The frontend must be designed carefully and beautifully; strong visual quality is a hard requirement, not a nice-to-have.
- Frontend should explore polished card interactions such as 3D card flip, hover preview, bento layout expansion, before/after reveal, and card-to-workspace transitions.
- Frontend design should be prototyped in multiple options before selecting the final visual direction.
- Error states, operational logs, and audit logs are required.
- Every generation task must be fully traceable, including the exact submitted parameters.
- Other content creation sections should be reserved in navigation and product structure, even if not fully implemented in MVP.
- Product structure should include user website modules, template system, generation task system, credit system, and admin/operator console.
- Template should be treated as the core product asset.
- Templates must be versioned, and generation tasks must reference the exact template version used at submission time.
- Template freedom target: use a highly configurable generic template engine from the first major design, covering fields, frontend form rendering, prompts, model workflow, pricing, validation, fallback behavior, and audit metadata.
- Development model: code and configuration changes are primarily performed by Agents. Humans provide product intent, review, approval, and operational decisions.
- Agent-first has three meanings: development Agent, internal operations Agent/automation, and future user-facing Agent. MVP requires Agent-driven development and structured Agent-ready operations, but does not require a public user-facing Agent.
- Template authoring should avoid heavy manual configuration. Agents should generate or update template configs/workflows from natural-language requirements.
- MVP does not need a full drag-and-drop template builder if Agent-authored template-as-code can cover template creation and iteration.
- Admin/operations should also be Agent-first. Agents should handle routine analysis, diagnostics, template/config preparation, validation, and low-risk execution; humans should focus on intent, review, approval, and exceptions.
- Internal operations can start with deterministic diagnosis summaries from structured records; a full LLM-powered admin copilot can come later.
- Templates can produce final outputs in multiple ways: direct AI generation, AI generation plus editing/post-production, pure composition, or multi-step hybrid workflows.
- Adopt a platform-owned `VideoCompositionSpec` intermediate representation for templates that require stitching, editing, captions, overlays, music, or post-production.
- Rendering should use adapter-based execution rather than binding templates directly to one tool such as Jianying/CapCut.
- Recommended MVP rendering direction: Remotion for programmable template composition, FFmpeg for media processing/finalization, direct provider output for simple templates, cloud JSON-to-video providers as optional/fallback, and Jianying/CapCut only as an optional adapter if official stable API/business access is confirmed.
- Template configuration structure will be defined by the engineering Agent. Product owner does not need to understand or manually edit code-level configuration.
- Adopt a generic TemplateConfig structure with these major sections: meta, publication, inputs, layout, validation, pricing, workflow, prompts, output, fallback, moderation, audit, and testFixtures.
- Template definitions should use a hybrid source-of-truth model: repo files for reviewed template definitions, database records for published versions/runtime availability/metrics/operational overrides.

## Current Open Decisions

These decisions do not block frontend prototypes or the mock generation loop, but they block production MVP launch.

- First launch region and primary UI language.
- First production login method: email, phone, third-party login, QR login, or a combination.
- Whether the first production MVP uses real payment or admin/test credit grants.
- First payment provider if real payment is enabled.
- Signup bonus amount and abuse-control threshold.
- Initial recharge packages and prices.
- Whether recharge package bonus credits are paid-equivalent or promotional.
- Whether all paid-credit final outputs remove watermark automatically or only selected packages/templates.
- First real video provider for ecommerce product video.
- First real video provider for portrait/fashion transformation, if different.
- Initial object storage provider and CDN direction.
- Exact media retention durations for uploads, final outputs, intermediates, provider raw outputs, and render logs.
- Final frontend visual/motion direction after prototype review.
- Whether public freeform mode stays internal-only after MVP or becomes a paid/pro feature.

## Topics Already Covered In Drafts

- Template engine and TemplateConfig structure.
- Generation task lifecycle and credit settlement.
- Frontend UX and motion prototype plan.
- Admin/Agent operations.
- System architecture and technical stack.
- Video composition/rendering strategy.
- AI provider adapter strategy and API key management.
- Auth, credit, payment, campaign rewards, and anti-bonus-farming.
- Security, abuse prevention, compliance, and rights.
- Observability, testing, deployment, and release strategy.
- Asset library, provider output persistence, notifications, export/download, support, analytics, discovery, drafts/history, freeform mode, team/workspace reservation, multi-platform reservation, pricing/watermark policy, and MVP backlog.

## Deferred Scope

- Internationalization is reserved for future expansion but not implemented in MVP.
- MVP can use one primary UI language.
- Architecture should avoid hard-coding assumptions that block future internationalization, including currency, timezone, phone format, region, policy copy, template locale, provider region, and text resources.
- Multi-language UI, multi-currency payment, localized policy pages, and per-region provider routing can be deferred.

## Draft Proposals Under Discussion

### Product Modules

- Public marketing/home page: clearly explains the template-driven creation model and highlights ecommerce use cases.
- Template gallery: users browse creation templates by category, scenario, aspect ratio, popularity, and credit cost.
- Creation workspace: selected template-specific form for image upload, simple descriptions, options, preview, cost estimate, and submission.
- Task center: users view generation progress, completed videos, failed tasks, credit refunds, and download/share actions.
- Credit center: users view balance, recharge packages, signup bonus, and credit transaction history.
- Account center: login/profile/basic account settings.
- Admin console: internal operators manage templates, pricing, categories, provider configs, generation records, logs, and credit adjustments.
- See `docs/frontend-ux-direction.md` for the current user-facing website and UX proposal.
- See `docs/admin-console-direction.md` for the current admin/operator console proposal.

### Admin Console Direction

- Admin console is required for internal operations, traceability, and risk control.
- Admin UI should focus on Agent supervision, review, publish, control, search, and audit rather than manually configuring complex templates.
- Core admin modules: dashboard, template review, generation tasks, credit ledger, users, provider monitor, error log center, and settings.
- MVP admin scope should include task search/detail, Agent task diagnosis, credit ledger lookup, user lookup, template publish/pause, provider attempt visibility, Agent-prepared credit adjustment proposals, and manual credit adjustment approval with audit reason.
- Operators must not overwrite immutable task, credit, or published template history. Corrections should be appended as new records/events.
- Manual credit operations and template publication changes must be audited.
- Deterministic low-risk policies, such as automatic credit release for failed or timed-out tasks, should be automated.
- High-risk Agent actions, such as publishing templates, changing provider settings, or issuing manual credit adjustments, should require human approval.

### Frontend UX Direction

- Frontend quality is a product requirement, not only implementation detail.
- The first screen should communicate ecommerce video creation and show real-looking output examples.
- The user journey should be: land, choose template, upload images, enter simple details, see cost, log in if needed, submit, track task, receive video.
- The website should feel premium, efficient, and useful for ecommerce work rather than a generic prompt playground.
- Core pages: home, template gallery, template detail, creation workspace, task center, credit center, account/login, and admin/operator console.
- Creation workspace should show template-specific inputs, validation, preview, credit estimate, and submit action clearly.
- Users should not lose filled inputs when asked to log in before generation.
- Task center should expose result preview, status, failure reason, and refund/release state.

### Template System Direction

- Treat template as the core product unit.
- Each template should have a stable template ID and versioned configuration.
- Template configuration should include user input schema, frontend layout hints, validation rules, pricing rules, prompt/workflow config, provider/model config, output settings, and moderation requirements.
- Existing tasks must keep referencing the template version used at submission time, not the latest edited template.
- Use template-as-code as the preferred initial implementation direction: templates are expressed in strongly validated structured files/config modules that Agents can edit safely.
- Provide schema validation, dry-run checks, sample input fixtures, cost calculation tests, and preview rendering for templates.
- Publish templates through an explicit review process instead of allowing unvalidated Agent changes to go live automatically.
- See `docs/template-config-design.md` for the current proposed TemplateConfig structure.

### Agent-Driven Development Direction

- Humans describe required templates, UI changes, pricing changes, and workflow changes in natural language.
- Agents modify code/config, run validations/tests, generate previews, and summarize the exact changes.
- Manual configuration UI should be minimized for complex template internals.
- Admin/operator UI should focus on review, publish, visibility, ordering, pricing override, logs, and operational controls.
- Agent-generated template changes must be reproducible and traceable through Git history or equivalent version records.
- The system should include guardrails: schema validation, type checks, task simulation, provider payload validation, and rollback to previous template versions.
- Humans should not need to manually edit complex template internals. Human workflow is natural-language brief, Agent implementation, validation, preview, human approval, publish.

### System Architecture Direction

- See `docs/system-architecture-direction.md`.
- Use a web-first, API-first architecture so future mini program, Android, and iOS clients can reuse backend capabilities.
- Start with a modular monolith plus background workers rather than premature microservices.
- Core backend modules: auth/user, template registry, asset, generation task, credit ledger, pricing, workflow engine, provider adapters, moderation, admin/Agent operations, and notifications.
- Long-running generation must run in async workers through a queue.
- Relational database should store strongly consistent business records such as users, tasks, template versions, credit ledger, provider attempts, and audit logs.
- Object storage should store uploaded images, generated videos, posters, and preview assets.
- Cache must not be the source of truth for credits or tasks.
- Provider integrations should be isolated behind normalized adapters.
- Provider API differences must be isolated in adapters because each supplier can have different auth, request schema, file upload, async jobs, polling/webhooks, error codes, rate limits, and output formats.
- Agent-first operations require structured, searchable, and safe APIs for templates, task timelines, credit ledgers, provider attempts, and errors.
- API keys and provider secrets must be managed through a secure secret management layer and must never appear in templates, frontend code, Git history, task records, provider logs, or audit logs.

### Video Composition and Rendering Direction

- See `docs/video-composition-rendering-strategy.md`.
- Do not assume every template is complete after one AI generation call.
- Use `VideoCompositionSpec` as the canonical internal timeline/composition format for post-production templates.
- Renderer adapters can execute the spec through Remotion, FFmpeg, cloud video APIs, direct model output, or future renderers.
- Avoid making Jianying/CapCut draft files the core platform representation because that creates vendor/tool lock-in and potential stability risk.
- Agent should be able to generate composition specs, Remotion components, FFmpeg finalization commands, previews, and renderer choice explanations.

### Data Model Direction

- See `docs/data-model-direction.md`.
- Core entities: User, UserCreditAccount, CreditLedgerEntry, RechargeOrder, TemplateDefinition, TemplateVersion, TemplateOperationalOverride, Asset, AssetInspection, GenerationTask, GenerationTaskEvent, ProviderAttempt, VideoCompositionRecord, RenderAttempt, ModerationRecord, AuditLog, AgentOperation, and ProviderConfig.
- Published template versions, generation task events, credit ledger entries, provider attempts, render attempts, moderation records, and audit logs should be immutable or append-only.
- GenerationTask should store exact submitted inputs, submitted asset references, template version, pricing breakdown, credit state, output assets, and final error details.
- Every generation task must be reconstructable through related events, ledger entries, provider attempts, composition records, render attempts, and audit logs.
- UserCreditAccount can cache available/frozen balances, but CreditLedgerEntry is the source of truth.

### AI Provider and Model Strategy

- See `docs/ai-provider-strategy.md`.
- Use a capability-based provider adapter strategy. Templates should request capabilities rather than call provider APIs directly.
- Provider adapters must normalize different provider docs/API shapes into internal request/status/error/output models.
- Capability categories include text-to-video, image-to-video, video editing, first/last frame video, subject/reference video, image generation/editing, upscaling, audio/voice, captions, and moderation.
- Provider selection should consider capability, template preference, quality, consistency, supported output, latency, health, cost, commercial terms, privacy, region, historical success rate, and fallback availability.
- MVP provider rollout should start with adapter infrastructure and a mock provider, then integrate one primary video provider and one aggregator/fallback or second provider.
- Provider attempt logging is required for every model/API call.
- Provider cost should be tracked separately from user credit price.
- Agents should compare provider metrics, diagnose provider failures, recommend routing/fallback changes, and propose credit price changes when provider costs change.
- Agents may work with provider config metadata and secret references, but should not expose raw API keys.

### Content Compliance and Rights Direction

- See `docs/content-compliance-rights-strategy.md`.
- Users must confirm they own or have permission to use uploaded product images, portraits, text, logos, and other materials.
- Portrait/person-image templates require explicit consent confirmation and task-linked consent records.
- Content moderation should happen before generation where possible, and high-risk outputs should be checked after generation.
- Blocked or invalid submissions should not consume credits or should release frozen credits.
- The platform should not overpromise that every AI-generated output is automatically copyrightable, rights-cleared, or safe for all commercial use.
- Terms, privacy policy, upload rights confirmation, portrait consent, prohibited content policy, and takedown/report process are required product surfaces.
- User uploads should not be used for model training without separate explicit consent.
- Admin/Agent must be able to trace takedown and dispute cases to task, user, inputs, template version, provider, moderation record, and output assets.

### Auth, Credit, and Payment Direction

- See `docs/auth-credit-payment-strategy.md`.
- Users can browse templates before login, but must log in before submitting generation or consuming credits.
- Login should not clear filled template inputs; unauthenticated users should return to the creation flow after login.
- Use a single platform user account model that can support web, mini program, Android, and iOS.
- Login methods should be staged by launch region: email/phone for MVP, WeChat/Google/Apple later as needed.
- QR code scan login and third-party OAuth/link login should be supported as account identity methods.
- Multiple login identities should bind to one platform user account; credits, recharge orders, and generation tasks belong to the platform user, not each login identity.
- QR login sessions must be short-lived, single-use, confirmed on the mobile/provider side, and rate-limited.
- Third-party login must verify OAuth state/nonce and provider responses, and must not grant signup bonus multiple times across linked identities.
- Signup bonus credits should be granted once per user through the credit ledger with an idempotency key.
- The credit system should reserve a campaign/activity reward mechanism for holiday promotions, invite/referral rewards, first generation rewards, check-ins, recharge bonuses, template launch campaigns, redemption codes, and other marketing activities.
- Campaign rewards should create credit ledger entries with type `campaign_reward` and use idempotency keys to prevent duplicate grants.
- Campaigns should support eligibility rules, per-user limits, total credit budget, time windows, applicable templates, expiration policies, and audit records.
- Credit recharge should use packages, recharge orders, provider payment sessions, verified payment webhooks, and idempotent credit grants.
- Payment webhook processing must never grant credits twice.
- Payment provider choice depends on region and client: Stripe/PayPal for global web, WeChat Pay/Alipay for China-oriented flows, Apple IAP/Google Play Billing considerations for apps.
- If real payment is delayed, keep the ledger/order abstractions and use admin/test grants rather than faking balance logic.
- Signup bonus and recharge systems need abuse controls such as verification, rate limits, and suspicious pattern monitoring.
- Signup bonus should not be granted solely on account creation. It should require a configurable trust gate such as verified email/phone/OAuth identity, first creation intent, or risk-score approval.

### Security and Abuse Prevention Direction

- See `docs/security-abuse-strategy.md`.
- Credits should be protected like money-equivalent value.
- Abuse prevention is required for signup bonus, campaign rewards, payment webhooks, generation submission, uploads, provider API usage, and admin/Agent operations.
- Anti-bonus-farming should use multiple risk signals, not IP limits alone. Signals can include IP/subnet, device, email domain, phone verification, OAuth trust, registration velocity, verification-code velocity, disposable email/proxy/VPN signals, referral loops, payment method reuse, and campaign claim patterns.
- High-risk users can be allowed to register while signup bonus is held, delayed, reduced, or denied.
- Rate limits should cover registration, login, verification code send, QR polling, upload, pricing preview, generation submit, payment order creation, and campaign reward claims.
- Uploads require file type/size validation, ownership checks, signed URLs, and moderation before expensive generation.
- Admin/Agent high-risk actions require approval and audit logs.
- Provider secrets must use secret references and log redaction.
- Logs should retain diagnostic IDs and metadata while redacting secrets, tokens, auth headers, signed URLs, and sensitive personal data where not needed.
- Agent should generate abuse/anomaly summaries for credit issuance, provider cost spikes, upload rejection, refund spikes, and login/generation anomalies.

### Observability and SLO Direction

- See `docs/observability-slo-strategy.md`.
- Observability is required for generation tasks, provider calls, render attempts, credit settlement, payment webhooks, queue health, abuse patterns, and frontend funnels.
- Logs must be structured and linked by stable IDs such as taskId, providerAttemptId, renderAttemptId, creditLedgerEntryId, requestId, and traceId.
- Metrics should track generation success/failure/timeout/refund, provider latency/error/cost, render success/duration, credit freeze/settle/release, payment webhook success/failure, signup/campaign reward abuse, and frontend funnel conversion.
- Alerts should cover provider failure spikes, queue backlog, render failures, frozen credits not releasing, payment webhook failures, campaign budget anomalies, and signup bonus farming.
- Draft SLOs: task status visible within 2s after submit, normal credit freeze within 2s, failed/timed-out credit release within 60s after final failure decision, verified payment credit grant within 30s.
- Agents should generate incident summaries, failed-task diagnosis, provider behavior analysis, credit anomaly reports, and operational summaries.

### Testing and Quality Direction

- See `docs/testing-quality-strategy.md`.
- Testing should focus most heavily on templates, credits, generation tasks, provider adapters, render adapters, auth, uploads, payment webhooks, campaign rewards, audit logs, and log redaction.
- Every template should have schema validation, fixtures, pricing tests, prompt dry-run, workflow dry-run, provider payload validation, layout preview validation, fallback validation, and audit coverage checks before publish.
- Every provider adapter should have contract tests for success, retryable error, policy block, timeout, rate limit, output normalization, and secret redaction.
- Credit operations must be tested for idempotency: signup bonus, campaign reward, payment grant, freeze, settle, release, refund, and manual adjustment.
- Frontend quality requires desktop/mobile E2E checks, visual/motion QA, reduced-motion fallback, and no text overflow or incoherent overlap.
- Agent changes must run targeted tests and summarize changes/test results before high-risk approval.

### Deployment and Release Direction

- See `docs/deployment-release-strategy.md`.
- Use separate local, staging, and production environments.
- Local should use `.env`, mock providers, mock payment callbacks, and fake assets. Production secrets must never be used locally.
- Staging should use separate database/storage/queue/secrets, provider sandbox where possible, payment sandbox, and restricted admin access.
- Deployable units include frontend, backend API, background worker, renderer worker, admin/Agent surface, template definitions, and database migrations.
- Template release should be validation-driven: Agent creates/updates config, fixtures, previews, tests, then human approves staging/production publish.
- Published template versions are immutable; rollback activates a previous version or publishes a rollback version.
- Database migrations should be versioned, tested on staging, and extra-reviewed when touching credit ledger, payment, or task records.
- Workers must support graceful shutdown and idempotent job processing.
- Feature flags should support new templates, providers, renderers, pricing rules, frontend prototypes, campaigns, and payment providers.
- Agent should generate release notes, impacted-module summaries, migration risk notes, rollback instructions, and post-release monitoring summaries.
- Human approval is required for production release and high-risk changes.

### Technical Stack Decision

- See `docs/technical-stack-decision.md`.
- Use TypeScript across frontend, backend, workers, templates, provider adapters, render adapters, and tests.
- Keep the current React + Vite + TypeScript frontend.
- Use NestJS for the backend API and modular monolith structure.
- Use PostgreSQL as the source of truth and Prisma for ORM/migrations.
- Use Redis + BullMQ for async queues and workers.
- Use S3-compatible object storage through a storage adapter.
- Use Remotion for programmable video composition and FFmpeg for media finalization.
- Use Zod for template/config/runtime validation.
- Use backend-owned auth with `User` and `UserIdentity` models so email, phone, QR, WeChat, Google, Apple, and future providers can bind to one platform account.
- Use payment provider abstraction; provider choice depends on launch region.
- Use Vitest and Playwright for testing.
- Use Pino, OpenTelemetry, and Sentry for logs/tracing/errors.
- Use Docker-first deployment and convert to a monorepo when backend work starts.

### Asset Storage and Lifecycle Direction

- See `docs/asset-storage-lifecycle-strategy.md`.
- Use S3-compatible object storage through a storage adapter.
- Every uploaded or generated media file should have an Asset record linked to user, task, template/provider/render context where applicable.
- Asset categories include user uploads, generated outputs, intermediate assets, provider raw outputs, template preview assets, and render logs.
- Each user should have a personal asset library for reusable uploads, generated outputs, posters, logos, and future brand assets.
- Users should be able to save generated outputs to their asset library and reuse library assets in future generation tasks.
- Private user assets and generated videos should use signed URLs and ownership checks.
- Public template preview assets can use public/CDN URLs.
- Uploads require server-side validation after upload, including file type, size, readability, dimensions/duration, and moderation/inspection where needed.
- Define retention policies for uploads, final outputs, intermediates, provider raw outputs, render logs, and template previews.
- Provider-returned files/URLs should be treated as temporary. Required outputs must be downloaded and persisted into platform object storage before provider URLs expire.
- Deletion/takedown should disable access, mark asset deletion, and preserve audit metadata.
- Cleanup jobs should remove abandoned uploads and expired intermediate assets.
- Agent can diagnose missing assets, detect orphaned assets, generate storage cost reports, and prepare takedown summaries.

### Brand Kit and Ecommerce Workspace Direction

- See `docs/brand-workspace-strategy.md`.
- Reserve a personal ecommerce workspace and lightweight brand kit from the beginning.
- Brand kit/workspace should not make the frontend main flow complex. In MVP, expose it like advanced optional controls rather than a full management surface.
- Users should not be forced to configure a brand kit before first generation.
- After successful generation, users can save assets/product info to their workspace.
- Brand kit can include store/brand name, logo, colors, font/tone preference, default CTA, target platforms, and shop URL.
- Product profiles can include product name, category, main images, detail images, selling points, target audience, offer text, and style preference.
- Creation workspace can prefill fields from brand kit, product profile, platform preset, and asset library, while still allowing users to override.
- Basic required template inputs should stay first. Brand/product/platform reuse should live under a collapsed advanced/options section unless the user explicitly chooses it.
- Task records should store the resolved brand/product/platform values used at submission.
- MVP should include lightweight personal workspace, optional brand kit fields, optional product profile, and reuse of saved assets.
- Team workspaces, product catalog import, full brand kit editor, dedicated brand kit management page, and platform integrations can be delayed.

### Notification Direction

- See `docs/notification-strategy.md`.
- In-app notifications are the MVP baseline.
- Task center remains the source of truth for generation status; credit center remains the source of truth for credit history.
- User notifications should cover generation completed/failed/timed out/blocked, credit release/refund, signup bonus, campaign reward, recharge success/failure, and important account/security events.
- Admin/operator notifications should cover provider failure spikes, queue backlog, render failures, payment webhook failures, frozen credits not releasing, campaign budget limits, signup abuse spikes, and approval-required actions.
- Notification delivery should be asynchronous and should not block task, payment, or credit flows.
- External channels such as email, SMS, WeChat service notifications, web push, iOS push, Android push, Slack/Feishu/DingTalk can be added later through delivery adapters.
- Notifications must not include raw provider payloads, raw prompts, API keys, signed URLs, or sensitive task details.

### Export, Download, and Sharing Direction

- See `docs/export-sharing-strategy.md`.
- Generated outputs are private to the user by default.
- MVP should support completed video preview, signed download, and save-to-asset-library.
- Download should use platform-persisted asset URLs, not provider temporary URLs.
- Signed download URLs should be short-lived and generated after ownership checks.
- Public share links, direct social publishing, export variants, batch download, exact platform compliance presets, and watermark removal upsell can be delayed.
- Platform export presets should be reserved for ecommerce/social workflows, including 9:16, 1:1, and 16:9 ratio options where supported.
- Free/signup/campaign outputs should have watermarks.
- Paid-credit final outputs can be eligible for no-watermark output, subject to final business policy.
- Download, save, share, and export events should be logged for analytics and support.

### Draft Preview and HD Final Direction

- See `docs/draft-preview-hd-strategy.md`.
- Do not build product flow around one specific model's draft mode.
- Reserve draft preview as a generic provider/template capability.
- Provider adapters should declare whether they support draft preview, preview resolution, finalize-from-draft, draft reference fields, preview cost, and watermark requirements.
- Template configs can opt into preview generation, but default MVP flow should remain simple final generation.
- Preview generation should be optional/advanced unless a template is expensive enough or uncertain enough to benefit from preview-first UX.
- Preview and final generation should be separate credit ledger operations and linked tasks.
- If preview succeeds but user dislikes it, preview credits are consumed. If preview fails technically, release/refund preview credits.
- Draft/preview outputs can be lower resolution and watermarked. Final HD generation consumes final credits.

### Pricing, Plan, and Watermark Direction

- See `docs/pricing-plan-watermark-strategy.md`.
- Credits are the primary usage currency in MVP.
- MVP should use credit-package pricing rather than subscriptions.
- Pricing can be fixed or dynamic by template, duration, quality, provider/model, output count, preview/final mode, watermark removal, and future priority queue.
- Free outputs always have watermarks.
- Signup bonus and campaign reward outputs are free outputs unless explicitly marked otherwise.
- Paid-credit final outputs can be eligible for no-watermark output, subject to final package rules.
- Preview/draft outputs can remain watermarked even when paid.
- Task records should store pricingId, pricingVersion, pricingBreakdown, credit source, credits frozen/settled, and provider/render cost snapshot where available.
- Provider/render/storage costs should be tracked separately from user credit price so Agent can flag low-margin templates, high-retry templates, cost spikes, and bad campaign ROI.
- Subscription plans, credit expiration, priority queue, and advanced entitlements can be delayed.

### Multi-Platform Adaptation Direction

- See `docs/multi-platform-adaptation-strategy.md`.
- Launch web first, but keep backend API-first and client-neutral for future mini program, Android, and iOS clients.
- Business rules should live in backend, not web-only frontend code.
- Templates should expose client-renderable schemas, validation rules, display hints, supported ratios/platforms, and pricing preview so future clients can render forms differently.
- Auth model should support multiple identity providers mapped to one platform user.
- Payment provider abstraction is required because web, mini program, Android, and iOS may use different payment channels and app-store policies.
- Mobile clients need upload/photo-library flow, asset library, task status, in-app notifications, and eventually push/service notifications.
- Critical interactions must not rely on hover only; card flip/hover prototypes need tap alternatives.
- Admin/Agent console can remain web-only.
- MVP should include responsive web, client-neutral APIs, future identity/payment compatibility, and clientType in analytics/events.

### MVP Boundary and Implementation Backlog

- See `docs/mvp-boundary-and-backlog.md`.
- Build in two layers: frontend prototype validation first, then product-grade generation loop.
- First build `/prototypes` with card flip, cinematic hover, bento board, before/after reveal, and card-to-workspace transition.
- Product-grade MVP should let a logged-in user browse templates, choose product/portrait template, upload/select assets, enter simple inputs, see credit cost, submit generation, freeze credits, process through mock/real provider, settle or release credits, preview/download/save output, and inspect task history.
- Backend MVP should include API, template registry, credit ledger, generation task lifecycle, queue/worker, mock provider, asset storage, audit logs, and admin/Agent traceability.
- Real provider and payment integrations should come after the mock generation loop works, unless launch needs real payment immediately.
- MVP excludes native apps, mini program, public freeform studio, team workspace UI, full project management, drag-and-drop template editor, marketplace, advanced recommendations, subscriptions, public share links, direct social publishing, full internationalization, and advanced fraud scoring.

### Product Analytics and Growth Direction

- See `docs/product-analytics-growth-strategy.md`.
- Track product analytics separately from operational logs.
- Analytics should cover template discovery, creation funnel, login interruption, credit/recharge funnel, draft preview funnel, campaign funnel, result download, and save-to-library.
- Do not store raw prompts, private media URLs, API keys, payment card data, provider raw payloads, or sensitive personal data in analytics events.
- Useful event dimensions include templateId, templateVersionId, category, scenario, creditCost, creditSource, taskId, output mode/quality, watermark status, target platform, aspect ratio, duration, providerId, renderer, campaignId, and packageId.
- Key product metrics include visitor-to-creation-start, creation-to-submit, submit-to-success, result download rate, save-to-library rate, repeat generation, recharge conversion, paid generation ratio, template ROI, campaign ROI, and preview-to-final conversion.
- Agents should summarize funnel performance, identify low-converting templates, recommend UX/pricing/template changes, compare preview flows, and detect poor campaign ROI or abuse.

### Support, Dispute, and Refund Direction

- See `docs/support-dispute-refund-strategy.md`.
- Support should be Agent-assisted and based on task timelines, credit ledger, provider attempts, render attempts, moderation records, payment orders, and audit logs.
- Automatic credit release/refund applies to technical generation failure, timeout, input/moderation block before generation, and provider/render failure preventing final output delivery.
- No automatic refund by default for AI output quality dissatisfaction, user changed mind, wrong user input that still generated successfully, or external publishing issues.
- Manual/goodwill credit requires reason, audit log, and approval above threshold.
- MVP should include report-issue action from task detail, basic support ticket model, Agent-generated diagnosis summary, manual credit adjustment proposal, and clear refund/release state in task and credit center.
- Support/refund abuse should be monitored by user, task, campaign/free-credit usage, repeated quality complaints, and manual credit frequency.

### Template Discovery, Search, and Recommendation Direction

- See `docs/template-discovery-strategy.md`.
- Template discovery should be ecommerce-forward in MVP, with portrait/fashion as the second core category and future categories reserved without overcrowding the UI.
- Template cards should show sample preview, name, category/scenario, credit cost, ratio/duration tags, required input summary, and quick start.
- MVP discovery should use category tabs, scenario filters, platform filter, ratio/duration tags, and recommended/new/popular sorting.
- Ranking starts with manual sort weight, featured flag, status, and campaign association; later it can blend analytics such as creation-start rate, submit rate, success rate, download/save rate, recharge influence, complaint rate, and margin.
- Campaign/seasonal sections should be supported for featured templates, new templates, hot ecommerce templates, and limited-time credit reward templates.
- Agent can propose card copy, tags, category changes, ranking changes, campaign collections, and templates to pause or promote.

### Projects, Drafts, and Generation History Direction

- See `docs/project-draft-history-strategy.md`.
- MVP should support task center/generation history, basic draft persistence, preserving creation form through login, generate-again from previous task, and save output to asset library.
- Drafts are editable work-in-progress and can be overwritten; submitted GenerationTask records remain immutable.
- Users should not be forced to create projects before generating.
- Full project management, draft list page, campaign-level organization, team project sharing, and advanced version comparison can be delayed.
- Generate-again creates a new draft/task using previous submitted inputs and available assets; it does not mutate the old task.
- If old assets expired/deleted or old template version is unavailable, the UI should ask the user to re-upload/select assets or show compatibility notice.

### Freeform Creation and Model Studio Direction

- See `docs/freeform-creation-strategy.md`.
- Template-driven creation remains the default product path.
- Reserve a separate advanced freeform mode for users or operators who want to use model capabilities directly.
- Freeform mode should not put a raw prompt box on the homepage or visually compete with template creation for ordinary users.
- MVP does not need public freeform mode unless there is a strong business reason; internal/admin experimentation can come first.
- Freeform generation must reuse the same provider adapters, credit ledger, task lifecycle, asset storage, moderation, watermark, support, and audit systems.
- Freeform mode has higher abuse and cost risk, so it should have stronger moderation, clearer credit estimates, and stricter rate limits.
- Successful freeform workflows can be converted by Agent into reusable template drafts.

### Team, Organization, and Permission Direction

- See `docs/team-permission-strategy.md`.
- MVP starts with individual user accounts, personal workspace, personal asset library, and personal credit balance.
- Architecture should reserve workspace/team ownership so future ecommerce teams can share assets, brand kits, product profiles, projects, tasks, and possibly credits.
- Do not build complex team management UI in MVP.
- Avoid hard-coding `userId` as the only ownership boundary for every creation asset.
- Future roles can include owner, admin, creator, viewer, finance, and support.
- Shared workspace credits can be added later, but user-scoped credits are simpler for MVP.
- Agent should not grant cross-user/workspace access or add/remove team members without approval.

### Generation Task Lifecycle

- Suggested states: draft, submitted, credits_frozen, validating, queued, generating, retrying, succeeded, failed, timed_out, blocked, refunded, settled.
- Task records should include exact submitted input values, uploaded asset references, pricing calculation, template version, provider/model metadata, retry attempts, final output references, and error details.
- Recommended user-visible statuses: waiting, generating, succeeded, failed, timed_out, blocked, refunded.
- Recommended internal statuses: draft, submitted, validating, validation_failed, credits_freezing, credits_frozen, queued, provider_submitting, provider_processing, retrying, post_processing, succeeded, settling, settled, failed, timed_out, blocked, refunding, refunded.
- Credit lifecycle should be tied to task lifecycle: estimate credits before submit, freeze credits after task acceptance, confirm spend after success, release frozen credits after failure/timeout/block.
- Every state transition should produce an event log entry with timestamp, actor/system source, previous state, next state, reason, and related payload.
- Provider calls should be tracked as separate attempts under the generation task, so retries and fallback providers are traceable.

### Credit Ledger Direction

- Use a ledger model rather than only storing a mutable balance.
- Balance can be derived from credit transactions, while a cached balance can be stored for performance.
- Suggested transaction types: signup_bonus, recharge_purchase, admin_grant, freeze, settle, release, refund, adjustment, expiration.
- Every credit transaction should have a unique idempotency key to prevent duplicate freeze, settle, release, or refund.
- Credit transactions related to generation should reference the generation task ID.
- Recharge/payment records should be separate from credit ledger records but linked after payment success.

### Failure Handling Direction

- Invalid user input before generation: block task, do not freeze credits if possible; if already frozen, release credits.
- Moderation block before generation: block task and release credits.
- Provider retryable error: retry according to template fallback policy.
- Provider unavailable: switch provider if template fallback permits.
- Provider final failure: mark failed and release/refund credits.
- Timeout: mark timed_out and release/refund credits.
- Successful provider output with imperfect AI quality: mark succeeded, settle credits.

### MVP Scope Proposal

- User side first: home page, template gallery, ecommerce product video workspace, portrait transformation workspace, login placeholder, credit display, task history.
- Admin side first: template CRUD can start as a configuration/admin-only data model if a full visual template builder is too large for MVP.
- Keep template builder flexibility in the data model from day one, even if the first admin UI is simple.

## User Stories

- As a general user, I can choose a video template, upload required images, add a short description, and generate a complete video without writing prompts.
- As an ecommerce user, I can upload product images and generate a product marketing short video suitable for online sales channels.
- As a portrait/fashion user, I can upload a portrait photo and generate a stylized photo or outfit/transformation video.
- As a logged-in user, I can view my credit balance and spend credits to run a generation task.
- As a new user, I can receive bonus credits after registration so I can try generating content.
- As a paying user, I can buy credit packages and use them for generation.
- As a user, if my generation task fails, my spent credits are returned automatically.
- As a user, if my submitted content is invalid or blocked before generation starts, my credits are not consumed.
- As a user, if AI output quality is imperfect but the task completes successfully, the task is treated as completed unless a separate support/refund process is defined later.
- As an admin/operator, I can inspect a generation task and see its user, template version, submitted parameters, pricing calculation, credit transaction, provider request/response metadata, retry attempts, final status, and error details.
- As a platform operator, I can design and publish templates that package the required user inputs and backend generation workflow.
- As a platform operator, I can configure credit prices for templates and generation options.

## Functional Requirements

- Provide a public website experience for browsing and using AIGC video templates.
- Allow users to upload images and provide simple text descriptions as template inputs.
- Generate a complete video from a selected template.
- Hide prompt details and backend model orchestration from end users.
- Support a flexible template system that can define both frontend input requirements and backend generation behavior.
- Provide account login before generation.
- Maintain user credit balances.
- Grant signup bonus credits to new users.
- Support campaign/activity credit rewards.
- Support credit recharge purchase.
- Freeze/pre-deduct credits when users submit generation tasks.
- Confirm credit deduction after generation succeeds.
- Support fixed template credit cost.
- Support dynamic credit cost based on selected generation options.
- Release/refund frozen credits automatically when generation fails, times out, or does not enter generation due to invalid inputs or moderation block.
- Record credit transactions for auditability.
- Provide generation fallback behavior to reduce failed tasks.
- Provide user-facing error states for failed, timed-out, blocked, and retrying tasks.
- Store full task-level logs for generation tasks.
- Store the exact submitted parameters for each generation task.
- Store template version and pricing version used by each task.
- Store provider/model request metadata, response metadata, retry attempts, and error details.
- Provide admin/operator traceability for every generation and credit transaction.
- Show reserved areas or navigation entries for future content sections.

## Non-Functional Requirements

- High-quality visual design and frontend interaction quality are mandatory.
- Generation and credit records must be auditable and traceable.
- Logs should support debugging provider failures, user disputes, credit settlement issues, and task state reconstruction.

## Constraints

- Initial product should be web-first, but architecture should avoid assumptions that block future mini program, Android, or iOS clients.
- Credit-related operations should be auditable because they affect user value.
- Credit deduction and refund must be idempotent to prevent double-charge or double-refund.
- Generation failure handling should distinguish between retryable provider errors, invalid user inputs, policy/moderation blocks, timeout, and unknown failures.
- AI output quality variation is expected and should not be classified as technical failure by default.
- Do not rely only on user-visible history for auditability; internal immutable logs/records are required.

## Out of Scope

- Native apps and mini program for MVP.
- Public freeform model studio for MVP.
- Public user-facing Agent for MVP.
- Team workspace UI for MVP.
- Full project management for MVP.
- Full brand kit editor for MVP.
- Drag-and-drop template editor for MVP.
- Public template marketplace for MVP.
- Advanced recommendation engine for MVP.
- Subscription plans for MVP.
- Public share links and direct social publishing for MVP.
- Full internationalization for MVP.
- Advanced fraud/risk scoring for MVP.

## Discussion Log

### 2026-06-25

- Initialized a React + TypeScript + Vite web project.
- Created this requirements note file to capture future product discussion.
- Clarified product direction: a web-first AIGC content creation site for general users, centered on high-flexibility templates that let users generate full videos from simple image uploads and descriptions without writing prompts.
- Clarified MVP focus: ecommerce product-image short videos and portrait/fashion transformation videos are the primary template categories.
- Clarified business mechanism: logged-in users consume website credits/points to generate outputs.
- Clarified product structure: other creation sections should be reserved for future expansion.
- Clarified credit policy: registration bonus credits, paid credit recharge, fixed and dynamic deduction modes, and automatic refund on generation failure.
- Clarified reliability requirement: generation should have fallback strategies to minimize failed outputs.
- Clarified frontend requirement: the web experience must be visually polished and carefully designed.
- Clarified credit settlement model: freeze credits on submission, confirm deduction after successful generation, release/refund on failure or timeout.
- Clarified refund scope: AI output quality issues are expected and should not automatically count as generation failure.
- Clarified operational requirement: errors, logs, submitted parameters, template version, provider metadata, and credit transactions must be traceable for every generation record.
- Accepted initial architecture direction: user-facing website, template system, generation task lifecycle, credit center, task center, and admin/operator console.
- Accepted MVP implementation direction: build a complete user-side generation loop first, while keeping the template data model flexible from day one.
- Defined the initial generic TemplateConfig structure in `docs/template-config-design.md`.
- Clarified that template structure is an Agent/engineering responsibility; the product owner should review product behavior and previews rather than manually editing configuration.
- Drafted frontend UX direction in `docs/frontend-ux-direction.md`, covering primary user journey, main pages, visual principles, and MVP frontend scope.
- Drafted motion prototype plan in `docs/motion-prototype-plan.md`, covering card flip, hover preview, bento board, before/after reveal, and card-to-workspace transition options.
- Drafted admin console direction in `docs/admin-console-direction.md`, covering roles, modules, traceability, credit operations, provider monitoring, and audit requirements.
- Revised admin direction to Agent-first operations, minimizing manual work and using humans mainly for approval of high-risk or externally visible actions.
- Drafted system architecture direction in `docs/system-architecture-direction.md`, covering modular backend boundaries, async generation workers, data stores, provider adapters, APIs, and Agent-first operational requirements.
- Drafted video composition/rendering strategy in `docs/video-composition-rendering-strategy.md`, covering direct generation, post-production workflows, `VideoCompositionSpec`, renderer adapters, Remotion, FFmpeg, cloud video APIs, and Jianying/CapCut risk positioning.
- Drafted data model direction in `docs/data-model-direction.md`, covering users, credits, templates, assets, generation tasks, provider attempts, render attempts, video composition records, moderation, audit logs, and Agent operations.
- Drafted AI provider/model strategy in `docs/ai-provider-strategy.md`, covering capability-based routing, provider adapters, candidate providers, fallback, cost mapping, provider attempt logging, and Agent responsibilities.
- Confirmed provider API differences and API key management requirements: adapters normalize each provider's API shape, while secrets are stored only through secret references/secret management and redacted from code, configs, frontend, task records, and logs.
- Added SPEC readiness assessment in `docs/spec-readiness-review.md`. Current foundation is ready for frontend prototypes and the mock generation loop; production MVP still depends on business/provider decisions such as launch region, payment, login, provider, storage, retention, and frontend visual selection.
- Drafted content compliance and rights strategy in `docs/content-compliance-rights-strategy.md`, covering upload rights, portrait consent, moderation, commercial-use disclaimers, privacy, takedown, provider terms, and regional compliance watchlist.
- Drafted auth, credit, and payment strategy in `docs/auth-credit-payment-strategy.md`, covering login gating, signup bonus, recharge packages, payment orders, webhook idempotency, credit ledger, app-store payment considerations, abuse prevention, and Agent operations.
- Drafted security and abuse prevention strategy in `docs/security-abuse-strategy.md`, covering account abuse, credit abuse, payment abuse, upload abuse, generation abuse, provider secrets, admin/Agent permissions, rate limits, log redaction, and MVP security scope.
- Drafted observability and SLO strategy in `docs/observability-slo-strategy.md`, covering metrics, structured logs, traces, dashboards, alerts, draft SLOs, and Agent diagnosis responsibilities.
- Drafted testing and quality strategy in `docs/testing-quality-strategy.md`, covering static checks, unit/integration/contract/template/E2E/security/observability tests, critical scenarios, visual QA, and Agent-driven quality workflow.
- Drafted deployment and release strategy in `docs/deployment-release-strategy.md`, covering local/staging/production environments, template release flow, code release flow, migrations, workers, rollback, feature flags, CI gates, smoke checks, and Agent release responsibilities.
- Drafted technical stack decision in `docs/technical-stack-decision.md`, selecting a TypeScript-first stack with React/Vite, NestJS, PostgreSQL/Prisma, Redis/BullMQ, S3-compatible storage, Remotion/FFmpeg, Zod, Vitest/Playwright, Pino/OpenTelemetry/Sentry, and Docker-first deployment.
- Drafted asset storage and lifecycle strategy in `docs/asset-storage-lifecycle-strategy.md`, covering asset categories, S3-compatible storage, upload/download flows, signed URLs, retention, deletion/takedown, inspection, cost management, security, and Agent asset operations.
- Drafted brand kit and ecommerce workspace strategy in `docs/brand-workspace-strategy.md`, covering personal workspace, brand kit, product profiles, platform presets, asset reuse, template integration, Agent role, and MVP scope.
- Drafted notification strategy in `docs/notification-strategy.md`, covering user events, admin alerts, Agent summaries, notification data model, async delivery, frontend UX, and MVP scope.
- Drafted export, download, and sharing strategy in `docs/export-sharing-strategy.md`, covering private output access, signed downloads, asset library save, public share links, platform export presets, variants, watermark rules, retention, audit, and MVP scope.
- Drafted draft preview and HD final strategy in `docs/draft-preview-hd-strategy.md`, deciding that free outputs have watermarks and that low-cost preview/draft generation should be a generic provider/template capability rather than a Seedance-specific product flow.
- Drafted pricing, plan, and watermark strategy in `docs/pricing-plan-watermark-strategy.md`, covering credit sources, watermark policy, export quality, fixed/dynamic pricing, recharge packages, subscriptions later, cost-margin tracking, pricing versioning, refund linkage, and MVP scope.
- Drafted multi-platform adaptation strategy in `docs/multi-platform-adaptation-strategy.md`, covering web-first/API-first design, mini program/native app constraints, auth, payment, uploads, notifications, UI adaptation, feature parity, data model implications, and MVP scope.
- Drafted MVP boundary and implementation backlog in `docs/mvp-boundary-and-backlog.md`, defining frontend prototypes, web app skeleton, backend foundation, template engine MVP, mock generation loop, admin/Agent traceability, real provider/payment phases, in/out scope, first templates, and readiness criteria.
- Drafted product analytics and growth strategy in `docs/product-analytics-growth-strategy.md`, covering funnels, event taxonomy, safe event properties, KPIs, attribution, Agent analysis, and MVP analytics scope.
- Drafted support, dispute, and refund strategy in `docs/support-dispute-refund-strategy.md`, covering common support cases, automatic/manual refund policy, support ticket model, Agent-assisted investigation, user/admin UX, abuse prevention, and MVP scope.
- Drafted template discovery, search, and recommendation strategy in `docs/template-discovery-strategy.md`, covering ecommerce taxonomy, template cards/detail, filters, ranking, recommendations, campaign sections, admin/Agent operations, and MVP scope.
- Drafted projects, drafts, and generation history strategy in `docs/project-draft-history-strategy.md`, covering draft persistence, task history, generate-again, lightweight projects, login preservation, retention, frontend UX, and MVP scope.
- Drafted freeform creation/model studio strategy in `docs/freeform-creation-strategy.md`, keeping templates as the default path while reserving an advanced direct-model mode that reuses the same credit, provider, task, asset, moderation, and audit systems.
- Drafted Agent operating model in `docs/agent-operating-model.md`, clarifying development Agent, internal operations Agent, and user-facing Agent boundaries, and confirming that public user-facing Agent is out of MVP.
- Drafted team, organization, and permission strategy in `docs/team-permission-strategy.md`, reserving workspace/team ownership and future shared assets/credits/roles while keeping MVP individual-user focused.
- Implemented the first frontend prototype pack in `src/App.tsx` and `src/App.css`, covering five reviewable directions: studio flip cards, fast video preview, ecommerce bento board, before/after reveal, and creation workspace. Added review notes in `docs/frontend-prototype-review.md`.
- Expanded the frontend prototype into a fuller product shell with workbench, template gallery, creation workspace, task center, asset library, credit center, and a separate visual lab route. Verified the template-to-workspace flow with mock data.
- Decided to reduce frontend page density through an overlay model: template detail Modal, large creation Studio Overlay, task detail Drawer, filter sheet/popover, credit Modal, and media Lightbox. Added `docs/frontend-overlay-interaction-spec.md`.
