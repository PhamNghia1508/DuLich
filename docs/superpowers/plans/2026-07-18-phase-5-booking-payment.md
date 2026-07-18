# Phase 5 Booking and Payment Prototype Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Extend the mounted traveler prototype from guide selection through validated booking details, demo payment, and deterministic booking success.

**Architecture:** Keep `/booking-handoff/:guideId` as Booking Details and add `/payment/:guideId` plus `/booking-success/:guideId`. Pure utilities own price, date, validation, and confirmation behavior; `TravelerPrototypeContext` owns only mounted-session draft/payment/confirmation state.

**Tech Stack:** React, TypeScript, Wouter, existing CSS tokens, Node test runner, deterministic local mock data.

## Global Constraints

- Frontend-only mock data, React Context, and local state.
- No backend, API, database, persistence, authentication, real payment, card collection, Chat, Booking History, or new dependency.
- Preserve Phase 2–4 behavior and leave `/book/:guideId` unchanged.
- No `Math.random`, browser alerts, or external pricing/payment calls.
- Service fee is exactly 5% of subtotal.

---

### Task 1: Pure booking and payment model

**Files:**
- Create: `artifacts/localink/src/components/traveler/bookingPrototype.test.ts`
- Create: `artifacts/localink/src/components/traveler/bookingPrototype.ts`

**Interfaces:**
- Produces: `PrototypeBookingDraft`, `PrototypePaymentMethod`, `PrototypeBooking`, `calculatePrototypePrice`, `createInitialBookingDraft`, `validatePrototypeBookingDraft`, `validatePrototypePayment`, `createPrototypeBooking`, `isBookingDateWithinRequest`, and `isGuideAvailableOnDate`.
- Consumes: `RequestGuideDraft` and `PrototypeGuideProfile`.

- [ ] **Step 1: Write failing tests**

Add tests for 2/3/4/6/8-hour totals, 5% fee, invalid numeric inputs, inside/outside request dates, unavailable dates, normalized defaults, deterministic reference, both payment requirements, immutable confirmation, and unknown-guide lookup behavior.

- [ ] **Step 2: Confirm RED**

Run: `node --experimental-strip-types --test src/components/traveler/bookingPrototype.test.ts`

Expected: fail because `bookingPrototype.ts` does not exist.

- [ ] **Step 3: Implement the model**

Use these public shapes:

```ts
type PrototypeDurationHours = 2 | 3 | 4 | 6 | 8;
type PrototypePaymentMethod = 'card-demo' | 'paypal-demo' | 'pay-later-demo';

interface PrototypeBookingDraft {
  guideId: string;
  bookingDate: string;
  startTime: string;
  durationHours: PrototypeDurationHours;
  meetingPoint: string;
  contactName: string;
  contactEmail: string;
  contactPhone: string;
  experiencePreference: string;
  notes: string;
  groupSize: number;
  price: PrototypePriceBreakdown;
}
```

Normalize safe values, round fee/total to two decimals, and derive `FLT-${guideToken}-${bookingDateWithoutDashes}`.

- [ ] **Step 4: Confirm GREEN and commit**

Run the focused test, then typecheck. Commit with `feat: add booking prototype model`.

### Task 2: Extend mounted traveler context

**Files:**
- Modify: `artifacts/localink/src/components/traveler/TravelerPrototypeContext.tsx`
- Modify: `artifacts/localink/src/app/guides/[id]/page.tsx`

**Interfaces:**
- Produces: `bookingDraft`, `paymentMethod`, `confirmedBooking`, `saveBookingDraft`, `setPaymentMethod`, and `confirmBooking` through `useTravelerPrototype()`.
- Consumes: Task 1 types.

- [ ] **Step 1: Add downstream booking state**

Extend Context with nullable values and typed setters. `submitRequest`, `selectGuide`, and `resetPrototype` clear stale downstream booking state; `setRecommendation` remains unchanged.

- [ ] **Step 2: Keep guide selection deterministic**

`Choose This Guide` continues selecting the route guide and navigating to `/booking-handoff/:guideId`; selecting a different guide clears stale booking data.

- [ ] **Step 3: Run all unit tests and typecheck, then commit**

Expected: Phase 2–5 unit tests remain green. Commit with `feat: preserve booking flow context`.

### Task 3: Replace handoff with Booking Details

**Files:**
- Replace: `artifacts/localink/src/app/booking-handoff/[guideId]/page.tsx`
- Replace: `artifacts/localink/src/app/booking-handoff/[guideId]/booking-handoff.css`
- Create: `artifacts/localink/src/components/traveler/BookingDetailsForm.tsx`
- Create: `artifacts/localink/src/components/traveler/BookingPriceSummary.tsx`

