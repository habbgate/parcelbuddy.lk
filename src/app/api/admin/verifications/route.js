import { connectDB } from "@/lib/db";
import User from "@/models/User";
import { ok, handler } from "@/lib/api";
import { requireAdmin } from "@/lib/guard";
import { ID_STATUS } from "@/lib/constants";

export const dynamic = "force-dynamic";

// GET /api/admin/verifications — pending ID review queue.
export const GET = handler(async (req) => {
  await requireAdmin();
  await connectDB();
  const { searchParams } = new URL(req.url);
  const status = searchParams.get("status") || ID_STATUS.PENDING;

  const users = await User.find({ "idVerification.status": status })
    .sort({ "idVerification.submittedAt": 1 })
    .select("name email phone idVerification createdAt");

  return ok({
    verifications: users.map((u) => ({
      id: u._id.toString(),
      name: u.name,
      email: u.email,
      phone: u.phone,
      docType: u.idVerification?.docType,
      submittedAt: u.idVerification?.submittedAt,
      status: u.idVerification?.status,
    })),
  });
});
