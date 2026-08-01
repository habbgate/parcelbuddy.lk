import { connectDB } from "@/lib/db";
import ParcelRequest from "@/models/ParcelRequest";
import { ok, handler } from "@/lib/api";
import { requireUser } from "@/lib/guard";
import { REQUEST_STATUS } from "@/lib/constants";

export const dynamic = "force-dynamic";

// GET /api/users/me/jobs — the courier's deliveries (active + history).
export const GET = handler(async (req) => {
  const user = await requireUser();
  await connectDB();

  const docs = await ParcelRequest.find({
    "matchedCourier.userId": user._id,
  }).sort({ updatedAt: -1 });

  const activeStatuses = [
    REQUEST_STATUS.MATCHED,
    REQUEST_STATUS.COLLECTED,
    REQUEST_STATUS.IN_TRANSIT,
  ];

  const jobs = docs.map((d) => {
    const j = d.toPublicJSON();
    // The assigned courier sees full sender contact.
    j.sender = { name: d.sender.name, phone: d.sender.phone };
    return j;
  });

  const active = jobs.find((j) => activeStatuses.includes(j.status)) || null;
  const actives = jobs.filter((j) => activeStatuses.includes(j.status));
  return ok({ jobs, active, actives });
});

