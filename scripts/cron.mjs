// Hourly cron runner. Schedule this with the OS scheduler / a managed cron.
// It calls the protected /api/cron endpoint.
const base = process.env.NEXT_PUBLIC_BASE_URL || "http://localhost:3000";
const secret = process.env.CRON_SECRET || "dev_cron_secret_change_me";

const res = await fetch(`${base}/api/cron`, {
  method: "POST",
  headers: { Authorization: `Bearer ${secret}` },
});
const data = await res.json();
console.log(new Date().toISOString(), "cron result:", data);
