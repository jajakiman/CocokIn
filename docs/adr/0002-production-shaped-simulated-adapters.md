# ADR-0002: Production-Shaped Core with Simulated External Adapters

**Status:** Accepted

## Decision

Foundation uses real authentication, PostgreSQL persistence, state guards, ledger, audit events, and consent. External payment, bank reconciliation, QRIS, storage, email, jobs, and AI behavior may begin behind simulated adapters.

## Rationale

Provider credentials, commercial approval, and legal readiness must not block validation of CocokIn's core marketplace and delivery loop.

## Consequences

- Simulation is visibly labeled and never moves real money.
- Provider replacement must preserve the domain interface and contract tests.
- Real-money mode remains disabled until the treasury launch gates pass.
