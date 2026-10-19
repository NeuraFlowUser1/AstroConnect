> **Historical source/design record — reviewed 19 October 2026.** Use [the current operating/source guide](docs/appointment-system-release.md) first. The dated body below describes its original source and observations; obsolete backend paths and unbundled screenshots are historical references, not present commands, current features or fresh proof. No missing evidence is reconstructed or claimed as available.

# Homepage refinement — local design review

Status: refined locally on `design/page-by-page`; awaiting the designer's next review. A local Wi-Fi preview is available; nothing has been pushed, deployed publicly or submitted as a PR. Booking, email verification and backend behavior are outside this visual change.

## Latest refinement — final homepage hero and header adjustment

The designer requested one final small homepage change before regrouping for the About page. This pass remains landscape-only (at least 1024px wide); no About-page implementation or larger Specialties/Services redesign was authorized or performed. The previously proposed larger redesign is deferred, not a prerequisite for moving to About.

- Moved the hero copy inward by 10% of its own column width and the portrait inward by 10% of its column width using independent CSS translation. Existing widths, font sizes, portrait size and entrance transforms remain intact. At 1366px, the shifts are approximately +72px / −50px; at 2560px, +131px / −91px.
- Reduced the introductory pill text by 15% and widened the pill about 25% to the right of its new left edge. Its three words now have a coordinated small gold star, sparkle and flower icon, with more room between the groups. At 1366px, the pill is approximately 394px wide with 14.35px text; at 2560px, 536px wide with 20.4px text. Mobile keeps its existing dot-based pill and sizing.
- Increased the header brand overline from 10px to 12px and the name from 20px to 24px. Placed two readable phone-number rows in a compact block to the left of Book Appointment. The contact block and button are horizontally aligned. Phone text now scales from 16px to 20px on these landscapes, up from 12px. The booking action has a minimum 44px height.
- At compact landscape widths of 1024–1199px, navigation occupies a second row so the enlarged brand and contact details do not collide or require smaller type. Laptop and desktop headers remain a single row. All new header styling is scoped to the homepage; the About route and mobile/portrait treatment remain unchanged.

Verification: inspected before/after and final settled screenshots at 1366×768 and 2560×1440, plus 1024×768, 1200×800 and 390×844. Checks also covered 844×390 and 1024×1366. No horizontal overflow or navigation/contact overlap was measured; all pill items fit inside their border. The proof-strip midpoint remains exactly on the hero boundary and the complete strip ends at the initial landscape viewport bottom. Mobile hero dimensions matched the baseline. A second read-only visual assessment found no concrete defects. Browser checks awaited the responsive React state after resizing; preliminary screenshots taken before that state settled are superseded by the settled/final evidence.

Keyboard focus on Book Appointment remained visible and its `#/booking` destination was preserved. The mobile menu closed with Escape and restored focus. Reduced-motion checks kept the wheel stationary. The actual About route retained its 20px brand name, 12px phone text and existing vertical action arrangement. Final build, lint, whitespace and focused layout-detector checks passed; existing bundle-size and unrelated lint warnings remain. Windows returned HTTP 200 through the existing Wi-Fi preview address after the final build. No bookings, enquiries, public deployments, pushes or PRs were made. Evidence: `/tmp/astro-hero-touchup-before-*`, `/tmp/astro-hero-touchup-settled-*`, `/tmp/astro-hero-touchup-final-*`; these temporary screenshots are not permanent website assets. The Impeccable layout review guided preservation of the existing composition and the compact-header fallback. This is focused frontend verification, not physical-device acceptance or full accessibility certification.

## Previous refinement — landscape typography, artwork and review spacing

The designer explicitly limited this pass to landscape layouts. The new treatment applies only at widths of at least 1024px in landscape orientation. Phone layouts, including short landscape phones, and portrait-tablet layouts retain their existing treatment. This section supersedes earlier descriptions of the ivory proof tray, padded service images and universally visible review Pause button.

