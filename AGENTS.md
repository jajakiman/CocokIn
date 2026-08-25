# CocokIn Agent Guide

## Product Sources

- Read `docs/TEAM_WORKFLOW.md` before starting, committing, pushing, resolving conflicts, or preparing a release.
- Read `CONTEXT.md` for canonical domain language.
- Read `PRD.md` for product requirements.
- Read `docs/BUSINESS_RULES.md` before changing payment, milestone, warranty, refund, or consent behavior.
- Read `docs/DATA_STATE_MODEL.md` before changing state transitions or persistence.
- Read `design-system/cocokin/MASTER.md` before changing product UI.

## Agent Skills

### Issue Tracker

Work is tracked in GitHub Issues for `jajakiman/CocokIn`. See `docs/agents/issue-tracker.md`.

### Triage Labels

Use the default workflow labels. See `docs/agents/triage-labels.md`.

### Domain Docs

This is a single-context repository using root `CONTEXT.md` and system ADRs in `docs/adr/`. See `docs/agents/domain.md`.

## Engineering Rules

- Build vertical slices through UI, authorization, domain logic, persistence, audit, and tests.
- Keep provider SDKs behind adapters; domain modules do not import Next.js, React, or provider SDKs.
- PostgreSQL is the source of truth. Pusher accelerates chat delivery but never stores authoritative messages.
- Use synthetic seed data only. Real user data requires purpose-specific consent and never enters seed/staging.
- Financial changes require Farid plus one peer reviewer. Design-system changes require Zaky. Marketplace/delivery/chat changes require Rafi.
- No GitHub Actions. Run `pnpm verify` locally and use Vercel Git Integration for preview/production builds.
- Use only `dev` for development and `main` for production. Commit tasks directly to `dev`; Pull Requests are only `dev` to `main` releases.

## Team Ownership

- **Zaky:** Talent, matching, design system, responsive UI, accessibility.
- **Rafi:** UMKM, marketplace, delivery, Pusher chat, handover.
- **Farid:** identity, database, treasury, payout/refund, support, Admin, deployment.
