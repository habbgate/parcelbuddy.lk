import mongoose from "mongoose";
import { DEFAULT_CONFIG } from "@/lib/constants";

// Singleton platform configuration document.
const configSchema = new mongoose.Schema(
  {
    key: { type: String, default: "platform", unique: true },
    requestExpiryDays: { type: Number, default: DEFAULT_CONFIG.requestExpiryDays },
    minRewardLKR: { type: Number, default: DEFAULT_CONFIG.minRewardLKR },
    maxWeightKg: { type: Number, default: DEFAULT_CONFIG.maxWeightKg },
  },
  { timestamps: true }
);

const Config =
  mongoose.models.Config || mongoose.model("Config", configSchema);

export async function getConfig() {
  let config = await Config.findOne({ key: "platform" });
  if (!config) {
    config = await Config.create({ key: "platform" });
  }
  return config;
}

export default Config;

