# Phase 3 Guide Results Prototype Implementation Plan

1. Add unit tests for the pure matcher covering eligibility, normalization, date overlap, preference weighting, deterministic sorting, empty results, and immutability.
2. Add a Home-only mock guide model/data adapter and implement `matchGuides` until all focused tests pass.
3. Extend `RequestGuideDialog` with optional `initialDraft`, cloning values only when it opens and preserving existing validation/layout behavior.
4. Add `RequestSummaryBar` for compact submitted-request details and edit/start-over actions.
5. Add `GuideResults` for deterministic cards and the approved empty state, reusing existing images and valid profile routes.
6. Update `Home` to switch between discovery/results compositions, own the submitted draft, control edit/reset, and focus the results heading after valid submit.
7. Add scoped responsive Home results styles for 1440x900 and 390x844 without changing other routes.
8. Run validation and matching tests, typecheck, production build, `git diff --check`, and browser checks for both Home states, edit behavior, empty state, overflow, dialog/chat behavior, and console cleanliness.
9. Review the final diff for route/scope safeguards and commit the completed Phase 3 implementation on `codex/phase-3-guide-results-prototype`.
