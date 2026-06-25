# Agent Operating Model

Status: Draft decision

This document clarifies what "Agent-first" means in AIGC Web.

## Agent Types

### Development Agent

The coding/configuration agent that modifies this repository.

Responsibilities:

- Create and update code.
- Create and update template configs.
- Run tests and validation.
- Generate previews.
- Summarize implementation changes.
- Prepare release notes.

This is required from the beginning.

### Internal Operations Agent

An internal assistant or automation layer used by operators/admins.

Responsibilities:

- Diagnose failed tasks.
- Summarize provider errors.
- Prepare credit adjustment proposals.
- Analyze template performance.
- Recommend routing/pricing/fallback changes.

MVP can start with deterministic summaries and structured admin views. A full LLM-powered internal operations Agent is useful but not required for the first mock generation loop.

### User-Facing Agent

A product feature where end users chat with an assistant or ask it to create content.

This is not part of MVP.

## MVP Interpretation

When MVP documents say "Agent-assisted" or "Agent-first":

- Development work is expected to be Agent-driven.
- Admin/operation surfaces should expose structured records that an Agent can inspect.
- Internal diagnosis can begin as deterministic summaries generated from task events, provider attempts, credit ledger, and logs.
- High-risk actions still require human approval.
- The product does not need a public user-facing chat Agent.

## Implementation Guidance

Build data and APIs so Agents can work later:

- Structured task timelines.
- Structured credit ledger.
- Provider attempts.
- Render attempts.
- Audit logs.
- Template validation reports.
- Metrics and analytics.

## Safety Boundaries

Agents can prepare changes and recommendations, but production-impacting actions need clear controls:

- Agent-generated code/config/template changes must run validation before review.
- High-risk actions require human approval, including template publish, provider routing changes, payment settings, large campaigns, and manual credit adjustments.
- Agents work with secret references, not raw API keys.
- Agent outputs must not print secrets, private user data, full payment payloads, or hidden abuse thresholds.
- Agent-initiated production actions must be recorded in audit logs with actor, reason, input summary, and result.
- Failed or blocked Agent operations should create visible diagnostic records instead of silently retrying without limit.

Do not block MVP on:

- LLM-powered admin copilot.
- User-facing assistant.
- Autonomous operations.

## Decision

Agent-first means the system is designed for Agent-driven development and Agent-assisted operations. MVP can start with structured data and deterministic summaries; user-facing Agent features are out of scope.
