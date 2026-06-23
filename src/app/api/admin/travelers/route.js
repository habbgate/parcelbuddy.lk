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
  const page = Number(searchParams.get("page") || 1);
  const limit = Number(searchParams.get("limit") || 10);
  
  const query = { role: ROLES.TRAVELER };
  if (status) query.status = status;

  const skip = (page - 1) * limit;

  const [users, totalCount] = await Promise.all([
    User.find(query)
      .sort({ createdAt: -1 })
      .skip(skip)
      .limit(limit)
      .select("name email phone status stats wallet idVerification createdAt"),
    User.countDocuments(query),
  ]);

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
    pagination: {
      page,
      limit,
      totalCount,
      totalPages: Math.ceil(totalCount / limit)
    }
  });
});

