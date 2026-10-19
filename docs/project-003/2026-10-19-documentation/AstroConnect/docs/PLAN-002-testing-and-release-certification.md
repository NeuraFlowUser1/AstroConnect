> Dated GitHub handoff copy, 19 October 2026. The original working document is recorded in manifest.json. Relative links have been adapted for this repository; any unavailable local-only evidence is identified explicitly.

> **Historical imported copy — reviewed 19 October 2026.** This file describes the previous source/engine. It is not the maintained publication or an instruction to repeat setup. Start with [Project 003 current status](../../PROJECT-STATUS.md) and [the maintained operating guide](../../../../appointment-system-release.md). Preserve this dirty import and unrelated work.

# Plan 2 — Testing and Release Certification

Status: **automated production certification complete; non-author handover remains**

Created: 2026-09-15
Applies to: the Astro Advice website, booking and inquiry system, private studio tools, provider delivery, backups and the official deployment at `astroadvicebykundansingh.com`

## Resume here

This is the permanent plan for turning the project's existing tests into one repeatable release-certification system. It is separate from [Plan 1](PLAN-001-booking-inquiries-and-client-calendar.md): Plan 1 owns what the booking system must do; Plan 2 owns how we continually prove that the website and those requirements still work.

Current position:

- `verify:fast`, `verify:release` and `verify:production` are implemented and documented. The release command strips provider/production settings, uses a new local PostgreSQL database and records a machine-readable result.
- The latest local release-candidate run passed all ten groups: lint, build, 31 Node/Worker contracts, 271 Python tests with zero skips against the restricted database role, real local Cloudflare runtime, 11 browser suites, tracked-secret scanning and both dependency-advisory checks.
- Browser proof covers 16 public routes, four agreed viewport sizes, detailed Chromium journeys, critical Firefox/WebKit behaviour, automated accessibility checks, private-studio states and 18 synthetic transactional-email renders. Saved screenshots were visually inspected after viewport-triggered animation had settled.
- The official deployment at merge `032130c` passed the read-only/refusal-only production suite without creating a form submission, payment, message, event, Sheet row or database record. The booking browser contract passed at all four agreed viewport sizes with zero writes.
- The exact candidate passed GitHub runs [35009346609](https://github.com/Prabhakar407/AstroConnect/actions/runs/35009346609) and [35009408328](https://github.com/Prabhakar407/AstroConnect/actions/runs/35009408328): all ten groups, 271 Python tests with zero skips and all 11 browser suites passed with zero provider calls.
- The production system retains dated provider evidence for Live Razorpay, booking confirmation, Calendar/Meet, participant messages, cancellation, dual Sheets, encrypted backup and isolated restore. A real GitHub backup-failure email proves the repository notification route; Cloudflare has no suitable Worker-error email option in this account.
- The production heartbeat changed from its correct pre-first-run warning to `healthy` after a real Cloudflare schedule, and GitHub **Production watchdog** run [35011190220](https://github.com/Prabhakar407/AstroConnect/actions/runs/35011190220) passed its four official-domain reads. See release evidence (local workspace reference: `03-client-projects/003-astroadvice-by-kundan-singh/AstroConnect/docs/evidence/plan-002/2026-09-15-production-watchdog.md`).
- **Resume at P2-08:** have one non-author follow the plain-language testing/operations guide and explain the result; correct any wording they cannot follow. Do not repeat a real payment or provider write merely to certify the handover.

## 1. Objective and completion rule

The objective is a simple answer to one practical question:

> Is this exact version safe to release, and which parts have actually been proven?

The system must catch failures before release, inspect the exact deployed version afterward, and make operational failures visible. It must cover:

- public pages, navigation, links, buttons and responsive layouts;
- inquiry forms and email verification;
- booking rules, availability, prices, checkout, payment recovery and confirmation;
- client login, permissions, calendar closures, appointments, cancellations and attention states;
- PostgreSQL migrations, concurrency, restricted database access and recovery;
- Razorpay, Resend, Google Calendar/Meet, Google Sheets and Cloudflare contracts;
- accessibility, browser compatibility, privacy and security controls;
- production health, readiness, recovery scheduling, backup creation, retention and restoration.

Plan 2 is complete only when all of the following are true:

1. A fresh checkout can run one documented fast command and one documented full command.
2. Pull requests and `main` run the safe certification automatically with no production credentials and no real-world side effects.
3. Every mandatory check reports pass, fail or intentionally not applicable. A skipped or missing check can never look like a pass.
4. The browser suite covers the critical customer and studio journeys, accessibility, navigation and agreed screen sizes.
5. Database integration tests always use a newly created isolated database and prove both allowed and forbidden permissions.
6. A safe post-deployment check proves the official routes and exact released commit without creating records, messages, Calendar events or charges.
7. Provider-side and operational checks have named evidence, cadence and owners; dated proof is never described as continuous proof.
8. A release report identifies the commit, environment, commands, results, warnings, skipped checks and remaining manual/provider boundaries.
9. The testing machinery is documented in plain language and can be maintained without the original builder.

## 2. Scope boundaries

### Included

- Test code, fixtures, orchestration scripts, CI workflow, accessibility checks, safe production smoke checks, sanitized evidence and operating instructions.
- Repairs to defects exposed while implementing or running the approved certification system, provided the repair is small, reversible and within Plan 1's agreed behaviour.
- Alignment of stale technical documentation with the actual released architecture.

### Not included without a separate decision

- A new staging website, hosted test database, monitoring company or testing dashboard.
- Automatic real payments, refunds, production bookings, emails, Google events or spreadsheet rows.
- Deleting production records to make tests repeatable.
- Weakening authentication, cookies, CSRF, origin restrictions, database guards or backup safeguards to make a test easier.
- Chasing 100% line coverage as a vanity metric.
- Rebuilding the application, changing frameworks or introducing microservices.
- Adding PostgreSQL row-level security merely to claim that RLS exists.

The official Vercel project remains the release target. Local and CI tests use temporary processes and an isolated PostgreSQL database; these are disposable test resources on the machine running the checks, not duplicate hosted products.

## 3. Inspected system map

The current live journey is:

```text
Public visitor
  -> React/Vite page
  -> same-origin FastAPI route on Vercel
  -> restricted PostgreSQL application role on Neon
  -> durable job ID in PostgreSQL
  -> Cloudflare queue/15-minute recovery worker
  -> protected FastAPI delivery route
  -> Razorpay, Google Calendar/Meet, Resend and/or two Google Sheets
  -> safe status returned to the browser or private studio page

Studio user
  -> Google identity check
  -> secure server session + CSRF protection
  -> private appointment/inquiry/calendar/attention routes
  -> PostgreSQL truth
  -> durable cancellation/retry jobs where required

Daily backup
  -> GitHub Actions
  -> direct maintenance-only Neon connection
  -> validated PostgreSQL export
  -> age encryption
  -> private Google Drive folder
  -> remote checksum verification
  -> retain newest 15 archives
```

### Sources of truth

| Concern | Authoritative source |
| --- | --- |
| Service names, prices and per-question rule | `src/data/consultationCatalogue.json`; server quote remains authoritative |
| Dates, office times, notice and horizon | `src/backend/domain.py` and database clock |
| Bookings, inquiries, payments, sessions and delivery state | Neon PostgreSQL |
| Slot ownership | `slot_claims` under the shared schedule transaction lock and unique timestamp key |
| Provider work still due | PostgreSQL `delivery_jobs`, payment-event and Calendar-event records; the queue is transport, not truth |
| Client availability closures | PostgreSQL closures and slot claims, not the Google Calendar's personal events |
| Customer-readable copies | Two independent Google Sheet workbooks; neither replaces Neon |
| Disaster recovery | Encrypted PostgreSQL backups in the dedicated Drive folder plus separately controlled decryption identity |
| Requirements and business rules | Plan 1 and its implementation contracts |
| Test/release result | Plan 2 release report for the exact commit |

### Documentation correction completed in P2-01

`architecture.md` now begins with a concise description of the released React/Vite, FastAPI, PostgreSQL and provider flow. The inherited JSON/SMTP/Jitsi description is explicitly labelled as historical rather than current operating guidance. Tests are derived from code plus Plan 1, not from stale status prose.

## 4. Proof levels — never mix them

| Level | Meaning | May touch production? | What it cannot prove |
| --- | --- | --- | --- |
| L1 — Pure/unit | One rule or formatter works with controlled input | No | Database, browser or provider behaviour |
| L2 — Integrated/local | Real application modules work with isolated PostgreSQL and simulated providers | No | Hosted routing or provider-account acceptance |
| L3 — Browser/system | A real browser completes the rendered journey against the controlled application | No production writes | Actual external provider delivery unless deliberately connected |
| L4 — Hosted smoke | The official deployment, TLS, routing, headers and safe reads work | Read-only official requests | A payment, email or Calendar write |
| L5 — Controlled provider acceptance | A named provider accepts and completes one authorized action | Yes, only within explicit scope | Future uptime or indefinite provider health |
| L6 — Operational observation | Schedules, alerts, backups and recovery continue working over time | Yes, bounded operations | Absence of every possible future failure |

Every evidence item must state its level. “Build passed”, “provider accepted”, “mail server received” and “customer saw it in the inbox” are different claims.

## 5. Certification gates and cadence

### Gate A — Fast change check

Runs on every local change before handoff and in CI on every push/pull request.

- Lockfile installation succeeds.
- Frontend lint has no errors.
- Production build succeeds.
- Pure frontend/Worker/backend unit tests pass.
- Configuration and migration-source checks pass.
- No test is unexpectedly skipped.

Target: normally under five minutes. It must contain no browser download, provider call or production credential.

### Gate B — Full isolated release check

Runs before merging a release candidate and whenever booking, forms, authentication, delivery, database or shared layout code changes.

- A temporary PostgreSQL server and database named exactly `astro_booking_test` are created under an allowlisted `/tmp/astro-booking-check.*` path.
- All Python tests run without skips.
- Worker tests and the real workerd/Miniflare compatibility test pass.
- Browser journeys, accessibility and responsive screenshots pass.
- Concurrency, retry, duplicate, reordered and timeout scenarios pass.
- Security, permissions, dependency and tracked-secret checks pass.
- Temporary processes and data are removed by exact PID/path even after failure.

Target: normally under fifteen minutes. A slower suite triggers review; it does not justify unsafe parallelism or removing meaningful tests.

### Gate C — Deployment-candidate check

Vercel may create its normal preview for the exact commit. This is not a second product or data store.

- Preview build status belongs to the exact commit.
- Public pages and direct routes render.
- Preview must not silently use production customer operations unless its already-approved protected configuration intentionally does so.
- No automated test submits forms or mutates provider/database state through preview.

If preview access or configuration cannot give meaningful safe evidence, Gate C records that limitation and continues to the official post-deployment check after authorized release. It must not weaken production security to accommodate preview.

### Gate D — Safe official-domain check

Runs immediately after an authorized production deployment and on a modest schedule.

- Homepage and all permanent public routes return the expected application, not a platform 404 or fallback homepage.
- `/api/health`, `/api/ready`, `/api/services` and `/api/booking-policy` return valid bounded data.
- `storage_ready` and `booking_enabled` are true for a releasable booking system.
- An anonymous private-session request is rejected.
- Deliberately unsigned provider callbacks are rejected without creating data.
- Browser console, page errors and failed same-origin requests are empty on critical routes.
- The release commit is recorded from the deployment result; a green check for a different commit does not count.

Gate D is read-only except for harmless refusal requests. It never sends an OTP, inquiry, booking, payment, email, Calendar event or Sheet row.

### Gate E — Controlled provider acceptance

Runs only when a provider integration or credential has materially changed, or for an explicitly approved launch/acceptance exercise.

- The exact accounts, recipients, calendar, merchant mode, price and cleanup/retention consequence are named beforehand.
- The smallest useful journey is used.
- No temporary price or bypass remains in source after the exercise.
- Provider acceptance, database state, customer-visible outcome and cleanup are recorded separately.
- Real money, refunds or real notifications require explicit approval even when the rest of Plan 2 execution has been approved.

The successful 2026-09-13 controlled Live Razorpay journey remains valid historical evidence. It is not repeated as routine CI.

### Gate F — Operations certification

Runs continuously or at the stated interval:

- Cloudflare recovery: every 15 minutes; failure must be visible and notify the named operator.
- Encrypted backup: daily; failed/missing run must notify the named operator.
- Backup retention: newest 15 successful archives only.
- Restore drill: after backup-format/key/workflow changes and at least quarterly while the site is operational.
- Private **Needs attention** review: client/operator at the beginning and end of each working day, as already defined in the operating guide.

## 6. Test catalogue and acceptance rules

The IDs below are permanent. Tests may be reorganized, but an ID cannot silently disappear.

| ID | Area and objective | Required proof | Level/gate |
| --- | --- | --- | --- |
| T01 | Reproducible source: the same commit installs and builds the same tested dependency set | Clean lockfile install, flat Python runtime pins match tested constraints, build succeeds | L1 / A |
| T02 | Shared catalogue and public copy agree with server pricing | Six IDs/names; permanent fees; Prashna 1–10 multiplication; no browser-controlled price; service-prefill links; internal duration never appears as public session-length copy | L1–L3 / A–B |
| T03 | Date/time rules cannot diverge | IST/database clock, today through day 10, 30-minute internal slots, minimum notice, Monday–Saturday, office windows, Sunday/lunch/past refusal | L1–L2 / A–B |
| T04 | Input validation protects the system and remains understandable | DOB paste formats `DD-MM-YYYY`, `DD/MM/YYYY`, `DD-MMM-YY` and four-digit-year variants normalize to server ISO; intuitive AM/PM birth time normalizes to 24-hour storage; malformed/oversized/extra fields rejected; errors do not echo secrets or private values | L1–L3 / A–B |
| T05 | Email verification proves only the intended email/form | Purpose-bound, one-use, five-minute expiry, wrong/expired/replayed codes, attempt/cooldown/IP/daily limits, concurrent verification | L1–L2 / A–B |
| T06 | Inquiry save is durable and duplicate-safe | Home/Contact/Prashna; lost response recovery; same receipt same content; changed replay refused; customer details not stored in browser | L2–L3 / B |
| T07 | Inquiry delivery is complete but truthfully reported | Customer and studio jobs plus two Sheet jobs; one destination failure does not repeat/suppress others; accepted/bounced/pending distinctions | L2, L5 / B, E |
| T08 | Slot ownership prevents double booking and closure races | Concurrent customers; booking-vs-closure; active hold protection; expired hold release; database unique key independently rejects conflict | L2 / B |
| T09 | Checkout is authorized, priced and recoverable | Receipt required; verification consumed atomically; frozen request; one order; no hold extension/repricing; refresh resumes original order | L2–L3 / B |
| T10 | Payment is proven by server-side facts | Checkout signature plus provider fetch; exact merchant/mode/order/amount/currency/captured state; browser claim alone never confirms | L2, L5 / B, E |
| T11 | Payment races and exceptional money remain visible | Duplicate/reordered webhooks; lost browser; uncertain order; late/mismatched/refunded/disputed payment; one finalizer; no stolen slot | L2 / B |
| T12 | Confirmed booking completes exactly the unfinished work | Stable Calendar event; unique Meet link; customer/studio messages; two Sheet copies; retry only incomplete role; cancellation supersedes confirmation | L2, L5 / B, E |
| T13 | Cancellation preserves history and moves no money | Phone-confirmed studio action; slot released; event/Meet removed; both messages; same Sheet row updated; “refund to be done manually” | L2–L3, L5 / B, E |
| T14 | Customer status access is narrow | Correct receipt and expiry; rate limiting; no customer/birth/receipt leakage; one receipt cannot read another record | L1–L2 / A–B |
| T15 | Studio login and sessions permit only the client | Correct verified Google email + stable subject + nonce; wrong/unverified account rejected; one-use login; secure host cookie; eight-hour expiry; logout revokes | L2–L3, L5 / B, E |
| T16 | Private writes require current authority | Exact origin and CSRF; anonymous/read-only/wrong-session refusal; refresh after uncertain write; no public substitute for admin access | L2–L4 / B–D |
| T17 | Private studio states are complete and usable | Upcoming/past/cancelled appointments, inquiry detail/seen, booking counts, closure/reopen, attention/retry, loading/empty/error/success states | L2–L3 / B |
| T18 | Runtime database role is least-privileged | Encrypted pooled connection; no superuser/create DB/create role/bypass RLS/schema create; exact table grants; no delete over business history | L2 / B |
| T19 | Migrations and recovery are safe | Ordered immutable checksums, repeatable apply, expected schema, no request-time migration, restore refuses non-isolated target | L1–L2 / A–B |
| T20 | External requests cannot leak credentials or accept malformed success | Fixed hosts/routes, no redirects with credentials, bounded bodies/responses/timeouts, safe error codes, signature verification, account binding | L1–L2 / A–B |
| T21 | Queue and recovery never become a second source of truth | Opaque job IDs only, fixed official destination, ACK only durable terminal result, retries/leases/attempt cap, zero-visitor recovery, bounded fairness | L2, L6 / B, F |
| T22 | Dual Sheets remain independent, synchronized copies | Fixed workbook roles, literal cells, upsert by permanent reference, no duplicate row, cancellation convergence, access failure visible | L2, L5 / B, E |
| T23 | Email content is safe and presentable | Escaping, no metadata/secrets, text equivalent, correct recipient/reply-to, amount/service/date/Meet/cancellation details, desktop/mobile rendering | L1–L3, L5 / A–B, E |
| T24 | Public routes, navigation and actions work | Route inventory, direct loading, header/footer/dropdown, all service/detail/legal/booking links, external-link safety, unknown route behaviour | L3–L4 / B–D |
| T25 | Booking browser journey survives real user behaviour | Service prefill/generic selection, date/time, DOB/time entry, OTP dialog, question count, quote failure, availability failure, focus/refresh/back/repeated click | L3 / B |
| T26 | Accessibility meets practical AA expectations | Zero confirmed WCAG A/AA violations; Axe serious/critical zero; manual checks for labels, names, headings, landmarks, contrast, keyboard, visible focus, dialog trap/return, error announcement, 200% zoom and reduced motion | L3 / B |
| T27 | Mobile and landscape layouts are responsive and visually coherent | 390×844 mobile plus 1366×768, 1920×1080 and 2560×1440 landscape; no overflow/overlap/cutoff; screenshots inspected; motion settles before capture | L3–L4 / B–D |
| T28 | Browser compatibility covers actual risk without matrix explosion | Full Chromium suite; compact critical public journey in Firefox desktop and WebKit mobile; no browser-specific API failure | L3 / B |
| T29 | Browser and API security headers are intentional | HTTPS official origin; no-store private/API data; content-type/referrer/frame/content policy reviewed; cookies Secure/HttpOnly/SameSite/host-only | L2–L4 / B–D |
| T30 | Tracked source and dependencies are safe enough to release | Secret scan over Git history/current package, production dependency advisory check, no private artifact in build/deploy package, exceptions dated and justified | L1 / A–B |
| T31 | Failure messages never manufacture success | Database/provider/queue/network timeout, malformed JSON, 4xx/5xx, lost response and quota exhaustion preserve state and give the next safe action | L2–L3 / B |
| T32 | Backup is usable, bounded and isolated | Archive validates, encrypts before upload, remote checksum, 15-copy ceiling, unrelated files untouched, isolated decrypt/restore/readback, no provider replay | L2, L6 / B, F |
| T33 | Official deployment is reachable and is the certified commit | TLS, SPA direct routes, API-first rewrites, health/readiness, no caching of private/API replies, deployment commit recorded | L4 / D |
| T34 | Operational failures are noticed | Cloudflare recovery failure alert, non-zero attention signal, GitHub backup failure/missed-run notification, no reliance on Resend to report its own outage | L6 / F |
| T35 | Basic performance remains usable | Bounded API/provider timeouts; no unbounded polling/retry loops; page-weight and browser timing recorded; material regressions reviewed, not hidden by arbitrary score tuning | L1–L4 / A–D |
| T36 | Test evidence itself is safe and truthful | Synthetic identities, no secret/customer payload in logs/screenshots/artifacts, exact commit/environment, counts/skips/warnings, artifact expiry | All / all |
| T37 | Final configuration points to the intended permanent system | Official origin/callbacks present; Razorpay key mode/account consistent; fixed client email/calendar; two distinct Sheet destinations; Worker fixed to official origin; no server secret in `VITE_`/client bundle; migration/backup credentials absent from request-serving runtime | L1–L5 / A–E |

### 6.1 Mandatory state-transition coverage

The suite must prove both the allowed arrows and the forbidden shortcuts below. Testing only final screens would miss the races that matter.

| State family | Allowed transitions to prove | Transitions that must be refused or retained for attention |
| --- | --- | --- |
| Booking | new -> held -> confirmed; held -> expired; held/expired -> payment review when money is seen too late or mismatched; confirmed -> cancelled | new/held -> confirmed without captured matching payment; expired/cancelled -> confirmed from stale evidence; cancelled -> held; one booking taking another booking/closure's time |
| Payment order | preparing -> ready; preparing -> creation unknown; creation unknown -> ready after one identified remote order; bounded failure remains recoverable | creation unknown -> new duplicate order after ambiguous response; order/key/mode/account/amount mismatch adoption |
| Payment observation | pending -> accepted when exact captured facts match; any money-bearing mismatch -> review; dispute/refund -> durable attention | review -> accepted because an older event arrives; accepted -> pending because a stale failure arrives; browser-only success -> accepted |
| Calendar/Meet | preparing/waiting -> ready; ready -> cancelled; retry reuses the stable event/Meet | duplicate events; cancellation followed by stale confirmation; missing/revoked Google access described as success |
| Delivery job | pending -> processing -> sent; retryable failure -> pending at a bounded future time; exhausted failure -> failed/attention | one recipient's success being resent; active lease being stolen; provider acceptance lost because database write returns late; failed work disappearing |
| Inquiry | verified new request -> saved; lost response -> same saved result; saved -> customer/studio/Sheet outcomes | changed payload under same receipt; duplicate inquiry row; email failure rolling back the saved inquiry |
| Admin login | challenge -> verified pinned identity -> active session -> logout/expiry | nonce/challenge replay; wrong email/subject; unverified email; expired session write; customer OTP becoming admin access |
| Availability | free -> held/booked/closed; expired hold -> free; reopened closure -> free; cancelled future booking -> free | closing over held/booked time; reopening another closure's claim; public booking outside horizon/hours/notice |
| Backup | source export -> validated archive -> encrypted upload -> remote checksum -> retention -> isolated restore | plaintext upload; cleanup before verified upload; more than 15 retained; unrelated deletion; restore over non-empty or wrongly named database |
| Customer UI | idle -> loading -> actionable success or actionable failure; uncertain response -> status recovery; confirmed -> meeting/email progress; cancelled/expired -> fresh next action | flickering contradictory availability; success before server proof; duplicate click creating new work; stale receipt trapping a fresh booking |

For every state family, tests must assert the durable database state and the limited user-visible result. A green screen without the correct saved state does not pass.

### 6.2 Permission and access matrix

| Actor | May do | Must not do |
| --- | --- | --- |
| Anonymous visitor | Read public catalogue/policy/availability; request an OTP within limits | Read customer/studio records; invoke internal delivery; confirm payment; mutate calendar |
| Verified inquiry submitter | Save one purpose-matching inquiry with its receipt | Reuse proof for another purpose/email; read another inquiry; access admin tools |
| Booking receipt holder | Start/resume the matching checkout and read its limited status until expiry | Supply price/payment truth; read personal details through status; access another booking |
| Authorized studio session | Read private appointments/inquiries/attention/calendar | Write without exact origin and CSRF; act after expiry/logout; move money automatically |
| Authorized studio write | Close/reopen free availability, mark phone-agreed cancellation, retry/mark attention handled | Close booked/held time; delete business history; issue automatic refund |
| Razorpay/Resend callback | Submit a bounded, correctly signed event for the pinned account/provider | Select an arbitrary destination, bypass signature/account binding or expose payload publicly |
| Cloudflare helper | Send an opaque job/run ID to one fixed authenticated official-domain handler | Receive customer data, choose a URL, use admin/customer credentials or become the record store |
| Runtime database role | Exact SELECT/INSERT/UPDATE/limited housekeeping DELETE grants needed by the app | DDL, role/database creation, superuser/bypass, broad schema creation, deletion of business history |
| Migration operator | Apply reviewed numbered migrations through the direct connection | Serve website requests, silently edit an applied migration or run against an unconfirmed database |
| Backup workflow | Read/export through its direct protected connection and write encrypted app-owned Drive files | Decrypt backups, serve requests, expose its connection, delete unrelated Drive files |

Each “must not” cell needs at least one reliable negative test at the narrowest practical layer. Production checks use refusal requests only when they are guaranteed not to create provider or customer state.

### 6.3 Date-of-birth normalization rule

Two-digit years are convenient but ambiguous. The implementation and tests must not silently guess between, for example, 1925 and 2025 without showing the result.

- Accept English three-letter months without case sensitivity, with either `/` or `-` separators.
- Resolve a two-digit year to the most recent non-future matching year in the rolling 100-year window, using the server-provided India year rather than an incorrect device clock.
- Immediately display the full normalized date, including the four-digit year, before submission so the customer can correct it.
- A person outside that 100-year interpretation must enter four digits.
- Reject impossible days, impossible leap dates, future birth dates, mixed/unknown month names and trailing hidden content.
- Submit and store only the normalized `YYYY-MM-DD` value. Do not preserve multiple string interpretations in the database.

Tests must cover both sides of the century boundary, leap years, pasted whitespace, lowercase/uppercase month names and a deliberately wrong device date.

## 7. Browser route and action inventory

The browser suite must derive or validate this inventory so a new route cannot be forgotten:

| Route | Critical checks |
| --- | --- |
| `/` | Header/footer, service paths, testimonial motion/reduced motion, inquiry success/failure recovery, WhatsApp/booking actions |
| `/about` | Direct load, expertise links, booking actions, responsive layout |
| `/services` | Six services, correct names/prices, switcher anchors, alternating layout and booking links |
| `/services/:serviceId` | All six IDs, repeated service-prefilled booking actions, tabs/content where applicable, invalid ID behaviour |
| `/testimonials` | Automatic/manual hero rotation, category filters, non-duplicate card flips, reduced motion |
| `/contact` | Office/contact links, inquiry validation/OTP/recovery, external-link safety |
| `/booking` | Complete synthetic journey and every customer-visible state from T25 |
| `/studio/calendar` | Anonymous refusal; synthetic authorized appointments/calendar/inquiries/attention; expiry and logout |
| `/privacy-policy`, `/terms-and-conditions`, `/refund-policy` | Direct load, title/content, footer links, no modal-only dependency |
| unknown route | A deliberate, understandable not-found result rather than an empty shell or silent homepage |

State-changing controls are exercised against simulated providers and isolated PostgreSQL. The official-domain crawler is read-only and does not blindly click actions that send or cancel something.

## 8. Test data and isolation rules

- Use reserved synthetic names and `.invalid` email domains except during an explicitly authorized provider check.
- Never copy production customer rows into CI, screenshots, fixtures or logs.
- Freeze or inject the clock for unit/integration tests; browser fixtures must return a coherent server clock and horizon.
- Every database test starts from the exact isolated name/path guard already enforced by the suite. No environment flag alone may disable that guard.
- Test providers operate at the HTTP transport boundary and reproduce success, refusal, timeout, malformed, oversized, redirect and ambiguous outcomes.
- Generate independent receipts, events and idempotency references per test. Assert persisted digests/state, not secret values.
- A failed test must clean only its exact temporary directory and process IDs. It must never broadly stop WSL, Node, Python or PostgreSQL processes.
- Browser artifacts contain synthetic data only and expire after seven days in CI. Permanent evidence keeps summaries and selected sanitized screenshots, not raw databases or provider payloads.
- Production smoke checks are GET/refusal-only. They cannot acquire an OTP, create a hold, send a form, connect Google, close time or invoke a real checkout.

## 9. Implementation design

### Reuse the existing tools

Keep:

- Python `unittest` and FastAPI `TestClient` for backend logic/API tests.
- The existing temporary PostgreSQL safety model.
- Node's built-in test runner for frontend helpers, Worker logic and backup retention.
- Existing browser scripts and screenshots where they already express useful behaviour.
- Real workerd/Miniflare compatibility coverage for the Cloudflare helper.

Add only:

- A pinned Playwright test/browser dependency so browser checks are reproducible.
- `@axe-core/playwright` for page-level accessibility checks.
- One small orchestration layer and one GitHub quality workflow.
- A focused, maintained secret/dependency check using pinned tools; no home-grown vulnerability database.

### Commands to provide

The final names may be implemented as npm scripts calling reviewed scripts, but the user-facing contract is:

```text
npm run verify:fast        # lint, build and all no-database unit/contract checks
npm run verify:release     # isolated PostgreSQL + all tests + browsers + accessibility + security
npm run verify:production  # safe read-only checks against the official domain
```

Each command must:

- fail on the first reliable defect while still printing which later groups did not run;
- return a non-zero exit code on failure;
- print a short human-readable summary;
- write a machine-readable JSON summary containing the commit and group results;
- count skips explicitly and reject unexpected skips;
- suppress secrets and customer data;
- clean its own exact temporary resources.

### Deterministic PostgreSQL harness

Create one script that:

1. makes a unique `/tmp/astro-booking-check.*` directory;
2. initializes/starts a temporary local PostgreSQL server on a Unix socket in that directory;
3. creates only `astro_booking_test`;
4. uses an owner connection only for migrations and test-data reset;
5. provisions a separate test runtime role from the same explicit privilege map used in production;
6. runs application integration through the restricted runtime connection wherever the application is under test, plus direct negative checks that forbidden SQL fails;
7. exports only the appropriate isolated test connections to each child process;
8. runs all Python tests and proves zero unexpected skips;
9. terminates only the PostgreSQL process it started;
10. removes only its validated temporary directory.

This works the same locally and in GitHub Actions and preserves the current destructive-test refusal. Table truncation/setup may use the isolated owner connection, but an owner-level application test cannot count as runtime-permission proof. During P2-01, read the production PostgreSQL major version safely and use the matching supported major in CI; do not guess or create a permanent provider resource. Do not point CI at Neon or introduce a hosted test branch.

### Browser structure

- Retain detailed Chromium scenarios for booking and private operations.
- Standardize base URL, browser executable and artifact directory through documented environment values.
- Use one targeted server manager to start the exact local Vite/API processes, wait for their real health routes, record PIDs and clean only those PIDs.
- Add one maintained route/navigation suite and one accessibility suite instead of duplicating page lists across many scripts.
- Capture full-page and focused screenshots only where layout judgement matters.
- Wait for fonts and settled motion; test animation behaviour separately so screenshot timing is not mistaken for a defect.
- Run the detailed responsive suite in Chromium at the four required viewports. Run only the critical public booking journey in Firefox desktop and WebKit mobile.

### GitHub quality workflow

Add one workflow, not a pipeline maze:

- Trigger on pull requests and pushes to `main`/the active design branch.
- Minimal read-only repository permissions.
- One supported Node version and the repository's Python version; no speculative version matrix.
- Clean lockfile installs and pinned test tooling.
- No production/provider secrets.
- Run `verify:fast`, then `verify:release`.
- Cancel a superseded run on the same branch, but never cancel an in-progress production backup.
- Set an overall timeout.
- Upload sanitized result/screenshot artifacts on failure, retained seven days.
- A skipped group, absent browser, absent PostgreSQL or missing test tool is failure, not success.

Vercel preview/deployment status remains a separate check. A Vercel green build cannot substitute for this workflow, and this workflow cannot substitute for hosted proof.

### Security checks

The certification system must test the security controls the application actually uses:

- API authorization, receipt authorization, Google identity, session, nonce, origin and CSRF refusals.
- Restricted database role grants and explicit denial of elevation/DDL/business-history deletion.
- Exact provider endpoints, redirect refusal, timeouts, bounded response bodies and webhook signatures.
- Build/package allowlist and tracked-secret scan.
- Production dependency advisories with a release-blocking threshold for known exploitable high/critical issues; any exception needs a reason, owner and expiry date.
- Browser/API headers and external-link protections.
- No secret or private data in client bundles, API errors, logs, screenshots or CI artifacts.

Do not add RLS now. Because browsers never connect to PostgreSQL and this is a single-studio server application, the meaningful controls are the API boundary and restricted runtime role. Revisit RLS only if a future product lets multiple independent tenants or users query the database under different row entitlements.

Run the full Git-history credential scan once during P2-05. If it finds inherited material, first verify and rotate/revoke it at the owner account; then record only a non-secret fingerprint/path/status. Per-change CI scans the new commit range and current deployable tree so a resolved historical incident does not make every future release permanently red. No broad ignore file may conceal new credentials, and an unresolved historical credential blocks certification.

### Performance checks

Performance is a usability check, not a vanity score competition:

- Record production build sizes and flag material regressions from the accepted baseline.
- Record critical-page browser timings under a controlled local run.
- Assert existing bounded polling, retry, request and provider timeouts.
- Keep the existing concurrency tests for two customers racing for one time.
- Do not add load-testing infrastructure for imagined traffic. Add a bounded load test only if observed traffic or latency gives a real requirement.

## 10. Production monitoring and alert plan

No new monitoring vendor is required for the first implementation.

Use the existing Cloudflare 15-minute scheduled Worker as the recovery mechanism and one small GitHub watchdog as the application alert, without adding another monitoring vendor:

- Its authenticated recovery call already fails if Vercel/API/database recovery cannot complete or durable work needs attention.
- A complete call records one privacy-safe database heartbeat; failures before completion leave it stale, while a non-zero attention result records an unhealthy state.
- The GitHub **Production watchdog** checks the official homepage, API liveness, booking readiness and heartbeat four times an hour. It performs no write and exposes no provider or customer detail.
- The heartbeat freshness limit is 20 minutes. The check runs eight minutes after each nominal Cloudflare schedule, so one missed recovery normally fails the next check. GitHub itself can occasionally delay a scheduled run, so this is practical low-volume monitoring rather than a guaranteed emergency pager.
- Cloudflare's available account notifications do not include a suitable Worker-error email alert. Unrelated SSL, Tunnel, Log Explorer, DDoS or billing alerts must not be mislabelled as recovery monitoring.

Use the existing GitHub backup workflow as the independent backup signal:

- Daily successful completion, encrypted upload and remote verification.
- Named failure notification, deliberately confirmed.
- A missing successful run for 26 hours is an incident.
- Keep Plan 1's recovery targets: begin recovery within one hour of the alert, aim to restore service within four hours, and recognize up to 24 hours of record exposure if both Neon history and the independent backup are needed.

Provider health is observed through:

- signed Razorpay/Resend callbacks and durable attention records;
- Google connection checks on the private studio page;
- failed/retried delivery jobs and the **Needs attention** view;
- controlled provider acceptance after credential/integration changes.

Do not create a public diagnostics endpoint that exposes provider/account detail.

## 11. Execution stages

| Stage | Work | Depends on | Status/exit proof |
| --- | --- | --- | --- |
| P2-00 | Inspect system, establish requirements, critique and write Plan 2 | Current source and Plan 1 | **Complete:** this reviewed plan and docs index |
| P2-01 | Correct current architecture/test documentation; pin test tools; add command/report contracts | P2-00 approval | **Complete locally:** three commands, pinned tools and plain-language runbook are present |
| P2-02 | Build deterministic PostgreSQL/process harness and consolidate existing unit/integration/Worker checks | P2-01 | **Complete locally:** 268 backend tests with zero skips under isolated PostgreSQL; 31 Node/Worker contracts pass |
| P2-03 | Consolidate browser route/action/state suite and add reproducible Chromium/Firefox/WebKit coverage | P2-01–02 | **Complete locally:** 11 managed suites pass with no provider writes; three browser engines covered |
| P2-04 | Add accessibility, responsive and visual certification | P2-03 | **Complete locally:** 16 routes/four sizes, Axe checks and settled screenshots pass and were inspected |
| P2-05 | Add security, permission, packaging and dependency checks | P2-02–03 | **Complete locally:** restricted-role, request-boundary, source-secret and dependency checks pass; history scan passed once |
| P2-06 | Add one GitHub quality workflow and prove failure/success behaviour | P2-02–05 | **Complete:** first clean run correctly blocked a non-portable launcher; the repaired exact commit passed all groups with no secrets/side effects in run 34989682911 |
| P2-07 | Add safe official-domain verification and close alert/uptime proof | P2-06; authorized deploy for hosted proof | **Complete:** exact release, real Cloudflare heartbeat, official smoke and GitHub watchdog passed |
| P2-08 | Run final certification, fix defects, reconcile docs and hand over | P2-01–07 | **In progress:** automated certification and documentation are complete; non-author runbook check remains |

Ordinary implementation continues without micro-approval. Stop only for a real external/user-only action, a destructive or material product/security decision, a real payment/refund/notification, or an unresolved blocker.

## 12. Evidence and reporting contract

Every certification report must include:

- UTC date/time and Git commit;
- local, CI, preview, production or provider environment;
- Gate and test IDs executed;
- pass/fail/skip counts and duration;
- exact unexpected skips or unexecuted groups;
- build/lint warnings kept separate from errors;
- browser engines/viewports and screenshot locations;
- whether the database was isolated and whether provider calls were simulated;
- every real external side effect, if explicitly authorized;
- sanitized evidence links and any remaining risk.

Evidence must never include:

- passwords, tokens, cookies, OTPs, connection strings, webhook signatures or private keys;
- customer names, contact details, birth information, questions, meeting links or private workbook links;
- raw production database dumps or provider response bodies;
- a claim of inbox placement based only on an email provider's acceptance/delivery event.

Permanent Markdown evidence is reserved for meaningful releases, live-provider acceptance, backup/restore drills and operational incidents. Routine CI logs remain in GitHub with short retention; do not commit thousands of generated screenshots or reports.

## 13. User participation points

Codex can perform the source inspection, implementation, local/CI runs, safe official checks, visual inspection and defect repair once execution is approved.

The user/client is needed only when the proof cannot be obtained safely from code or authorized read-only access:

1. Confirm GitHub workflow-failure notifications remain enabled for the named operator; the existing backup failure receipt already proves the repository-level email route.
2. Confirm actual inbox presentation for a genuinely new transactional email when that evidence is due.
3. Use the approved studio Google account for a real Google login/connection acceptance check if credentials/session access are unavailable to Codex.
4. Explicitly authorize any new real payment, refund or real-recipient notification test.
5. Keep the second offline backup decryption-key copy; Codex must not receive or reproduce that key in documentation.

These actions should be grouped into the smallest practical handoff. Screenshots are requested only if provider documentation and a short non-secret result cannot establish the fact.

## 14. Planning critique and corrections

This section records the adversarial review performed before accepting the plan.

### False confidence risks corrected

- **“The build is green, therefore the system works.”** Corrected by separate unit, integration, browser, hosted, provider and operational proof levels.
- **“`/api/ready` proves every provider.”** Corrected: readiness proves configured/stored prerequisites, not the next real Razorpay/Resend/Google response.
- **“Many tests equal good coverage.”** Corrected with permanent requirement IDs, route/action inventory and state/failure matrices.
- **“A dated live test proves ongoing health.”** Corrected with operational cadence, alerts and dated evidence wording.
- **“A backup exists, therefore recovery works.”** Corrected with decryption, isolated restore, readback and no-provider-replay requirements.
- **“Email delivered means inbox placement.”** Corrected by separating provider acceptance, receiving-server delivery and human inbox inspection.
- **“Database RLS is automatically stronger.”** Corrected by testing the actual server/API and restricted-role boundary; RLS is deferred until row-entitled multi-user access exists.

### Brittle-test risks corrected

- Pin browser/test tooling rather than depending on an agent's global installation.
- Use injected server clocks and semantic roles/text instead of arbitrary sleeps and screen coordinates.
- Wait for explicit health/fonts/stable motion before screenshots.
- Keep screenshots as visual evidence, not the sole assertion.
- Treat Axe as a fast detector, not a complete accessibility certificate; retain the named keyboard, zoom, focus, contrast and reading-order checks.
- Treat a missing browser/database/tool or skipped suite as failure.
- Fix a flaky test's cause; do not add blind retries or silently quarantine it.
- Test provider calls through their transport contracts; never depend on live provider availability for every pull request.
- Clean exact process IDs and validated temporary paths; never issue broad process/WSL shutdowns.

### Operational risks corrected

- CI contains no production credentials and cannot create external side effects.
- Production smoke checks are read-only/refusal-only.
- Alert receipt is tested, not inferred from logging.
- The exact commit binds source, CI, Vercel and the release report.
- Test artifacts are synthetic, sanitized and short-lived.
- Existing free/no-card provider boundaries remain; no new monitoring or test SaaS is assumed.

### Gaps deliberately not inflated into new architecture

- No second website or hosted test database.
- No test microservice, message bus, data warehouse or custom dashboard.
- No multi-stage deployment strategy for a small, low-volume site.
- No 100% coverage target, mutation-testing programme or broad load farm.
- No automatic production “kill switch” that could close booking because a monitor made one bad observation. Existing dependency readiness fails closed for new checkout while callbacks/recovery remain reachable.

## 15. Anti-overengineering assessment and stop rules

Requirement-to-complexity ratio after this review: **3/10**. The application has genuinely complex money, scheduling and external-delivery failure modes, so isolated integration and browser tests are justified. A single CI workflow, one temporary database harness and one browser tool are proportionate. A new testing platform would not be.

### Vanity-engineering assessment

| Finding | Severity | Practical consequence | Correction in this plan | Estimated removal/setup effort |
| --- | --- | --- | --- | --- |
| Eleven bespoke browser scripts rely on externally supplied Playwright | V1 — maintenance drag | A new machine cannot reliably reproduce the same checks | Pin Playwright and standardize startup/configuration while retaining useful scenarios | About one focused implementation stage |
| Test commands are scattered through documentation | V1 — maintenance drag | A release can omit a group accidentally | Three public commands and one machine-readable report | Small |
| A large browser/version/viewport matrix could become ceremony | V1 risk, not current debt | Slow/flaky CI would be ignored or bypassed | Full Chromium coverage; only critical Firefox/WebKit journeys | Preventive design |
| Another monitoring vendor would duplicate existing scheduled signals | V1 risk, not current debt | More accounts, cost questions and handover work | Reuse Cloudflare/GitHub first; add a vendor only after a measured gap | Avoided entirely |
| A formal 100% coverage target would reward easy lines rather than dangerous boundaries | V1 risk, not current debt | Time spent improving a number instead of payment/scheduling safety | Permanent journey/state/permission IDs; no percentage target | Avoided entirely |

Estimated current vanity/fragmentation cost: **roughly one to two operator hours per substantial release**, because commands, processes, browser locations and evidence have to be reconstructed manually. This is a planning estimate; P2-01 records the measured baseline rather than presenting it as fact.

The hard question for every addition is: **Which named user journey, failure or proof boundary becomes materially safer because this exists?** If there is no precise answer, do not add it.

### Ownership and 30-day evaluation

- Builder/maintainer: the agent or developer making the approved implementation.
- Simplification owner: the NeuraFlow project owner, not the implementation agent.
- Evaluation window: 30 days from the first successful CI certification.
- New paid-service budget: zero. Existing provider transaction/hosting costs are outside the test-system budget.
- Success measure: every release candidate produces one complete, understandable result with no unexpected skip and no production side effect.
- Success threshold: all release candidates during the evaluation window either pass every mandatory gate or are clearly blocked before release; a failure must name the broken boundary.

The test system earns continuation when a clean checkout can run it, another maintainer can interpret the report, normal full runs remain within the time target, and no production credential or side effect is required.

Review or simplify the test system if any of these occur:

- The full safe suite normally exceeds 15 minutes or becomes a material drain on the available GitHub allowance.
- The same journey is maintained in more than two overlapping frameworks/files without a distinct purpose.
- A new dependency cannot name the test gap it closes.
- A test fails intermittently twice without a reproducible product defect; fix its determinism before treating it as a release gate.
- CI requires a production credential or writes to a provider.
- Test upkeep begins delaying small content/design changes more than the code being protected warrants.
- Reports or artifacts contain real customer data or require manual interpretation to know pass/fail.
- A proposed monitor duplicates the existing Cloudflare/GitHub signals without materially improving detection or recovery.

Hard stop and repair immediately if the test system can charge money, issue a refund, cancel a real appointment, email a real customer, alter a production row, expose a credential, restore over production or delete a non-test file without explicit authorization.

“Hard stop” here means disable or repair the offending **test path** and block the release. It must never automatically disable the live website, close customer checkout or change provider configuration. Production availability remains an explicit human operational decision.

## 16. Final acceptance checklist

Before Plan 2 can be marked complete:

- [x] `verify:fast`, `verify:release` and `verify:production` are implemented and documented.
- [x] Clean-checkout reproduction passes.
- [x] All Python tests run against isolated PostgreSQL with zero unexpected skips.
- [x] All Node and workerd/Worker tests pass.
- [x] Route/action/state inventory is enforced.
- [x] Accessibility and four-size responsive checks pass.
- [x] Chromium detailed and Firefox/WebKit critical journeys pass.
- [x] Security, restricted-role, dependency and tracked-secret checks pass.
- [x] GitHub quality workflow demonstrably blocks a harmless failure and passes the repaired exact commit.
- [x] Official-domain safe smoke check passes for the exact released commit.
- [x] Production watchdog is released, observes a real Cloudflare heartbeat and passes on the official domain.
- [x] GitHub backup failure alert is received.
- [x] Latest backup is within policy and a current isolated restore drill passes.
- [x] Remaining provider acceptance boundaries are explicitly proved or named as unexecuted.
- [x] Current architecture, test instructions, operations guide and evidence index agree.
- [ ] A non-author can follow the plain-language runbook and interpret the result.

## 17. Current result

The permanent local and GitHub certification system is implemented and passing: one deterministic harness, one browser runner, one CI workflow, one safe production check and the existing operational signals. It adds no hosted testing product and performs no real provider write.

The automated certification and hosted operational proof are complete. The exact source passed local and clean GitHub checks, the production deployment passed its safe official-domain suite, a real Cloudflare recovery wrote a healthy heartbeat, and the permanent GitHub watchdog read it successfully. Plan 2 remains open only for the human handover test: one non-author must follow the plain-language runbook and identify the correct result/action without coaching.
