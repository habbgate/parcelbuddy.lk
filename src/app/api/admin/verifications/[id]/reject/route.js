import { connectDB } from "@/lib/db";
import User from "@/models/User";
import { ok, fail, handler } from "@/lib/api";
import { requireAdmin } from "@/lib/guard";
import { sendSMS, smsTemplates } from "@/lib/sms";
import { sendEmail, emailTemplates } from "@/lib/email";
import { notify } from "@/lib/notifications";
import { ID_STATUS, NOTIFICATION_TYPES } from "@/lib/constants";

// POST /api/admin/verifications/[id]/reject — Body: { reason }
export const POST = handler(async (req, { params }) => {
  const admin = await requireAdmin();
  const { reason } = await req.json();
  if (!reason) return fail("A rejection reason is required", 400);

  await connectDB();
  const user = await User.findById(params.id);
  if (!user || !user.idVerification) return fail("No verification found", 404);

  user.idVerification.status = ID_STATUS.REJECTED;
  user.idVerification.rejectionReason = reason;
  user.idVerification.reviewedAt = new Date();
  user.idVerification.reviewedBy = admin._id;
  await user.save();

  await notify(user._id, {
    type: NOTIFICATION_TYPES.ID_REJECTED,
    title: "Identity verification needs attention",
    body: reason,
    link: "/verify-identity",
  });
  if (user.phone) await sendSMS(user.phone, smsTemplates.idRejected());
  if (user.email) {
    const e = emailTemplates.idRejected(reason);
    await sendEmail(user.email, e.subject, e.html);
  }

  return ok({ status: user.idVerification.status });
});
