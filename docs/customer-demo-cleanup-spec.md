# Customer Demo Cleanup SPEC

Status: Implemented as the current customer-facing frontend cleanup baseline
Last updated: 2026-06-29

## 1. Purpose

The current site has a working frontend prototype, but it still exposes internal product, engineering, payment, risk, and traceability concepts that should not be visible to customers.

This SPEC defines the cleanup pass required before sharing the online demo with external users, customers, partners, or non-technical stakeholders.

Goal: make the website feel like a production product demo, not an internal prototype.

This pass should not remove backend-facing data models or future traceability capability. It should only change what is visible in the customer-facing UI.

## 0. Implementation Record

Implemented in the current frontend pass:

- Browser title changed to `AIGC Studio - 电商视频生成`.
- Main navigation changed to customer-facing labels: `首页`, `创作`, `模板`, `进度`, `我的`.
- Prototype/dev English eyebrow labels were removed or rewritten in the visible customer UI.
- Template detail no longer exposes protocol, version, workflow, pricing version, provider, idempotency, trace, or backend internals.
- Customer template shelf hides video-input templates until the video creation flow is ready.
- Creation flow is simplified to the first supported template type: upload/select one image, adjust output settings, submit, and keep working while generation continues in the background.
- Asset replacement opens the asset library grid with upload as the first item and category filters above the grid.
- Credit, login, upload, and task surfaces no longer expose manual simulation controls.
- Task details show customer-facing status, credit state, generation settings, result preview/download, and failure guidance without raw submitted parameters.
- Mobile cleanup added wrapping behavior for template type controls and asset picker controls to avoid clipped local content.

Verification completed:

- `npm run lint`
- `npm run build`
- Browser desktop audit across homepage, production desk, template shelf, template detail, filter sheet, creation studio, asset picker, task list/detail, credit drawer, auth modal, and account tabs.
- Browser mobile audit across homepage, template shelf/detail, production desk, creation studio, asset picker, task list/detail, and account page.
- Visible UI forbidden-term audit passed for the customer surfaces listed above.

## 2. Core Principle

Customer-facing pages should explain outcomes, progress, credit consumption, and next actions.

They should not expose:

- engineering identifiers;
- API/provider details;
- workflow internals;
- fraud and risk rules;
- payment callback simulation controls;
- prototype/dev terminology;
- disabled features that make the product look unfinished.

Traceability still matters, but customer UI should summarize it as order/generation records. Detailed logs belong to future support/admin surfaces.

## 3. Demo Audience

Primary demo audience:

- ecommerce sellers;
- ecommerce operators;
- brand/content teams;
- potential customers evaluating whether this can generate ecommerce videos quickly.

They should understand:

- what the product does;
- which template to choose;
- what to upload;
- how many credits it costs;
- where the result appears;
- whether failed tasks cost credits.

They should not need to understand:

- prompt packaging;
- template versioning;
- provider routing;
- idempotency keys;
- moderation record IDs;
- payment-order state machines;
- anti-abuse risk checks.

## 4. Global Cleanup Rules

### 4.1 Remove Prototype Language

Remove or rewrite all visible labels that imply internal prototype status:

- `Prototypes`
- `Prototype`
- `Demo`
- `Template Composer`
- `CURRENT SESSION`
- `TEMPLATE SHELF`
- `PRODUCTION DESK`
- `TASK MONITOR`
- `RESOURCE CENTER`
- `ASSET LIBRARY`
- `OUTPUT READY`
- English eyebrow labels that are not brand names.

Allowed:

- product name or brand name;
- concise Chinese functional labels;
- English only if it is an intentional brand/product term.

### 4.2 Hide Engineering Metadata

Do not show these in customer pages:

- template ID;
- template version;
- pricing version;
- workflow type;
- idempotency key;
- provider attempt;
- render attempt;
- moderation record;
- trace ID;
- ledger ID;
- request ID;
- asset internal ID;
- raw error code.

If needed, convert to user-facing language:

- `templateVersion` -> not shown;
- `idempotencyKey` -> not shown;
- `PROVIDER_502_RETRY_EXHAUSTED` -> `生成服务暂时异常，积分已退回`;
- `MODERATION_RIGHTS_REVIEW_BLOCKED` -> `素材需要重新确认授权，积分已退回`.

### 4.3 Hide Demo Control Buttons

The customer UI must not show buttons whose only purpose is to simulate backend events:

- `支付成功`
- `支付失败`
- `订单过期`
- `取消订单` when it directly simulates order callback state
- `已扫码`
- `确认登录`
- `拒绝登录`
- `设为过期`
- `推进状态`
- `失败释放积分`

If a state needs to be demonstrated, use realistic static sample data, not direct internal controls.

### 4.4 Keep User Actions Realistic

Allowed visible actions:

