import User from "@/models/User";
import { computePayout, creditWallet } from "@/lib/wallet";
import { notify } from "@/lib/notifications";
import { NOTIFICATION_TYPES, REQUEST_STATUS } from "@/lib/constants";

/**
 * Complete a DELIVERED request: mark COMPLETED, credit the traveler's wallet
 * (reward minus commission), update stats. Shared by sender confirmation and
 * the 48-hour auto-complete cron. Idempotent.
 */
export async function completeRequest(doc, { auto = false } = {}) {
  if (doc.status === REQUEST_STATUS.COMPLETED) return doc;
  if (doc.status !== REQUEST_STATUS.DELIVERED) {
    throw new Error("Request is not in a deliverable state");
  }

  const { payout } = computePayout(doc.rewardLKR, doc.commissionPercent);
  doc.travelerPayoutLKR = payout;
  doc.status = REQUEST_STATUS.COMPLETED;
  doc.matchedTraveler.confirmedAt = new Date();
  await doc.save();

  const travelerId = doc.matchedTraveler.userId;
  if (travelerId) {
    await creditWallet(travelerId, payout, {
      description: `Payout for ${doc.trackingCode}`,
      requestId: doc._id,
    });
    // Bump delivery count.
    await User.updateOne(
      { _id: travelerId },
      { $inc: { "stats.totalDeliveries": 1 } }
    );
    await notify(travelerId, {
      type: NOTIFICATION_TYPES.PAYMENT,
      title: auto
        ? `Auto-completed: ${doc.trackingCode}`
        : `Delivery confirmed: ${doc.trackingCode}`,
      body: `LKR ${payout.toLocaleString()} credited to your wallet.`,
      link: `/wallet`,
    });
  }

  return doc;
}

