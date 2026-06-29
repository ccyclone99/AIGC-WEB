# Frontend Premium UX Redesign SPEC

Status: Phase 1 page-role refactor implemented in prototype
Last updated: 2026-06-29

## 1. Purpose

This SPEC defines the next frontend-only redesign pass for the AIGC Web prototype.

The current prototype has the correct functional direction: homepage, production desk, template gallery, creation flow, task tracking, asset library, credits, auth, and backend-facing state boundaries are already present.

The remaining problem is product quality. The UI still feels like a functional prototype rather than a premium AIGC creation platform. The next pass should improve perception, hierarchy, and user flow without adding backend complexity.

## 2. Product Positioning

The product should feel like:

- A premium ecommerce video creation studio.
- A template-driven production platform.
- A low-friction tool for non-technical sellers.
- A visual, output-first product, not a prompt playground.

The product should not feel like:

- A generic SaaS dashboard.
- A form builder.
- A backend admin panel.
- A model parameter console.
- A collection of equal-weight cards.

## 3. Design Goals

Primary goals:

- Make the first impression more premium and commercially useful.
- Make creation feel visual and confident, not like filling a form.
- Make templates feel like video products, not static cards.
- Make assets and tasks feel like part of a production loop.
- Reduce visible complexity on creation surfaces.

Secondary goals:

- Preserve current mock-state coverage for backend preparation.
- Keep all existing critical states: credit freeze, failure release, task traceability, asset expiry, upload state, QR login, payment order state.
- Keep the first complete template image-only: upload/select one image, generate one ecommerce short video.

## 4. Current Issues

### 4.1 Visual Quality

The current UI is clean, but still lacks a distinctive product identity. Many surfaces use the same card treatment, which makes important actions and secondary information feel similar.

### 4.2 Creation Surface

The current creation page is much better after simplification, but still reads as `image preview + side controls`. It should feel closer to a lightweight creation studio with a main stage, stable command area, and contextual controls.

### 4.3 Template Discovery

Templates are the core product asset, but the current template gallery does not fully communicate video rhythm, output quality, platform fit, or use-case value.

### 4.4 Asset and Task Loop

Assets and tasks exist, but they still feel like separate account/backend records. They should feel like a reusable production history: upload, create, result, reuse, variant, download.

## 5. Three Redesign Directions

These directions are not mutually exclusive. The recommended approach is to implement them in order.

## Direction A: Premium Creation Studio

### A.1 Goal

Upgrade `生产台 / 创作台` into a premium creation console. The user should feel that the uploaded image is being placed into a professional video-generation stage.

### A.2 Main Layout

Desktop layout:

- Top global navigation remains.
- Main creation surface fills the remaining viewport.
- Center/left: large media stage.
- Right: compact contextual controls.
- Bottom or lower-right: stable generation command area.

Recommended structure:

- `StudioShell`
- `StudioStage`
- `StudioInputPanel`
- `StudioSettingsPopover`
- `StudioCommandBar`
- `BackgroundTaskStrip`

### A.3 Stage Requirements

The media stage must be the visual anchor.

Required:

- Large selected image preview.
- Empty state with upload/select prompt.
- Drag/drop style affordance, even if drag/drop is simulated.
- Selected asset status: source, expiry, trace.
- Subtle overlay showing current template result type.

Preferred visual:

- Product image appears on a dark or neutral studio canvas.
- Bottom overlay shows `图片已就绪`.
- Replace/remove/preview are nearby but not as visually dominant as generate.

Do not:

- Put the main creation experience inside a modal.
- Make the stage look like a plain file upload box.
- Show long explanatory text on the stage.

### A.4 Control Panel Requirements

Right-side controls should only show what the user needs before submission.

Always visible:

- Current template.
- Selected asset summary.
- Replace image.
- Advanced settings entry.
- Credit freeze estimate.
- Generate button.

Collapsed by default:

- Ratio.
- Duration.
- Resolution.
- Quality.
- Traceability details.

Hidden from MVP first template:

- Selling point text.
- Prompt fields.
- Multi-SKU batch table.
- Provider/model parameters.

### A.5 Command Behavior

Generation behavior must remain:

- Submit freezes credits.
- Task enters background.
- User stays on creation page.
- Duplicate active submission is blocked by image + template + output settings.
- Changing output settings creates a valid variant path.

