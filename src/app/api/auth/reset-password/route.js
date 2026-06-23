import bcrypt from "bcryptjs";
import { connectDB } from "@/lib/db";
import User from "@/models/User";
import { ok, fail, handler } from "@/lib/api";
import { resetPasswordSchema } from "@/lib/validation";

// POST /api/auth/reset-password — set a new password using a valid token.
export const POST = handler(async (req) => {
  const body = await req.json();
  const data = resetPasswordSchema.parse(body);

  await connectDB();
  const user = await User.findOne({
    resetToken: data.token,
    resetTokenExpires: { $gt: new Date() },
  });
  if (!user) return fail("Invalid or expired reset link", 400);

  user.passwordHash = await bcrypt.hash(data.password, 10);
  user.resetToken = undefined;
  user.resetTokenExpires = undefined;
  await user.save();

  return ok({ reset: true });
});

