# Phase 9 Final Prototype QA Design

## Purpose

Prepare the completed FriendLocalTrip frontend prototype for a coherent customer review across Traveler, Local Guide, Partner, and Admin roles. Phase 9 fixes presentation, navigation, recovery, accessibility, responsive, testing, and bundle issues without adding product modules or changing approved business rules.

## Approved approach

Use a surgical consolidation approach.

1. Keep approved role flows and their local React contexts intact.
2. Keep six legacy URLs registered, but stop importing or rendering their obsolete compositions.
3. Redirect unambiguous legacy URLs with history replacement and render compact customer-safe recovery pages for ambiguous account/workspace URLs.
4. Normalize shared brand surfaces and customer-visible copy rather than migrating the styling framework.
5. Add route-level lazy loading only for heavy pages that can retain their existing route contract.
6. Use the already-installed `tsx` capability as a direct development dependency so one documented test command executes all source tests.

Rejected alternatives:

- Maintaining and rebranding every legacy page would preserve duplicate flows, retain external assets, and keep the oversized eager bundle.
- Removing legacy URLs would break old links and violate the approved compatibility mapping.
- A broad design-system or routing rewrite would add risk without improving the customer-review journey.

## Architecture

### Routing and legacy compatibility

Create a focused legacy-route module with pure route mapping plus presentation components:

- `/book/:guideId` replaces history with `/booking-handoff/:encodedGuideId`.
- `/guide-dashboard` replaces history with `/local-guide/dashboard`.
- `/match` replaces history with `/?openRequest=1`; Home opens the existing Request Guide dialog once and removes the query with history replacement.
- `/dashboard`, `/signin`, and `/signup` render accessible role/account recovery cards using only approved destination routes.

No legacy link is added to current navigation. Unknown guide handling remains owned by the approved Booking Details page.

### Current route inventory

| Route | Role | Purpose / direct access | Expected navigation | Recovery | Support Chat | Final review |
| --- | --- | --- | --- | --- | --- | --- |
| `/` | Traveler | Home, request dialog, results | Public brand and role entry | Start Over restores Home | Home/results except dialog | Yes |
| `/guides` | Traveler | Browse current guide catalog | Featured Guides | Home/request CTA | No | Supporting |
| `/guides/:id` | Traveler | Rich guide profile | Results and guide cards | Unknown id returns Home | Yes | Yes |
| `/booking-handoff/:guideId` | Traveler | Booking Details | Guide availability CTA | Unknown id returns Home | Yes | Yes |
| `/payment/:guideId` | Traveler | Payment Demo | Booking Details | Missing draft returns to Booking Details | Yes when actionable | Yes |
| `/booking-success/:guideId` | Traveler | Booking confirmation | Payment Demo | Missing booking returns to booking start/Home | Yes when actionable | Yes |
| `/bookings` | Traveler | Seeded and session booking history | Success and detail navigation | Empty state returns Home | Yes | Yes |
| `/bookings/:bookingId` | Traveler | Booking detail and review | History/success | Unknown id returns Bookings | Yes | Yes |
| `/bookings/:bookingId/chat` | Traveler | Eligible booking chat | Booking Detail | Ineligible/unknown returns Bookings | No | Yes |
| `/local-guide` | Local Guide | Hub and role entry | Public Local Guide tab | Registration or dashboard CTA | Yes | Yes |
| `/local-guide/register` | Local Guide | Four-step application | Local Guide Hub | Inline validation and Back | Yes, hidden if conflicting | Yes |
| `/local-guide/application-submitted` | Local Guide | Submitted application summary | Successful registration | No submission returns Register/Hub | Yes | Yes |
| `/local-guide/dashboard` | Local Guide | Seeded guide workspace | Hub/submitted page | Seeded direct access | Hidden on Messages | Yes |
| `/partner` | Partner | Partner role entry | Direct review link | Dashboard CTA | Yes | Yes |
| `/partner/dashboard` | Partner | Seeded partner workspace | Partner Entry | Clipboard fallback text | Overview only | Yes |
| `/admin` | Admin | Admin Demo entry | Direct review link | Dashboard CTA | No | Yes |
| `/admin/dashboard` | Admin | Seeded admin workspace | Admin Entry | Local confirmation/recovery dialogs | No | Yes |
| `/book/:guideId` | Legacy | Compatibility redirect | Old links only | Booking Details handles unknown id | No | No |
| `/guide-dashboard` | Legacy | Compatibility redirect | Old links only | Local Guide Dashboard | No | No |
| `/match` | Legacy | Compatibility redirect | Old links only | Opens Home request dialog | Home behavior | No |
| `/dashboard` | Legacy | Role selection recovery | Old links only | Four current workspaces | No | No |
| `/signin` | Legacy | Authentication-not-required recovery | Old links only | Four role entries | No | No |
| `/signup` | Legacy | Account-type recovery | Old links only | Traveler/Guide/Partner choices | No | No |
| unmatched | Shared | Friendly 404 | Invalid URL | Home and Local Guide choices | No | Supporting |

