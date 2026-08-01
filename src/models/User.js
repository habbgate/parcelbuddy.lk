import mongoose from "mongoose";
import { ROLES, USER_STATUS, ID_STATUS, DOC_TYPES } from "@/lib/constants";

const idVerificationSchema = new mongoose.Schema(
  {
    docType: { type: String, enum: DOC_TYPES },
    frontUrl: String,
    backUrl: String,
    selfieUrl: String,
    status: {
      type: String,
      enum: Object.values(ID_STATUS),
      default: ID_STATUS.PENDING,
    },
    rejectionReason: String,
    submittedAt: Date,
    reviewedAt: Date,
    reviewedBy: { type: mongoose.Schema.Types.ObjectId, ref: "User" },
  },
  { _id: false }
);

const statsSchema = new mongoose.Schema(
  {
    totalDeliveries: { type: Number, default: 0 },
    // Cumulative cash earned (full reward, no commission) across deliveries.
    totalEarningsLKR: { type: Number, default: 0 },
    averageRating: { type: Number, default: 0 },
    reviewCount: { type: Number, default: 0 },
  },
  { _id: false }
);

const routeAlertSchema = new mongoose.Schema(
  {
    fromCity: { type: String, required: true },
    toCity: { type: String, required: true },
    active: { type: Boolean, default: true },
  },
  { _id: true }
);

const userSchema = new mongoose.Schema(
  {
    name: { type: String, required: true, trim: true },
    email: { type: String, required: true, unique: true, lowercase: true, trim: true },
    phone: { type: String, trim: true },
    phoneVerified: { type: Boolean, default: false },
    passwordHash: { type: String },
    googleId: { type: String },
    avatarUrl: String,
    bio: String,

    role: {
      type: String,
      enum: Object.values(ROLES),
      default: ROLES.COURIER,
    },
    status: {
      type: String,
      enum: Object.values(USER_STATUS),
      default: USER_STATUS.PENDING_VERIFICATION,
    },

    idVerification: idVerificationSchema,
    stats: { type: statsSchema, default: () => ({}) },
    routeAlerts: [routeAlertSchema],

    isAvailable: { type: Boolean, default: true },

    otpCode: String,
    otpExpires: Date,
    resetToken: String,
    resetTokenExpires: Date,
  },
  { timestamps: true }
);

userSchema.index({ "routeAlerts.fromCity": 1, "routeAlerts.toCity": 1 });

// Strip sensitive fields when serializing to public-facing JSON.
userSchema.methods.toPublicProfile = function () {
  return {
    id: this._id.toString(),
    name: this.name,
    avatarUrl: this.avatarUrl,
    bio: this.bio,
    status: this.status,
    stats: this.stats,
    memberSince: this.createdAt,
  };
};

export default mongoose.models.User || mongoose.model("User", userSchema);