### A.6 Motion Requirements

Required motion:

- Image selection crossfade into stage.
- Generate click triggers a short `task created` motion.
- Background task appears without navigating away.
- Advanced settings opens as a popover/sheet.

Motion constraints:

- No decorative looping motion near the generate button.
- Respect `prefers-reduced-motion`.
- No layout jump when task strip appears.

### A.7 Acceptance Criteria

- Desktop 1280px width: selected image, replace action, settings entry, credit freeze, and generate button are visible without scrolling.
- User can understand the page without reading more than one short sentence.
- After submit, page remains in creation mode.
- The generated task is visible as a background task.
- No same-parameter duplicate submission.

## Direction B: Video-Native Template Gallery

### B.1 Goal

Make template discovery feel like browsing video products. The user should immediately understand what each template outputs and why it is useful.

### B.2 Template Card Requirements

Each template card must expose:

- Output preview image or video poster.
- Template title.
- Required input type.
- Output type.
- Ratio.
- Duration.
- Credit cost.
- Use-case tag.

Required input badges:

- `商品图`
- `人像照片`
- `视频素材`
- `Logo`

Output badges:

- `电商短视频`
- `写真/变装`
- `视频二创`
- `详情页素材`
- `投放素材`

### B.3 Card Interaction

Desktop:

- Hover reveals preview controls.
- Video-capable templates show muted auto preview or simulated playback layer.
- Card lift must be subtle.

Mobile:

- Tap card opens detail.
- No hover-only information.
- Preview action remains visible or available in detail.

### B.4 Gallery Organization

Top filter categories:

- 推荐
- 电商短视频
- 商品图成片
- 人像写真
- 视频二创
- 详情页/投放

Secondary filters:

- 输入类型.
- 输出比例.
- 视频时长.
- 积分区间.

### B.5 Template Detail Modal

Template detail must answer:

- This template needs what input?
- This template outputs what result?
- How many credits?
- How long is the video?
- Which ecommerce/social use case is it suitable for?
- Is this template currently available?

For supported image templates:

- CTA: `使用此模板`.

For reserved video-input templates:

- CTA disabled or secondary: `视频制作暂未开放`.
- Must not route into image-only creation page.

### B.6 Visual Requirements

Template gallery should feel more editorial and video-led than the production desk.

Required:

- Larger media areas.
- Clear play affordance for video templates.
- Stronger selected/featured treatment for recommended templates.
- Better differentiation between product, portrait, and video-input cards.

Do not:

- Hide credit cost behind hover.
- Make all cards the same size if one or two templates are being promoted.
- Use admin-like table/list layout for templates.

### B.7 Acceptance Criteria

- User can distinguish image, portrait, and video templates at a glance.
- User can find image-only ecommerce templates quickly.
- User can preview a video-input template without accidentally entering unsupported creation.
- Credit cost is visible before opening detail.

## Direction C: Production Loop UX

### C.1 Goal

Make assets, tasks, and results feel like one production loop rather than separate pages.

The loop should be:

`资产 -> 创作 -> 后台任务 -> 结果 -> 资产库 -> 复用/下载`

### C.2 Navigation Recommendation

Current MVP navigation:

- 首页
- 生产台
- 模板
- 任务
- 我的

Product meaning:

- `首页`: public product entry.
- `生产台`: logged-in production hub and creation entry.
- `模板`: discovery.
- `任务`: tracking and traceability.
- `我的`: account, credits, and asset management.

Optional later navigation refinement:

- 首页
- 创作
- 模板
- 资产
- 任务

The underlying route id can remain `workbench`; the visible label is `生产台` to avoid confusion with the creation surface.

### C.3 Production Desk Requirements

Production desk should not compete with the creation page.

Production desk should show:

- Start creation.
- Active task summary.
- Recent assets.
- Credit status.
- Recent successful outputs.

Production desk should not show:

- Too many template cards.
- Long explanatory text.
- Full asset management table.
- Full credit ledger.

### C.4 Asset Library Requirements

Asset library should be a management space.

Required:

- Upload asset.
- Filter by category.
- Filter by media type.
- Rename.
- Preview.
- Download.
- Reuse.
- Archive/restore.
- Expiry/retention signal.

Asset card hierarchy:

