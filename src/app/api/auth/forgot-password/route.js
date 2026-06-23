import { connectDB } from "@/lib/db";
import User from "@/models/User";
import { ok, handler } from "@/lib/api";
import { forgotPasswordSchema } from "@/lib/validation";
import { generateConfirmToken } from "@/lib/tracking";
import { sendSMS } from "@/lib/sms";
import { sendEmail, emailTemplates } from "@/lib/email";

// POST /api/auth/forgot-password — issue a reset token.
// Always returns ok to avoid leaking which emails exist.
export const POST = handler(async (req) => {
  const body = await req.json();
  const data = forgotPasswordSchema.parse(body);

  await connectDB();
  const user = await User.findOne({ email: data.email.toLowerCase() });

  if (user) {
    const token = generateConfirmToken();
    user.resetToken = token;
    user.resetTokenExpires = new Date(Date.now() + 30 * 60 * 1000);
    await user.save();

    const base = process.env.NEXT_PUBLIC_BASE_URL || "https://parcelbuddy.lk";
    const link = `${base}/auth/reset-password?token=${token}`;
    if (user.phone) {
      await sendSMS(user.phone, `ParcelBuddy password reset: ${link}`);
    }
    const e = emailTemplates.passwordReset(link);
    await sendEmail(user.email, e.subject, e.html);
    // In development surface the link for testing.
    console.log(`[RESET LINK] ${link}`);
  }

  return ok({ sent: true });
});

