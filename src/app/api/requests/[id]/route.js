import { connectDB } from "@/lib/db";
import ParcelRequest from "@/models/ParcelRequest";
import User from "@/models/User";
import { getCurrentUser } from "@/lib/guard";
import { ok, fail, handler, firstNameOnly } from "@/lib/api";

export const dynamic = "force-dynamic";

// GET /api/requests/[id] — detail view.
// Sender phone is included ONLY if the requester is the assigned courier.
// The delivery PIN is included ONLY if the requester is the owning sender.
export const GET = handler(async (req, { params }) => {
  await connectDB();
  const doc = await ParcelRequest.findById(params.id);
  if (!doc) return fail("Request not found", 404);

  const user = await getCurrentUser();
  const isAssignedCourier =
    user && String(doc.matchedCourier?.userId) === String(user._id);
  const isOwner = user && String(doc.senderUserId) === String(user._id);

  const pub = doc.toPublicJSON();

  if (isAssignedCourier) {
    // Reveal full sender contact to the matched courier.
    pub.sender = { name: doc.sender.name, phone: doc.sender.phone };
    pub.isMine = true;
  } else {
    pub.senderName = firstNameOnly(pub.senderName);
  }

  if (isOwner) {
    pub.deliveryPin = doc.deliveryPin;
    pub.isOwner = true;
  }

  if (doc.matchedCourier?.userId) {
    const t = await User.findById(doc.matchedCourier.userId).select(
      "name avatarUrl stats"
    );
    if (t) {
      pub.courier = {
        id: t._id.toString(),
        name: t.name,
        avatarUrl: t.avatarUrl,
        rating: t.stats?.averageRating || 0,
      };
    }
  }

  return ok({ request: pub });
});