1. Thumbnail.
2. Asset name.
3. Type/source.
4. Expiry.
5. Primary action.
6. Secondary actions.

Do not:

- Make every action equally prominent.
- Show destructive archive action as the strongest button.
- Mix account login settings into the visual focus of assets.

### C.5 Task Page Requirements

Task page should focus on status and recovery.

Task row must show:

- Template/result title.
- Status.
- Progress.
- Credit state.
- Last update.
- Primary action: view detail or preview result.

Task detail drawer must keep:

- Submitted parameter snapshot.
- Template version.
- Pricing version.
- Provider attempt.
- Render attempt.
- Moderation/fallback.
- Output asset.
- Credit ledger state.

Default view should be user-friendly. Technical trace remains available but not first visual focus.

### C.6 Result Reuse Requirements

When a task succeeds:

- Result enters asset library.
- User can preview.
- User can download.
- User can reuse eligible assets.
- Video output is marked as preview-only for image-only templates unless a video-input template supports it.

### C.7 Acceptance Criteria

- User understands where generated videos go after completion.
- User can reuse an image asset from asset library into creation.
- User can see why a video asset cannot be selected for image-only creation.
- Task failure clearly shows whether credits were released.

## 6. Visual System SPEC

### 6.1 Overall Style

Target style:

- Premium but practical.
- Media-first.
- Clean, not sterile.
- Ecommerce-oriented.
- Tool-like, not marketing-heavy.

Use:

- Strong product/video previews.
- Neutral surfaces.
- Black primary actions.
- Muted green for ready/success.
- Warm yellow only for credit/payment context.
- Red only for warning/destructive actions.

Avoid:

- Purple/blue gradient-heavy AI look.
- Decorative blobs/orbs.
- Too many beige/tan surfaces.
- Heavy dark dashboard style.
- Oversized card stacks.

### 6.2 Layout Rules

Desktop:

- Use the width.
- Creation can be wide and stage-led.
- Dashboard-like surfaces should be compact.
- Avoid squeezing all content into a narrow centered column.

Mobile:

- Single-column.
- No horizontal overflow.
- Sticky bottom action is allowed for generation.
- Hover-only content must have tap equivalent.

### 6.3 Card Rules

- Radius: 8px or less.
- Use cards for repeated items, modals, and real tools.
- Do not put cards inside cards.
- Media must have stable aspect ratio.
- Text must not overflow.
- Primary action should not be hidden when it is critical.

### 6.4 Motion Rules

Allowed:

- Hover lift.
- Preview reveal.
- Modal/drawer entrance.
- Upload success feedback.
- Task-created transition.
- Task progress motion.

Not allowed:

- Constant decorative animation in operational pages.
- Motion that causes layout shift.
- Motion-only state communication.

Timing:

- Hover/press: 120-180ms.
- Card reveal: 220-320ms.
- Modal/drawer/sheet: 220-280ms.
- Task-created feedback: 260-420ms.

## 7. Page-Specific SPEC

### 7.1 Homepage

Purpose:

- Sell the core value.
- Route to creation or templates.

Must show:

- Literal H1: product image to ecommerce short video.
- Input image to output video visual.
- Primary CTA: start creation.
- Secondary CTA: browse templates.
- Registration/credit bonus entry.

Must not show:

- Too many operational details.
- Task queue as primary content.
- Generic AI slogans.

Acceptance:

- Within 5 seconds, user understands: upload product image, generate ecommerce video.

### 7.2 Production Desk

Purpose:

- Logged-in production hub.

Must show:

- Start creation.
- Active task.
- Credit state.
- Recent assets/results.

Must not show:

- Large marketing hero.
- Long template gallery.
- Full task table.

Acceptance:

- User can decide in one glance whether to create, check tasks, or manage assets.

Implemented in current prototype:

- Top navigation label changed from `工作台` to `生产台`.
- Removed old repeated production-hub grid from the visible production desk.
- Production desk now focuses on create entry, task monitor, recent assets, and credit state.

### 7.3 Creation Page

Purpose:

- Finish first image-only generation loop.

Must show:

- Large image stage.
- Selected asset.
- Replace image.
- Advanced settings.
- Credit freeze.
- Generate.
- Background task after submit.

Must not show:

- Required text prompt.
- Batch table.
- Provider parameters.
- Template switching inside the opened template.

