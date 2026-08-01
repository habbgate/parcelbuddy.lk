import { connectDB } from "@/lib/db";
import ParcelRequest from "@/models/ParcelRequest";
import User from "@/models/User";
import { ok, fail, handler } from "@/lib/api";
import { reviewSchema } from "@/lib/validation";
import { REQUEST_STATUS } from "@/lib/constants";

// POST /api/requests/[id]/review — submit a review once delivered.
// Open to the account-holding sender via the tracking page.
export const POST = handler(async (req, { params }) => {
  const body = await req.json();
  const data = reviewSchema.parse(body);

  await connectDB();
  const doc = await ParcelRequest.findById(params.id);
  if (!doc) return fail("Request not found", 404);
  if (doc.status !== REQUEST_STATUS.DELIVERED) {
    return fail("You can only review a delivered parcel", 409);
  }
  if (doc.review?.rating) return fail("A review has already been submitted", 409);

  doc.review = {
    rating: data.rating,
    comment: data.comment,
    createdAt: new Date(),
  };
  await doc.save();

  // Recompute the courier's running average rating.
  const courierId = doc.matchedCourier?.userId;
  if (courierId) {
    const courier = await User.findById(courierId);
    if (courier) {
      const count = courier.stats.reviewCount || 0;
      const total = (courier.stats.averageRating || 0) * count + data.rating;
      courier.stats.reviewCount = count + 1;
      courier.stats.averageRating =
        Math.round((total / (count + 1)) * 10) / 10;
      await courier.save();
    }
  }

  return ok({ review: doc.review });
});
