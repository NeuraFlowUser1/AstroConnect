> Dated GitHub handoff copy, 19 October 2026. The original working document is recorded in manifest.json. Relative links have been adapted for this repository; any unavailable local-only evidence is identified explicitly.

> **Historical imported copy — reviewed 19 October 2026.** This file describes the previous source/engine. It is not the maintained publication or an instruction to repeat setup. Start with [Project 003 current status](../PROJECT-STATUS.md) and [the maintained operating guide](../../../appointment-system-release.md). Preserve this dirty import and unrelated work.

# Booking and inquiry roadmap

Last updated: 2026-09-10.

**Execution now lives in [Plan 1](docs/PLAN-001-booking-inquiries-and-client-calendar.md).** Read its resume checkpoint first. This document retains detailed requirements, earlier stage summaries and historical decisions; update active progress, task IDs, evidence and next actions in Plan 1 rather than creating competing checklists.

## Current position

**The user approved the roadmap and its defaults. The booking foundation and private calendar are implemented and locally tested; the complete live booking system is not yet connected.** Public checkout deliberately remains disabled until verified Razorpay payments are integrated. Existing marketing-page designs are preserved.

Current local preparation evidence is in the 2026-09-10 checkpoint (local workspace reference: `03-client-projects/003-astroadvice-by-kundan-singh/AstroConnect/docs/evidence/plan-001/2026-09-10-local-preparation.md`); BOOKING_FOUNDATION_REVIEW.md (local workspace reference: `03-client-projects/003-astroadvice-by-kundan-singh/AstroConnect/BOOKING_FOUNDATION_REVIEW.md`) retains the earlier baseline. Technical setup is in the backend runbook (local workspace reference: `03-client-projects/003-astroadvice-by-kundan-singh/AstroConnect/src/backend/README.md`). All existing bookings/inquiries are dummy: no live-customer migration is required. Hosting/account setup and live provider delivery remain pending. Do not deploy this intermediate backend as a live paid-booking service.

This document is the supporting requirement/decision record for booking, inquiries, private availability controls and their integrations. It separates confirmed requirements from recommendations. Keep current facts consistent with Plan 1 and preserve dated history. Never describe a local test as proof of a live integration.

**Provider alignment — 2026-09-10:** retain React/Vite/FastAPI on Hobby-compatible Vercel hosting with Neon Free, Resend Free, Google identity/Calendar and a small Cloudflare Free queue/schedule helper. The latest requirement is no mandatory Pro feature, not operation through a Vercel outage. No duplicate site or main runtime port. Read the alignment review (local workspace reference: `03-client-projects/003-astroadvice-by-kundan-singh/AstroConnect/docs/PLAN-001-no-card-hosting-review.md`), D11 and R17/T29; actual account/runtime/usage proof remains open.

**Vercel arrangement — clarified 2026-09-10:** preserve the user's reported arrangement. Pro timing belongs to the client/provider, not a technical booking gate. Hosting's Hobby-included execution is allowed; other providers remain direct no-card Free within limits. No paid bundles, trials or automatic upgrades. Pro usage can be metered, so no zero-overage promise. Domain/access/ownership are known; actual source/project configuration remains uninspected.

## 1. Confirmed requirements

| Item | Rule |
| --- | --- |
| Project and existing data | Pre-handover website taken over from the colleague who created the GitHub repository. The user confirmed all existing bookings/inquiries are dummy. Start the new booking store empty; importing those test records is unnecessary. This does not authorize deletion of old external stores/accounts. |
| Client notification email | astroadvicebyks@gmail.com. |
| Client phone / cancellation contact | +91 85277 90801. Normalize internally as +918527790801. |
| Consultation length | Every service takes exactly 30 minutes, irrespective of price or number of questions. |
| Advance booking | Customers may book future slots today through today +10 calendar days inclusive in IST, under the approved default below. |
| Cancellations | Customers must telephone the client. No public self-cancellation journey. Refund terms have not been specified. |
| Private calendar | A simple credential-protected page allows the client to close whole days or portions of a day in advance. |
| Existing bookings | The client cannot close a day or a time range containing existing bookings. Closing availability must never silently cancel a booking. |
| Services | Six services, including Name Change Consultation. Use General Numerology as the numerology service name. |
| Prashna Kundali | Offer a question-count selector from 1 to 10; charge ₹1,100 per question. State that extra questions during the consultation require extra payment at that time. |
| Online consultations | Generate Google Meet links and send the details to the customer and client. Customer email is required; email verification is requested. |
| Payments | Integrate the client's Razorpay merchant account. Handle partner/account setup during the payment stage, not as a prerequisite to planning. |
| Inquiries | Repair and account for all inquiry destinations, storage and notifications alongside booking work. |

