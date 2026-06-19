import { connectDB } from "@/lib/db";
import ParcelRequest from "@/models/ParcelRequest";
import { ok, handler, firstNameOnly } from "@/lib/api";

// GET /api/users/[id]/reviews — reviews left for a traveler.
export const GET = handler(async (req, { params }) => {
  await connectDB();
  const docs = await ParcelRequest.find({
    "matchedTraveler.userId": params.id,
    "review.rating": { $exists: true },
  })
    .sort({ "review.createdAt": -1 })
    .limit(50)
    .select("review sender route trackingCode");

  const reviews = docs.map((d) => ({
    rating: d.review.rating,
    comment: d.review.comment,
    createdAt: d.review.createdAt,
    by: firstNameOnly(d.sender.name),
    route: `${d.route.fromCity} → ${d.route.toCity}`,
  }));

  return ok({ reviews });
});
