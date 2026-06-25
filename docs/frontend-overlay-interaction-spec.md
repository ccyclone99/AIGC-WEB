# Frontend Overlay Interaction SPEC

Status: Draft decision
Last updated: 2026-06-25

This SPEC defines how AIGC Web should use purpose-built pages plus overlays to reduce page complexity.

## Core Principle

The main discovery and management pages should be scanning surfaces. Detailed preview and account decisions can open in focused overlays. Actual production editing should use a full workbench making state because ecommerce creation needs persistent template, product, preview, and command-bar context.

Pages should show:

- Primary action.
- Search/filter entry.
- Compact cards or lists.
- Current balance/status if needed.

Pages should not show:

- Full template descriptions.
- Full task traceability.
- Full credit ledger.
- Advanced options.
- Provider/debug details.

Those details should move into Modal, Drawer, Bottom Sheet, or Lightbox surfaces, except for production editing, which belongs in the workbench's `制作视频` state.

## Overlay Types

### Template Detail Modal

Use when:

- User clicks a template card.
- User wants to inspect preview, cost, tags, output specs, and template suitability.

Behavior:

- Centered modal on desktop.
- Background is dimmed and blurred.
- Shows preview media, template summary, credit cost, duration, ratio, tags, and primary CTA.
- CTA opens the workbench's `制作视频` state with the selected template.

Do not:

- Put the full creation form inside the first detail modal.
- Show provider internals or traceability details here.

### Workbench Making State

Use when:

- User clicks `使用模板` from template detail.
- User resumes an unfinished draft.
- User needs to create videos for one or more products.

Behavior:

- Full page, not a modal-first workflow.
- Lives under the `工作台` navigation item rather than becoming a separate top-level page.
- Default visible surface for the first MVP template: current-template summary, one uploaded/selected image, and the generation command bar.
- Selling-point text appears only when the selected template requires it.
- Template switching, style choice, optional text inputs, and multi-product controls stay under `更多设置`.
- Bottom: persistent generation command bar with selected count, validation state, estimated credit freeze, and submit action.
- Keeps credit estimate and validation visible without turning the right side into a large static form.
- Advanced options remain collapsed.

Do not:

- Trap batch creation inside a modal or narrow drawer.
- Make the right side a permanent full-height billing/checklist panel.
- Keep a permanent context inspector in MVP if it competes with batch table space.
- Hide the primary generation action below supporting detail.
- Show all advanced fields at once if a template has many options.

### Task Detail Drawer

Use when:

- User clicks task detail.
- User wants to inspect output, refund state, or diagnostic information.

Behavior:

- Right drawer on desktop.
- Bottom sheet on mobile.
- User-facing summary appears first.
- Traceability and diagnostic details are collapsed under an advanced section.

Do not:

- Show raw provider payloads to normal users.
- Expose secret references, internal costs, or hidden abuse rules.

### Filter Bottom Sheet / Popover

Use when:

- User clicks gallery filter.

Behavior:

- Desktop can use a compact popover or side sheet.
- Mobile uses bottom sheet.
- Filters should be concise and reversible.

Do not:

- Keep a large permanent filter sidebar in MVP if it competes with templates.

### Credit / Recharge Modal

Use when:

- User clicks balance.
- User needs to buy credits.
- User needs to understand credit freeze/settle/release.

Behavior:

- Centered modal.
- Shows balance, recharge packages, and recent ledger rows.
- Prototype supports simulated package selection and simulated payment settlement.
- Payment flow can later continue to provider-hosted payment page.

### Account Modal

Use when:

- User reviews login/register options.
- User tests signup bonus behavior.
- Future QR login and third-party login surfaces need a place in the user flow.

Behavior:

- Shows login/register tabs.
- Shows QR login placeholder and third-party login actions.
- Registration can simulate signup bonus credit delivery.
- Production must connect this to abuse controls, identity verification, and activity reward rules.

### Media Lightbox

Use when:

- User previews generated output.
- User previews a template demo or before/after media.

Behavior:

- Centered full-media overlay.
- Background dimmed/blurred.
- Minimal controls: close, download/save when relevant.

## Navigation Model

User-facing main navigation should stay compact:

- `首页`
- `工作台`
- `模板`
- `任务`
- `我的`

`首页` is the public website homepage. It introduces the product, main use cases, registration bonus, template browsing, and entry into the workbench.

`工作台` is the logged-in production center. It summarizes quick starts, active tasks, credit state, recent assets, recommended templates, and risk/traceability reminders. It also owns the `制作视频` state after a user selects a template. It should not become an admin console and should not expose Agent or provider operations to normal users.

Optional internal-only entry:

- `视觉实验`

MVP user navigation should not expose admin/Agent operations.

## Accessibility Requirements

All modal/drawer/sheet overlays must:

- Use `role="dialog"`.
- Set `aria-modal="true"` for modal blocking surfaces.
- Provide a visible close button.
- Support `Escape` to close in implementation.
- Return focus to the triggering element in implementation.
- Lock background scroll in implementation.
- Avoid closing on accidental drag/scroll.

Prototype may simulate these behaviors visually, but production must implement them.

## Responsive Rules

Desktop:

- Template details: centered modal.
- Creation: full workbench `制作视频` state.
- Task details: right drawer.
- Filters: popover or drawer.

Mobile:

- Template details: near full-screen modal or bottom sheet.
- Creation: full-page responsive workbench making flow.
- Task details: bottom sheet.
- Filters: bottom sheet.

## Data and Traceability Rules

Opening an overlay should not lose context:

- Selected template id.
- Selected template version.
- Draft input state.
- Estimated credit cost.
- Open task id.

Analytics should track:

- Template card click.
- Template modal open.
- Workbench making state open.
- Credit confirmation.
- Generation submit.
- Task detail open.
- Filter open/apply.

## MVP Decision

Use lightweight pages plus overlays for MVP:

- Template cards open Template Detail Modal.
- `使用模板` opens the workbench `制作视频` state.
- Task rows open Task Detail Drawer.
- Balance opens Credit Modal.
- Filters open Bottom Sheet/Popover.
- Media previews open Lightbox.

This keeps the first product surface simpler while preserving enough detail for ecommerce users and future traceability.
