// One-off migration for the Courier/PIN/cash-only platform overhaul.
//
// Applies to existing data:
//   users:           role "TRAVELER" -> "COURIER"; drop the `wallet` field
//   parcelrequests:  matchedTraveler -> matchedCourier (incl. confirmedAt -> deliveryVerifiedAt);
//                     drop senderConfirmToken / commissionPercent / travelerPayoutLKR;
//                     backfill a 4-digit deliveryPin on any doc missing one;
//                     collapse status "COMPLETED" -> "DELIVERED"
//   messages:        travelerId -> courierId; senderType "TRAVELER" -> "COURIER"
//
// Defaults to a DRY RUN that only prints how many documents would change.
// Pass --commit to actually write. The `wallettransactions` collection is
// left untouched — drop it manually once you've confirmed the wallet
// feature is no longer needed.
//
// Run:
//   node --env-file=.env scripts/migrate-courier-pin.mjs            (dry run)
//   node --env-file=.env scripts/migrate-courier-pin.mjs --commit   (apply)

import mongoose from "mongoose";

const uri = process.env.MONGODB_URI;
if (!uri) {
  console.error("MONGODB_URI not set. Run with: node --env-file=.env scripts/migrate-courier-pin.mjs");
  process.exit(1);
}

const commit = process.argv.includes("--commit");

await mongoose.connect(uri);
const db = mongoose.connection.db;

function pin() {
  return String(Math.floor(1000 + Math.random() * 9000));
}

console.log(commit ? "Running migration (writes enabled)…\n" : "Dry run — no writes will be made. Pass --commit to apply.\n");

// ── users: role rename + drop wallet ───────────────────────────────
const travelerUsers = await db.collection("users").countDocuments({ role: "TRAVELER" });
const walletUsers = await db.collection("users").countDocuments({ wallet: { $exists: true } });
console.log(`users: ${travelerUsers} with role TRAVELER, ${walletUsers} with a wallet field to drop`);
if (commit) {
  await db.collection("users").updateMany({ role: "TRAVELER" }, { $set: { role: "COURIER" } });
  await db.collection("users").updateMany({ wallet: { $exists: true } }, { $unset: { wallet: "" } });
}

// ── parcelrequests: field renames ──────────────────────────────────
const withMatchedTraveler = await db.collection("parcelrequests").countDocuments({ matchedTraveler: { $exists: true } });
console.log(`parcelrequests: ${withMatchedTraveler} with matchedTraveler to rename to matchedCourier`);
if (commit) {
  await db.collection("parcelrequests").updateMany(
    { matchedTraveler: { $exists: true } },
    { $rename: { matchedTraveler: "matchedCourier" } }
  );
  await db.collection("parcelrequests").updateMany(
    { "matchedCourier.confirmedAt": { $exists: true } },
    { $rename: { "matchedCourier.confirmedAt": "matchedCourier.deliveryVerifiedAt" } }
  );
}

const staleFieldsCount = await db.collection("parcelrequests").countDocuments({
  $or: [
    { senderConfirmToken: { $exists: true } },
    { commissionPercent: { $exists: true } },
    { travelerPayoutLKR: { $exists: true } },
  ],
});
console.log(`parcelrequests: ${staleFieldsCount} with senderConfirmToken/commissionPercent/travelerPayoutLKR to drop`);
if (commit) {
  await db.collection("parcelrequests").updateMany(
    {},
    { $unset: { senderConfirmToken: "", commissionPercent: "", travelerPayoutLKR: "" } }
  );
}

// ── parcelrequests: backfill delivery PIN ──────────────────────────
const missingPin = await db.collection("parcelrequests").find({ deliveryPin: { $exists: false } }).toArray();
console.log(`parcelrequests: ${missingPin.length} missing a deliveryPin (will be backfilled)`);
if (commit) {
  for (const doc of missingPin) {
    await db.collection("parcelrequests").updateOne({ _id: doc._id }, { $set: { deliveryPin: pin() } });
  }
}

// ── parcelrequests: collapse COMPLETED -> DELIVERED ────────────────
const completedCount = await db.collection("parcelrequests").countDocuments({ status: "COMPLETED" });
console.log(`parcelrequests: ${completedCount} with status COMPLETED to collapse into DELIVERED`);
if (commit) {
  await db.collection("parcelrequests").updateMany({ status: "COMPLETED" }, { $set: { status: "DELIVERED" } });
}

// ── messages: field + enum rename ──────────────────────────────────
const travelerMessages = await db.collection("messages").countDocuments({
  $or: [{ travelerId: { $exists: true } }, { senderType: "TRAVELER" }],
});
console.log(`messages: ${travelerMessages} with travelerId/senderType TRAVELER to rename`);
if (commit) {
  await db.collection("messages").updateMany(
    { travelerId: { $exists: true } },
    { $rename: { travelerId: "courierId" } }
  );
  await db.collection("messages").updateMany({ senderType: "TRAVELER" }, { $set: { senderType: "COURIER" } });
}

console.log(commit ? "\n✅ Migration applied." : "\nDry run complete. Re-run with --commit to apply these changes.");

await mongoose.disconnect();
process.exit(0);
