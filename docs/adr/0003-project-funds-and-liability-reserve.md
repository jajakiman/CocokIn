# ADR-0003: Project Funds and 100% Liability Reserve

**Status:** Accepted with launch gate

## Decision

The intended production flow receives full Project Service Value plus platform fee into a CocokIn legal-entity account. Bank transfer is default and GoPay Merchant QRIS is optional. Every movement has a CocokIn Platform Reference and an External Reference. Outstanding user liabilities require 100% cash coverage.

## Rationale

Central receipt enables milestone payout and refund calculation, but materially increases legal, accounting, reconciliation, and custody risk.

## Consequences

- The model cannot launch with real money until legal counsel and the bank/QRIS acquirer approve the use case.
- User funds cannot finance operations. Only earned fees are operationally available.
- Activation fee is 5%; success fee is 5%.
- Each approved milestone pays Talent 90% and retains 10% for warranty.
- Payout transfer costs are borne by CocokIn.
- Refund transfer costs are borne by UMKM except when CocokIn caused the refund.
- QRIS has no consumer surcharge. MDR is configuration backed by current merchant evidence; if nonzero it is absorbed by CocokIn.
