import mongoose from "mongoose";
import { WALLET_TX_TYPES } from "@/lib/constants";

const walletTransactionSchema = new mongoose.Schema(
  {
    userId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
      index: true,
    },
    type: {
      type: String,
      enum: Object.values(WALLET_TX_TYPES),
      required: true,
    },
    amountLKR: { type: Number, required: true },
    description: String,
    requestId: { type: mongoose.Schema.Types.ObjectId, ref: "ParcelRequest" },
    balanceAfter: Number,
  },
  { timestamps: true }
);

export default mongoose.models.WalletTransaction ||
  mongoose.model("WalletTransaction", walletTransactionSchema);

