# Phase 7.1 Local Guide UX/UI Polish Design

## Goal

Refine the existing Local Guide hub, four-step registration, submitted state, and seven-panel dashboard into a concise premium workspace that matches FriendLocalTrip's approved visual language without changing Phase 7 logic.

## Audit-driven approach

The current UI has a sound route and state foundation, but several presentation contracts are misaligned: registration markup does not match its CSS, the submitted page contains misleading real-review copy, and dashboard panels lack operational hierarchy. A CSS-only pass cannot repair those structural issues, while a shared design-system refactor would be too broad. Phase 7.1 therefore uses targeted presentation restructuring within the existing Local Guide routes and `lg-` class namespace.

## Architecture

- Keep `LocalGuidePrototypeContext`, registration validation, completeness calculation, booking mutations, earnings calculations, seeded data, and routes unchanged.
- Add pure presentation metadata/helpers for dashboard navigation, attention ordering, registration review grouping, status labels, and mobile transaction rows.
- Keep page-level local UI state for active dashboard panel, expanded booking, active conversation, composer, preview disclosure, and prototype-only save feedback.
- Reuse existing assets and the approved Navbar/Footer/Support Chat components.
- Restrict styling to `local-guide.css` and `lg-` selectors.

## Route design

### Hub

A compact two-column hero pairs the approved copy/actions with an existing guide-focused image. Four concise benefits and three lightweight steps remain visible without turning the page into a long marketing landing page.

### Registration

Desktop uses a bounded 68/32 form-and-preview layout beneath a compact accessible stepper. Mobile uses a step count, progress bar, one-column form, and collapsible preview. Existing fields are grouped into smaller semantic cards; the weekly schedule becomes compact rows/cards; a single stable bottom action region preserves existing validation and submit behavior.

### Submitted

The page communicates a deterministic demo status, optional application reference, compact summary/checklist, and one primary plus secondary/text actions. It explicitly states that no application or document was sent.

### Dashboard

Desktop uses a 240px operational sidebar; tablet/mobile uses a contained horizontal navigation rail. Every panel gets a consistent compact header. Overview prioritizes four metrics and action-required content. Bookings, Availability, Earnings, Messages, Reviews, and Profile retain their existing state/data while receiving responsive panel-specific layouts. Global Support Chat is omitted on Messages and safe on other panels.

## Accessibility and responsive behavior

- Registration and dashboard navigation expose current/selected state in text and ARIA.
- Buttons, inputs, legends, tables, conversation controls, and focus states remain semantic and keyboard reachable.
- Mobile rails scroll internally; tables convert to cards; no page-level horizontal scrolling is introduced.
- Sticky elements remain below Navbar and are disabled on narrow viewports.
- Reduced motion removes nonessential transitions.

## Scope

No Phase 8, backend, API, persistence, authentication, real upload, payout, notification, new route, dependency, state manager, Traveler change, or data-model change.

