import { STATUS_COLORS, STATUS_LABELS } from "@/lib/constants";

export default function StatusBadge({ status }) {
  const color = STATUS_COLORS[status] || "gray";
  const label = STATUS_LABELS[status] || status;
  return <span className={`badge badge-${color}`}>{label}</span>;
}
