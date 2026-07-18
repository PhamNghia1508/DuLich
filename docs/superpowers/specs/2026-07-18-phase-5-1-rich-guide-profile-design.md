# Phase 5.1 Rich Guide Profile Design

## Goal

Restore the pre-Phase-4 marketplace depth on `/guides/:id` while preserving the Phase 3 request/results state and the complete Phase 5 booking, payment, and success flow.

## Audit

The former rich profile was composed in `src/app/guides/[id]/page.tsx` from the components under `src/components/guides/profile/`. Phase 4 replaced that route composition with `PrototypeGuideProfile.tsx` and a smaller normalized `PrototypeGuideProfile` data contract. The legacy components remain useful visual references, but many consume the older `Guide` type, assume legacy data exists, or contain Linh-specific and obsolete branding copy.

The safe restoration path is to preserve the current route controller and Context, introduce a deterministic rich presentation mapper for all 11 `MOCK_GUIDES`, and compose focused rich-profile sections from that view model. The sidebar remains a local preview only; its CTA selects the guide and opens the existing `/booking-handoff/:guideId` route.

## Architecture

- `richGuideProfileData.ts` maps current normalized guide data into a complete immutable `RichGuideProfileViewModel`.
- `PrototypeGuideProfile.tsx` becomes a thin composition/controller for local profile-only controls.
- Focused rich-profile components render hero/recommendation, booking preview, marketplace content sections, and related guides.
- `src/app/guides/[id]/page.tsx` keeps route lookup, recommendation Context lookup, selected-guide state, and navigation.
- Existing Booking Details, Payment Demo, Booking Success, matching rules, validation, pricing, and booking-reference code remain unchanged.

## View Model

Every known guide receives deterministic fields for identity, trust, biography, experiences, gallery, video preview, availability, credentials, reviews, and related cards. Legacy rich data is used when it matches the current guide id; otherwise guide-specific fallbacks are derived from stable guide id/index inputs. No random values or source mutation are allowed.

## Interaction

- Back to Results navigates to `/` without clearing Context.
- Continue to Booking calls the existing `selectGuide(id)` path and navigates to `/booking-handoff/:guideId`.
- Profile duration, group, date, and time controls are local presentation state only.
- Availability controls may update the local preview but never create a booking.
- Message Guide remains disabled with explanatory copy.

## Responsive Design

Desktop uses a wide content column and sticky booking preview sidebar. Mobile uses a single column, a normal non-sticky booking card, stacked experiences/reviews, a safe gallery grid, wrapping chips, and additional bottom spacing for Support Chat. The approved FriendLocalTrip header remains route-specific through the current `home` Navbar variant.

## Testing

Focused pure-function tests cover all 11 ids, unknown ids, deterministic fallbacks, recommendations, immutability, related-guide exclusion, handoff identity, and direct access without request context. The existing 32 tests must remain green, followed by typecheck, production build, browser verification, console checks, and `git diff --check`.

## Non-Goals

No Chat, Booking History, API, backend, authentication, persistence, real calendar, real payment, new state system, or new dependency is introduced.