- upload/select image;
- choose template;
- preview;
- generate;
- view result;
- download result;
- reuse asset;
- recharge or create payment;
- cancel user-initiated upload;
- retry failed upload;
- login/register entry.

### 4.5 Hide Sensitive Risk/Abuse Details

Do not expose the exact anti-abuse logic in customer UI:

- device checks;
- IP checks;
- phone risk rows;
- payment behavior scoring;
- `薅羊毛`;
- threshold language;
- review/risk internals.

Customer-facing replacement:

- `注册赠送积分每个账号限领一次，活动规则以页面说明为准。`
- `为保障账户安全，部分活动可能需要完成手机号验证。`

## 5. Page Requirements

## 5.1 Browser Title and App Identity

Current issue:

- Browser title is `AIGC Studio Prototypes`.

Required:

- Replace with production-style title.

Acceptance:

- `document.title` does not contain `Prototype`, `Prototypes`, or `Demo`.
- Suggested temporary title: `AIGC Studio - 电商视频生成`.

## 5.2 Top Navigation

Current navigation is mostly acceptable:

- `首页`
- `生产台`
- `模板`
- `任务`
- `我的`

Required cleanup:

- Keep navigation concise.
- Consider renaming `任务` to `作品` or `记录` if the task page is simplified into user-facing generation records.
- Top credit pill can remain when treating the demo as logged-in.

Acceptance:

- No internal terminology in nav.
- Brand subtitle should not imply prototype status.

## 5.3 首页

Current issues:

- `AIGC TEMPLATE VIDEO` feels internal/temporary.
- `Template Composer` feels like a tool label, not a customer product surface.
- `后台化` is internal language.
- Showing exact current credits on public homepage may be confusing unless the demo assumes a logged-in user.
- Copy mentions model/prompt packaging in a slightly technical way.

Required:

- Make homepage read like a polished product entry.
- Explain value in customer terms: upload product image, choose template, generate ecommerce short video.
- Keep primary actions:
  - upload product image;
  - browse templates;
  - claim signup credits.
- Replace internal terms:
  - `后台化` -> `生成中可继续制作`;
  - `Template Composer` -> `生成示例`;
  - `模板自动编排` can stay if visually useful, but should not sound like developer language.

Acceptance:

- Homepage has no prototype/internal English labels.
- Homepage makes clear that one image can generate a video.
- Homepage does not expose backend, provider, audit, or traceability language.

## 5.4 生产台

Current issues:

- `PRODUCTION DESK` and `RECOMMENDED FLOW` are internal.
- `后台任务` is understandable but should be softened to `生成中`.
- Copy says `任务进入后台生成`, which is acceptable internally but can be more customer-friendly.

Required:

- Present as a user workspace for continuing creation.
- Keep:
  - new video entry;
  - generating items;
  - recent assets;
  - credit state;
  - recommended templates.
- Rewrite:
  - `后台任务` -> `生成中`;
  - `后台生成` -> `系统生成中，可继续制作`;
  - `第一版` -> remove.

Acceptance:

- No wording that suggests unfinished MVP.
- The page can be shown as an existing user workspace.

## 5.5 模板库

Current issues:

- `TEMPLATE SHELF` is internal.
- Template detail shows `模板协议`, version, pricing version, workflow, capabilities.
- Video templates expose `视频制作台建设中` and disabled `视频制作暂未开放`.
- `第一版主跑...` sounds internal.

Required:

- Template cards should help customers choose:
  - scenario;
  - input requirement;
  - expected output;
  - credit cost;
  - duration/ratio.
- Template detail should show:
  - preview media;
  - title;
  - suitable use case;
  - required input;
  - output format;
  - estimated credit cost;
  - expected generation time if available;
  - create button.
- Hide technical contract section from customer UI.
- Hide video-input templates from default public list until usable, or move them to a subtle `即将上线` section without a disabled production-looking CTA.

Acceptance:

- Template detail contains no `协议`, version string, pricing version, workflow type, or capabilities count.
- Default visible templates all have a credible user path.
- If upcoming templates are shown, they use customer wording such as `即将上线` and do not block the main flow.

## 5.6 创作台

Current issues:

- `CURRENT SESSION` is internal.
- `素材、参数、积分会写入同一任务链路` is too technical.
- `参数可追溯` is internal.
- `生成时会写入任务追溯记录` in advanced settings is internal.
- Duplicate task handling copy is okay functionally but should be simpler.

Required:

- Keep the image-only creation surface.
- Keep:
  - selected template;
  - image stage;
  - select/replace image;
  - preview/remove image;
  - advanced settings for ratio/duration/resolution/quality;
  - credit freeze preview;
  - generate button;
  - active generation status.
