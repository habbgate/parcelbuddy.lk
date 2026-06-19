import { connectDB } from "@/lib/db";
import ParcelRequest from "@/models/ParcelRequest";
import { ok, fail, handler } from "@/lib/api";
import { requireActiveTraveler } from "@/lib/guard";
import { sendSMS, smsTemplates } from "@/lib/sms";
import { sendEmail, emailTemplates } from "@/lib/email";
import { REQUEST_STATUS } from "@/lib/constants";

// PATCH /api/requests/[id]/transit — traveler marks the parcel in transit.
// Optional step between COLLECTED and DELIVERED.
export const PATCH = handler(async (req, { params }) => {
  const traveler = await requireActiveTraveler();
  await connectDB();

  const doc = await ParcelRequest.findById(params.id);
  if (!doc) return fail("Request not found", 404);
  if (String(doc.matchedTraveler?.userId) !== String(traveler._id)) {
    return fail("You are not assigned to this job", 403);
  }
  if (doc.status !== REQUEST_STATUS.COLLECTED) {
    return fail("Parcel must be collected before it can be in transit", 409);
  }

  doc.status = REQUEST_STATUS.IN_TRANSIT;
  await doc.save();

  await sendSMS(doc.sender.phone, smsTemplates.inTransit(doc.trackingCode));
  if (doc.sender.email) {
    const e = emailTemplates.inTransit(doc.trackingCode);
    await sendEmail(doc.sender.email, e.subject, e.html);
  }

  return ok({ status: doc.status });
});
