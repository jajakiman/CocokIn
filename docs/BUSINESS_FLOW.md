# CocokIn Business Flow

> **Applies to:** [`../PRD.md`](../PRD.md) v1.2 and [`BUSINESS_RULES.md`](BUSINESS_RULES.md) v1.0  
> **Audience:** Developers and QA  
> **Purpose:** Describe actor interactions, system decisions, state changes, and exception paths without redefining policy.

## 1. Actors and Responsibilities

| Actor | Primary responsibilities |
|---|---|
| Talent | Complete profile and assessment, apply to projects, deliver milestones, perform production handover, honor warranty. |
| UMKM | Complete business diagnosis, publish and fund projects, review outputs, own production infrastructure, accept handover. |
| Admin | Verify businesses, moderate content, review disputes, and authorize exceptional financial outcomes. |
| CocokIn | Calculate deterministic matching, enforce state guards, record audit history, orchestrate notifications and provider calls. |
| Xendit | Collect protected project funding, manage sub-accounts, execute split routing, payout, and refund operations. |
| External infrastructure provider | Host the UMKM production result under an account owned by the UMKM. |

## 2. Lifecycle Overview

```mermaid
flowchart LR
    A[Onboarding] --> B[Assessment and diagnosis]
    B --> C[Project publication]
    C --> D[Matching and application]
    D --> E[Agreement and funding]
    E --> F[Milestone delivery]
    F --> G[Staging review]
    G -->|Revision| F
    G -->|Approved| H[Production and handover]
    H --> I[Warranty and retention]
    I --> J[Verified portfolio and digital growth]
    H --> K[Optional maintenance]
    E -. Exception .-> L[Cancellation or dispute]
    F -. Exception .-> L
    G -. Exception .-> L
    I -. Exception .-> L
```

Project, milestone, payment, infrastructure, warranty, and maintenance state changes are independent. See [`DATA_STATE_MODEL.md`](DATA_STATE_MODEL.md).

## 3. Onboarding, Diagnosis, and Matching

**Trigger:** A new Talent or UMKM creates an account.  
**Preconditions:** Contact information is verifiable.  
**Related requirements:** `FR-TAL-01..03`, `FR-BIZ-01..04`, `FR-MTC-01..02`.  
**Financial effect:** None.

```mermaid
sequenceDiagram
    actor T as Talent
    actor U as UMKM
    participant C as CocokIn
    participant A as Admin

    par Talent onboarding
        T->>C: Register and verify contact
        T->>C: Complete profile, target career, and skills
        T->>C: Complete career assessment
        C->>C: Calculate readiness and skill gaps
    and UMKM onboarding
        U->>C: Register and verify contact
        U->>C: Complete business profile and readiness assessment
        C->>C: Diagnose problem and propose project template
        U->>C: Submit business verification evidence
        C-->>A: Request verification review
        A-->>C: Approve or reject verification
    end

    U->>C: Publish project with scope and qualifications
    C->>C: Calculate Cocok Score candidates deterministically
    C-->>T: Show relevant project and explainable factors
    T->>C: Apply with motivation and availability
    C-->>U: Rank applicants with factor breakdown
    U->>C: Select Talent
```

### System outcomes

- Talent skills remain `SELF_DECLARED` or `ASSESSED` until project evidence raises their level.
- AI may draft a project explanation, but the UMKM must review it before publication.
- Gemini failure falls back to templates and deterministic rules; project publication remains available.
- A Cocok Score never authorizes acceptance automatically.

### Notifications

- Assessment completed.
- Business verification approved or rejected.
- Relevant project available.
- Application received, accepted, or rejected.

## 4. Agreement, Funding, and Milestone Delivery

**Trigger:** The UMKM selects a Talent.  
**Preconditions:** Project scope, one to four milestones, and acceptance criteria are complete.  
**Related requirements:** `FR-PRJ-01..03`, `FR-MIL-01..04`, `FR-PAY-01..03`.  
**Related policies:** `BR-AGR-*`, `BR-PAY-01`, `BR-SUB-*`, `BR-REV-*`.

```mermaid
sequenceDiagram
    actor U as UMKM
    actor T as Talent
    participant C as CocokIn
    participant X as Xendit
    participant J as Inngest

    U->>C: Approve Project Agreement Summary
    T->>C: Approve Project Agreement Summary
    C->>C: Validate milestone weights equal 100%
    C->>X: Create protected funding checkout
    X-->>U: Hosted checkout
    U->>X: Complete payment
    X-->>C: Signed payment webhook
    C->>C: Idempotently post funding ledger
    C->>C: Set payment FUNDED and project FUNDED
    C-->>T: Authorize work start

    loop Each milestone
        T->>C: Submit HTTPS staging URL and evidence
        C->>C: Validate required fields and URL availability
        C->>J: Schedule review reminders and deadline
        C-->>U: Open Review Hub

        alt Criteria satisfied
            U->>C: Approve milestone
            C->>C: Record 90% payable and 10% retention
            C->>X: Request permitted milestone payout
            X-->>C: Payout status webhook
            C->>C: Post payout ledger and mark milestone PAID
        else Existing scope incomplete
            U->>C: Request revision linked to criterion
            C-->>T: Return revision request
        else New requirement
            U->>C: Open Change Request
            T->>C: Accept or reject value/deadline change
        else Disagreement
            U->>C: Open dispute
            C->>C: Freeze affected funds
        else No UMKM response
            J->>C: Review window elapsed
            C->>C: Verify submission valid and no dispute
            C->>C: Auto-approve and follow payout path
        end
    end
```

