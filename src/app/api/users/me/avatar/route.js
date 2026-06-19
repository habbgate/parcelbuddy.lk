import { ok, fail, handler } from "@/lib/api";
import { requireUser } from "@/lib/guard";

// POST /api/users/me/avatar — save uploaded avatar URL.
export const POST = handler(async (req) => {
  const user = await requireUser();
  const { avatarUrl } = await req.json();
  if (!avatarUrl) return fail("avatarUrl is required", 400);
  user.avatarUrl = avatarUrl;
  await user.save();
  return ok({ avatarUrl });
});
