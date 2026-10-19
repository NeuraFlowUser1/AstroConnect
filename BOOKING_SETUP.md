> **Historical source/design record — reviewed 19 October 2026.** Use [the current operating/source guide](docs/appointment-system-release.md) first. The dated body below describes its original source and observations; obsolete backend paths and unbundled screenshots are historical references, not present commands, current features or fresh proof. No missing evidence is reconstructed or claimed as available.

# Booking provider setup

Updated: 2026-09-11. This is the account/setup companion to [BOOKING_ROADMAP.md](BOOKING_ROADMAP.md), not a deployment script.

**Current execution checklist:** [Plan 1](docs/PLAN-001-booking-inquiries-and-client-calendar.md). Its resume checkpoint and stage/decision ledger take precedence over earlier next-session notes here.

## Current boundary — Hobby-compatible booking, 2026-09-10

The client's choice to delay or never buy Pro must not itself disable booking, inquiries or the private calendar. Vercel hosting can use ordinary Hobby-included Python execution; no Pro-only feature, upgrade date or separate paid operational product. Other services remain direct no-card Free plans within limits. Pro hosting, if chosen, can meter excess usage; no automatic overage/add-on authority. Keep `astrologer-kundan-singh` unbilled.

**Current recommendation:** keep React/Vite and Python/FastAPI on Hobby-compatible Vercel hosting, Neon Free, Resend Free and existing Google identity/Calendar/Meet; use a small Cloudflare Free queue/Cron helper calling authenticated Python handlers. Retained backups are proposed through restricted GitHub Actions Free to encrypted private client Drive files. Read the [alignment review](docs/PLAN-001-no-card-hosting-review.md) for actual implementation/eligibility/usage gates. No full backend port, duplicate website or domain move is needed by the latest scope.

Progress: on 2026-09-11 the user reported Resend, Google web-client and Cloudflare queue settings saved in Vercel Production, and confirmed Resend serves only this website. Do not repeat setup or request secrets/screenshots. Monthly refusal recovery, signed email observations and private inquiry access are verified locally. Permanent Neon migrations 001–007 and restricted pooled access are verified. Actual hosted delivery/login/Meet/payments remain unproved; no real notification, deployment or source publication occurred.

Next coordinated account work: publish the reviewed local source through the agreed GitHub workflow, then have the user operate the website's Vercel account. The Resend callback is `https://astroadvicebykundansingh.com/api/webhooks/resend`; its signing secret belongs in `ASTRO_RESEND_WEBHOOK_SECRET` in Vercel Production, never in the browser or chat. Subscribe to sent, delivered, delivery_delayed, bounced, complained, suppressed and failed email events. Verify the actual hosted route before testing real delivery. Existing Cloudflare helper still needs its delivery/recovery secrets and deployment; retain the existing account/queue. No new account, card or replacement website.

Current clarification: the Vercel URL is `https://vercel.com/neura-flow1/astrologer-website-kundan-singh`. The user confirmed that this account is intentionally different from the ChatGPT-connected account. **The user performs Vercel steps; Codex researches exact instructions and checks reported results.** Do not routinely request screenshots; use official documentation and available read-only checks first, then concise non-secret text if account-specific information is needed. A screenshot is a last resort. No reconnection, account transfer, shared password or token is required. Do not ask for the URL again or use the unrelated account. Redundant email/admin enable flags were removed locally; the backend runbook lists the actual required settings.

Received on 2026-09-10: the user reports connected repository `Prabhakar407/AstroConnect`, which matches the inspected local origin. Their Framework Settings screenshot shows **Vite** and all four command/output overrides off. The user also confirms **Root Directory `./`**, **include files outside root enabled**, and **Production Branch Tracking `main`**. This is consistent with the local Vite setup; leave these settings unchanged. Grey placeholders are defaults/help text, not proof of the effective deployed commands. Initial settings inspection is complete; actual deployed source, preview access and runtime behavior remain to verify.

### Permanent Neon project — created and inspected

The user created **`astro-advice-by-kundan-singh`** on 2026-09-10. Keep this exact name; it supersedes the earlier suggested name and requires no rename or recreation. Prelaunch verification uses this same project/database, which remains in place for real appointments; no temporary hosted database or later environment migration is planned.

User's explicit ownership update: use NeuraFlow's **`neuraflowindia@gmail.com`**, not the client's email, for Neon signup. The account is agency-controlled; settle client access/long-term ownership during handover without assuming an automatic transfer or adding a launch cutoff. This does not change the client's `astroadvicebyks@gmail.com` booking notifications or Google Calendar/Meet identity.

Read-only Neon inspection independently confirmed the following. Account creation is complete; do not ask the user to repeat onboarding, provide a screenshot or paste a password.

