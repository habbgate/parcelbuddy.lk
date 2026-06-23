import { connectDB } from "@/lib/db";
import WalletTransaction from "@/models/WalletTransaction";
import { ok, handler } from "@/lib/api";
import { requireUser } from "@/lib/guard";

export const dynamic = "force-dynamic";

// GET /api/users/me/wallet — balance + transaction history.
export const GET = handler(async () => {
  const user = await requireUser();
  await connectDB();
  const transactions = await WalletTransaction.find({ userId: user._id })
    .sort({ createdAt: -1 })
    .limit(100);
  return ok({ wallet: user.wallet, transactions });
});