### Service catalogue for implementation

The server must calculate prices; browser-submitted prices are never authoritative. Public pages and booking displays must agree with this catalogue.

| Service | Fee | Provenance |
| --- | --- | --- |
| Vedic Astrology | ₹2,100 | Existing public catalogue, retained. |
| General Numerology | ₹3,100 | Designer-confirmed. |
| Vastu Consultation | ₹5,100 | Existing public catalogue, retained. |
| Laal Kitaab Remedies | ₹1,100 | Designer-confirmed, not per question. |
| Prashna Kundali | ₹1,100 × 1–10 questions | Designer-confirmed; ₹1,100–₹11,000 total. |
| Name Change Consultation | ₹5,100 | Designer-confirmed. |

Every row is 30 minutes. Ten Prashna questions do not purchase a longer slot. Keep that distinction clear before payment. Continue hiding duration metadata on general marketing pages; show the 30-minute session length clearly in booking.

## 2. Approved implementation defaults

- **Time zone:** India Standard Time (`Asia/Kolkata`) for business hours, the booking horizon and all customer-facing dates. Store precise timestamps consistently and label the displayed time zone.
- **Office hours:** Retain the site's Monday–Saturday, 10 am–12 pm and 3 pm–6 pm schedule. This is carried forward from the site, not a newly supplied schedule. Sunday and the lunch interval are closed.
- **Slot starts:** 10:00, 10:30, 11:00, 11:30, 15:00, 15:30, 16:00, 16:30, 17:00 and 17:30. One booking per slot; no simultaneous consultations or invented buffer time.
- **Ten-day boundary:** Allow eligible future slots today through today+10 calendar dates inclusive in IST, not a rolling 240-hour cutoff. Approved D10's 30-minute minimum notice is now enforced by public availability and internal hold creation and tested at the exact boundary. Existing hold retries retain their original deadline. Public checkout/status integration remains disabled/pending. This does not add a gap between consecutive consultations.
- **Advance closures:** Let the client close dates beyond the public 10-day booking horizon, so holidays can be entered well in advance. Closures can be reopened. Time ranges align to half-hour booking boundaries.
- **Private access:** Sign in with Google, restricted on the server to the verified client account above, then pinned to its stable Google identifier. No public registration or shared password in website code. The implementation uses secure, eight-hour browser sessions; actual Google account setup and hosted verification are pending.
- **Phone cancellation recording:** A small, confirmed “Mark cancelled” action in private booking details records the phone-arranged cancellation, releases the slot, preserves the record and queues calendar/notification work. It does not automatically issue a refund. This action was approved with the roadmap. Actual downstream delivery is still pending implementation.
- **Temporary checkout holds:** Treat an unexpired hold as occupied for customers and closure actions. The local implementation expires it after 10 minutes or at the appointment start, whichever comes first. Reconcile this with Razorpay checkout behavior at the payment stage; late payments must not revive expired holds.
- **Calendar boundary:** The private page and booking database control availability. Google Calendar receives booking events. Arbitrary events added to the client's personal calendars will not silently become availability rules; additional personal-calendar conflict checking would need an explicit decision.
- **Notifications:** Booking emails to both parties, inquiry alerts to the client and a short inquiry receipt to the sender. Automated WhatsApp/SMS notifications are not assumed or promised. A manual WhatsApp link is a separate feature, not an automatic notification integration.

## 3. Small interface, reliable foundation

