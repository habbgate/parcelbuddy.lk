import { connectDB } from "@/lib/db";
import Notification from "@/models/Notification";
import { ok, handler } from "@/lib/api";
import { requireUser } from "@/lib/guard";

export const dynamic = "force-dynamic";

// GET /api/users/me/notifications
export const GET = handler(async () => {
  const user = await requireUser();
  await connectDB();
  const notifications = await Notification.find({ userId: user._id })
    .sort({ createdAt: -1 })
    .limit(50);
  const unread = await Notification.countDocuments({
    userId: user._id,
    readAt: null,
  });
  return ok({ notifications, unread });
});
