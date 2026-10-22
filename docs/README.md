# Project 003 — documentation index

Reviewed **22 October 2026**. This is the maintained application's current reading route. The original September plans and old runbooks are retained as history, not the present engine or a request to repeat setup.

The [19 October client handoff](project-003/2026-10-19-documentation/README.md) publishes the current outer working status/navigation and relevant historical notices alongside this application. Its manifest distinguishes original working text from link-adapted copies; no private storage or application duplicate is included.

| Read | Purpose |
| --- | --- |
| [Application README](../README.md) | Actual source, local build, publication and preservation boundaries. |
| [Current operating/source guide](appointment-system-release.md) | Implemented customer/staff flows, installed version, runtime ownership, dated evidence and parked work. |
| [Booking details contract](../appointment-system/docs/booking-details.md) | Full saved name + phone, read-only lookup, old-code retirement, privacy and single changeover. |
| [Booking experience](../appointment-system/docs/booking-experience.md) | Drafts, optional email, accessible selectors, authoritative receipts/PDF/requested-copy behavior. |
| [Contained setup](../appointment-system/docs/contained-setup.md) | Official project-owned setup; do not rerun completed enrollment or alter saved policy from bootstrap. |
| [Company recovery](../appointment-system/docs/company-recovery.md) | Protected recovery only when actually needed; no public reset or implicit credential replacement. |
| [Historical handover commands](../appointment-system/docs/handover-commands.md) | Exact source-layout recognition and fenced conversion when applicable, not normal daily setup. |

Source owners: src/App.jsx → src/Component and src/lib; api/index.py → complete appointment-system and sibling appointment-settings; proxy/build-support → guarded hosting; workers/workflows → contained operation. Public service copy belongs in src/data/publicServices.js; protected saved policy and server quotes own current fees/availability.

## Current public-page candidate

The [22 October search/accessibility implementation](evidence/2026-10-22-search-accessibility/README.md) records the actual public HTML renderer, single metadata owner, responsive media and focused interface changes. It is an isolated local candidate; publication and hosted acceptance remain with the coordinating four-project release. The current source chain is `src/main.jsx` → `src/App.jsx` → `src/PublicApp.jsx`; public page identity belongs in `src/data/page-metadata.mjs`. Do not use the older title/sitemap tables as a second source.

## Historical decisions and proof

[Plan1](PLAN-001-booking-inquiries-and-client-calendar.md), [its contracts](PLAN-001-implementation-contracts.md), [Plan2](PLAN-002-testing-and-release-certification.md), [old testing guide](TESTING.md), [old operating guide](OPERATIONS-001-booking-system.md), architecture/roadmap/setup files and dated evidence explain the previous engine. Their obsolete paths, credentials, commands and prelaunch status must not be used as current instructions. Read the current release guide before following any historical task or command.

The 11 October access change completed publication/database/worker readback with tests expressly excluded. Earlier accepted source/provider/backup results retain their original dates; no whole-website coverage or fresh live-customer acceptance is inferred. Visible chronological note history remains owner-deferred; broader physical-device/native-screen-reader proof remains separate. No new feature, suite or provider release follows from this documentation update.
