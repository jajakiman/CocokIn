# CocokIn Business Rules

> **Version:** 2.0
> **Applies to:** CocokIn PRD v1.2
> **Status:** Approved product-policy baseline; real-money launch remains gated

This document is the source of truth for project funding, platform fees, milestone payout, refund, handover, warranty, maintenance, chat, consent, and dispute rules.

## 1. Definitions

| Term | Definition |
|---|---|
| Service Value | Gross Talent compensation agreed for a Project, excluding CocokIn fee and third-party infrastructure. |
| Funding Receipt | Full Service Value plus CocokIn platform fee received and reconciled to a Project. |
| Liability Reserve | Cash that must remain available for outstanding Talent payable, UMKM refundable, and pending fees. Coverage is always at least 100%. |
| Activation Fee | 5% of Service Value earned when funding is reconciled and the Project becomes active. |
| Success Fee | 5% of Service Value earned when production handover succeeds without an active handover dispute. |
| Milestone Payout | 90% of an approved milestone paid to Talent. |
| Warranty Retention | 10% of every approved milestone retained as Talent payable until the 30-day warranty closes. |
| Platform Reference | Unique CocokIn identifier attached to every incoming funding, payout, refund, and fee movement. |
| External Reference | Bank or QRIS-acquirer identifier for the corresponding movement. |
| Project Conversation | Private chat for the selected Talent and authorized UMKM participants. It cannot modify an agreement or financial state. |
| Business Day | Monday-Friday excluding Indonesian national public holidays. |

## 2. Real-Money Launch Gate

Real-money mode remains disabled until all of these are evidenced:

- CocokIn legal entity and business account exist.
- The bank and GoPay Merchant/acquirer approve the marketplace fund flow.
- Legal opinion covers receipt, temporary control, payout, refund, retention, and user terms.
- Accounting and tax treatment are documented.
- AML/KYC, reconciliation, refund, incident, and treasury SOPs are approved.
- MFA, role separation, daily reconciliation, payout/refund limits, and dual approval are operational.
- Restore, audit, and 100% liability-coverage controls are tested.

Until then, `PaymentMode = SIMULATED` and no real money moves. CocokIn must not call itself a licensed escrow provider.

## 3. Funding and Collection

### BR-FUND-01 - Funding amount

```text
Funding due = Service Value + (Service Value x 10%)
```

The 10% platform fee is split into 5% Activation Fee and 5% Success Fee. Talent is not charged a platform fee.

### BR-FUND-02 - Collection methods

- Bank transfer to the legal-entity CocokIn account is the default.
- GoPay Merchant QRIS is optional.
- Every instruction has a unique Platform Reference.
- Every confirmed movement has a unique External Reference.
- Screenshots are evidence, not settlement proof; Finance reconciles against the account/acquirer record.
- Bank charges imposed by the UMKM's sending bank are borne by the UMKM.
- QRIS must not add a consumer surcharge.
- QRIS MDR is configuration backed by current merchant evidence. If nonzero, CocokIn absorbs it from earned revenue and never reduces Talent payable.

### BR-FUND-03 - Reconciliation states

```text
AWAITING_PAYMENT -> PROOF_SUBMITTED -> RECONCILIATION_PENDING -> FUNDED
Exceptions: AMOUNT_MISMATCH, UNMATCHED, EXPIRED, CANCELLED
```

A Project cannot start from an uploaded proof alone.

## 4. Treasury and Fees

### BR-TRS-01 - Liability coverage

```text
Required cash coverage = Talent Payable + UMKM Refundable + Fee Pending
Coverage ratio = restricted cash / required cash coverage
Minimum coverage ratio = 100%
```

User liabilities cannot fund payroll, hosting, marketing, internal projects, or any operating expense. Operational withdrawal is limited to Fee Earned and must remain coverage-safe.

### BR-FEE-01 - Fee recognition

- Activation Fee becomes earned only after both parties accept the agreement, funding is reconciled, workspace/chat activate, and the Project enters `IN_PROGRESS`.
- Success Fee becomes earned only after all required delivery is accepted, handover completes, and no handover dispute is active.
- Pending fees remain refundable.
- Fee recognition creates balanced ledger entries and an immutable audit event.

## 5. Milestone Payout

Projects contain one to four milestones whose weights total exactly 100%.

```text
Milestone value = Service Value x milestone weight
Immediate payout = Milestone value x 90%
Warranty retention = Milestone value x 10%
```

Flow:

```text
APPROVED -> PAYOUT_DUE -> PROCESSING -> PROOF_UPLOADED
-> TALENT_CONFIRMED -> PAID
```

- Rafi's delivery module approves a milestone; it cannot move money.
- Farid's payment module validates an approved release and creates the payout instruction.
- CocokIn bears outgoing bank-transfer cost so Talent receives the full payout amount.
- Payout is not final until Talent confirms receipt or Finance resolves evidence through a controlled reconciliation flow.

