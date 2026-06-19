import { connectDB } from "@/lib/db";
import User from "@/models/User";
import { ok, fail, handler } from "@/lib/api";

// GET /api/users/[id]/profile — public traveler profile.
export const GET = handler(async (req, { params }) => {
  await connectDB();
  const user = await User.findById(params.id);
  if (!user) return fail("Profile not found", 404);
  return ok({ profile: user.toPublicProfile() });
});
