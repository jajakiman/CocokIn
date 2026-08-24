# CocokIn Business Rules

> **Version:** 1.0  
> **Applies to:** CocokIn PRD v1.2  
> **Status:** Approved product policy baseline

This document is the source of truth for project delivery, protected funding, fees, infrastructure, handover, warranty, maintenance, cancellation, and dispute rules. Product scope and functional requirement IDs remain in [`../PRD.md`](../PRD.md).

---

## 1. Definitions

| Term | Definition |
|---|---|
| Service Value | Gross value of Talent services agreed for a project, excluding third-party infrastructure, payment gateway costs, and taxes. |
| Third-Party Cost | Domain, hosting, VPS, database, storage, email, license, or external SaaS cost paid directly by the UMKM. |
| Milestone | A bounded delivery unit with a value weight, deadline, deliverables, and measurable acceptance criteria. |
| Submission | A versioned delivery of a milestone for UMKM review. |
| Handover | Transfer of the approved production result, ownership, access, documentation, and operational information to the UMKM. |
| Warranty | Free correction of valid defects against the agreed scope and production baseline for 30 calendar days. |
| Maintenance | Optional paid operational assistance for 30 calendar days with a maximum of five tickets. |
| Retention | Ten percent of Service Value withheld temporarily as warranty assurance. It is not a CocokIn fee. |
| Business Day | Monday through Friday, excluding Indonesian national public holidays. |

---

## 2. Commercial Model

### BR-FEE-01 — Fee Basis

Platform fees apply only to Service Value that is successfully released to Talent.

```text
UMKM service fee   = released Service Value × 6%
Talent service fee = released Service Value × 4%
CocokIn take rate  = released Service Value × 10%
Talent net payout  = released Service Value × 96%
```

The following are excluded from the platform-fee basis:

- Domain, hosting, VPS, managed database, storage, email, plugins, and licenses.
- Payment gateway or disbursement charges.
- Taxes required by applicable regulation.
- Refund amounts and unfunded project value.

### BR-FEE-02 — Fee Timing

- Fees become earned only when the corresponding service funds are released.
- Partial release calculates both fees from the released amount only.
- Refunded service value does not generate a Talent fee or final CocokIn revenue.
- Ninety percent of an approved milestone and its ten-percent retention are separate releases of the same milestone value; no amount is charged twice.

### BR-FEE-03 — Worked Example

For a Service Value of `Rp2.000.000`:

```text
UMKM
Service Value                         Rp2.000.000
UMKM service fee (6%)                   Rp120.000
Payment gateway cost                    Shown separately

Talent
Gross Service Value                   Rp2.000.000
Talent service fee (4%)                  Rp80.000
Total net payout                      Rp1.920.000

CocokIn
UMKM fee                                Rp120.000
Talent fee                               Rp80.000
Total revenue                           Rp200.000
```

---

## 3. Project Agreement and Funding

### BR-AGR-01 — Agreement Before Funding

Before the UMKM funds a project, both parties must approve a Project Agreement Summary containing:

- Scope, exclusions, and deliverables.
- One to four milestones and their percentage weights.
- Acceptance criteria for every milestone.
- Deadlines and review window.
- Service Value and transparent fee breakdown.
- Staging and production expectations.
- Domain and hosting ownership.
- Maintenance inclusion or exclusion.
- Warranty, retention, cancellation, and dispute terms.

Any post-funding scope addition must use a Change Request. Chat messages alone cannot change scope, value, or deadline.

### BR-AGR-02 — Milestone Constraints

- A project must contain between one and four milestones.
- Milestone weights must total exactly 100%.
- A milestone must have at least one measurable acceptance criterion.
- Each criterion must describe an observable business result, not only an implementation technology.
- A funded milestone cannot change value, deadline, or criteria without approval from both parties.

### BR-PAY-01 — Protected Project Funding Boundary

- Project funding, payout, and refund use a licensed marketplace payment provider.
- CocokIn stores provider transaction references and an immutable internal ledger.
- CocokIn does not store card data, banking credentials, or user funds directly.
- Payment and identity verification requirements follow provider and applicable regulatory rules.

