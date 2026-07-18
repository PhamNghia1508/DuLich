# FriendLocalTrip Phase 2 — Request Guide Dialog

## Goal

Create a short, customer-reviewable Traveler Home prototype where the Request Form is hidden by default and opens from the single primary CTA, **Request a Local Guide**. This phase remains frontend-only and stops before guide matching or results.

## Scope

Home keeps only:

- A minimal Navbar with the FriendLocalTrip brand and two tabs: **For Travelers** and **Local Guide**.
- A short Hero with brand identity, a concise slogan, and one primary CTA: **Request a Local Guide**.
- Three compact trust badges directly below the CTA: **Verified Guides**, **4.9+ Rating**, and **24/7 Support**.
- The existing Featured Guides content, presented as **Meet Your Local Friends** in a single row or horizontal mobile rail.
- A minimal Footer and a Support Chat control.

Home no longer renders the existing long-form marketing sections, including How It Works, Experience Categories, Safety/Why Choose Us content, Testimonials, final marketing CTA, and partner/become-a-guide content. Their source files remain intact.

No route outside Home is changed. In particular, `/match`, `/guides`, Guide Detail, Booking, Dashboard, Admin, and authentication remain untouched.

## Component Design

### Home

`src/app/page.tsx` owns:

- Whether the Request dialog is open.
- The most recently submitted `requestDraft` in local React state for a future Phase 3 callback.
- The reduced Home composition.

No request data is persisted outside the mounted Home component.

### Navbar

The existing shared Navbar is simplified to:

- FriendLocalTrip logo/brand.
- **For Travelers** tab linking to Home.
- **Local Guide** tab linking to the existing guide-facing route.

It does not add a traditional multi-item menu. Existing shared-route behavior must be checked because Navbar is used outside Home.

### Hero and Trust Badges

Hero receives an `onRequestGuide` callback and renders exactly one action button. It does not navigate to `/match`.

The trust indicators are compact supporting items within or immediately below the Hero CTA, rather than a standalone statistics section.

### RequestGuideDialog

A new focused component uses the existing Radix Dialog primitives. It provides:

- Centered desktop dialog.
- Near-full-screen mobile dialog with internal vertical scrolling.
- Visible close control.
- Overlay click, Escape dismissal, and focus management supplied by Radix.
- A two-column desktop form and one-column mobile form.

Fields:

- Destination / Area — text, required.
- Languages — multi-select checkboxes, at least one required.
- Group Size — number, required and greater than zero.
- Start Date — required.
- End Date — required and not before Start Date.
- Experience Preferences — mock multi-select options: Food & Culture, Shopping, History, Nature, Nightlife, Local Life, Surprise Me.
- Additional Information — optional textarea.

The only submit action is **Find My Local Guide**.

## State and Submission

The dialog owns editable form state and inline validation errors. On valid submit it calls:

```ts
onSubmit(requestDraft)
```

Home stores that draft in local `useState` and closes the dialog. Phase 2 does not navigate, call an API, calculate matches, or display guide results.

Closing without submitting discards unsaved edits when the dialog is opened again. A successful draft stays only in Home state as a Phase 3 handoff point.

## Validation

Validation runs on submit and reports small messages beneath the relevant fields. Browser alerts are not used.

Rules:

- Destination must contain non-whitespace text.
- At least one language must be selected.
- Group Size must be a finite number greater than zero.
- Start Date and End Date are required.
- End Date must be the same as or later than Start Date.

## Responsive and Accessibility

- Mobile-first single-column fields; two columns at the existing desktop breakpoint.
- Dialog content stays within the viewport and scrolls internally on short/mobile screens.
- Every field has an associated label.
- Validation errors are associated with their inputs and announced accessibly.
- The close button has a visible icon and accessible name.
- Complex animations are not added.

## Verification

Verification includes:

- Tests for required validation and valid callback payload where supported by the existing test setup.
- Desktop and mobile dialog layout checks.
- Escape and close-button dismissal checks.
- Confirmation that Home no longer renders the excluded marketing sections.
- The available project scripts: typecheck and build. Lint runs only if a lint script exists.

## Explicit Non-Goals

- Backend, database, API service, authentication, persistence, matching engine, results, booking, payment, Guide Dashboard, Admin Dashboard, or new state-management dependencies.
- Refactoring unrelated routes or replacing the existing framework/UI stack.