- Rewrite internal terms:
  - `CURRENT SESSION` -> `创作台`;
  - `任务链路` -> `生成记录`;
  - `参数可追溯` -> `已保存设置`;
  - `任务进入后台` -> `提交后自动生成，可继续制作`;
  - `后台生成中` -> `生成中`;
  - `后台任务` -> `生成中`.

Acceptance:

- Customer can understand the flow without reading technical traceability copy.
- Page still fits 1280 by 720 desktop after cleanup.
- Mobile has no horizontal overflow.

## 5.7 资产选择弹窗

Current issues:

- `ASSET LIBRARY` is internal English.
- `仅预览` is useful but may need softer explanation.
- Upload receipt may expose request/source internals if active.

Required:

- Keep asset picker grid.
- Keep upload as first grid item.
- Keep category filters.
- Keep selected state.
- For non-selectable videos, use `视频素材` / `不可用于当前模板` rather than ambiguous `仅可预览`.

Acceptance:

- Asset picker does not expose request IDs, source system wording, or backend trace language.
- The user understands which images can be selected.

## 5.8 任务 / 生成记录

Current issues:

- Page feels like an operations monitor.
- `TASK MONITOR`, `任务追踪`, `参数追溯`, `供应商尝试`, `积分流水` are too internal.
- Task rows show task IDs prominently.

Required:

- Convert customer-facing page to `生成记录` or `我的作品`.
- Show:
  - generating;
  - completed;
  - failed/refunded;
  - progress;
  - credit state;
  - output preview/download for completed items.
- Hide detailed IDs from row-level display unless needed in a support-friendly `订单号/记录号` area.

Acceptance:

- A customer sees their video generation history, not an engineering task monitor.
- No provider/render/moderation/internal parameter language on the list page.

## 5.9 任务详情

Current issues:

- Exposes technical parameter snapshot and traceability internals.
- Shows raw-ish failure code and retryability.
- Shows internal audit rows.

Required:

- Customer detail should include:
  - preview;
  - title;
  - status;
  - progress;
  - credit usage/refund status;
  - selected output settings: ratio, duration, resolution, quality;
  - result actions if successful;
  - friendly failure reason if failed.
- Hide by default:
  - template ID;
  - template version;
  - pricing version;
  - workflow;
  - input asset ID;
  - idempotency key;
  - provider attempts;
  - render records;
  - moderation records;
  - raw error code.

Optional:

- Add a collapsed `客服信息` section later, but not in this cleanup pass unless explicitly requested.

Acceptance:

- Task detail has no raw technical identifiers.
- Failed task clearly says credits were returned.
- Completed task emphasizes result preview, download, and asset library storage.

## 5.10 我的 / 资产库

Current issues:

- `RESOURCE CENTER` internal English.
- `供应商临时资源会转存后再进入资产库` is internal.
- Asset card source values such as `任务输出` are acceptable but can be friendlier.

Required:

- Keep asset management but make it customer-facing:
  - `我的资产`;
  - images/videos;
  - categories;
  - upload;
  - preview;
  - download;
  - reuse;
  - archive.
- Rewrite retention note:
  - `生成结果会自动保存到资产库，临期素材会提前提示。`

Acceptance:

- No provider wording.
- Asset library feels like a user-owned library, not internal storage.

## 5.11 积分中心

Current issues:

- Payment-order simulation controls are visible.
- Ledger rows show ledger IDs and references.
- Payment panel shows raw order ID details.

Required:

- Keep:
  - balance;
  - frozen credits;
  - recharge packages;
  - create payment button;
  - payment pending/success/failure state display if already present.
- Hide direct simulation controls:
  - `支付成功`;
  - `支付失败`;
  - `订单过期`;
  - direct callback controls.
- Ledger should show user-friendly records:
  - title;
  - amount;
  - time;
  - status;
  - short note.
- Hide:
  - ledger ID;
  - ref ID;
  - internal source labels if too technical.

Acceptance:

- Customers cannot manually simulate backend payment state.
- Ledger reads like a transaction history.

## 5.12 登录 / 注册

Current issues:

- QR state simulation controls visible.
- Risk checks and anti-abuse details visible.
- `薅羊毛`, device/IP checks, and threshold wording are not customer-facing.

Required:

- Keep:
  - login/register tabs;
  - QR login entry;
  - third-party login entry;
  - signup credits CTA.
- Hide:
  - scanned/confirmed/rejected/expired simulation buttons;
  - detailed risk-check cards;
  - internal anti-abuse copy.
- Replace with:
  - simple QR placeholder;
  - account security copy;
  - signup activity terms summary.

Acceptance:

- Login modal looks like a real login surface.
- No exposed anti-abuse strategy.

## 6. Copy Replacement Table

Use these replacements as the first cleanup pass:

