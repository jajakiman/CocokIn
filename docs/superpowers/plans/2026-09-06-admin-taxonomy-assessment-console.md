# Admin Taxonomy and Assessment Console Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Make PostgreSQL-backed skills, career benchmarks, and assessment questions editable from the Admin console and consumed by new assessments.

**Architecture:** Preserve the existing pure scoring function by passing it a database-loaded catalog instead of importing mutable data. Store question options as child rows, expose authorized read endpoints to assessment clients, and keep the current static constants only as seed input and failure-safe fallback during rollout.

**Tech Stack:** Next.js 16 App Router, React 19, Prisma 5/PostgreSQL, Zod 4, Vitest, Testing Library.

**Spec:** `PRD.md` FR-ADM-02 and `docs/DATA_STATE_MODEL.md`.

## Global Constraints

- Admin mutations require an authenticated `ADMIN` session and Zod validation.
- Existing assessment results remain immutable and reproducible.
- Question deactivation replaces destructive deletion after results may reference a question.
- Exactly one option per question must score `100`; every score is an integer from `0` to `100`.
- Runtime falls back to the checked-in catalog only when the database catalog is unavailable during rollout.

---

### Task 1: Persist taxonomy and assessment bank

**Files:**
- Modify: `prisma/schema.prisma`
- Create: `prisma/migrations/0007_admin_taxonomy_assessment/migration.sql`
- Modify: `prisma/seed.ts`

**Interfaces:**
- Produces: canonical `Career.key`, `Skill.key`, `AssessmentQuestionRecord`, and `AssessmentOptionRecord` rows.

- [ ] Add enums for assessment audience/type and normalized models with active flags and ordering.
- [ ] Add a non-destructive migration with unique keys and indexes.
- [ ] Upsert the four career catalogs and all checked-in questions/options from static seed input.
- [ ] Run `prisma format`, `prisma generate`, and `prisma validate`.

### Task 2: Load the mutable catalog at runtime

**Files:**
- Create: `src/modules/assessment/catalog.ts`
- Create: `src/modules/assessment/catalog.test.ts`
- Create: `app/api/assessment/catalog/route.ts`
- Modify: `src/components/talent/assessment-wizard.tsx`
- Modify: `src/modules/talent/career-readiness.ts`
- Modify: `app/api/talent/assessment/route.ts`
- Modify: `src/components/business/business-assessment-wizard.tsx`

**Interfaces:**
- Produces: `loadCareerAssessment(careerKey)` and `loadBusinessAssessment()` returning existing `AssessmentQuestion`-compatible data.

- [ ] Write failing tests for DB mapping and static fallback.
- [ ] Implement catalog loaders and authorized GET endpoint.
- [ ] Make both wizards load active database questions without adding client SDKs.
- [ ] Make talent score calculation use the same loaded question-to-skill mapping server-side.
- [ ] Run focused assessment tests.

### Task 3: Add authorized Admin mutations

**Files:**
- Create: `src/adapters/admin/taxonomy-actions.ts`
- Create: `src/adapters/admin/taxonomy-actions.test.ts`

**Interfaces:**
- Produces: `createSkillAction`, `updateCareerBenchmarkAction`, `saveAssessmentQuestionAction`, and `toggleAssessmentQuestionAction`.

- [ ] Write failing authorization and validation tests.
- [ ] Implement atomic upserts with audit events.
- [ ] Reject invalid benchmark ranges, duplicate keys, malformed options, and non-Admin callers.
- [ ] Run focused action tests.

### Task 4: Add the Admin console UI and verify

**Files:**
- Modify: `app/admin/page.tsx`
- Modify: `src/components/admin/admin-dashboard-view.tsx`
- Create: `src/components/admin/taxonomy-management-view.tsx`
- Create: `src/components/admin/taxonomy-management-view.test.tsx`

**Interfaces:**
- Consumes: persisted taxonomy/question rows and Task 3 server actions.

- [ ] Add a `Master Data` Admin tab with skill creation, benchmark editing, question editing, and active-state controls.
- [ ] Add visible action feedback and disable pending submissions.
- [ ] Run `corepack pnpm verify`.
- [ ] Review the diff for authorization, audit history, and migration safety.
- [ ] Commit locally to `dev` without pushing unless explicitly requested.
