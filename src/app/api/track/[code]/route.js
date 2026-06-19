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
  // can enable in-app chat for them without exposing this to anyone else.
  const viewer = await getCurrentUser();
  pub.isOwner =
    !!viewer && String(doc.senderUserId) === String(viewer._id);
  pub.hasTraveler = !!doc.matchedTraveler?.userId;

  // Attach matched traveler's public name (no contact info).
  if (doc.matchedTraveler?.userId) {
    const traveler = await User.findById(doc.matchedTraveler.userId).select(
      "name avatarUrl stats"
    );
    if (traveler) {
      pub.traveler = {
        name: traveler.name,
        avatarUrl: traveler.avatarUrl,
        rating: traveler.stats?.averageRating || 0,
      };
    }
  }

  return ok({ request: pub });
});
