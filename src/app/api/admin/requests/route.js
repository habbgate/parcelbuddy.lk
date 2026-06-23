import { connectDB } from "@/lib/db";
import ParcelRequest from "@/models/ParcelRequest";
import { ok, handler } from "@/lib/api";
import { requireAdmin } from "@/lib/guard";

export const dynamic = "force-dynamic";

// GET /api/admin/requests — all parcel requests (admin sees everything,
// including sender contact for support purposes).
export const GET = handler(async (req) => {
  await requireAdmin();
  await connectDB();
  const { searchParams } = new URL(req.url);
  const status = searchParams.get("status");
  const query = status ? { status } : {};

  const docs = await ParcelRequest.find(query)
    .sort({ createdAt: -1 })
    .limit(200);

  return ok({
    requests: docs.map((d) => ({
      id: d._id.toString(),
      trackingCode: d.trackingCode,
      status: d.status,
      route: d.route,
      rewardLKR: d.rewardLKR,
      sender: { name: d.sender.name, phone: d.sender.phone },
      createdAt: d.createdAt,
      dispute: d.dispute?.open || false,
    })),
  });
});

