# Frontend Prototype Review

Status: Implemented lightweight page plus overlay prototype
Last updated: 2026-06-25

The frontend prototype pack is implemented in `src/App.tsx` and `src/App.css`.

Primary design proposal:

- [mainstream-design-research-and-ui-proposal.md](./mainstream-design-research-and-ui-proposal.md)

Next polish pass SPEC:

- [frontend-polish-spec.md](./frontend-polish-spec.md)

## Prototype Entry

Local URL:

- `http://127.0.0.1:5173/`

## Included Directions

## Full Flow Prototype

The previous prototype included a fuller product shell with these modules:

- `工作台`: overview of the main ecommerce video generation flow.
- `模板广场`: searchable/filterable template gallery with ecommerce-first categories.
- `创作`: generation workspace with uploads, simple inputs, platform preset, style selection, advanced options, credit pre-freeze, and traceability cues.
- `任务`: task center with running, success, and refunded states plus a traceability panel.
- `资产库`: reusable uploads, generated outputs, posters, and consent-sensitive assets.
- `积分`: balance, recharge package cards, and credit ledger rows.
- `视觉方案`: separate visual interaction lab for motion/card direction review.

Implemented user path:

1. Open homepage.
2. Register or browse templates from the public entry.
3. Enter workbench as the logged-in production center.
4. Select a template.
5. Enter the creation workspace.
6. Review upload fields, generation options, credit pre-freeze, and traceability notes.

This is still a frontend prototype. It uses local React state and mock data, not backend APIs.

## Overlay Direction

The current revision uses a lighter page plus overlay model:

- Template cards open a detail Modal with blurred background.
- Template detail routes into the workbench `制作视频` state.
- The previous large making overlay is no longer part of the primary production surface.
- Task traceability moves into a Task Detail Drawer.
- Filters use a compact Sheet.
- Credit/recharge details use a Modal.
- Media previews use a Lightbox.

See `docs/frontend-overlay-interaction-spec.md`.

## Complete Demo Interactions

The current prototype supports a fuller frontend demonstration:

- `工作台` is now the default logged-in landing page and product command center.
- `首页` is now a separate public homepage for product positioning, primary use cases, registration bonus entry, template browsing, and workbench entry.
- `工作台` now owns both the logged-in overview and the `制作视频` state after a user selects a template.
- Workbench quick actions can enter ecommerce video, seed-content, and portrait/fashion template flows.
- Workbench shows credit balance, frozen-credit context, running/completed/refunded task counts, recent task progress, recommended templates, recent assets, and traceability/risk reminders.
- Account Modal simulates login, QR login, third-party login, registration, and signup bonus credit delivery.
- Credit Modal now supports selectable recharge packages and payment settlement that updates balance and structured ledger rows with status, references, and notes.
- Template search filters the template grid.
- Filter Sheet supports selectable filter chips and apply feedback.
- Template cards use staggered entrance animation.
- Template gallery now includes several video-input template examples for future video polishing, talking-head slicing, and product-card packaging workflows.
- Template detail exposes the MVP template contract: workflow type, template version, pricing version, settlement mode, input fields, and required capabilities.
- Modal, Studio Overlay, Drawer, Sheet, Lightbox, and Toast have distinct entrance motion.
- The making state removes the permanent right-side context inspector and table layout. The first completed template now defaults to current template summary, one selected image, and bottom generation command bar.
- Product creation supports one-image generation first. `高级设置` now only contains output parameters such as ratio, video length, image resolution, and clarity. Template/image switching stays separate, and optional text inputs appear only when a template requires them.
- Output parameter selection updates in place and is written into the submitted task trace.
- Clicking `生成视频` creates a new queued task, freezes credits, writes a ledger row, keeps the user in `工作台 / 制作视频`, and shows a Toast plus a compact background task strip.
- Re-clicking with the same image, template, and output parameters is blocked with a `后台生成中` state. Changing an output parameter creates a valid variant path.
- Task Center shows lifecycle stages and summary counts.
- Task rows open a detail Drawer with structured traceability, lifecycle state, submitted parameters, provider/render attempt records, credit state, failure/refund state, preview, and download actions.
- Completed simulated tasks add a generated video asset into the asset library.
- `我的` is split into `资产`, `积分`, and `账号` tabs so asset management, recharge ledger, and login/register do not compete in one long surface.
- Asset thumbnails in `我的 / 资产` open the media Lightbox and show retention/expiry context.
- The asset-library prototype supports user management actions: upload, preview, download, rename, reuse in a new generation, delete/archive, restore, and filtering by asset type or expiry state.

These are frontend-only demo states. Backend integration later needs to replace local state with API-backed templates, drafts, assets, tasks, credit ledger, and notifications.

Current user-facing navigation is:

- `首页`
- `工作台`
- `模板`
- `任务`
- `我的`

The previous standalone `创作`, `资产库`, and `积分` sections are accessed through context:

- `首页` is the public website entry.
- `工作台` is the logged-in command center.
- Recommended template opens from `模板`.
- Creation opens from template detail into `工作台 / 制作视频`.
- Assets are managed under `我的 / 资产`.
- Credits open from the balance button or `我的 / 积分`.

## Visual Directions

### 1. Studio Flip

Chinese UI label: `影棚翻卡`

Purpose:

- Make templates feel like premium product display cards.
- Use card flipping for template details, cost, tags, and selection.

