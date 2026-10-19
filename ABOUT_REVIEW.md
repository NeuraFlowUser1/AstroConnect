> **Historical source/design record — reviewed 19 October 2026.** Use [the current operating/source guide](docs/appointment-system-release.md) first. The dated body below describes its original source and observations; obsolete backend paths and unbundled screenshots are historical references, not present commands, current features or fresh proof. No missing evidence is reconstructed or claimed as available.

# About page refinement — local design review

Status (2026-09-08): implemented locally on `design/page-by-page`, ready for the designer's review. No push, public deployment or PR has been made. Existing dirty homepage, navigation and footer work is preserved.

## Scope and decisions

- Refine the About page's landscape layout, not its visual identity. Keep the navy biography, arch-framed portrait, white expertise area, sand-coloured certificate section, existing artwork and interactions.
- Preserve the exact `Astrologer Kundan Singh` hero title family, weights, gradient, tracking and responsive sizes. Leave the shared header and main footer design unchanged. Unlike Home, About retains the existing global root-font scaling; resetting it would silently resize the protected title and shared chrome.
- Apply the locally served Source Sans 3 / Source Serif 4 pairing to other About landscape content. Body copy scales from 17px to 24px, secondary text from 16px to 22px, section headings from 30px to 52px, and service titles from 20px to 26px. Use restrained title case and normal tracking for the service names.
- Size the hero to the viewport minus the measured sticky header and half the proof tray, so the entire overlapping tray is visible on opening. Expertise and Certificates each have a viewport-minus-header minimum height. These are minimums: short windows or enlarged text can grow the section instead of clipping content.
- Match the proof tray to Home: warm gold-beige `#d9ccaa`, border `#bca777`, and three navy tiles with Source Sans 3 labels/values. Preserve its exact 50/50 overlap. Remove the conflicting old translation utility and explicitly preserve the incumbent portrait-tablet offset separately.
- Arrange the six expertise cards in a 3-column, 2-row landscape grid. Artwork sits beside a compact title/action group. At 1024–1199px, actions span the card width beneath its image/title row. Retain Read More and Book Now. The title-to-action gap is 12px on normal laptops/desktops; no large empty right-column spacer remains.
- Add Name Change Consultation as the sixth area. Existing `ServiceDetail.jsx` Numerology content explicitly includes name corrections and Name Numerology, so Read More uses `/services/numerology` and its existing artwork. Book Now uses the existing `/booking` destination. This does not create a separately priced service, a new detail route or backend booking category.
- Keep the existing five-second certificate slide viewer; enlarge the viewer and body text on wide landscapes. Preserve manual selection and give desktop dots 44px targets with pressed-state information.
- Make the shared copyright/legal row gold (`#e4c478`) with a restrained 8px glow. Hover/focus uses a lighter gold. This explicitly requested colour change applies site-wide, including mobile; the main footer columns and legal content are untouched.

About-specific visual rules are scoped to at least 1024px width in landscape orientation. Mobile/portrait layouts keep their existing type, portrait-first flow and vertical service-card arrangement. They receive the sixth expertise card and site-wide footer colour, not the landscape redesign.

## Verification

The Impeccable layout workflow guided source inspection, a separate read-only assessment, screenshot review, one consolidated visual correction and final confirmation. Initial inspection caught the old large-screen 4+1 card arrangement, narrow fixed card caps and oversized spacing. The implementation review caught the legacy double tray translation and excessive title/action separation on wide cards; both were corrected.

Final built-preview measurements:

| Viewport | Sticky header | Expertise height | Certificates height | Proof midpoint error |
| --- | --- | --- | --- | --- |
| 1280×720 | 85px | 635px | 635px | 0px |
| 1366×768 | 85px | 683px | 683px | 0px |
| 2560×1440 | 137.5px | 1302.5px | 1302.5px | 0px |
| 1024×768 | 85px | 683px | 683px | 0px |

At all four landscape sizes the complete proof strip ended at the initial viewport bottom (within 0.01px). All six cards and actions fit, without horizontal page or card overflow. At 1366px, the cards are approximately 163px tall, compared with the previous roughly 300px-class vertical cards; the full expertise section shrank from about 983px to 683px. On the large desktop it shrank from about 1497px to 1302.5px while accommodating the sixth card.

