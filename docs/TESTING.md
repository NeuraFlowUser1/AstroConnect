> **Historical source/design record — reviewed 19 October 2026.** Use [the current operating/source guide](appointment-system-release.md) first. The dated body below describes its original source and observations; obsolete backend paths and unbundled screenshots are historical references, not present commands, current features or fresh proof. No missing evidence is reconstructed or claimed as available.

# Testing and release guide

This guide answers one question: **is this exact source version safe to release, and what has actually been proved?**

The automated checks never make a real payment, send a real message, create a Google event, write a Google Sheet row or alter the production database. Real-provider acceptance is a separate, explicitly approved exercise.

## The three commands

Run these from the `AstroConnect` folder.

### 1. Fast check

```bash
npm run verify:fast
```

Use this while editing. It checks code quality, creates the production website bundle, runs the Node/Worker contracts and runs every backend test that does not need PostgreSQL. Database-only tests are reported as intentional omissions; any other skip is a failure.

### 2. Complete release check

```bash
npm run verify:release
```

Use this before publishing. In addition to the fast checks, it:

- creates a temporary local PostgreSQL database named `astro_booking_test`;
- applies the real migrations and gives the application a production-shaped restricted database user;
- runs every backend test with zero skips;
- runs the Cloudflare Worker in its real local runtime;
- opens the site in Chromium, Firefox and WebKit;
- checks the main journeys at laptop, large-desktop, short-landscape and mobile sizes;
- runs automated accessibility checks and saves synthetic screenshots;
- scans current tracked files for credential patterns; and
- checks the Node and Python production packages for known high-risk advisories.

The temporary database listens only on its private local socket. The runner removes the exact temporary folder and stops only the processes it started, including after a failure.

### 3. Official-site check

```bash
npm run verify:production
```

Use this immediately after an approved deployment. It checks every permanent public route, safe API reads, booking readiness, anonymous studio refusal, unsigned webhook refusal and the live booking page's date/price/availability behaviour.

This command performs reads plus two deliberately unsigned webhook requests that must be rejected. It does not submit a form or create a provider/database record. It will not send an OTP, inquiry, booking, payment, email, Calendar event or Sheet row.

To check a different permanent origin:

```bash
ASTRO_PRODUCTION_ORIGIN=https://example.com npm run verify:production
```

The value must be one exact HTTPS origin, with no path or trailing slash.

## One-time machine setup

The supported versions are Node 22 and Python 3.12. The release check also needs PostgreSQL server tools and the three Playwright browser engines.

```bash
npm ci
python3.12 -m venv .venv
.venv/bin/python -m pip install --constraint src/backend/requirements-tested.lock --requirement src/backend/requirements-dev.txt
npx playwright install chromium firefox webkit
```

On GitHub Actions, the repository's quality workflow performs this setup and installs PostgreSQL automatically. A missing browser, database tool or test dependency is a failure—not a silent skip.

## Reading the result

Each command ends with `Verification PASSED` or `Verification FAILED` and writes a machine-readable summary under `verification-results/`.

- `fast-latest.json`: fast local groups.
- `release-latest.json`: complete isolated groups.
- `production-latest.json`: official-domain groups.
- `backend-fast.json` and `backend-release.json`: backend counts and skips.
- `browser/browser-summary.json`: each browser script and its duration.
- `browser/`: synthetic screenshots for visual inspection.

These generated files are ignored by Git. CI retains sanitized evidence briefly and ties it to the exact Git commit. Reports say whether the worktree was dirty and whether provider calls were disabled.

## What a pass does and does not mean

| Result | What it proves | What it does not prove |
| --- | --- | --- |
| Fast pass | Source builds and controlled rules pass | PostgreSQL, browsers, hosting or providers |
| Release pass | Full application works with isolated PostgreSQL and simulated providers | The official deployment or real provider acceptance |
| Production pass | Official routes, safe reads, refusals and booking-page reads work now | A real payment, message, Meet link or future uptime |
| Controlled provider evidence | The named real provider action worked once | Continuous provider health or inbox placement forever |
| Backup/alert evidence | The dated operation or alert worked | Every later scheduled run |

Never describe one level as proof of another.

## Visual and accessibility review

The browser suite waits for fonts, scrolls through viewport-triggered animations, returns to the top and then captures the settled page. Automated checks enforce one main heading, usable landmarks, no horizontal overflow, keyboard entry, serious/critical Axe findings, important route content and critical Firefox/WebKit behaviour.

Screenshots still require human judgement. Inspect at least Home, Services, Testimonials, Contact, Booking and the private Appointments view at large-desktop and mobile sizes. Check hierarchy, density, clipping, contrast, reading order, error states and whether the intended content—not merely a blank animation state—was captured.

## Security checks

- Application tests prove anonymous, wrong-session, wrong-origin and wrong-CSRF refusals.
- PostgreSQL tests prove the runtime role can do required work but cannot create roles/databases, change schema or delete protected business history.
- Webhook tests prove signatures and provider/account binding before accepting events.
- The tracked-source scan prints file names and finding types only, never matched values.
- Run the one-time full-history scan with:

```bash
node scripts/check-tracked-secrets.mjs --history
```

Current releases scan the deployable tree. History is audited separately so a resolved inherited incident cannot make every future release permanently red.

## GitHub and release rule

The `Quality certification` workflow runs the complete side-effect-free check on pull requests and pushes to `main` or `design/page-by-page`. It receives no production credentials and has read-only repository permission. A Vercel build and this workflow are separate requirements: one proves packaging/hosting, while the other proves application behaviour.

Do not release when any mandatory group failed, was not run or was unexpectedly skipped. A warning—such as an existing bundle-size or lint warning—must be recorded and reviewed, but it is not silently converted into an error or hidden.

## Human checks that automation cannot honestly replace

These remain small and explicit:

1. Confirm GitHub workflow-failure notifications remain enabled; the recorded backup failure already proves this repository's email route.
2. Keep the second offline backup decryption-key copy.
3. Approve any new real payment, refund, customer message or provider-write exercise.
4. Confirm actual inbox appearance when a materially redesigned real email requires acceptance.

Do not weaken authentication or use real customer data to make these checks easier.
