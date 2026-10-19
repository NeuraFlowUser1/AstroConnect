# AstroAdvice by Kundan Singh — maintained application

> **19 October GitHub publication:** the owner has authorized publishing this documentation. Runtime/closeout commits quoted below identify the inspected base before this documentation follow-up; they are not an assertion that those remain the latest main revision. Git records the current revision. No customer setting or website behavior changes here.

Reviewed **19 October 2026**. Official website: **https://astroadvicebykundansingh.com**. Repository: **NeuraFlowUser1/AstroConnect**. Start with [the current documentation index](docs/README.md) and [the operating/source guide](docs/appointment-system-release.md).

The 11 October shared name-and-phone booking access is published. Runtime source693872e257cead98f56afe6ebcaf38a8421f3b77; documentation closeout/main 4b9d4bac935dba8fee6d61a48517763753e669db, independently read on 19 October. The installed package is 1.0.0-rc.1, digest 54af467afbe152286f1f81f28f904a8b59b51e31111e6a81d93b1d340bd3720a: 576 manifest entries plus release.json, migrations 001–037.

## How this application is organized

- `src/App.jsx`, `src/Component/` and `src/data/` own public routing, pages, shared frame, public services and reviews.
- `src/lib/BookingProduct.jsx`, productState/useBooking/useEnquiry and booking-ui bindings adapt the complete contained system without creating another booking implementation.
- `api/index.py` creates the application from sibling `appointment-system/` and `appointment-settings/project.json`. Settings own this client; no factory or other-client runtime import.
- `build-support/public-page-modes.mjs`, `proxy.js`, vercel.json and classified settings preserve guarded ON/OFF page/assets and private routes.
- `workers/` and `.github/workflows/appointment-*` use this installation's contained recovery, monitor and encrypted-backup tools.

Customers use `/booking/receipt` with both saved full name and phone; old help/access links redirect. Lookup is read-only. The original saved-browser receipt is separate. Phone is required; booking email follows its saved email-code switch. General enquiries retain independent verification. Private staff/company access and OFF protection are not relaxed by public navigation.

## Local work and publication

Use the Node version declared by .nvmrc/package.json. With the committed lockfile, run `npm ci`, then `npm run dev`; `npm run build` builds the website and guarded public-page modes. Backend setup/operation uses the installed [contained setup guide](appointment-system/docs/contained-setup.md), with protected project credentials. Import/startup never authorizes migration, enrollment or provider actions.

`verify:fast`, `verify:release` and `verify:production` exist; [the current guide](docs/appointment-system-release.md) defines their scope and required isolated fixtures. Even the fast alias runs a broad contained selection: no suite is part of this documentation review. Full local/hosted checks require explicit scope. Do not use the retired SMTP/Jitsi/local-JSON/service-account runbooks as setup instructions.

Publish only through existing Git main → connected Vercel neura-flow1/astrologer-website-kundan-singh → official domain, after applicable approval. Keep Vercel disconnected from Codex. Verify actual published assets separately from Git success. An older package is not a safe automatic rollback after retired code/nullable-email migrations; keep booking OFF and use a compatible repair if needed.

Completed setup, dated proof, deferred note-history UI and remaining proof limits are in the current guide. Historical September plans and earlier release receipts remain available there; they are not another active checklist. Preserve the separate dirty imported source, comparison copies, original evidence and existing accounts. Never expose private keys, records, meeting links or mail bodies.