### Shared visual and copy system

- Use `FriendLocalTrip` on all rendered surfaces and document metadata.
- Keep the existing green, coral, neutral palette, serif display headings, sans-serif interface text, and role-specific workspace personalities.
- Simplify the default Navbar/Footer to current, valid navigation; remove authentication and obsolete marketing anchors from rendered shared navigation.
- Add a compact shared recovery layout rather than inventing a new dashboard or marketing page.
- Preserve internal horizontal rails for guide, partner, and profile navigation; they may scroll inside their container but must not create page-level overflow.

### State and data

- Traveler, Local Guide, Partner, and Admin contexts remain isolated.
- `openRequest=1` is a one-shot navigation signal only. It opens the existing dialog and is removed from the address bar without persistence.
- Seeded identity/rate/booking presentation may be aligned through adapters or constants, but formulas and eligibility rules are unchanged.

### Testing

- Add pure tests for legacy route mapping, query detection, customer-safe route destinations, and direct submitted-state selection.
- Add `tsx` as a direct dev dependency at the already installed version and add `pnpm test` using `tsx --test "src/**/*.test.ts"`.
- Preserve all existing 136 tests and strengthen pure financial/route tests only where audit gaps are found.
- UI behavior is verified through browser journeys and responsive matrices, not weakened into implementation-detail tests.

### Performance

Use `React.lazy` and `Suspense` for heavy role pages and rich Traveler pages while keeping the Wouter route table and context order unchanged. A small branded loading state is shared by lazy routes. Direct access, Back behavior, and console output must remain clean. The change is accepted only if production chunk output improves and all routes pass browser smoke tests.

### Accessibility and recovery

- Recovery pages use one `main`, one `h1`, explanatory text, and semantic links.
- Dialog names, error descriptions, fieldset legends, selected states, focus styles, status text, and live feedback are audited without relying on color.
- Direct application-submitted access without state no longer claims that an application was submitted.
- Support Chat is hidden in dense messaging surfaces and receives safe spacing where it overlaps content.
- Reduced-motion behavior is preserved or added for smooth-scroll interactions.

### Verification artifacts

Screenshots are written outside tracked source unless an existing documentation convention requires otherwise. The final guide at `docs/superpowers/final/friendlocaltrip-prototype-review-guide.md` records review routes, seeded values, empty-state scenarios, limitations, device recommendations, and the screenshot checklist.

## Constraints

- No backend, API, database, authentication, permissions, persistence, real payments, payouts, notifications, uploads, analytics, or new product modules.
- No change to matching, registration, booking validation, IDs, chat eligibility, review validation, Traveler 5% fee, Guide 10% fee, Partner 5% commission, or Admin revenue formula.
- No dependency other than making the already-installed lightweight `tsx` runner explicit.
- No merge, rebase, or push in Phase 9.
