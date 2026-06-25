# Product Analytics and Growth Strategy

Status: Draft proposal

This document defines product analytics, funnel tracking, growth metrics, and template ROI measurement for AIGC Web.

## Goals

- Understand where users convert or drop off.
- Measure which templates drive generation, recharge, and retention.
- Measure credit consumption and revenue conversion.
- Evaluate draft preview usefulness.
- Evaluate campaigns and signup bonus ROI.
- Help Agent recommend UX, pricing, template, and provider changes.

## Principles

- Separate product analytics from operational logs.
- Do not store raw prompts, sensitive uploads, API keys, or private media URLs in analytics events.
- Use stable anonymous/session IDs before login and user IDs after login.
- Connect anonymous pre-login actions to the user after login when privacy policy allows.
- Track enough to optimize funnels without over-collecting sensitive data.
- Analytics events should include template/category/provider identifiers where safe and useful.

## Core Funnels

### Template Discovery Funnel

1. Home viewed.
2. Template gallery viewed.
3. Template card interacted.
4. Template detail viewed.
5. Creation started.

Questions:

- Which cards attract clicks?
- Which categories convert?
- Which motion/visual prototype performs better?

### Creation Funnel

1. Creation started.
2. Asset uploaded or selected from library.
3. Required inputs completed.
4. Pricing preview shown.
5. Login prompt shown if needed.
6. Login completed.
7. Generation submitted.
8. Generation succeeded.
9. Result previewed.
10. Result downloaded or saved.

Questions:

- Where do users abandon?
- Does login interrupt conversion?
- Does asset library reuse improve conversion?

### Credit and Payment Funnel

1. Credit balance viewed.
2. Recharge page viewed.
3. Package selected.
4. Payment started.
5. Payment completed.
6. Credits granted.
7. Paid generation submitted.

Questions:

- Which packages convert?
- Are users recharging before or after hitting insufficient credits?
- Do paid users generate again?

### Draft Preview Funnel

1. Preview option shown.
2. Preview selected.
3. Preview succeeded.
4. User approved preview.
5. Final generation submitted.
6. Final generation succeeded.

Questions:

- Does preview improve conversion to paid final?
- Does preview reduce support/refund complaints?
- Does preview create unnecessary friction?

### Campaign Funnel

1. Campaign viewed.
2. Reward eligibility met.
3. Reward claimed/granted.
4. User uses reward.
5. User recharges or returns.

Questions:

- Which campaigns create useful generation behavior?
- Which campaigns are abused?
- Which rewards lead to paid conversion?

## Event Taxonomy

Recommended event names:

- `home_viewed`
- `template_gallery_viewed`
- `template_card_viewed`
- `template_card_clicked`
- `template_detail_viewed`
- `creation_started`
- `asset_uploaded`
- `asset_selected_from_library`
- `required_inputs_completed`
- `pricing_preview_viewed`
- `login_prompt_shown`
- `login_completed`
- `generation_submitted`
- `generation_succeeded`
- `generation_failed`
- `generation_timed_out`
- `generation_blocked`
- `result_previewed`
- `result_downloaded`
- `result_saved_to_library`
- `preview_option_shown`
- `preview_generation_submitted`
- `preview_generation_succeeded`
- `preview_approved_for_final`
- `recharge_page_viewed`
- `credit_package_selected`
- `payment_started`
- `payment_succeeded`
- `credits_granted`
- `campaign_viewed`
- `campaign_reward_granted`
- `campaign_reward_used`

## Event Properties

Safe useful properties:

- anonymousId
- userId if logged in
- sessionId
- templateId
- templateVersionId
- category
- scenario
- creditCost
- creditSource
- taskId
- outputMode: preview | final
- outputQuality: draft | standard | hd
- watermarkApplied
- targetPlatform
- aspectRatio
- duration
- providerId if not sensitive
- renderer
- campaignId
- packageId
- funnelSource

Avoid in analytics:

- Raw prompt.
- Full user text input.
- Private media URLs.
- API keys.
- Payment card data.
- Provider raw payload.
- Sensitive personal data.

## KPIs

### Product KPIs

- Visitor to creation-start rate.
- Creation-start to generation-submit rate.
- Generation-submit to success rate.
- Result download rate.
- Save-to-library rate.
- Repeat generation rate.
- Template reuse rate.

### Business KPIs

- Free user to paid user conversion.
- Recharge conversion rate.
- Average revenue per paying user.
- Credit consumption per user.
- Paid generation ratio.
- Campaign ROI.
- Template ROI.

### Template KPIs

- Template views.
- Creation starts.
- Generation submits.
- Success rate.
- Download/save rate.
- Recharge influence.
- Average cost.
- Gross margin estimate.
- Complaint/failure rate.

### Preview KPIs

- Preview opt-in rate.
- Preview success rate.
- Preview to final conversion.
- Preview cost per final conversion.
- Preview abandonment rate.

## Attribution Direction

Track:

- Traffic source.
- Campaign source.
- Template source.
- Referral/invite source.
- First template used.
- First paid template.

Use this to answer:

- Which acquisition channel brings paying users?
- Which template converts users to recharge?
- Which campaign attracts low-quality bonus farmers?

## Agent Role

Agents can:

- Summarize funnel performance.
- Identify low-converting templates.
- Recommend template card/UX changes.
- Recommend pricing adjustments.
- Compare preview versus no-preview flows.
- Detect campaign abuse or poor ROI.
- Suggest which templates deserve promotion.

Agent should not:

- Use sensitive raw user content for analytics summaries unless explicitly allowed and redacted.

## MVP Analytics Scope

Required:

- Core discovery funnel.
- Core creation funnel.
- Generation submit/success/failure events.
- Credit/recharge funnel if payment is enabled.
- Campaign reward events.
- Download/save-to-library events.
- Basic template performance dashboard.

Can be delayed:

- Advanced attribution.
- Cohort retention dashboard.
- A/B testing platform.
- Real-time personalization.
- Full revenue attribution model.

## Open Questions

- Analytics provider or self-hosted event store.
- Event retention duration.
- Privacy policy wording for analytics.
- Whether anonymous pre-login events merge after login.
- Whether A/B testing is needed for motion prototypes.

## Decision

Instrument product funnels from the beginning. The platform needs analytics to decide which templates, pricing rules, preview modes, campaigns, and frontend designs actually work.
