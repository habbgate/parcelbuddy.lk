import { ok, handler } from "@/lib/api";
import { suggestReward } from "@/lib/queries";

export const dynamic = "force-dynamic";

// GET /api/suggest-reward?fromCity=&toCity=
export const GET = handler(async (req) => {
  const { searchParams } = new URL(req.url);
  const fromCity = searchParams.get("fromCity");
  const toCity = searchParams.get("toCity");
  if (!fromCity || !toCity) return ok({ suggestion: null });
  const suggestion = await suggestReward(fromCity, toCity);
  return ok({ suggestion });
});
