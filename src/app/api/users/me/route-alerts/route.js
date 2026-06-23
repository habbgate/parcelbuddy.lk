import { connectDB } from "@/lib/db";
import { ok, fail, handler } from "@/lib/api";
import { requireUser } from "@/lib/guard";
import { routeAlertSchema } from "@/lib/validation";

export const dynamic = "force-dynamic";

// GET /api/users/me/route-alerts
export const GET = handler(async () => {
  const user = await requireUser();
  return ok({ routeAlerts: user.routeAlerts });
});

// POST /api/users/me/route-alerts — add a saved route alert.
export const POST = handler(async (req) => {
  const user = await requireUser();
  const body = await req.json();
  const data = routeAlertSchema.parse(body);

  await connectDB();
  const exists = user.routeAlerts.find(
    (a) => a.fromCity === data.fromCity && a.toCity === data.toCity
  );
  if (exists) {
    exists.active = true;
  } else {
    user.routeAlerts.push({ ...data, active: true });
  }
  await user.save();
  return ok({ routeAlerts: user.routeAlerts });
});

// DELETE /api/users/me/route-alerts?id=... — remove an alert.
export const DELETE = handler(async (req) => {
  const user = await requireUser();
  const { searchParams } = new URL(req.url);
  const id = searchParams.get("id");
  if (!id) return fail("Alert id required", 400);
  await connectDB();
  user.routeAlerts = user.routeAlerts.filter((a) => String(a._id) !== id);
  await user.save();
  return ok({ routeAlerts: user.routeAlerts });
});

