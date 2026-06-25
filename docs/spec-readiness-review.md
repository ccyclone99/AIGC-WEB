# SPEC Readiness Review

Status: Current assessment

## Current Verdict

The project is ready to start implementation at the frontend prototype and mock-flow level.

It is not yet ready to launch a production MVP, because several business and provider decisions remain open. Those open decisions do not block the first build phase.

## Solid Enough To Start

### Product Direction

- Web-first AIGC content creation site.
- Ecommerce users are the primary audience.
- Core creation model is template-driven, not prompt-first.
- First template categories are ecommerce product short videos and portrait/fashion transformation videos.
- Frontend quality is a hard requirement.

### MVP Shape

- MVP boundary is defined in `mvp-boundary-and-backlog.md`.
- First build path is frontend prototypes, then mock user flow, then product-grade mock generation loop.
- Native apps, mini program, team UI, public freeform studio, subscriptions, public sharing, and full internationalization are out of MVP.

### Architecture

- TypeScript-first stack is selected.
- Modular monolith plus workers is selected.
- Backend is API-first for future clients.
- PostgreSQL/Prisma, Redis/BullMQ, S3-compatible storage, Remotion/FFmpeg, and provider adapters are selected as direction.

### Business Rules

- Credit ledger is the source of truth.
- Credits freeze on accepted generation submission.
- Credits settle after success.
- Credits release after failure, timeout, or block.
- Signup bonus, campaign rewards, recharge purchases, and manual adjustments are modeled.
- Free outputs are watermarked.
- Paid-credit final outputs can be no-watermark depending on final package policy.

### Traceability

- Generation tasks are traceable through task events, credit ledger, provider attempts, render attempts, assets, moderation records, and audit logs.
- Provider API differences and API key management are covered.
- Provider temporary URLs must be persisted to platform storage before expiry.

### Operations

- Admin console is Agent-first.
- Support, dispute, refund, observability, testing, deployment, and security strategies are defined.

## Open Decisions Before Production MVP

These do not block frontend prototypes or mock generation loop:

- First launch region.
- Primary UI language.
- First production login method.
- Whether MVP uses real payment or admin/test credit grants.
- First payment provider if payment is real.
- Signup bonus amount and abuse-control threshold.
- Initial recharge package prices.
- Whether recharge package bonus credits are paid-equivalent or promotional.
- Whether all paid-credit final outputs remove watermark automatically or only selected packages/templates.
- First real video provider for ecommerce product video.
- First real video provider for portrait/fashion transformation, if different.
- Initial object storage provider and CDN direction.
- Exact media retention durations for uploads, final outputs, intermediates, provider raw outputs, and render logs.
- Selected frontend motion/visual direction.
- Whether public freeform mode stays internal-only after MVP or becomes a paid/pro feature.

## Recommended Immediate Build Sequence

1. Build `/prototypes` with the planned motion variants.
2. Review and select or merge visual direction.
3. Build web app skeleton with mock data.
4. Implement template gallery, creation workspace, task center, credit center, and asset library UI.
5. Convert to monorepo and add backend foundation.
6. Build template schema, credit ledger, generation task lifecycle, mock provider, and asset storage.
7. Add real provider/payment integrations after the mock task-credit-asset loop is verified.

## Readiness Conclusion

The project is ready to move from planning to implementation. The first implementation target should be frontend prototypes, not production backend or real provider integration.
