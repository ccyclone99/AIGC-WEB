# Pricing, Plan, and Watermark Strategy

Status: Draft proposal

This document defines credit pricing, package/plan direction, watermark rules, export quality, and cost-margin management for AIGC Web.

## Goals

- Make credit consumption understandable to users.
- Protect provider/rendering/storage margins.
- Support free trials and campaigns without losing cost control.
- Keep watermark and HD rules clear.
- Support fixed and dynamic template pricing.
- Support future plans/subscriptions without forcing them into MVP.

## Core Pricing Principles

- Credits are the primary usage currency.
- Users must see estimated credits before generation.
- Template pricing can be fixed or dynamic.
- Provider cost should be tracked separately from user credit price.
- Free promotional usage should be limited and watermarked.
- Paid-credit final outputs can be eligible for no watermark.
- Expensive templates may support optional draft preview before final generation.
- Pricing rules must be versioned and stored with each task.

## Credit Sources

Credit source types:

- signup_bonus
- campaign_reward
- recharge_purchase
- admin_grant
- refund
- adjustment

Classification:

- Free credits: signup_bonus, campaign_reward, most admin_grant unless marked paid-equivalent.
- Paid credits: recharge_purchase.
- Compensating credits: refund, adjustment.

The credit source can influence:

- Watermark.
- Export quality.
- Eligible templates.
- Expiration.
- Abuse controls.

## Watermark Policy

Decision:

- Free outputs have watermarks.
- Signup bonus outputs have watermarks.
- Campaign reward outputs have watermarks unless campaign explicitly says otherwise.
- Preview/draft outputs can have watermarks even when paid.
- Paid-credit final outputs can be no-watermark by default, subject to final package rules.

Watermark metadata should be stored:

- watermarkApplied
- watermarkReason
- creditSource
- packageId if applicable
- exportPolicy

## Export Quality Policy

Suggested tiers:

### Draft

- Low-cost preview.
- Lower resolution.
- Watermarked.
- Used for evaluation only.

### Standard

- Normal output quality.
- Suitable for most templates.
- Watermark depends on credit source.

### HD

- Higher resolution or higher bitrate.
- Can cost additional credits.
- Requires provider/render capability.
- Can be no-watermark when paid.

Important:

- HD should not be promised for every provider/template.
- If provider native output is already fixed quality, HD may mean post-processing/upscaling only if technically useful.

## Template Pricing Types

### Fixed Pricing

Use when:

- Output duration/resolution is fixed.
- Provider cost is predictable.
- Template is simple.

Example:

- Product video basic: 20 credits.

### Dynamic Pricing

Use when:

- Duration changes cost.
- Quality changes cost.
- Preview/final differs.
- Provider/model differs.
- Output count differs.
- Priority queue is introduced.

Pricing dimensions:

- templateId
- duration
- aspectRatio
- outputQuality
- provider/model
- preview/final mode
- number of outputs
- watermark removal
- priority queue
- commercial package if introduced later

## Recharge Packages

MVP should support fixed recharge packages, even if real payment is delayed.

Package fields:

- packageId
- credits
- bonusCredits
- price
- currency
- displayName
- region
- enabled
- sortWeight
- promotionLabel
- paidEquivalent: true

Rules:

- Package bonus credits may be treated as paid-equivalent or free depending on business policy.
- If package bonus credits are paid-equivalent, they can remove watermark.
- If package bonus credits are promotional, they can retain watermark.

This needs a product decision later.

## Subscription Plans

Do not require subscription in MVP.

Reserve future support for:

- Monthly included credits.
- Monthly rollover rules.
- Higher storage retention.
- No-watermark exports.
- HD export quota.
- Team seats.
- Priority queue.
- Commercial templates.

Suggested future plan types:

- Free
- Starter
- Pro
- Team

MVP can remain credit-package based.

## Cost and Margin Model

Track cost per task:

- providerCostEstimated
- providerCostActual
- renderCostEstimated
- storageCostEstimated
- retryCost
- fallbackCost
- creditPriceEquivalent
- grossMarginEstimate

Why:

- Some templates may look popular but lose money.
- Preview mode may or may not improve margin.
- Provider fallback can increase cost.
- Retry policy affects margin.

Agent should flag:

- Low-margin templates.
- High-retry templates.
- Provider cost spikes.
- Templates priced below expected cost.
- Campaigns that generate high cost without paid conversion.

## Pricing Versioning

Every task should store:

- pricingId
- pricingVersion
- pricingBreakdown
- creditSource used
- finalCreditsFrozen
- finalCreditsSettled
- provider cost snapshot if available

Published pricing rules should not be mutated for historical tasks.

## Credit Expiration

MVP decision can be deferred.

If introduced:

- Free/campaign credits can expire sooner.
- Paid credits may have longer/no expiration depending on policy and law.
- Expiration should create ledger entries.
- Users should get notification before expiration.

## Refund Policy Linkage

Technical failure:

- Release/refund frozen credits.

Preview dissatisfaction:

- No automatic refund if preview technically succeeded.

Final output quality dissatisfaction:

- No automatic refund by default.

Manual goodwill:

- Adjustment ledger entry with reason and approval.

Cash refund:

- Separate payment/refund policy.

## Agent Role

Agents can:

- Recommend credit price for a template.
- Estimate provider/render/storage cost.
- Compare margin by provider/model.
- Recommend HD surcharge.
- Analyze campaign ROI.
- Recommend when preview mode should be enabled.
- Flag templates with poor margin.

High-risk actions require approval:

- Changing published pricing.
- Changing watermark policy.
- Launching large credit campaign.
- Changing paid/free credit classification.

## MVP Requirements

Required:

- Fixed and dynamic credit pricing model.
- Pricing preview before submit.
- Pricing version stored on task.
- Free output watermark.
- Paid-credit final no-watermark eligibility.
- Draft/preview pricing support in data model.
- Provider/render cost fields for analysis.
- Recharge package model.

Can be delayed:

- Subscription plans.
- Credit expiration.
- Priority queue.
- Advanced package entitlements.
- Automated margin-based pricing.

## Open Questions

- Signup bonus amount and abuse-control threshold.
- Initial recharge packages and prices.
- Whether recharge package bonus credits are paid-equivalent or promotional.
- Whether all paid-credit final outputs remove watermark automatically or only selected packages/templates.
- HD surcharge amount.
- Credit expiration policy.
- Target gross margin.

## Decision

Use credit-package pricing for MVP with fixed/dynamic template costs, mandatory watermark for free outputs, paid-credit no-watermark eligibility, and task-level pricing/cost traceability. Reserve subscriptions and advanced entitlements for later.
