# CocokIn Foundation Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Deliver a production-shaped CocokIn tracer bullet with a shared responsive design system, real domain persistence/authorization/ledger, Pusher project chat, and simulated external financial operations until launch gates pass.

**Architecture:** Next.js modular monolith with PostgreSQL as source of truth. Domain modules expose small interfaces; provider SDKs live behind adapters. Pusher accelerates chat delivery, while treasury receives centrally only after legal/operational approval.

**Tech Stack:** Node 22 LTS, pnpm, Next.js 16, React 19, TypeScript 5, Tailwind CSS 4, Auth.js 5, Prisma 7, PostgreSQL 17, Pusher Channels, Supabase Storage, Inngest, Resend, Google Gemini, Sentry, Vitest, Testing Library, MSW, Playwright, Vercel Git Integration.

**Spec:** `PRD.md`, `docs/BUSINESS_RULES.md`, `docs/BUSINESS_FLOW.md`, `docs/DATA_STATE_MODEL.md`, `docs/TECHNICAL_ARCHITECTURE.md`, `design-system/cocokin/MASTER.md`

**Team workflow:** Ownership and interfaces were accepted through an online meeting. Development is committed directly to `dev`; Pull Requests are reserved for `dev -> main` production releases. See `docs/TEAM_WORKFLOW.md`.

## Global Constraints

- Real-money mode remains `SIMULATED` until every treasury launch gate passes.
- Seed/staging data is synthetic only and never copied from production.
- PostgreSQL is authoritative; Pusher does not store chat history.
- All UI uses Arctic Depths semantic tokens and the shared role-neutral shell.
- Mobile, tablet portrait/landscape, desktop, keyboard, reduced-motion, and 200% zoom are required checks.
- No GitHub Actions; run `pnpm verify` locally and use Vercel Git Integration.

---

### Task 1: Release 0 UI Foundation - Zaky

**Files:**
- Create: `package.json`, Next.js config files, `app/**`, `src/design-system/**`
- Test: `src/design-system/**/*.test.tsx`, `tests/e2e/responsive-shell.spec.ts`

**Interfaces:**
- Produces: `AppRole`, `RoleShellConfig`, semantic tokens, `AppShell`, `StatusBadge`, `MetricTile`, `ResponsiveDataView`.

- [ ] Scaffold Next.js 16, Tailwind 4, lint, typecheck, Vitest, Testing Library, and Playwright.
- [ ] Write failing component tests for semantic role navigation, touch targets, status labels, and mobile navigation.
- [ ] Implement Arctic Depths tokens and shared primitives.
- [ ] Implement responsive shell and synthetic Talent/UMKM/Admin preview dashboards.
- [ ] Run `pnpm verify` and responsive Playwright tests.

### Task 2: Identity and Persistence Foundation - Farid

**Files:**
- Create: `prisma/schema.prisma`, migrations, `src/modules/identity/**`, `src/lib/db/**`, `src/lib/money/**`, `src/lib/clock/**`
- Test: domain and integration tests under the same modules

**Interfaces:**
- Produces: authenticated session, `AppRole`, consent checks, ownership authorization, money/basis-point functions, audit append.

- [ ] Test consent, role, ownership, money rounding, and audit invariants first.
- [ ] Implement Auth.js database sessions and server-only authorization.
- [ ] Implement core Prisma schema, migration, and synthetic seed identities.
- [ ] Verify no seed command can target production.

### Task 3: Talent and Matching Slice - Zaky

**Files:**
- Create: `src/modules/talent/**`, `src/modules/matching/**`, Talent routes
- Test: matching and Talent vertical-flow tests

**Interfaces:**
- Produces: `CocokScoreResult { total, factors, reasons }`.

- [ ] Test deterministic matching factors and score bounds.
- [ ] Implement Talent profile, assessment, skill gap, and evidence model.
- [ ] Implement Talent marketplace views using shared responsive components.
- [ ] Provide text/table fallback for charts.

### Task 4: UMKM and Marketplace Slice - Rafi

**Files:**
- Create: `src/modules/business/**`, `src/modules/marketplace/**`, Business/project routes
- Test: project creation/application/selection tests