| Current | Replace With |
| --- | --- |
| `AIGC TEMPLATE VIDEO` | `电商视频生成平台` |
| `Template Composer` | `生成示例` |
| `PRODUCTION DESK` | `我的生产台` |
| `RECOMMENDED FLOW` | `推荐流程` |
| `TEMPLATE SHELF` | `模板库` |
| `CURRENT SESSION` | `创作台` |
| `TASK MONITOR` | `生成记录` |
| `RESOURCE CENTER` | `我的空间` |
| `ASSET LIBRARY` | `资产库` |
| `OUTPUT READY` | `作品已生成` |
| `后台任务` | `生成中` |
| `后台生成` | `自动生成` |
| `任务链路` | `生成记录` |
| `参数可追溯` | `设置已保存` |
| `模板协议` | hide from customer UI |
| `供应商尝试` | hide from customer UI |
| `幂等键` | hide from customer UI |
| `价格版本` | hide from customer UI |
| `工作流` | hide from customer UI |
| `防止重复注册薅羊毛` | `每个账号限领一次，活动规则以页面说明为准` |
| `设备 / IP / 手机号风险` | hide from customer UI |

## 7. Implementation Plan

### Phase A: Copy and Label Cleanup

Files:

- `src/components/HomeView.tsx`
- `src/components/WorkbenchView.tsx`
- `src/components/TemplatesView.tsx`
- `src/components/StudioPage.tsx`
- `src/components/TasksView.tsx`
- `src/components/MeView.tsx`
- `src/components/AssetPicker.tsx`
- `src/components/UploadReceiptPanel.tsx`
- `index.html`

Actions:

- remove prototype/internal English labels;
- rewrite customer-facing copy;
- update browser title.

### Phase B: Hide Internal Panels and Controls

Files:

- `src/components/TemplatesView.tsx`
- `src/components/TaskDetail.tsx`
- `src/components/CreditPanel.tsx`
- `src/components/AuthPanel.tsx`
- `src/components/AccountPanel.tsx`

Actions:

- remove customer-visible template protocol panel;
- simplify task detail;
- hide payment simulation controls;
- hide QR simulation controls;
- hide signup risk-check cards;
- hide raw IDs and internal logs.

### Phase C: Demo Data Cleanup

Files:

- `src/prototypeData.ts`
- `src/viewModels.ts`

Actions:

- replace harsh/internal failure messages;
- soften asset source labels;
- remove visible risk copy;
- avoid raw-looking demo names if they appear in customer UI.

### Phase D: QA and Online Redeploy

Actions:

- `npm run lint`;
- `npm run build`;
- browser check desktop 1280 by 720:
  - home;
  - production desk;
  - template gallery;
  - template detail;
  - creation;
  - asset picker;
  - generation records;
  - task detail;
  - credits;
  - login/register;
  - my/assets.
- browser check mobile 390 by 844:
  - home;
  - template gallery;
  - creation;
  - generation records;
  - my/assets.
- grep visible-source strings for forbidden terms.
- commit and push.
- verify GitHub Pages URL after deployment.

## 8. Forbidden Term Checklist

The following terms must not appear in customer-visible UI after this pass:

- `Prototype`
- `Prototypes`
- `Demo`
- `CURRENT SESSION`
- `TEMPLATE SHELF`
- `PRODUCTION DESK`
- `TASK MONITOR`
- `RESOURCE CENTER`
- `ASSET LIBRARY`
- `Template Composer`
- `模板协议`
- `幂等键`
- `价格版本`
- `工作流`
- `供应商尝试`
- `渲染记录`
- `审核与兜底`
- `请求参数`
- `错误码`
- `trace`
- `provider`
- `idempotency`
- `设备`
- `IP`
- `薅羊毛`
- `支付成功` as a manual button
- `支付失败` as a manual button
- `确认登录` as a manual button
- `拒绝登录` as a manual button
- `推进状态`

Note: these terms can still exist in source code, API contracts, docs, and future admin surfaces. This checklist is for customer-visible UI.

## 9. Acceptance Criteria

This cleanup is complete when:

- The online page looks like a production customer demo.
- All main customer flows remain usable.
- Users can create from one product image without prompt writing.
- Users can browse templates without seeing internal template contracts.
- Users can view generation records without seeing engineering trace fields.
- Credits and frozen credits are understandable without payment simulation controls.
- Login/register surfaces look real enough for a customer demo.
- No forbidden customer-visible terms appear in rendered main flows.
- `npm run lint` passes.
- `npm run build` passes.
- Desktop and mobile browser checks have no horizontal overflow.
- GitHub Pages deployment succeeds.

## 10. Non-Goals For This Pass

Do not implement:

- real backend;
- real payment;
- real QR login;
- real provider calls;
- admin console;
- support console;
- full auth gating;
- new visual design system;
- new page architecture.

This pass is a customer-facing cleanup of the existing frontend prototype.
