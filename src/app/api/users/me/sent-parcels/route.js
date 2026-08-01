import { connectDB } from "@/lib/db";
import ParcelRequest from "@/models/ParcelRequest";
import { ok, handler } from "@/lib/api";
import { requireUser } from "@/lib/guard";

export const dynamic = "force-dynamic";

// GET /api/users/me/sent-parcels — parcels this user posted as a sender.
export const GET = handler(async () => {
  const user = await requireUser();
  await connectDB();

  const docs = await ParcelRequest.find({ senderUserId: user._id }).sort({
    createdAt: -1,
  });

  const parcels = docs.map((d) => {
    const j = d.toPublicJSON();
    // It's their own parcel, so their own phone and delivery PIN are fine to return.
    j.sender = { name: d.sender.name, phone: d.sender.phone };
    j.deliveryPin = d.deliveryPin;
    return j;
  });

  return ok({ parcels });
});

