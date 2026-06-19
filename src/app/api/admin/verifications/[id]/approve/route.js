import { connectDB } from "@/lib/db";
import User from "@/models/User";
import { ok, fail, handler } from "@/lib/api";
import { requireAdmin } from "@/lib/guard";
import { sendSMS, smsTemplates } from "@/lib/sms";
import { sendEmail, emailTemplates } from "@/lib/email";
import { notify } from "@/lib/notifications";
import { ID_STATUS, USER_STATUS, NOTIFICATION_TYPES } from "@/lib/constants";

// POST /api/admin/verifications/[id]/approve
export const POST = handler(async (req, { params }) => {
  const admin = await requireAdmin();
  await connectDB();

  const user = await User.findById(params.id);
  if (!user || !user.idVerification) return fail("No verification found", 404);

  user.idVerification.status = ID_STATUS.APPROVED;
  user.idVerification.rejectionReason = undefined;
  user.idVerification.reviewedAt = new Date();
  user.idVerification.reviewedBy = admin._id;
  user.status = USER_STATUS.ACTIVE;
  await user.save();

  await notify(user._id, {
    type: NOTIFICATION_TYPES.ID_APPROVED,
    title: "Identity verified ✅",
    body: "You can now accept delivery jobs.",
    link: "/parcels",
  });
  if (user.phone) await sendSMS(user.phone, smsTemplates.idApproved());
  if (user.email) {
    const e = emailTemplates.idApproved();
    await sendEmail(user.email, e.subject, e.html);
  }

  return ok({ status: user.status });
});
