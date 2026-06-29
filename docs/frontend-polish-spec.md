# Frontend Polish SPEC

Status: Superseded by 2026-06-29 page-role refactor baseline
Last updated: 2026-06-29

This document defines the next frontend-only polish pass. Backend integration is explicitly out of scope for this pass.

## 1. Goal

Make the current prototype feel like a polished, premium AIGC content creation website, not only a functional mock.

The product should communicate:

- Ecommerce-first AIGC video creation.
- Template-driven generation, not prompt writing.
- Upload/select one asset and get a finished video.
- Credits, task states, failures, refunds, and assets are controlled and traceable.
- Future video-input templates exist, but image-only generation remains the first complete demo loop.

## 2. Scope

In scope:

- Homepage visual and interaction upgrade.
- Template gallery card and detail upgrade.
- `生产台 / 创作台` visual simplification and premium treatment.
- `我的 / 资产库` management experience upgrade.
- Motion system cleanup across pages, cards, modal, drawer, sheet, lightbox, and toast.
- Empty, loading, success, warning, and disabled states.
- Desktop and mobile responsive polish.
- Component boundary cleanup when it directly improves frontend review or future backend replacement.

Out of scope:

- Backend/API integration.
- Real provider generation.
- Real payment.
- Real login.
- Real video upload creation flow.
- Full video editor.
- Admin console UI.

## 3. Design Direction

Target feeling:

- Premium ecommerce creative studio.
- Clean, visual, confident, and commercially useful.
- Less like a dashboard, form builder, or generic AI toolbox.

Visual principles:

- Use strong media areas for product/video output previews.
- Keep controls compact and predictable.
- Keep text short and action-oriented.
- Avoid large blocks of explanatory copy inside the app.
- Avoid too many equal-weight cards on one screen.
- Use restraint: no excessive gradients, decorative blobs, or one-color theme.
- Every visual element should clarify input, output, template value, credit cost, state, or next action.

Interaction principles:

- Primary actions are always obvious.
- Advanced settings are collapsed and secondary.
- Users can preview value before committing credits.
- Failed and pending states are calm and legible.
- Hover effects must have mobile tap equivalents.
- Reduced motion should still be usable.

## 4. Page-Level Requirements

### 4.1 首页

Purpose:

- Make first-time users understand the product within one screen.
- Sell the core loop: upload product image -> generate ecommerce video.
- Route users into `开始制作` or `浏览模板`.

Required changes:

- Replace the current hero with a stronger first-viewport composition.
- Hero should show an input asset and an output video-style result in one integrated scene.
- Keep the H1 literal and focused on product image to ecommerce video.
- Add visible but compact signals: `只需图片`, `自动镜头`, `失败退积分`, `参数可追溯`.
- Add one video-input template teaser as a future capability, without competing with the main image flow.
- Make CTA behavior clear:
  - Primary: `开始制作`.
  - Secondary: `浏览模板`.
  - Tertiary: `领积分` or login/register entry.

Do not:

- Add a marketing landing page before the product entry.
- Use generic AI slogans that could fit any AI product.
- Put too many feature cards above the fold.

Acceptance:

- In 5 seconds, a new user can say: "This site turns product images into ecommerce videos through templates."
- Desktop first screen shows enough of the next section to suggest scroll.
- Mobile first screen does not require horizontal scroll and does not bury `开始制作`.

### 4.2 模板页

Purpose:

- Let users scan templates, understand required input, and choose a template quickly.

Required changes:

- Upgrade template cards to feel more video-native:
  - Larger media area.
  - Clear input badge: `只需图片`, `人像照片`, `视频素材`.
  - Category badge.
  - Duration, ratio, and credit cost always visible.
  - Hover/tap preview layer with `预览` and `查看详情`.
- Separate visual treatment by template type:
  - Product image templates: product/editorial visual style.
  - Portrait templates: portrait/consent-sensitive visual style.
  - Video-input templates: playback/frame/clip visual affordance.
- Add a stronger filter row or sheet:
  - Content type.
  - Required input.
  - Output ratio.
  - Credit range.
