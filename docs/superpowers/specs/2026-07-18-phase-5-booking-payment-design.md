# Phase 5 Booking and Payment Prototype Design

## Scope

Phase 5 extends the mounted traveler prototype from guide selection through booking details, demo payment selection, and a confirmed mock booking. It remains frontend-only: all data lives in React Context or local component state, no personal information is transmitted, and refresh may clear the flow.

Chat and Booking History are explicitly excluded and remain Phase 6 work.

## Route decision

The current traveler flow already owns `/booking-handoff/:guideId`; it will become the complete Booking Details screen. Two isolated routes will be added:

- `/payment/:guideId` for review and demo payment selection;
- `/booking-success/:guideId` for the confirmed mock booking.

The unrelated legacy `/book/:guideId` route stays unchanged. Reusing it would inherit browser alerts, random references, legacy booking copy, and production-like concepts that conflict with this prototype.

Separate routes are preferred over an internal wizard because browser/back navigation remains understandable and direct-route recovery can be handled per step. A single-page wizard was considered but rejected because it would concentrate three screens and their validation into one component.

## State and data flow

`TravelerPrototypeContext` will retain the existing request, recommendation, and selected guide values and add:

- `bookingDraft: PrototypeBookingDraft | null`;
- `paymentMethod: PrototypePaymentMethod | null`;
- `confirmedBooking: PrototypeBooking | null`;
- setters for saving the draft, payment choice, and confirmed booking.

Submitting a new request or Start Over clears downstream booking state. Choosing a guide also clears any stale booking/payment/confirmation belonging to a previous selection.

Booking Details resolves the guide from the URL, not only Context. With request context it prefills date, group size, destination, languages, and the first supported request experience. Without request context it shows a friendly notice and initializes safe manual defaults. Unknown guides render a friendly not-found state.

Payment requires a saved booking draft for the same guide. Direct access without one shows a recovery state linking to Booking Details. Back navigation returns to Booking Details with Context values preserved. Success similarly requires a confirmed booking for the same guide.

## Pure booking model

`bookingPrototype.ts` will own all deterministic behavior and remain independent of React:

- supported durations: `2 | 3 | 4 | 6 | 8` hours;
- `subtotal = hourlyRate * durationHours`;
- `serviceFee = subtotal * 0.05`, rounded to currency precision;
- `total = subtotal + serviceFee`;
- invalid rates/durations produce a safe zero breakdown, never `NaN` or negative values;
- date-range and deterministic guide-availability validation;
- booking-draft normalization and inline validation;
- payment validation;
- immutable confirmed-booking creation.

The booking reference is deterministic: `FLT-<GUIDE TOKEN>-<YYYYMMDD>`, derived only from the normalized guide id and booking date. No random values or timestamps are used.

## Booking Details presentation

Desktop uses a form column with a stable summary column. Mobile uses one column and places the price/action summary after fields. The page includes:

- compact header and Back to Guide;
- selected guide identity, rate, rating, languages, and up to two existing recommendation reasons;
- compact read-only request summary or a direct-access notice;
- booking date, start time, duration, one supported experience;
- meeting point, contact name/email/optional phone, optional notes;
- concise policies and 5% price breakdown;
- inline, field-associated validation and “Continue to Payment”.

No full Request form, booking API, alert, authentication, real availability engine, or personal-data transmission is introduced.

## Payment and success presentation

Payment shows the complete booking summary and three clearly labeled demo methods: Card — Demo, PayPal — Demo, and Pay at meeting — Prototype. It never shows card-number, credential, or gateway fields. Confirmation requires both a method and the prototype acknowledgment.

Success uses an accessible status region and shows the deterministic reference, guide, schedule, meeting point, total, demo payment method, and Confirmed status. “View Booking” targets the same detail section on the success screen; “Back to Home” resets no state. Chat appears only as informational Phase 6 copy.

## Responsive, accessibility, and support

All editable controls have labels and `aria-describedby` links to inline errors. Radio methods and acknowledgment use native keyboard-accessible controls. Cards use `min-width: 0`, wrapping chips, and mobile-safe action layouts. Support Chat remains unchanged and page bottom spacing prevents it from covering actions; no Phase 5 modal is introduced.

## Testing and verification

Node unit tests cover price math, date bounds, unavailable dates, normalization, deterministic references, payment rules, immutability, and missing guides. Browser verification covers direct/recovery states and the mounted booking → payment → back → confirm → success flow at 1440×900 and 320/375/390×844, including overflow and console checks.
