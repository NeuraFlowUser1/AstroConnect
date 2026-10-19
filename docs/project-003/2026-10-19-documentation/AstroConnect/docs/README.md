> Dated GitHub handoff copy, 19 October 2026. The original working document is recorded in manifest.json. Relative links have been adapted for this repository; any unavailable local-only evidence is identified explicitly.

> **Historical imported copy — reviewed 19 October 2026.** This file describes the previous source/engine. It is not the maintained publication or an instruction to repeat setup. Start with [Project 003 current status](../../PROJECT-STATUS.md) and [the maintained operating guide](../../../../appointment-system-release.md). Preserve this dirty import and unrelated work.

# Project plans and operating documents

Start here after a break or context reset. This page lists the current authority; dated evidence remains available for audit but is not a to-do list.

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
- Backend setup and operation (local workspace reference: `03-client-projects/003-astroadvice-by-kundan-singh/AstroConnect/src/backend/README.md`)
- Booking implementation contracts (local workspace reference: `03-client-projects/003-astroadvice-by-kundan-singh/AstroConnect/docs/PLAN-001-implementation-contracts.md`)
- No-card hosting alignment (local workspace reference: `03-client-projects/003-astroadvice-by-kundan-singh/AstroConnect/docs/PLAN-001-no-card-hosting-review.md`)
- [Historical requirements and decisions](../BOOKING_ROADMAP.md)
- [Provider/account setup](../BOOKING_SETUP.md)

## Latest production evidence

- Production recovery watchdog — 2026-09-15 (local workspace reference: `03-client-projects/003-astroadvice-by-kundan-singh/AstroConnect/docs/evidence/plan-002/2026-09-15-production-watchdog.md`)
- Encrypted backup and isolated restore — 2026-09-15 (local workspace reference: `03-client-projects/003-astroadvice-by-kundan-singh/AstroConnect/docs/evidence/plan-001/2026-09-15-encrypted-backup-and-restore.md`)
- Email and dual-Sheet mirroring — 2026-09-14 (local workspace reference: `03-client-projects/003-astroadvice-by-kundan-singh/AstroConnect/docs/evidence/plan-001/2026-09-14-email-and-sheet-mirroring.md`)
- Appointments and service refinement — 2026-09-13 (local workspace reference: `03-client-projects/003-astroadvice-by-kundan-singh/AstroConnect/docs/evidence/plan-001/2026-09-13-appointments-and-service-polish.md`)
- Controlled Live payment and cancellation — 2026-09-13 (local workspace reference: `03-client-projects/003-astroadvice-by-kundan-singh/AstroConnect/docs/evidence/plan-001/2026-09-13-live-payment-verification.md`)

Older files under `docs/evidence/plan-001/` are dated history. They prove only the event and version named in the file; they do not override the current plans or prove continuous health.

Never store credentials, customer records, private meeting links or private workbook links in project documentation.
