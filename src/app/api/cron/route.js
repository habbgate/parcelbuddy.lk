import { connectDB } from "@/lib/db";
import ParcelRequest from "@/models/ParcelRequest";
import { ok, fail, handler } from "@/lib/api";
import { REQUEST_STATUS } from "@/lib/constants";

// POST /api/cron — auto-expires stale OPEN requests.
// Protect with header: Authorization: Bearer <CRON_SECRET>
export const POST = handler(async (req) => {
  const auth = req.headers.get("authorization") || "";
  const token = auth.replace("Bearer ", "");
  if (!process.env.CRON_SECRET || token !== process.env.CRON_SECRET) {
    return fail("Unauthorized", 401);
  }

  await connectDB();
  const now = new Date();

  // Auto-expire OPEN requests older than the expiry window.
  const expired = await ParcelRequest.updateMany(
    { status: REQUEST_STATUS.OPEN, expiresAt: { $lte: now } },
    { $set: { status: REQUEST_STATUS.EXPIRED } }
  );

  return ok({
    expired: expired.modifiedCount || 0,
    ranAt: now.toISOString(),
  });
});

// Allow GET for platforms (e.g. Vercel Cron) that issue GET requests.
export const GET = POST;

