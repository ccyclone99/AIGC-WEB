# Brand Kit and Ecommerce Workspace Strategy

Status: Draft proposal

This document defines the brand kit, ecommerce workspace, and reusable seller context direction for AIGC Web.

## Why This Matters

The primary users are ecommerce sellers and operators. They often reuse:

- Product images.
- Product names and selling points.
- Store logo.
- Brand colors.
- CTA wording.
- Platform-specific styles.
- Contact or shop information.
- Target audience.

If the platform stores this context, users can create new videos faster and outputs can stay more consistent.

## Product Direction

Start with a lightweight personal ecommerce workspace and brand kit, but do not make it a heavy frontend feature in MVP.

Frontend principle:

- Brand/workspace controls should behave like optional advanced options.
- The main creation flow should remain simple: choose template, upload image, enter short description, generate.
- Do not build a complex brand kit editor in the first version.
- Do not force users into workspace setup before generating.

Later expansion:

- Team workspaces.
- Shared brand kits.
- Multiple stores/brands per account.
- Product catalog import.
- Platform integrations.

## Core Concepts

### Workspace

A workspace groups a user's ecommerce creation context.

Initial version:

- One personal workspace per user by default.

Future:

- Multiple workspaces per user.
- Team/shared workspace.
- Role permissions.

### Brand Kit

A brand kit stores reusable brand assets and style preferences.

Fields:

- Brand/store name.
- Logo assets.
- Brand colors.
- Preferred fonts or font style.
- Default CTA phrases.
- Default tone/style.
- Default target platforms.
- Contact/shop URL.
- Watermark preference if allowed.

### Product Profile

A product profile stores reusable product context.

Fields:

- Product name.
- Product category.
- Main product images.
- Detail images.
- Selling points.
- Target audience.
- Price range or offer text.
- Common objections/benefits.
- Preferred output style.

### Platform Preset

Defines target platform output preferences.

Examples:

- Douyin/TikTok.
- Xiaohongshu.
- Taobao/Tmall.
- Amazon.
- Shopify.
- Instagram Reels.

Fields:

- Aspect ratio.
- Duration range.
- Caption style.
- CTA style.
- Safe zones.
- Visual pacing.
- Text density.

## User Experience

### First Use

User should not be forced to configure a full brand kit before generating.

Recommended:

- Let user generate immediately with template inputs.
- After success, suggest saving assets/product info to workspace.
- Offer lightweight brand setup later.

### Returning User

User should be able to:

- Select saved product.
- Select brand kit.
- Select target platform.
- Generate faster with fewer inputs.

### Creation Workspace Integration

Creation form can prefill:

- Product images from asset library/product profile.
- Brand logo.
- Selling points.
- CTA.
- Preferred style.
- Target platform.

Templates can use brand kit fields internally:

- Add logo overlay.
- Match brand colors.
- Use preferred CTA.
- Keep tone consistent.
- Generate platform-specific format.

Frontend presentation:

- Show basic required template inputs first.
- Put brand kit/product profile/platform preset under an expandable "Advanced options" or "Use saved assets/brand settings" section.
- Keep defaults collapsed unless user has existing saved assets or chooses to reuse them.
- Avoid multi-step setup wizards in MVP.
- Provide quick actions such as "Use from asset library" and "Save this product for next time".

## Data Model Direction

Suggested entities:

- Workspace.
- BrandKit.
- ProductProfile.
- ProductProfileAsset.
- PlatformPreset.

### Workspace

Key fields:

- id
- ownerUserId
- name
- type: personal | team
- createdAt
- updatedAt

### BrandKit

Key fields:

- id
- workspaceId
- name
- logoAssetIds
- colors
- fontPreference
- tonePreference
- defaultCtas
- defaultPlatforms
- shopUrl
- metadata
- createdAt
- updatedAt

### ProductProfile

Key fields:

- id
- workspaceId
- name
- category
- mainAssetIds
- detailAssetIds
- sellingPoints
- targetAudience
- offerText
- stylePreference
- metadata
- createdAt
- updatedAt

### PlatformPreset

Key fields:

- id
- key
- name
- region
- aspectRatios
- durations
- safeZones
- captionStyle
- ctaStyle
- textDensity
- metadata

## Template Integration

Template inputs can reference:

- `brandKit.logo`
- `brandKit.colors`
- `brandKit.defaultCtas`
- `productProfile.mainImages`
- `productProfile.sellingPoints`
- `platformPreset.aspectRatio`
- `platformPreset.duration`

Rules:

- Brand/workspace context should prefill inputs, not hide important user decisions.
- Users should be able to override prefilled values.
- Task records should store the resolved brand/product/platform values used at submission.

## Agent Role

Agents can:

- Generate brand kit suggestions from uploaded assets.
- Extract product selling points from user descriptions.
- Suggest platform presets.
- Convert a successful generation into reusable product profile data.
- Detect missing brand information and ask lightweight questions.
- Generate template variants that use brand kit fields.

High-risk actions:

- Publicly publishing brand assets.
- Sharing workspace with other users.
- Bulk importing products.

These require explicit user action or approval.

## MVP Scope

Required:

- User asset library can save product images and generated videos.
- Lightweight personal workspace concept.
- Optional brand kit fields: brand/store name, logo, colors, CTA.
- Optional product profile: product name, images, selling points.
- Creation workspace can reuse saved assets.
- Frontend exposes brand/workspace fields as advanced optional controls, not as a primary flow.

Can be delayed:

- Team workspaces.
- Product catalog import.
- Marketplace integrations.
- Full brand kit editor.
- Dedicated brand kit management page.
- Advanced platform presets.
- AI extraction from product pages.
- Shared permissions.

## Open Questions

- Should every user automatically get a default workspace?
- Should brand kit setup be prompted after first successful generation?
- Should product profiles be manually created or auto-suggested from completed tasks?
- Which ecommerce platforms should have presets first?
- Whether team workspaces are needed for the first paid users.

## Decision

Reserve a personal ecommerce workspace and lightweight brand kit from the beginning. In MVP, expose it as optional advanced controls and asset reuse, not as a complex frontend management feature. Do not force setup before first generation.
