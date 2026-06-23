import { STATUS_FLOW, STATUS_LABELS, REQUEST_STATUS } from "@/lib/constants";
import Icon from "@/components/Icon";

// Visual progress bar: Posted -> Matched -> Collected -> In Transit -> Delivered -> Confirmed
export default function StatusTracker({ status }) {
  const isCancelled =
    status === REQUEST_STATUS.CANCELLED || status === REQUEST_STATUS.EXPIRED;
  const currentIndex = STATUS_FLOW.indexOf(status);

  if (isCancelled) {
    return (
      <div className="rounded-lg bg-red-50 px-4 py-3 text-sm font-semibold text-danger">
        This request was {status === REQUEST_STATUS.EXPIRED ? "expired" : "cancelled"}.
      </div>
    );
  }

  return (
    <div className="flex w-full items-center">
      {STATUS_FLOW.map((step, i) => {
        const done = i <= currentIndex;
        const active = i === currentIndex;
        return (
          <div key={step} className="flex flex-1 items-center last:flex-none">
            <div className="flex flex-col items-center">
              <div
                className={`flex h-9 w-9 items-center justify-center rounded-full border-2 text-sm font-bold transition-colors ${
                  done
                    ? "border-success bg-success text-white"
                    : "border-border bg-white text-muted"
                } ${active ? "ring-4 ring-success/20" : ""}`}
              >
                {done ? <Icon name="check" className="h-4 w-4" strokeWidth={3} /> : i + 1}
              </div>
              <span
                className={`mt-2 max-w-[64px] text-center text-[11px] font-semibold ${
                  done ? "text-navy" : "text-muted"
                }`}
              >
                {STATUS_LABELS[step]}
              </span>
            </div>
            {i < STATUS_FLOW.length - 1 && (
              <div
                className={`mx-1 h-1 flex-1 rounded-full ${
                  i < currentIndex ? "bg-success" : "bg-border"
                }`}
              />
            )}
          </div>
        );
      })}
    </div>
  );
}
