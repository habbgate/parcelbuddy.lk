import { connectDB } from "@/lib/db";
import ParcelRequest from "@/models/ParcelRequest";
import { ok, handler } from "@/lib/api";
import { requireAdmin } from "@/lib/guard";

export const dynamic = "force-dynamic";

// GET /api/admin/disputes — dispute queue.
export const GET = handler(async (req) => {
  await requireAdmin();
  await connectDB();
  const { searchParams } = new URL(req.url);
  const status = searchParams.get("status") || "OPEN";

  const docs = await ParcelRequest.find({ "dispute.status": status })
    .sort({ "dispute.createdAt": -1 })
    .limit(100);

  return ok({
    disputes: docs.map((d) => ({
      id: d._id.toString(),
      trackingCode: d.trackingCode,
      route: `${d.route.fromCity} → ${d.route.toCity}`,
      status: d.status,
      dispute: d.dispute,
      rewardLKR: d.rewardLKR,
    })),
  });
});

