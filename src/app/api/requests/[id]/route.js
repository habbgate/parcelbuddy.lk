import { connectDB } from "@/lib/db";
import ParcelRequest from "@/models/ParcelRequest";
import User from "@/models/User";
import { getCurrentUser } from "@/lib/guard";
import { ok, fail, handler, firstNameOnly } from "@/lib/api";

export const dynamic = "force-dynamic";

// GET /api/requests/[id] — detail view.
// Sender phone is included ONLY if the requester is the assigned traveler.
export const GET = handler(async (req, { params }) => {
  await connectDB();
  const doc = await ParcelRequest.findById(params.id);
  if (!doc) return fail("Request not found", 404);

  const user = await getCurrentUser();
  const isAssignedTraveler =
    user && String(doc.matchedTraveler?.userId) === String(user._id);

  const pub = doc.toPublicJSON();

  // Whether the sender posted while logged in (has an account). Chat is only
  // available between the traveler and an account-holding sender.
  pub.senderHasAccount = !!doc.senderUserId;

  if (isAssignedTraveler) {
    // Reveal full sender contact to the matched traveler.
    pub.sender = { name: doc.sender.name, phone: doc.sender.phone };
    pub.isMine = true;
  } else {
    pub.senderName = firstNameOnly(pub.senderName);
  }

  if (doc.matchedTraveler?.userId) {
    const t = await User.findById(doc.matchedTraveler.userId).select(
      "name avatarUrl stats"
    );
    if (t) {
      pub.traveler = {
        id: t._id.toString(),
        name: t.name,
        avatarUrl: t.avatarUrl,
        rating: t.stats?.averageRating || 0,
      };
    }
  }

  return ok({ request: pub });
});
