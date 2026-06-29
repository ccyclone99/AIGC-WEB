# Mainstream Design Research and UI Proposal

Status: Draft decision
Last updated: 2026-06-25

This document records external design research for mainstream AI video, ecommerce video, and template-based creation products, then translates the findings into a complete UI direction for AIGC Web.

## 1. Research Scope

Research date: 2026-06-25

Comparable product categories:

- Ecommerce AI video generators.
- General AI video/image generation studios.
- Template-based video creation tools.
- AI design suites with template and editor workflows.

Primary references:

- Topview AI: ecommerce/product video agent and product image/link to ad workflows.
- CapCut AI Video Generator and product video generator: easy upload/generate/edit/export flow.
- Pippit AI: ecommerce/social content creative agent with media/link/prompt inputs.
- HeyGen Templates: template library for fast video creation without editing experience.
- Runway: high-end AI video/image creative toolkit.
- Kling AI: creative studio and image/text-to-video positioning.
- Dreamina: all-in-one AI image/video creative platform.
- Canva AI / Magic Design / AI Video Generator: AI creation inside a familiar template/editor ecosystem.

Source links are listed at the end of this document.

## 2. Research Findings

### Topview AI

Observed positioning:

- Strong ecommerce and ad orientation.
- Product image/link/reference-video entry points.
- "Video Agent" framing, but the commercial promise is simple: turn a product into ads quickly.
- Batch and variation generation are framed as power features.

Design takeaways:

- Good fit for our business direction: ecommerce first, finished ad output, minimal editing.
- Product upload/link is easier to understand than a blank prompt box.
- Batch generation should exist, but should not dominate the first creation screen.

Do not copy:

- Too many tool categories visible at once can make the product feel like a generic AI toolbox.
- Agent prompt examples can become noisy if the primary workflow is template-driven.

### CapCut

Observed positioning:

- Clear "upload image / generate / edit more / export" rhythm.
- It combines simple generation with a familiar downstream editor.
- Uses practical language around templates, one-click generation, assets, export, and editing.

Design takeaways:

- A simple first action is critical.
- The user should be able to generate first, then optionally edit.
- "Edit more" can be a secondary action after output exists, not a requirement before generation.

Do not copy:

- A full editor too early would conflict with our template-first direction.

### Pippit AI

Observed positioning:

- Creative agent for videos, images, ads, and avatars.
- Supports link, media, file, and prompt references.
- Emphasizes social/ecommerce content efficiency and lightweight customization.

Design takeaways:

- Good reference for future multi-input templates.
- Our first MVP can stay image-only, while the system reserves link/media/prompt options per template.
- Agent language can be used as reassurance, but not as the main input surface for nontechnical users.

Do not copy:

- The all-in-one breadth can obscure the primary ecommerce use case.

### HeyGen

Observed positioning:

- Large template library.
- "No editing experience" promise.
- Templates package scenes, layouts, avatars, voice, pacing, and export.

Design takeaways:

- Templates should feel like packaged products, not merely examples.
- Each template card needs to communicate result, required input, duration/ratio, and credit cost.
- Trust metrics and completed-generation counters can help, but should not look inflated or fake.

Do not copy:

- Avatar-first mental model is not our MVP center.

### Runway

Observed positioning:

- High-end creative toolkit with many image/video/audio/editing/language models.
- Strong emphasis on model quality, creative control, and professional workflows.
- Research/product pages use large visual media and sparse premium UI.

Design takeaways:

- Premium visual treatment matters for AI video trust.
- Large media, restrained typography, and cinematic previews are more effective than dense feature lists.
- Advanced model choice should be hidden or abstracted behind templates in our product.

Do not copy:

- Exposing too many model names and tools would overwhelm ecommerce users.

### Kling AI and Dreamina

Observed positioning:

- AI creative studios for image and video generation.
- Strong "create now" entry and image/text-to-video framing.
- Model quality and multimodal generation are front-stage.

Design takeaways:

- Image-to-video is now a mainstream mental model.
- Our MVP image-only template is aligned with current market behavior.
- Model names can be reserved for advanced settings or internal routing, not the default user decision.

Do not copy:

- Model-centric hierarchy is weaker than template-centric hierarchy for our target users.

### Canva

Observed positioning:

- AI tools live inside a broader template/editor ecosystem.
- Magic Design and AI video tools emphasize generated, editable outputs.
- The experience feels familiar because it starts from templates, media, and formats.

Design takeaways:

- "AI generates, user can still edit" is an important reassurance.
- Templates and editable outputs create trust because users are not locked into one opaque result.
- For us, output preview and regenerate/create-again are more important than a complex editor in MVP.

Do not copy:

- Canva's broad design-suite model is too wide for the first version.