- A browser inspection of the actual rendered font glyphs confirmed Source Sans 3 in the proof tray, actions and body text, and Source Serif 4 in headings. No old Outfit or alphabetic fallback was found in the affected homepage elements. The font files were not replaced: the visual mismatch came from size, weight, uppercase styling and tracking. Proof labels now use the shared secondary-text scale, semibold title case and normal tracking. Hero and other primary actions use the shared body-text scale. Their hover transitions no longer interpolate typography while resizing.
- The overlapping proof tray keeps its existing shape and boundary position. Its landscape surround is now warm gold-beige (`#d9ccaa`) with a muted gold border (`#bca777`), instead of ivory.
- Each of the five service illustrations has individually tuned landscape framing. Their built-in blank margins and captions are cropped from the rendered frame; a consistently padded HTML caption replaces the bitmap caption. Original image assets and mobile image styling are unchanged. Screenshot inspection prompted a second adjustment to Vastu and Prashna sizing and caption clearance.
- The review Pause button is absent from the landscape DOM. The continuously moving marquee pauses on precise-pointer hover or keyboard focus; reduced-motion preferences keep reviews stationary and manually scrollable. Mobile retains its existing Pause/Resume control. Removing the desktop control moves the review row up by 60px, and extra clearance below the row separates it from the overlapping consultation callout.
- The proposed standalone illustrated Our Specialties section and redesigned service-choice buttons are **not implemented**. A direction was presented for approval: four coordinated substantial illustrations with short benefits, followed by the existing left-choice/right-card Services layout with stronger navy-and-gold choice styling. Do not mistake this proposal for approved implementation or generated artwork.

Verification on the built preview: before/after screenshots at 1366×768, 2560×1440 and 390×844; final screenshots of all five service illustrations at both desktop widths; follow-up checks at 844×390, 1024×1366 and 1024×768. Final artwork screenshots were visually inspected after the consolidated correction. No horizontal page overflow was measured at these sizes. The 390px features, services and reviews section heights were unchanged from this pass's baseline. Portrait-tablet and phone checks retained the old image framing, tray color and review control; 1024px landscape received the new treatment. Desktop marquee movement, hover pause, keyboard-focus pause, reduced motion and the retained mobile control were checked. No uncaught browser page errors were observed; the intentionally inactive backend is not part of this verification.

The final build, lint and whitespace checks passed, with existing unused-code/hook and bundle-size warnings retained. The focused typography source detector returned no findings. The Impeccable typography review helped distinguish actual font loading from inconsistent styling and required visual checks rather than relying on CSS declarations alone. Evidence: `/tmp/astro-type-before-*`, `/tmp/astro-font-audit-*-settled.png`, `/tmp/astro-landscape-after-*`, `/tmp/astro-landscape-final-*`. These temporary screenshots are not website assets or permanent test fixtures. No forms were submitted and no public deployment, push or PR was made. Browser viewport testing is not physical-device acceptance or accessibility certification.

## Previous refinement — section transitions and marquee edges

The designer accepted the preceding direction and explicitly requested these further changes on 2026-09-08:

- The hero now transitions directly from navy into one continuous light-beige (`#ede9d7`) features/services area. Removed the intermediate ivory band and internal services seam/overlap. Rebalanced its padding so Our Services sits fully within the shared background without increasing the overall spacing.
- Full-width homepage section corners are square. Cards, buttons, portrait frames and the overlapping statistics tray keep their approved shapes. Other pages are outside this change.
- Replaced the broad white marquee overlays with a narrow 12–28px transparency fade. Review movement, timing and controls remain unchanged. Paused and reduced-motion reviews have no edge fade, keeping manual reading unobscured.

Verification: inspected before/after screenshots of the built Wi-Fi preview at 1366×768, 2560×1440 and 390×844. All six main section wrappers reported zero corner radius; features and services shared the same background without a gap/overlap; Our Services had 24–64px of top clearance. The proof tray remained exactly 50/50 across the hero boundary, and no horizontal page overflow was measured. Continuous marquee movement, pause, and reduced-motion behavior were confirmed. The built edge fade measured 17.075px on the laptop and 28px on the large desktop, compared with the previous approximately 41px and 77px white overlays. Build, lint and whitespace checks passed with existing project warnings; the design detector's only finding remains the already-disabled legacy bounce class. Evidence: `/tmp/astro-edges-before-*`, `/tmp/astro-edges-after-*`, `/tmp/astro-edges-confirm-*`. No submissions, public deployment or PR were made.