Preserve React/Vite/FastAPI, one Neon PostgreSQL store and a small private calendar. Prove native Hobby-capable Vercel hosting; use one Free Cloudflare queue/schedule helper for bounded authenticated Python delivery/recovery calls. Saved PostgreSQL intent remains authoritative across failed dispatch and queue expiry. No Pro Cron, fire-and-forget fallback, always-polling database or extra queue platform. Use Resend and Google identity/Calendar/Meet; retained backups/independent alerts remain explicit gates. Client-owned delegated access is settled, not inspected account readiness. No main runtime rewrite or provisioning has occurred.

### Private page

The private route is `/#/studio/calendar`. It shows a calendar and selected-day list with Open, Booked, Closed, Payment in progress and Not available states. The client can close a whole day or range, reopen a closure, open booking details and record an agreed phone cancellation. It has a separate single-column phone layout. No analytics dashboard, staff roles, customer CRM or public account area is needed. The calendar page itself is visible as a locked entrance; every private data/action endpoint requires authorization independently.

If any booking overlaps a requested full-day closure, reject the whole closure with a plain explanation. The client can instead close the remaining free ranges. Partial closures use the same overlap rule. Perform both booking and closure checks atomically in the database, so two simultaneous actions cannot bypass the restriction.

### Customer booking sequence

Choose service and question count if applicable → select an eligible 30-minute slot → enter details and verify email → temporarily hold the slot and create the server-priced payment order → complete Razorpay payment → verify and record payment on the server → confirm the booking → create its Google Calendar event/Meet link and send confirmation details.

Record booking, payment, calendar and email states separately. A saved paid booking must not disappear because an email fails. Do not tell the customer an email was sent or a meeting link is ready until that is true. Retry failed delivery without creating duplicate bookings, charges, events or emails. Show an honest pending-delivery state when necessary and make operational failures visible to the client.

Google Calendar connection needs its own client authorization; Sign in with Google alone does not grant calendar access. Prefer a client-owned booking calendar with unique Meet conferences and invitations, subject to account capability checks. Do not fall back silently to Jitsi or a reused public meeting link.

### Inquiries and historical data

Save inquiries durably before acknowledging receipt. Notify only approved destinations. Resolve the inconsistent legacy phone numbers, email routes and hard-coded spreadsheet targets; do not continue broadcasting customer information to unidentified destinations. Google Sheets can be an optional, explicitly approved reporting copy, never the authoritative booking lock.

The user confirmed that all existing bookings and inquiries are dummy data. No customer-record migration is needed; do not import these test records into the new live booking store. Preserve the old test stores unless a specific cleanup is authorized. Keep future test records separate from production. Do not store OTPs or verification tokens in customer records or logs.

## 4. Staged delivery tracker

| Stage | Deliverable | Current status | Completion evidence |
| --- | --- | --- | --- |
| 0. Rules and roadmap | Confirmed rules, explicit defaults, dependencies and acceptance checks. | Approved. | User instruction to proceed; defaults above. |
| 1. Safe booking foundation | Repair security/startup faults; establish durable storage, one service/price catalogue, half-hour slots, horizon and atomic booking/closure protections. | Implemented; local verification passed. Hosting and credential rotation pending. | PostgreSQL integration tests, including eight simultaneous customers and a booking/closure race. No real messages or charges. |
| 2. Booking and private calendar | Six-service form, 1–10 question count, clear price/length/cancellation text, truthful statuses, private calendar and authorized client access. | Implemented locally; real Google login and hosted cookie/domain checks pending. Checkout remains gated. | Public and private browser checks at 1440×900, 2560×1440 and 390×844; session/account/CSRF protection tests using synthetic Google identities. |
| 3. Email, Google and inquiries | Secure email verification, approved delivery, client Calendar/Meet, inquiry storage/receipts and retries. | Partial: verification, inquiry storage and delivery intent exist. Actual Calendar/Meet, Free helper dispatch/handlers and recovery are not implemented. | Local injected senders only; Resend adapter is disabled. No real invitation/receipt proof. |
| 4. Razorpay | Client merchant setup, test checkout, signed payment verification, expiring holds, duplicate/late callback handling and payment record reconciliation. | Not started; account details intentionally deferred. | Provider test-mode payment success/failure/abandonment/replay tests and agreement of booking/payment records. |
| 5. Release readiness | Full journey, security/privacy review, backup/restore proof, visual review, client handoff and separately authorized publication. | Not started. | Evidence from the intended hosting environment and client acceptance; live payment/notification smoke tests only with explicit permission. |