## 3. Cross-Product Patterns

The mainstream products converge on these patterns:

1. The first screen must show the result type, not the technology.
2. The primary input should be obvious: image, link, or text depending on the workflow.
3. Templates lower the user's cognitive load.
4. Advanced settings are available but not front-stage.
5. Large visual previews create more trust than explanatory text.
6. Ecommerce users care about speed, platform ratio, variations, and output reuse.
7. A generation task needs transparent state: queued, generating, rendering, complete, failed/refunded.
8. Output should lead to next actions: preview, download, save, create another, or change template.
9. Mobile should be linear and focused; desktop can show more context but should not become a dense admin console.
10. Batch creation is useful for ecommerce, but should live behind "more settings" or a dedicated advanced path.

## 4. Product Design Positioning

Recommended product feel:

`Template Commerce Studio`

This means:

- More focused than a generic AI model playground.
- More beautiful than a backend operations tool.
- Simpler than a professional video editor.
- More traceable and credit-aware than consumer AI novelty tools.

Primary user promise:

`选模板，上传图片，生成可用的电商视频。`

Secondary promise:

`模板背后已经封装好模型、剪辑、字幕、比例、积分和兜底。`

## 5. Information Architecture

Main navigation should remain:

- `首页`
- `生产台`
- `模板`
- `任务`
- `我的`

Do not add a top-level `创作台` in MVP. It overlaps with `生产台` and adds cognitive load. `创作台` should remain the creation surface entered from a template or production-desk action.

### 首页

Role:

- Public-facing product entry.
- Must sell the core value quickly.
- Should not look like an operations dashboard.

First viewport:

- Strong product name/value headline.
- Realistic ecommerce/product-video visual.
- Primary CTA: `上传图片生成视频` or `浏览模板`.
- Supporting proof: image-only, template-driven, credit pre-freeze/refund, ecommerce ratios.

Recommended sections:

1. Hero: product image -> video result.
2. Main use cases: product video, portrait/fashion, future freeform.
3. Template preview strip.
4. How it works: choose template, upload image, generate, download.
5. Trust and traceability: credits, failures/refunds, task logs.

### 模板

Role:

- Discovery and comparison.

Default layout:

- Visual template grid.
- Category chips instead of heavy sidebars.
- Template cards with cover image, output ratio, duration, credit cost, and required input.
- Detail modal for preview and suitability.

Card requirements:

- Strong media thumbnail.
- Short title.
- Required input badge, such as `只需图片`.
- Credit cost.
- Ratio and duration.
- CTA in detail modal, not on every card if it makes the grid noisy.

### 生产台

Role:

- Logged-in production center.
- It summarizes work and starts production.
- It should not compete with the homepage for marketing storytelling.

Default layout:

- Top quick start: recommended template and `创作台`.
- Credit status.
- Active tasks.
- Recent outputs/assets.
- Recommended templates.

Do not show:

- Provider logs.
- Agent internals.
- Large marketing hero sections.
- Dense admin diagnostics.

### 生产台 / 创作台

Role:

- Actual production state after selecting a template.

MVP template type:

- Image-only.
- User uploads/selects one image.
- User can generate without writing text.

Default visible surface:

- Current template summary.
- Large selected image.
- Upload/replace/select image action.
- Estimated credit freeze.
- Primary generation button.

Secondary surface under `高级设置`:

- Platform ratio.
- Video length.
- Image/output resolution.
- Clarity or render quality.

Template switching and sample-image switching should stay in a separate lightweight section. Future optional text fields appear only when the template schema requires them.

Do not show by default:

- Seller jargon.
- SKU language.
- Prompt fields.
- Model names.
- Batch table.
- Debug context.
- Provider options.

### 任务

Role:

- Task state, output retrieval, failure/refund understanding.

Default layout:

- Status summary.
- Task list.
- Task detail drawer.
- User-facing traceability first, raw diagnostics hidden.

Task detail should show:

- Input image.
- Template and version.
- Credit freeze/settle/release record.
- Queue/generate/render/review lifecycle.
- Output preview/download if complete.
- Failure/refund state if failed.

### 我的

Role:

- Account, credits, assets.

Default layout:

- Credit balance and recharge entry.
- Asset library with retention/expiry context.
- Login/account state.
- Recent ledger rows.

## 6. Visual Direction

Recommended style:

`Premium ecommerce creative studio`

Visual characteristics:

- Off-white product background.
- White operational surfaces.
- Black primary typography.
- One commercial accent color, currently green/teal is acceptable.
- Real product/media images as the visual core.
- Minimal decorative gradients.
- 8px card radius maximum unless a component has a strong reason.
- Dense enough for ecommerce operators, but never spreadsheet-like in the main creation flow.