## Current direction — designer correction, 2026-09-08

The first pass overreached. Its static testimonial controls, flattened proof strip and forced full-height content sections were rejected. The historical record below is not the current design or evidence of acceptance.

- Preserve the colleague's navy/plum, gold and ivory identity, portrait assets, overlapping section bands and existing factual claims, prices and destinations.
- Restore the compact ivory proof tray with three navy tiles, split exactly 50/50 across the hero/features boundary. Shorten the landscape hero by half the measured tray height so the whole tray is visible in the initial viewport when the content fits.
- Expand the content wrapper to a maximum of 2400px with fluid gutters. Body copy grows from 17px to 24px, secondary text from 16px to 22px, headings from 30px to 52px and the hero from 42px to 88px. These are browser-default-size ranges, not limits on user zoom. The hero's introductory pill grows from 16px to 24px.
- Keep the locally served Source Serif 4 / Source Sans 3 pairing. Arrange the four hero service names on one row on wide screens, with visible separators; allow natural wrapping on phones.
- Remove artificial viewport-height minimums from benefits/services, testimonials and About. Let their content and readable spacing determine height. The hero and inquiry retain minimum-height landscape behavior; short windows and mobile may grow naturally.
- Shorten each feature description to one brief phrase. Keep its existing title, icon and card identity.
- Keep service images in square frames on desktop, with contained artwork and 16–28px internal padding rather than cropping their embedded labels against the border. Let the image and text stack where required by narrower screens.
- Restore automatic service changes every three seconds. Manual selection does not permanently pause the rotation; neither does pointer hover. Pause while the booking action has keyboard focus, while the document/section is inactive, or for reduced-motion preferences. Remove the service Pause/Resume button at the designer's request.
- Restore the continuous testimonial marquee. Its own Pause/Resume control remains so a visitor can stop the moving text; this is separate from the removed service control. Reduced motion provides stationary, horizontally scrollable reviews. Hide the repeated visual copy from assistive technology.
- Add the dark-gold About Me label, retain the offset portrait border, add a portrait shadow and selectively emphasize qualifications, experience, education and practical remedies. Keep the intro and four credentials aligned to the same column width.
- Split the shared footer into Contact Info and Visiting Hours; preserve the existing decorative mark and links. Use CalendarClock for the schedule, visually balance the WhatsApp icon and remove the duplicate brand-column WhatsApp. Display hours on three deliberate rows. Shorten the address label to Vasant Kunj, New Delhi – 110070 while keeping its existing full Maps destination. Retain the existing six-digit PIN rather than silently dropping a digit from the designer's abbreviated note.

The Impeccable workflow helped consolidate visual inspection and responsive corrections; the designer's requested identity and behaviors take precedence over generic aesthetic recommendations.

## Current verification

The latest desktop browser batch covered 1366×768, 1920×1080 and 2560×1440. At those sizes:

- No horizontal page overflow; the proof tray's midpoint matched the section boundary exactly, and its bottom matched the initial viewport bottom.
- Homepage body text measured 17px, 20px and 24px respectively. All four hero service names shared one row.
- Service frames measured approximately 330px, 474px and 480px square with internal padding of 20.49px, 28px and 28px. No service Pause button remained.
- The footer had six balanced columns, one WhatsApp link, three separate schedule rows and a height of about 353–385px.
- Screenshot review caught and corrected WhatsApp bitmap clipping and insufficient clearance before the testimonial section on short laptops.

Final confirmation also covered:

