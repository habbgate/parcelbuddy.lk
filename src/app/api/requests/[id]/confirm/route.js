import { connectDB } from "@/lib/db";
import ParcelRequest from "@/models/ParcelRequest";
import { ok, fail, handler } from "@/lib/api";
import { completeRequest } from "@/lib/complete";
import { REQUEST_STATUS } from "@/lib/constants";

// POST /api/requests/[id]/confirm — guest sender confirms delivery via token.
// Body: { token }. The id can be the Mongo id or the tracking code.
export const POST = handler(async (req, { params }) => {
  const { token } = await req.json();
  if (!token) return fail("Confirmation token required", 400);

  await connectDB();

  const orFilters = [{ trackingCode: params.id?.toUpperCase() }];
  if (params.id?.match(/^[0-9a-fA-F]{24}$/)) orFilters.push({ _id: params.id });

  const doc = await ParcelRequest.findOne({ $or: orFilters });
  if (!doc) return fail("Request not found", 404);

  if (doc.senderConfirmToken !== token) {
    return fail("Invalid confirmation link", 403);
  }

  if (doc.status === REQUEST_STATUS.COMPLETED) {
    return ok({ alreadyConfirmed: true, status: doc.status });
  }
  if (doc.status !== REQUEST_STATUS.DELIVERED) {
    return fail("This parcel has not been marked delivered yet", 409);
  }

  await completeRequest(doc);
  return ok({ status: doc.status });
});
