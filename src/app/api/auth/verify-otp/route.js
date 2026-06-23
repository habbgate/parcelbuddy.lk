import { connectDB } from "@/lib/db";
import User from "@/models/User";
import { ok, fail, handler } from "@/lib/api";
import { otpSchema } from "@/lib/validation";

// POST /api/auth/verify-otp — verify the phone OTP.
export const POST = handler(async (req) => {
  const body = await req.json();
  const data = otpSchema.parse(body);

  await connectDB();
  const user = await User.findOne({ phone: data.phone });
  if (!user) return fail("No account found for this phone number", 404);

  if (!user.otpCode || !user.otpExpires) {
    return fail("No verification code pending. Request a new one.", 400);
  }
  if (user.otpExpires < new Date()) {
    return fail("Verification code expired. Request a new one.", 400);
  }
  if (user.otpCode !== data.code) {
    return fail("Incorrect verification code", 400);
  }

  user.phoneVerified = true;
  user.otpCode = undefined;
  user.otpExpires = undefined;
  await user.save();

  return ok({ phoneVerified: true });
});

