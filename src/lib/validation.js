import { z } from "zod";
import { PACKAGE_TYPES, DOC_TYPES } from "@/lib/constants";

// Sri Lankan phone: 07XXXXXXXX or +947XXXXXXXX
const phoneRegex = /^(?:\+94|0)7\d{8}$/;

export const phoneSchema = z
  .string()
  .trim()
  .regex(phoneRegex, "Enter a valid Sri Lankan mobile number (e.g. 0771234567)");

export const createRequestSchema = z.object({
  route: z.object({
    fromCity: z.string().min(1, "From city is required"),
    toCity: z.string().min(1, "To city is required"),
    fromAddress: z.string().optional(),
    toAddress: z.string().optional(),
    neededBy: z.string().datetime().optional().or(z.literal("")).optional(),
  }),
  parcel: z.object({
    description: z.string().min(2, "Describe what you are sending"),
    weightKg: z.coerce.number().min(0.1).max(30),
    packageType: z.enum(PACKAGE_TYPES),
    photos: z.array(z.string().url()).max(3).optional().default([]),
    isFragile: z.boolean().optional().default(false),
    specialNotes: z.string().max(500).optional(),
  }),
  sender: z.object({
    name: z.string().min(2, "Your name is required"),
    phone: phoneSchema,
    email: z.string().email().optional().or(z.literal("")),
  }),
  rewardLKR: z.coerce.number().min(100, "Minimum reward is LKR 100").max(1000000),
});

export const registerSchema = z.object({
  name: z.string().min(2, "Name is required"),
  email: z.string().email("Enter a valid email"),
  phone: phoneSchema,
  password: z.string().min(8, "Password must be at least 8 characters"),
});

export const loginSchema = z.object({
  email: z.string().email(),
  password: z.string().min(1),
});

export const otpSchema = z.object({
  phone: phoneSchema,
  code: z.string().length(6, "Enter the 6-digit code"),
});

export const forgotPasswordSchema = z.object({
  email: z.string().email(),
});

export const resetPasswordSchema = z.object({
  token: z.string().min(10),
  password: z.string().min(8, "Password must be at least 8 characters"),
});

export const verifyIdSchema = z.object({
  docType: z.enum(DOC_TYPES),
  frontUrl: z.string().url("Front image is required"),
  backUrl: z.string().url().optional().or(z.literal("")),
  selfieUrl: z.string().url().optional().or(z.literal("")),
});

export const reviewSchema = z.object({
  rating: z.coerce.number().int().min(1).max(5),
  comment: z.string().max(500).optional(),
});

export const disputeSchema = z.object({
  reason: z.string().min(2),
  description: z.string().min(5).max(1000),
  reportedBy: z.enum(["SENDER", "TRAVELER"]),
});

export const messageSchema = z.object({
  content: z.string().min(1).max(2000).optional(),
  imageUrl: z.string().url().optional(),
}).refine((d) => d.content || d.imageUrl, {
  message: "Message cannot be empty",
});

export const routeAlertSchema = z.object({
  fromCity: z.string().min(1),
  toCity: z.string().min(1),
});

export const updateProfileSchema = z.object({
  name: z.string().min(2).optional(),
  bio: z.string().max(500).optional(),
  phone: phoneSchema.optional(),
  isAvailable: z.boolean().optional(),
});

export const configSchema = z.object({
  commissionPercent: z.coerce.number().min(0).max(100).optional(),
  autoCompleteHours: z.coerce.number().min(1).optional(),
  requestExpiryDays: z.coerce.number().min(1).optional(),
  minRewardLKR: z.coerce.number().min(0).optional(),
  maxWeightKg: z.coerce.number().min(1).optional(),
});