Local implementation may progress using isolated test substitutes, but those are not production fallbacks or proof that an external account is connected. Account-dependent gates stay visibly pending. No stage is “live verified” merely because the UI builds or a local test passes.

## 5. Known risks from the booking/inquiry audit

These describe the inherited code at audit time, not verified production behavior. The active backend has now been replaced with the tested foundation; a sanitized, non-executable historical copy is retained in `.archive/booking-backend-before-roadmap.txt`. This is not a production fallback. The following records the original findings; the review document maps repairs and outstanding provider work.

- The inherited `src/backend/main.py` contained hard-coded credential defaults. They are removed from active code and redacted from the archive. **Owner-authorized rotation is still required: earlier Git history may contain them.** Do not print, reuse, copy into this document or commit secret values. Rotation is not completed by deleting a string locally.
- Email verification has a token-return loophole, insufficient attempt controls and sensitive logging behavior. Repair before relying on it, and keep administrator authorization separate.
- A missing `BackgroundTasks` import is a startup risk. Backend module initialization also performs external work; use isolated tests and remove unsafe startup side effects before routine execution.
- JSON storage, multiple spreadsheet destinations and swallowed failures do not establish reliable persistence. Local account configuration is absent; hosted configuration, existing data and access rights are unverified.
- The availability display and booking insertion do not safely enforce a single appointment per time interval. The new rules must be checked again on the server, not only by hiding buttons.
- Some form success messages are shown before the server has accepted the submission. Replace these with actual accepted/failed/pending results.
- Current meeting-link and event behavior does not provide the requested Google Meet invitations to both parties. Existing payment support does not implement the required verified Razorpay flow.
- General Numerology's booking price and Prashna's quantity calculation need alignment with the confirmed catalogue. The existing Name Change option alone is not a completed payment integration.
- Legacy inquiry routes include unrelated notification destinations and optional integrations that are not established as working. Disable or replace those active routes within the approved implementation; preserve historical data.

## 6. Account decisions and user actions — ask at the relevant stage

1. **Foundation / next session:** follow Plan 1 P1-01/P1-03 for fresh local baseline and bounded Hobby-compatible hosting preparation. Ownership/domain/Vercel access/Google project are known. P1-02/P1-04 inspect exact delegated accounts, no-card plans and test scope before resources or provider actions. Prove separate synthetic test data, callbacks, database transactions and the Free helper; no Pro purchase, main backend port or renewed ownership question. See [BOOKING_SETUP.md](BOOKING_SETUP.md).
2. **Google/private access:** Guide the client through official Google sign-in and Calendar authorization. Use a client-controlled project/account, least necessary access and a sustainable production authorization configuration. Test Meet creation and customer invitations; do not assume account capabilities from the email address alone.
3. **Email:** Start with Resend Free; establish the account and verify a sending domain using the existing domain's settings. No website transfer or paid Resend plan is needed for this starting choice. The client's Gmail address is the confirmed recipient, not an authorized Resend sending domain. Track combined verification/booking/inquiry usage against the daily/monthly limits and discuss any upgrade first. Set up secrets through the appropriate secure configuration interface.
4. **Razorpay:** Establish which partner arrangement and client merchant account apply, activation status, test configuration and webhook setup at Stage 4. Obtain production configuration securely only when needed. No partner credentials are required now.
5. **Before live payments:** Settle refund treatment for phone cancellations and failures where payment succeeds but a booking cannot be fulfilled. Confirm any tax/invoice requirements and customer-facing terms. Do not invent a refund entitlement, deduction or automated refund rule.

A late successful payment must never displace another customer's booking. If the original slot has become unavailable, retain the payment record, flag the case for resolution, alert through approved channels and do not display a confirmed appointment. Agree and test this resolution/refund process before go-live.

