import { connectDB } from "@/lib/db";
import User from "@/models/User";
import { ok, fail, handler } from "@/lib/api";
import { requireAdmin } from "@/lib/guard";

export const dynamic = "force-dynamic";

// GET /api/admin/verifications/[id] — full review detail with document URLs.
export const GET = handler(async (req, { params }) => {
  await requireAdmin();
  await connectDB();
  const u = await User.findById(params.id).select(
    "name email phone bio idVerification stats createdAt"
  );
  if (!u) return fail("Courier not found", 404);
  return ok({
    courier: {
      id: u._id.toString(),
      name: u.name,
      email: u.email,
      phone: u.phone,
      bio: u.bio,
      stats: u.stats,
      memberSince: u.createdAt,
      idVerification: u.idVerification,
    },
  });
});