- Independent screenshot inspection at 320×740, 390×844, 1024×768 and 844×390: no horizontal overflow, readable wrapped hero terms, aligned mobile About content, correct footer hours/address and one WhatsApp link. The narrowest Consultations label fits its 66px allocation. The 1024px service frame is 288px square.
- All five desktop service variants fit the same approximately 386px card at 1366px, with booking actions contained and 25px clearance before testimonials. Manual Numerology selection automatically advanced to Vastu. The marquee moved continuously and its Pause control froze it.
- Reduced-motion manual service selection stayed selected beyond the normal timer. Reviews were stationary, keyboard-focusable and manually scrolled by 260px. Escape closed the mobile menu and restored focus.
- Both local font files loaded. The shared footer was inspected on the actual `/#/about` route, which retained its existing Outfit body font and had no horizontal overflow. No uncaught browser page errors occurred; connection failures to the inactive backend are expected, not backend verification.
- The built Wi-Fi preview exposed a duplicate translation from a legacy utility class that the editing preview had not exposed. Removed that conflicting class from both floating boundary panels and assigned positioning to one CSS rule. Rebuilt and directly checked the built site at 1366, 1920, 2560 and 390px: proof midpoint exactly on the boundary, callout midpoint within its 1px border, no page overflow. The whole proof tray is visible in the initial viewport at all three desktop sizes.
- The built preview's feature hover moved upward exactly 5px and deepened its shadow. Its desktop service images remained square. Windows returned HTTP 200 through the requested Wi-Fi address.
- The final safe-preview build passed. Lint and `git diff --check` passed; existing unused-code/hook and bundle-size warnings remain. The final design source detector found only the existing `animate-bounce` class; built-browser computed animation was `none`, as intended by the homepage override.

Screenshots for this correction are local temporary artifacts under `/tmp/astro-refined-*`, not website assets. No real form submission, booking or email was sent. An intentionally inactive local backend is used for design review. These are focused frontend checks, not physical-device acceptance, full accessibility certification or a backend release test.

## Historical first pass — superseded, not approved

The following first-pass decisions and checks are preserved only as a record of what was changed and subsequently corrected. In particular, its eight-second services, static testimonials, smaller width cap and full-height section metrics do not describe the current implementation.

### Initial design decisions

- Preserve the colleague's portraits, gold/plum/ivory identity, service prices and existing factual copy. Give the five service cards distinct descriptive labels.
- Use locally served Source Serif 4 for editorial headings and Source Sans 3 for readable body text and controls. Font files and their SIL Open Font Licenses are in `public/fonts/`.
- Keep the homepage root at the browser's normal text size instead of the old width-based jumps. Body copy scales gently from 16 to 18px; secondary copy is 15px, control labels 14px, section headings 30–44px and the hero heading 42–76px. These are default-browser-size ranges, not a restriction on user zoom.
- Align the About introduction and credential grid to the same right-column width. Use consistent gutters, a capped content width, offset portrait framing, shallow shadows and a 5px hover lift. Avoid scaling card text during the lift.
- Assemble major pieces from different directions using short, one-time entrances. The hero wheel rotates only while visible. Honor reduced-motion preferences; do not remove functional loading feedback.

The font and sizing overrides in `Home.css` apply only while `.home-page` is mounted, including the shared header/footer on that route. Other pages retain their existing typography until their own review. The shared navigation also receives narrowly scoped usability fixes: labelled 44px menu buttons, Escape-to-close with focus restoration, keyboard access to the desktop services submenu, and a scrollable short-screen drawer.

### Initial landscape section rhythm

Use the available viewport height **minus the measured sticky header**, with minimum heights rather than fixed heights or scroll snapping.

| Scene | Contents |
| --- | --- |
| Hero | Introduction, portrait, actions and three proof points |
| Offerings | Benefits and service chooser together on wider landscapes |
| Testimonials | Complete review cards and the consultation callout |
| About | Portrait, introduction and credentials |
| Inquiry | Service selection and consultation form |

At landscape widths of 1024–1199px, benefits and the service chooser each receive their own scene because the service details stack vertically. Phones, portrait layouts and windows under 600px high use natural content flow. All scenes may grow for long text, short windows or zoom; readable content takes precedence over exact screen-height alignment.

### Initial interaction behavior — replaced

- Services advance every eight seconds only when the section is visible and the document is active. Hovering or keyboard focus pauses them. Manual selection stays selected until the user chooses Resume. Reduced-motion users get manual selection only.
- Testimonials no longer auto-scroll. Previous/Next changes the first displayed review; one, two or three complete cards are shown according to width.
- Existing booking links, WhatsApp destinations, inquiry handling, prices and verification logic are preserved. Do not submit real enquiries as part of visual review.

### Initial verification record — 2026-09-08, superseded

Before/after browser screenshots were reviewed. Final confirmation covered 320×740, 390×844, 844×390, 960×540, 1024×768, 1280×720, 1366×768, 1440×900, 1920×1080 and 2560×1440. The 960×540 case also exercises the available CSS layout area of a 1920×1080 display at 200% zoom; it is not proof from native browser zoom or a physical device.

