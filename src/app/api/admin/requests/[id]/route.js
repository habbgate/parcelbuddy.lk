import { connectDB } from "@/lib/db";
import ParcelRequest from "@/models/ParcelRequest";
import { ok, fail, handler } from "@/lib/api";
import { requireAdmin } from "@/lib/guard";
import { REQUEST_STATUS } from "@/lib/constants";

// PATCH /api/admin/requests/[id] — admin override (status, cancel, etc.)
export const PATCH = handler(async (req, { params }) => {
  await requireAdmin();
  const body = await req.json();
  await connectDB();

  const doc = await ParcelRequest.findById(params.id);
  if (!doc) return fail("Request not found", 404);

  if (body.status && Object.values(REQUEST_STATUS).includes(body.status)) {
    doc.status = body.status;
  }
  if (typeof body.rewardLKR === "number") doc.rewardLKR = body.rewardLKR;
  await doc.save();

  return ok({ request: doc.toPublicJSON() });
});
