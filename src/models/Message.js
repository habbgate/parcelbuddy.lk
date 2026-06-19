import mongoose from "mongoose";

const messageSchema = new mongoose.Schema(
  {
    requestId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "ParcelRequest",
      required: true,
      index: true,
    },
    senderType: { type: String, enum: ["TRAVELER", "SENDER"], required: true },
    travelerId: { type: mongoose.Schema.Types.ObjectId, ref: "User" },
    content: { type: String, trim: true },
    imageUrl: String,
    readAt: Date,
  },
  { timestamps: true }
);

export default mongoose.models.Message || mongoose.model("Message", messageSchema);
