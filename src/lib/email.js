import nodemailer from "nodemailer";

// Lazily-created SMTP transport. Cached across hot reloads / invocations.
let transporter = global._mailer || null;

function getTransporter() {
  if (transporter) return transporter;
  if (!process.env.SMTP_HOST || !process.env.SMTP_USER) return null;
  transporter = nodemailer.createTransport({
    host: process.env.SMTP_HOST,
    port: Number(process.env.SMTP_PORT || 587),
    secure: Number(process.env.SMTP_PORT) === 465, // 465 = implicit TLS
    auth: {
      user: process.env.SMTP_USER,
      pass: process.env.SMTP_PASS,
    },
  });
  global._mailer = transporter;
  return transporter;
}

/**
 * Send an email. Mirrors sendSMS: in dev without SMTP creds it logs to the
 * console so flows can be exercised without sending real mail.
 * @returns {Promise<{ok: boolean, simulated?: boolean, error?: string}>}
 */
export async function sendEmail(to, subject, html) {
  if (!to) return { ok: false, error: "No recipient" };

  const t = getTransporter();
  if (!t) {
    const text = String(html).replace(/<[^>]+>/g, " ").replace(/\s+/g, " ").trim();
    console.log(`\n[EMAIL SIMULATED] -> ${to}\nSubject: ${subject}\n${text}\n`);
    return { ok: true, simulated: true };
  }

  try {
    await t.sendMail({
      from: process.env.MAIL_FROM || process.env.SMTP_USER,
      to,
      subject,
      html,
    });
    return { ok: true };
  } catch (err) {
    console.error("[EMAIL ERROR]", err);
    return { ok: false, error: err.message };
  }
}

const base = () => process.env.NEXT_PUBLIC_BASE_URL || "https://parcelbuddy.lk";

// Shared branded wrapper so every email looks consistent.
function layout(heading, bodyHtml, cta) {
  const button = cta
    ? `<a href="${cta.href}" style="display:inline-block;background:#F47C20;color:#fff;text-decoration:none;font-weight:700;padding:12px 22px;border-radius:8px;margin-top:16px">${cta.label}</a>`
    : "";
  return `
  <div style="background:#F8FAFC;padding:24px;font-family:Inter,Arial,sans-serif;color:#1A2B4A">
    <div style="max-width:520px;margin:0 auto;background:#fff;border:1px solid #E2E8F0;border-radius:14px;overflow:hidden">
      <div style="background:#1A2B4A;padding:18px 24px;color:#fff;font-size:20px;font-weight:800">
        Parcel<span style="color:#F47C20">Buddy</span>
      </div>
      <div style="padding:24px">
        <h1 style="font-size:20px;margin:0 0 12px">${heading}</h1>
        <div style="font-size:15px;line-height:1.6;color:#334155">${bodyHtml}</div>
        ${button}
      </div>
      <div style="padding:16px 24px;border-top:1px solid #E2E8F0;font-size:12px;color:#64748B">
        Your phone stays private — always. · ${base()}
      </div>
    </div>
  </div>`;
}

// Templates return { subject, html }. Mirrors smsTemplates in lib/sms.js.
export const emailTemplates = {
  requestPosted: (code, pin) => ({
    subject: `Your request ${code} is live`,
    html: layout(
      "Your parcel request is live!",
      `Your request <b>${code}</b> is now visible to verified couriers on your route. We'll let you know the moment someone accepts it.<br/><br/>
      Your delivery PIN is:<div style="font-size:32px;font-weight:800;letter-spacing:6px;color:#F47C20;margin-top:10px">${pin}</div>
      <p style="margin-top:12px;font-size:13px;color:#B45309;background:#FFFBEB;border:1px solid #FDE68A;border-radius:8px;padding:10px 12px">
        <b>Share this PIN only with the person receiving the parcel.</b> Do not share it with anyone else. The courier will ask for it to confirm the handoff.
      </p>`,
      { label: "Track your parcel", href: `${base()}/track/${code}` }
    ),
  }),
  accepted: (code) => ({
    subject: `A courier accepted ${code}`,
    html: layout(
      "A verified courier accepted your request",
      `Good news! A verified courier has accepted <b>${code}</b> and will contact you shortly to arrange pickup. Payment method: <b>Cash</b>, arranged directly with the courier.`,
      { label: "Track your parcel", href: `${base()}/track/${code}` }
    ),
  }),
  collected: (code) => ({
    subject: `${code} collected and on the way`,
    html: layout(
      "Your parcel is on the move",
      `Your parcel <b>${code}</b> has been collected and is now on its way to the destination.`,
      { label: "Track your parcel", href: `${base()}/track/${code}` }
    ),
  }),
  inTransit: (code) => ({
    subject: `${code} is in transit`,
    html: layout(
      "Your parcel is in transit",
      `Update: your parcel <b>${code}</b> is now in transit and heading to the destination.`,
      { label: "Track your parcel", href: `${base()}/track/${code}` }
    ),
  }),
  delivered: (code) => ({
    subject: `${code} delivered`,
    html: layout(
      "Your parcel was delivered",
      `<b>${code}</b> has been delivered and confirmed with your delivery PIN. Thanks for using ParcelBuddy!`,
      { label: "View delivery", href: `${base()}/track/${code}` }
    ),
  }),
  idApproved: () => ({
    subject: "Your identity is verified",
    html: layout(
      "You're verified!",
      `Your identity has been approved. You can now accept delivery jobs and start earning.`,
      { label: "Browse jobs", href: `${base()}/parcels` }
    ),
  }),
  idRejected: (reason) => ({
    subject: "ID verification needs attention",
    html: layout(
      "We couldn't verify your ID",
      `Your identity verification was not approved.${reason ? ` Reason: <b>${reason}</b>.` : ""} Please resubmit clear photos of your document.`,
      { label: "Resubmit documents", href: `${base()}/verify-identity` }
    ),
  }),
  jobAcceptedCourier: (code, name, phone) => ({
    subject: `Job confirmed: ${code}`,
    html: layout(
      "Job confirmed",
      `You accepted <b>${code}</b>.<br/>Sender: <b>${name}</b><br/>Phone: <b>${phone}</b><br/>Payment: <b>Cash</b>, arranged directly with the sender.<br/>Head to your dashboard for full details and chat.`,
      { label: "Open dashboard", href: `${base()}/dashboard` }
    ),
  }),
  otp: (code) => ({
    subject: "Your ParcelBuddy verification code",
    html: layout(
      "Verify your phone",
      `Your verification code is:<div style="font-size:32px;font-weight:800;letter-spacing:6px;color:#F47C20;margin-top:10px">${code}</div><br/>This code is valid for 10 minutes.`
    ),
  }),
  passwordReset: (link) => ({
    subject: "Reset your ParcelBuddy password",
    html: layout(
      "Password reset",
      `We received a request to reset your password. This link is valid for 30 minutes. If you didn't request this, you can ignore this email.`,
      { label: "Reset password", href: link }
    ),
  }),
  routeAlert: (from, to, reward, code) => ({
    subject: `New job on your route: ${from} → ${to}`,
    html: layout(
      `New job: ${from} → ${to}`,
      `A new parcel matching your saved route was just posted. Reward: <b>LKR ${Number(reward).toLocaleString()}</b>.`,
      { label: "View the job", href: `${base()}/parcels` }
    ),
  }),
};

