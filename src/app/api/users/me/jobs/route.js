import { connectDB } from "@/lib/db";
import ParcelRequest from "@/models/ParcelRequest";
import { ok, handler } from "@/lib/api";
import { requireUser } from "@/lib/guard";
import { REQUEST_STATUS } from "@/lib/constants";

export const dynamic = "force-dynamic";

// GET /api/users/me/jobs — the traveler's jobs (active + history).
export const GET = handler(async (req) => {
  const user = await requireUser();
  await connectDB();

  const docs = await ParcelRequest.find({
    "matchedTraveler.userId": user._id,
  }).sort({ updatedAt: -1 });

  const activeStatuses = [
    REQUEST_STATUS.MATCHED,
    REQUEST_STATUS.COLLECTED,
    REQUEST_STATUS.IN_TRANSIT,
    REQUEST_STATUS.DELIVERED,
  ];

  const jobs = docs.map((d) => {
    const j = d.toPublicJSON();
    // The assigned traveler sees full sender contact.
    j.sender = { name: d.sender.name, phone: d.sender.phone };
    j.payoutLKR = Math.round(
      d.rewardLKR * (1 - (d.commissionPercent || 10) / 100)
    );
    return j;
  });

  const active = jobs.find((j) => activeStatuses.includes(j.status)) || null;
  const actives = jobs.filter((j) => activeStatuses.includes(j.status));
  return ok({ jobs, active, actives });
});