## 7. Acceptance checklist

- [x] Local rule/form tests: all six fees match the server catalogue; submitted prices and invalid question counts are rejected. Prashna counts 1 and 10 calculate ₹1,100 and ₹11,000 respectively, both for 30 minutes. Real charging remains pending.
- [x] Local rule/storage tests: IST midnight, today, today+10 and today+11 behave correctly. Past/started slots, Sundays, lunch hours and starts outside the half-hour grid cannot be booked through internal scheduling operations.
- [x] Local concurrency tests: eight customers attempting the same slot produce one hold. A closure racing a checkout hold cannot override it; confirmed bookings are also protected.
- [x] Local database/API tests: booked/held ranges cannot be closed, free ranges close/reopen, closures can extend beyond the public horizon, and expired holds release safely.
- [ ] The private page and every private server endpoint reject unauthenticated and wrong-account users. Secure sessions, expiry, logout and request protection are verified; no secret reaches browser code.
- [ ] Phone-arranged cancellation preserves the record, frees the slot and updates the calendar/notifications. It does not silently refund. Payment and cancellation history remain understandable.
- [x] Local tests: OTP expiry, wrong-attempt limits, resend throttling, replay, purpose/email binding and one-use tokens. Codes/tokens are hashed, not logged or saved in booking/inquiry records. Real email delivery is not covered by this check.
- [ ] Inquiry success means durably saved. Receipt/alert failures have a recorded retry path. Only approved recipients and storage targets receive information.
- [ ] Restart/deployment does not erase records. Backup restoration and failure recovery are demonstrated before launch.
- [ ] Google Meet creation is checked for readiness, and invitations are verified for the client and customer. Invitation delivery is not represented as guaranteed automatic addition to every customer's personal calendar.
- [ ] Payment order creation, verified success, failure, abandonment, duplicate and delayed notifications, hold expiry and reconciliation are tested. Refresh/back/repeated clicks do not duplicate charges or bookings.
- [ ] Booking confirmations accurately distinguish payment status, booking status and pending meeting/email delivery. Unknown/unavailable booking storage fails closed rather than inventing availability or success.
- [ ] Laptop, 2560×1440 desktop and mobile screenshots are inspected separately, including long text, loading, empty, unavailable, error and success states. Existing approved marketing-page designs remain intact.
- [ ] No real notification, calendar mutation, payment, refund, account provisioning, deployment, push or PR occurs without applicable authorization. Record which evidence is local, provider test-mode, hosted or client-observed.

## 8. Working log and next step

The entries below are dated history. Earlier provider choices, Pro-at-launch assumptions and account questions are not current execution instructions; use Plan 1's latest resume checkpoint.

### 2026-09-09 — requirements follow-up

- Recorded the client's contact information, universal 30-minute duration, phone-only cancellations, protected closure calendar and 10-day public horizon.
- Separated the proposed Google login, exact date boundary, existing office hours, inquiry receipt and phone-cancellation recording action from confirmed requirements.
- Reviewed the plan against concurrency, failed payments/delivery, privacy, minimal interface scope and account dependencies. Chose to retain the existing application stack and defer Razorpay setup to its implementation stage.
- Created the project roadmap and linked it from product/architecture context. No application code or external account was changed in this planning step.
- **Next:** Obtain approval of this direction and its stated defaults, then begin Stage 1. Bring back only material decisions, costs, account-only actions or scope changes; ordinary approved implementation and local checks should proceed without repeated micro-approvals.

### 2026-09-09 — approved foundation and private calendar

