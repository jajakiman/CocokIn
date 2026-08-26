# CocokIn Team Job Descriptions

> **Team shape:** Three equal full-stack engineers
> **Delivery model:** Vertical ownership with peer review
> **Status:** Accepted through online team meeting

## 1. Shared Working Agreement

Every owner delivers an end-to-end slice:

```text
Responsive UI -> server authorization -> domain behavior
-> PostgreSQL persistence -> audit/event -> automated tests -> documentation
```

Shared rules:

- Work uses GitHub Issues and direct task commits on `dev`; `main` is production and Pull Requests are only used for `dev -> main` releases.
- Each issue produces one independently testable result.
- Owners decide implementation inside their modules but cannot silently change shared interfaces.
- PostgreSQL is authoritative. UI state and provider events are projections/delivery mechanisms.
- Synthetic seed data only. Real account data needs purpose-specific consent and never enters seed/staging.
- `pnpm verify` is required before review; critical flows also run Playwright.
- All role UI follows `design-system/cocokin/MASTER.md`.

## 2. Zaky - Talent Experience and Design-System Owner

### Mission

Deliver one coherent, accessible, responsive product language and the full Talent growth journey from onboarding through verified evidence.

### Primary Domains

```text
Design System
Talent Profile
Career Readiness
Skill Gap
Deterministic Matching
Skill Passport
Verified Portfolio
Public/Marketing Experience
```

### Owned Paths

```text
design-system/cocokin/**
src/design-system/**
src/modules/talent/**
src/modules/matching/**
app/(marketing)/**
app/(onboarding)/talent/**
app/(dashboard)/talent/**
```

### Deliverables

#### ZAKY-01 Shared UI Foundation

- Arctic Depths semantic tokens.
- Plus Jakarta Sans typography and Phosphor icon rules.
- Shared `AppShell` for Talent, UMKM, and Admin.
- Mobile top/bottom navigation, tablet rail, desktop collapsible sidebar.
- Shared components: `PageHeader`, `StatusBadge`, `MetricTile`, `StepProgress`, `ErrorSummary`, `EmptyState`, `ResponsiveDataView`, `MoneyBreakdown`, and `AuditTimeline` presentation.
- Development-only design-system catalog route.

**Done when:** all three role preview dashboards use the same shell and tokens at 320, 375, 768, 1024, and 1440px; keyboard, reduced motion, and 200% zoom checks pass.

#### ZAKY-02 Talent Onboarding and Consent UI

- Talent profile, career target, declared skills, availability, and work mode.
- Assessment wizard with autosave, Back, error summary, and resume.
- Required Terms/Privacy consent UI and separate optional portfolio/marketing consent UI.

**Done when:** a synthetic Talent can complete/resume onboarding on mobile and desktop without data loss; consent purposes remain separate.

#### ZAKY-03 Career Readiness and Skill Gap

- Technical and soft-skill assessment presentation.
- Readiness score, benchmark comparison, and major skill-gap output.
- Accessible text/table alternatives for every visualization.

**Done when:** deterministic fixtures produce the same displayed score and accessible summary across viewport variants.

#### ZAKY-04 Cocok Score Module

- Authoritative deterministic formula: skill 40%, career 20%, availability 15%, experience 15%, work mode 10%.
- Factor reasons and missing-evidence behavior.
- `CocokScoreCard` shared with Rafi's applicant review.

**Done when:** unit tests cover 0/100 bounds and every factor; Rafi consumes the exported result without duplicate calculations.

#### ZAKY-05 Skill Passport and Portfolio

- Evidence-level UI and verified project evidence.
- Private portfolio draft, publication consent, public/unlisted/private visibility.
- Public Passport and OG-image presentation without financial/chat/private data.

**Done when:** project completion alone cannot publish; publication requires Talent consent and UMKM attribution approval.

### Required Reviews

- Reviews every design-system or shared responsive-component change.
- Reviews Rafi's workspace/chat responsive behavior.
- Reviews Farid's financial/Admin UI for clarity and accessibility, not financial correctness.

### Out of Scope

- Zaky does not approve applicants, change project lifecycle, reconcile funds, or define treasury rules.

## 3. Rafi - UMKM Marketplace, Delivery, and Chat Owner

### Mission

Deliver the complete collaboration journey connecting an UMKM to one selected Talent, from business diagnosis through handover and support communication.

### Primary Domains

```text
UMKM Profile and Readiness
Problem-to-Project Diagnosis
Marketplace and Applications
Project Agreement
Milestone Delivery
Pusher In-App Chat
Review Hub
Infrastructure and Handover
Digital Growth
```

### Owned Paths

```text
src/modules/business/**
src/modules/marketplace/**
src/modules/delivery/**
src/modules/chat/**
src/modules/infrastructure/**
src/adapters/realtime/**
app/(onboarding)/business/**
app/(dashboard)/business/**
app/(dashboard)/projects/**
app/api/realtime/**
```

### Deliverables

#### RAFI-01 UMKM Onboarding and Digital Readiness

- Business profile, verification request, and five-pillar readiness assessment.
- Nontechnical language and progressive disclosure.
- Readiness baseline consumed by Digital Growth.

