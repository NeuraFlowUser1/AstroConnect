> **Historical source/design record — reviewed 19 October 2026.** Use [the current operating/source guide](docs/appointment-system-release.md) first. The dated body below describes its original source and observations; obsolete backend paths and unbundled screenshots are historical references, not present commands, current features or fresh proof. No missing evidence is reconstructed or claimed as available.

# Booking foundation and private-calendar review

Date: 2026-09-09. Scope: the approved [booking roadmap](BOOKING_ROADMAP.md), not a new marketing-site redesign. Existing page-by-page changes were already present in the worktree and were preserved. No commit, push, PR or deployment was performed.

**Later checkpoint:** [2026-09-10 local preparation](docs/evidence/plan-001/2026-09-10-local-preparation.md) adds fresh tests, native hosting preparation, notice/clock/closure safeguards and dependency patches. Results below remain the original dated record, not current totals.

## Outcome and limits

The booking rules, durable storage layer, secure verification primitives, truthful inquiry handling and private calendar are implemented and locally tested. **The full online booking system is not finished or live.** Real hosting/database configuration, Google sign-in acceptance, Calendar/Meet, notification delivery and Razorpay still require work and authorized provider tests. Public checkout intentionally stays disabled until verified payments are implemented.

The old active backend could not be safely treated as a production foundation. Its hard-coded credential defaults, external work at import, JSON/spreadsheet fallbacks and swallowed failures were removed from the active path. A redacted non-executable copy is preserved in `.archive/booking-backend-before-roadmap.txt`. No historical customer file was read, copied, migrated or deleted. **Previously exposed SMTP/Upstash credentials still need owner-authorized rotation; Git history can retain old values.** Do not print a full deletion diff of the old backend into a report or PR discussion.

## Implemented work

| Area | Local implementation |
| --- | --- |
| Services and fees | One shared catalogue supplies six services, including Name Change at ₹5,100, General Numerology at ₹3,100, and Prashna at ₹1,100 × 1–10 questions. Browser-submitted prices cannot override server calculation. |
| Timing | All sessions are 30 minutes. Booking dates use IST, today through today+10 inclusive. Started/past slots, Sundays, lunch hours and off-grid starts are rejected. |
| Occupancy | PostgreSQL owns the schedule. Bookings, unexpired checkout holds and closures share a unique slot claim; one transaction lock coordinates the small studio schedule. Unknown storage does not produce imaginary free time. |
| Checkout preparation | Expiring holds, payment reference deduplication, mismatch/late-payment review and immutable agreed prices are internal primitives. There is no public payment bypass and no actual Razorpay integration yet. |
| Customer form | Six services, quantity selector, total, extra-question payment wording, 30-minute disclosure and the correct cancellation phone. Availability errors disable time choices. Details remain available after failed saves. |
| Private calendar | `/#/studio/calendar`: Google-locked entrance, month/day selection, appointment details, close day/range, reopen and record an agreed phone cancellation. The API checks account/session/origin/CSRF independently of the visible interface. |
| Client identity | Official Google identity validation; verified authorized Gmail account; stable Google identifier pinned on first accepted login; expiring browser-bound login challenge; eight-hour secure HttpOnly session; server-side logout. Real client sign-in remains unverified. |
| Email verification | Six-digit codes expire, wrong guesses and resends are limited, tokens are purpose/email-bound and usable once. Only digests are stored. A failed email request never opens a success path. The real sender is disabled by default. |
| Inquiries | Home/Contact/Prashna now wait for actual durable acceptance. Inquiry fields are retained, including email and relevant birth details. Retry IDs prevent duplicate records after uncertain responses. A manual WhatsApp link uses the confirmed client phone; it is not an automatic alert. |
| Delivery intent | Booking/cancellation/payment-review/inquiry records queue their delivery intent in the same transaction. No worker sends those jobs yet, and no queued state is described as sent. |

## Review and correction loop

