import { connectDB } from "@/lib/db";
import { getConfig } from "@/models/Config";
import { ok, handler } from "@/lib/api";
import { requireAdmin } from "@/lib/guard";
import { configSchema } from "@/lib/validation";

export const dynamic = "force-dynamic";

// GET /api/admin/config
export const GET = handler(async () => {
  await requireAdmin();
  await connectDB();
  const config = await getConfig();
  return ok({ config });
});

// PUT /api/admin/config — update platform settings.
export const PUT = handler(async (req) => {
  await requireAdmin();
  const body = await req.json();
  const data = configSchema.parse(body);

  await connectDB();
  const config = await getConfig();
  Object.assign(config, data);
  await config.save();
  return ok({ config });
});
