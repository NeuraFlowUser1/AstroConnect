> **Historical source/design record — reviewed 19 October 2026.** Use [the current operating/source guide](appointment-system-release.md) first. The dated body below describes its original source and observations; obsolete backend paths and unbundled screenshots are historical references, not present commands, current features or fresh proof. No missing evidence is reconstructed or claimed as available.

# Plan 1 — No-Pro dependency and implementation alignment review

Reviewed: 2026-09-10. **Planning review completed; implementation and account/provider proof remain pending.** [Plan 1](PLAN-001-booking-inquiries-and-client-calendar.md) is the only execution tracker. Earlier options are preserved in [decision history](PLAN-001-hosting-options-history.md), not active instructions.

## 1. The exact requirement

While the website operates on Vercel Hobby or Pro, the booking, inquiry and private-calendar features must not require Pro to function. The client decides whether/when to upgrade hosting. No upgrade date, paid-only feature, trial expiry or subscription check may be built into these journeys.

This is **Pro-independent, not Vercel-independent**. The user explicitly accepts the website's availability dependency on its host. There is no requirement for a second website, duplicated booking screens, an alternate customer address or a domain move. There is also no permission to evade the provider's eligibility rules; preserve the user's reported arrangement without reopening that discussion as a technical blocker.

Supporting accounts must remain explicit no-card Free plans, without paid bundles, trials or automatic excess charges. Ordinary Vercel hosting capabilities with Hobby allowances are permissible: that includes running Python request handlers, not only delivering HTML. On Pro, execution uses Vercel's metered hosting allowance/credit and may incur excess usage; it is **not an independently free unlimited product**. No extra charge or add-on is approved. Razorpay processing fees and domain renewal remain separate business costs.

**Limit of the promise:** no Pro requirement does not mean no outages or limits. A function, database or email allowance can be exhausted while a static page still opens. Measure all usage, reserve headroom and expose a truthful unavailable state; never equate “homepage opens” with a healthy booking service or guarantee two years of unchanged free-provider terms.

## 2. Recommended baseline to prove

Retain React/Vite and Python/FastAPI on Hobby-compatible Vercel hosting. Permanent Neon `astro-advice-by-kundan-singh` remains NeuraFlow-controlled, Free, AWS Singapore, managed PostgreSQL 16.15; migrations 001–006 and restricted pooled access verified. Source pins `sin1`; actual Vercel execution remains unproved. Inquiry publication/helper/recovery now have local tests/build/runtime-startup proof, not hosted acceptance. No main Python port, paid dependency, relocation or disposable resource. See [current dispatch evidence](evidence/plan-001/2026-09-11-inquiry-dispatch.md).

| Responsibility | Proposed home | Free-plan and proof boundary |
| --- | --- | --- |
| Existing pages, booking/inquiry/private screens and Python handlers | Vercel hosting using capabilities available on Hobby and Pro | No separate operational subscription or Pro-only runtime setting. Inspect the existing project and prove the exact build/routing combination. |
| Appointments, closures, inquiries, sessions and saved unfinished work | Direct Neon Free account under NeuraFlow's `neuraflowindia@gmail.com`, per the user's explicit ownership update | Published 100 CU-hours/project/month, 0.5 GB/project and short history allowance; verify actual recovery. Include polling, recovery, backups and test activity. Client access/long-term ownership is a handover item; the client's Google/notification identity is unchanged. |
| Immediate task delivery and independent 15-minute safety trigger | Cloudflare Workers Free + Queues + Cron | Small helper calls a fixed authenticated Python handler. Free queue retention is 24 hours; PostgreSQL intent outlives it. No main-backend rewrite. |
| Verification codes and website notifications | Direct Resend Free account | 100 emails/day and 3,000/month shared across codes, resends, both parties and inquiries; no automatic paid upgrade. |
| Client sign-in and Calendar-created Google Meet | Existing client Google project/account | Keep billing unlinked. Prove sustainable consent, account identity, conference creation and both participants' joining. |
| Independent retained backups, proposed | GitHub Actions Free standard Linux runner → encrypted private client Google Drive files | Separate scoped approval, quota checks, retention, missed-run detection and actual restore required; never archives in Git or public artifacts. |
| Payments | Client Razorpay merchant | Test mode first; real processing charges are not a hosting subscription. Merchant setup and payment/refund terms stay at their stage. |

