import { connectDB } from "@/lib/db";
import { ok, handler } from "@/lib/api";
import { requireUser } from "@/lib/guard";
import { withdraw } from "@/lib/wallet";

// POST /api/users/me/wallet/withdraw — request a payout withdrawal.
export const POST = handler(async (req) => {
  const user = await requireUser();
  const { amountLKR } = await req.json();
  await connectDB();
  const balance = await withdraw(user._id, Number(amountLKR));
  return ok({ balance });
});

