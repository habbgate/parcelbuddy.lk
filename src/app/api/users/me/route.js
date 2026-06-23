import { connectDB } from "@/lib/db";
import { ok, handler } from "@/lib/api";
import { requireUser } from "@/lib/guard";
import { updateProfileSchema } from "@/lib/validation";

function serialize(u) {
  return {
    id: u._id.toString(),
    name: u.name,
    email: u.email,
    phone: u.phone,
    phoneVerified: u.phoneVerified,
    avatarUrl: u.avatarUrl,
    bio: u.bio,
    role: u.role,
    status: u.status,
    stats: u.stats,
    wallet: u.wallet,
    isAvailable: u.isAvailable,
    routeAlerts: u.routeAlerts,
    idVerification: u.idVerification
      ? { status: u.idVerification.status, rejectionReason: u.idVerification.rejectionReason }
      : null,
  };
}

export const dynamic = "force-dynamic";

// GET /api/users/me
export const GET = handler(async () => {
  const user = await requireUser();
  return ok({ user: serialize(user) });
});

// PUT /api/users/me — update profile fields.
export const PUT = handler(async (req) => {
  const user = await requireUser();
  const body = await req.json();
  const data = updateProfileSchema.parse(body);

  await connectDB();
  if (data.name !== undefined) user.name = data.name;
  if (data.bio !== undefined) user.bio = data.bio;
  if (data.phone !== undefined) user.phone = data.phone;
  if (data.isAvailable !== undefined) user.isAvailable = data.isAvailable;
  await user.save();

  return ok({ user: serialize(user) });
});