- User approved the direction/defaults and autonomous ordinary implementation. No provider account, hosted data or deployment authorization was inferred.
- Replaced active legacy JSON/Redis/spreadsheet/SMTP/Jitsi paths with explicit PostgreSQL persistence and configuration gates. Preserved existing customer files and sanitized historical source; no data was migrated or deleted.
- Added the shared catalogue, fixed half-hour slot rules, payment-hold/closure coordination, payment-review records, cancellation records and durable notification intents. Payment records here are internal primitives, not a Razorpay integration.
- Added secure email verification, truthful inquiry responses, retry IDs, preserved form details on failure, six-service booking choices and Prashna quantity pricing.
- Added the Google-locked private calendar, eight-hour secure sessions, one-use sign-in challenges, CSRF/origin protection, stable account pinning, closure/reopening and phone-cancellation recording.
- Reviewed source and screenshots recursively; strengthened race/rollback/replay tests, disabled unknown availability, improved time labels, dialog handling, error readability and local calendar typography. The architecture skill kept one source of truth; the design-audit checklist kept changes scoped and separated mobile from landscape.
- Verification: **58 distinct Python tests passed**, three browser-policy tests passed, and public/private browser suites passed at the three named viewport sizes using synthetic data. Build passes. The review records tooling warnings and limitations; these are not live/provider proofs.
- **Next dependency:** confirm hosting/account ownership and whether real bookings/inquiries must be preserved. Recommend retaining React/FastAPI with client-owned paid Render/PostgreSQL, subject to inspecting any existing hosting and obtaining cost approval. No service has been provisioned. The exact total must include database storage/backups, a delivery worker, email and taxes; do not quote the smallest server plan as the whole running cost.
- After that decision, connect and verify the hosting/database and Google login; implement the Calendar/Meet and durable delivery worker with approved test recipients; then configure Razorpay in test mode. Provider failures, refunds/reconciliation and backup restoration remain release gates. Razorpay details are not needed now.

### 2026-09-09 — dummy-data clarification and next setup step

- User confirmed that the website has not been handed over and all existing bookings/inquiries are dummy. The colleague originally built the GitHub repository; the user is now leading its improvement. This resolves and supersedes the earlier question about preserving real customer bookings. Do not repeat it as a prerequisite.
- Recommend an empty new booking database, with separate test and eventual production data. No old account, hosted data or local record was deleted or migrated in this clarification step.
- GitHub source ownership/access and runtime hosting/provider accounts are separate concerns. The repository's frontend routing configuration is not evidence of an active hosting account. A new controlled test environment avoids depending on the colleague's unknown runtime setup; existing deployment details can still be useful if supplied later.
- Next user action: sign in to or create a Render account and stop at the dashboard, without creating a paid resource. Present the complete proposed cost and account/domain arrangement before provisioning. Keep account access limited to this project and arrange client ownership/access before handover. Render remains a recommendation pending that setup decision.
- Local Calendar/Meet, email delivery and payment integration work may continue without inspecting or migrating the old dummy stores. Hosted authentication, real email/invitations and payment-provider acceptance still require the approved accounts and explicitly scoped test actions. Razorpay partner details remain deferred to Stage 4.
- Dummy data does not make the inherited exposed credentials safe to reuse: owner-authorized revocation/rotation is still required. Use fresh configuration for the new setup.
- Updated roadmap, product context, backend runbook and review handoff. Added a root README notice identifying its inherited booking instructions as historical. This step changes documentation only; previous test evidence is unchanged. No infrastructure purchase, account connection, notification, payment, deployment, push or PR occurred.

### 2026-09-09 — provider choices approved

- The user accepted Render, Render Postgres, Resend, Google and Razorpay after the Twilio comparison. This supersedes earlier candidate-only wording; do not reopen provider selection without new evidence or a user request.
- Added [BOOKING_SETUP.md](BOOKING_SETUP.md): first two account/domain actions, provider inventory, staged setup and itemized planning cost. Public prices give a $20 monthly compute subtotal for web, database and eventual worker, or $45 including Pro workspace access; storage, usage, taxes and other exclusions remain explicit. This is not an accepted spending cap or a claim that the smallest instances pass production load tests.
- The scoped vanity-engineering review retained the existing stack and single durable database, kept delivery-worker cost visible and flagged the free workspace's single-member restriction. No duplicate queue provider or extra booking platform was introduced.
- Updated current product/architecture/runbook/review guidance. Earlier local test evidence is unchanged. No runtime/UI edit, account connection, purchase, provider send, hosted mutation, deployment, push or PR occurred.
- **Next:** obtain Render dashboard/account status and domain/provider facts; confirm precise account ownership and costs before paid setup. Local integration implementation may continue independently; live-provider and release gates remain pending.

