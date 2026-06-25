# Team, Organization, and Permission Strategy

Status: Draft proposal

This document defines how AIGC Web should reserve support for teams, organizations, shared assets, shared credits, and role permissions.

## Context

MVP can start with individual users. However, ecommerce creation often involves teams:

- Store owner.
- Ecommerce operator.
- Designer.
- Content creator.
- Customer service.
- Finance/payment owner.

The system should not assume every asset, credit account, task, and template interaction belongs only to one individual forever.

## Decision

MVP:

- Individual user accounts.
- Personal workspace.
- Personal asset library.
- Personal credit balance.

Architecture:

- Reserve `Workspace` as ownership boundary.
- Allow future team workspaces.
- Keep user-owned records compatible with workspace ownership.

## Principles

- Do not build complex team UI in MVP.
- Do not block future team/org support.
- Assets, tasks, brand kits, projects, and product profiles should eventually be workspace-scoped.
- Credit account can be user-scoped first, workspace-scoped later.
- Role-based permissions are required before shared workspaces launch.

## Workspace Ownership Model

Recommended long-term model:

- `User` is identity.
- `Workspace` is creation/business context.
- `WorkspaceMember` links users to workspaces.
- Assets, brand kits, product profiles, projects, and tasks can belong to workspace.

MVP simplification:

- Each user gets one personal workspace automatically.
- UI does not expose team management.

## Suggested Roles

Future team roles:

- owner
- admin
- creator
- viewer
- finance
- support

Permissions:

- Manage members.
- Manage brand kit.
- Upload/delete assets.
- Create generation tasks.
- View all workspace tasks.
- Download outputs.
- Spend workspace credits.
- Recharge credits.
- View credit ledger.
- Manage billing.

## Credit Ownership Options

### User Credits Only

Best for MVP.

Pros:

- Simpler.
- Lower permission complexity.

Cons:

- Teams cannot share credits.

### Workspace Credits

Future option.

Pros:

- Ecommerce teams can share a balance.
- Finance owner can recharge once for team.

Cons:

- Requires permissions, audit, spending limits.

### Hybrid

Future option:

- User personal credits.
- Workspace shared credits.
- Task chooses funding source.

More flexible but more complex.

## Data Model Direction

Suggested future entities:

- Workspace
- WorkspaceMember
- WorkspaceCreditAccount
- WorkspaceInvitation
- WorkspaceAuditLog

Existing entities should be ready for optional `workspaceId`:

- Asset
- BrandKit
- ProductProfile
- GenerationTask
- Draft
- Project
- CreditLedgerEntry, if workspace credits are added

## Permission Rules

Future shared workspace rules:

- Member can only access workspace assets/tasks if role allows.
- Spending shared credits requires permission.
- Manual credit adjustments require finance/admin role and audit.
- Removing a member should revoke future access but preserve historical audit.
- Download/share links should respect workspace permissions.

## Agent Role

Agents can:

- Summarize workspace usage.
- Recommend role setup.
- Detect unusual spending by member.
- Prepare member invitation/removal summaries.
- Diagnose workspace credit issues.

Agents should not:

- Add/remove members without approval.
- Grant access to assets without permission.
- Expose private workspace data across workspaces.

## MVP Requirements

Required:

- Use personal workspace concept internally or keep schema compatible with workspace ownership.
- Avoid hard-coding `userId` as the only future ownership boundary for every creation asset.
- Keep admin/audit logs ready for actor and owner context.

Can be delayed:

- Team workspace UI.
- Member invitations.
- Shared credits.
- Workspace billing.
- Role management.

## Open Questions

- Are ecommerce teams expected in first paid customer segment?
- Should shared credits exist?
- Should team members have spending limits?
- Should agencies manage multiple client workspaces?
- Should asset library and brand kit be workspace-scoped by default later?

## Decision

Start with personal accounts, but reserve workspace/team ownership in the architecture. Do not build team management UI in MVP.