Acceptance:

- Desktop core flow fits one viewport.
- User can generate without text.

### 7.4 Template Page

Purpose:

- Discover templates and understand output.

Must show:

- Featured templates.
- Template cards with video-native preview treatment.
- Filters.
- Cost and duration.

Acceptance:

- User can choose a template based on visual output and cost.

### 7.5 Task Page

Purpose:

- Track and inspect tasks.

Must show:

- Status.
- Progress.
- Credit state.
- Result actions.
- Traceability in drawer.

Acceptance:

- User can understand success, running, failure, and refund states.

### 7.6 My Page

Purpose:

- Account-adjacent management.

Tabs:

- Assets.
- Credits.
- Account.

Acceptance:

- Assets remain manageable.
- Credits remain understandable.
- Account/login does not compete with asset work.

## 8. Implementation Plan

### Phase 1: Creation Studio Upgrade

Deliverables:

- Refactor creation page into stage-led layout.
- Improve empty/selected/upload states.
- Add task-created motion.
- Keep advanced settings in popover/sheet.
- Keep background task strip.

Files likely touched:

- `src/components/StudioPage.tsx`
- `src/components/AssetPicker.tsx`
- `src/components/AppOverlays.tsx`
- `src/App.css`

### Phase 2: Template Gallery Upgrade

Deliverables:

- Upgrade card design.
- Add video-native preview affordance.
- Improve filters.
- Improve template detail modal.
- Keep unsupported video templates reserved.

Files likely touched:

- `src/components/TemplatesView.tsx`
- `src/components/AppOverlays.tsx`
- `src/prototypeData.ts`
- `src/App.css`

### Phase 3: Production Loop Upgrade

Deliverables:

- Improve production desk hierarchy.
- Improve asset library card hierarchy.
- Improve task rows and task detail default view.
- Make success result to asset reuse clearer.

Files likely touched:

- `src/components/WorkbenchView.tsx`
- `src/components/AssetManager.tsx`
- `src/components/TasksView.tsx`
- `src/components/TaskDetail.tsx`
- `src/App.css`

### Phase 1.5: Page Role Refactor

Implemented in current prototype:

- Homepage rebuilt as product entry with input-to-output visual and three clear routes.
- Production desk rebuilt as the logged-in production hub.
- Task page rebuilt as a task monitor plus traceable record list.
- My page rebuilt as resource/account center with side tabs.
- Global page width and mobile single-column behavior unified.

## 9. QA Checklist

Required before this pass is complete:

- `npm run lint`
- `npm run build`
- Desktop 1280px visual check:
  - homepage;
  - production desk;
  - creation;
  - template gallery;
  - task detail;
  - asset library.
- Mobile 390px visual check:
  - no horizontal overflow;
  - creation still usable;
  - template cards tappable;
  - asset picker usable;
  - task drawer readable.
- Browser console has no app errors.

Creation flow test:

1. Home -> start creation.
2. Replace image -> asset picker opens.
3. Select image -> picker closes.
4. Open advanced settings -> change duration.
5. Submit generation.
6. Stay on creation page.
7. Background task appears.
8. Duplicate submit is blocked.
9. Change setting -> generate variant is allowed.

Template flow test:

1. Browse templates.
2. Open image template.
3. Start creation.
4. Open video-input template.
5. Confirm reserved state does not enter image-only creation.

Asset/task flow test:

1. Open asset library.
2. Preview asset.
3. Reuse image asset.
4. Submit task.
5. Advance task to success.
6. Confirm generated output appears as video asset.
7. Confirm video asset is preview-only for image-only creation.

## 10. Open Decisions

Need product/design review:

- Whether homepage should use more cinematic media or more ecommerce tool style.
- Whether template gallery should use mixed-size featured cards or uniform cards.
- Whether mobile navigation should move to a bottom tab bar later.
- Whether asset library should become its own top-level navigation after MVP.

## 11. Recommended Next Step

Continue with Phase 2: Template Gallery Upgrade, then return to creation-studio micro-polish.

Reason:

- Page roles are now clearer after the Phase 1.5 refactor.
- Template cards are the next highest-leverage product surface.
- Better template preview quality will improve both homepage conversion and production-desk entry quality.
- This still does not require changing backend-facing API assumptions.
