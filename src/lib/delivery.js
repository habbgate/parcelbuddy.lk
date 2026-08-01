import User from "@/models/User";
import { notify } from "@/lib/notifications";
import { NOTIFICATION_TYPES, REQUEST_STATUS } from "@/lib/constants";

/**
 * Verify the Uber-style delivery PIN and, if correct, mark the parcel
 * DELIVERED: records who delivered it and when, credits the courier's cash
 * earnings stat (full reward, no commission), and notifies both parties.
 * Wrong PIN throws without changing anything.
 */
export async function verifyDeliveryPin(doc, courier, pin) {
  if (
    doc.status !== REQUEST_STATUS.COLLECTED &&
    doc.status !== REQUEST_STATUS.IN_TRANSIT
  ) {
    const e = new Error("Parcel must be collected before it can be delivered");
    e.status = 409;
    throw e;
  }

  if (!pin || String(pin) !== String(doc.deliveryPin)) {
    const e = new Error("Incorrect delivery PIN");
    e.status = 422;
    e.code = "INVALID_PIN";
    throw e;
  }

  const now = new Date();
  doc.status = REQUEST_STATUS.DELIVERED;
  doc.matchedCourier.deliveredAt = now;
  doc.matchedCourier.deliveryVerifiedAt = now;
  await doc.save();

  await User.updateOne(
    { _id: courier._id },
    {
      $inc: {
        "stats.totalDeliveries": 1,
        "stats.totalEarningsLKR": doc.rewardLKR,
      },
    }
  );

  await notify(courier._id, {
    type: NOTIFICATION_TYPES.DELIVERY_COMPLETED,
    title: `Delivery completed: ${doc.trackingCode}`,
    body: `LKR ${doc.rewardLKR.toLocaleString()} earned in cash from the sender.`,
    link: `/jobs/${doc._id.toString()}`,
  });
  if (doc.senderUserId) {
    await notify(doc.senderUserId, {
      type: NOTIFICATION_TYPES.DELIVERY_COMPLETED,
      title: `Delivered: ${doc.trackingCode}`,
      body: `Your parcel was delivered and verified with your PIN.`,
      link: `/track/${doc.trackingCode}`,
    });
  }

  return doc;
}
