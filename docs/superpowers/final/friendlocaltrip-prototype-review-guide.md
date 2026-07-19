# FriendLocalTrip Prototype Review Guide

## Purpose and disclaimer

FriendLocalTrip is a frontend-only customer-review prototype for connecting Travelers with Local Guides. All profiles, requests, bookings, payments, conversations, reviews, referrals, commissions, and dashboard metrics are deterministic demo data held in React state. No account is created, no application is submitted, no payment or payout is processed, and no data is persisted or sent to an application API.

For the smoothest review, use Chrome or Edge at 1440×900 for desktop and 390×844 for mobile. Refresh resets session-only changes.

## Role entry routes

| Role | Entry | Main workspace |
| --- | --- | --- |
| Traveler | `/` | Home, request, results, profiles, booking, payment demo, history, chat, and review |
| Local Guide | `/local-guide` | Registration and `/local-guide/dashboard` demo workspace |
| Partner | `/partner` | `/partner/dashboard` demo workspace |
| Admin Demo | `/admin` | `/admin/dashboard` demo workspace |

The complete current and legacy-compatible route inventory is documented in [the Phase 9 design](../specs/2026-07-19-phase-9-final-prototype-qa-design.md#current-route-inventory).

## Recommended Traveler journey

1. Open `/` and select **Request a Local Guide**.
2. Enter `Ho Chi Minh City`, select `English`, set group size to `2`, choose `August 10–11, 2026`, and select `Local Life`.
3. Select **Find My Local Guide**, review the request summary and ranked results, then open Linh N. with **View Profile**.
4. Use **Check Availability**, choose August 10 and an available time such as `8:00 AM`, then select **Continue to Booking**.
5. Complete the meeting and contact fields, continue to the Payment Demo, select a demo payment method, acknowledge the notice, and choose **Confirm Demo Booking**.
6. Open the resulting booking, then use **View All Bookings** to review seeded history.
7. Open completed booking `FLT-GUIDE001-20260615` to test **Message Guide** and submit a five-star demo review with a comment of at least 10 characters.

Useful seeded profile: `guide-001`, Linh N., Ho Chi Minh City, `$18/hour`, rating `4.97`.

## Recommended Local Guide journey

1. Open `/local-guide` and choose **Apply to Become a Guide**.
2. Review inline validation on step 1, then complete the four registration steps through the review screen.
3. Submit the demo application and inspect the application summary. Direct access to `/local-guide/application-submitted` without submitted session data intentionally shows a recovery state.
4. Return to the hub and choose **View Demo Guide Dashboard**.
5. Review Overview, accept or decline a pending request under Bookings, save and reset Availability, inspect Earnings, open a conversation under Messages, and preview Profile.

Guide earnings retain the approved 10% platform-fee presentation. Support Chat is hidden in the dashboard Messages module so it does not compete with the conversation composer.

## Recommended Partner journey

1. Open `/partner`, then choose **Open Demo Partner Dashboard**.
2. In Referral Tools, copy the demo link and confirm visible feedback; review the QR-style prototype and campaign cards.
3. Filter Bookings, expand **View Booking Summary**, open the related commission view, and review Reports and Partner Profile.

Partner commission uses exactly `eligible completed booking total × 5%`. Pending, confirmed, cancelled, reversed, or otherwise ineligible demo bookings do not create available commission. Partner records beginning `FLT-REF-` are a separate referral demo ledger and are not the same records as Traveler booking history.

## Recommended Admin journey

1. Open `/admin`, then choose **Open Admin Dashboard**.
2. Review the platform overview and navigate the compact mobile menu or desktop sidebar.
3. Under Guides, open an application review dialog and exercise the clearly labeled demo decisions.
4. Review Partner verification, re-run the existing request matching preview, inspect booking/payment/report details, and reset Demo Settings.

Admin financial values stay separate: Gross Booking Value, Traveler Service Fees, Guide Platform Fees, Partner Commission Expense, and Prototype Platform Revenue. Revenue is `traveler service fees + guide platform fees − partner commission expense`; Gross Booking Value is reporting-only and is not added again.

## Recovery and empty-state checks

- Submit a request for `Phnom Penh` with any valid language and dates to produce the no-guide recovery state, then edit or start over.
- Open `/guides/unknown-guide`, `/booking-handoff/unknown-guide`, `/bookings/unknown-booking`, and `/totally-unknown` to review friendly recovery pages.
- Open `/payment/guide-001` or `/booking-success/guide-001` in a fresh session to verify missing-context recovery.
- Open the chat route for a non-eligible booking to verify the Bookings recovery action.
- Attempt a second review after a valid session review to confirm duplicate-review prevention.
- If clipboard access is unavailable, Referral Tools displays manual copy guidance.
- Legacy URLs `/book/:guideId`, `/guide-dashboard`, `/match`, `/dashboard`, `/signin`, and `/signup` remain safe entry points without rendering obsolete UI.

## Known prototype limitations

- State is session-only and resets on refresh; there is no backend, database, authentication, authorization, or cross-device synchronization.
- Payment, payout, messaging, review, QR, reporting, and document/photo selection are demonstrations only.
- Availability and inventory are deterministic rather than live.
- Partner and Admin mutations are isolated from Traveler and Local Guide contexts.
- Existing static image and web-font assets may use their original public asset hosts; no application API, payment network, upload, WebSocket, geolocation, or QR service is used.

## Final screenshot set

Screenshots are stored outside the repository at `C:\Users\ADMIN\.codex\visualizations\2026\07\19\friendlocaltrip-phase-9`.

### Desktop — 1440×900

1. `01-traveler-home-desktop-1440x900.png`
2. `02-request-dialog-desktop-1440x900.png`
3. `03-results-desktop-1440x900.png`
4. `04-rich-guide-profile-desktop-1440x900.png`
5. `05-availability-calendar-desktop-1440x900.png`
6. `06-booking-details-desktop-1440x900.png`
7. `07-payment-demo-desktop-1440x900.png`
8. `08-booking-success-desktop-1440x900.png`
9. `09-booking-history-desktop-1440x900.png`
10. `10-traveler-chat-desktop-1440x900.png`
11. `11-local-guide-hub-desktop-1440x900.png`
12. `12-guide-registration-desktop-1440x900.png`
13. `13-guide-dashboard-overview-desktop-1440x900.png`
14. `14-partner-dashboard-overview-desktop-1440x900.png`
15. `15-admin-dashboard-overview-desktop-1440x900.png`
16. `16-admin-guide-verification-desktop-1440x900.png`

### Mobile — 390×844

17. `17-traveler-home-mobile-390x844.png`
18. `18-request-dialog-mobile-390x844.png`
19. `19-results-mobile-390x844.png`
20. `20-guide-profile-mobile-390x844.png`
21. `21-booking-details-mobile-390x844.png`
22. `22-traveler-chat-mobile-390x844.png`
23. `23-guide-registration-mobile-390x844.png`
24. `24-guide-dashboard-mobile-390x844.png`
25. `25-partner-dashboard-mobile-390x844.png`
26. `26-admin-dashboard-mobile-390x844.png`

## Customer-review checklist

- Confirm the public brand is always **FriendLocalTrip** and role labels remain clear.
- Complete the four recommended role journeys and verify every local mutation gives visible feedback.
- Confirm the Traveler 5% service fee, Guide 10% fee, Partner 5% commission, and Admin revenue formula remain internally consistent.
- Review the six target viewport sizes with no page-level horizontal overflow, clipped controls, sticky collisions, or Support Chat overlap.
- Confirm dialogs are named, keyboard-dismissible, focus-managed, and viewport-safe.
- Confirm unknown IDs, missing session context, empty results, and obsolete URLs always provide a useful recovery action.
- Remember that every operational or financial value is a prototype demonstration, not live data.
