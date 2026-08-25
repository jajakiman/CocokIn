# CocokIn Data and State Model

> **Policy source:** [`BUSINESS_RULES.md`](BUSINESS_RULES.md)

## Aggregates

| Aggregate | Root | Owns |
|---|---|---|
| Identity | `User` | Accounts, sessions, role, verification, consent, suspension |
| Talent | `TalentProfile` | Career target, skills, assessment, passport, portfolio |
| Business | `BusinessProfile` | Verification, readiness, projects |
| Project | `Project` | Applications, agreement, milestones, submissions, reviews, change requests |
| Conversation | `ProjectConversation` | Participants, messages, attachments, reactions, receipts, reports, reopen requests |
| Treasury | `FundingAccount` | Receipts, references, ledger, payouts, refunds, reconciliation, reserve coverage |
| Infrastructure | `InfrastructurePlan` | Recommendation and handover |
| Support | `WarrantyAgreement` | Warranty tickets, maintenance packages, SLA |
| Dispute | `Dispute` | Evidence, decision, authorized remedy |

## Core Entities

```text
User, Account, Session, ConsentRecord
TalentProfile, TalentSkill, AssessmentResult, PortfolioEntry
BusinessProfile, BusinessAssessmentResult
Project, ProjectApplication, MatchSnapshot, ProjectAgreement
ProjectMilestone, AcceptanceCriterion, MilestoneSubmission, MilestoneReview
ProjectConversation, ConversationParticipant, ChatMessage, MessageAttachment
MessageReaction, MessageReceipt, MessageReport, ConversationReopenRequest
FundingAccount, FundingReceipt, LedgerEntry, PayoutInstruction, RefundInstruction
ReconciliationRecord, CollectionFeeConfig, AuditEvent
InfrastructurePlan, InfrastructureHandover
WarrantyAgreement, SupportTicket, MaintenancePackage
Dispute, DisputeEvidence, DisputeDecision
```

## Independent State Domains

### ProjectStatus

```text
DRAFT -> PUBLISHED -> TALENT_SELECTED -> AGREEMENT_CONFIRMED
-> FUNDING_PENDING -> FUNDED -> IN_PROGRESS -> STAGING_REVIEW
-> PRODUCTION_DEPLOYMENT -> HANDOVER_PENDING -> DELIVERED -> COMPLETED
Exceptions: CANCELLED, DISPUTED
```

### MilestoneStatus

```text
PENDING -> IN_PROGRESS -> SUBMITTED -> READY_FOR_REVIEW
-> APPROVED -> PAYOUT_DUE -> PAID
Branches: REVISION_REQUESTED, DISPUTED
```

### FundingStatus

```text
AWAITING_PAYMENT -> PROOF_SUBMITTED -> RECONCILIATION_PENDING -> FUNDED
Branches: AMOUNT_MISMATCH, UNMATCHED, EXPIRED, CANCELLED
```

### PayoutStatus

```text
PAYOUT_DUE -> PROCESSING -> PROOF_UPLOADED -> TALENT_CONFIRMED -> PAID
Branches: FAILED, MISMATCH, DISPUTED
```

### RefundStatus

```text
REFUND_REQUESTED -> ELIGIBILITY_REVIEW -> AMOUNT_CALCULATED
-> USER_CONFIRMED_BREAKDOWN -> APPROVED -> PROCESSING
-> PROOF_UPLOADED -> UMKM_CONFIRMED -> REFUNDED
Branches: REJECTED, PARTIALLY_REFUNDED, FAILED, RETRY_REQUIRED
```

### ConversationStatus

```text
PENDING -> ACTIVE -> SUPPORT_ACTIVE -> READ_ONLY
READ_ONLY -> REOPEN_REQUESTED -> ACTIVE
REOPEN_REQUESTED -> READ_ONLY (Talent rejects/expires)
```

### WarrantyStatus

```text
NOT_STARTED -> ACTIVE -> EXPIRING -> COMPLETED
Exception: DISPUTED
```

## Transition Guards

| Transition | Guard |
|---|---|
| Project to `FUNDED` | Account/acquirer record reconciled; references unique; expected amount matches; ledger balances |
| Project to `IN_PROGRESS` | Agreement accepted; funding complete; Activation Fee recognized |
| Milestone to `APPROVED` | Current immutable submission exists; criteria decision authorized; no active milestone dispute |
| Milestone to `PAID` | Payout proof and Talent confirmation/reconciliation complete |
| Handover to `DELIVERED` | Applicable ownership and production checklist complete |
| Success Fee earned | Delivered; no active handover dispute |
| Warranty to `COMPLETED` | Day 30; no valid unresolved ticket/dispute |
| Conversation to `ACTIVE` after closure | UMKM requested reopen; Talent accepted; support/project funding confirmed when required |

## Money and References

- IDR amounts use integer rupiah/`BigInt`.
- Percentages use basis points: `ACTIVATION_FEE_BPS=500`, `SUCCESS_FEE_BPS=500`, `PAYOUT_BPS=9000`, `RETENTION_BPS=1000`.
- Every confirmed financial movement has non-null unique `platformReference` and `externalReference`.
- Reference format: `CCK-{PROJECT}-{PURPOSE}-{SEQUENCE}`.

## Ledger Contract

Ledger entries are append-only and grouped into balanced transactions.

```text
Cash at Bank
Talent Payable
UMKM Refundable
CocokIn Fee Pending
CocokIn Fee Earned
Collection Cost
Payout Cost
Refund Cost
```

Invariant:

```text
restricted cash >= Talent Payable + UMKM Refundable + CocokIn Fee Pending
coverage ratio >= 100%
```

History is corrected with compensating entries, never edits.

## Chat Ordering and Realtime

- PostgreSQL assigns immutable `messageId` and per-conversation `sequenceNumber`.
- Message creation commits before Pusher publish.
- Duplicate realtime events are deduplicated by `messageId`.
- Reconnect fetches messages after `lastSeenSequence`.
- Typing and presence are ephemeral and do not change durable state.

## Consent

Purposes include `TERMS_ACCEPTANCE`, `PRIVACY_PROCESSING`, `PUBLIC_PORTFOLIO`, `TESTIMONIAL`, `DEMO_DATA_USE`, `RESEARCH_PARTICIPATION`, `MARKETING_COMMUNICATION`, `PROJECT_COMMUNICATION_RETENTION`, and `VOICE_NOTE_PROCESSING`.

Consent status: `PENDING | GRANTED | REVOKED | EXPIRED`. History is append-only. Synthetic seed consent uses `source=SEEDED_DEMO` and is never treated as real-person consent.

## Idempotency Keys

```text
funding/{platformReference}/{externalReference}
payout/{milestoneId}/{releaseVersion}
refund/{refundInstructionId}/{sequence}
message/{conversationId}/{clientMessageId}
auto-approve/{milestoneId}/{submissionVersion}
retention/{projectId}/{warrantyEndDate}
notification/{eventId}/{channel}/{recipientId}
portfolio/{projectId}/{talentId}
```

## Database Invariants

- One active application per Talent/Project.
- One to four milestones, positive weights, total exactly 10,000 bps.
- Unique submission version and message sequence within parent.
- Funding/payout/refund references are unique and immutable.
- Payout plus refund never exceeds reconciled funding.
- Ledger groups balance.
- Coverage never falls below 100%.
- QRIS consumer surcharge is zero; MDR config has source and verification date.
- Maintenance package has at most five qualifying tickets.
- Audit events, reviews, submissions after review, and dispute decisions are immutable.
