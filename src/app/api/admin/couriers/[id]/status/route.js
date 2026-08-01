import { connectDB } from "@/lib/db";
import User from "@/models/User";
import { ok, fail, handler } from "@/lib/api";
import { requireAdmin } from "@/lib/guard";
import { USER_STATUS } from "@/lib/constants";

// PATCH /api/admin/couriers/[id]/status — suspend / ban / reactivate.
export const PATCH = handler(async (req, { params }) => {
  await requireAdmin();
  const { status } = await req.json();
  if (!Object.values(USER_STATUS).includes(status)) {
    return fail("Invalid status", 400);
  }
  await connectDB();
  const user = await User.findById(params.id);
  if (!user) return fail("Courier not found", 404);
  user.status = status;
  await user.save();
  return ok({ status: user.status });
});
