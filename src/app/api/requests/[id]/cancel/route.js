import { connectDB } from "@/lib/db";
import ParcelRequest from "@/models/ParcelRequest";
import { ok, fail, handler } from "@/lib/api";
import { requireActiveTraveler } from "@/lib/guard";
import { REQUEST_STATUS } from "@/lib/constants";

// POST /api/requests/[id]/cancel — traveler cancels before collection.
// Returns the job to OPEN so other travelers can pick it up.
export const POST = handler(async (req, { params }) => {
  const traveler = await requireActiveTraveler();
  await connectDB();

  const doc = await ParcelRequest.findById(params.id);
  if (!doc) return fail("Request not found", 404);
  if (String(doc.matchedTraveler?.userId) !== String(traveler._id)) {
    return fail("You are not assigned to this job", 403);
  }
  if (doc.status !== REQUEST_STATUS.MATCHED) {
    return fail("You can only cancel before the parcel is collected", 409);
  }

  doc.status = REQUEST_STATUS.OPEN;
  doc.matchedTraveler = undefined;
  await doc.save();

  return ok({ status: doc.status });
});