### 2026-09-09 — existing Vercel website and free email

- User confirmed that a domain exists and the website is already hosted on Vercel, and asked to use Resend Free. Preserve the existing website/domain; remove duplicate Render static hosting from the proposed setup. Domain name, actual account/project/plan and DNS provider remain unknown, not the existence of hosting.
- Resend Free is the starting email plan. The $20 Render compute subtotal covers booking server, database and eventual delivery worker, not a paid email subscription. Existing Vercel fees/usage are separate and still need inspection; its Hobby plan is non-commercial only.
- Read current Vercel routing and environment guidance and inspected the local catch-all route and both API helpers. Recorded a specific same-origin external rewrite plan, preview/live separation and uncached-cookie/proxy tests. No actual rewrite, environment value, secret, domain record or deployment was changed.
- Updated setup, product, architecture and handoff/runbook documents; checked documentation consistency. No runtime or UI change, provider test, purchase or publication in this step. Earlier local verification remains unchanged.
- **Next:** get the website address and whether the user can open its Vercel project. Inspect only that approved project when identified; retain the existing domain and confirm its eligible plan before release.

### 2026-09-10 — free-first package approved and next session defined

- The user approved Neon Free, Google Cloud Run, Google Cloud Tasks and Resend Free, retaining Google sign-in/Calendar/Meet, Razorpay and the existing Vercel website. This supersedes the Render package; do not open Render accounts or provision its resources as a current next step.
- The user reports that Vercel knows the website is presently non-commercial while the client's business is being set up. Move to Vercel Pro before commercial use; this is a launch checkpoint, not a repeated obstacle to development.
- Next session: identify the existing site/project and authorized account owners; guide account/billing actions; prepare and connect a separate test server and database; verify basic availability/storage and honest failure states. Account access may limit hosted completion; continue safe local preparation without claiming a hosted result.
- Then finish Google login, verified email, Calendar/Meet and Cloud Tasks delivery/recovery; connect Razorpay in test mode; finally test complete journeys, failure recovery, backup restoration, private-calendar restrictions and responsive visuals before handover/live publication.
- Updated current provider/setup guidance and marked the old Render setup as superseded. No runtime/UI changes, new tests, account provisioning, billing activation, sends, calendar events, payments, deployments, pushes or PRs occurred in this planning update. Prior local proof is unchanged.

### 2026-09-10 — numbered end-to-end plan and website facts

- User requested a durable numbered plan in `docs`, with end-to-end tasks, reviews and resume continuity. Created [Plan 1](docs/PLAN-001-booking-inquiries-and-client-calendar.md), its index and repository navigation instructions. Plan 1 now owns execution state; earlier stage/history sections here are supporting records.
- User supplied `astroadvicebykundansingh.com` and confirmed Vercel hosting-account access. Do not ask for these facts again. Exact project configuration and source revision still need authorized inspection; a planning web-fetch error is not proof of site downtime.
- Recorded stage dependencies, acceptance checks, account/cost decisions, provider failures, backups, colleague PR, release and handover. No new runtime/provider verification is implied by this planning work.

## References

- [Google: verify sign-in identity on the server](https://developers.google.com/identity/gsi/web/guides/verify-google-id-token).
- [Google Calendar: create events, invitations and Meet conferences](https://developers.google.com/workspace/calendar/api/guides/create-events).
- [Razorpay: Standard Checkout integration](https://razorpay.com/docs/payments/payment-gateway/web-integration/standard/integration-steps/).
- [Google Cloud: free allowances and billing account requirements](https://docs.cloud.google.com/free/docs/free-cloud-features).
- [Google Cloud Run: Python/FastAPI setup](https://docs.cloud.google.com/run/docs/quickstarts/build-and-deploy/deploy-python-fastapi-service).
- [Google Cloud Tasks: delivery integration](https://docs.cloud.google.com/run/docs/triggering/using-tasks).
- [Neon: current plans](https://neon.com/pricing).

Consult the current official provider guidance again during the relevant integration stage. These references establish supported routes, not proof that the client's accounts have been configured.
