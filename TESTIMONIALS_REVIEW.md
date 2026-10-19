> **Historical source/design record — reviewed 19 October 2026.** Use [the current operating/source guide](docs/appointment-system-release.md) first. The dated body below describes its original source and observations; obsolete backend paths and unbundled screenshots are historical references, not present commands, current features or fresh proof. No missing evidence is reconstructed or claimed as available.

# Testimonials page review — 2026-09-09

## Scope and status

Local implementation of the approved four-part Testimonials extension. The shared header/footer, Home, About, Services, individual service pages and appointment/backend workflows were not changed in this task. No commit, push, PR or public deployment was made.

The page preserves the featured carousel, then adds three illustrated consultation scenarios, six shorter filterable sample reviews and a brief closing invitation. Existing navy/plum/gold/beige and Source Serif 4 / Source Sans 3 are retained. All review and story material is explicitly marked sample; it is not verified client evidence.

Primary files: `src/Component/Testimonial.jsx`, `src/Component/Testimonial.css`, `src/data/testimonialContent.js`. The route strategy and predeclared comp adaptations are recorded in `.impeccable/surfaces/src-component-testimonial-jsx.md`. The existing `Design.md` and Services/About records remain authoritative for their own surfaces, not replaced by this extension.

## Planning and composition critique

Three generated composition studies are saved in `.impeccable/mocks/`: `testimonials-editorial.png` (selected), `testimonials-paired.png`, `testimonials-journal.png`. The selected composition varies density through one featured story and two companion stories. Paired rows were more repetitive; the journal was denser than this reading task requires.

Declared adaptations before implementation: retain the familiar light hero, real shared header/footer, current brand fonts, existing carousel content and controls; do not import generated slogans, new metrics, claimed client results or a replacement dark hero. All illustrative material must be visibly labeled. No concept roll/catalog card was used because the user had approved the structure of a local extension.

## Review and corrections

First screenshot round covered 1366×768, 2560×1440, 1024×768, 390×844 and 320×740. It found wrapping featured-story labels at large sizes, overly long scenario copy, narrow-phone controls and a small laptop hero overrun. The correction batch shortened the stories to roughly 35 words each, made the label column font-relative, retained complete 4:3 artwork, allowed dots to flex while keeping circular 44px arrows, and adjusted hero padding. The second round confirmed those corrections.

The independent finish review then requested more prominent companion artwork, an engraved landscape and centered grouping at the close, and scoped completion documentation. The companion layout now puts artwork beside the title, with the story text spanning the full card width underneath, avoiding empty image rails and narrow reading columns.

### Final independent verdict

| Finding | Verdict | Final evidence |
| --- | --- | --- |
| Companion artwork | Resolved | Larger illustrations and full-width descriptions eliminate the empty image rails. |
| Closing composition | Resolved | Complete desktop crescent, engraved mountain framing and centered invitation; readable laptop/mobile actions. |
| Scoped documentation | Resolved | `.impeccable/testimonials-design/DESIGN.md` and its `.impeccable/design.json` sidecar record actual local styles/behavior; this review records assets, sample replacement and verification limits. Earlier root/page records are preserved. |

Reviewer remaining: **Clear. No material regression observed in the final correction.** This is the scoped reviewer verdict, not physical-device acceptance, full accessibility certification or approval to publish dummy testimonials.

## Verification evidence

