# CocokIn Design System

> **Direction:** Arctic Depths, trust + youthful
> **Theme:** Light-first
> **Applies to:** Talent, UMKM, Admin, and public pages

## Consistency Contract

- All roles use the same typography, semantic colors, spacing, radius, elevation, motion, icon family, shell, and shared components.
- Roles differ only in navigation content, information priority, wording, and density.
- No role-specific primary color or component fork.
- Route components use semantic tokens, never raw hex values.
- Page overrides may change composition and density but cannot redefine foundation tokens.

## Color Palette

### Arctic Depths Brand

| Token | Value | Use | Safe foreground |
|---|---:|---|---:|
| `brand-cyan` | `#0DB8D3` | Growth accent, highlight, decorative brand element | `#193546` |
| `brand-blue` | `#1B7FDC` | Brand, active indicator, focus, charts | `#193546` for normal text contexts |
| `brand-deep` | `#065B98` | Primary actions and strong interactive states | `#FFFFFF` |
| `brand-navy` | `#193546` | Headings, structural dark surfaces | `#FFFFFF` |

Contrast decisions:

- Cyan/white is about 2.38:1 and is forbidden for normal text.
- Cyan/navy is about 5.38:1 and is valid for normal text.
- Brand blue/white is about 4.10:1 and is not used for normal white button text.
- Deep blue/white is about 7.10:1 and is the primary CTA pair.
- Navy/white is about 12.81:1.

### Surface and Text

```text
background          #F5FAFC
surface             #FFFFFF
surface-subtle      #EAF5F8
surface-selected    #EFF8FF
border              #C9E0E8
border-strong       #94B9C7
foreground          #193546
muted-foreground    #526B79
```

### Semantic Status

| Meaning | Strong | Subtle | Foreground on subtle |
|---|---:|---:|---:|
| Success / verified | `#047857` | `#ECFDF5` | `#047857` |
| Warning / revision | `#B45309` | `#FFFBEB` | `#92400E` |
| Destructive / error | `#BE123C` | `#FFF1F2` | `#9F1239` |
| Information | `#065B98` | `#EFF8FF` | `#065B98` |
| Neutral | `#64748B` | `#F1F5F9` | `#475569` |

Every status includes text plus an icon/shape. Color is never the only carrier.

## Typography

- Family: Plus Jakarta Sans through `next/font`.
- Display: 48/52, 700.
- Page title: 32/40, 700.
- Section title: 24/32, 700.
- Component title: 18/26, 600.
- Body: 16/24, 400.
- Small: 14/20, 400.
- Label: 14/20, 600.
- Caption: 12/16, 500, nonessential metadata only.
- Currency, scores, timers, and tabular data use tabular figures.
- Prose measure is 35-60 characters on mobile and 60-75 on desktop.

## Spacing, Shape, Elevation

```text
spacing: 4, 8, 12, 16, 24, 32, 48, 64
control radius: 8px
card radius: 12px
dialog/sheet radius: 16px
pill: tags and statuses only
```

UI is flat by default. Use borders and whitespace before shadows. One subtle card shadow and one dialog shadow are allowed.

## Motion

```text
fast       120ms
standard   180ms
emphasis   240ms
```

- Animate transform/opacity only.
- Motion communicates feedback and continuity, never decoration on payment, review, dispute, or error flows.
- `prefers-reduced-motion` renders final state immediately.

## Iconography

Phosphor Icons is the only structural icon family. Use 16px inline, 20px controls, and 24px navigation. Decorative icons beside visible labels use `aria-hidden`.

## Shared Responsive Shell

| Viewport | Navigation | Content |
|---|---|---|
| `<768px` | Compact top bar + labeled bottom navigation, max five | Single column, 16px gutter |
| `768-1023px` | Navigation rail or temporary sidebar | One/two columns, 24px gutter |
| `>=1024px` | Persistent collapsible sidebar, 240-264px | Multi-column, 32px gutter |
| `>=1440px` | Same shell | Centered max 1280px content |

Rules:

- Skip-to-main appears first on keyboard focus.
- Core navigation placement stays consistent.
- Deep pages provide predictable Back.
- Sticky action bars reserve content space and cannot obscure focus.
- No horizontal page scrolling.
- Touch targets are at least 44x44 CSS px with 8px separation.
- Forms remain one column unless short fields are logically paired.
- Tables become labeled record cards/lists on mobile.
- Charts simplify on small screens and always provide text/table alternatives.

## Role Configuration

| Role | Density | Primary priority |
|---|---|---|
| Talent | Comfortable | Growth, matches, active work, verified evidence |
| UMKM | Standard | Business outcome, applicants, review, cost |
| Admin | Dense | Queue, risk, audit, reconciliation |

Dense mode never reduces body text below 14px, controls below 44px, or required action separation.

## Shared Components

Navigation: `AppShell`, `RoleNavigation`, `TopBar`, `Breadcrumbs`, `PageHeader`, `NotificationCenter`, `AccountMenu`.

Feedback: buttons, alerts, banners, toast for transient confirmation, confirmation dialog, skeleton, loading, empty, error, offline, and permission-denied states.

Forms: visible labels, helper text, inline error, focusable linked `ErrorSummary`, autosave indicator, unsaved-change confirmation, step progress, file/evidence upload.

Data: `StatusBadge`, `MetricTile`, `ResponsiveDataView`, sortable table, timeline, currency breakdown, score display, chart summary/table fallback, pagination.

Domain patterns: `CocokScoreCard`, `ProjectCard`, `ProjectAgreementSummary`, `MilestoneTimeline`, `SubmissionPanel`, `ReviewDecisionPanel`, `FundingBreakdown`, `TreasuryCoverage`, `HandoverChecklist`, `WarrantyPanel`, `DisputeEvidence`, `AuditTimeline`, and chat patterns.

## Chat Palette

```text
own message background       #DBEEFE
own message foreground       #193546
other message background     #FFFFFF
other message foreground     #193546
system message background    #EAF5F8
unread divider               #1B7FDC on #EFF8FF
reconnecting                 warning tokens
failed message               destructive tokens
```

Own-message styling follows the signed-in user, not role color. Presence always has text/accessibility labeling.

## Accessibility Contract

Target WCAG 2.2 AA.

- Normal text contrast >=4.5:1; meaningful non-text boundaries >=3:1.
- Keyboard order follows visual order; dialogs trap and restore focus.
- Route changes focus the main heading/content region.
- Authentication supports password managers, paste, and autofill.
- Multi-error forms focus a linked error summary and retain inline errors.
- All functionality works without hover, drag, or swipe-only interaction.
- Browser zoom remains enabled and 200% zoom preserves operation.
- Financial and deadline truth remains persistent, not toast-only.
- Amounts and state are explicit text, never chart-only.
- Financial/destructive actions state consequences and require confirmation.

## Required Test Viewports

```text
320x568
375x812
768x1024
1024x768
1440x900
```

Also test mobile/tablet landscape, keyboard-only, reduced motion, 200% zoom, long Indonesian names/titles, large currency values, empty/loading/error/offline/permission states.
