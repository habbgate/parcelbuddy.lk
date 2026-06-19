import { connectDB } from "@/lib/db";
import ParcelRequest from "@/models/ParcelRequest";
import { ok, fail, handler } from "@/lib/api";
import { requireAdmin } from "@/lib/guard";

// POST /api/admin/disputes/[id]/resolve — Body: { resolution, status }
export const POST = handler(async (req, { params }) => {
  await requireAdmin();
  const { resolution, status = "RESOLVED" } = await req.json();
  if (!resolution) return fail("A resolution note is required", 400);

  await connectDB();
  const doc = await ParcelRequest.findById(params.id);
  if (!doc || !doc.dispute?.open) return fail("No open dispute found", 404);

  doc.dispute.open = false;
  doc.dispute.status = status;
  doc.dispute.resolution = resolution;
  doc.dispute.resolvedAt = new Date();
  await doc.save();

  return ok({ dispute: doc.dispute });
});