Typography:

- Large, confident homepage headline.
- Compact operational headings in production-desk/task pages.
- Avoid oversized headings inside tool panels.

Cards:

- Template cards should feel like purchasable/usable creative products.
- Use hover/tap reveal for metadata.
- Do not nest cards inside cards.

Media:

- Use real-looking ecommerce product images and output previews.
- Avoid abstract AI blobs or generic futuristic decorations.
- Each primary media area should reveal the actual use case.

Motion:

- Use subtle card entrance and hover media scale.
- Template detail modal can blur background.
- Template card to making state can later use a shared-element transition.
- Avoid constant flipping everywhere; reserve richer motion for template discovery and before/after proof.

Mobile:

- Single-column.
- Sticky generation bar.
- Large image upload area.
- More settings collapsed.
- No hover-only interactions.

## 7. Page-Level Design Proposal

### Home Proposal

First viewport composition:

- Full-width hero band.
- Left: concise product promise and two CTAs.
- Right: real product image/video preview composition.
- Bottom of first viewport should hint at the next section.

Hero copy direction:

- H1: `上传一张商品图，生成一条电商短视频`
- Support: `模板已经封装好模型、镜头、字幕、比例和积分。`
- Primary CTA: `开始制作`
- Secondary CTA: `浏览模板`

Sections:

1. Product image to video proof.
2. Template gallery preview.
3. Ecommerce workflow steps.
4. Credit and traceability trust section.

### Template Page Proposal

Layout:

- Top: compact page title and search.
- Filter chips in a sticky toolbar.
- Grid cards with consistent media ratio.
- Template detail modal for preview and start.

Card metadata:

- Input requirement: `只需图片`, `图片+文案`, `人像照片`.
- Output: `9:16`, `6s`, `138 积分`.
- Scenario: `投放`, `种草`, `详情页`, `写真`.

### Workbench Proposal

Layout:

- Top row: quick start card plus credit card.
- Middle: active tasks and recommended template.
- Bottom: recent assets and traceability reminder.

Tone:

- Quiet, utility-first.
- No large marketing copy.
- No technical debugging unless inside details.

### Making Flow Proposal

Default:

- Single image upload/preview card.
- Template summary.
- Credit estimate.
- Generate button.

Empty state:

- Large dashed image drop zone.
- Copy: `上传一张商品图`
- Optional: `也可以从资产库选择`

Ready state:

- Image fills the preview card.
- Status: `图片已上传`
- Button enabled if credits are enough.

Error state:

- Missing image: button disabled and inline hint.
- Credits not enough: button opens recharge modal.
- Provider failure after submit: task state shows failure and credits released.

### Task Page Proposal

Layout:

- Status counters.
- Lifecycle strip.
- Task rows.
- Detail drawer.

Design:

- Use badges and progress bars, not dense tables.
- Show refund/release clearly.
- Advanced trace details collapsed.

### My Page Proposal

Layout:

- Credits and recharge.
- User-managed asset library.
- Account login/register.
- Ledger preview.

Asset cards:

- Thumbnail.
- Type.
- Expiry/retention.
- Preview action.
- Rename action.
- Download action.
- Reuse in creation action.
- Delete/archive action.

Asset library controls:

- Filter by image, video, poster, logo, portrait, and expiring assets.
- Show storage/retention context without making the page feel like an admin console.
- Keep destructive actions behind confirmation.
- Preserve historical task traceability after user deletion or archive.

## 8. Component Specs

### Template Card

States:

- Default.
- Hover/tap reveal.
- Selected/current.
- Disabled/unavailable.

Content:

- Cover media.
- Category.
- Title.
- Required input badge.
- Ratio/duration.
- Credit cost.

### Template Detail Modal

Content:

- Large preview.
- Template summary.
- Required input.
- Output specs.
- Cost.
- CTA: `使用模板`.

Do not include:

- Full creation form.
- Provider/model internals.
- Debug logs.

### Image Input Card

States:

- Empty.
- Uploaded/selected.
- Invalid file.
- Uploading.

Interactions:

- Click to upload/select.
- Preview media.
- Replace image.

MVP prototype can simulate upload with sample assets.

### Generation Command Bar

Content:

- Estimated credit freeze.
- Validation state.
- Primary generation button.

Rules:

- Sticky on desktop/mobile.
- No more than three information chunks.
- Does not include advanced settings.

### Task Row

Content:

- Thumbnail.
- Task title.
- Status badge.
- Progress.
- Updated time.

Interaction:

- Opens detail drawer.

## 9. Prototype Implementation Priority

### Phase 1: Simplify and Polish Current Flow