- Template detail modal should show:
  - Required input.
  - Output result.
  - Credit cost.
  - Duration/ratio.
  - Suitable use case.
  - Current support state.

Video-template rule:

- Video-input templates are visible in the gallery.
- Their detail view must show an autoplaying muted preview video when preview material exists.
- Their detail CTA stays disabled as `视频制作暂未开放` until the video creation page exists.
- They must not route into the current image-only creation workspace.

Do not:

- Make template cards look like plain admin cards.
- Hide credit cost behind hover.
- Mix unsupported templates into the main creation flow.

Acceptance:

- Users can visually distinguish image, portrait, and video-input templates.
- Filtering `视频模板` reveals video-input templates.
- Opening a video-input template clearly indicates that video creation is handled by a later dedicated workspace.

### 4.3 生产台 / 创作台

Purpose:

- Make the first complete creation loop feel simple, powerful, and safe.

Current supported loop:

- Image-only product template.
- User uploads/selects one image.
- User can generate without writing text.
- Advanced output parameters are optional.

Required changes:

- Make the upload/selected-image area feel like the center of creation.
- Reduce the creation page vertical depth. The core loop must not require repeated scrolling:
  - selected/input image;
  - replace/remove image actions;
  - advanced settings entry;
  - frozen credit state;
  - generate button.
- Treat `生产台 / 创作台` as an operation console rather than a long content page. It should fit the primary creation controls into one desktop viewport where possible.
- Reduce visual noise in the production desk and creation state. Avoid too many equal-weight chips, cards, and status blocks competing with the main input and generation action.
- Improve selected asset state:
  - Source: asset library or uploaded file.
  - Retention/expiry.
  - Traceability.
  - Replace/remove action.
- Make `从资产库选择` feel lightweight:
  - It should not look like a backend table.
  - Asset cards should be compact and image-led.
- Keep `高级设置` collapsed by default:
  - Ratio.
  - Video length.
  - Resolution.
  - Clarity.
- Bottom command bar must remain stable:
  - Estimated frozen credits.
  - Validation state.
  - Generate button.

Required states:

- No image selected.
- Image selected.
- Upload validation error.
- Insufficient credits.
- Ready to submit.
- Submitted -> task created.

Do not:

- Reintroduce a right-side permanent checklist/context inspector.
- Make users write selling points for the first template.
- Put template switching inside advanced settings.
- Make the creation page feel like a table or spreadsheet.

Acceptance:

- A user can start generation from the page without reading instructions.
- On desktop, the first image-only creation flow should keep input preview, image actions, credit state, and generate action visible without repeated downward scrolling.
- The production desk should not feel visually crowded; secondary operational information should be grouped, collapsed, or moved out of the main creation path.
- Removing the selected image disables generation.
- Selecting or uploading an image restores generation readiness.
- Advanced settings are visible but not front-stage.
- The creation console is isolated in `src/components/StudioPage.tsx`; backend task creation can be wired through props without editing unrelated homepage, template, task, or account markup.

### 4.4 任务页

Purpose:

- Make generation state, credit state, and traceability understandable.

Required changes:

- Improve task row hierarchy:
  - Status.
  - Template title.
  - Last update.
  - Progress.
  - Credit state.
- Task detail should have clear state panels:
  - Running: current stage and frozen credits.
  - Success: output preview, download, asset library action.
  - Failure/refund: released credits and preserved trace.
- Trace section remains collapsed but complete.

Do not:

- Show raw provider logs to normal users by default.
- Make every task row visually equal if one is active or just completed.

Acceptance:

- Users can tell whether credits are frozen, settled, or released.
- Success state encourages preview/download/reuse.
- Failure state makes refund/release obvious.

### 4.5 我的 / 资产库

Purpose:

- Let users manage their own reusable uploads and generated outputs.

Required changes:

- Make asset library feel like a content space, not only a list.
- Improve asset cards:
  - Thumbnail.
  - Type.
  - Source.
  - Retention/expiry.
  - Actions revealed with clear hierarchy.
- Improve filters:
  - All.
  - Images.
  - Videos.
  - Expiring.
  - Archived.
