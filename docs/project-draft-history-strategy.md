# Projects, Drafts, and Generation History Strategy

Status: Draft proposal

This document defines how AIGC Web should handle creation drafts, generation history, reruns, and lightweight projects.

## Goals

- Let users return to unfinished creation forms.
- Let users view and reuse previous generation tasks.
- Let ecommerce users organize outputs without making the frontend too complex.
- Support "generate again" and "copy settings" workflows.
- Keep historical task records immutable and traceable.

## Principles

- GenerationTask history is immutable and auditable.
- Drafts are editable user work-in-progress.
- Projects should be lightweight in MVP.
- Do not force users to create a project before generating.
- Users should be able to restart from a previous task without editing the old task record.
- Saved assets and product profiles can reduce repeated input.

## Core Concepts

### Draft

A draft stores incomplete or not-yet-submitted creation input.

Use cases:

- User fills template but leaves before submit.
- User is prompted to log in and returns after login.
- User experiments with inputs before spending credits.

Suggested fields:

- id
- userId nullable before login
- anonymousSessionId nullable
- templateId
- templateVersionId
- formValues
- assetIds
- status: active | submitted | abandoned | deleted
- createdAt
- updatedAt
- expiresAt

Rules:

- Draft can be overwritten/edited.
- Draft submission creates a GenerationTask.
- Draft should not be treated as an auditable final generation record.
- Anonymous drafts can be linked to user after login if privacy policy permits.

### Generation History

A user's list of submitted tasks and outputs.

User should see:

- Template name.
- Status.
- Created time.
- Output preview if available.
- Credits spent/released.
- Failure/refund state.
- Actions: preview, download, save to asset library, report issue, generate again.

### Lightweight Project

A project groups related drafts, tasks, and assets.

MVP:

- Optional, can be implicit or delayed.

Future:

- Product campaign project.
- Store/brand project.
- Seasonal promotion project.
- Team project.

Suggested fields:

- id
- userId or workspaceId
- name
- description
- assetIds
- taskIds
- draftIds
- createdAt
- updatedAt

## User Actions

### Generate Again

From a completed or failed task, user can start a new draft using:

- Same template.
- Same submitted inputs.
- Same assets if still available.
- Same options.

Rules:

- New task must reference current or selected template version.
- Old task remains immutable.
- If old template version is unavailable, show a compatibility notice.
- If old assets expired/deleted, ask user to re-upload or choose from asset library.

### Copy Settings

Useful for ecommerce users making variants.

Examples:

- Same product, different style.
- Same product, different platform ratio.
- Same brand kit, different CTA.

### Save As Product Profile

After a successful task, user can save:

- Product images.
- Product name.
- Selling points.
- Target platform.
- Style.

This links generation history to product/workspace strategy.

## Login Interaction

Unauthenticated users may fill form before login.

Rules:

- Preserve draft locally/session-side.
- After login, attach draft to user.
- Do not lose uploads or form input.
- If uploads require login for storage/security, prompt login before upload or use temporary upload tokens.

## Retention

Drafts:

- Anonymous drafts: short retention, such as 24 hours to 7 days.
- Logged-in drafts: longer retention, such as 30 days.

Generation history:

- Metadata retained according to audit/business policy.
- Media availability depends on asset retention and whether user saved output to asset library.

Projects:

- Retained until user deletes, if implemented.

## Frontend UX

MVP:

- Task center / generation history.
- Draft preservation through login.
- Generate again from previous task.
- Save output to asset library.

Avoid:

- Complex project management UI.
- Required project creation.
- Heavy folder hierarchy in first version.

Possible later UI:

- "Recent creations"
- "Drafts"
- "Saved products"
- "Campaign projects"

## Data and Audit Rules

- Draft changes do not need full immutable audit.
- Submitted generation tasks do need immutable task/event/credit/provider/render records.
- Generate-again creates a new draft/task, not a mutation of the old task.
- Task history should store exact submitted parameters.

## Agent Role

Agents can:

- Convert a past task into a reusable template input suggestion.
- Help users regenerate with improved parameters.
- Detect abandoned draft patterns.
- Recommend product profile creation from repeated tasks.
- Summarize user generation history for support.

## MVP Requirements

Required:

- Task center / generation history.
- Preserve creation form through login.
- Basic draft persistence.
- Generate again from previous task.
- Save output to asset library.

Can be delayed:

- Full projects.
- Draft list page.
- Campaign-level organization.
- Team project sharing.
- Advanced version comparison.

## Open Questions

- Anonymous draft retention duration.
- Logged-in draft retention duration.
- Whether upload before login is allowed.
- Whether projects are hidden/implicit in MVP or not created yet.
- Whether generate-again uses latest template version or original version by default.

## Decision

Support drafts and generation history in MVP, but keep projects lightweight or deferred. Do not make project management a heavy frontend feature.
