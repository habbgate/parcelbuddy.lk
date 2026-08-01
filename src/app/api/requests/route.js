import { connectDB } from "@/lib/db";
import ParcelRequest from "@/models/ParcelRequest";
import User from "@/models/User";
import { getConfig } from "@/models/Config";
import { ok, fail, handler } from "@/lib/api";
import { createRequestSchema } from "@/lib/validation";
import { generateUniqueTrackingCode, generateDeliveryPin } from "@/lib/tracking";
import { sendSMS, smsTemplates } from "@/lib/sms";
import { sendEmail, emailTemplates } from "@/lib/email";
import { notify } from "@/lib/notifications";
import { fetchOpenRequests } from "@/lib/queries";
import { requireUser } from "@/lib/guard";
import { NOTIFICATION_TYPES, REQUEST_STATUS } from "@/lib/constants";

// POST /api/requests — create a parcel request. Requires a logged-in account.
export const POST = handler(async (req) => {
  // Resolve the logged-in user BEFORE consuming the request body, so the
  // session context is intact. Throws 401 if not authenticated.
  const currentUser = await requireUser();

  const body = await req.json();
  const data = createRequestSchema.parse(body);

  await connectDB();
  const config = await getConfig();

  const trackingCode = await generateUniqueTrackingCode(ParcelRequest);
  const deliveryPin = generateDeliveryPin();
  const expiresAt = new Date(
    Date.now() + config.requestExpiryDays * 24 * 60 * 60 * 1000
  );

  const doc = await ParcelRequest.create({
    sender: {
      name: data.sender.name,
      phone: data.sender.phone,
      email: data.sender.email || undefined,
      phonePublic: false,
    },
    senderUserId: currentUser._id,
    route: {
      fromCity: data.route.fromCity,
      toCity: data.route.toCity,
      fromAddress: data.route.fromAddress,
      toAddress: data.route.toAddress,
      neededBy: data.route.neededBy ? new Date(data.route.neededBy) : undefined,
    },
    parcel: {
      description: data.parcel.description,
      weightKg: data.parcel.weightKg,
      packageType: data.parcel.packageType,
      photos: data.parcel.photos || [],
      isFragile: data.parcel.isFragile,
      specialNotes: data.parcel.specialNotes,
    },
    rewardLKR: data.rewardLKR,
    status: REQUEST_STATUS.OPEN,
    trackingCode,
    deliveryPin,
    expiresAt,
  });

  // Notify sender their request is live, including their delivery PIN.
  await sendSMS(data.sender.phone, smsTemplates.requestPosted(trackingCode, deliveryPin));
  if (data.sender.email) {
    const e = emailTemplates.requestPosted(trackingCode, deliveryPin);
    await sendEmail(data.sender.email, e.subject, e.html);
  }
  await notify(currentUser._id, {
    type: NOTIFICATION_TYPES.PARCEL_CREATED,
    title: `Request posted: ${trackingCode}`,
    body: `Your parcel request is live. Payment method: Cash.`,
    link: `/track/${trackingCode}`,
  });
  await notify(currentUser._id, {
    type: NOTIFICATION_TYPES.PIN_GENERATED,
    title: `Your delivery PIN for ${trackingCode}`,
    body: `PIN: ${deliveryPin}. Share this only with the person receiving the parcel.`,
    link: `/track/${trackingCode}`,
  });

  // Fire route alerts to matching couriers (non-blocking best effort).
  triggerRouteAlerts(doc).catch((e) => console.error("[ROUTE ALERTS]", e));

  return ok(
    {
      trackingCode,
      id: doc._id.toString(),
      deliveryPin,
    },
    201
  );
});

export const dynamic = "force-dynamic";

// GET /api/requests — browse OPEN requests (phone always hidden).
export const GET = handler(async (req) => {
  const { searchParams } = new URL(req.url);
  const page = Number(searchParams.get("page") || 1);
  const limit = Number(searchParams.get("limit") || 10); // Changed default limit to 10 for pagination to be visible

  const { requests, totalCount } = await fetchOpenRequests({
    fromCity: searchParams.get("fromCity") || undefined,
    toCity: searchParams.get("toCity") || undefined,
    packageType: searchParams.get("packageType") || undefined,
    minReward: searchParams.get("minReward") || undefined,
    maxWeight: searchParams.get("maxWeight") || undefined,
    limit,
    page,
  });
  
  return ok({ 
    requests,
    pagination: {
      page,
      limit,
      totalCount,
      totalPages: Math.ceil(totalCount / limit)
    }
  });
});

async function triggerRouteAlerts(doc) {
  const couriers = await User.find({
    status: "ACTIVE",
    routeAlerts: {
      $elemMatch: {
        fromCity: doc.route.fromCity,
        toCity: doc.route.toCity,
        active: true,
      },
    },
  });

  await Promise.all(
    couriers.map(async (t) => {
      await notify(t._id, {
        type: NOTIFICATION_TYPES.ROUTE_ALERT,
        title: `New job: ${doc.route.fromCity} → ${doc.route.toCity}`,
        body: `Reward LKR ${doc.rewardLKR.toLocaleString()}`,
        link: `/parcels/${doc._id.toString()}`,
      });
      if (t.phone) {
        await sendSMS(
          t.phone,
          smsTemplates.routeAlert(
            doc.route.fromCity,
            doc.route.toCity,
            doc.rewardLKR,
            doc.trackingCode
          )
        );
      }
      if (t.email) {
        const e = emailTemplates.routeAlert(
          doc.route.fromCity,
          doc.route.toCity,
          doc.rewardLKR,
          doc.trackingCode
        );
        await sendEmail(t.email, e.subject, e.html);
      }
    })
  );
}