Vercel explicitly supports [FastAPI](https://vercel.com/docs/frameworks/backend/fastapi). Current [Functions pricing](https://vercel.com/docs/functions/usage-and-pricing) includes Hobby allowances of 4 CPU-hours, 360 GB-hours of memory and one million invocations. [Fluid limits](https://vercel.com/docs/functions/limitations) currently allow 300-second Hobby invocations and 2 GB memory; this is a ceiling, not a target. Inspect actual runtime settings: older non-Fluid defaults differ. Do not depend on Pro memory, extended duration or multiple regions.

[Hobby Cron](https://vercel.com/docs/cron-jobs/usage-and-pricing) cannot run every 15 minutes. The external Free helper fills this specific gap. [Cloudflare Queues](https://developers.cloudflare.com/queues/platform/pricing/) allows 10,000 free operations/day with 24-hour retention; writes, reads, deletes and retries consume operations. [HTTP publishing](https://developers.cloudflare.com/queues/examples/publish-to-a-queue-via-http/) and [consumers calling external handlers](https://developers.cloudflare.com/queues/reference/how-queues-works/) are supported routes. [Workers](https://www.cloudflare.com/products/workers/) advertises no-card signup, but the helper's CPU/requests and actual account configuration still need proof.

Other primary evidence: [Neon pricing](https://neon.com/pricing), [Resend quotas](https://resend.com/docs/knowledge-base/account-quotas-and-limits), [GitHub Actions billing](https://docs.github.com/en/billing/concepts/product-billing/github-actions), [Google storage](https://support.google.com/mail/answer/6374270?hl=en), [Calendar quota policy](https://developers.google.com/workspace/calendar/api/guides/quota), [Drive limits](https://developers.google.com/workspace/drive/api/guides/limits). Direct Neon pricing fetch failed during this review; official indexed pricing was available. Actual account limits remain a setup gate. Google describes later-2026 excess-usage changes: recheck onboarding/release, leave billing off and stop incompatible activation rather than promising permanent terms.

## 3. Concrete design and downstream protections

### Hosting, routes and sign-in

- Prove the supported Vite/static + Python setup in the existing official project. Check framework discovery, current Vite build, shared catalogue packaging and page fallback together. If evidence requires a separate native FastAPI project, discuss the concrete obstacle and smallest permanent alternative before adding it. No temporary hosted substitute, duplicate screens/records, paid gateway or beta Vercel Services/Workflow/Queues product.
- API routing precedes `/index.html`; preserve `/api` exactly once, methods, raw bodies, queries, status and secure Set-Cookie headers. Failed API calls must not return HTML. Add explicit same-origin mode to both request helpers; no legacy-server fallback.
- [External rewrites](https://vercel.com/docs/routing/rewrites) can now honor upstream cache headers by default. Explicitly disable API rewrite caching and use `no-store` for private/status/availability responses. Test two users and successive slot changes, not just header presence. Use configured origins; never derive trusted redirects from arbitrary forwarded headers.
- Keep browser sign-in and Calendar consent callbacks on the stable website origin. HashRouter fragments cannot receive OAuth callbacks; use a real backend callback path and separate short-lived Lax correlation cookie, retaining Strict private-session cookies. Test mobile, expiry and third-party-cookie blocking. Do not move private sessions to browser storage to hide an origin problem.
- Provider callbacks and the Cloudflare helper target stable configured backend routes, not an expiring deployment URL, customer browser, arbitrary supplied URL or interactive preview-login wall. No broad preview-protection bypass. Google callback codes, receipt secrets and authorization headers must not leak into application logs. If platform access logs cannot redact a necessary field, document restricted access/shortest retention and one-use expiry; do not claim unavailable redaction.

### Delivery, checkout and recovery

- Python publishes opaque saved job IDs through the official queue API after database commit. Worker bindings handle consumption; the helper uses fixed environment-specific destinations. Authenticate requests with a scoped, rotatable server-only credential over HTTPS, constant-time verification and distinct delivery/recovery scope; never URL secrets or task-looking headers. Database state tolerates duplicates. Provider webhooks keep their own official signatures, not the helper credential.
- Never acknowledge success on HTML, redirect, arbitrary HTTP 200 or lost response. Require a structured durable outcome matching environment/job ID. Retry temporary/unknown outcomes with backoff; preserve permanent failures privately. Test wrong secret/environment, redirects, timeouts and queue expiry. Messages cannot specify destinations.
- Leases, due times, record versions and per-recipient/provider results stay in Neon. A 15-minute sweep rescues committed-but-unpublished work and exhausted/expired queue deliveries with **zero visitors**. It is recovery, not a keep-awake ping. It calls Hobby-compatible Vercel handlers and does not provide continuity through a hosting outage.
- The safety sweep is longer than a ten-minute hold and is **not** normal payment confirmation. Browser verification, signed payment events and bounded active-checkout reconciliation act promptly. Test short delayed retries (initial target 60 seconds while payment is unresolved); no continuous minute-by-minute database scan. If capture is first verified after expiry, preserve a paid exception and phone assistance under C04/D06, never seize a reallocated slot or tell the customer to pay again.
- After outages, reconcile payments, cancellations and current booking versions before old confirmations. A job whose session has started must not silently send an obsolete “upcoming” invitation. Record unmet obligations for operator action. If storage cannot durably accept a webhook, return retryable failure, never false success; recover from authoritative provider lookup afterwards.

### Capacity, backups and operation

- Budget website requests, function CPU/memory, queue operations, database wakes/storage, emails and backups together. Low booking volume does not bound bots, abandoned forms or open calendar tabs. Stop hidden/idle polling and remove the current unconditional app-load warm-up request during hosting integration; use bounded on-demand reads and non-database liveness checks.
- At 0.25 CU and five active minutes per 15-minute sweep, idle recovery alone is about 60 CU-hours per 30 days; five-minute continuous wakes approach 180. This excludes query time/other traffic and cannot prove Neon Free fits. Measure headroom, not only money. No keep-alive workaround.
- Add atomic global/per-purpose send budgets alongside existing email/IP limits; reserve capacity for accepted obligations. Count uncertain sends conservatively. Bound malformed input, status reads, order creation and rate-limit storage. Verify IP trust on direct/proxied routes; no unapproved firewall/challenge subscription.
- Backups use consistent PostgreSQL exports through a direct maintenance connection, encryption before upload and separately recoverable keys. Restrict workflow credentials; no production secrets on pull-request/untrusted-code jobs. Drive space is shared with Gmail/Photos: retention must not fill the client's mailbox. Keep the old backup until the new export is verified; prune only approved app-owned files.
- Nightly backups can lose up to a day's newer records; short database restore history does not fill every gap. D04/D07 must agree interval, retention, acceptable loss and restoration time. Test missed schedules, revoked consent, storage-full and restore with newer payments missing. Keep sends/checkout off until reconciliation; never invent lost customer notes.
- A private Needs-attention view is not an independent alert when the backend is down. D07 must name a free independently accessible failure channel and test it with Resend unavailable, plus stale recovery/backup heartbeat detection. Monitoring remains open until proved. [GitHub schedules can be delayed/dropped](https://docs.github.com/en/actions/reference/workflows-and-actions/events-that-trigger-workflows#schedule); they are not for time-critical booking work.

## 4. Review findings and disposition

| Finding | Correction / remaining proof |
| --- | --- |
| Pro-at-launch remained mandatory in release instructions | Removed as a technical dependency. Hosting eligibility remains the client's/provider's decision; no upgrade-driven booking switch. |
| Full Cloudflare application/UI move exceeded the need | Removed from the baseline; retain Python/React/domain. A runtime port still requires specific justification/approval. |
| Active stages still named billed Google hosting beneath a hold banner | Rebased actual stage/contract/runbook instructions; old options archived. |
| Recovery could depend on Pro Cron | Specified Free external queue/schedule helper, authenticated outcomes and zero-visitor recovery. Runtime proof pending. |
| Safety sweep could be mistaken for timely payment confirmation | Separated prompt reconciliation from slower rescue; late-money handling remains explicit. |
| Quotas, cache defaults and alerts weakened “website up means booking up” | Added combined limits, cache isolation, abuse/headroom and independent-alert gates; no unconditional uptime promise. |
| Backup products were named without usable recovery evidence | Keep recovery verification and protection of real records. Discuss an isolated restore destination only if the specific check needs it; no standing duplicate hosted stack. |
| Separate hosted test setup implied a later resource replacement | Removed. Use permanent official resources, controlled prelaunch records and final destinations; retain the same resources for launch. |

Retained and rechecked: six fees, 1–10 Prashna questions, 30-minute sessions, IST/ten-day horizon, approved notice, atomic slot protection, purpose-bound email proof, client-only calendar, phone cancellation, capture/order matching, safe retry/status authorization, both recipients, no legacy fan-out and dummy/live separation. C01–C10 cover behaviour; T01–T29 own proof. This review does not pass runtime tests.

**Architecture/complexity judgement:** roughly 3/10 for this baseline, not a measured upkeep score. Removing duplicate screens and the Python-to-Workers port reduces avoidable work. Keep one store, one small helper, focused Python modules and three restrained client views. No CRM, customer accounts, personal-calendar sync or generic workflow engine. Hard question: does each dependency support booking/recovery without a paid-only capability? No fabricated staff requirement, low-usage shutdown or destructive kill rule.

## 5. Next bounded step and completion gate

Next: complete shared mail budgets/cleanup, signed provider observations and private inquiry/attention access, then native Vercel/Cloudflare execution and real-provider journeys with scoped authorization. Resend and Google settings saved are user-reported. Next account step is the [permanent Cloudflare queue](../BOOKING_SETUP.md#next-account-step--cloudflare-account-and-inquiry-queue), staying Free/no card. No repeat Google setup, disposable resource or source release implied.

T29 requires complete synthetic journeys on **actual Hobby hosting**, or an explicit pending result if only Pro/test substitutes are available. The implementation must not change behaviour when the hosting plan changes. Never downgrade a live account or buy Pro for a test. No Pro-only timeout, memory, paid protection bypass, scheduler, storage subscription or trial dependency. All security/payment/restore tests still apply.

If build/runtime/account evidence rejects this baseline, stop that slice and present the specific obstacle and smallest supported alternative. Do not silently port the backend, buy a service or weaken verification/locks. This aligns the blueprint; it cannot certify unbuilt integrations or permanent free availability.
