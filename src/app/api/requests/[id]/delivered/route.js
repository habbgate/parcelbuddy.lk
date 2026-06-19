import { connectDB } from "@/lib/db";
import ParcelRequest from "@/models/ParcelRequest";
import { ok, fail, handler } from "@/lib/api";
import { requireActiveTraveler } from "@/lib/guard";
import { sendSMS, smsTemplates } from "@/lib/sms";
import { sendEmail, emailTemplates } from "@/lib/email";
import { REQUEST_STATUS } from "@/lib/constants";

// PATCH /api/requests/[id]/delivered — traveler marks delivered.
// Triggers the SMS to the sender with their confirmation link.
export const PATCH = handler(async (req, { params }) => {
  const traveler = await requireActiveTraveler();
  await connectDB();

  const doc = await ParcelRequest.findById(params.id);
  if (!doc) return fail("Request not found", 404);
  if (String(doc.matchedTraveler?.userId) !== String(traveler._id)) {
    return fail("You are not assigned to this job", 403);
  }
  if (
    doc.status !== REQUEST_STATUS.COLLECTED &&
    doc.status !== REQUEST_STATUS.IN_TRANSIT
  ) {
    return fail("Parcel must be collected before delivery", 409);
  }

  doc.status = REQUEST_STATUS.DELIVERED;
  doc.matchedTraveler.deliveredAt = new Date();
  await doc.save();

  // SMS sender the confirmation link with their token.
  await sendSMS(
    doc.sender.phone,
    smsTemplates.delivered(doc.trackingCode, doc.senderConfirmToken)
  );
  if (doc.sender.email) {
    const e = emailTemplates.delivered(doc.trackingCode, doc.senderConfirmToken);
    await sendEmail(doc.sender.email, e.subject, e.html);
  }

  return ok({ status: doc.status });
});
