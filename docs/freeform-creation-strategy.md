# Freeform Creation and Model Studio Strategy

Status: Draft proposal

This document defines how AIGC Web can support users who want to create content directly with model capabilities instead of using packaged templates.

## Context

The main product direction is template-driven creation: users should not need to write prompts or understand model parameters. However, some advanced users may want more control and may prefer to use models directly.

This should be supported as a separate advanced mode, not as the default user experience.

## Product Positioning

Recommended name direction:

- Model Studio
- Freeform Studio
- Advanced Creation
- Pro Mode

Positioning:

- For advanced users, creators, operators, and internal template builders.
- Not the primary path for ordinary ecommerce users.
- Does not replace templates.
- Can become a source of future template ideas.

## Principles

- Template-driven creation remains the default.
- Freeform mode should be clearly labeled as advanced.
- Users should understand that freeform prompts/parameters can produce less predictable results.
- Credit cost must be visible before submission.
- Prompt and parameter records must be stored for traceability.
- Content moderation and provider policies still apply.
- Freeform outputs follow the same asset, watermark, download, support, and audit rules.

## MVP Recommendation

Do not make freeform mode part of the first user-facing MVP unless there is a strong business reason.

Instead:

- Reserve backend and data-model support.
- Allow internal/admin use first for template experimentation.
- Later expose to selected advanced users or paid users.

## User Types

### Ordinary User

Expected path:

- Uses templates.
- Uploads images.
- Enters simple descriptions.
- Does not see raw prompts or advanced model settings.

### Advanced User

Possible path:

- Selects model/capability.
- Writes prompt.
- Uploads optional reference assets.
- Adjusts a small number of safe parameters.
- Generates preview/final output.

### Internal Operator / Agent

Possible path:

- Experiments with prompts and model settings.
- Saves successful workflows as templates.
- Compares providers/models.
- Generates examples and fixtures.

## Capability Scope

Possible freeform capabilities:

- Text to image.
- Image to image.
- Text to video.
- Image to video.
- Video editing.
- Background replacement.
- Product photo enhancement.
- Portrait transformation.
- Prompt-to-composition workflow.

MVP reserved capability:

- Use the same provider adapter and generation task system.
- Do not bypass credit ledger, moderation, asset storage, or audit.

## UX Direction

Keep separate from template gallery.

Possible entry:

- Hidden/internal route first.
- "Advanced" tab later.
- Paid/pro user feature later.

UI should include:

- Model/capability selector.
- Prompt input.
- Asset upload/reference selector.
- Output settings.
- Credit cost estimate.
- Safety reminders.
- Submit button.
- Task result/history.

Avoid:

- Putting raw prompt box on the homepage.
- Making freeform mode visually equal to templates for first-time users.
- Exposing too many provider-specific parameters directly.

## Pricing and Credits

Rules:

- Freeform generation consumes credits.
- Cost can be dynamic based on provider/model, output type, duration, resolution, and retry policy.
- Preview/final rules can apply if provider supports draft preview.
- Free/signup/campaign outputs are watermarked.
- Paid final outputs can be no-watermark according to business policy.

Because freeform usage can be expensive and unpredictable:

- Require visible credit estimate.
- Consider higher minimum cost.
- Consider requiring paid credits for expensive models.
- Rate-limit freeform usage more strictly than templates.

## Safety and Abuse Controls

Freeform mode has higher abuse risk than templates.

Required:

- Stronger prompt moderation.
- Asset moderation.
- Provider policy enforcement.
- Rate limits.
- Abuse monitoring.
- Logging of prompt, parameters, provider, and output.

High-risk capabilities, such as face/identity transformation, celebrity likeness, or sensitive content, may require:

- Additional consent confirmation.
- Restriction to selected templates only.
- Manual/internal access first.

## Data and Audit Requirements

GenerationTask should store:

- creationMode: template | freeform
- outputMode: preview | final
- capability
- provider/model
- submitted prompt
- negative prompt if used
- parameters
- uploaded/reference assets
- pricing breakdown
- provider attempts
- output assets
- moderation records

Prompt storage:

- Store exact prompt for audit and support.
- Do not expose prompts in public share pages.
- Redact from product analytics.

## Relationship To Templates

Freeform mode can feed template creation.

Useful flows:

- Internal operator experiments in freeform mode.
- Agent observes successful prompt/workflow.
- Agent converts it into a reusable template config.
- Template goes through validation, preview, approval, and publish.

This supports the Agent-driven template model without forcing every user into prompt writing.

## Agent Role

Agents can:

- Help advanced users improve prompts.
- Convert freeform task into template draft.
- Compare provider outputs.
- Suggest safer parameters.
- Explain credit cost.
- Detect abusive prompt patterns.

Agents should not:

- Bypass moderation.
- Expose provider secrets.
- Auto-publish freeform workflows as templates without review.

## MVP Scope

Required:

- Data model and task system should not prevent freeform mode.
- Provider adapter and pricing system should support capability-based requests outside templates.
- Internal/admin freeform experimentation can be considered.

Can be delayed:

- Public freeform user UI.
- Advanced parameter editor.
- Saved prompt library.
- Public model playground.
- Freeform community sharing.

## Open Questions

- Should freeform mode be internal-only at first?
- Should freeform mode require paid credits?
- Which capabilities should be available in freeform mode?
- Should users be able to save freeform workflows as private templates?
- How much prompt assistance should Agent provide?

## Decision

Reserve freeform creation as an advanced mode, but keep template-driven creation as the main product. Freeform mode should reuse the same provider adapters, credit ledger, task lifecycle, asset storage, moderation, and audit systems.