- At 1366×768, all five scenes measured 683px beneath the 85px header. At 1440×900 they measured 815px; at 1920×1080, 995px; at 2560×1440, 1355px.
- The shorter 1280×720 case intentionally allows offerings (659px) and inquiry (675px) to exceed the 635px available area rather than shrink text or hide controls.
- No horizontal page overflow at the tested sizes after content settled; narrow-phone decorative overflow and the overlapping review callout were corrected.
- All five desktop service variants fit the 340px details card at 1366px. Automatic advance, Resume, hover/focus pause, manual selection, keyboard activation and testimonial Previous/Next were checked.
- The mobile inquiry selector exposed all five choices, including the longest option at 320px. Selection and local required-field validity were checked without submitting anything.
- The short landscape menu scrolled to its final booking link. Escape restored focus to its named menu button.
- Both new fonts loaded and no broken homepage images were detected. Navigating to About restored Outfit; returning Home restored Source Sans 3.
- Reduced-motion mode stopped the decorative wheel, hover translation and automatic service switching. Browser checks reported no uncaught page errors. Refused requests to the deliberately inactive local backend are expected and are not successful backend verification.
- `npm run build` and `npm run lint` passed. Existing unused-code/hook warnings and the existing large-JavaScript-bundle warning remain; they were not expanded into unrelated cleanup.
- The Impeccable source detector reported one legacy `animate-bounce` class. Homepage CSS disables it, and browser-computed `animation-name` was `none`; the visible homepage does not bounce.

Screenshots from this review are local temporary artifacts under `/tmp/astro-home-before-*`, `/tmp/astro-home-final-*` and `/tmp/astro-home-final-mobile-*`, not files included in the website build.

This is focused frontend verification, not a complete accessibility certification, physical-device acceptance, backend test, or live release. The designer still needs to judge the font pairing, spacing and motion on their own screen.

## Running this local review

From the repository folder, with dependencies installed:

```bash
CHOKIDAR_USEPOLLING=true VITE_API_URL=http://127.0.0.1:8000 npm run dev -- --host 127.0.0.1 --port 5183 --strictPort
```

Open `http://127.0.0.1:5183/`. The backend address above is intentionally disconnected for safe design review. Do not treat the inquiry form as a working delivery channel in this preview.

Polling is necessary here because native file watching missed changes on the Windows-mounted checkout. This does not require changing shared project configuration.

For the explicitly requested Wi-Fi review, build with the same inactive backend and serve the built files on the WSL interface:

```bash
VITE_API_URL=http://127.0.0.1:8000 npm run build
npm run preview -- --host 172.29.7.110 --port 5184 --strictPort
```

The current machine's Windows forwarding rule maps `192.168.100.191:5183` to `172.29.7.110:5184`. Its dedicated firewall allowance is limited to TCP 5183 on the Wi-Fi interface and local subnet `192.168.100.0/24`. The Windows network profile and unrelated forwarding rules were not changed. This is a built preview, not the source-serving development server; rebuild and refresh to see new edits. These machine-specific IPs may change after reconnecting or restarting WSL.

The enable/disable PowerShell scripts are in the workspace's sibling `preview-access/` folder, outside this Git repository. Stop the preview and run the disable script with Windows administrator approval when sharing is no longer needed. The firewall/forwarding rules do not expire automatically. Do not expose this design preview to the public internet or treat its forms as working delivery channels.

## Continuing page by page

For each subsequent page, inspect its actual components and current browser appearance before deciding on changes. Capture and visually inspect the affected sections before and after edits at laptop, large desktop and phone sizes. Also check narrow/short windows, navigation, long text, hover/focus and reduced motion. Preserve unrelated code and verify the build; do not use a successful build as a substitute for looking at the website. Apply this homepage direction to other routes only as they enter the design review.

Collect and discuss structural, interaction or design-philosophy changes before implementation. The designer explicitly rejected replacing a moving marquee with static click-through cards or changing the section-overlapping proof tray without discussion. Approved typography, spacing, responsive sizing and alignment refinements do not require repeated permission requests.
