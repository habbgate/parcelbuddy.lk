// Notify.lk SMS integration.
// Docs: https://notify.lk/  — endpoint: https://app.notify.lk/api/v1/send

const NOTIFY_URL = "https://app.notify.lk/api/v1/send";

/**
 * Normalize a Sri Lankan phone number to Notify.lk format (94XXXXXXXXX).
 */
export function normalizeLKPhone(phone) {
  let p = String(phone).replace(/\s+/g, "");
  if (p.startsWith("+")) p = p.slice(1);
  if (p.startsWith("0")) p = "94" + p.slice(1);
  if (!p.startsWith("94")) p = "94" + p;
  return p;
}

/**
 * Send an SMS via Notify.lk. In development (no API key) the message is
 * logged to the console so the full flow can be exercised without credentials.
 * @returns {Promise<{ok: boolean, simulated?: boolean, error?: string}>}
 */
export async function sendSMS(to, message) {
  const userId = process.env.NOTIFY_LK_USER_ID;
  const apiKey = process.env.NOTIFY_LK_API_KEY;
  const senderId = process.env.NOTIFY_LK_SENDER_ID || "NotifyDEMO";

  if (!userId || !apiKey) {
    console.log(`\n[SMS SIMULATED] -> ${to}\n${message}\n`);
    return { ok: true, simulated: true };
  }

  try {
    const params = new URLSearchParams({
      user_id: userId,
      api_key: apiKey,
      sender_id: senderId,
      to: normalizeLKPhone(to),
      message,
    });

    const res = await fetch(`${NOTIFY_URL}?${params.toString()}`, {
      method: "POST",
    });
    const data = await res.json().catch(() => ({}));

    if (data?.status === "success") return { ok: true };
    return { ok: false, error: data?.message || "SMS send failed" };
  } catch (err) {
    console.error("[SMS ERROR]", err);
    return { ok: false, error: err.message };
  }
}

const base = () => process.env.NEXT_PUBLIC_BASE_URL || "https://parcelbuddy.lk";

// Pre-built message templates matching the spec.
export const smsTemplates = {
  requestPosted: (code) =>
    `ParcelBuddy: Your request ${code} is live! Track: ${base()}/track/${code}`,
  accepted: (code) =>
    `A verified traveler accepted ${code}. They will contact you shortly.`,
  collected: (code) =>
    `Your parcel ${code} has been collected and is on the way!`,
  inTransit: (code) =>
    `Update: ${code} is now in transit and heading to the destination.`,
  delivered: (code, token) =>
    `${code} delivered! Confirm here: ${base()}/track/${code}?confirm=${token}`,
  idApproved: () =>
    `Your identity is verified! You can now accept delivery jobs. ${base()}/parcels`,
  idRejected: () =>
    `ID verification failed. Please resubmit: ${base()}/verify-identity`,
  jobAcceptedTraveler: (name, phone) =>
    `Job confirmed! Sender: ${name} | ${phone}. Check dashboard for details.`,
  otp: (code) => `Your ParcelBuddy verification code is ${code}. Valid for 10 minutes.`,
  routeAlert: (from, to, reward, code) =>
    `New job on your route ${from} → ${to}! Reward LKR ${reward}. ${base()}/parcels`,
};

