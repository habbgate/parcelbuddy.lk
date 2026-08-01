// Seed an admin account, a verified courier, and sample open requests.
// Run: node --env-file=.env scripts/seed.mjs
import mongoose from "mongoose";
import bcrypt from "bcryptjs";

const uri = process.env.MONGODB_URI;
if (!uri) {
  console.error("MONGODB_URI not set. Run with: node --env-file=.env scripts/seed.mjs");
  process.exit(1);
}

await mongoose.connect(uri);
const db = mongoose.connection.db;

function code() {
  const a = "ABCDEFGHJKMNPQRSTUVWXYZ23456789";
  return "PB-" + Array.from({ length: 4 }, () => a[Math.floor(Math.random() * a.length)]).join("");
}

function pin() {
  return String(Math.floor(1000 + Math.random() * 9000));
}

// --- Admin ---
const adminHash = await bcrypt.hash("admin1234", 10);
await db.collection("users").updateOne(
  { email: "admin@parcelbuddy.lk" },
  {
    $set: {
      name: "Platform Admin",
      email: "admin@parcelbuddy.lk",
      phone: "0770000000",
      phoneVerified: true,
      passwordHash: adminHash,
      role: "SUPER_ADMIN",
      status: "ACTIVE",
      stats: { totalDeliveries: 0, totalEarningsLKR: 0, averageRating: 0, reviewCount: 0 },
      isAvailable: false,
      updatedAt: new Date(),
    },
    $setOnInsert: { createdAt: new Date() },
  },
  { upsert: true }
);

// --- Verified courier (also used as the sample sender below) ---
const courierHash = await bcrypt.hash("courier1234", 10);
const courierResult = await db.collection("users").findOneAndUpdate(
  { email: "courier@parcelbuddy.lk" },
  {
    $set: {
      name: "Nimal Perera",
      email: "courier@parcelbuddy.lk",
      phone: "0771112222",
      phoneVerified: true,
      passwordHash: courierHash,
      role: "COURIER",
      status: "ACTIVE",
      idVerification: { docType: "NIC", status: "APPROVED", reviewedAt: new Date() },
      stats: { totalDeliveries: 12, totalEarningsLKR: 14500, averageRating: 4.8, reviewCount: 9 },
      isAvailable: true,
      updatedAt: new Date(),
    },
    $setOnInsert: { createdAt: new Date() },
  },
  { upsert: true, returnDocument: "after" }
);
const courierId = courierResult.value?._id ?? (await db.collection("users").findOne({ email: "courier@parcelbuddy.lk" }))._id;

// --- Sample open requests ---
const samples = [
  { from: "Kandy", to: "Colombo", desc: "Documents", type: "ENVELOPE", w: 0.5, reward: 500 },
  { from: "Jaffna", to: "Colombo", desc: "Homemade snacks", type: "BAG", w: 3, reward: 1200 },
  { from: "Galle", to: "Matara", desc: "Phone charger & cables", type: "SMALL_BOX", w: 0.8, reward: 350 },
  { from: "Colombo", to: "Kurunegala", desc: "Birthday gift (fragile)", type: "FRAGILE", w: 1.5, reward: 800 },
];

const existing = await db.collection("parcelrequests").countDocuments();
if (existing === 0) {
  await db.collection("parcelrequests").insertMany(
    samples.map((s) => ({
      sender: { name: "Sample Sender", phone: "0759998877", phonePublic: false },
      senderUserId: courierId,
      route: { fromCity: s.from, toCity: s.to },
      parcel: { description: s.desc, weightKg: s.w, packageType: s.type, photos: [], isFragile: s.type === "FRAGILE" },
      rewardLKR: s.reward,
      status: "OPEN",
      trackingCode: code(),
      deliveryPin: pin(),
      expiresAt: new Date(Date.now() + 14 * 86400000),
      createdAt: new Date(),
      updatedAt: new Date(),
    }))
  );
  console.log(`Inserted ${samples.length} sample requests.`);
}

console.log("\n✅ Seed complete.");
console.log("Admin:   admin@parcelbuddy.lk / admin1234");
console.log("Courier: courier@parcelbuddy.lk / courier1234");

await mongoose.disconnect();
process.exit(0);