- Keep management actions:
  - Upload.
  - Preview.
  - Download.
  - Rename.
  - Reuse.
  - Archive.
  - Restore.
- Add better empty states per filter.
- Make disabled `复用` states explain why a video cannot be used in an image-only template.

Do not:

- Hide archive/restore behavior.
- Delete historical traceability when user archives an asset.
- Make destructive actions too prominent.

Acceptance:

- User understands these are their own assets.
- User can reuse an image asset into the creation flow.
- User can see generated outputs after task success.
- Expiring assets are visible.

## 5. Motion SPEC

Motion should clarify state, not decorate.

Required motion:

- Homepage input-to-output reveal.
- Template card hover/tap preview.
- Modal/drawer/sheet entrance with consistent easing.
- Upload success micro-feedback.
- Task progress update.
- Asset card hover action reveal.
- Toast entrance/exit.

Motion constraints:

- Respect `prefers-reduced-motion`.
- Avoid continuous distracting animation in dense pages.
- Do not animate layout in ways that cause text overlap.
- Mobile tap states must not depend on hover.

Suggested timing:

- Small hover/press: 120-180ms.
- Card reveal: 220-320ms.
- Modal/drawer entrance: 220-280ms.
- Page section entrance: 260-360ms.

## 6. Component Requirements

### Buttons

- Primary action: black or strongest brand-neutral style.
- Secondary action: outlined/white.
- Destructive action: muted red, not dominant.
- Disabled action: visibly disabled and non-clickable.
- Icon + text where the action benefits from recognition.

### Cards

- Border radius: 8px or less.
- Do not nest cards inside cards.
- Keep fixed media aspect ratios to prevent layout shift.
- Text must not overflow on mobile.

### Modals / Drawers

- Use for preview, template detail, task detail, credit, auth, and filters.
- Background blur is acceptable.
- Keep creation itself on a page, not inside a modal.

### Forms / Controls

- File upload must show accepted input.
- Segmented controls for ratio/duration/quality.
- Filters should use chips/buttons.
- Avoid visible technical field names.

## 7. Responsive Requirements

Desktop:

- Use width confidently.
- Avoid squeezing the whole app into a narrow center column.
- Product/creation pages can have large media areas.
- Operational pages can be denser but not admin-like.

Mobile:

- Single-column layout.
- Sticky or near-bottom generation action where appropriate.
- No horizontal scroll.
- Cards must remain tappable.
- Template preview actions must be available without hover.

Breakpoints to verify:

- 390px mobile.
- 768px tablet.
- 1280px desktop.

## 8. Accessibility and UX Safety

Required:

- Buttons and inputs must have clear labels.
- Media previews must have meaningful alt text.
- Dialogs/drawers must be closable.
- Disabled states must be clear.
- Toasts should not permanently block core actions.
- Color must not be the only status signal.

## 9. Prototype Data Requirements

Keep using local mock data.

Required mock templates:

- Product image to ecommerce video.
- Portrait/fashion video.
- Product detail/beauty/food templates.
- Video-input templates:
  - Existing video ad refresh.
  - Talking-head clip packaging.
  - Product video card packaging.

Required mock states:

- Credit balance.
- Frozen credits.
- Running task.
- Successful task.
- Refunded task.
- Uploaded image asset.
- Generated video asset.
- Archived asset.

## 10. Acceptance Checklist

Before considering this polish pass done:

- `npm run lint` passes.
- `npm run build` passes.
- Desktop flow works:
  - Home -> start making.
  - Select/upload image.
  - Change advanced settings.
  - Submit task.
  - Advance task to success.
  - Preview/download/go to asset library.
  - Reuse asset.
  - Failure/refund state is visible.
- Template flow works:
  - Browse templates.
  - Filter video templates.
  - Open image template and create.
  - Open video template and see reserved state.
- Asset flow works:
  - Filter.
  - Preview.
  - Download.
  - Rename.
  - Archive/restore.
  - Reuse image asset.
- Mobile checks pass:
  - No horizontal overflow at 390px.
  - Home, template, creation, task detail, and asset library are usable.