**Interfaces:**
- Consumes: `CocokScoreResult`, identity authorization.
- Produces: accepted application and versioned Project Agreement.

- [ ] Test project wizard guards, milestone total, duplicate application, and selection authorization.
- [ ] Implement Business readiness and project diagnosis with rule/template fallback.
- [ ] Implement project publication, application, comparison, selection, and agreement.

### Task 5: Pusher Project Chat - Rafi

**Files:**
- Create: `src/modules/chat/**`, `src/adapters/realtime/**`, Pusher auth route, chat UI patterns
- Test: chat domain, integration, and responsive E2E tests

**Interfaces:**
- Produces: durable `sendMessage`, scoped channel authorization, polling synchronization by sequence.

- [ ] Test participant authorization, persistence-before-publish, deduplication, reconnect, read-only, report, and reopen consent.
- [ ] Implement Pusher private/presence channels with server-side Auth.js authorization.
- [ ] Implement full messaging without live calls.
- [ ] Implement polling fallback and Pusher quota/unavailable UI.

### Task 6: Delivery and Review Hub - Rafi

**Files:**
- Create: `src/modules/delivery/**`, workspace/review/handover routes
- Test: submission/review/change/handover tests

**Interfaces:**
- Produces: `ApprovedMilestoneRelease { projectId, milestoneId, grossAmount, approvedAt, approvedBy }`.

- [ ] Test versioned staging submission and all review branches.
- [ ] Implement milestone workspace, Review Hub, formal Change Request, and handover.
- [ ] Ensure chat cannot call approval or financial mutations.

### Task 7: Simulated Treasury and Ledger - Farid

**Files:**
- Create: `src/modules/payments/**`, `src/adapters/payment/**`, Admin treasury routes
- Test: ledger, reference, reconciliation, reserve, payout, and refund tests

**Interfaces:**
- Consumes: `ApprovedMilestoneRelease`.
- Produces: independent funding, payout, refund, and reserve states.

- [ ] Test 5%/5% fee recognition, 90/10 payout, dual references, balanced ledger, and 100% coverage.
- [ ] Implement simulated bank/QRIS receipts and Finance reconciliation.
- [ ] Implement payout/refund proof and recipient confirmation.
- [ ] Block real-money adapter unless launch-gate configuration is satisfied.

### Task 8: Warranty, Maintenance, Dispute, and Admin - Farid

**Files:**
- Create: `src/modules/support/**`, `src/modules/disputes/**`, Admin routes
- Test: SLA, quota, decision, and financial-remedy tests

**Interfaces:**
- Consumes: delivery evidence and treasury states.
- Produces: retention eligibility and authorized payout/refund remedies.

- [ ] Test warranty classification, SLA, maintenance quota, dispute evidence immutability, and dual approval.
- [ ] Implement support and Admin operational queues.
- [ ] Implement reserve coverage alerts and compensating ledger entries.

### Task 9: Provider Replacement - Owner by Domain

**Files:**
- Create adapters for Supabase Storage, Resend, Inngest, Gemini, Sentry; keep realtime under Rafi and treasury under Farid.

- [ ] Add contract tests before replacing each simulated adapter.
- [ ] Send only sanitized, non-sensitive input to Gemini free tier.
- [ ] Keep all free-tier quotas observable and degrade noncritical features safely.
- [ ] Retain simulated adapters for local tests.

### Task 10: Cross-Role Verification - All

**Files:**
- Test: complete Playwright journeys and documentation assertions

- [ ] Run Talent -> UMKM -> Admin tracer-bullet journey.
- [ ] Test required viewports, keyboard, reduced motion, zoom, long content, and failure states.
- [ ] Run `pnpm verify` and `pnpm test:e2e`.
- [ ] Review Standards and Spec independently before merge.

## Ownership

- Zaky: Tasks 1 and 3; UI/accessibility review on all tasks.
- Rafi: Tasks 4-6; marketplace/chat/handover review.
- Farid: Tasks 2, 7, and 8; schema/security/financial review.
- All: Tasks 9-10 within owned providers and shared integration review.
