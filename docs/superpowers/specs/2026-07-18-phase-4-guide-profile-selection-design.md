# Phase 4 Guide Profile and Selection Design

## Scope

Phase 4 extends the existing traveler-only prototype from deterministic guide results to a customer-reviewable guide profile, guide selection, and a booking handoff placeholder. It remains frontend-only and stops before booking details, confirmation, authentication, payment, persistence, API calls, or backend work.

## Existing-route decision

The project already routes `/guides/:id` to a long profile composition that contains booking controls, authentication redirects, messaging, and scheduling interactions. Reusing that composition would expose Phase 5 behavior and conflict with the Phase 4 non-goals.

The implementation will:

- Preserve the valid `/guides/:id` route structure.
- Replace only that route's composition with a focused traveler prototype profile.
- Leave the existing `/guides`, `/book/:guideId`, dashboard, admin, match, and authentication routes unchanged.
- Add the isolated `/booking-handoff/:guideId` route for the approved placeholder. It does not conflict with the existing booking route and does not create a booking.

## State and navigation

`TravelerPrototypeProvider` will live above the Wouter switch and keep three in-memory values during the mounted session:

- the successfully submitted `RequestGuideDraft`;
- the recommendation context for the guide opened from results, including up to two existing match reasons;
- the selected guide id.

Home will consume this context instead of owning the submitted draft directly. Dialog-open state remains local to Home. Results links will set the recommendation context before navigating to `/guides/:id`. Returning to `/` therefore restores the existing results state. Browser reload intentionally clears the context because persistence is out of scope.

Direct `/guides/:id` access remains safe: the profile is looked up from deterministic mock data, and the recommendation banner is omitted when no matching context exists.

## Profile data

A pure profile-data module will normalize the existing `MOCK_GUIDES`, `GUIDES`, and `REVIEWS` sources into a reusable `PrototypeGuideProfile` model. Existing bios, local images, ratings, response times, prices, languages, and experience preferences will be reused. Deterministic local fallbacks will provide gallery media, concise reviews, experience years, and a small availability list where the current data does not contain suitable local-only content.

No complete guide objects will be duplicated in JSX. Prototype-only Phase 3 guides will receive safe profile identifiers and normalized fallback profiles so every rendered View Profile action has a valid destination.

## Profile presentation

The profile uses the existing FriendLocalTrip visual tokens and default shared Navbar/Footer without changing their global behavior. The composition contains:

- compact profile hero and key facts;
- optional “Recommended for your trip” banner with existing match reasons;
- About, supported experiences, languages, local-only media, deterministic availability, reviews, and compact trust details;
- a desktop summary/action card and a mobile-first single-column layout;
- “Choose This Guide” and “Back to Results” actions only.

The page avoids booking fields, payment copy, chat, authentication prompts, and technical scores. Support Chat remains available with sufficient bottom spacing.

## Booking handoff

Choosing a guide stores the guide id in the provider and navigates to `/booking-handoff/:guideId`. The placeholder shows the selected guide, the current request summary when available, and the exact message “Booking details will be completed in the next step.” It includes navigation back to the guide or results but no booking or payment action.

## Error handling

Unknown guide ids on either profile or handoff routes render a friendly not-found state with navigation back to Home. No component throws for missing mock data.

## Testing

Pure unit tests will cover profile lookup, missing ids, normalization, recommendation filtering for direct access, and handoff data. Existing request, matching, and reason-presentation tests must remain green. Browser verification will cover the full flow, direct and missing profile access, desktop 1440×900, mobile 320/375/390×844, overflow, action spacing, and console cleanliness.

## Alternatives considered

1. Reuse the current full profile and booking card: rejected because it exposes authentication, messaging, scheduling, and production-style booking behavior.
2. Add a query-parameter mode inside the existing profile: rejected because it would keep two conflicting compositions and increase conditional complexity.
3. Keep `/guides/:id` but replace its page composition with the Phase 4 profile and use a separate handoff route: selected because it preserves valid URLs while isolating the prototype boundary.

