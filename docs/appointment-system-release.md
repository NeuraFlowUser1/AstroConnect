# AstroAdvice — current booking and operating guide

> **19 October GitHub publication:** the owner has authorized publishing this documentation. Runtime/closeout commits quoted below identify the inspected base before this documentation follow-up; they are not an assertion that those remain the latest main revision. Git records the current revision. No customer setting or website behavior changes here.

Reviewed **19 October 2026** against current source and saved release evidence. This guide describes the contained system, replacing the old SMTP/Jitsi/local-JSON backend/runbooks. It contains no secret values or private customer records.

## Installed source and publication

Runtime 693872e257cead98f56afe6ebcaf38a8421f3b77 introduced name-and-phone access on 11 October; current documentation/main4b9d4bac935dba8fee6d61a48517763753e669db is independently confirmed from GitHub on 19 October. Package 1.0.0-rc.1 digest 54af467afbe152286f1f81f28f904a8b59b51e31111e6a81d93b1d340bd3720a has 576 manifest entries plus seal and migrations 001–037. Existing main→Vercel neura-flow1/astrologer-website-kundan-singh→https://astroadvicebykundansingh.com is the only publication route. Vercel stays disconnected from Codex.

The actual factory working copy is `04-shared-tools/003-appointment-booking-system/.local-runtime/name-phone-20261011/003/`. The imported client AstroConnect folder and older contained scaffold remain preserved. The maintained copy has pre-existing executable-bit noise and installer lock/rollback artifacts; a one-command `git -c core.fileMode=false status --short` separates content changes without changing Git configuration.

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

OFF closes admission and denies public booking, saved receipts, lookup, booking dashboard and exclusive assets. General content/enquiries remain independent. OFF does not cancel/refund obligations. Current astrology cancellation/rescheduling policy remains its installed/saved contract; the clinic's later staff-discretion mode is not installed here. A cancellation is not a refund or proof of money returned.

The project database is authoritative; Sheets are reporting copies. Worker lanes process saved delivery work without holding transactions across provider calls. Existing monitor/backup workflows and independent provider-disabled restore remain. Never test recovery over production or replay jobs from a restored fixture against real providers.

## Source map and supported commands

| Owner | Responsibility |
| --- | --- |
| src/App.jsx, src/Component, src/data | Pages/routes, public services/reviews and frame. |
| src/lib/BookingProduct.jsx, productState.js, useBooking.js, useEnquiry.js, booking-ui.jsx | Thin receiving-site adapters to the contained browser contracts. |
| api/index.py | Verifies/loads sibling package with appointment-settings/project.json; no factory runtime. |
| appointment-settings | Installation identity, declared accounts/surfaces and bootstrap. Protected values live only in project-owned settings. |
| appointment-system | Sealed engine/browser/contracts/setup/backup/testing tools; install whole, never edit selected files. |
| build-support/public-page-modes.mjs, proxy.js, vercel.json | Build classification and signed ON/OFF hosting behavior. |
| workers, .github/workflows/appointment-* | Existing background processing, observer and encrypted backup/validation. |

Use declared Node22 and lockfile: `npm ci`, `npm run dev`, `npm run build`. Python dependencies/setup follow the installed [contained setup guide](../appointment-system/docs/contained-setup.md); import/startup never applies migrations or resets company enrollment. Changing business-settings.json does not update saved policy.

Existing aliases `verify:fast`, `verify:release`, `verify:production` delegate through scripts/verify.mjs. Fast is a broad partial development selection with actual skips; it is not coverage/hosted certification. Release requires the explicitly owned disconnected PostgreSQL16/18 fixture, Chrome and age executable inputs, refuses production credentials and retains real skips. Production uses official-domain reads/refusals only. These commands are not a standing permission to run suites; full local/hosted scope requires explicit approval.

## Evidence, remaining work and recovery

Last completed access changeover: 11 October, matching package/database/application/worker identity and original ON intent restored; existing records/audit preserved. No tests, coverage, customer lookup, payment, email or real-provider journey ran for that change. Older8 October 93/93 focused checks, approved no-email₹1 Vedic booking/Meet/PDF/staff/dual-Sheet/requested-copy outcomes and restored₹2,100 price remain their own dated proof. Older7 October backup/isolated-restore/retention and monitor/protection results remain source-bound, not fresh continuous-health guarantees.

The factory shared checkpoint and original evidence under `04-shared-tools/003-appointment-booking-system/001-implementation-evidence/` own those receipts. The detailed pre-reconciliation guide is preserved outside this application in Project 003's documentation-review/2026-10-19/originals/published-source/docs/. September numbered plans/runbooks remain historical decisions, never today's setup commands.

**Deferred:** owner-requested chronological enquiry note/action UI (existing staff_reviews already stores history); broader whole-marketing-site coverage; physical-phone/native-screen-reader proof. Earlier intermittent dashboard startup evidence has no established cause or claimed repair. No outstanding key-save, consent or switch action remains from the accepted 11 October change. Routine provider/monitor health needs a fresh authorized observation before a current-health claim.

No new provider action, full suite, package release or clinical policy change is assigned. For a future incompatible change, agree the exact OFF transition, whole-package install, ledger/permission compatibility and source/database/worker/application readback first. Old552/035 or code-era builds are not automatically compatible with nullable/V3 bookings and retired code authority. Keep booking OFF and repair forward rather than silently reverting data contracts.
