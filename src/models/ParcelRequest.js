import mongoose from "mongoose";
import { REQUEST_STATUS, PACKAGE_TYPES } from "@/lib/constants";

const senderSchema = new mongoose.Schema(
  {
    name: { type: String, required: true, trim: true },
    phone: { type: String, required: true, trim: true }, // PRIVATE — never returned publicly
    email: { type: String, trim: true, lowercase: true },
    phonePublic: { type: Boolean, default: false },
  },
  { _id: false }
);

const routeSchema = new mongoose.Schema(
  {
    fromCity: { type: String, required: true },
    toCity: { type: String, required: true },
    fromAddress: String,
    toAddress: String,
    neededBy: Date,
  },
  { _id: false }
);

const parcelSchema = new mongoose.Schema(
  {
    description: { type: String, required: true },
    weightKg: { type: Number, required: true, min: 0.1, max: 30 },
    packageType: { type: String, enum: PACKAGE_TYPES, required: true },
    photos: [String],
    isFragile: { type: Boolean, default: false },
    specialNotes: String,
  },
  { _id: false }
);

const matchedTravelerSchema = new mongoose.Schema(
  {
    userId: { type: mongoose.Schema.Types.ObjectId, ref: "User" },
    acceptedAt: Date,
    collectedAt: Date,
    deliveredAt: Date,
    confirmedAt: Date,
  },
  { _id: false }
);

const reviewSchema = new mongoose.Schema(
  {
    rating: { type: Number, min: 1, max: 5 },
    comment: String,
    createdAt: Date,
  },
  { _id: false }
);

const disputeSchema = new mongoose.Schema(
  {
    open: { type: Boolean, default: false },
    reason: String,
    description: String,
    reportedBy: String, // "SENDER" | "TRAVELER"
    status: { type: String, enum: ["OPEN", "RESOLVED", "DISMISSED"], default: "OPEN" },
    resolution: String,
    createdAt: Date,
    resolvedAt: Date,
  },
  { _id: false }
);

const parcelRequestSchema = new mongoose.Schema(
  {
    sender: { type: senderSchema, required: true },
    // Set when the parcel is posted by a logged-in user (so they can manage
    // and chat from their account). Guests leave this empty.
    senderUserId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      index: true,
    },
    route: { type: routeSchema, required: true },
    parcel: { type: parcelSchema, required: true },
    rewardLKR: { type: Number, required: true, min: 0 },

    status: {
      type: String,
      enum: Object.values(REQUEST_STATUS),
      default: REQUEST_STATUS.OPEN,
      index: true,
    },

    matchedTraveler: matchedTravelerSchema,

    trackingCode: { type: String, required: true, unique: true, index: true },
    expiresAt: { type: Date, index: true },

    senderConfirmToken: String,

    // Commission/payout snapshot captured when the job is created.
    commissionPercent: { type: Number, default: 10 },
    travelerPayoutLKR: { type: Number, default: 0 },

    review: reviewSchema,
    dispute: disputeSchema,
  },
  { timestamps: true }
);

parcelRequestSchema.index({ "route.fromCity": 1, "route.toCity": 1, status: 1 });

// Build a public-safe view of the request. Sender phone is NEVER included
// unless explicitly revealed to the matched traveler in a dedicated endpoint.
parcelRequestSchema.methods.toPublicJSON = function () {
  const obj = this.toObject();
  return {
    id: obj._id.toString(),
    trackingCode: obj.trackingCode,
    status: obj.status,
    route: {
      fromCity: obj.route.fromCity,
      toCity: obj.route.toCity,
      neededBy: obj.route.neededBy,
    },
    parcel: {
      description: obj.parcel.description,
      weightKg: obj.parcel.weightKg,
      packageType: obj.parcel.packageType,
      isFragile: obj.parcel.isFragile,
      specialNotes: obj.parcel.specialNotes,
      photos: obj.parcel.photos,
    },
    rewardLKR: obj.rewardLKR,
    senderName: obj.sender.name, // first name only handled at API layer
    createdAt: obj.createdAt,
    expiresAt: obj.expiresAt,
    matchedTraveler: obj.matchedTraveler
      ? {
          acceptedAt: obj.matchedTraveler.acceptedAt,
          collectedAt: obj.matchedTraveler.collectedAt,
          deliveredAt: obj.matchedTraveler.deliveredAt,
          confirmedAt: obj.matchedTraveler.confirmedAt,
        }
      : null,
    review: obj.review || null,
  };
};

export default mongoose.models.ParcelRequest ||
  mongoose.model("ParcelRequest", parcelRequestSchema);
