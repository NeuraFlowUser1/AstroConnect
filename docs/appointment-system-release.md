# AstroAdvice — current booking and operating guide

Reviewed **22 October 2026** against current source and the accepted [release record](evidence/2026-10-22-search-accessibility/release/README.md). This guide describes the contained system, replacing the old SMTP/Jitsi/local-JSON runbooks. It contains no secret values or private customer records.

## Installed source and publication

The 22 October operating/search release is live from `24782b18eeeeda32d46a0efcfaffe68aae0adc39`, followed by raw utility-head correction `f77a146c62ffe48cbedd55aa1195dbf47cb691b8`. Current Git main may include later documentation closeout. Package **1.0.1-rc.3** digest `1bb6cb1cc00a2ead7cec70de052ea78330005d7644dfc0d2e2a40ea7c287b31f` has **579** manifest files plus seal; migrations **001–037** match the existing applied ledger exactly. Existing main → Vercel `neura-flow1/astrologer-website-kundan-singh` → official domain is the only publication route. Vercel remains disconnected from Codex.

The active factory working copy is `04-shared-tools/003-appointment-booking-system/.local-runtime/operating-search-efficiency-20261022/003/`. The previous `name-phone-20261011/003`, older scaffold and imported client AstroConnect source remain preserved return/comparison material. The release publication worktree is separate; Git and the release record identify actual current source rather than a stale local main reference. Use `git -c core.fileMode=false status --short` to distinguish existing executable-bit noise without changing Git configuration.

## Customer journeys

- Six existing services: Vedic Astrology, General Numerology, Vastu, Laal Kitaab, Prashna Kundali and Name Change. Public catalogue is src/data/publicServices.js; saved server policy/quotes own fees, hours, notice and availability. Prashna is₹1,100 per question, 1–10 questions in one 30-minute appointment. Do not overwrite saved settings using bootstrap.
- Booking chooses service/date/time and the required contact fields, then uses server-owned checkout/payment confirmation. A browser success callback is not captured-payment proof. Durable jobs independently create Calendar/Meet, email and both reporting copies. Ready, pending, failed, accepted and delivered states are distinct.
- Phone is required. Email is optional with the booking email-code setting OFF, required and verified with it ON. Supplied invalid email remains an error; AstroAdvice birth date is optional. Ordinary Home/Contact/Prashna enquiries keep separate verification.
- Drafts remain in memory through tab/app changes; deliberate refresh may clear them. No names, phone, birth details or typed codes belong in URLs, analytics or browser draft storage.
- “View my booking” on Contact/Booking opens `/booking/receipt`. Both saved full name and phone must match. No reference/email/eight-digit code is requested. History/details, refresh and confirmed-only local PDF are available; lookup cannot pay, cancel, reschedule, change contacts or email a copy. Original stronger saved-browser receipt access remains separate.
- Old `/booking-help` and `/booking/access` replace the history entry with the details route and discard old query/hash. Migration 037 removes old issuing/redeeming authority and usable code digests while preserving historical audit and protected staff contact correction. Do not revive the retired code process.

The installed [details contract](../appointment-system/docs/booking-details.md) owns matching, pagination, admission, limits, lifecycle and migration. [Booking experience](../appointment-system/docs/booking-experience.md) owns controls, draft and original receipt/PDF/requested-copy contracts. An acknowledged copy request is not called failed merely because later status reading fails; actual delivery still requires delivery evidence.

## Private operation and OFF behavior

| Entry | Role |
| --- | --- |
| `/studio` and `/studio/calendar` | Authenticated staff appointments/calendar; existing installed policy and permissions apply. |
| `/enquiries-studio` | Authenticated enquiry review; independent of public booking ON/OFF. |
| `/company/booking-control` | Separate company username/password, settings and switch authority. |
| `/company/booking-support` | Protected support/correction and unresolved-obligation operations. |
| `/company/google-repair` | Protected Google resource repair/consent. |

Staff sign-in, Calendar consent, client record copy and agency record copy are separate resources. Schedule permission does not confer company or refund authority. Keep the existing accounts/resources/secrets; normal operation does not require another first enrollment or key handover. Company recovery uses the [protected recovery procedure](../appointment-system/docs/company-recovery.md) only when necessary.

OFF closes admission and denies public booking, saved receipts, lookup, booking dashboard and exclusive assets. General content/enquiries remain independent. OFF does not cancel/refund obligations. Only authenticated staff/company operators can cancel or move appointments; the consumer lookup/receipt grants no such authority. Existing saved standard staff constraints remain; the clinic's special past-appointment/discretion extension is a separate package line. A cancellation is not a refund or proof of money returned.

