import { connectDB } from "@/lib/db";
import ParcelRequest from "@/models/ParcelRequest";
import { ok, fail, handler } from "@/lib/api";
import { requireActiveCourier } from "@/lib/guard";
import { sendSMS, smsTemplates } from "@/lib/sms";
import { sendEmail, emailTemplates } from "@/lib/email";
import { notify } from "@/lib/notifications";
import { NOTIFICATION_TYPES, REQUEST_STATUS } from "@/lib/constants";

// POST /api/requests/[id]/accept
// Accept an open job. Reveals the sender's phone ONLY in this response,
// ONLY to the courier who accepted. Uses an atomic update to prevent
// two couriers from accepting the same request.
export const POST = handler(async (req, { params }) => {
  const courier = await requireActiveCourier();
  await connectDB();

  // Atomic: only succeeds if still OPEN.
  const doc = await ParcelRequest.findOneAndUpdate(
    { _id: params.id, status: REQUEST_STATUS.OPEN },
    {
      $set: {
        status: REQUEST_STATUS.MATCHED,
        "matchedCourier.userId": courier._id,
        "matchedCourier.acceptedAt": new Date(),
      },
    },
    { new: true }
  );

  if (!doc) {
    // Either it doesn't exist or it was already taken.
    const exists = await ParcelRequest.findById(params.id).select("status");
    if (!exists) return fail("Request not found", 404);
    return fail("This job is no longer available", 409);
  }

  // Notify the sender a courier accepted (no courier contact leaked here).
  await sendSMS(doc.sender.phone, smsTemplates.accepted(doc.trackingCode));
  if (doc.sender.email) {
    const e = emailTemplates.accepted(doc.trackingCode);
    await sendEmail(doc.sender.email, e.subject, e.html);
  }
  if (doc.senderUserId) {
    await notify(doc.senderUserId, {
      type: NOTIFICATION_TYPES.COURIER_ACCEPTED,
      title: `Courier accepted: ${doc.trackingCode}`,
      body: `A verified courier accepted your request and will contact you shortly.`,
      link: `/track/${doc.trackingCode}`,
    });
  }

  // SMS the courier the sender's contact details.
  if (courier.phone) {
    await sendSMS(
      courier.phone,
      smsTemplates.jobAcceptedCourier(doc.sender.name, doc.sender.phone)
    );
  }
  if (courier.email) {
    const e = emailTemplates.jobAcceptedCourier(
      doc.trackingCode,
      doc.sender.name,
      doc.sender.phone
    );
    await sendEmail(courier.email, e.subject, e.html);
  }

  // Phone revealed ONLY here, ONLY to the accepting courier.
  return ok({
    request: {
      id: doc._id.toString(),
      trackingCode: doc.trackingCode,
      status: doc.status,
      route: doc.route,
      parcel: doc.parcel,
      rewardLKR: doc.rewardLKR,
    },
    sender: {
      name: doc.sender.name,
      phone: doc.sender.phone, // ← revealed
    },
  });
});
