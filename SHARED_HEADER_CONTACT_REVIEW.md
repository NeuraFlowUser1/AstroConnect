> **Historical source/design record — reviewed 19 October 2026.** Use [the current operating/source guide](docs/appointment-system-release.md) first. The dated body below describes its original source and observations; obsolete backend paths and unbundled screenshots are historical references, not present commands, current features or fresh proof. No missing evidence is reconstructed or claimed as available.

# Shared header, Name Change booking and Contact refinements

Completed locally on 2026-09-09. This is a targeted follow-up to the designer's eight requests, not a redesign or publication. Prior homepage, Services, About and Testimonials work is preserved.

## Changes and reasons

- **One header:** App already rendered one Navbar. The discrepancy came from homepage-only header rules, inherited homepage fonts and its different root text scale. Retired rules are preserved in `.impeccable/archive/home-header-overrides.css`, which is not imported. `Navbar.css` now owns a local scale matching the incumbent non-home header at each existing breakpoint. The homepage's body typography and layout rules remain separate.
- **Services disclosure:** the parent is a button, not a link. Desktop and mobile share one list sourced from `publicServices`: a visually distinct All Services row followed by six consultations. Explicit open state replaces hover/focus-within persistence. Navigation, repeated selection of the current destination, pointer leave, outside click and Escape dismiss the menu. ArrowDown opens and focuses the first destination. Short screens can scroll the menu.
- **Name Change:** the designer-confirmed ₹5,100 is stored once in public service data. Services and its detail page display it; their Book Now links, plus About's Book Now link, use `/booking?service=name-change`. The added booking option shares the price and is preselected through that link. No scheduling, other booking prices, backend submission logic or payment processing was changed.
- **Homepage closing actions:** Book an Appointment and Get in Touch on WhatsApp sit below and outside the inquiry form, centered in a row on landscape and stacked on narrow screens. WhatsApp retains the existing studio destination, `918527790801`.
- **Contact details:** one outlined phone icon groups both direct-call numbers; individual accessible copy actions remain. A calendar-clock icon accompanies three separate office-hours lines: Monday–Saturday, 10 am–12 pm, 3 pm–6 pm.
- **Contact form:** removed the submit row's automatic spacer and distributed available panel height between field groups. Mobile retains natural content height. Labels have a modest readable scale, inputs retain touch-sized targets, the message field keeps its original minimum height, and the shortened phone placeholder no longer clips. An explicit gap separates the office address from the hours divider.

## Visual and functional checks

Before-and-after visual inspection covered 1366×768, 2560×1440 and 390×844, with intermediate navigation checks at 1024×768, 320×740 and 844×390. One consolidated correction batch restored the textarea minimum height, shortened the clipped placeholder, separated office hours from the address and bounded the desktop dropdown on short screens. Final screenshots were inspected after animations settled.

- Header measurements matched across Home, About, Services, Testimonials, Contact and Booking: 85px rail / 1280px content frame / 20px brand at 1366px; 138px rounded rail measurement / 2080px frame / 32.5px brand at 2560px. All used Outfit. Homepage body fonts remain unchanged.
- All six individual service routes rendered content and closed the dropdown. All Services, same-page selection, parent-button non-navigation, pointer dismissal, outside-click dismissal, ArrowDown and Escape passed.
- Emulated touch checks passed for opening the mobile service list, Name Change navigation and All Services navigation, with dismissal after both destinations.
- Services and Name Change detail pricing matched the selected booking option at ₹5,100. About's Name Change Book Now destination was also checked.
- Homepage appointment navigation passed; the WhatsApp destination was inspected without sending a message.
- Contact empty-form errors remained visible. The focused regression run intercepted submission endpoints, observed **zero API POST requests** and recorded **zero application page errors**. An earlier broad POST counter was inconclusive because it included the embedded third-party map; it was replaced with the endpoint-scoped check. No real inquiry, OTP or appointment was sent.
- The production build succeeded. Focused lint completed without errors but retained existing unused-code and hook-dependency warnings. `git diff --check` passed. The focused design detector returned 13 advisory palette/radius findings (exit 2), not a clean detector verdict: the Services-scoped design document does not describe all incumbent shared-header/Contact styles. The plum/gold menu tones and 6px link corners are intentional local disclosure styling; no suppression rules were added.

The browser-tool connection dropped after final layout captures. The remaining functional checks were completed with installed Chromium and Playwright, without installing dependencies. These are local frontend and emulated-device checks, not physical-device acceptance or end-to-end booking/backend verification.

## Saved evidence

- Laptop header and service menu (historical path `.impeccable/review/rail-final-laptop-menu.png`; unavailable in this maintained copy), large desktop menu (historical path `.impeccable/review/rail-final-desktop-menu.png`; unavailable in this maintained copy), mobile menu (historical path `.impeccable/review/rail-final-mobile-menu.png`; unavailable in this maintained copy).
- Laptop Contact panel (historical path `.impeccable/review/rail-final-laptop-contact-panel.png`; unavailable in this maintained copy), large desktop Contact panel (historical path `.impeccable/review/rail-final-desktop-contact-panel.png`; unavailable in this maintained copy), mobile Contact panel (historical path `.impeccable/review/rail-final-mobile-contact-panel.png`; unavailable in this maintained copy).
- Homepage laptop actions (historical path `.impeccable/review/rail-final-laptop-home-actions.png`; unavailable in this maintained copy), desktop actions (historical path `.impeccable/review/rail-final-desktop-home-actions.png`; unavailable in this maintained copy), mobile actions (historical path `.impeccable/review/rail-final-mobile-home-actions.png`; unavailable in this maintained copy).
- Name Change service chapter (historical path `.impeccable/review/rail-final-name-service.png`; unavailable in this maintained copy), detail pricing (historical path `.impeccable/review/rail-final-name-detail.png`; unavailable in this maintained copy), selected booking option (historical path `.impeccable/review/rail-final-name-booking.png`; unavailable in this maintained copy).
- Focused regression results (historical path `.impeccable/review/astro-rail-results.json`; unavailable in this maintained copy). Temporary regression runner: `/tmp/astro-rail-check.cjs`.

Preview returned HTTP 200 at `http://172.29.7.110:5184/`. The older Wi-Fi forwarding address was not repaired or claimed working by this task. Preview builds deliberately target an inactive local backend, so forms cannot reach production. No commit, push, PR or deployment was performed.