- Browser console has no application errors.

## 11. Implementation Order

1. Homepage first-screen polish.
2. Template gallery card/detail polish.
3. Creation page visual polish.
4. Task detail state polish.
5. Asset library management polish.
6. Motion cleanup and responsive pass.
7. Final end-to-end review.

## 12. Current Decisions

- Do not start backend work yet.
- Keep image-only generation as the first complete demo flow.
- Keep video-input templates visible but creation reserved.
- Keep `生产台` as the production surface.
- Keep `首页` as the public product entry.
- Keep `我的` as account and asset management.
- Keep advanced settings focused on output parameters only.
- Keep backend integration blocked until the frontend has stable API-facing states for auth, upload, payment, credits, and task errors.

## 13. 2026-06-26 UX Review Pass

Completed in this pass:

- Removed remaining user-facing prototype/reserved/placeholder wording.
- Changed production-desk `开始制作` to enter `生产台 / 创作台` directly.
- Added real autoplay muted loop preview for video-input template detail.
- Kept video-input template creation disabled with production wording: `视频制作暂未开放`.
- Hid task developer controls from normal task detail.
- Added user-managed asset categories:
  - add custom category;
  - delete custom category;
  - assign an asset to a category;
  - show the same category set in creation asset picker.
- Renamed creation actions from generic `查看 / 移除` to `预览图片 / 移除图片`.
- Compressed desktop production-desk spacing so the core panels sit closer to one viewport.
- Converted mobile template cards to compact media-list cards.
- Converted mobile asset management cards to compact management-list cards.
- Reduced mobile account card and asset summary height.
- Split `我的` into three tabs: `资产`, `积分`, and `账号`, so asset management, recharge ledger, and login/register do not stack into one long page.
- Changed creation submission to a background-task flow: after `生成视频`, the user stays in `生产台 / 创作台`, credits are frozen, Toast confirms submission, and a compact background task strip links to the task detail drawer.
- Added duplicate-submit protection for the same image, template, and output parameters. The generate button becomes `后台生成中`; changing advanced settings re-enables generation as a variant.
- Added a clear `完成设置` action inside advanced settings so parameter editing does not block the submit area.
- Refined the creation asset picker with a current-input summary, usable-image count, preview-only count, counted category filters, selected-state marker, and clearer `选择图片 / 当前使用 / 仅可预览` actions.
- Upgraded task detail traceability into structured sections for submitted parameters, template/pricing version, credit ledger state, provider attempts, render records, moderation/fallback, and output assets.
- Upgraded the credit center ledger into structured transaction rows with ledger ID, kind/status, task/payment/campaign reference, time, source, note, and signed amount.
- Added a frontend-approved `Template.config` contract with workflow type, version, pricing version, settlement mode, input fields, output fields, capabilities, and trace fields. Task parameters now snapshot template version, pricing version, workflow type, input asset id, and output settings.
- Split API-facing frontend concepts out of `App.tsx` into:
  - `src/types.ts` for shared template/task/asset/ledger types;
  - `src/prototypeData.ts` for replaceable local seed data;
  - `src/domain.ts` for pure business helpers.
- Added backend-facing state models for signup reward status, signup risk checks, upload receipts, payment orders, and task failure reasons.
- Added QR login state models for waiting, scanned, confirmed, expired, and rejected sessions.
- Changed recharge from direct balance increase to a payment order flow: create order, then mark paid/failed/expired. Only paid orders update balance and write a recharge ledger row.
- Added upload receipt panels to the asset library and creation asset picker, including request id, status, progress, source, and message.
- Added generation `idempotencyKey` creation from template version, input asset, and output settings, and exposed it in task detail.
- Added task failure details with failure stage, reason, error code, retryability, and message. Current visible examples cover provider error, moderation block, and invalid input asset.
- Added account reward state and signup anti-abuse checks to the login/register surface.
- Extracted `AuthPanel` and `CreditPanel` into dedicated component files so auth/payment backend integration can be wired without editing the full page shell.
- Extracted `AssetPicker`, `TaskDetail`, and `UploadReceiptPanel` into dedicated component files.
- Added upload `cancelled` and `rejected` states, with cancel and retry/reselect actions on upload receipts.
- Added payment order cancellation from the credit panel.