## 6. Refund

Refund amount is calculated from ledger state, never typed freely by Admin.

```text
Gross refundable = unearned Service Value + Fee Pending + refundable retention
Net refund = Gross refundable - applicable refund transfer cost
```

Flow:

```text
REFUND_REQUESTED -> ELIGIBILITY_REVIEW -> AMOUNT_CALCULATED
-> USER_CONFIRMED_BREAKDOWN -> APPROVED -> PROCESSING
-> PROOF_UPLOADED -> UMKM_CONFIRMED -> REFUNDED
```

- UMKM bears refund transfer cost for cancellation and ordinary disputes.
- CocokIn bears it when CocokIn caused the refund, duplicate receipt, wrong mapping, wrong instruction, or negligent delay.
- Talent may bear recovery cost only when a final dispute decision attributes fraud or severe breach to Talent.
- Breakdown shows earned fees, final Talent payout, refundable retention, gross refund, cost bearer, transfer cost, and net refund.
- Refund uses unique Platform and External References.

## 7. Delivery and Review

Every staging submission contains an HTTPS Preview URL, nontechnical summary, acceptance checklist, review instructions, screenshots, demo-account instructions when needed, timestamp, and immutable version.

UMKM decisions:

| Decision | Meaning |
|---|---|
| `APPROVED` | Existing acceptance criteria are satisfied. |
| `REVISION_REQUESTED` | Existing scope is incomplete. |
| `CHANGE_REQUESTED` | New scope/value/deadline is proposed. |
| `DISPUTED` | Parties disagree about fulfillment or money. |

Chat messages cannot replace these structured decisions.

## 8. Project Conversation

- Conversation opens after Talent selection.
- Participants are the selected Talent and authorized UMKM members.
- Admin access requires a report/dispute reason and an audit event.
- PostgreSQL stores authoritative messages before Pusher broadcasts an event.
- Pusher carries realtime delivery, typing, presence, receipts, and notifications; it does not store authoritative history.
- If Pusher is unavailable or quota-limited, message creation still works and clients poll PostgreSQL-backed endpoints.
- Foundation supports text, reply, reaction, attachments, voice notes, typing, presence, read receipts, unread counts, search, reports, and system messages; no live audio/video calls.
- Conversation is writable through active Project/support, then read-only.
- UMKM may request reopening; Talent must explicitly accept. Paid support requires confirmed funding where applicable.
- History is retained under the disclosed Privacy Policy. Attachments remain private and quota-controlled.

## 9. Infrastructure and Handover

- Domain, hosting, VPS, database, and production-provider billing belong to the UMKM.
- Managed hosting is the default recommendation; VPS requires a written technical and operational rationale.
- Talent receives collaborator/time-limited access; credentials are never sent through ordinary chat.
- Handover verifies production URL, domain, HTTPS, critical functions, mobile layout, ownership, Admin access, documentation, backup/export, recurring costs, warranty, and maintenance scope.

## 10. Warranty and Maintenance

Warranty is free for 30 calendar days from accepted handover.

| Severity | Repair target after valid classification |
|---|---:|
| Critical | 1 Business Day |
| Major | 3 Business Days |
| Minor | 5 Business Days |

Talent acknowledges and classifies a complete ticket within two Business Days. Retention releases only when day 30 passes with no valid unresolved ticket or active dispute.

Maintenance is optional, paid, lasts 30 calendar days, and includes at most five small operational tickets with no rollover. New pages, roles, workflows, integrations, redesign, or major migration require a Change Request/new Project.

## 11. Consent and Seed Data

- Seed/staging data is synthetic, uses `.test` identities, and is marked `isSynthetic` and `isDemoAccount`.
- Real user data never enters seed or staging.
- Required service consent is separate from optional public portfolio, testimonial, demo-data, research, marketing, voice-note, and project-communication-retention consent.
- A completed Project creates a private portfolio draft. Publication requires Talent consent and UMKM attribution approval.
- Consent history is append-only/audited and optional consent can be revoked.

## 12. Product Invariants

- `Activation Fee 5% + Success Fee 5% = total platform fee 10%`.
- Milestone count is one to four and weights total 100%.
- Every approved milestone allocates 90% immediate payout and 10% warranty retention.
- Cash coverage of outstanding user liabilities is never below 100%.
- Platform and External References are unique and mandatory for confirmed financial movements.
- QRIS consumer surcharge is always zero; MDR configuration has evidence and a verification date.
- Payout cost is borne by CocokIn.
- Refund cost is borne by UMKM except CocokIn-caused refunds.
- Ledger groups balance and history is corrected only with compensating entries.
- Project, milestone, payment, infrastructure, warranty, maintenance, conversation, and dispute states remain independent.
