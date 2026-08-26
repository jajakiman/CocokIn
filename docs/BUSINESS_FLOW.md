# CocokIn Business Flow

> **Audience:** Developers and QA  
> **Policy source:** [`BUSINESS_RULES.md`](BUSINESS_RULES.md)

## Actors

| Actor | Responsibility |
|---|---|
| Talent | Profile, assessment, application, delivery, chat, handover, warranty |
| UMKM | Diagnosis, project, funding, selection, review, infrastructure ownership |
| Admin/Finance | Verification, reconciliation, payout/refund execution, moderation, dispute |
| CocokIn | Deterministic matching, state guards, ledger, audit, notification orchestration |
| Pusher | Realtime delivery and presence only; never authoritative message storage |

## End-to-End Lifecycle

```mermaid
flowchart LR
  A[Consent and onboarding] --> B[Assessment and diagnosis]
  B --> C[Project and matching]
  C --> D[Talent selection and chat]
  D --> E[Agreement and funding]
  E --> F[Milestone delivery and payout]
  F --> G[Handover]
  G --> H[Warranty and retention]
  H --> I[Verified outcome]
  E -. cancellation/dispute .-> J[Refund review]
  F -. dispute .-> J
  H -. dispute .-> J
```

## Onboarding and Matching

```mermaid
sequenceDiagram
  actor T as Talent
  actor U as UMKM
  participant C as CocokIn
  T->>C: Consent, profile, assessment
  C->>C: Calculate readiness and skill gap
  U->>C: Consent, business profile, readiness
  C-->>U: Rule/template-assisted project draft
  U->>C: Publish project
  C->>C: Calculate deterministic Cocok Score
  T->>C: Apply
  U->>C: Select Talent
  C->>C: Create Project Conversation
```

Gemini may draft explanations from sanitized data but cannot determine a score, publish a project, approve work, or move money.

## Chat and Agreement

```mermaid
sequenceDiagram
  actor T as Talent
  actor U as UMKM
  participant C as CocokIn
  participant P as Pusher
  T->>C: Send message
  C->>C: Authorize and persist in PostgreSQL
  C-->>P: Broadcast persisted event
  P-->>U: Realtime update
  U->>C: Propose structured agreement
  T->>C: Accept agreement
  U->>C: Accept agreement
```

Typing and presence are ephemeral Pusher events. Messages, reactions, receipts, reports, and system events are persistent. Pusher failure falls back to polling without message loss. Chat cannot amend scope, value, deadline, approval, or financial state.

## Funding and Reconciliation

```mermaid
sequenceDiagram
  actor U as UMKM
  participant C as CocokIn
  participant F as Admin/Finance
  U->>C: Choose bank transfer or GoPay Merchant QRIS
  C-->>U: Amount + Platform Reference
  U->>C: Pay and submit External Reference/evidence
  C-->>F: Reconciliation queue
  F->>C: Match account/acquirer record
  C->>C: Post balanced ledger and 100% liability reserve
  C->>C: Recognize 5% Activation Fee
  C->>C: Set Project FUNDED/IN_PROGRESS
```

- Bank transfer is default; sender-bank fee is borne by UMKM.
- QRIS has no consumer surcharge. MDR is evidence-backed configuration and, if nonzero, borne by CocokIn.
- Proof upload alone never funds a Project.

## Milestone Review and Payout

```mermaid
sequenceDiagram
  actor T as Talent
  actor U as UMKM
  participant C as CocokIn
  participant F as Admin/Finance
  T->>C: Submit staging URL and evidence
  C-->>U: Review Hub
  alt Approved
    U->>C: Approve acceptance criteria
    C->>C: Allocate 90% payout + 10% warranty retention
    C-->>F: Payout instruction with Platform Reference
    F->>C: Transfer and record External Reference/proof
    T->>C: Confirm receipt
  else Revision
    U->>C: Request revision linked to criterion
  else Changed scope
    U->>C: Create Change Request
    T->>C: Accept or reject
  else Dispute
    U->>C: Open dispute and freeze affected liability
  end
```

CocokIn bears payout transfer cost. Approval and money movement are separate permissions and states.

## Handover, Warranty, and Refund

```mermaid
sequenceDiagram
  actor T as Talent
  actor U as UMKM
  participant C as CocokIn
  participant A as Admin
  T->>C: Submit production handover
  U->>C: Accept checklist
  C->>C: Recognize 5% Success Fee and start warranty
  alt Warranty closes cleanly
    C->>C: Make retention payout eligible
    C-->>T: Payout confirmation flow
  else Valid unresolved ticket/dispute
    C->>C: Freeze affected retention
    A->>C: Decide payout/refund/revision
  else Cancellation/refund
    C->>C: Calculate ledger-backed refund breakdown
    U->>C: Confirm breakdown
    A->>C: Execute transfer and External Reference
    U->>C: Confirm receipt
  end
```

Refund transfer cost is borne by UMKM except when CocokIn caused the refund. Completion may generate a private portfolio draft; publication requires explicit Talent consent and UMKM attribution approval.
