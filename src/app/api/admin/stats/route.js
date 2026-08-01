import { connectDB } from "@/lib/db";
import ParcelRequest from "@/models/ParcelRequest";
import User from "@/models/User";
import { ok, handler } from "@/lib/api";
import { requireAdmin } from "@/lib/guard";
import { REQUEST_STATUS, ID_STATUS } from "@/lib/constants";

export const dynamic = "force-dynamic";

// GET /api/admin/stats — KPIs, revenue, charts.
export const GET = handler(async () => {
  await requireAdmin();
  await connectDB();

  const startOfMonth = new Date();
  startOfMonth.setDate(1);
  startOfMonth.setHours(0, 0, 0, 0);

  const [
    pendingReviews,
    openRequests,
    activeCouriers,
    openDisputes,
    deliveriesThisMonth,
    statusBreakdown,
    perDay,
  ] = await Promise.all([
    User.countDocuments({ "idVerification.status": ID_STATUS.PENDING }),
    ParcelRequest.countDocuments({ status: REQUEST_STATUS.OPEN }),
    User.countDocuments({ role: "COURIER", status: "ACTIVE" }),
    ParcelRequest.countDocuments({ "dispute.open": true }),
    ParcelRequest.countDocuments({
      status: REQUEST_STATUS.DELIVERED,
      updatedAt: { $gte: startOfMonth },
    }),
    ParcelRequest.aggregate([
      { $group: { _id: "$status", count: { $sum: 1 } } },
    ]),
    ParcelRequest.aggregate([
      {
        $match: {
          createdAt: {
            $gte: new Date(Date.now() - 14 * 24 * 60 * 60 * 1000),
          },
        },
      },
      {
        $group: {
          _id: { $dateToString: { format: "%Y-%m-%d", date: "$createdAt" } },
          count: { $sum: 1 },
        },
      },
      { $sort: { _id: 1 } },
    ]),
  ]);

  return ok({
    kpis: {
      pendingReviews,
      openRequests,
      activeCouriers,
      openDisputes,
      deliveriesThisMonth,
    },
    statusBreakdown: statusBreakdown.reduce((acc, s) => {
      acc[s._id] = s.count;
      return acc;
    }, {}),
    requestsPerDay: perDay.map((d) => ({ date: d._id, count: d.count })),
  });
});

