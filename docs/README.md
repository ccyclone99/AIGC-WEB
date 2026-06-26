# AIGC Web Documentation Index

This directory contains the current product, architecture, and implementation planning documents for AIGC Web.

## Start Here

- [SPEC.md](./SPEC.md): consolidated product and technical specification.
- [mvp-boundary-and-backlog.md](./mvp-boundary-and-backlog.md): MVP scope and implementation sequence.
- [requirements-notes.md](./requirements-notes.md): full discussion notes and evolving decisions.
- [spec-readiness-review.md](./spec-readiness-review.md): readiness assessment and remaining gaps.
- [detail-review-checklist.md](./detail-review-checklist.md): detailed consistency review and remaining decisions.

## Product and UX

- [frontend-ux-direction.md](./frontend-ux-direction.md): user-facing website and page structure.
- [frontend-polish-spec.md](./frontend-polish-spec.md): next frontend-only visual, interaction, and responsive polish pass.
- [mainstream-design-research-and-ui-proposal.md](./mainstream-design-research-and-ui-proposal.md): mainstream competitor research and complete UI proposal.
- [motion-prototype-plan.md](./motion-prototype-plan.md): card flip, hover preview, bento, before/after, and transition prototypes.
- [frontend-prototype-review.md](./frontend-prototype-review.md): implemented prototype pack and review criteria.
- [frontend-overlay-interaction-spec.md](./frontend-overlay-interaction-spec.md): modal, drawer, sheet, and lightbox interaction rules.
- [template-discovery-strategy.md](./template-discovery-strategy.md): template categories, cards, filters, ranking, and recommendations.
- [project-draft-history-strategy.md](./project-draft-history-strategy.md): drafts, generation history, and generate-again behavior.
- [brand-workspace-strategy.md](./brand-workspace-strategy.md): lightweight brand kit and ecommerce workspace.
- [export-sharing-strategy.md](./export-sharing-strategy.md): preview, download, save, sharing, and export.
- [notification-strategy.md](./notification-strategy.md): user/admin notifications.
- [support-dispute-refund-strategy.md](./support-dispute-refund-strategy.md): support, disputes, and refund handling.
- [freeform-creation-strategy.md](./freeform-creation-strategy.md): reserved advanced model studio/freeform mode.
- [agent-operating-model.md](./agent-operating-model.md): development Agent, internal operations Agent, and user-facing Agent boundaries.

## Business and Growth

- [auth-credit-payment-strategy.md](./auth-credit-payment-strategy.md): login, signup bonus, recharge, payment, and credit ledger.
- [pricing-plan-watermark-strategy.md](./pricing-plan-watermark-strategy.md): credit pricing, watermark, packages, HD, and margin.
- [draft-preview-hd-strategy.md](./draft-preview-hd-strategy.md): low-cost preview/draft and HD final rules.
- [product-analytics-growth-strategy.md](./product-analytics-growth-strategy.md): funnels, events, KPIs, and growth analysis.

## Architecture and Backend

- [technical-stack-decision.md](./technical-stack-decision.md): chosen TypeScript-first stack.
- [system-architecture-direction.md](./system-architecture-direction.md): API, workers, modules, data stores, provider adapters.
- [data-model-direction.md](./data-model-direction.md): core entities and relationships.
- [backend-interface-prep.md](./backend-interface-prep.md): frontend-to-backend interface prep and readiness gate.
- [backend-api-contract.md](./backend-api-contract.md): backend API endpoint and DTO contract drafted from the frontend state.
- [template-config-design.md](./template-config-design.md): generic TemplateConfig structure.
- [template-config-contract.md](./template-config-contract.md): frontend-approved MVP template contract used by the current prototype.
- [video-composition-rendering-strategy.md](./video-composition-rendering-strategy.md): VideoCompositionSpec, Remotion, FFmpeg, renderer adapters.
- [ai-provider-strategy.md](./ai-provider-strategy.md): provider capability routing, adapters, API keys, candidates.
- [asset-storage-lifecycle-strategy.md](./asset-storage-lifecycle-strategy.md): asset library, storage, provider output persistence, retention.
- [multi-platform-adaptation-strategy.md](./multi-platform-adaptation-strategy.md): web-first with mini program/native app reserved.
- [team-permission-strategy.md](./team-permission-strategy.md): future workspace/team permissions.

## Operations, Quality, and Risk

- [admin-console-direction.md](./admin-console-direction.md): Agent-first admin/operator console.
- [security-abuse-strategy.md](./security-abuse-strategy.md): security baseline, abuse prevention, anti-bonus-farming.
- [content-compliance-rights-strategy.md](./content-compliance-rights-strategy.md): upload rights, portrait consent, moderation, takedown.
- [observability-slo-strategy.md](./observability-slo-strategy.md): metrics, logs, alerts, dashboards, SLOs.
- [testing-quality-strategy.md](./testing-quality-strategy.md): tests, template validation, provider contracts, frontend QA.
- [deployment-release-strategy.md](./deployment-release-strategy.md): environments, release flow, migrations, rollback, CI gates.

## Recommended First Build Path

1. Use [frontend-polish-spec.md](./frontend-polish-spec.md) for the next frontend-only polish pass.
2. Improve homepage, template gallery, creation workspace, task detail, asset library, and motion system.
3. Re-run desktop/mobile prototype review after the frontend feels premium enough.
4. Split the frontend prototype into stable type, data, domain, page, and component boundaries.
5. Use [backend-interface-prep.md](./backend-interface-prep.md) and [backend-api-contract.md](./backend-api-contract.md) as the gate before adding backend foundation.
6. Implement template schema, credit ledger, generation task lifecycle, mock provider, and asset storage.
7. Add real provider and payment integrations after the mock task-credit-asset loop is verified.