**Done when:** synthetic UMKM completes/resumes onboarding and produces a persisted five-pillar result; verification decision remains Farid's Admin responsibility.

#### RAFI-02 Problem-to-Project and Project Creation

- Rule/template fallback and sanitized Gemini-assisted draft.
- Scope, skills, difficulty, deadline, infrastructure need, one-to-four milestones, acceptance criteria, and Service Value.
- Draft autosave and exact 100% milestone-weight guard.

**Done when:** a project can publish without Gemini; invalid milestone totals and missing criteria fail server-side and focus the UI error summary.

#### RAFI-03 Application, Comparison, and Selection

- Talent application and duplicate guard.
- Responsive applicant comparison using Zaky's `CocokScoreResult`.
- Talent selection and versioned Project Agreement.

**Done when:** only an authorized UMKM owner can select; accepted application creates the conversation but does not imply funding.

#### RAFI-04 Project-Scoped Pusher Chat

- Durable PostgreSQL messages before Pusher broadcast.
- Private/presence channel authorization through Auth.js membership checks.
- Text, attachment, voice note, reply, reaction, typing, presence, receipt, unread, search, report, system message, reconnect, and polling fallback.
- Read-only closure and UMKM reopen request requiring Talent consent.

**Done when:** a Pusher outage/limit does not lose or block messages; an unrelated user cannot subscribe; chat cannot invoke agreement/review/payment mutations.

#### RAFI-05 Milestone Workspace and Review Hub

- Versioned staging submission and evidence.
- UMKM decisions: approve, revision, changed scope, dispute.
- Auto-review timer pause when staging is unavailable.
- Export `ApprovedMilestoneRelease` only after valid approval.

**Done when:** every branch has authorization/state tests and immutable history; Farid can consume the release without reading Rafi's persistence internals.

#### RAFI-06 Infrastructure and Handover

- Managed-hosting-first recommendation and explicit VPS rationale.
- Domain/hosting ownership, HTTPS, mobile, Admin access, documentation, backup/export, recurring-cost, warranty, and maintenance checklist.
- Digital Growth reassessment trigger.

**Done when:** handover cannot complete with missing applicable evidence; credentials never enter ordinary chat/submission fields.

### Required Reviews

- Reviews every marketplace, application, project-state, delivery, chat, and handover change.
- Reviews Zaky's matching interface from the applicant-review consumer perspective.
- Reviews Farid's funding status interface from the project-lifecycle consumer perspective.

### Out of Scope

- Rafi cannot calculate authoritative Cocok Score, recognize fees, reconcile cash, approve payout/refund, or edit ledger history.

## 4. Farid - Platform Trust and Financial Operations Owner

### Mission

Deliver the secure platform foundation and all high-risk identity, persistence, treasury, support, dispute, Admin, and deployment capabilities.

### Primary Domains

```text
Auth and Authorization
Consent Persistence
Prisma/PostgreSQL Governance
Treasury and Liability Reserve
Funding Reconciliation
Payout and Refund
Warranty and Maintenance
Dispute and Admin Operations
Background Jobs
Provider Configuration
Security, Observability, Deployment
```

### Owned Paths

```text
src/modules/identity/**
src/modules/payments/**
src/modules/support/**
src/modules/disputes/**
src/modules/notifications/**
src/lib/db/**
src/lib/money/**
src/lib/clock/**
src/adapters/payment/**
prisma/**
app/(dashboard)/admin/**
app/api/** (except Rafi-owned realtime routes)
```

### Deliverables

#### FARID-01 Identity, Consent, and Authorization

- Auth.js database sessions, role propagation/revocation, suspension.
- Server-side role, ownership, consent, verification, and state guards.
- Append-only purpose-specific Consent records.

**Done when:** UI navigation is never the security boundary; unauthorized cross-role/resource mutations fail integration tests.

#### FARID-02 Database and Migration Governance

- Prisma schema, migration process, indexes, constraints, database client, backup/restore process.
- Synthetic seed guard that refuses production.
- Migration review for all owners.

**Done when:** schema invariants from `DATA_STATE_MODEL.md` are enforced by constraints/domain transactions and a clean database can migrate/seed deterministically.

#### FARID-03 Simulated Funding and Reconciliation

- Bank-transfer default and GoPay Merchant QRIS optional instructions.
- Unique Platform/External References.
- Proof, Finance reconciliation, mismatch/unmatched queue.
- Real-money adapter hard-disabled until all launch gates are evidenced.

**Done when:** proof alone cannot fund; duplicate references and amount mismatch fail closed; simulated funding activates a project through the published interface.

#### FARID-04 Ledger and 100% Reserve

- Double-entry ledger for Cash, Talent Payable, UMKM Refundable, Fee Pending/Earned, and transaction costs.
- Activation Fee 5%, Success Fee 5%, milestone payout 90%, retention 10%.
- Coverage ratio and operational-withdrawal guard.

**Done when:** property/boundary tests prove balanced groups, no over-payout/refund, and coverage never falls below 100%.

#### FARID-05 Payout and Refund

