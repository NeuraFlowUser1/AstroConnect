> **Current replacement release:** use [the contained release and operating guide](appointment-system-release.md).
> Both live common databases are at migration 034 with booking OFF authority preserved,
> and the fresh official stored-backup/restore/retention chain is accepted. Worker/public
> website and resource/account acceptance remain separate. The dated original material
> below describes the previous engine and is historical; removed file paths and old
> setup/backup commands are not current operating instructions.

# Astro Advice booking system — plain-language operating guide

This is the historical operating guide, superseded by `appointment-system-release.md` for `astroadvicebykundansingh.com`. It contains no passwords or secret values.

## What happens when a customer books

1. The customer chooses one of the six services, a date and a 30-minute time.
2. The website verifies the customer's email with a five-minute code.
3. The website temporarily reserves the selected time for up to ten minutes and asks Razorpay to open payment.
4. The website confirms payment only after it checks the saved Razorpay order, captured amount, currency and merchant account on the server. The browser saying “success” is not enough.
5. A confirmed payment permanently claims the time. The job queue then creates one Google Calendar event and Google Meet link and sends separate confirmation emails to the customer and studio.
6. If the browser closes, a Razorpay notification or the 15-minute recovery run finishes the same saved work. It does not create a second order, booking or meeting.

Customers can book only up to ten days ahead. Every service lasts 30 minutes. Prashna Kundali costs ₹1,100 per selected question, from one to ten questions. Any extra questions during the consultation need additional payment at the consultation.

## What the client uses

Open `https://astroadvicebykundansingh.com/studio/calendar` and sign in with the studio Google account.

- **Appointments:** see upcoming, past and cancelled bookings; open a booking for the customer, payment, birth, question and meeting details; record a phone-agreed cancellation.
- **Calendar:** see booking counts on dates, inspect a selected day's slots, and close or reopen free dates/times.
- **Inquiries:** read Contact, Home and Prashna inquiries.
- **Needs attention:** handle unusual payments, failed Calendar/Meet work, failed customer/studio emails and a failed Google Sheet copy.

A date or time containing an existing booking or payment in progress cannot be closed. Cancelling an appointment updates the website record, removes the website-created Google event and sends both parties a cancellation email. The private page states **“Refund to be done manually.”** Cancellations and payment questions are handled by phone.

## If something needs attention

- Check Razorpay before asking a customer to pay again.
- A late, mismatched, refunded or disputed payment stays visible under **Needs attention**. Marking it handled only records the client's note; it never moves money.
- If Google Calendar, Meet or an email fails, fix or reconnect that service and press **Try delivery again**.
- If a Google Sheet copy fails, the website record is still safe. Restore the workbook share or service-account access, then press **Try copy again**. Never type the same record into the Sheet as a replacement row.
- An unmatched Razorpay notification also appears under **Needs attention** with its Razorpay payment reference and a **Check again** button.
- Do not delete database rows, recreate an order, invent a meeting link or promise a refund to make an error disappear.

## Normal checks

- `https://astroadvicebykundansingh.com/api/health` means the website code is responding. It deliberately does not wake the database.
- `https://astroadvicebykundansingh.com/api/ready` checks the database schema and all connections needed before a booking can start. `storage_ready` and `booking_enabled` must both be `true` for customer checkout.
- The Cloudflare helper runs every 15 minutes. It recovers saved work even with no visitor on the website. Each complete run records a privacy-safe heartbeat; the GitHub **Production watchdog** checks it and the official website four times an hour.
- Review the private **Needs attention** tab at the start and end of each working day, even if no alert was received.

## Backups and recovery

### Readable customer-record copies

Neon remains the master record. Every inquiry and every confirmed appointment is also copied to two private workbooks: one owned by the client and one owned by NeuraFlow. Both workbooks have **Appointments** and **Inquiries** tabs. A cancellation updates the same appointment row by its permanent booking reference. Unpaid or abandoned checkout holds are not copied because they are not appointments.

The website uses one Google service account with spreadsheet-only permission. Each workbook must be shared directly with that service-account email as an editor. The server needs `ASTRO_GOOGLE_SHEETS_SERVICE_ACCOUNT_JSON`, `ASTRO_CLIENT_SHEET_ID` and `ASTRO_AGENCY_SHEET_ID` in protected Vercel settings. These copies are operational safeguards, not replacements for the database or encrypted backup below.

### Encrypted database backup

GitHub runs `.github/workflows/production-database-backup.yml` once each day. It makes a consistent PostgreSQL export, checks it, encrypts it with an `age` public key and uploads it to the client-controlled Google Drive folder `astro-advice-production-backups`. It verifies the uploaded encrypted bytes before reporting success. After verification, it keeps exactly the 15 most recent app-owned backups (including any additional manual runs) and permanently removes older encrypted archive/checksum pairs so Google Drive Trash cannot continue consuming storage. No unrelated Drive file, plaintext backup or decryption key is uploaded or removed.

The GitHub repository needs these protected values:

