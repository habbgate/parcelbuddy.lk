import { connectDB } from "@/lib/db";
import ParcelRequest from "@/models/ParcelRequest";
import { getConfig } from "@/models/Config";
import { ok, fail, handler } from "@/lib/api";
import { completeRequest } from "@/lib/complete";
import { REQUEST_STATUS } from "@/lib/constants";

// POST /api/cron — runs auto-expire and auto-complete.
// Protect with header: Authorization: Bearer <CRON_SECRET>
export const POST = handler(async (req) => {
  const auth = req.headers.get("authorization") || "";
  const token = auth.replace("Bearer ", "");
  if (!process.env.CRON_SECRET || token !== process.env.CRON_SECRET) {
    return fail("Unauthorized", 401);
  }

  await connectDB();
  const config = await getConfig();
  const now = new Date();

  // 1) Auto-expire OPEN requests older than expiry window.
  const expired = await ParcelRequest.updateMany(
    { status: REQUEST_STATUS.OPEN, expiresAt: { $lte: now } },
    { $set: { status: REQUEST_STATUS.EXPIRED } }
  );

  // 2) Auto-complete DELIVERED requests past the confirmation window.
  const cutoff = new Date(now.getTime() - config.autoCompleteHours * 3600 * 1000);
  const toComplete = await ParcelRequest.find({
    status: REQUEST_STATUS.DELIVERED,
    "matchedTraveler.deliveredAt": { $lte: cutoff },
  });

  let completed = 0;
  for (const doc of toComplete) {
    try {
      await completeRequest(doc, { auto: true });
      completed++;
    } catch (e) {
      console.error("[CRON complete]", doc.trackingCode, e.message);
    }
  }

  return ok({
    expired: expired.modifiedCount || 0,
    autoCompleted: completed,
    ranAt: now.toISOString(),
  });
});

// Allow GET for platforms (e.g. Vercel Cron) that issue GET requests.
export const GET = POST;