The protected title was measured before and after: at 1366px, Outfit 34.15px/300 and 61.47px/700; at 2560px, Outfit 64px/300 and 115.2px/700. The header heights were unchanged. About body paragraphs rendered in Source Sans 3 at 17px and 24px respectively.

Screenshot and interaction checks also covered:

- 390×844, 844×390 and 1024×1366 mobile/portrait cases, retaining Outfit and incumbent hero layouts without horizontal overflow. The 390px hero height remained exactly 1107.484375px, matching the baseline. Expertise contains six cards; its extra content is intentional.
- All six certificate selections, including the longest title, at a stable approximately 370.8px card height on the laptop. Automatic advancement still occurs. These are rendering/interaction checks, not credential verification.
- The new card's Read More click reached the actual Numerology route, where Name Numerology content is present. Its booking link retains `#/booking`. No booking or inquiry was submitted.
- All three footer legal buttons opened their existing modals and closed with Escape. Copyright text and all three buttons computed to gold; hover/focus computed to lighter gold. Final footer screenshots waited for the existing entrance animation to settle.
- Gold footer row confirmed on both About and Home; no other footer style was changed in this pass.
- Final build, lint, whitespace checks and the focused layout detector passed. Existing unused-import/function and bundle-size warnings remain. An unused map parameter introduced during this pass was removed.
- The Windows Wi-Fi preview address returned HTTP 200 after the final build. The preview uses the intentionally inactive local backend; its refused warm-up request is expected and does not establish backend health.

Temporary visual evidence: `/tmp/astro-about-baseline-*`, `/tmp/astro-about-after-*`, `/tmp/astro-about-final-*`. Preliminary `/tmp/astro-about-before-*` hero captures at some widths retained an old scroll position and are superseded by the explicitly aligned baseline captures. A cached pre-build document was detected and replaced with a fresh versioned preview before implementation checks. These files are local review artifacts, not permanent website assets or physical-device acceptance.

## Content issue to resolve before publication

The Certificates section already contained generic `CERTIFICATE IMAGE` placeholders, a list of named credentials and `VERIFIED ACCREDITATION` wording. This refinement preserves those supplied claims but does not verify them or generate certificate evidence. The designer was informed that real certificate images and a wording check are needed before treating this section as published proof. Existing biography dates and experience claims were likewise not fact-checked or rewritten.

## Preview

Use the existing Wi-Fi preview at `http://192.168.100.191:5183/#/about`. Refresh after a new build; use a hard refresh if an old cached version persists. Running/sharing instructions and the inactive-backend boundary remain in `HOMEPAGE_REVIEW.md`. No public release or complete accessibility certification is implied by these focused frontend checks.

## Laptop hero text refinement — 2026-09-08

The designer requested smaller left-side supporting text on laptops only, explicitly protecting the `Astrologer Kundan Singh` title and both actions. At 1024–1599px landscape, the description is now 0.5pt smaller and the eyebrow, biography fields and quote are 1.5pt smaller. The existing families, weights and line-height ratios remain. Exact element selectors avoid changing shared type tokens, the proof tray, other About sections, desktop widths from 1600px or portrait/mobile.

At 1366×768, the description changed from 17px to 16.333px, biography/eyebrow from 16.43px to 14.43px, and quote from 17px to 15px. The isolated `Kitaab.` wrap is resolved. Copy height reduced from 491.45px to 446.38px, while hero height stayed 632.875px. Title sizes remained 34.15px/61.47px and action text 17px; the proof tray remains exactly half-overlapping.

Before/after screenshots and computed checks covered 1366×768, 1536×864, 1920×1080 and 390×844, with additional 1024×768 and 683×384 effective-viewport checks. Desktop/mobile font and hero-height values matched their baselines; there was no horizontal page or biography overflow. The narrow effective viewport checks responsive reflow, not physical browser-zoom or assistive-technology certification. No runtime page errors occurred; the inactive backend's refused warm-up request remains expected.

The Impeccable typography assessment supported this limited change; the focused type detector's sole warning is the intentionally protected Outfit title, already documented in Design.md prose but not its Services-only frontmatter. No font replacement or unrelated documentation-system migration was made to silence that warning. Build and whitespace checks passed.

Saved result: About laptop hero typography (historical path `.impeccable/review/about-hero-laptop-type.png`; unavailable in this maintained copy). Detailed before/after screenshots remain at `/tmp/about-size-before-*` and `/tmp/about-size-after-*`.