---

## 4. Milestone Delivery

### BR-SUB-01 — Required Submission

Every staging submission must contain:

- An HTTPS Preview URL.
- A nontechnical result summary for the UMKM.
- Completion state for each acceptance criterion.
- Step-by-step review instructions.
- Submission screenshots.
- Demo account instructions when authentication is required.
- Submission timestamp and immutable version number.

Repository URL, commit SHA, and CocokIn-hosted CI/CD are not required in the current product scope.

### BR-SUB-02 — Staging Validity

- The Preview URL must be reachable without software installation.
- The staging environment must not contain real customer personal data.
- Credentials supplied for review must be demo-only and must not expose production secrets.
- Talent must not change a submitted version during review. A change creates a new submission version.
- If staging becomes unavailable, the review countdown pauses until a valid version is restored.
- CocokIn records availability checks and submission screenshots as dispute evidence.

### BR-REV-01 — Review Decisions

The UMKM may choose:

| Decision | Use when |
|---|---|
| `APPROVED` | All agreed acceptance criteria are satisfied. |
| `REVISION_REQUESTED` | An agreed criterion is not satisfied. |
| `CHANGE_REQUESTED` | The UMKM wants an output outside the agreed scope. |
| `DISPUTED` | The parties disagree about fulfillment, responsibility, or payment. |

A revision request must identify the unmet criterion and provide an explanation. A new feature cannot be disguised as a revision.

### BR-REV-02 — Review Window

- The default review window is 3×24 hours after a valid submission becomes ready for review.
- CocokIn sends reminders before the deadline.
- A complete submission without an active dispute may be auto-approved after the review window.
- Unavailable staging, an incomplete submission, or a declared dispute prevents auto-approval.
- An Admin may reverse an abusive auto-approval only through a documented dispute decision and compensating ledger entry.

### BR-REV-03 — Milestone Release

Approval of a milestone releases its payable portion and accumulates project warranty retention:

```text
Milestone gross value = Service Value × milestone weight
Immediate gross release = milestone gross value × 90%
Warranty retention = milestone gross value × 10%
Immediate Talent net = immediate gross release × 96%
```

The final milestone follows the same calculation after production handover is accepted. Accumulated retention across all milestones equals 10% of total Service Value.

---

## 5. Infrastructure and Production

### BR-INF-01 — Recommendation Order

CocokIn recommends infrastructure in this order:

1. `STAGING_ONLY` when production is outside scope.
2. `MANAGED_HOSTING` for static sites and supported applications.
3. `SHARED_HOSTING` for compatible WordPress, PHP, or conventional CMS projects.
4. `EXISTING_INFRASTRUCTURE` when the UMKM already owns a compatible service.
5. `VPS` only when the application requires server-level control unavailable from managed services.

A VPS recommendation must state why managed hosting is insufficient, recurring cost, backup ownership, security-update ownership, monitoring responsibility, and post-handover support.

### BR-INF-02 — Ownership and Billing

- Domain and production infrastructure accounts must be owned by the UMKM.
- Registration identity, billing email, and renewal payment method belong to the UMKM.
- Talent receives collaborator or time-limited technical access where supported.
- Passwords, API keys, recovery codes, and private keys must not be sent through CocokIn chat or ordinary submission fields.
- Talent may assist configuration but may not retain exclusive ownership after handover.

### BR-INF-03 — Purchasing and Fees

- The UMKM buys third-party infrastructure directly from its provider.
- Third-party prices are shown as estimates unless a provider has returned a current binding quote.
- Third-party costs are not deposited into Talent escrow and do not incur CocokIn platform fees.
- Domain purchases should occur after the Project Agreement is approved to reduce name-availability risk.
- Hosting may be purchased closer to production deployment when no earlier environment is required.

---

## 6. Production Handover

### BR-HOV-01 — Required Checklist

Handover cannot be accepted until all applicable items pass:

- Production URL is reachable.
- Domain points to the production service.
- HTTPS is active.
- Critical functionality and mobile layout pass review.
- The UMKM owns domain, hosting, and billing accounts.
- The UMKM has received the required owner or administrator role.
- Usage documentation is available.
- An initial backup or export is available where applicable.
- Recurring costs and renewal dates are disclosed.
- Warranty scope and start date are confirmed.
- Maintenance inclusion or exclusion is confirmed.

Non-applicable checklist items must include a reason; they cannot be silently omitted.

### BR-HOV-02 — Handover Payment

When handover is accepted:

```text
Final milestone gross value = Service Value × final milestone weight
Immediate final release     = final milestone gross value × 90%
Final retention addition    = final milestone gross value × 10%
Total accumulated retention = Service Value × 10%
```

Earlier approved milestones have already released their respective 90% portions. Handover acceptance releases the final milestone portion, starts the 30-calendar-day warranty clock, and schedules the accumulated retention. Project delivery may become `COMPLETED` while warranty, retention, and maintenance continue under separate states.

---

## 7. Bug Warranty

### BR-WAR-01 — Coverage

Warranty is free for 30 calendar days from accepted handover. A ticket is valid warranty when all conditions are true:

- The affected behavior is inside the approved scope or acceptance criteria.
- The behavior differs from the production baseline accepted at handover.
- The issue is reproducible in the agreed production environment.
- The issue was not caused by the UMKM, another contractor, provider outage, expired service, or an unapproved infrastructure change.

Warranty does not include new features, redesign, routine content changes, traffic-driven scaling, provider incidents, third-party API changes, expired services, or damage from another party.

### BR-WAR-02 — Ticket Evidence

A warranty ticket must include:

- Affected feature and linked acceptance criterion.
- Reproduction steps.
- Expected and actual behavior.
- Screenshot or video when relevant.
- First-observed time and business impact.

### BR-WAR-03 — SLA

- Talent must acknowledge and classify a complete ticket within two Business Days.
- The repair target begins after the ticket is complete and classified as valid warranty.

| Severity | Definition | Repair target |
|---|---|---:|
| Critical | Production or a primary business transaction cannot be used. | 1 Business Day |
| Major | An important function is impaired but a reasonable workaround exists. | 3 Business Days |
| Minor | A noncritical functional or visual defect. | 5 Business Days |

Talent and UMKM may agree to a new deadline when the reason and date are recorded in the ticket.

### BR-WAR-04 — Retention Release

- Retention is released automatically at the end of day 30 when no valid unresolved ticket or active dispute exists.
- A ticket opened before expiry may keep retention held only while it remains valid and unresolved.
- An out-of-scope ticket cannot extend retention.
- Talent service fee on retention is charged only when that retained amount is released.
- A refund or alternate-Talent payment from retention requires an Admin dispute decision.

### BR-WAR-05 — SLA Breach

An SLA breach triggers a reminder followed by a one-Business-Day grace period. If unresolved, CocokIn freezes retention and opens a warranty dispute. Admin may extend the deadline, release retention, partially release it, refund it, or allocate it to an approved replacement Talent based on evidence.

---

## 8. Paid Maintenance

### BR-MNT-01 — Package

- Maintenance is optional and paid separately from the original project.
- A package lasts 30 calendar days.
- A package includes at most five small operational tickets.
- Unused tickets expire and do not roll over.
- The same 6% UMKM and 4% Talent platform fees apply to released maintenance Service Value.
- Warranty retention does not apply to a maintenance package.

### BR-MNT-02 — Ticket Boundary

One maintenance ticket has one small operational objective, such as changing contact details, updating limited catalog content, checking a backup, or assisting with a simple configuration.

The following require a Change Request or new project:

- A new page, role, workflow, integration, or payment method.
- Database restructuring or major data migration.
- Hosting migration, redesign, or significant performance work.
- Ongoing content operations or campaign management.

Rules for ticket counting:

- A cancelled ticket not yet started does not consume quota.
- Duplicate reports merge into one ticket.
- Correction of an incomplete maintenance result does not consume another ticket.
- A valid warranty defect does not consume maintenance quota.
- A feature request rejected from maintenance does not consume quota.