- Production build passed with `VITE_API_URL=http://127.0.0.1:8000 npm run build`. This deliberately inactive backend prevents preview checks from touching the production appointment service. A refused warm-up request is expected; it is not a successful backend test.
- Focused Oxlint and `git diff --check` passed.
- One static design-detector pass raised palette/radius documentation advisories against the existing Services-only design record. It is not a claim of complete accessibility or design correctness.
- Browser DOM measurements showed no horizontal document overflow at all five checked sizes. At 2560×1440 the main frame is 1792px (70%); at 1366×768 it is approximately 956px. Compact 1024px landscape uses the 940px safety frame.
- The hero ends at the first viewport boundary on both laptop and large desktop: 683px below an 85px laptop header, and 1302.5px below a 137.5px desktop header. Reading sections have minimum available-viewport height on landscape but may grow on shorter screens; mobile is content-led, not viewport-clipped.
- Actual timed carousel check: slide 1 advanced to slide 2 after 12.5 seconds; hovering prevented another change. All six dot selections worked, previous/next wrapped correctly, and manual selection stopped autoplay after another 12.5 seconds outside the carousel.
- The carousel controls stayed at the identical vertical position (633.875px) across all six laptop quotes.
- All seven filters were tested on laptop and mobile. All experiences returned six cards; each service returned one; exactly one filter was selected and the status announcement matched.
- Reduced-motion check: the carousel stayed on slide 1 after 12.5 seconds, manual navigation still worked, and story artwork reported no animation or transition.
- At 320px width, arrows remained 44×44px and all dots fit between them with 24px outside gutters. Focused controls have visible outlines.
- Explore the stories retained `#/testimonials`, moved focus to the story section and cleared the sticky header. Three story links and both closing destinations were checked. Vastu's existing page has no h1/h2 tags, but the expected Vastu content renders; no unrelated detail-page semantics were changed.
- No JavaScript page errors occurred during the scoped filter/link checks. No appointment form was submitted, and no payment, message, inquiry or customer data was sent.

Viewport screenshots retain the normal header. Full-section evidence suppresses only the fixed header during capture to avoid it overlaying the middle of an extended screenshot; layout is unchanged and animations are completed for the still. Earlier unadjusted captures are retained in `/tmp/testimonials-r1-*` and `/tmp/testimonials-r2-*`; final evidence is copied into `.impeccable/review/` at handoff.

## Asset manifest and prompt set

Three original illustration plates were generated with the built-in image-generation tool, using the selected editorial study as a style reference. Requested canvas: 1360×1024. Actual output: 1445×1088 RGB opaque PNG. No explicit model, quality, seed or transparency parameter was supplied. Generated results retained a few extra celestial details and slightly shaded navy backgrounds; the visible gold-engraving treatment was reviewed and accepted.

Production images are WebP at the same dimensions, encoded at 0.85 quality without composition changes. Career: 202,834 bytes; home: 158,560 bytes; name: 152,422 bytes. Combined production weight is 513,816 bytes, compared with 5,181,290 bytes for the original PNGs. PNG originals remain in `src/assets/images/` for future edits; only WebPs are imported by the page. All story images load lazily with explicit intrinsic dimensions.

The exact shared prompt prefix for each plate was:

> Use case: illustration-story. Create a clean reusable production raster illustration for the website Astroadvice by Kundan Singh. Input image is ONLY a style reference: preserve the antique-gold engraved linework character of the THREE STORY ILLUSTRATIONS in its SECOND SECTION headed Behind the consultation. Ignore all UI, hero art, words, cards and other sections. Canvas 1360x1024 landscape (about 4:3), high resolution at least 1024 on each side. Background uniformly flat solid navy #101020 edge to edge. Restrained antique-gold fine engraving, tasteful finer etched details and composed central subject, calm elegant celestial mood. No text, headings, labels, watermark, UI, frame, border, baked card corners, shadows, photographic texture, background gradient, or human faces. Do not reproduce the website or its layout. Output only a single illustration plate.

Exact subject suffixes (each appended after one space):

- **Career:** Subject: an elegant antique gold compass floating above two branching winding paths leading towards distant mountains. A few restrained tiny stars. Compass without any letter labels or numbers. Preserve the visual role and silhouette of the career compass and paths illustration from Section 2, filling the image with an uncluttered composition.
- **Home:** Subject: a small elegant welcoming house with illuminated gold windows and a winding entrance path, with restrained subtle compass/celestial elements and only a few tiny stars. Preserve the visual role and silhouette of Section 2's house illustration. Keep the house complete and comfortably framed. No compass letters or numbers.
- **Name:** Subject: an open elegant notebook with a pen beside it, and ONE restrained antique gold letter A floating above the pages within a single thin celestial orbit. Preserve Section 2's name notebook illustration character but simplify to one A monogram only. No other letters, symbols, writing or readable marks; notebook pages contain delicate blank engraving lines only.

