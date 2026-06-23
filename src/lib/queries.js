import { connectDB } from "@/lib/db";
import ParcelRequest from "@/models/ParcelRequest";
import User from "@/models/User";
import { firstNameOnly } from "@/lib/api";
import { REQUEST_STATUS } from "@/lib/constants";

// Public-safe serialization: first name only, no phone, ever.
export function toPublicCard(doc) {
  const obj = doc.toPublicJSON ? doc.toPublicJSON() : doc;
  return {
    ...obj,
    senderName: firstNameOnly(obj.senderName),
  };
}

/**
 * Fetch open requests with optional route/filter params. Phone never included.
 */
export async function fetchOpenRequests({
  fromCity,
  toCity,
  packageType,
  minReward,
  maxWeight,
  limit = 50,
} = {}) {
  await connectDB();
  const query = { status: REQUEST_STATUS.OPEN };
  if (fromCity) query["route.fromCity"] = fromCity;
  if (toCity) query["route.toCity"] = toCity;
  if (packageType) query["parcel.packageType"] = packageType;
  if (minReward) query.rewardLKR = { $gte: Number(minReward) };
  if (maxWeight) query["parcel.weightKg"] = { $lte: Number(maxWeight) };

  const docs = await ParcelRequest.find(query)
    .sort({ createdAt: -1 })
    .limit(limit);

  return docs.map(toPublicCard);
}

/**
 * Landing page live stats.
 */
export async function fetchPlatformStats() {
  await connectDB();
  const [deliveries, travelers, cities] = await Promise.all([
    ParcelRequest.countDocuments({
      status: { $in: [REQUEST_STATUS.COMPLETED, REQUEST_STATUS.DELIVERED] },
    }),
    User.countDocuments({ role: "TRAVELER", status: "ACTIVE" }),
    ParcelRequest.distinct("route.fromCity"),
  ]);
  return {
    deliveries: deliveries,
    travelers: travelers,
    cities: cities.length,
  };
}

/**
 * Suggested reward based on median of last 20 completed jobs on a city pair.
 */
export async function suggestReward(fromCity, toCity) {
  await connectDB();
  const docs = await ParcelRequest.find({
    "route.fromCity": fromCity,
    "route.toCity": toCity,
    status: REQUEST_STATUS.COMPLETED,
  })
    .sort({ createdAt: -1 })
    .limit(20)
    .select("rewardLKR");

  if (!docs.length) return null;
  const rewards = docs.map((d) => d.rewardLKR).sort((a, b) => a - b);
  const mid = Math.floor(rewards.length / 2);
  const median =
    rewards.length % 2 !== 0
      ? rewards[mid]
      : Math.round((rewards[mid - 1] + rewards[mid]) / 2);

  return {
    median,
    low: Math.round(median * 0.8),
    high: Math.round(median * 1.2),
    sampleSize: docs.length,
  };
}

