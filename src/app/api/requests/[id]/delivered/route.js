import { connectDB } from "@/lib/db";
import ParcelRequest from "@/models/ParcelRequest";
import { ok, fail, handler } from "@/lib/api";
import { requireActiveCourier } from "@/lib/guard";
import { verifyPinSchema } from "@/lib/validation";
import { verifyDeliveryPin } from "@/lib/delivery";
import { sendSMS, smsTemplates } from "@/lib/sms";
import { sendEmail, emailTemplates } from "@/lib/email";

// PATCH /api/requests/[id]/delivered — courier enters the 4-digit delivery
// PIN given to them by the recipient. Correct PIN marks the parcel DELIVERED
// (terminal state) and credits the courier's cash earnings. Wrong PIN leaves
// the status untouched and returns an error.
export const PATCH = handler(async (req, { params }) => {
  const courier = await requireActiveCourier();
  const body = await req.json();
  const { pin } = verifyPinSchema.parse(body);

  await connectDB();

  const doc = await ParcelRequest.findById(params.id);
  if (!doc) return fail("Request not found", 404);
  if (String(doc.matchedCourier?.userId) !== String(courier._id)) {
    return fail("You are not assigned to this job", 403);
  }

  await verifyDeliveryPin(doc, courier, pin);

  await sendSMS(doc.sender.phone, smsTemplates.delivered(doc.trackingCode));
  if (doc.sender.email) {
    const e = emailTemplates.delivered(doc.trackingCode);
    await sendEmail(doc.sender.email, e.subject, e.html);
  }

  return ok({ status: doc.status });
});