- Keep main navigation to 5 items.
- Make `创作台` image-only by default.
- Remove required text fields from first completed template.
- Make `高级设置` the home for output parameters, not style or template switching.
- Ensure desktop and mobile have no horizontal overflow.

### Phase 2: Upgrade Visual Quality

- Improve homepage hero with stronger product image-to-video composition.
- Upgrade template cards with richer media and required-input badges.
- Add polished empty/upload/ready states.
- Add a stronger template detail modal.

### Phase 3: Operational Trust

- Improve task detail drawer copy and visual hierarchy.
- Make credit freeze/settlement/release understandable.
- Improve asset library and output preview states.

## 10. Acceptance Criteria

The design should be considered good enough for the next review when:

- A new user can explain the product in one sentence after seeing the first screen.
- The first completed template can be used without writing text.
- The creation page does not look like a table, admin panel, or prompt playground.
- Template cards clearly show what users will get and what they must provide.
- Credit cost is visible before generation.
- Failure/refund state is visible in task history.
- Desktop uses space without becoming dense.
- Mobile stays linear and usable.
- Advanced options exist but are not front-stage.

## 11. Sources

- [Topview AI](https://www.topview.ai/)
- [Topview AI Product Video](https://www.topview.ai/ai-product-video)
- [Topview Ecommerce Use Cases](https://www.topview.ai/e-commerce-user-cases)
- [CapCut AI Video Generator](https://www.capcut.com/tools/ai-video-generator)
- [CapCut AI Product Video Generator](https://www.capcut.com/explore/ai-product-video-generator)
- [Pippit AI](https://www.pippit.ai/)
- [Pippit AI Image to Video](https://www.pippit.ai/tools/ai-image-to-video)
- [HeyGen AI Video Templates](https://www.heygen.com/tool/video-template)
- [HeyGen Template API](https://developers.heygen.com/template-api)
- [Runway Product](https://runwayml.com/product)
- [Runway Gen-4 Research](https://runwayml.com/research/introducing-runway-gen-4)
- [Kling AI](https://kling.ai/)
- [Kling AI Video Generator](https://kling.ai/feature/ai-video-generator)
- [Dreamina AI Video Generator](https://dreamina.capcut.com/tools/ai-video-generator)
- [Canva AI Video Generator](https://www.canva.com/features/ai-video-generator/)
- [Canva AI](https://www.canva.com/canva-ai/)

## 12. Current Prototype Gap Audit

Current prototype files:

- `src/App.tsx`
- `src/App.css`

Checked against the proposal on 2026-06-25.

### Already Aligned

- Main navigation is reduced to five items: `首页`, `生产台`, `模板`, `任务`, `我的`.
- `生产台` owns the `创作台` state, avoiding a separate top-level creation page.
- The first making flow is now image-only and does not require text.
- `高级设置` now holds output parameters: ratio, duration, resolution, and clarity.
- Credit estimate and generation action are visible before submit.
- Template detail uses a modal instead of putting the full creation form in the gallery.
- Task details use a drawer and keep traceability available without exposing raw internals by default.

### Important Gaps

1. Homepage visual impact is still not strong enough.
   - It currently communicates the value, but the first viewport should show a more convincing "input image -> generated video" composition.
   - Next step: redesign hero with a real before/result visual structure and stronger primary CTA.

2. Template cards still need clearer required-input badges.
   - The proposal requires badges such as `只需图片`.
   - Next step: add input requirement badges to cards and template detail.

3. The image upload area is still simulated as a selected sample image.
   - This is acceptable for prototype, but the UI should present a clear empty/upload/replace state.
   - Next step: add an empty upload card state and a "replace image" action.

4. Visual polish is not yet at the desired premium level.
   - Current UI is clean but still closer to a functional prototype.
   - Next step: refine hero, template cards, modal media, command bar, and task cards with stronger media hierarchy.

5. Motion direction is incomplete.
   - Template cards have basic entrance motion, but not enough card-to-detail or before/after proof motion.
   - Next step: implement one polished gallery motion direction before adding more experiments.

6. Task/output preview needs better completion states.
   - Current task state is traceable but not yet emotionally satisfying.
   - Next step: add completed output card, preview/download emphasis, and create-again action.

7. Mobile making flow is usable but needs final visual QA after the next hero/gallery redesign.
   - Next step: verify mobile screenshots after each visual upgrade.

### Recommended Next Frontend Iteration

Implement a "Design Pass 1" focused only on visual clarity and perceived quality:

1. Redesign homepage hero around `上传一张商品图，生成一条电商短视频`.
2. Add `只需图片` badges to template cards and detail modal.
3. Upgrade `创作台` empty/ready image states.
4. Make task completion/output preview more attractive.
5. Run desktop and mobile browser verification.
