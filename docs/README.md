> **Current replacement release:** use [the contained release and operating guide](appointment-system-release.md).
> Both live common databases are at migration 034 with booking OFF authority preserved,
> and the fresh official stored-backup/restore/retention chain is accepted. Worker/public
> website and resource/account acceptance remain separate. The dated original material
> below describes the previous engine and is historical; removed file paths and old
> setup/backup commands are not current operating instructions.

# Project plans and operating documents

Start here after a break or context reset. This page lists the historical authority, superseded by `appointment-system-release.md`; dated evidence remains available for audit but is not a to-do list.

## Current position — 2026-09-15

- The public website, paid booking journey, private studio tools, Google Calendar/Meet delivery, participant emails, dual Google Sheet copies, Cloudflare recovery and encrypted daily database backup are released on `astroadvicebykundansingh.com`.
- [Plan 1](PLAN-001-booking-inquiries-and-client-calendar.md) owns the booking/inquiry requirements and operational handover. Its remaining human checks are the second offline decryption-key copy and any newly required real-provider acceptance.
- [Plan 2](PLAN-002-testing-and-release-certification.md) owns repeatable testing and release proof. The deterministic local test system is implemented; its current checkpoint and acceptance checklist state what has been proved and what still requires hosted or human evidence.
- [Testing guide](TESTING.md) is the practical runbook for the three certification commands and their meaning.
- [Studio operating guide](OPERATIONS-001-booking-system.md) explains daily use, attention handling, cancellation and recovery in plain language.

## Numbered plans

| Number | Plan | Purpose |
| --- | --- | --- |
| 1 | [Reliable Booking, Inquiries and Client Calendar](PLAN-001-booking-inquiries-and-client-calendar.md) | What the customer and studio system must do, including provider delivery and operations |
| 2 | [Testing and Release Certification](PLAN-002-testing-and-release-certification.md) | How each source version is tested locally, in GitHub and on the official domain |

Do not create a competing checklist for work already owned by one of these plans. Update that plan's **Resume here** section after each meaningful stage.

## Current technical references

- [Architecture](../architecture.md)
- Backend setup and operation (historical path `../src/backend/README.md`)
- [Booking implementation contracts](PLAN-001-implementation-contracts.md)
- [No-card hosting alignment](PLAN-001-no-card-hosting-review.md)
- [Historical requirements and decisions](../BOOKING_ROADMAP.md)
- [Provider/account setup](../BOOKING_SETUP.md)

## Latest production evidence

- [Production recovery watchdog — 2026-09-15](evidence/plan-002/2026-09-15-production-watchdog.md)
- [Encrypted backup and isolated restore — 2026-09-15](evidence/plan-001/2026-09-15-encrypted-backup-and-restore.md)
- [Email and dual-Sheet mirroring — 2026-09-14](evidence/plan-001/2026-09-14-email-and-sheet-mirroring.md)
- [Appointments and service refinement — 2026-09-13](evidence/plan-001/2026-09-13-appointments-and-service-polish.md)
- [Controlled Live payment and cancellation — 2026-09-13](evidence/plan-001/2026-09-13-live-payment-verification.md)

Older files under `docs/evidence/plan-001/` are dated history. They prove only the event and version named in the file; they do not override the current plans or prove continuous health.

Never store credentials, customer records, private meeting links or private workbook links in project documentation.
