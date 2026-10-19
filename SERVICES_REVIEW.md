> **Historical source/design record — reviewed 19 October 2026.** Use [the current operating/source guide](docs/appointment-system-release.md) first. The dated body below describes its original source and observations; obsolete backend paths and unbundled screenshots are historical references, not present commands, current features or fresh proof. No missing evidence is reconstructed or claimed as available.

# Services refinement — 8 September 2026

## Approved scope and direction

The designer explicitly delegated evaluating and selecting the best fuller, vertical Services-page layout. The existing site identity and shared header/footer remain. About receives only compact expertise-card refinements. Public names/prices/duration changes apply across pages; appointment booking and backend are excluded.

Compared structures: six-card grid (too similar to incumbent); tabbed selector (hides offerings); accordion (underuses artwork); paired service bands (compact but catalogue-like); sticky side index (uses too much reading width); alternating illustrated chapters (selected: fuller, visual and straightforward).

Three built-in image-generation composition tests are in `.impeccable/mocks/services-{chapters,paired,index}.png`. The designer delegated selection; chapters was selected. No random concept selection: the explicit instruction was to evaluate and implement the strongest fit. The renders are composition studies, not final page screenshots or approved factual copy.

## Composition and implementation inventory

| Ingredient | Medium and commitment |
| --- | --- |
| Shared navigation and footer | Existing React components; preserve design and structure, update the public service label only |
| Introduction and jump links | Semantic heading, paragraph and six accessible in-page links; no duplicated eyebrow or decorative numbering |
| Six alternating horizontal chapters | CSS layout with one service per row, roughly two rows per landscape viewport; content may grow instead of clipping |
| Five existing service illustrations | Existing WebP assets, locally framed at readable scale, not replaced by the comp's invented scenes |
| Name Change illustration | New generated gold letter/number artwork on navy, distinct from General Numerology |
| Focus terms | Two concise topic labels with existing Lucide icons; no invented outcome guarantees |
| Price and actions | Semantic text and links, always visible; Prashna unit explicit; Name Change price undecided |
| Type and color | Source Serif 4 / Source Sans 3; incumbent navy, gold, beige; no generated logo/type replacement |
| Motion | Short, once-only opposing assembly on landscape; hover lift and gold accent; reduced-motion support; readable by default |
| Mobile | Independent single-column reading order, no landscape viewport-height enforcement |
| Close | Brief help-choosing message and existing inquiry route; no fabricated proof |

## Image-generation prompt record

Built-in image tool; three desktop full-page ui-mockup prompts, all pinning existing navy `#08091b`, plum `#181122`, gold `#d3af54`, beige `#ede9d7`, Source Serif / Source Sans character, six real services and supplied prices, no duration or invented proof. Variants: alternating one-service rows; three paired bands; a persistent left service index and right reading column. Final Name Change asset prompt is recorded below when produced. Generated incidental copy, artwork replacements, header modifications, decorative numbering and metadata are intentionally not literalized.

Final asset: `src/assets/images/Name-Change.png`, created with the built-in image tool. Prompt: “Use case: stylized-concept. Asset: square illustration for Name Change Consultation on an existing astrology website, no UI or mockup. Fine polished antique-gold celestial linework on completely flat nearly-black navy #080817. Central elegant serif capital A with a small finer capital a offset to its lower-right, joined by a delicate curved gold line suggesting a spelling refinement. Behind, two thin precise orbital circles with a few tiny gold numerals 1, 3, 5 and 6 placed on the circumference. Four restrained four-point stars. The central monogram is the focal artwork, not a numerology 3x3 grid. Rich gold #d3af54, very subtle metallic dimension, crisp forms at thumbnail size, generous but not excessive negative space: artwork fills 78% of width/height. No enclosing square border, no caption, no words, no heading, no extra symbols, no photoreal scene, no gradients across background, no branding or watermark. Quiet premium editorial illustration matching existing gold geometric astrology art.”

## Verification — completed implementation checks

- Production build passed with inactive backend URL `http://127.0.0.1:8000`. Existing bundle-size warning remains; this is not a full performance audit.
- Full-project lint completed with existing warnings; focused lint of Service, ServicePresentation, NameChangeService and publicServices returned no findings. `git diff --check` passed.
- Two batched visual rounds at 1366×768, 2560×1440, 1024×768 and 390×844. Additional short-landscape check at 1280×600.
- Services has six rows, each about 342px tall at 1366×768 and 651px at 2560×1440: two fit the space below the measured header. Short screens allow the content minimum of 330px rather than clipping.
- No horizontal document overflow or broken images in the four primary Services viewports; no runtime page errors during that capture batch. The expected refused warm-up request to the deliberately inactive local backend is not a live-form test.
- About and Name Change inspected at laptop, wide desktop and mobile. About titles sit 20px below their cards’ top edge at laptop and 29px at wide desktop; actions anchor below topic pairs. The new focus labels remain landscape-only.
- All six Services Read More links actually opened their correct detail destinations. Standard Book Now reached the existing appointment page. No appointment or inquiry was submitted.
- Name Change inquiry links on Services, About and the detail page lead to Contact; About corrected after independent review and clicked on laptop/mobile.
- Keyboard quick links move focus to the matching chapter below the sticky header. Tab then reaches its Read More action with a visible focus ring. Repeating the same quick link after manually returning to the top works: both selections reached scrollY 2041, focused `consultation-name-change`, section top 97px below an 85px header.
- Reduced-motion test returned `animation-name: none` for all chapter artwork/copy. No forced smooth scroll in this mode.
- Home public display checked for General Numerology ₹3,100, Laal Kitaab ₹1,100 and Prashna ₹1,100 per question, with laptop/wide/mobile screenshots of the Prashna unit. General Numerology and Prashna detail pages visibly carry their new prices.
- Source and rendered-detail scan found no remaining public numeric consultation-duration displays outside appointment booking. Birth-time accuracy, opening hours, astrological timing and remedy schedules are deliberately not removed.
- Existing Windows Wi-Fi preview responded HTTP 200 at `http://192.168.100.191:5183/`. This does not substitute for the designer’s physical-device visual acceptance.