**Interfaces:**
- Consumes: normalized guide lookup, request/recommendation/context state, and Task 1 utilities.
- Produces: saved validated draft followed by navigation to `/payment/:guideId`.

- [ ] **Step 1: Render route-safe shell**

Resolve the guide by URL. Unknown guides show Back to Home. Direct access shows a no-request notice and manual booking fields.

- [ ] **Step 2: Build labeled controlled fields**

Prefill request start date, group size, and first supported request experience. Render date, time, duration, supported experience, meeting point, contact name/email/phone, and notes. Associate every inline error with its field.

- [ ] **Step 3: Add guide/request/policy summaries**

Show compact guide facts, up to two matching reasons, read-only request context, and the four approved policy lines. Do not add Edit Request.

- [ ] **Step 4: Validate and continue**

On submit, call `validatePrototypeBookingDraft`; save only valid drafts and navigate to Payment. No alert or API.

- [ ] **Step 5: Implement responsive CSS and commit**

Desktop: two columns with stable summary. Mobile: one column, 44px controls, wrapping chips, no sticky overlay. Commit with `feat: build booking details prototype`.

### Task 4: Payment prototype

**Files:**
- Create: `artifacts/localink/src/app/payment/[guideId]/page.tsx`
- Create: `artifacts/localink/src/app/payment/[guideId]/payment.css`
- Create: `artifacts/localink/src/components/traveler/PaymentMethodSelector.tsx`
- Modify: `artifacts/localink/src/App.tsx`

**Interfaces:**
- Consumes: booking draft, guide lookup, Context payment state, Task 1 payment validation/confirmation.
- Produces: confirmed booking and navigation to `/booking-success/:guideId`.

- [ ] **Step 1: Register and guard the route**

Add `/payment/:guideId`. Missing/other-guide drafts show recovery links to Booking Details and Home.

- [ ] **Step 2: Render review summary**

Show guide, schedule, duration, meeting point, experience, group size, and exact price breakdown from the saved draft.

- [ ] **Step 3: Render demo-only payment controls**

Use a native radio group for `card-demo`, `paypal-demo`, `pay-later-demo`; label each Demo/Prototype. Add the required prototype acknowledgment checkbox and no credential fields.

- [ ] **Step 4: Validate, confirm, and commit**

Show inline method/acknowledgment errors. Create an immutable confirmed booking, save it in Context, and navigate to success. Commit with `feat: add demo payment step`.

### Task 5: Booking success

**Files:**
- Create: `artifacts/localink/src/app/booking-success/[guideId]/page.tsx`
- Create: `artifacts/localink/src/app/booking-success/[guideId]/booking-success.css`
- Modify: `artifacts/localink/src/App.tsx`

**Interfaces:**
- Consumes: confirmed booking and normalized guide.
- Produces: mounted-session confirmed detail view only.

- [ ] **Step 1: Guard direct/mismatched access**

Show a friendly recovery state when the confirmed booking is absent or belongs to another guide.

- [ ] **Step 2: Render accessible confirmation**

Use `role="status"` for “Your local experience is reserved.” Show reference, guide, date/time, duration, meeting point, total, demo payment label, and Confirmed status.

- [ ] **Step 3: Add scoped actions and commit**

“View Booking” targets the visible booking detail card; “Back to Home” returns to `/`. Render only informational Phase 6 chat copy. Commit with `feat: add booking success prototype`.

### Task 6: Verification and scope review

**Files:**
- Review all Phase 5 files and confirm `/book/:guideId` and unrelated routes have no diff.

- [ ] **Step 1: Run all unit tests**

Run: `node --experimental-strip-types --test src/components/home/*.test.ts src/components/traveler/*.test.ts`

- [ ] **Step 2: Run typecheck, build, diff hygiene, and audit**

Run: `pnpm run typecheck`, `pnpm run build`, `git diff --check`, and `pnpm audit`. Run lint only if `package.json` defines it.

- [ ] **Step 3: Browser verification**

Verify booking prefill, inline errors, calculated price, payment/back preservation, success, direct/recovery/unknown states, Support Chat spacing, console cleanliness, and overflow at 1440×900 plus 320/375/390×844.

- [ ] **Step 4: Final scope commit**

Inspect every changed file, confirm no API/payment request and no Chat/Booking History UI, then commit any final Phase 5 polish without pushing or merging.
