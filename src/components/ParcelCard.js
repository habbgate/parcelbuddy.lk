import Link from "next/link";
import { PACKAGE_TYPE_LABELS } from "@/lib/constants";
import { timeAgo } from "@/lib/format";

export default function ParcelCard({ request, href, cta = "View & Accept →" }) {
  return (
    <div className="card flex flex-col gap-3 transition hover:shadow-md">
      <div className="flex items-start justify-between">
        <div className="text-lg font-extrabold text-navy">
          {request.route.fromCity} <span className="text-orange">→</span>{" "}
          {request.route.toCity}
        </div>
        {request.parcel.isFragile && (
          <span className="badge badge-red">Fragile</span>
        )}
      </div>

      <div className="text-sm text-muted">
        {request.parcel.weightKg} kg ·{" "}
        {PACKAGE_TYPE_LABELS[request.parcel.packageType]} ·{" "}
        {request.parcel.description}
      </div>

      <div className="flex items-center justify-between text-sm text-muted">
        <span>By {request.senderName}</span>
        {request.route.neededBy && (
          <span>
            Needed by{" "}
            {new Date(request.route.neededBy).toLocaleDateString("en-GB", {
              day: "numeric",
              month: "short",
            })}
          </span>
        )}
      </div>

      <div className="flex items-end justify-between border-t border-border pt-3">
        <div>
          <div className="text-xs font-semibold uppercase text-muted">Reward</div>
          <div className="mono text-2xl font-bold text-success">
            LKR {request.rewardLKR.toLocaleString()}
          </div>
        </div>
        <div className="text-right">
          <div className="mb-1 text-xs text-muted">{timeAgo(request.createdAt)}</div>
          {href && (
            <Link href={href} className="btn-primary !py-2 !px-4 text-sm">
              {cta}
            </Link>
          )}
        </div>
      </div>
    </div>
  );
}
