import { connectDB } from "@/lib/db";
import { ok, handler } from "@/lib/api";
import { requireUser } from "@/lib/guard";
import { verifyIdSchema } from "@/lib/validation";
import { ID_STATUS } from "@/lib/constants";

// POST /api/users/verify-id — submit NIC/Passport for admin review.
export const POST = handler(async (req) => {
  const user = await requireUser();
  const body = await req.json();
  const data = verifyIdSchema.parse(body);

  await connectDB();
  user.idVerification = {
    docType: data.docType,
    frontUrl: data.frontUrl,
    backUrl: data.backUrl || undefined,
    selfieUrl: data.selfieUrl || undefined,
    status: ID_STATUS.PENDING,
    submittedAt: new Date(),
  };
  await user.save();

  return ok({ status: ID_STATUS.PENDING });
});