Measured verification:

- `npm run lint` passes.
- `npm run build` passes.
- Desktop creation page fits the main controls in one viewport at 1365x820.
- Desktop background-task submit keeps `生产台 / 创作台` active, opens task detail as a drawer, and does not navigate to `任务`.
- Desktop duplicate-submit guard works: first submit changes the button to `后台生成中`, changing duration to `10s` re-enables `生成视频`, and the variant submit increases active background tasks to 3.
- Mobile background-task submit keeps the creation page active at 390x844, with page height about 1021px and no horizontal overflow.
- Mobile duplicate-submit guard keeps the creation page active at 390x844, with page height about 1042px and no horizontal overflow.
- Desktop and mobile asset picker checks pass: upload remains the first grid item, selected asset is marked, video assets are preview-only, selecting another image closes the picker and updates the creation input.
- Desktop task detail shows six traceability records and nine submitted-parameter fields with concrete values. Mobile task drawer shows the same records without horizontal overflow.
- Credit center checks pass: recharge writes a new `已到账` ledger row with payment reference, freeze/settle/release/reward rows show distinct statuses and references, and mobile credit page has no horizontal overflow. Mobile `我的 / 积分` height is about 1755px at 390x844 after compacting packages and ledger rows.
- Template detail shows the template protocol summary, and generated task details include concrete template version, pricing version, and workflow fields.
- `App.tsx` was reduced from about 3186 lines to about 2665 lines by moving shared types, prototype data, and pure helpers into dedicated modules.
- Payment, upload, signup reward, and task failure state types compile through the current frontend.
- Mobile template page height reduced from about 4171px to about 1936px at 390x844.
- Desktop `我的` tab heights at 1365x820: `资产` about 1272px, `积分` about 1264px, `账号` about 967px.
- Mobile `我的` tab heights at 390x844: `资产` about 1578px, `积分` about 1478px, `账号` about 1173px.
- No horizontal overflow found in reviewed desktop/mobile paths.
- Browser console did not report application errors during reviewed paths.

## 14. 2026-06-29 Page-Role Refactor Pass

Completed in this pass:

- Rebuilt homepage as a public product entry rather than a mixed product/dashboard page.
- Renamed the visible logged-in production surface from `工作台` to `生产台`.
- Rebuilt production desk around create entry, current background task, recent assets, credit state, and short template lane.
- Kept the creation surface as the image-only `创作台`, with submission remaining in place while tasks run in the background.
- Rebuilt task page as `任务追踪`, with current task focus, lifecycle strip, and all records.
- Rebuilt my page as `资源与账号`, with asset library, credit center, and account security side sections.
- Added global page width constraints and mobile single-column rules for the refactored pages.
- Updated [frontend-premium-ux-redesign-spec.md](./frontend-premium-ux-redesign-spec.md), [frontend-prototype-review.md](./frontend-prototype-review.md), and [SPEC.md](./SPEC.md) to match the current page roles.

Measured verification:

- `npm run lint` passes.
- `npm run build` passes.
- Desktop homepage, production desk, template page, task page, my page, and creation surface have no horizontal overflow.
- Desktop creation surface fits the 1280px by 720px viewport.
- Mobile 390px homepage, production desk, template page, task page, and my page have no horizontal overflow.
- Submitting `生成视频` keeps the user in the creation surface and shows a background task.

Remaining optional polish:

- Mobile top navigation still occupies about 91px. Later app-like mobile navigation can move primary tabs to a bottom bar.
- `我的 / 资产` is still the longest personal-space tab because it is a management surface. If it still feels heavy in review, the next split should separate active assets and archived assets.
- Replace prototype video preview material with branded/template-specific preview MP4 files before stakeholder demo.
- Add keyboard focus trapping for modal/drawer/sheet before production hardening.
- Before backend starts, complete provider-specific payment callback error copy, QR polling/token invalidation wording, generation cancel/retry payload copy, and permanent-save/renew actions for expiring provider assets.