1. Traced the current routes, UI callbacks, storage paths, provider references and existing documentation before replacing the backend. Kept the existing React/FastAPI stack; the architecture-planning skill favored a single reliable record store over additional overlapping services.
2. Tested the time/price rules independently, then with real isolated PostgreSQL transactions. Added concurrent-customer and booking-versus-closure cases, payment replay and late-capture cases, token binding/expiry and durable inquiry retry tests.
3. Strengthened rollback behavior: a notification-intent insert failure cannot leave a falsely accepted inquiry or consume its verification credential. Failed OTP attempts commit their counters rather than rolling them back. An expired hold cannot revive or seize a different claim. Cancellation does not lose payment history or silently refund.
4. Repaired the front-end failure paths. Home used the wrong verification purpose; some forms previously claimed success before storage returned. Removed duplicate error messages and false chart/notification promises; preserved details for retry and suppressed late verification responses from an obsolete dialog.
5. Built and reviewed the small private page, then added identity/session tests: wrong account, unverified email, nonce mismatch/replay, expired challenge/session, stable account pinning, unauthorized requests, wrong origins, missing CSRF, logout and login rate limits. Used synthetic Google identities only in tests, never a runtime bypass.
6. Visually inspected public booking, Contact, Home/Prashna errors and the private calendar. Improved booking date readability and arrow target size, shortened time-button text while retaining full accessible labels, removed unnecessary date-card stretching, corrected the private page's inherited typography and expanded its large-landscape scale. Fixed time-select labels found by browser tests. The design-audit skill kept these changes scoped; its missing supplementary templates were replaced by the checklist and existing project design rules.
7. Re-ran the public/private browser checks after refinements, checked the build/lint and kept provider/live evidence explicitly pending. Static/private entrance checks also used the actual unconfigured local backend, not only mocks.

## Verification evidence

- **58 distinct Python tests pass**, including the PostgreSQL integrations. They ran with Python 3.12 against a temporary PostgreSQL 16.2 instance on a UNIX socket only, with synthetic records. This patch version is local test tooling, not the recommended production version. Tests refuse to truncate anything outside the named isolated test database.
- **Three JavaScript policy tests pass**: IST midnight/date selection, the ten-day/Sunday boundary, half-hour slot labels and fee formatting.
- **Public-form browser suite passes** at 1440×900, 2560×1440 and 390×844: quantity/fees, 30-minute display, date restrictions, unavailable times, failed OTP send, failed booking/inquiry save, saved inquiry receipt, retry ID reuse and preserved inputs. It also checks keyboard containment, Escape, and a delayed verification reply after closing the dialog; the reply does not submit the form. It intercepted five synthetic submissions per viewport. No application errors, document-width overflow or overflowing booking buttons were found in those runs.
- **Private-calendar browser suite passes** at the same sizes: locked entrance, simulated Google callback, day display, whole-day conflict, free-range closure/reopening, phone cancellation, unavailable-data lockout and sign-out. Five mutation requests per viewport carried the expected synthetic anti-forgery token. No application errors or document-width overflow were found.
- `npm run build` passes. It still reports the incumbent large-bundle warning; this stage did not attempt an unrelated route/bundle refactor. `npm run lint` completes without errors but retains existing unused-import and hook-dependency warnings elsewhere in the supplied components. Newly added private-calendar modules do not introduce a lint warning.
- `git diff --check` passes. The Python test client emits a tooling deprecation warning about its HTTP test transport; tests pass. Hosted dependency/security review and current-provider-version testing remain release work, not implied by these results.

Browser scripts: [public booking/inquiries](tests/browser-booking.cjs), [private calendar](tests/browser-private-calendar.cjs). API/email/Google identity responses are intercepted in those UI tests. PostgreSQL/API tests independently prove the local persistence/security rules. Neither test category proves real email delivery, Google acceptance, Meet creation, Razorpay behavior, hosted uptime, backup recovery or physical-device acceptance.

### Retained screenshots

All captures contain synthetic test data. The folder is `.impeccable/booking-foundation-2026-09-09/`, with machine-readable `browser-results.json` and `admin-browser-results.json`.

