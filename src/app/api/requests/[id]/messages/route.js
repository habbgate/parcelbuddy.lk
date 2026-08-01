import { connectDB } from "@/lib/db";
import ParcelRequest from "@/models/ParcelRequest";
import Message from "@/models/Message";
import { getCurrentUser } from "@/lib/guard";
import { ok, fail, handler } from "@/lib/api";
import { messageSchema } from "@/lib/validation";
import { notify } from "@/lib/notifications";
import { NOTIFICATION_TYPES } from "@/lib/constants";

// Resolve who is chatting. Chat is available between the assigned courier
// and the sender — both are always authenticated account holders.
async function resolveParticipant(req, doc) {
  const user = await getCurrentUser();
  if (user) {
    if (String(doc.matchedCourier?.userId) === String(user._id)) {
      return { type: "COURIER", courierId: user._id };
    }
    if (doc.senderUserId && String(doc.senderUserId) === String(user._id)) {
      return { type: "SENDER" };
    }
  }
  return null;
}

// GET /api/requests/[id]/messages
export const GET = handler(async (req, { params }) => {
  await connectDB();
  const doc = await ParcelRequest.findById(params.id);
  if (!doc) return fail("Request not found", 404);

  const who = await resolveParticipant(req, doc);
  if (!who) return fail("Not authorized to view this chat", 403);

  const messages = await Message.find({ requestId: doc._id }).sort({
    createdAt: 1,
  });
  return ok({ messages, me: who.type });
});

// POST /api/requests/[id]/messages
export const POST = handler(async (req, { params }) => {
  await connectDB();
  const doc = await ParcelRequest.findById(params.id);
  if (!doc) return fail("Request not found", 404);

  const who = await resolveParticipant(req, doc);
  if (!who) return fail("Not authorized to post to this chat", 403);

  const body = await req.json();
  const data = messageSchema.parse(body);

  const msg = await Message.create({
    requestId: doc._id,
    senderType: who.type,
    courierId: who.courierId,
    content: data.content,
    imageUrl: data.imageUrl,
  });

  // Notify the courier when the sender writes.
  if (who.type === "SENDER" && doc.matchedCourier?.userId) {
    await notify(doc.matchedCourier.userId, {
      type: NOTIFICATION_TYPES.MESSAGE,
      title: `New message on ${doc.trackingCode}`,
      body: data.content?.slice(0, 80),
      link: `/jobs/${doc._id.toString()}`,
    });
  }
  // Notify the sender when the courier writes.
  if (who.type === "COURIER" && doc.senderUserId) {
    await notify(doc.senderUserId, {
      type: NOTIFICATION_TYPES.MESSAGE,
      title: `New message on ${doc.trackingCode}`,
      body: data.content?.slice(0, 80),
      link: `/track/${doc.trackingCode}`,
    });
  }

  return ok({ message: msg }, 201);
});
