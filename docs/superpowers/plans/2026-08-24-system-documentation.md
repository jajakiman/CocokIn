# CocokIn System Documentation Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Document CocokIn's end-to-end business flows, locked technical architecture, and independent data/state model for the developer team.

**Architecture:** Keep requirements in `PRD.md`, policies in `BUSINESS_RULES.md`, operational sequences in `BUSINESS_FLOW.md`, technology/runtime boundaries in `TECHNICAL_ARCHITECTURE.md`, and entities/transitions in `DATA_STATE_MODEL.md`. Cross-link them through `docs/README.md` and avoid duplicating policy formulas.

**Tech Stack:** Markdown, Mermaid, Next.js 16, React 19, TypeScript 5, Tailwind CSS 4, Auth.js 5, Prisma 7, PostgreSQL 17, Supabase Storage, Pusher Channels, Inngest, Resend, Gemini, Sentry, Vercel Git Integration.

**Spec:** `PRD.md` and `docs/BUSINESS_RULES.md`

## Global Constraints

- GitHub is source control only; GitHub Actions is not used.
- Vercel Git Integration creates preview and production deployments.
- CocokIn is not described as licensed escrow; real-money treasury mode remains disabled until the documented launch gates pass.
- Business flow diagrams reference existing `FR-*` and `BR-*` identifiers rather than redefining policy.
- Project, milestone, payment, infrastructure, warranty, maintenance, conversation, and dispute states remain independent.

---

### Task 1: Business Flow Documentation

**Files:**
- Create: `docs/BUSINESS_FLOW.md`

**Interfaces:**
- Consumes: functional requirements from `PRD.md` and policies from `docs/BUSINESS_RULES.md`.
- Produces: actor-oriented Mermaid flows and exception paths used by developers and QA.

- [ ] Document the lifecycle overview and actor responsibilities.
- [ ] Add Mermaid sequence diagrams for onboarding/matching, funding/delivery, infrastructure/handover, and support/dispute.
- [ ] Add trigger, precondition, state, financial effect, notification, and requirement references for each flow.
- [ ] Verify every financial statement points to `BR-FEE-*`, `BR-REV-*`, or `BR-HOV-*`.

### Task 2: Technical Architecture Documentation

**Files:**
- Create: `docs/TECHNICAL_ARCHITECTURE.md`
- Modify: `PRD.md`

**Interfaces:**
- Consumes: locked stack decisions from the approved design discussion.
- Produces: runtime boundaries, provider responsibilities, security constraints, deployment flow, and version baselines.

- [ ] Document the managed modular monolith and module boundaries.
- [ ] Document each selected technology, its responsibility, and what it must not own.
- [ ] Document GitHub + Vercel Git deployment without GitHub Actions.
- [ ] Align the PRD stack section and payment terminology with the locked decisions.

### Task 3: Data and State Documentation

**Files:**
- Create: `docs/DATA_STATE_MODEL.md`

**Interfaces:**
- Consumes: conceptual schema in `PRD.md` and invariants in `BUSINESS_RULES.md`.
- Produces: aggregate boundaries, entity ownership, transition guards, domain events, idempotency requirements, and money representation.

- [ ] Document aggregate and entity boundaries.
- [ ] Add transition tables for each independent state domain.
- [ ] Define domain events, idempotency keys, ledger rules, and database constraints.
- [ ] Cross-check all transitions against business rules.

### Task 4: Documentation Index and Verification

**Files:**
- Create: `docs/README.md`
- Modify: `PRD.md`

**Interfaces:**
- Consumes: all documentation artifacts.
- Produces: role-based reading paths and canonical ownership map.

- [ ] Add the docs index and reading order for developers, QA, UI/UX, and stakeholders.
- [ ] Add cross-links from PRD to all system documents.
- [ ] Scan for stale stack choices, GitHub Actions references, duplicate policy formulas, placeholders, and broken relative links.
- [ ] Run `git diff --check` and a PowerShell documentation assertion script.