- Booking: laptop quantity/fee view (historical path `.impeccable/booking-foundation-2026-09-09/booking-questions-1440.png`; unavailable in this maintained copy), 2560-wide view (historical path `.impeccable/booking-foundation-2026-09-09/booking-questions-2560.png`; unavailable in this maintained copy), phone error state (historical path `.impeccable/booking-foundation-2026-09-09/booking-save-error-390.png`; unavailable in this maintained copy).
- Inquiries: Contact save error (historical path `.impeccable/booking-foundation-2026-09-09/contact-save-error-1440.png`; unavailable in this maintained copy), Contact accepted receipt (historical path `.impeccable/booking-foundation-2026-09-09/contact-saved-390.png`; unavailable in this maintained copy), Home error (historical path `.impeccable/booking-foundation-2026-09-09/home-inquiry-error-1440.png`; unavailable in this maintained copy), Prashna phone error (historical path `.impeccable/booking-foundation-2026-09-09/prashna-inquiry-error-390.png`; unavailable in this maintained copy).
- Private calendar: laptop (historical path `.impeccable/booking-foundation-2026-09-09/admin-day-1440.png`; unavailable in this maintained copy), large desktop (historical path `.impeccable/booking-foundation-2026-09-09/admin-day-2560.png`; unavailable in this maintained copy), phone (historical path `.impeccable/booking-foundation-2026-09-09/admin-day-390.png`; unavailable in this maintained copy), conflict (historical path `.impeccable/booking-foundation-2026-09-09/admin-conflict-1440.png`; unavailable in this maintained copy), unavailable state (historical path `.impeccable/booking-foundation-2026-09-09/admin-unavailable-390.png`; unavailable in this maintained copy).

The map embedded on Contact was excluded from mocked form tests. Screenshots are browser viewport captures, not proof from the user's actual laptop, desktop or phone. Existing page artwork, review claims and qualifications were not independently validated in this booking task.

## Next step and release blockers

Latest planning alignment, 2026-09-10: retain existing React/Vite/FastAPI on Hobby-compatible Vercel hosting, Neon/Resend Free, Google identity/Calendar/Meet and a small Cloudflare Free queue/schedule helper. No technical Pro prerequisite or upgrade date; no duplicate website/main backend port. Domain, delegated user access, client ownership and Google identifiers are known; actual account/configuration/usage proof is pending. [Plan 1](docs/PLAN-001-booking-inquiries-and-client-calendar.md) owns the next local baseline and stage gates. See [the alignment review](docs/PLAN-001-no-card-hosting-review.md). None of this adds runtime proof to the dated results above.

The user subsequently confirmed on 2026-09-09 that the site is pre-handover and all existing bookings/inquiries are dummy. No live-customer migration is required; this question is closed. No old data has been deleted. This clarification does not change the local verification results above or prove any provider connection.

Prepare a scoped Hobby-compatible test setup with isolated synthetic data and verified persistence. Check actual Free-plan eligibility/quotas without adding cards, billing, paid bundles or upgrades. No account/resource was provisioned by this review. Quota failures and retained backups remain explicit gates; do not weaken destructive local test safeguards for a hosted database.

Then connect real client Google login, Calendar/Meet and the Free dispatch/recovery helper with authenticated handlers. Test zero-visitor recovery, failed/uncertain delivery and actual Hobby compatibility using approved recipients. Razorpay stays at its stage; no partner secrets now. The client's Gmail recipient address alone does not verify an email sender or grant Calendar access. [Google identity verification](https://developers.google.com/identity/gsi/web/guides/verify-google-id-token).

Local integration work can continue without access to the old dummy stores. Before live release: rotate old credentials; keep dummy records out of production; agree retention, phone-cancellation refunds and payment-exception resolution; confirm any invoice/tax requirements; prove backup restoration; test real hosted authentication/cookies/proxy rate limits; verify payment capture/replay/reconciliation and both participants' meeting notifications; obtain client acceptance and publication authority. “Locally passed” must not be upgraded to “airtight” or “live-ready.”
