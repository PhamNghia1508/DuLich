# Phase 8 Partner and Admin Dashboard Design

## Objective

Add customer-reviewable Partner and Admin workspaces without changing any approved Traveler or Local Guide route, state, validation, matching, booking, payment, chat, review, or fee calculation.

## Routes

- `/partner`: concise Partner entry.
- `/partner/dashboard`: Partner workspace.
- `/admin`: replaces the obsolete monolithic Admin composition with a concise Admin entry.
- `/admin/dashboard`: Admin workspace.

No alternate Partner/Admin route names are introduced.

## Architecture

Partner and Admin remain isolated roles. `PartnerPrototypeContext` owns only Partner shared interactions. `AdminPrototypeContext` owns only Admin-local verification decisions, notes, report statuses, and settings drafts. Both may consume deterministic adapters built from existing read-only mock data, but neither mutates Traveler or Local Guide contexts.

A shared `RoleDashboardShell` provides structural presentation only: role header, desktop sidebar, mobile navigation behavior, selected-state semantics, and the content viewport. Navigation configuration, colors, labels, and business panels remain role-specific.

## Partner Workspace

The Partner entry is a short brand page with two actions, three benefits, and three referral steps. The dashboard contains Overview, Referral Tools, Bookings, Commissions, Reports, and Partner Profile.

Partner data is deterministic and contains one seeded hotel, four referral campaigns, eight referred bookings, commission entries, and monthly report rows. Copy feedback is local UI state. The QR is a deterministic accessible SVG/CSS-style prototype and performs no tracking.

The commission rule is:

```text
partnerCommission = eligibleCompletedBookingTotal × 0.05
```

Only eligible completed bookings create commission. Cancelled bookings have zero commission or a reversed zero-value presentation. Pending and confirmed bookings are not available commission.

## Admin Workspace

The Admin entry explicitly states that it is a frontend-only demo and links to the dashboard. The dashboard contains Overview, Travelers, Guides, Partners, Requests, Bookings, Payments, Reports, and Settings.

The Admin context updates seeded local arrays immutably. Guide rejection uses the existing Radix AlertDialog. Request Changes requires a note. Notes and report status changes stay in local React state. Settings reset to deterministic defaults and are never applied to other contexts.

Admin matching previews call the existing `matchGuides()` unchanged against deterministic seeded request adapters.

## Financial Presentation

Financial summary utilities keep each value separate:

- Gross Booking Value: reporting metric only.
- Traveler Service Fee: existing 5% service-fee values from booking price data.
- Guide Platform Fee: existing 10% guide fee presentation.
- Partner Commission Expense: 5% only for eligible completed referred bookings.
- Prototype Platform Revenue:

```text
travelerServiceFees + guidePlatformFees - partnerCommissionExpense
```

Gross Booking Value is never added to platform revenue. Existing Traveler totals and Guide calculations are not modified.

## Responsive and Accessibility

Partner uses a horizontal mobile navigation rail. Admin uses a compact disclosure menu on tablet/mobile so nine items are not forced into a row. Desktop uses a 220–260px sidebar. Tables become mobile cards or retain bounded internal scrolling. No page-level horizontal overflow is allowed at 320, 375, 390, 768, 1366, or 1440px.

Navigation exposes selected state. Filters expose pressed state. Status always includes text. Radix dialogs retain focus management and Escape dismissal. Notes have labels. Copy feedback uses an `aria-live` region. Admin never renders floating Support Chat; Partner renders it only where it does not cover dense controls.

## Testing

Pure Partner and Admin data operations are implemented test-first. The repository contains eight existing test files: seven are executable with Node's current TypeScript stripping and one rich-profile file contains 21 tests that import TSX and require a TSX-capable runner. Phase 8 reporting keeps discovered, executed, passed, and incompatible counts separate.

## Scope Boundary

No backend, API, database, authentication, persistence, real QR tracking, analytics, commissions, payouts, refunds, notification delivery, or Phase 9 work is introduced.
