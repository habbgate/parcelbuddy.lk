import { redirect } from "next/navigation";

// /admin → send straight to the dashboard.
export default function AdminIndex() {
  redirect("/admin/dashboard");
}