| Setting | Value |
| --- | --- |
| Project name / ID | `astro-advice-by-kundan-singh` / `fancy-water-31658958` |
| Owning organization / account | NeuraFlow, `org-silent-queen-86019579`, `neuraflowindia@gmail.com` |
| Plan | Free (`free_v3` reported by Neon); payment-method status was not separately queried |
| Cloud provider / region | AWS Asia Pacific (Singapore), `aws-ap-southeast-1` |
| Postgres version | Managed `16.15 (b357239)` verified by SQL |
| Default branch / ID | `production` / `br-rough-lake-b3ira3cc`; the only branch returned |
| Database / owner | `neondb` / `neondb_owner` |
| Application schema | Migrations 001–007 applied and checksums verified; zero bookings/inquiries/delivery jobs as of 2026-09-11 |
| Application role | SQL-created `astro_booking_app`; explicit table access, no elevated membership or schema/table creation |
| Compute | One read-write endpoint, `ep-morning-boat-b3bcu6uq`; observed idle after approximately five minutes; no keep-awake configuration added |

Codex has now applied the reviewed schema and created/rechecked restricted application access using `src.backend.provision`. Direct owner access is for maintenance; pooled `astro_booking_app` access is for requests. Both use protected configuration outside Git. Schema readiness, transaction locking, application-link TLS and lack of elevated membership were verified. [Neon's pooling guide](https://neon.com/docs/connect/connection-pooling) explains the endpoints; [role documentation](https://neon.com/docs/reference/compatibility) distinguishes elevated console-created roles from SQL-created restricted roles. Never paste credentials into chat or add the owner connection to Vercel request handlers. Destructive local-test helpers must never target this database.

The connected Neon tools and intended project access were sufficient for this setup; no extra Neon login or screenshot is needed. Vercel remains user-operated. Its actual application connection must still be proved after reviewed-source publication; local-to-Neon proof is not Vercel-to-Neon proof. Do not prematurely redeploy the old remote code or activate unfinished checkout. Leave optional Neon products off; no extra signup or paid bundle.

Why these choices: [Neon supports PostgreSQL 16](https://neon.com/docs/reference/compatibility), and [Singapore is an available AWS region](https://neon.com/docs/introduction/regions). This is permanent placement for the India-focused site. `vercel.json` now pins `sin1`; [one region is supported on Hobby](https://vercel.com/docs/functions/configuring-functions/region) and [Vercel lists Singapore](https://vercel.com/docs/regions). The source setting is implemented, but actual Vercel placement is not observed. No launch-time relocation is planned.

No further Vercel changes are needed for this initial check. Preserve `main` for the official site; the local `design/page-by-page` branch holds unpublished work for review. Use the existing official Vercel project/domain and permanent database when publishing the reviewed implementation is authorized. An automatic code-review preview is not a requirement to create another site, database or staging workflow. Configure final callback/sender destinations once where possible. Provider test-payment credentials remain distinct from live credentials to avoid real charges during verification; that uses the same merchant account/application, not a disposable hosted system. No new manual launch toggle or payment-validation bypass.

## Resend sending domain — completed

On 2026-09-10 the user reported completing these steps. Independent public DNS checks found the DKIM TXT at `resend._domainkey.mail.astroadvicebykundansingh.com`, SPF TXT at `send.mail.astroadvicebykundansingh.com`, and priority-10 MX at that same sending name pointing to `feedback-smtp.ap-northeast-1.amazonses.com`. Keep this provider-issued Tokyo sending region; it does not need to match Neon's Singapore database. This is public DNS evidence plus user-reported verification, not an authenticated Resend dashboard inspection or inbox-delivery proof. Do not repeat domain creation.

Purpose: let the website send verification codes and confirmations from its own permanent address. Replies will go to `astroadvicebyks@gmail.com`; the client's existing Gmail remains unchanged. Proposed permanent sender: **Astro Advice &lt;bookings@mail.astroadvicebykundansingh.com&gt;**. This is a sending address, not a new paid mailbox.

1. Open [Resend directly](https://resend.com/domains), using the client-owned/delegated account. If it does not exist, create it on Free. Do not install it through Vercel Marketplace, enter a card or select a paid trial. Open **Domains → Add domain** and enter **`mail.astroadvicebykundansingh.com`**, without `https://`. Keep the offered default region; enable sending, not inbound email receiving.
2. Resend shows the exact sending-verification DNS rows (the ownership/authentication records for this domain). Choose manual setup. In the website's Vercel account, open the **team's Domains** list → **`astroadvicebykundansingh.com`** → its DNS records. Public lookup on 2026-09-10 returned `ns1.vercel-dns.com` and `ns2.vercel-dns.com`, so Vercel manages these records. This is the team-level domain page, not adding another website project.
3. Add only the rows Resend shows for sending: copy each type, name, value and any MX priority exactly. Vercel's Name field expects the part before `.astroadvicebykundansingh.com`—for example, a full `resend._domainkey.mail.astroadvicebykundansingh.com` becomes `resend._domainkey.mail`. Keep default TTL. Do not replace existing `@`, `www`, nameservers or root mail records, add a second SPF record at the same name, or enable receiving. If an exact name/type already has a different value, report that non-secret conflict before changing it.
4. Return to Resend and select **Verify DNS Records**. Wait for sending to show **Verified**. Report that result in words; no screenshot or key is required. DNS verification may take time, so do not repeatedly delete/recreate records or buy an upgrade while waiting.

These completed steps follow [Resend domain verification](https://resend.com/docs/dashboard/domains/introduction) and [Vercel DNS management](https://vercel.com/docs/domains/managing-dns-records). The separate `mail` subdomain isolates website sending while preserving existing mail/hosting. [Resend's published Free plan](https://resend.com/pricing) is the selected plan; account limits still apply. DNS setup sends no customer notification. Actual recipient consent and real-send verification remain P1-05.

<a id="next-account-step--resend-sending-key"></a>

## Resend sending key — reported saved

On 2026-09-11 the user reported completing these steps. Treat the key's scope and the two Vercel Production settings as user-reported, not independently inspected or tested credentials. No key value was requested or received in chat. Keep these permanent settings; do not repeat creation or redeploy old source.

The key is the website's private permission to send email. It is not a password for the client's Gmail. No extra mailbox, paid plan, Marketplace connection or additional hosted project is needed.

1. Open [Resend → API Keys](https://resend.com/api-keys) and choose **Create API Key**. Name it **Astro Advice Website**. Select **Sending access**, restricted to **`mail.astroadvicebykundansingh.com`**, not Full access or all domains. Resend shows the key once; copy it directly to Vercel in the next step, never into chat, screenshots or source files. Keep any retained copy in the owner's existing password manager.
2. Open the [intended Vercel project's Environment Variables](https://vercel.com/neura-flow1/astrologer-website-kundan-singh/settings/environment-variables). Add the following for **Production only** (the official site). Use **Secret** for the key; older screens may call this **Sensitive**. Use **Config** for the public sender. Save each value without surrounding quote characters.

| Name | Value | Type |
| --- | --- | --- |
| `ASTRO_RESEND_API_KEY` | The private key just generated; never put its value in this document | Secret / Sensitive |
| `ASTRO_EMAIL_FROM` | `Astro Advice <bookings@mail.astroadvicebykundansingh.com>` | Config |

Report only that both settings were saved. **Do not redeploy the old remote code now.** Vercel applies new values to subsequent deployments; this step prepares the permanent settings, not a release or a claim that live email works. The reviewed code, protected database connection, verification secret and exact website origins still need their coordinated hosting setup. No extra email-enable switch is required. Replies are already directed by the adapter to `astroadvicebyks@gmail.com`; no third reply-to setting is needed.

Researched from [Resend API-key permissions](https://resend.com/docs/dashboard/api-keys/introduction), [Vercel Config/Secret types](https://vercel.com/docs/environment-variables/sensitive-environment-variables) and [Vercel environment-variable changes](https://vercel.com/docs/environment-variables/managing-environment-variables). Codex cannot independently inspect these settings through the unrelated connected Vercel account. Real provider testing follows authorized reviewed-source deployment and an agreed recipient; local tests use injected responses, not a second hosted project or real sends.

## Next account step — Google sign-in client

**Reported saved on 2026-09-11.** Retain this section as the configuration reference, not another user task. Google settings are not independently inspected and actual login remains untested. Next account action is Cloudflare below.

Purpose: identify this website to Google so the existing private calendar can offer **Sign in with Google**. The backend still admits only `astroadvicebyks@gmail.com`. This step does not grant Calendar access, create meetings, authorize Gmail/Drive, or turn on paid Google Identity Platform.

1. Open [Google Auth Platform in the existing project](https://console.cloud.google.com/auth/overview?project=astrologer-kundan-singh). Confirm the project is **Astrologer Kundan Singh**, ID `astrologer-kundan-singh`; never create another project. If **Get started** is shown, use app name **Astro Advice by Kundan Singh**, **External** audience (the client uses ordinary Gmail), and an available monitored support email. Prefer the client email if it is available to the signed-in account; otherwise use the monitored delegated account shown. Developer contact can be `neuraflowindia@gmail.com`. Support/contact settings do not change the website's booking recipient or private-access restriction. Leave billing off. Google's general billing recommendation is not an instruction to enable paid services.
2. Open **Clients**. Reuse an existing Web application specifically belonging to this website if present; otherwise **Create client → Web application**, name **Astro Advice Website**. Add these two **Authorized JavaScript origins**, without a trailing slash or page path:

   - `https://astroadvicebykundansingh.com`
   - `https://www.astroadvicebykundansingh.com`

   The current sign-in uses Google's JavaScript callback, so no redirect URI is needed for this identity step. Do not enter `/#/studio/calendar` there. The real non-fragment Calendar callback will be added to this same permanent client with the Calendar integration; no disposable client or alternate website. Retain only basic identity access (`openid`, email and profile) now; do not request sensitive Calendar/Gmail/Drive permissions or submit app verification with placeholder policy URLs.
3. Save the **Client ID**, ending in `.apps.googleusercontent.com`, in the intended [Vercel project settings](https://vercel.com/neura-flow1/astrologer-website-kundan-singh/settings/environment-variables) as **Production → Config → `ASTRO_GOOGLE_CLIENT_ID`**. For a newly created web client, Google also shows its **Client secret once**: preserve it directly as **Production → Secret → `ASTRO_GOOGLE_CLIENT_SECRET`** for the same client's later Calendar authorization. The current sign-in code does not consume that secret; do not imply Calendar is connected merely because it is stored. If reusing an existing client, preserve its existing secret and do not rotate credentials belonging to another running integration just to complete this step.

Report saved, not the secret. No screenshot, card, Cloud Run, Secret Manager purchase, account transfer, source publication or redeploy is needed. If an actual permission/billing/policy requirement blocks creation, report its text without accepting a cost or inventing a placeholder. App branding/domain/policy verification, sustainable Calendar consent and real account sign-in remain separate required checks before online acceptance.

Official instructions: [Google Auth setup](https://support.google.com/cloud/answer/15544987), [Google sign-in origins and incremental permissions](https://developers.google.com/identity/gsi/web/guides/get-google-api-clientid), [client-secret visibility](https://support.google.com/cloud/answer/15549257) and [the advisory billing check](https://support.google.com/cloud/answer/15548748). Existing `PrivateCalendar.jsx` uses a JavaScript credential callback; `admin.py` verifies identity/audience/nonce and the client address. Do not replace that with a different authentication platform.

## Next account step — Cloudflare account and inquiry queue

**Completed by user report, 2026-09-11:** the scoped token creation and three Production settings below are saved. Do not repeat this batch or request the secret. Actual runtime access is still unverified; helper credentials and coordinated publication remain later steps.

Cloudflare is only the small delivery/recovery helper, not the website or domain host. On 2026-09-11 the user supplied account ID `162c1ab1ba0619c1c78d9495f3260f18`, queue ID `56cea51fb5b14ba1b133cf9b2d4f9a09` and login `neuraflowindia@gmail.com`. Retain this existing queue/account; no recreation or email change is required. These are user-reported identifiers, not independent verification of account ownership, permissions, queue association or Free-plan configuration.

1. In Cloudflare **My Profile → API Tokens → Create Token → Create Custom Token**, name the key **Astro Advice Inquiry Queue**. Set **Account → Queues → Edit** and **Account Resources → Include → Specific account**, selecting the account above. Do not grant all-account, DNS or Workers administration permissions. Leave optional IP restrictions and expiry unset for this server credential. Continue to summary and create the token. Copy its once-shown value directly into Vercel, never chat or source. See [token creation](https://developers.cloudflare.com/fundamentals/api/get-started/create-token/) and [Queues publication permission](https://developers.cloudflare.com/queues/examples/publish-to-a-queue-via-http/).
2. In the intended website's [Vercel environment settings](https://vercel.com/neura-flow1/astrologer-website-kundan-singh/settings/environment-variables), select **Production only** and save:

   | Name | Type | Value |
   | --- | --- | --- |
   | `ASTRO_CLOUDFLARE_ACCOUNT_ID` | Config | `162c1ab1ba0619c1c78d9495f3260f18` |
   | `ASTRO_CLOUDFLARE_QUEUE_ID` | Config | `56cea51fb5b14ba1b133cf9b2d4f9a09` |
   | `ASTRO_CLOUDFLARE_QUEUE_TOKEN` | Secret | The newly created token, entered privately. |

   [Vercel documents Config and Secret types](https://vercel.com/docs/environment-variables/sensitive-environment-variables). Ask only for a saved confirmation. Do not redeploy old remote code at this step. No card, domain move or sample Worker is needed.

Once identified, configure scoped publication access and the two helper credentials using the [permanent helper runbook](workers/inquiry-delivery/README.md#configuration-and-account-sequence). The helper code is already implemented; no template project or alternate website. Coordinated source publication and real-provider checks remain separate from queue/account creation. [Cloudflare supports HTTP publication](https://developers.cloudflare.com/queues/examples/publish-to-a-queue-via-http/) and [Free Queues](https://developers.cloudflare.com/queues/platform/pricing/); actual account eligibility and hosted operation must still be verified.

## Historical Google package — superseded, not setup instructions

The following records the earlier same-day decision only. Its billing activation, deployment and supporting-service instructions must not be followed under the current requirement.

<details>
<summary>Show the superseded 2026-09-10 Google hosting plan</summary>

## Earlier decision — approved before the strict no-card requirement

Use **Neon Free + Google Cloud Run + Google Cloud Tasks + Resend Free**, retaining Google sign-in/Calendar/Meet, Razorpay and the existing Vercel website/domain. This supersedes the Render package. No new provider account or resource has been created by this planning update, and no application code changed.

The user reports that Vercel is aware of the current non-commercial setup while the client's business is being established. Keep the current arrangement and move to Vercel Pro before commercial use. Record this as user-reported, not independently verified correspondence; do not make renewed debate about Hobby eligibility a prerequisite to test setup. The website is `astroadvicebykundansingh.com` and the user confirms access to its Vercel hosting account. Project/source configuration and domain-record management still need inspection; the address and account-access question are closed.

### What each part does

| Part | Responsibility | Boundary |
| --- | --- | --- |
| Vercel | Existing public website and domain connection. | Preserve approved pages; identify the actual project and access. Commercial launch requires the user's planned Pro transition. |
| Neon Free | PostgreSQL appointments, availability, inquiries, sessions and saved delivery intent. | Keep one authoritative store, separate test/live records and verify backup restoration. No Neon Auth, Functions or other beta products are needed. |
| Google Cloud Run | Existing Python/FastAPI booking server and bounded task handlers. | Request-driven execution, not an always-running worker. Hosted startup, cookies and database connection behavior require proof. |
| Google Cloud Tasks | Dispatch saved work and retry failed handler requests. | Does not itself create Meet links or send emails. Authenticated handlers, safe repeat execution and recovery of saved-but-undispatched work remain to implement. |
| Resend Free | Verification codes, inquiry receipts/client alerts and booking confirmations. | Verify the owned sending domain and approved test recipients before enabling real sends. |
| Google sign-in/Calendar/Meet | Client-only calendar access and meeting invitations. | Client must authorize the required access; login alone is not Calendar consent. |
| Razorpay | Client payments. | Partner/client onboarding and test payments come at the payment stage. Real charging remains disabled. |

### Next user action and assisted inspection

1. Ownership and identifiers are recorded: client-owned accounts with delegated user access; Google project `Astrologer Kundan Singh`, ID `astrologer-kundan-singh`, number `759904162345`. On 2026-09-10 the user reported no linked billing account and a preference to leave it that way unless required. Do not ask for these facts again or create a duplicate. Inspect project permissions and existing resources/integrations before choosing isolated test placement. [Cloud Run](https://docs.cloud.google.com/run/docs/quickstarts/deploy-container) and [Cloud Tasks](https://docs.cloud.google.com/tasks/docs/add-task-queue) require enabled billing for hosted use; local preparation does not. Leave billing unchanged now; review concrete resource costs/controls and obtain scoped approval before guiding activation through official screens. Never request passwords, private keys or card details in chat. User-reported access is not access for Codex or independent provider verification.
2. Once authorized account access is available, guide inspection of the actual Vercel project for `astroadvicebykundansingh.com` and its connected source/domain records. Do not ask again for the website address or whether the user has Vercel account access. Continue Plan 1 P1-01 local work while account-only steps wait.

Guide official sign-in/account setup only when needed. Have the authorized human complete billing/payment-method approval in Google's own interface. Provider selection does not authorize unspecified charges, broad account access or activating live customer traffic.

### What the next session should achieve

1. Confirm the named accounts, source version and separate test destination. The checkout has unpublished changes: do not deploy the colleague's older remote version or auto-publish the entire dirty branch by accident.
2. Prepare the existing server for Cloud Run and configure a new Neon test store through secure settings. Review proposed regions, connection behavior, billing and usage controls before provisioning. No framework rewrite or unrelated design change.
3. Connect a separate website preview to that server. Preserve the page fallback and API path prefixes. Prove HTTPS cookie forwarding, uncached availability/private responses, exact-origin protection and separation from future live secrets. The existing Vercel-to-server routing idea requires revalidation for Cloud Run; it is not implemented yet.
4. Test startup/restart persistence, slot availability, unauthorized private access and controlled storage operations using dummy data. Do not bypass email verification to demonstrate public inquiry submission: verify the complete public form once test email is authorized. Existing destructive local integration tests must not be pointed at hosted data.

**Target outcome:** a reachable test setup using the new storage, with explicit evidence of what works. This is not a promise to finish payments or the complete booking journey in one session. Account-only steps may remain pending; safe local preparation should continue where possible.

### What follows that session

1. **Connections and communication:** finish real client Google login, sender-domain verification, email codes, inquiry receipts/alerts, Calendar/Meet and Cloud Tasks dispatch/recovery. Test only approved recipients and record actual delivery outcomes. If queue publication fails after a database commit, saved work must remain recoverable; no continuous database polling merely to keep free services awake.
2. **Payments:** connect the client merchant account in Razorpay test mode. Check all six services, per-question fees, abandoned/failed/repeated/late payments and slot protection. Confirm payment/booking records independently of browser success messages.
3. **Release and handover:** prove backup restoration and failed-delivery recovery; test full journeys, private availability controls and phone-cancellation handling; inspect laptop/2560-wide/mobile screenshots when the interface changes; agree refunds/payment exceptions, privacy/retention and actual running costs. Arrange client ownership and Vercel Pro before commercial launch, then obtain publication/live-test authority. Keep dummy data out of the live store.

### Cost and safety boundaries

- Google Cloud's ongoing free allowances are different from introductory credits. A billing account is needed; exceeding allowances or using supporting services can cost money. Confirm billing state, payment-method approval and the resource estimate with the user before billable creation. Do not promise a hard zero bill or treat ordinary budget alerts as a spending cap. Include build/image storage, secrets, logs, network transfer and any scheduled recovery trigger in the cost review, not just server requests. [Google free-tier rules](https://docs.cloud.google.com/free/docs/free-cloud-features).
- Neon/Resend Free limits must be checked in the actual accounts. Database recovery history is not a complete long-term backup policy. Use separate recovery proof before launch, and do not add paid upgrades without agreement. [Neon plans](https://neon.com/pricing), [Resend plans](https://resend.com/pricing).
- Retain the existing durable delivery table and add only the selected Cloud Tasks delivery mechanism. No Render worker, QStash or duplicate booking store is part of this package. Review authenticated task handling, duplicate/reordered delivery, quota exhaustion, restart recovery and visibility of unfinished work before launch. [Cloud Tasks integration](https://docs.cloud.google.com/run/docs/triggering/using-tasks).
- Rotate inherited exposed credentials through their owners. Preserve unrelated work and old external dummy stores. No real messages, meetings, payments or publication without the applicable approved scope.

### Evidence for this decision

Inspected the current roadmap, provider setup, product/architecture context, backend handoff and prior verification report. Used Neon's provider guidance to keep its role limited to PostgreSQL and official account access, and checked official Google billing guidance. Updated documentation and checked consistency/whitespace. No new runtime, browser or live-provider proof is claimed.

</details>

## Historical Render plan — superseded, not setup instructions

The following dated plan is retained only to explain earlier decisions and estimates. Its Render signup steps, prices and Vercel eligibility questions are not the current next actions. Follow the current sections above.

<details>
<summary>Show the superseded 2026-09-09 Render plan</summary>

## Decision and current boundary

The user approved Render, Render Postgres, Resend, Google sign-in/Calendar/Meet and Razorpay, and subsequently confirmed that a domain already exists and the website is hosted on Vercel. Preserve the existing Vercel website/domain; Render is for the booking backend, PostgreSQL and delivery worker. Start Resend on its Free plan. Exact domain name, Vercel project/access/plan, paid Render plans and account ownership still need confirmation. These hosting facts are user-reported, not independently checked against an account. No account connection, resource purchase, deployment, message, calendar invitation or payment has occurred in this setup step. The existing local test results remain in [BOOKING_FOUNDATION_REVIEW.md](BOOKING_FOUNDATION_REVIEW.md); they do not establish live-provider readiness.

All old bookings/inquiries are confirmed dummy data. Use an empty new store. Do not import dummy records into production or delete old external accounts/stores. Use fresh secrets; coordinate revocation of credentials exposed in old Git history.

## First two user actions

1. Open the [Render dashboard](https://dashboard.render.com/) and sign in or create a free account that the user legitimately controls. Stop at the dashboard. Do not create a paid service, connect every GitHub repository, or share the client's login. Identify this as a test setup; agree eventual client ownership before live handover.
2. Supply the website address and whether the user can open its project in the Vercel dashboard. A domain and Vercel hosting are already confirmed; do not ask whether they exist again. We can then identify the actual domain-record provider and the existing plan. No domain password, API key or ownership transfer is needed in chat.

The next guided step is a review of the actual account's plan, region, domain arrangement and bill estimate. Only then provision approved test resources. Render account signup is separate from buying compute. [Render first-deploy guide](https://render.com/docs/your-first-deploy).

## Service inventory and purpose

| Item | Purpose | Status / next dependency |
| --- | --- | --- |
| GitHub | Source history and eventual colleague PR. | Repository already exists; local work is not yet published. Before deployment, choose the authorized source/branch containing the reviewed changes. Do not deploy the colleague's old remote version by accident or grant all-repository access. |
| Render web service | Run the existing FastAPI booking server. | Provider approved; account/resource not verified. Keep checkout disabled until payment integration is complete. |
| Render Postgres | Durable appointments, closures, inquiries, verification/session data and queued delivery work. | Provider approved; no hosted database created. Use private connectivity and restrict external database access. |
| Render background worker | Consume saved delivery work, create/check Meet details and retry email/calendar actions after failures. | Budgeted separately; worker implementation is still pending. Same repository and PostgreSQL database, not a second booking application or another queue provider. |
| Vercel website hosting | Keep serving the existing React/Vite pages and domain. | Existing hosting confirmed by user; project/account/plan not inspected. Propose same-origin `/api` forwarding to Render, subject to hosted cookie/proxy proof. Do not create duplicate Render website hosting or move the domain by default. |
| Resend Free | Deliver verification codes, inquiry receipts/alerts and booking emails. | Start on the Free plan; no paid email subscription is proposed. Sender-domain verification and account setup remain pending. The client's Gmail is a recipient, not an authorized Resend sending domain. |
| Google | Client-only login, authorized Calendar connection and unique Meet invitations. | Client account known; Google project/consent and actual calendar capabilities not connected. Login does not grant Calendar permission. |
| Domain provider | Website address and domain records for hosting/email verification. | Domain exists, per user; exact name and record-management provider not yet supplied. Vercel hosting does not prove that Vercel is the domain registrar or DNS provider. Reuse the domain and preserve existing website/mail records. |
| Razorpay | Client merchant payment orders, captured-payment verification and payment reconciliation. | Provider approved; partner/client setup deferred to its implementation stage. |

## Initial cost envelope, not purchase approval

Current public prices checked on 2026-09-09. Exact plan names and the account's checkout estimate must be rechecked before creation. These are small starting sizes for testing, not a performance guarantee for launch.

| Item | Monthly base estimate in USD |
| --- | ---: |
| One 512 MB web service | $7 |
| One 512 MB background worker, once implemented | $7 |
| One 256 MB PostgreSQL instance | $6 |
| **Render compute subtotal for one backend environment** | **$20** |
| Hobby workspace, one member | $0 extra |
| Pro workspace, if separate team access is required | $25 extra |
| Resend Free | $0 within its limits |
| Existing Vercel website | Existing plan/usage cost not yet verified; not included in the Render subtotal |

Thus the compute/workspace subtotal is **$20 on Hobby or $45 on Pro**, before the variable/excluded items below. Render bills workspace, compute and metered usage separately. [Render pricing](https://render.com/pricing).

The $20 estimate never included a paid Resend subscription. Keeping the website on Vercel does not remove the separate Render booking-server/database/worker cost. The full website bill must also account for its existing Vercel plan and usage. Vercel Hobby is limited to personal, non-commercial use; check the existing team's eligible plan before publishing the client's commercial site. Do not assume it is Hobby, automatically buy Pro or move the website without a decision. [Vercel Hobby rules](https://vercel.com/docs/plans/hobby).

Database storage needs dashboard confirmation: the pricing page mentions 1 GB included, while its general cost guide also describes per-GB billing. Budget storage separately at the listed $0.30/GB/month rather than claiming an exact final bill from that ambiguity. Also allow for bandwidth/build usage beyond included allowances, temporary backup-restore instances, a second environment while test and live overlap, taxes and currency conversion. Domain renewal, Razorpay transaction fees, any paid Google subscription and an eventual email upgrade are not included in the Render subtotal. Long-term off-provider backup retention is a separate release decision, not silently included. [Render cost model](https://render.com/articles/how-much-does-cloud-application-hosting-cost-for-small-businesses).

**Ownership affects cost:** Hobby currently permits one workspace member; Pro permits team access. A single-owner test account is reasonable while preparing the system, but do not promise free separate logins for the client and maintainer. Client-owned team access is the preferred handover arrangement if both need ongoing access; its extra cost must be accepted first. Never work around this by sharing passwords. [Workspace membership limits](https://render.com/docs/platform-features-by-plan).

This limit concerns access to Render's hosting dashboard, not users of the website. The client's Google-locked booking calendar does not require a Render team seat. If only one person will administer hosting, do not buy Pro merely so the client can manage appointment availability.

**Backups:** Paid PostgreSQL has a three-day recovery window on Hobby and seven days on Pro or higher. This is not high availability or independently retained long-term backup. Prove an actual restore before launch, and agree retention/access. [Render backups](https://render.com/docs/postgresql-backups).

**Email:** Start with Resend Free at $0. It currently allows 3,000 emails/month and 100/day. One appointment may produce several emails, and verification resends/inquiries consume allowance too. Measure the combined volume and provide quota/failure visibility; do not promise that free email will remain sufficient or upgrade without agreement. Do not discard required notifications just to fit the quota. Verify an owned sending domain without changing the website's hosting. [Resend pricing](https://resend.com/pricing) and [sender-domain verification](https://resend.com/docs/dashboard/domains/introduction).

## Existing Vercel connection — implementation constraints

The routing/configuration skills informed this plan; they did not change any account. `vercel.json` currently contains only the website's catch-all rewrite to `/index.html`, not a booking-backend proxy. Preserve that page fallback when adding a more specific `/api/:path*` external rewrite to the approved Render backend, retaining the backend's `/api` path prefix. Vercel supports forwarding to an external origin without changing the visitor's URL. [Vercel rewrites](https://vercel.com/docs/routing/rewrites).

Both frontend request helpers currently require an explicit `VITE_API_URL` and append paths beginning `/api`. For this design it must point to the intended website origin, not append `/api` a second time. Configure Preview and Production separately; previews must not inherit the live backend, live sending or live payment configuration. Keep backend secrets on Render, never in Vite's browser-exposed variables. This is a Vite app, not Next.js; do not apply Next.js environment-loading conventions to it.

Prove uncached availability/private responses, cookie setting and forwarding, exact-origin request protection, proxy-aware rate limits, correct POST bodies and error status forwarding on the actual Vercel-to-Render route. Include external-rewrite caching settings in that review. Do not weaken strict cookies, introduce wildcard origin trust or put admin authorization solely in Vercel routing. Account/routing implementation is pending; no configured backend hostname or working hosted connection is claimed.

## Guided setup order

1. Confirm account/domain facts and approve the precise resource/budget proposal. Keep paid creation, broad GitHub access and auto-deployment off until those decisions are resolved.
2. Prepare the deployable application and source branch, preserving the existing Vercel website and adding the reviewed Vercel-to-Render API route, a delivery worker, migration instructions, health checks and secure host settings. Local implementation can proceed without access to the old dummy stores. Avoid a deploy button pointing to a worker that does not exist yet.
3. Create the authorized test database/server and configure secrets in the provider's protected settings. Use one region, private database access and the same HTTPS website origin for browser/API requests. Check cookies, sign-in, migrations, rate limits and failure states on that host. No customer traffic or live charging.
4. Guide Resend domain verification and Google project/sign-in/Calendar authorization. Use client-controlled accounts where required and approved test recipients. Verify meeting readiness, both-party invitations, durable email retries and cancellation updates. Keep test jobs isolated from future live delivery.
5. Handle Razorpay partner/client onboarding in test mode. Verify payment creation, capture, signatures, duplicate/late events, expired holds and exception handling. Never rely on a browser success message as payment proof.
6. Before release, agree operating ownership, retention, refunds/payment exceptions and the full live budget; rotate old secrets; prove restore/recovery and hosted journeys; obtain client acceptance and publication authority. Publish a clean live environment without dummy records. Do not retain two billed environments indefinitely without agreement.

## Proportionate-design review

Scope: the selected provider plan, not a new line-by-line security audit. The vanity-engineering review skill was used to check requirement fit and avoid unnecessary subscriptions. The user stories are booking/payment, availability closures, email verification, inquiry handling and meeting/notification delivery. There are no live customers yet; the approved capacity is one practitioner and ten 30-minute starts per working day. Visitor/inquiry volume and long-term maintenance capacity are not measured.

### Assessment

- **Requirement-to-complexity ratio: 3/10**, a qualitative plan assessment, not a benchmark. One existing application, one database and one delivery worker meet the reliability need without a new administration platform.
- **V2 risk avoided: rewrite for a free allowance.** Twilio hosting would require changing the existing backend without eliminating the database requirement. The user retained the existing stack; no rewrite was made. Avoidance cost now: no code removal needed.
- **V1 risk avoided: duplicate storage/queue services.** The durable delivery table already exists in PostgreSQL. Do not add Redis, a spreadsheet master store or another queue subscription without a measured requirement. Avoidance cost now: no new service to provision or remove.
- **V1 operational tradeoff: separate worker compute.** It costs money, but interrupted requests or provider failures must not lose paid-booking notifications. Keeping the worker in the same repository/database limits extra complexity. Combining execution with the web process could save compute, but is not approved without equivalent lifecycle/retry proof. No refactor is needed for this setup decision.
- **V1 cost risk corrected: workspace access.** Free signup is not free multi-person administration. The estimate now separates the team fee. Documentation-only correction; no runtime change.
- **Vanity debt estimate:** No operational person-hour measurement exists yet. A numerical monthly maintenance claim would be invented. No additional subscription beyond the selected plan was introduced in this review.
- **Hard question:** If we remove the worker to save its fee, what demonstrably finishes interrupted meeting/email delivery? Until there is an equally reliable measured answer, its cost has a user-facing purpose.

### Stop, review and continuation criteria

These are a proposed pre-release operating checklist, not authorization to shut down external services, delete records or automate refunds. The budget cap and incident/maintenance owner are not agreed; record the named human owner other than the implementation agent before launch. The user remains the approval contact during setup. No numeric operational threshold is deployed by this document.

| Scope | Stop new risky actions | Review / continue only when |
| --- | --- | --- |
| Booking/database | Unknown storage, conflicting occupancy or unverified payment cannot produce a confirmed booking. Preserve existing records. | Price/slot concurrency, rollback, backup restoration and payment reconciliation are demonstrated. |
| Hosting/worker | Do not enable customer traffic against missing delivery implementation or an unverified host. | Actual compute usage fits the approved budget, restart/retry recovery works, and an operator can find stalled delivery. |
| Google | Missing/revoked access or unready Meet must not be displayed as a ready meeting. | Authorized account, intended calendar, unique conferences and both-party invitations are tested; failures remain visible. |
| Resend | Failed sends or exhausted quota must not be reported as delivered mail. | Verified sender, approved recipients, retry/deduplication and quota handling are demonstrated. |
| Razorpay | No live charging before authorized merchant setup and exception/refund decisions. | Provider test results and a separately approved live smoke test agree with durable payment/booking records. |
| Domain/source/accounts | No broad GitHub permissions, secret commits, password sharing or unapproved domain cutover. | Actual source version, least access and ownership/handover are documented. |

Financial overruns, low utilization, provider incidents or maintainer departure trigger a human review, not automatic destruction. Existing appointments and statutory/business retention may still require keeping records and services accessible. This replaces the skill's generic automatic-decommission examples because they are unsuitable for paid bookings. Likewise, lack of code changes is not a reason to delete stable booking logic.

Anti-complexity rules: justify each new dependency/provider against a current need; document the simpler alternative before an architectural change; retain one authoritative appointment store; and require a non-author to follow the final operating runbook. Before provisioning, agree the budget and account owner. Before launch, agree the incident owner, measurable service targets and a review date. Record actual usage/cost and maintenance burden at that review before changing plans.

## Evidence for this setup step

Provider documentation and existing roadmap/runbook inspected; source/plan recommendations reviewed; project documents updated and checked for consistency/whitespace. No application code or UI changed, so no new build, browser screenshots or hosted tests are claimed. Provider plan/account confirmation, test resource creation and the remaining integration implementation are still pending.

</details>
