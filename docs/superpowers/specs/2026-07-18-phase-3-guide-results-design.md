# Phase 3 Guide Results Prototype Design

## Scope

Phase 3 adds a second, local-only Home state after a valid request. It preserves the Phase 2.1 discovery state and request dialog behavior, and does not add backend, persistence, navigation, selection, booking, or payment behavior.

## State and flow

- `Home` owns the last successfully submitted `RequestGuideDraft` and dialog open state.
- With no submitted draft, Home composes the existing compact Hero and Featured Guides.
- With a submitted draft, Home replaces those two sections with a compact results intro, request summary, and deterministic guide results.
- `Edit Request` opens the existing dialog with a cloned submitted draft. Unsaved dialog edits never mutate Home state.
- A valid resubmit atomically replaces the submitted draft, closes the dialog, recomputes results, and focuses the results heading.
- `Start Over` clears the submitted draft and restores the Phase 2.1 Home composition without reloading.

## Data design

The shared `Guide` type and centralized `GUIDES` data remain unchanged. A Home-only `MockGuide` adapter reuses existing guide IDs, images, names, ratings, rates, and languages, while providing prototype-only fields:

- `serviceAreas`
- normalized request preference labels
- `active` / `verified`
- optional unavailable date ranges
- response-time display data

Additional Home-only mock profiles reuse existing local images where necessary so the prototype covers every Request Form language and the approved destinations/preferences without changing route-facing data.

## Matching design

`matchGuides(request, guides)` is a pure deterministic function outside React.

Eligibility excludes inactive, unverified, language-incompatible, and date-unavailable guides. Destination comparison is trimmed, case-insensitive, and supports simple bidirectional partial matching against city and service areas. Unknown destinations are safe and receive no location points.

Eligible guides receive up to 100 internal points:

- destination/city or service-area match: 35
- language overlap: 30
- preference overlap: 25
- rating and response quality: 10

Results sort by score descending, rating descending, then name ascending. The score is not displayed. Friendly reasons are derived from the same matching evidence.

## UI design

- `RequestSummaryBar` shows destination, date range, group size, languages, and at most two preferences. Additional Information is intentionally omitted.
- `GuideResults` renders three to six responsive cards, or the approved empty state.
- The first result alone receives `Best Match`; cards show no selection or booking action.
- Existing profile links are used only for IDs that already resolve through `/guides/:id`.
- Footer and Support Chat remain; Support Chat is still hidden whenever the dialog is open.
- Results heading uses programmatic focus after submit for an accessible, non-disruptive state transition.

## Route and architecture safeguards

Only Home composition, Home components, Home styling, and Home-local mock matching are changed. `App.tsx`, `/match`, guide pages, booking, dashboards, admin, authentication, shared state, and shared guide model remain untouched. No dependencies are added.
