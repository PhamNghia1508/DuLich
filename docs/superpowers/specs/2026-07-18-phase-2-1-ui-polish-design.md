# FriendLocalTrip Phase 2.1 UI Polish Design

## Goal

Make the approved Traveler Home prototype more compact and make the existing Request Guide dialog easier to use without changing Phase 2 data, validation, submission, routing, or dismissal behavior.

## Approved approach

- Keep the current Home component boundaries and shared-layout variants.
- Compact Home through scoped `.home-*` CSS overrides; do not alter shared route styling.
- Remove the Featured Guides marketplace eyebrow without replacing it with marketing copy.
- Preserve the controlled Radix Dialog and its form handlers. Restructure only its markup into a fixed header, an internally scrollable form body, and a fixed footer inside the form.
- Hide Support Chat by conditionally suspending its Home render while the dialog is open. On mobile, place the chat control in normal document flow with safe margins so it cannot cover Featured Guides content.
- Preserve all existing fields, `RequestGuideDraft`, validation rules, callback behavior, overlay click, Escape handling, and focus management.

## Layout details

### Home

- Reduce desktop Hero padding by roughly 15–20%, lower the headline maximum size, reduce the visual from 470px to about 425px, and tighten the gap before Featured Guides.
- On mobile, reduce the Home Navbar stack height and Hero spacing while retaining two readable tabs, a readable headline, and the full-width CTA.
- Keep the Navbar logo and Hero eyebrow. Remove the Featured Guides eyebrow so `Meet Your Local Friends` is the first section label.

### Request Guide dialog

- The dialog is a flex column capped at 88–90vh with `overflow: hidden`.
- Header and close button stay visible.
- The form is a flex column with a `.request-form-body` as the sole scrolling area.
- The footer remains visible and contains the unchanged submit button.
- Desktop retains the two-column grid and centered width.
- Mobile uses compact 0.5rem outer margins, `100dvh`-based height, safe-area padding, one-column fields, and a full-width submit button.
- Body bottom padding ensures the textarea remains fully reachable above the footer.

## Scope and verification

- No dependencies, routes, fields, API calls, matching/results UI, persistence, or backend work.
- Existing marketing source files remain untouched.
- Verify validation tests, typecheck, build, `git diff --check`, desktop UI, and mobile 390×844 UI.
- Browser checks must confirm no horizontal overflow, fixed dialog header/footer during body scrolling, reachable textarea, and hidden Support Chat while open.
