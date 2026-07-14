# LocalLink Homepage Audit — 2026-07-12

## Evidence

The homepage was inspected in Chromium at 375×812, 390×844, 768×1024, 1024×768, 1440×900, 1920×1080, 2560×1440, and 3840×2160. Before screenshots are stored as `audit-before-<width>.png` in the app root.

## Critical

| Symptom | Root cause and evidence | Responsible file | Recommended fix | Risk |
|---|---|---|---|---|
| Yuki guide portrait renders as alt text | The source URL returns HTTP 404 with HTML content and Chromium reports `ERR_BLOCKED_BY_ORB`; `naturalWidth` remains 0 after scrolling into view. | `src/data/mockData.ts`, `src/components/guides/GuideCard.tsx` | Download valid featured portraits locally and update centralized data. | Low; paths remain strings. |
| Homepage depends on remote images with no deterministic availability | Featured cards, verification, testimonials, and guide recruitment use raw Unsplash URLs. The hero already demonstrates the reliable local pattern. | `mockData.ts` and homepage components | Move homepage-consumed assets under `public/images/` and use local paths. | Medium; other routes consume the same guide fields. |

## High

| Symptom | Root cause and evidence | Responsible file | Recommended fix | Risk |
|---|---|---|---|---|
| Mobile guide section is 3,294px tall | Four full directory cards stack vertically with all metadata and actions. | `FeaturedGuides.tsx`, `GuideCard.tsx` | Use compact homepage cards in a horizontal snap rail on mobile and balanced grid on desktop. | Medium; preserve default card behavior on search routes. |
| 4K hero creates excessive empty vertical space | `min-height: calc(100svh - 76px)` expands the section to 2,084px at 3840×2160 while content width remains 1320px. | `globals.css` | Cap hero height/padding on tall displays while retaining first-viewport composition at common desktop sizes. | Low. |
| Experience section resembles a settings grid and uses emoji | Fourteen equally weighted cards render `EXPERIENCE_CATEGORIES.icon` strings. | `ExperienceCategories.tsx`, `mockData.ts` | Present eight prioritized image-led categories with editorial hierarchy and a view-all action. | Low; category query routes stay unchanged. |
| Matching section resembles presentation cards | Four identical bordered cards form the composition; the connecting line sits behind card boxes. | `HowItWorks.tsx` | Replace with connected numbered timeline and concise copy. | Low. |
| Verification reads like an internal report and overclaims | Six checklist rows and status tables use “validated”, “official license”, and precise ratings. | `SafetyVerification.tsx` | Use four safer review steps and one polished profile summary. | Low. |
| Testimonials are dense and tiny | One large quote plus four equally dense cards use 10–12px metadata and italics. | `Testimonials.tsx` | Use one featured story and three shorter readable quotes with 14px minimum metadata. | Low. |
| Trust strip emphasizes unsupported precision | `47+`, `4.94`, and `3,200+` dominate the band. | `TrustMetrics.tsx`, `mockData.ts` | Replace with belief-based trust statements and restrained icons. | Low. |

## Medium

| Symptom | Root cause and evidence | Responsible file | Recommended fix | Risk |
|---|---|---|---|---|
| 29 leaf text nodes are below 12px | Repeated `text-[10px]` and small metadata styles. | Guide, verification, testimonial, recruitment components | Normalize customer-facing metadata to 13–14px. | Low. |
| Recruitment section makes unsupported payout claims | Copy promises 90% retention, weekly bank payout, and insurance. | `BecomeGuide.tsx` | Use restrained community and flexibility messaging. | Low. |
| Footer omits requested help/contact hierarchy | Existing columns focus on dashboards and payout links. | `Footer.tsx` | Add Help Center, Contact, Trust & Safety, selectors, and legal hierarchy. | Low. |
| Hero photo communicates connection but not an identifiable Vietnamese guide | The current local Hội An image shows two travelers. | `Hero.tsx`, hero asset | Keep layout but replace asset when a suitable licensed interaction photograph is available. | Medium; visual-only replacement. |

## Confirmed non-issues

- No horizontal overflow at any required viewport.
- No React, hydration, or runtime console errors were observed.
- The hero underline is intentional SVG styling.
- Header, CTA, and internal route hrefs are present and valid.
- Next/Image local hero requests aborted only during rapid viewport navigation; the image loaded normally in stable runs.
