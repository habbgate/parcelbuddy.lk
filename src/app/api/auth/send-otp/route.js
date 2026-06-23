import { connectDB } from "@/lib/db";
import User from "@/models/User";
import { ok, fail, handler } from "@/lib/api";
import { phoneSchema } from "@/lib/validation";
import { sendSMS, smsTemplates } from "@/lib/sms";
import { sendEmail, emailTemplates } from "@/lib/email";

// POST /api/auth/send-otp — (re)send a phone verification code.
export const POST = handler(async (req) => {
  const { phone } = await req.json();
  const validPhone = phoneSchema.parse(phone);

  await connectDB();
  const user = await User.findOne({ phone: validPhone });
  if (!user) return fail("No account found for this phone number", 404);

  const otpCode = String(Math.floor(100000 + Math.random() * 900000));
  user.otpCode = otpCode;
  user.otpExpires = new Date(Date.now() + 10 * 60 * 1000);
  await user.save();

  await sendSMS(validPhone, smsTemplates.otp(otpCode));
  if (user.email) {
    const e = emailTemplates.otp(otpCode);
    await sendEmail(user.email, e.subject, e.html);
  }
  return ok({ sent: true });
});

