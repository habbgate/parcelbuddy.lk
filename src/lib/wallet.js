import User from "@/models/User";
import WalletTransaction from "@/models/WalletTransaction";
import { WALLET_TX_TYPES } from "@/lib/constants";

/**
 * Compute the traveler payout after platform commission.
 */
export function computePayout(rewardLKR, commissionPercent) {
  const commission = Math.round((rewardLKR * commissionPercent) / 100);
  return {
    commission,
    payout: rewardLKR - commission,
  };
}

/**
 * Credit a traveler's wallet and record a transaction.
 */
export async function creditWallet(userId, amountLKR, { description, requestId }) {
  const user = await User.findById(userId);
  if (!user) throw new Error("Traveler not found");

  user.wallet.balance += amountLKR;
  user.wallet.totalEarned += amountLKR;
  user.stats.totalEarningsLKR += amountLKR;
  await user.save();

  await WalletTransaction.create({
    userId,
    type: WALLET_TX_TYPES.CREDIT,
    amountLKR,
    description,
    requestId,
    balanceAfter: user.wallet.balance,
  });

  return user.wallet.balance;
}

/**
 * Process a withdrawal request (records a WITHDRAWAL transaction).
 */
export async function withdraw(userId, amountLKR) {
  const user = await User.findById(userId);
  if (!user) throw new Error("Traveler not found");
  if (amountLKR <= 0) throw new Error("Invalid amount");
  if (user.wallet.balance < amountLKR) throw new Error("Insufficient balance");

  user.wallet.balance -= amountLKR;
  user.wallet.totalWithdrawn += amountLKR;
  await user.save();

  await WalletTransaction.create({
    userId,
    type: WALLET_TX_TYPES.WITHDRAWAL,
    amountLKR: -amountLKR,
    description: "Withdrawal request",
    balanceAfter: user.wallet.balance,
  });

  return user.wallet.balance;
}
