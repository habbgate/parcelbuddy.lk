import { connectDB } from "@/lib/db";
import User from "@/models/User";
import { ok, handler } from "@/lib/api";
import { requireAdmin } from "@/lib/guard";
import { ROLES } from "@/lib/constants";

export const dynamic = "force-dynamic";

// GET /api/admin/travelers — all traveler accounts.
export const GET = handler(async (req) => {
  await requireAdmin();
  await connectDB();
  const { searchParams } = new URL(req.url);
  const status = searchParams.get("status");
  const query = { role: ROLES.TRAVELER };
  if (status) query.status = status;

  const users = await User.find(query)
    .sort({ createdAt: -1 })
    .limit(200)
    .select("name email phone status stats wallet idVerification createdAt");

  return ok({
    travelers: users.map((u) => ({
      id: u._id.toString(),
      name: u.name,
      email: u.email,
      phone: u.phone,
      status: u.status,
      idStatus: u.idVerification?.status || "NONE",
      totalDeliveries: u.stats?.totalDeliveries || 0,
      averageRating: u.stats?.averageRating || 0,
      walletBalance: u.wallet?.balance || 0,
      createdAt: u.createdAt,
    })),
  });
});

