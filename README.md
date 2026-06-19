# ParcelBuddy 📦

**Travel. Deliver. Earn.** A community parcel delivery platform connecting people who need to send parcels with verified travelers heading the same way across Sri Lanka.

## Concept

- **Senders** — no registration. Post a parcel request (route + item + reward in LKR) publicly.
- **Travelers** — register and verify identity (NIC/Passport) before accepting jobs and earning.

**Phone privacy is core:** a sender's phone is *never* returned in any public API response. It is revealed only to the single verified traveler who accepts that request.

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
| Traveler | `traveler@parcelbuddy.lk`   | `traveler1234`  |

> SMS, Google OAuth and S3 are optional in dev. Without API keys, SMS messages
> (OTPs, confirm links, etc.) are **printed to the server console** so the full
> flow works end-to-end.

## Key flows

1. **Send** `/send` → 3-step wizard → `/send/success` (tracking code `PB-XXXX`).
2. **Track** `/track/[code]` → public status, no phone shown, confirm via SMS token.
3. **Browse** `/parcels` → filters → `/parcels/[id]` → accept (reveals phone to that traveler only).
4. **Deliver** `/dashboard` & `/jobs/[id]` → mark collected/delivered, chat, get paid 90%.
5. **Verify** `/verify-identity` → admin reviews at `/admin/verifications`.

## Business rules implemented

- Tracking codes `PB-XXXX` (ambiguous chars 0/O/I/1/L excluded).
- Status flow `OPEN → MATCHED → COLLECTED → (IN_TRANSIT) → DELIVERED → COMPLETED`.
- Verification gate — `PENDING_VERIFICATION` travelers can browse but not accept.
- Auto-expire OPEN requests after 14 days; auto-complete DELIVERED after 48h.
- 10% configurable platform commission; traveler earns 90%.
- Route alerts, suggested reward (median of last 20 completed on the route), WhatsApp share.

## Background jobs

```bash
npm run cron      # runs auto-expire + auto-complete (schedule hourly)
npm run socket    # optional Socket.io server for realtime chat (set NEXT_PUBLIC_SOCKET_URL)
```

For production, point a scheduler (cron, Vercel Cron, etc.) at `POST /api/cron`
with header `Authorization: Bearer $CRON_SECRET`.

## Project structure

```
src/
  app/            App Router pages + /api route handlers
  components/     Reusable UI (Navbar, ParcelCard, StatusTracker, ChatPanel, ...)
  lib/            db, auth, guards, sms, wallet, tracking, validation, queries
  models/         Mongoose models (User, ParcelRequest, Message, Notification, ...)
scripts/          seed + cron runners
socket-server.mjs Standalone realtime server
```

## Environment variables

See `.env`. The MongoDB URI is pre-filled. Add `NOTIFY_LK_*`, `GOOGLE_*`, and
`AWS_*` keys to enable SMS, Google login, and file uploads respectively.