Reference: `.impeccable/mocks/testimonials-editorial.png`. Local originals: `src/assets/images/testimonial-{career,home,name}.png`; web assets use the matching `.webp` suffix. Provider originals are under `/home/anan/.codex/generated_images/01a084fc-3697-7d53-aa1b-63f56972a1d4/`: career `exec-ae55d407-f8a5-4d0b-94ff-aef1de547472.png`, home `exec-0343e098-c7f0-46e3-95e0-5a56d5a80d2e.png`, name `exec-126a902b-098d-4f2b-a97c-5423f3a69d6e.png`.

### Closing landscape

The finish review prompted a fourth decorative plate, `src/assets/images/testimonial-closing-landscape.png`, with the production `.webp` counterpart at identical 2120×742 dimensions. Built-in image generation used the same editorial comp reference, no explicit model/seed/quality setting, and returned a larger canvas than the requested 1600×560 at the same approximate aspect ratio. Original provider output: `/home/anan/.codex/generated_images/01a084fc-3697-7d53-aa1b-63f56972a1d4/exec-719fd816-d667-4a23-9c90-1b193d93adab.png`.

Exact prompt:

> Use case: illustration-story. Create ONE clean reusable decorative landscape raster plate for Astroadvice by Kundan Singh. Use the supplied website mock ONLY as a style reference for its BOTTOM CLOSING INVITATION BAND: the thin gold mountain engravings at far left and right, not the hero or story cards. Canvas requested 1600x560, wide approximately 3:1. Edge-to-edge solid navy #090b1c. Restrained antique-gold finely engraved mountain ridges confined to the far left and right LOWER corners. Very subtle small gold crescent and a few restrained tiny stars on the left. CENTRAL 60 PERCENT OF CANVAS MUST BE ENTIRELY EMPTY SOLID NAVY, without stars, mountains, texture, gradients or objects, to leave room for readable website text and buttons to be added separately. Preserve the calm fine etched antique-gold character and silhouette of the closing band artwork. No compass, words, letters, labels, UI, buttons, border, logo, watermark, rounded card corners, baked shadows, photographic texture or people. Output only the single clean decorative landscape illustration, never a website screenshot.

Visual QA accepted the fine engraving and clear central reading area; foothills extend slightly farther toward the center than requested. The second finish correction repositions the landscape within its band so the crescent remains complete at 2560px. The closing remains compact, and mobile uses a contained, quieter version of the same asset. The closing WebP is 31,800 bytes; all four production illustrations together total 545,616 bytes.

## Final screenshot evidence

The last correction batch passed the production build, focused lint and whitespace checks. All four images loaded, with no horizontal document overflow in the final laptop, desktop and mobile recaptures. Final screenshots: `.impeccable/review/testimonials-{laptop,desktop,mobile}-{hero,stories,reviews,close}.png`, plus `testimonials-narrow-controls.png`. The final build still reports the existing application chunk-size advisory; no unrelated bundling refactor was introduced.

## Preview access

The verified link **on this computer** is `http://172.29.7.110:5184/?review=testimonials-final#/testimonials`. Windows returned HTTP 200 for that address after the implementation work. The existing Wi-Fi address `192.168.100.191:5183` did not respond from Windows or WSL during this turn. Its port-forwarding configuration still points at `172.29.7.110:5184`, and the Windows IP Helper service is running, but there is no listening TCP endpoint on port 5183. This is an observed sharing issue, not a website-build failure. No firewall, VPN, service or forwarding settings were changed. Cross-device access needs the existing Windows sharing setup restored; do not report it as working based on the older Services/Home records.

## Required before publication

1. Replace/approve all six featured quotations, names, dates, services and ratings, including the inherited 4.9 / 150+ summary. No review platform verification is implied.
2. Replace/approve all six shorter sample reviews and attributions.
3. Replace the three illustrative scenarios with consented client accounts if presenting them as case histories. Confirm what actually happened; do not infer successful outcomes from the placeholders.
4. Obtain permission for any real client name, photo or identifying story detail. Neutral initials currently avoid fabricated portraits.
5. Review service-specific claims on untouched pages separately. This page's sample labeling does not verify content elsewhere on the site.
6. Confirm the final design on the user's physical screens. Browser viewport simulations are not physical-device, screen-reader, full-release or human-acceptance proof.

The preview still requires the local preview process and Wi-Fi forwarding to be running. No public launch or PR is implied by the local preview.
