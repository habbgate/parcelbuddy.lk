import { connectDB } from "@/lib/db";
import Notification from "@/models/Notification";
import { ok, handler } from "@/lib/api";
import { requireUser } from "@/lib/guard";

// PATCH /api/users/me/notifications/[id]/read
export const PATCH = handler(async (req, { params }) => {
  const user = await requireUser();
  await connectDB();
  await Notification.updateOne(
    { _id: params.id, userId: user._id },
    { $set: { readAt: new Date() } }
  );
  return ok({ read: true });
});
