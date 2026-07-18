# Phase 5.2 Availability Calendar Restoration Design

## Goal

Restore the rich seven-day availability calendar on Guide Profile while preserving the existing Phase 5 booking, payment, success, matching, and routing behavior.

## Architecture

`richGuideProfileData.ts` owns a deterministic, immutable seven-day schedule model. `PrototypeGuideProfile` owns the profile-only selection state (date, time, duration, and group size) and shares it with the calendar and booking sidebar. The profile route converts that selection into the existing `PrototypeBookingDraft`, saves it through `TravelerPrototypeContext`, then navigates to the existing booking handoff route.

## UI

- Replace date cards with a seven-day horizontal rail.
- Render 13 time slots for the selected day with available, hold, and booked states.
- Keep booked slots disabled; available and hold slots selectable.
- Use text, borders/patterns, and color so state is not color-only.
- Replace the sidebar date/time selects with one shared-state schedule summary.
- Keep duration, group size, pricing, and Continue to Booking.
- On mobile, contain horizontal scrolling within the date rail and make the sidebar non-sticky.

## State and handoff

Changing dates retains a selected time only when that time is selectable on the new day. The profile never creates a booking or calls an API. Continue to Booking saves optional schedule defaults into the existing draft shape and leaves Booking Details authoritative.

## Scope

No changes to booking validation, payment, success, matching, request results, routes, dependencies, or backend behavior.