- `ASTRO_BACKUP_DATABASE_URL`: the direct Neon maintenance connection, not the pooled website connection.
- `ASTRO_BACKUP_AGE_RECIPIENT`: the public half of the offline backup key.
- `ASTRO_BACKUP_RCLONE_CONFIG`: the restricted Google Drive connection named `astro-drive`.

Keep the private `age` identity offline in two controlled copies. Never place it in GitHub, Vercel, Google Drive, chat, source code or screenshots. GitHub Actions failure notifications must be enabled for the named operator. A missing/failed daily run is an operational problem, not a successful backup.

To prove recovery, download one `.dump.age` file and run `scripts/restore-database-backup.sh` with the offline identity against a newly created, empty local database named exactly `astro_booking_restore_test`. The script refuses any other database name. After restoration, compare booking/payment/event counts with the source checkpoint and inspect unresolved work. Never replay restored delivery jobs against real providers and never restore directly over production as a test.

Current recovery targets:

- Neon provides the short first line of recovery; the current Free project exposes six hours of point-in-time history.
- The independent encrypted backup runs daily and keeps the 15 most recent successful copies. Under the normal daily schedule this is about 15 days; additional manual runs consume one of those 15 positions. If Neon and its short history are both unavailable, up to 24 hours of the newest records may need provider-led reconciliation.
- Aim to start recovery within one hour of an alert and restore service within four hours. Payments and Google events must be reconciled before reopening checkout.

## Independent alerts

Cloudflare runs Worker `astro-advice-inquiry-delivery`, but this account does not offer a suitable Worker-error email notification. Do not select an unrelated alert merely to fill that gap.

Instead, every fully completed recovery pass writes one privacy-safe heartbeat containing only completion time, run reference and whether durable work needs attention. The public health result reveals only `healthy` or `attention_required`. GitHub's **Production watchdog** reads that result together with the official homepage, API liveness and booking readiness at 8, 23, 38 and 53 minutes past each hour. It performs four reads and no writes. A missed recovery is normally detected at the first check after the 20-minute freshness limit; GitHub schedules can occasionally be delayed.

GitHub sends workflow-failure notifications to the named operator. The separate daily backup workflow remains the backup signal. Neither alert uses Resend, so a Resend outage cannot hide them. A monitor failure never switches off the website or changes a booking; the operator checks **Needs attention**, provider status and the latest workflow run before deciding what to repair.

## Permanent account and route map

| Purpose | Permanent owner/resource |
| --- | --- |
| Website and Python API | Existing Vercel project under NeuraFlow; official domain above |
| Records | Existing Neon project `astro-advice-by-kundan-singh`; production branch and restricted website role |
| Customer/studio mail | Existing Resend account/domain; callback `/api/webhooks/resend` |
| Private sign-in, Calendar and Meet | Existing Google project `astrologer-kundan-singh`; callback `/api/admin/google/callback`; studio account only |
| Payment | Client's existing Razorpay merchant; callback `/api/webhooks/razorpay` |
| Durable work and 15-minute recovery | Existing Cloudflare Worker and existing queue `astroadvice-by-kundan-snigh-inquiries` |
| Readable customer-record copies | Two private Google Sheet workbooks, separately owned by client and NeuraFlow |
| Independent retained backup | GitHub scheduled job to client-controlled Google Drive folder |

The official website origin must remain in every relevant provider. An approved preview origin may coexist with it. Preview must never replace the official callback or destination.

## Secret changes and release recovery

- Change one credential only when its matching provider and website/helper values can be updated together.
- Preserve `ASTRO_GOOGLE_TOKEN_KEY`; changing it makes the saved Calendar permission unreadable and requires a controlled reconnect.
- During a queue credential rotation, update Vercel and the existing Worker together. Saved database jobs remain the authority and can be recovered after a short mismatch.
- During a Razorpay key change, never mix Test and Live key IDs/secrets. Existing orders remain pinned to the key and mode that created them.
- If checkout must stop, remove or invalidate only a required checkout dependency in Vercel and redeploy the reviewed source. Keep webhook and recovery routes reachable so already-paid work can finish. Do not add a second manual on/off flag.
- Roll back website source through the existing Git/Vercel deployment history. Database migrations are forward-only; recover with a reviewed corrective migration or the documented backup process, never by editing an applied migration file.

## Live payment state

The official system uses the client's Live Razorpay merchant credentials. A controlled ₹1 journey already proved payment, booking confirmation, Calendar and Meet creation, participant emails and phone cancellation; permanent service prices were restored immediately afterward. Never mix Test and Live credentials, repeat the temporary-price window, or make another verification payment without explicit approval of that payment. Normal read-only checks use `/api/ready`, the service catalogue and private operational views.

## No-card/free-plan boundaries

The booking code does not require Vercel Pro. If the website runs on either Vercel Free or Pro, the same booking code runs. Supporting services remain their direct no-card/free accounts. Free quotas can still pause a service when exhausted; there is no keep-awake ping, paid Marketplace bundle, automatic upgrade or hidden card-backed fallback.

Razorpay is the exception because it processes real customer money and charges its normal transaction fee. That is a business payment cost, not a hosting dependency.
