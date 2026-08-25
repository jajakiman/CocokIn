# ADR-0001: Managed Modular Monolith

**Status:** Accepted

## Decision

CocokIn uses one Next.js application and one PostgreSQL source of truth, organized into deep domain modules. External systems sit behind adapters.

## Rationale

The three-person team needs atomic cross-domain transactions and low operational overhead. Microservices would add deployment, network, tracing, and consistency costs before measured scale requires them.

## Consequences

- Domain modules expose small interfaces and own their persistence behavior.
- Provider SDKs cannot enter domain modules.
- A future service extraction requires measured load or an independent team boundary.
