import { connectDB } from "@/lib/db";
import ParcelRequest from "@/models/ParcelRequest";
import { ok, fail, handler } from "@/lib/api";
import { requireUser } from "@/lib/guard";
import { disputeSchema } from "@/lib/validation";

// POST /api/requests/[id]/dispute — open a dispute on a job.
export const POST = handler(async (req, { params }) => {
  const user = await requireUser();
  const body = await req.json();
  const data = disputeSchema.parse(body);

  await connectDB();
  const doc = await ParcelRequest.findById(params.id);
  if (!doc) return fail("Request not found", 404);

  if (doc.dispute?.open) return fail("A dispute is already open", 409);

  doc.dispute = {
    open: true,
    reason: data.reason,
    description: data.description,
    reportedBy: data.reportedBy,
    status: "OPEN",
    createdAt: new Date(),
  };
  await doc.save();

  return ok({ dispute: doc.dispute });
});
