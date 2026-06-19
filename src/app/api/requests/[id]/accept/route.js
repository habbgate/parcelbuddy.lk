import { connectDB } from "@/lib/db";
import ParcelRequest from "@/models/ParcelRequest";
import { ok, fail, handler } from "@/lib/api";
import { requireActiveTraveler } from "@/lib/guard";
import { sendSMS, smsTemplates } from "@/lib/sms";
import { sendEmail, emailTemplates } from "@/lib/email";
import { REQUEST_STATUS } from "@/lib/constants";

// POST /api/requests/[id]/accept
// Accept an open job. Reveals the sender's phone ONLY in this response,
// ONLY to the traveler who accepted. Uses an atomic update to prevent
// two travelers from accepting the same request.
export const POST = handler(async (req, { params }) => {
  const traveler = await requireActiveTraveler();
  await connectDB();

  // Atomic: only succeeds if still OPEN.
  const doc = await ParcelRequest.findOneAndUpdate(
    { _id: params.id, status: REQUEST_STATUS.OPEN },
    {
      $set: {
        status: REQUEST_STATUS.MATCHED,
        "matchedTraveler.userId": traveler._id,
        "matchedTraveler.acceptedAt": new Date(),
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

  // Notify the sender a traveler accepted (no traveler contact leaked).
  await sendSMS(doc.sender.phone, smsTemplates.accepted(doc.trackingCode));
  if (doc.sender.email) {
    const e = emailTemplates.accepted(doc.trackingCode);
    await sendEmail(doc.sender.email, e.subject, e.html);
  }

  // SMS the traveler the sender's contact details.
  if (traveler.phone) {
    await sendSMS(
      traveler.phone,
      smsTemplates.jobAcceptedTraveler(doc.sender.name, doc.sender.phone)
    );
  }
  if (traveler.email) {
    const e = emailTemplates.jobAcceptedTraveler(
      doc.trackingCode,
      doc.sender.name,
      doc.sender.phone
    );
    await sendEmail(traveler.email, e.subject, e.html);
  }

  // Phone revealed ONLY here, ONLY to the accepting traveler.
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
