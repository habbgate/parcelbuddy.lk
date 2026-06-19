import { connectDB } from "@/lib/db";
import ParcelRequest from "@/models/ParcelRequest";
import User from "@/models/User";
import { ok, fail, handler } from "@/lib/api";
import { reviewSchema } from "@/lib/validation";
import { REQUEST_STATUS } from "@/lib/constants";

// POST /api/requests/[id]/review — submit a review after completion.
// Open to the guest sender (the public tracking flow) once COMPLETED.
export const POST = handler(async (req, { params }) => {
  const body = await req.json();
  const data = reviewSchema.parse(body);

  await connectDB();
  const doc = await ParcelRequest.findById(params.id);
  if (!doc) return fail("Request not found", 404);
  if (doc.status !== REQUEST_STATUS.COMPLETED) {
    return fail("You can only review a completed delivery", 409);
  }
  if (doc.review?.rating) return fail("A review has already been submitted", 409);

  doc.review = {
    rating: data.rating,
    comment: data.comment,
    createdAt: new Date(),
  };
  await doc.save();

  // Recompute the traveler's running average rating.
  const travelerId = doc.matchedTraveler?.userId;
  if (travelerId) {
    const traveler = await User.findById(travelerId);
    if (traveler) {
      const count = traveler.stats.reviewCount || 0;
      const total = (traveler.stats.averageRating || 0) * count + data.rating;
      traveler.stats.reviewCount = count + 1;
      traveler.stats.averageRating =
        Math.round((total / (count + 1)) * 10) / 10;
      await traveler.save();
    }
  }

  return ok({ review: doc.review });
});
