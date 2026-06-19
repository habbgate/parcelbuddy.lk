import bcrypt from "bcryptjs";
import { connectDB } from "@/lib/db";
import User from "@/models/User";
import { ok, fail, handler } from "@/lib/api";
import { registerSchema } from "@/lib/validation";
import { sendSMS, smsTemplates } from "@/lib/sms";
import { sendEmail, emailTemplates } from "@/lib/email";
import { ROLES, USER_STATUS } from "@/lib/constants";

// POST /api/auth/register — create a traveler account, send phone OTP.
export const POST = handler(async (req) => {
  const body = await req.json();
  const data = registerSchema.parse(body);

  await connectDB();
  const existing = await User.findOne({ email: data.email.toLowerCase() });
  if (existing) return fail("An account with this email already exists", 409);

  const passwordHash = await bcrypt.hash(data.password, 10);
  const otpCode = String(Math.floor(100000 + Math.random() * 900000));
  const otpExpires = new Date(Date.now() + 10 * 60 * 1000);

  const user = await User.create({
    name: data.name,
    email: data.email.toLowerCase(),
    phone: data.phone,
    passwordHash,
    role: ROLES.TRAVELER,
    status: USER_STATUS.PENDING_VERIFICATION,
    otpCode,
    otpExpires,
  });

  await sendSMS(data.phone, smsTemplates.otp(otpCode));
  const e = emailTemplates.otp(otpCode);
  await sendEmail(data.email, e.subject, e.html);

  return ok({ userId: user._id.toString(), phone: user.phone }, 201);
});