## Review evidence

Representative screenshots saved with the project:

- Services, laptop (historical path `.impeccable/review/services-laptop.png`; unavailable in this maintained copy)
- Services, wide desktop (historical path `.impeccable/review/services-wide.png`; unavailable in this maintained copy)
- Services, mobile (historical path `.impeccable/review/services-mobile.png`; unavailable in this maintained copy)
- About expertise, wide desktop (historical path `.impeccable/review/about-wide.png`; unavailable in this maintained copy)
- Name Change detail, laptop (historical path `.impeccable/review/name-change-laptop.png`; unavailable in this maintained copy)
- Keyboard selection and destination (historical path `.impeccable/review/services-keyboard.png`; unavailable in this maintained copy)

Detailed captures remain at `/tmp/astro-services-r2-{laptop,wide,mobile,compact}-{top,pair1,pair2,pair3,footer}.png`, plus `/tmp/astro-about-r2-*.png`, `/tmp/astro-name-change-r2-*.png` and the final verdict recaptures.

Independent finish review accepted the composition, typography, artwork adaptation, About hierarchy and separate mobile reading order. It found the About Name Change inquiry destination and outdated design documentation; both were corrected. A repeated quick-link issue found in functional testing was also corrected and rechecked.

| Final independent verdict | Status |
| --- | --- |
| About Name Change inquiry destination | Resolved; laptop/mobile clicks reach Contact, other services retain booking |
| Authoritative scoped design documentation | Resolved; current decisions supersede contradictory historical guidance |
| Repeated Services quick-link selection | Resolved; repeated keyboard selections reach and focus the correct section |

Reviewer remaining: clear for these three findings; no regression from the fix batch visible in supplied recaptures. This is a scoped implementation/visual verdict, not a claim of universal perfection or human acceptance.

## Deliberately deferred

At the original review, Name Change pricing was deliberately deferred. **Superseded 2026-09-09:** the designer confirmed ₹5,100 and Book Now. Services, About and the detail page now link to the preselected Name Change booking choice, which uses that same price. Existing booking service names, other prices and duration/scheduling configuration remain for the separately requested booking review before live use. No backend source, deployment, PR or customer-facing transaction was changed/performed by this follow-up. Existing certificate placeholders and promotional claims elsewhere have not been validated by this visual review.

## Approved inset-layout refinement — 2026-09-08

The designer approved the chapter direction and requested a narrower landscape reading area, aligned alternating rows, a contrasting six-service index and removal of its duplicate divider. This pass changes Services landscape CSS only; no artwork, copy, prices, destinations, motion, section heights, shared chrome or mobile/portrait rules are replaced. The separate Name Change detail layout is unchanged.

- One common frame uses approximately 70% of the viewport, with a readable-width exception on smaller landscape screens and a 2400px cap.
- Artwork-sized grid columns remove the former empty space inside oversized tracks. Left artwork aligns with the following row's left copy, and right artwork aligns with the opposite copy column's outer boundary.
- The plum index has light labels, gold icons, hover feedback and an inset gold keyboard ring. It uses three columns below 2200px and six above. Its old border rules and the first chapter's extra seam are removed; remaining seams share the inset frame.

Measured before/after: at 1366px the frame changed from 1229px to 956px and the artwork-to-copy gap from 117px to 41px. At 2560px the frame changed from 2176px to 1792px and the gap from 210px to 64px. The 1024px case uses 940px to avoid crowding.

Visual captures covered 1024×768, 1366×768, 1920×1080, 2560×1440, 390×844 and 768×1024. All six chapters were reviewed across laptop/wide screenshots, including the closing callout. No horizontal page/copy overflow or broken service illustrations was found. Mobile geometry matched the before measurements exactly. Independent layout assessment agreed that the outer-edge alignment and closer spacing meet the requested refinement without another redesign.

Keyboard focus on the dark menu is visible; repeated Name Change selections both focused `consultation-name-change` at top 97.25px below an 85px header. All twelve chapter action destinations remain unchanged. Build, whitespace check and focused Services layout detector passed. The Wi-Fi preview returned HTTP 200 after the final build. These are local frontend checks, not booking or physical-device acceptance.

Saved evidence: inset laptop (historical path `.impeccable/review/services-inset-laptop.png`; unavailable in this maintained copy), inset wide pair (historical path `.impeccable/review/services-inset-wide.png`; unavailable in this maintained copy), unchanged mobile (historical path `.impeccable/review/services-inset-mobile.png`; unavailable in this maintained copy), keyboard menu (historical path `.impeccable/review/services-inset-keyboard.png`; unavailable in this maintained copy). Detailed captures remain at `/tmp/services-width-r1-*` and `/tmp/services-inset-*`.