---

## 9. Cancellation, Refund, and Dispute

### BR-CAN-01 — Cancellation

- Before Talent selection, the UMKM may cancel without Talent payout.
- After funding but before work starts, refundable service funds follow provider costs and the accepted cancellation policy.
- Approved milestones remain payable.
- Unstarted milestone value is refundable.
- Disputed milestone value and retention remain frozen until decision.
- CocokIn does not refund third-party purchases made directly by the UMKM.

### BR-DSP-01 — Evidence

Admin reviews:

- Approved Project Agreement and change requests.
- Acceptance criteria.
- Versioned submissions and screenshots.
- Review decisions and communication timeline.
- Infrastructure handover evidence.
- Support ticket activities and SLA timestamps.
- Payment-provider references and immutable ledger entries.

### BR-DSP-02 — Decisions

An Admin decision may order:

- Full release to Talent.
- Partial release and partial refund.
- A bounded revision with a new deadline.
- Full refund of unresolved service value.
- Retention release, refund, or approved replacement-Talent allocation.

Every financial decision must create balanced ledger entries and an immutable AuditEvent recording actor, reason, evidence references, previous state, new state, and timestamp.

---

## 10. Domain State Machines

Statuses are separated by responsibility and must not be collapsed into one project enum.

```text
ProjectStatus
DRAFT → PUBLISHED → TALENT_SELECTED → FUNDED → IN_PROGRESS
→ STAGING_REVIEW → PRODUCTION_DEPLOYMENT → HANDOVER_PENDING → COMPLETED
Exceptions: CANCELLED, DISPUTED
```

```text
MilestoneStatus
PENDING → IN_PROGRESS → SUBMITTED → READY_FOR_REVIEW → APPROVED → PAID
Review branches: REVISION_REQUESTED, DISPUTED
```

```text
PaymentStatus
PENDING → FUNDED → PARTIALLY_RELEASED → RETENTION_HELD → RELEASED
Exception branches: FROZEN, PARTIALLY_REFUNDED, REFUNDED
```

```text
InfrastructureStatus
NOT_REQUIRED | RECOMMENDATION_PENDING → PURCHASE_PENDING → ACCESS_PENDING
→ READY → CONFIGURING → ACTIVE → HANDOVER_COMPLETE
```

```text
WarrantyStatus
NOT_STARTED → ACTIVE → EXPIRING → COMPLETED
Exception: DISPUTED
```

```text
MaintenanceStatus
NOT_PURCHASED | ACTIVE → QUOTA_EXHAUSTED | EXPIRED → RENEWED
```

---

## 11. Required Notifications

CocokIn must notify the relevant party when:

- Funding succeeds or fails.
- A milestone is submitted, revised, approved, disputed, or paid.
- A review deadline approaches or pauses because staging is unavailable.
- Infrastructure access or handover action is required.
- Handover is accepted and warranty begins.
- A warranty ticket is opened, classified, approaches SLA, or breaches SLA.
- Warranty has seven days and one day remaining.
- Retention is scheduled, frozen, released, or refunded.
- Maintenance has one ticket remaining or seven days remaining.

Financial and deadline notifications must also remain visible in the in-app activity timeline; transient toast messages alone are insufficient.

---

## 12. Product Invariants

The application and automated tests must enforce:

- `6% + 4% = 10%` platform take rate.
- Milestone count is between one and four.
- Milestone weights total exactly 100% before funding.
- Retention equals 10% of Service Value.
- Warranty lasts 30 calendar days.
- Maintenance lasts 30 calendar days and permits at most five tickets.
- Payouts plus refunds never exceed funded Service Value.
- Platform fees never apply to Third-Party Costs.
- A submission belongs to exactly one milestone and has an immutable version.
- Financial mutations produce ledger entries.
- Dispute decisions and state overrides produce immutable audit events.
- Project, milestone, payment, infrastructure, warranty, and maintenance states remain independent.
