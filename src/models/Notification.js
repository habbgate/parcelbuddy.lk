import mongoose from "mongoose";
import { NOTIFICATION_TYPES } from "@/lib/constants";

const notificationSchema = new mongoose.Schema(
  {
    userId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
      index: true,
    },
    type: { type: String, enum: Object.values(NOTIFICATION_TYPES) },
    title: { type: String, required: true },
    body: String,
    link: String,
    data: mongoose.Schema.Types.Mixed,
    readAt: Date,
  },
  { timestamps: true }
);

export default mongoose.models.Notification ||
  mongoose.model("Notification", notificationSchema);