- Consume Rafi's `ApprovedMilestoneRelease`.
- Payout instruction, proof, Talent confirmation, and mismatch handling.
- Ledger-calculated refund breakdown and UMKM confirmation.
- Cost policy: payout borne by CocokIn; refund borne by UMKM except CocokIn fault.

**Done when:** neither UI nor Admin can type an arbitrary refund/payout amount; every completed movement has both references and an audit event.

#### FARID-06 Warranty, Maintenance, and Dispute

- Warranty SLA, severity, retention eligibility, maintenance 30-day/five-ticket quota.
- Immutable dispute evidence, Admin decision, dual approval, and compensating entries.
- Chat-report Admin access audit.

**Done when:** unresolved valid tickets freeze only affected retention and Admin corrections append rather than mutate history.

#### FARID-07 Platform Operations

- Inngest schedules, Resend email, sanitized Gemini API setup, Sentry scrubbing, Supabase projects/storage, Vercel environments.
- Free-tier quota visibility and degradation rules.
- Local `pnpm verify`, Vercel Git deployment, no GitHub Actions.

**Done when:** provider outage/quota behavior is documented/tested and secrets never enter browser, logs, seed, or repository.

### Required Reviews

- Reviews every schema, migration, Auth, consent, financial, support, dispute, Admin, provider, and deployment change.
- Reviews Rafi's approved-release interface and Zaky's consent-facing UI.

### Out of Scope

- Farid cannot select Talent, approve delivery criteria, calculate Cocok Score, or redefine design-system semantics alone.

## 5. Shared Interfaces

### Zaky -> Rafi: Matching

```typescript
type CocokScoreResult = {
  total: number;
  factors: {
    skill: number;
    career: number;
    availability: number;
    experience: number;
    workMode: number;
  };
  reasons: string[];
};
```

### Rafi -> Farid: Approved Release

```typescript
type ApprovedMilestoneRelease = {
  projectId: string;
  milestoneId: string;
  grossAmount: bigint;
  approvedAt: Date;
  approvedBy: string;
};
```

### Farid -> Rafi: Funding Projection

```typescript
type FundingStatus =
  | "AWAITING_PAYMENT"
  | "PROOF_SUBMITTED"
  | "RECONCILIATION_PENDING"
  | "FUNDED"
  | "AMOUNT_MISMATCH"
  | "UNMATCHED"
  | "REFUND_PENDING"
  | "REFUNDED";
```

### Zaky -> All: Shared UI

```typescript
type AppRole = "talent" | "business" | "admin";
type Density = "comfortable" | "standard" | "dense";
```

## 6. Delivery Order and Parallel Work

### Approved Ownership and Interfaces

Ownership, shared interfaces, and review gates in this document were approved through the online team meeting and are the baseline for implementation.

### Phase 1 - Foundation

- Zaky: design tokens, shared shell, responsive role previews.
- Farid: test/database/Auth/consent foundation.
- Rafi: business/marketplace/delivery contracts and responsive prototypes using Zaky's interfaces.

Merge order: tokens/interfaces -> shell/Auth contracts -> role foundations.

### Phase 2 - Role Cores

- Zaky: Talent onboarding, assessment, skill gap.
- Rafi: UMKM onboarding, readiness, project draft.
- Farid: persistent identity, consent, verification Admin flow.

These run in parallel after Phase 1 interfaces are green.

### Phase 3 - Marketplace

- Zaky: matching module and Talent catalog.
- Rafi: project creation, application, comparison, selection, agreement.
- Farid: authorization/audit support and schema review.

### Phase 4 - Collaboration and Funding

- Zaky: shared financial/consent components and accessibility review.
- Rafi: project chat and workspace.
- Farid: simulated funding, reconciliation, references, reserve, Activation Fee.

### Phase 5 - Delivery and Settlement

- Zaky: verified evidence and portfolio draft.
- Rafi: submission, Review Hub, Change Request, handover.
- Farid: payout, retention, Success Fee, refund.

### Phase 6 - Trust and Completion

- Zaky: public Passport and final UI audit.
- Rafi: Digital Growth and conversation reopen/support UX.
- Farid: warranty, maintenance, dispute, treasury/Admin operations.

### Phase 7 - Integration QA

All run the Talent -> UMKM -> Admin tracer bullet, required viewport matrix, accessibility checks, provider degradation, security, and treasury invariant verification.

## 7. GitHub Issue Naming

Use owner prefixes in GitHub Issue titles:

```text
[Zaky] Shared Arctic Depths shell
[Rafi] Versioned milestone Review Hub
[Farid] Liability reserve ledger
[Shared] Talent-to-UMKM tracer bullet
```

Every issue includes:

- Owner and required reviewer.
- Consumed/produced interface.
- User-visible outcome.
- Authorization and audit behavior.
- Responsive targets where UI exists.
- Exact verification commands.
- Blocking issue links.

## 8. Current Implementation State

Team planning is accepted and implementation may follow the documented phase order. Release 0 scaffold configuration and failing design-system tests exist locally; the expected RED state is missing `role-config`, `StatusBadge`, and `AppShell` modules. Keep shared `dev` green by implementing these modules before pushing the scaffold.