The project database is authoritative; Sheets are reporting copies. Worker lanes process saved delivery work without holding transactions across provider calls. Existing monitor/backup workflows and independent provider-disabled restore remain. Never test recovery over production or replay jobs from a restored fixture against real providers.

## Source map and supported commands

| Owner | Responsibility |
| --- | --- |
| src/main.jsx, src/App.jsx, src/PublicApp.jsx, src/Component, src/data/page-metadata.mjs | One product-state lifetime, private browser routes, actual eager public tree and one public/utility identity registry. |
| src/lib/BookingProduct.jsx, productState.js, useBooking.js, useEnquiry.js, booking-ui.jsx | Thin receiving-site adapters to the contained browser contracts. |
| api/index.py | Verifies/loads sibling package with appointment-settings/project.json; no factory runtime. |
| appointment-settings | Installation identity, declared accounts/surfaces and bootstrap. Protected values live only in project-owned settings. |
| appointment-system | Sealed engine/browser/contracts/setup/backup/testing tools; install whole, never edit selected files. |
| src/entry-server.jsx, build-support/public-page-modes.mjs, proxy.js, vercel.json | Build-time real public HTML with fresh display-only stores; utility discovery cleanup after generator enforcement; signed ON/OFF hosting. |
| workers, .github/workflows/appointment-* | Existing background processing, observer and encrypted backup/validation. |

Use declared Node22 and lockfile: `npm ci`, `npm run dev`, `npm run build`. Python dependencies/setup follow the installed [contained setup guide](../appointment-system/docs/contained-setup.md); import/startup never applies migrations or resets company enrollment. Changing business-settings.json does not update saved policy.

Existing aliases `verify:fast`, `verify:release`, `verify:production` delegate through scripts/verify.mjs. Fast is a broad partial development selection with actual skips; it is not coverage/hosted certification. Release requires the explicitly owned disconnected PostgreSQL16/18 fixture, Chrome and age executable inputs, refuses production credentials and retains real skips. Production uses official-domain reads/refusals only. These commands are not a standing permission to run suites; full local/hosted scope requires explicit approval.

## Evidence, remaining work and recovery

The [22 October release record](evidence/2026-10-22-search-accessibility/release/README.md) and its linked complete shared/application receipts are the current proof. Matching app, Worker and guarded database identity were verified; original ON was restored at revision 12. The effective maintenance interval was 16:59:00.292–17:05:20.947 UTC (6 minutes, 20.654 seconds). Business settings remain revision 15 with the same pre-release hash. All nine read-only recovery lanes had zero due work and no attention flag at the recorded observation; this is not a future uptime guarantee.

Fourteen ordinary routes contain their actual public React body, exact metadata and structured facts in original HTML. All four utility paths (six query/path cases) remain noindex with no raw canonical or public graph; the sitemap lists only the fourteen ordinary routes. Public raw/header checks and actual hosted desktop/phone browser reads pass. The broad local gate retains all 37 JavaScript and both Python receiving owners without exclusions, plus the complete sealed neutral package; see receipts for numerators, denominators, domains, native skips and observation limits.

The release changes browser request cadence/lifecycle, build-time public discovery, media sizing and focused accessibility behavior. It preserves service content, existing motion, saved policy/fees, Calendar/Meet, payments, mail, staff permissions, customer records and provider accounts. No real 003 booking, message, payment, refund or delivery exercise was triggered for this release. Earlier 8 October real booking/Meet/PDF/staff/records outcomes remain dated evidence and are not relabelled as new provider acceptance.

**Remaining:** correct-owner Search Console follow-up for the eligible public Contact/Services pages, future crawl/index/rank observation, normal 24-hour/7-day request/usage observation, physical-device/native-screen-reader checks, and client confirmation of the existing About accreditation/Prashna timing wording (D07). These do not invalidate the accepted technical release. Keep booking/receipt utilities excluded; do not request their indexing. Persistent-motion conformance retains its explicit approved-policy limit. No public claim, credential or guarantee was invented by this patch.

**Parked:** the owner-requested chronological enquiry note/action interface; the existing staff review data remains. This programme does not add that product feature or change business policy. The original factory evidence under `04-shared-tools/003-appointment-booking-system/001-implementation-evidence/` and September plans remain historical context, not setup instructions.

For future compatibility work, preserve both return app/Worker/binding identities, keep ordinary pages available, close booking only through the official company control, and use the single-connection guarded expected-digest/idle-lease transaction. Never call `configure_worker_release` unguarded or force-clear a lease. A partial deployment must stay closed until the actual compatible pair is read back; do not infer publication from a successful push. Old code-era or 552/035 packages are not automatic data-compatible rollback targets. The exact 22 October return identities and unused rollback procedure are recorded with the release.
