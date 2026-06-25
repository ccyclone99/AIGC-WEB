# Detail Review Checklist

Status: Current review
Last updated: 2026-06-25

This document records the detail pass across the planning docs before implementation starts.

## Review Scope

Checked:

- SPEC consistency.
- MVP boundary.
- Agent terminology.
- Credit/task settlement model.
- Data-model field naming.
- Traceability requirements.
- Provider/API key strategy.
- Frontend prototype readiness.
- Open decision alignment.
- Markdown link integrity.

## Findings Fixed

### Agent Meaning Was Ambiguous

Issue:

- "Agent-first" could mean development Agent, internal operations Agent, or a user-facing product Agent.

Fix:

- Added explicit Agent types in `SPEC.md`, `requirements-notes.md`, and `agent-operating-model.md`.
- Confirmed MVP needs Agent-driven development and Agent-ready operations, but not a public user-facing Agent.

### GenerationTask Mode Was Overloaded

Issue:

- The task model previously risked using one `mode` concept for both creation type and output type.

Fix:

- Split into `creationMode: template | freeform` and `outputMode: preview | final`.

### Open Decisions Were Not Fully Aligned

Issue:

- `SPEC.md`, `requirements-notes.md`, and `spec-readiness-review.md` had slightly different open decision lists.

Fix:

- Aligned the production-blocking open decisions across all three docs.

### MVP Diagnosis Wording Was Too Vague

Issue:

- MVP backlog used "diagnosis summary placeholder", which could imply an unfinished or fake feature.

Fix:

- Reworded MVP diagnosis as deterministic summaries generated from structured records.

### Early Readiness Note Became Stale

Issue:

- One discussion-log entry still described earlier gaps that have since been covered in draft docs.

Fix:

- Updated it to the current status: ready for prototypes/mock loop, not yet production-launch ready.

## Current Consistency Decisions

- MVP starts web-first.
- Ecommerce product video is the primary use case.
- Portrait/fashion transformation is the second core use case.
- Templates are platform-authored and Agent-edited, not user-authored in MVP.
- Users should not need to write prompts.
- Credits freeze at submission, settle on success, release on failure/timeout/block.
- AI quality dissatisfaction is not automatic failure.
- Every task must be traceable to exact inputs, template version, pricing version, provider attempts, render attempts, assets, logs, and credit ledger entries.
- Provider secrets are managed through secret references and must not appear in frontend, template config, task records, or logs.
- Provider temporary URLs must be persisted into platform storage before expiry.
- Public freeform studio, team UI, native apps, mini program, subscriptions, public sharing, and full internationalization stay out of MVP.

## Production-Blocking Decisions Still Open

- First launch region and primary UI language.
- First production login method.
- Whether production MVP uses real payment or admin/test credit grants.
- First payment provider if real payment is enabled.
- Signup bonus amount and abuse-control threshold.
- Initial recharge packages and prices.
- Whether recharge package bonus credits are paid-equivalent or promotional.
- Whether all paid-credit final outputs remove watermark automatically or only selected packages/templates.
- First real video provider for ecommerce product video.
- First real video provider for portrait/fashion transformation, if different.
- Initial object storage provider and CDN direction.
- Exact media retention durations.
- Final frontend visual/motion direction after prototype review.
- Whether public freeform mode stays internal-only after MVP or becomes a paid/pro feature.

## Implementation-Blocking Decisions

These should be settled before coding their respective phase:

- Frontend prototypes: no production business decision is required.
- Web app skeleton: selected visual direction is useful but not mandatory for initial mock screens.
- Backend foundation: stack is already selected.
- Credit ledger: signup bonus amount can remain configurable while implementation starts.
- Real provider integration: first provider selection is required.
- Real payment integration: launch region and payment provider are required.
- Storage implementation: object storage provider and retention policy are required.

## Review Result

The docs are detailed enough to start frontend prototypes and mock-flow implementation. They are not yet final enough for production launch, mainly because payment, provider, storage, retention, abuse thresholds, and final frontend direction require business choices.
