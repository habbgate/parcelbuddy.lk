# ParcelBuddy 📦

**Travel. Deliver. Earn.** A community parcel delivery platform connecting people who need to send parcels with verified couriers heading the same way across Sri Lanka.

## Concept

- Every user registers a single account that can both **send** parcels and **deliver as a courier** — no separate account types.
- **Couriers** verify identity (NIC/Passport) before accepting jobs and earning.
- Delivery is confirmed Uber-style: the sender gets a 4-digit delivery PIN, the recipient shares it with the courier, and the courier enters it to mark the parcel delivered.
- Payment Method: Cash, arranged directly between sender and courier. No platform fee, commission, or online payment processing.

**Phone privacy is core:** a sender's phone is *never* returned in any public API response. It is revealed only to the single verified courier who accepts that request.

## Tech Stack

- **Next.js 14** (App Router) · **MongoDB / Mongoose** · **Tailwind CSS**
- **NextAuth.js** (Credentials + Google) · **Zod** validation · **Zustand**-ready
- **Socket.io** chat (with polling fallback) · **Notify.lk** SMS · **AWS S3 / R2** uploads
- **PWA** (manifest + service worker)

## Getting started

```bash
npm install
# Configure .env (already scaffolded with the provided MONGODB_URI)
npm run seed      # creates admin + sample data (Node 18+/22 with --env-file)
npm run dev       # http://localhost:3000
```

### Seeded accounts

| Role     | Email                       | Password        |
|----------|-----------------------------|-----------------|
| Admin    | `admin@parcelbuddy.lk`      | `admin1234`     |
| Courier  | `courier@parcelbuddy.lk`    | `courier1234`   |

> SMS, Google OAuth and S3 are optional in dev. Without API keys, SMS messages
> (OTPs, delivery PINs, etc.) are **printed to the server console** so the full
> flow works end-to-end.

## Key flows

1. **Send** `/send` (requires login) → 3-step wizard → `/send/success` (tracking code `PB-XXXX` + 4-digit delivery PIN).
2. **Track** `/track/[code]` → public status, no phone shown; the sender sees their PIN until it's delivered.
3. **Browse** `/parcels` → filters → `/parcels/[id]` → accept (reveals phone to that courier only).
4. **Deliver** `/dashboard` & `/jobs/[id]` → mark collected/in transit, chat, enter the delivery PIN to complete and get paid in cash.
5. **Verify** `/verify-identity` → admin reviews at `/admin/verifications`.

## Business rules implemented

- Tracking codes `PB-XXXX` (ambiguous chars 0/O/I/1/L excluded).
- Status flow `OPEN → MATCHED → COLLECTED → (IN_TRANSIT) → DELIVERED` (terminal — reached only via correct PIN entry).
- Verification gate — `PENDING_VERIFICATION` couriers can browse but not accept.
- Auto-expire OPEN requests after 14 days.
- Payment Method: Cash. No platform fee, commission, or online payment processing.
- Route alerts, suggested reward (median of last 20 delivered on the route), WhatsApp share.

## Background jobs

```bash
npm run cron      # runs auto-expire (schedule hourly)
npm run socket    # optional Socket.io server for realtime chat (set NEXT_PUBLIC_SOCKET_URL)
```

For production, point a scheduler (cron, Vercel Cron, etc.) at `POST /api/cron`
with header `Authorization: Bearer $CRON_SECRET`.

## Project structure

```
src/
  app/            App Router pages + /api route handlers
  components/     Reusable UI (Navbar, ParcelCard, StatusTracker, ChatPanel, ...)
  lib/            db, auth, guards, sms, delivery, tracking, validation, queries
  models/         Mongoose models (User, ParcelRequest, Message, Notification, ...)
scripts/          seed + cron runners
socket-server.mjs Standalone realtime server
```

## Environment variables

See `.env`. The MongoDB URI is pre-filled. Add `NOTIFY_LK_*`, `GOOGLE_*`, and
`AWS_*` keys to enable SMS, Google login, and file uploads respectively.