Best for:

- High visual impact homepage/template gallery.
- Users who browse visually before choosing.

Watchouts:

- Do not overuse 3D flipping in dense lists.
- Needs tap-friendly behavior on mobile.

### 2. Fast Preview

Chinese UI label: `快剪预览`

Purpose:

- Make template cards feel video-native through preview frames and play affordances.
- Prioritize quick understanding of video rhythm.

Best for:

- Ecommerce short-video templates.
- Users comparing multiple styles quickly.

Watchouts:

- Real video previews may increase bandwidth.
- Need fallback poster images and lazy loading.

### 3. Bento Board

Chinese UI label: `经营看板`

Purpose:

- Present templates, platform ratios, task steps, and business context in a dense ecommerce-friendly layout.

Best for:

- Seller/operator users who want fast scanning.
- Future dashboard-like template discovery.

Watchouts:

- Must avoid becoming too operational or admin-like for first-time users.

### 4. Before/After Reveal

Chinese UI label: `前后对照`

Purpose:

- Emphasize transformation from input image to AI output.
- Useful for portrait/fashion, product retouching, and high-contrast visual categories.

Best for:

- Trust-building moments before users upload.
- Template detail pages.

Watchouts:

- Requires strong before/after assets.
- Should not imply guaranteed output quality.

### 5. Making Flow

Chinese UI label: `制作视频`

Purpose:

- Test the first real creation surface: upload/select one image, optional settings, credit pre-freeze, and traceability cues.

Best for:

- Product-grade MVP creation flow.
- Connecting template config to generated forms later.

Watchouts:

- Advanced options should stay secondary.
- Credit state and failure/refund state need clearer production copy later.

## Review Criteria

When reviewing, choose based on:

- First impression quality.
- Whether ecommerce users immediately understand value.
- Whether card motion feels useful rather than decorative.
- Whether credit cost and generation action are clear.
- Whether mobile layout remains usable.
- Which direction should become the main product surface.
- Which directions should remain as secondary interactions.

For the full product flow, review:

- Whether the module navigation matches the expected product structure.
- Whether ecommerce users understand the main action without reading explanations.
- Whether template cards expose the right decision information.
- Whether the creation workspace feels simple enough for non-technical users.
- Whether credit pre-freeze/refund language is visible but not intimidating.
- Whether task traceability is useful without feeling too technical.
- Whether asset library and credit center feel necessary in MVP or should be lighter.

## Page Layout Attributes

Each main page should use a layout that matches its role:

- `首页`: public product homepage. Use stronger brand visuals, product positioning, primary use cases, and conversion actions. Do not show operational queues as the main content.
- `工作台`: logged-in production surface. Use compact operational layout for quick start, making videos, task state, credit state, recent assets, and risk reminders. Do not make it feel like a marketing landing page.
- `模板`: discovery and selection surface. Prioritize search, filters, template cards, decision metadata, and visual comparison.
- `任务`: status tracking surface. Prioritize lifecycle stages, current status, progress, traceability, and failure/refund actions.
- `我的`: account and asset management surface. Use `资产`, `积分`, and `账号` tabs; prioritize credit clarity, login/register surfaces, asset retention, reusable materials, and generated outputs without stacking them into one long page.

## Initial Recommendation

Use a combined direction:

- Template gallery: `影棚翻卡` + selected parts of `快剪预览`.
- Template discovery/category page: selected parts of `经营看板`.
- Portrait/fashion detail pages: `前后对照`.
- Actual generation state: `工作台 / 制作视频`.

This avoids forcing one motion style onto every page.

For the complete app structure:

- Keep `首页`, `工作台`, `模板`, `任务`, and `我的` as the main user navigation for MVP prototype review.
- Keep `首页` as the public product homepage.
- Use `工作台` as the logged-in production center, not the public homepage.
- Keep modal/drawer/sheet surfaces for preview, credit, task detail, auth, and filters; use the workbench `制作视频` state for production editing.
- Keep visual experiments as internal review routes only, not primary user navigation.
- Do not expose admin/Agent operations to normal users in the main navigation.

## 2026-06-26 Backend-State Review

Added frontend-visible states that backend integration will need:

- Payment order lifecycle: idle, pending, paid, failed, cancelled, expired.
- QR login lifecycle: waiting, scanned, confirmed, expired, rejected.
- Signup reward lifecycle: eligible, granted, claimed, risk-blocked.
- Signup anti-abuse checks: device, IP, and phone risk rows.
- Upload receipt lifecycle: idle, validating, uploading, saved, failed.
- Upload receipt recovery: cancelled and rejected states, with cancel and retry/reselect actions.
- Task failure detail: stage, reason, code, retryability, and user-facing message.
- Generation idempotency key: generated from template version, input asset, and output settings, then exposed in task detail.
- Payment recovery: pending payment orders can be cancelled.
- Component boundary: auth, credit/payment, asset picker, upload receipt, and task detail panels extracted from the app shell.

Browser verification:

- Desktop asset library shows upload receipt.
- Desktop credit center creates a pending payment order, then paid order increases balance and writes a recharge ledger row.
- Desktop account tab shows reward state and three risk checks.
- Desktop refunded task drawer shows a structured failure panel.
- Visible task failure examples cover provider error, moderation block, and invalid input asset.
- Mobile 390px checks for asset, credit, and account tabs show no horizontal overflow.