### Guards and failure paths

- Funding webhook signature and idempotency key must be valid.
- Work cannot start from a browser-only status change; funding is confirmed server-side.
- If staging is unavailable, the review timer pauses and auto-approval is blocked.
- `REVISION_REQUESTED` cannot add scope. New scope uses `CHANGE_REQUESTED`.
- Provider calls happen outside database transactions; confirmed results are reconciled through webhooks.
- Xendit split/refund mismatches enter an operations queue for compensating transfer.

### Financial effects

Formulas are canonical in `BR-FEE-*` and `BR-REV-03`. Each approved milestone makes 90% immediately payable and accumulates 10% as project warranty retention. CocokIn recognizes fees only on successfully released Service Value.

## 5. Infrastructure, Production, and Handover

**Trigger:** Staging deliverables are approved and production is in scope.  
**Preconditions:** Infrastructure plan and ownership responsibilities are agreed.  
**Related requirements:** `FR-INF-01..02`, `FR-HOV-01`.  
**Related policies:** `BR-INF-*`, `BR-HOV-*`.

```mermaid
sequenceDiagram
    actor U as UMKM
    actor T as Talent
    participant C as CocokIn
    participant H as Hosting Provider
    participant X as Xendit

    C-->>U: Recommend managed hosting by default
    alt UMKM needs production
        U->>H: Purchase domain and hosting using UMKM account
        U->>C: Confirm ownership and recurring cost
        U->>H: Invite Talent with limited access
        T->>H: Configure production deployment and domain
        T->>C: Submit production handover checklist
        C-->>U: Request production review
        U->>H: Test production result

        alt Handover complete
            U->>C: Accept handover
            C->>C: Mark project COMPLETED
            C->>C: Start 30-day warranty
            C->>X: Request final milestone 90% payout
        else Handover criterion missing
            U->>C: Request bounded correction
            C-->>T: Return missing checklist item
        end
    else Staging-only project
        U->>C: Accept final files and documentation
        C->>C: Complete applicable handover checklist
    end
```

### Ownership rules

- Domain, hosting, VPS, database, and provider billing remain owned by the UMKM.
- Third-party costs are paid directly by the UMKM and excluded from CocokIn platform fees.
- Passwords, API keys, recovery codes, and private keys cannot be sent through CocokIn chat.
- VPS requires a documented reason, recurring cost, backup owner, security owner, and monitoring owner.

## 6. Warranty, Maintenance, and Dispute

**Trigger:** Handover is accepted.  
**Preconditions:** Production baseline and warranty start timestamp are recorded.  
**Related requirements:** `FR-SUP-01..02`, `FR-ADM-04`.  
**Related policies:** `BR-WAR-*`, `BR-MNT-*`, `BR-DSP-*`.

```mermaid
sequenceDiagram
    actor U as UMKM
    actor T as Talent
    participant C as CocokIn
    participant J as Inngest
    participant A as Admin
    participant X as Xendit

    C->>J: Schedule warranty reminders and day-30 release

    alt UMKM reports agreed functionality is broken
        U->>C: Open warranty ticket with evidence
        C-->>T: Start two-business-day response SLA
        T->>C: Classify and diagnose ticket
        alt Valid warranty
            T->>C: Deliver fix within severity target
            U->>C: Confirm resolution
        else Talent marks out of scope
            U->>C: Accept classification or escalate
        end
    else UMKM requests small operational change
        U->>C: Purchase or use maintenance package
        C->>C: Consume one of five tickets when work starts
        T->>C: Deliver maintenance result
    else UMKM requests new capability
        C->>C: Route to Change Request or new project
    end

    alt SLA breach or disagreement
        C->>C: Freeze retention
        C-->>A: Open dispute with immutable evidence
        A->>C: Decide release, partial release, refund, or replacement
        C->>X: Execute authorized financial instruction
    else Day 30 and no valid unresolved ticket
        J->>C: Request retention release
        C->>C: Idempotently validate release guards
        C->>X: Release accumulated retention
        X-->>C: Payout webhook
        C->>C: Close warranty and ledger
    end
```

### SLA and support outcomes

- Talent acknowledges a complete warranty ticket within two Business Days.
- Repair targets are one Business Day for Critical, three for Major, and five for Minor.
- Maintenance lasts 30 calendar days and permits five small tickets with no rollover.
- A warranty defect never consumes maintenance quota.
- An out-of-scope request cannot extend retention.

## 7. Completion Effects

After the project and applicable financial operations complete:

1. CocokIn creates a verified portfolio entry for Talent.
2. Applied skills become `PROJECT_VERIFIED` when supported by accepted project evidence.
3. UMKM performs the post-project Digital Readiness assessment.
4. CocokIn records Digital Growth and SDG impact metrics.
5. Both parties may submit ratings after financial outcomes are final.

These effects must be idempotent because payment and background-job events may be retried.
