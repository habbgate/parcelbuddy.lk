import { connectDB } from "@/lib/db";
import ParcelRequest from "@/models/ParcelRequest";
import User from "@/models/User";
import { getCurrentUser } from "@/lib/guard";
import { ok, fail, handler, firstNameOnly } from "@/lib/api";

export const dynamic = "force-dynamic";

// GET /api/track/[code] — public tracking by code. No phone numbers, ever.
export const GET = handler(async (req, { params }) => {
  await connectDB();
  const doc = await ParcelRequest.findOne({
    trackingCode: params.code?.toUpperCase(),
  });
  if (!doc) return fail("Tracking code not found", 404);

  const pub = doc.toPublicJSON();
  pub.senderName = firstNameOnly(pub.senderName);

  // Flag whether the current viewer is the account-holding sender, so the UI
  // can enable in-app chat and reveal the delivery PIN to them only.
  const viewer = await getCurrentUser();
  pub.isOwner =
    !!viewer && String(doc.senderUserId) === String(viewer._id);
  pub.hasCourier = !!doc.matchedCourier?.userId;
  if (pub.isOwner) {
    pub.deliveryPin = doc.deliveryPin;
  }

  // Attach matched courier's public name (no contact info).
  if (doc.matchedCourier?.userId) {
    const courier = await User.findById(doc.matchedCourier.userId).select(
      "name avatarUrl stats"
    );
    if (courier) {
      pub.courier = {
        name: courier.name,
        avatarUrl: courier.avatarUrl,
        rating: courier.stats?.averageRating || 0,
      };
    }
  }

  return ok({ request: pub });
});
