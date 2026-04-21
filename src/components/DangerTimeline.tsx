import { DangerWindow } from "@/types";
import { Badge } from "@/components/ui/badge";

const riskStyles = {
  high: {
    border: "border-red-500",
    bg: "bg-red-50",
    dot: "bg-red-500",
    badge: "bg-red-100 text-red-600 border-red-200",
    text: "text-red-700",
  },
  medium: {
    border: "border-yellow-500",
    bg: "bg-yellow-50",
    dot: "bg-yellow-500",
    badge: "bg-yellow-100 text-yellow-700 border-yellow-200",
    text: "text-yellow-700",
  },
  low: {
    border: "border-green-500",
    bg: "bg-green-50",
    dot: "bg-green-500",
    badge: "bg-green-100 text-green-700 border-green-200",
    text: "text-green-700",
  },
};

interface DangerTimelineProps {
  windows: DangerWindow[];
}

export function DangerTimeline({ windows }: DangerTimelineProps) {
  return (
    <div className="space-y-4">
      <div className="p-3 bg-gray-100 rounded-lg text-sm text-gray-600">
        Most of your unhealthy decisions happen during these time windows.
      </div>

      <div className="relative space-y-0">
        {/* Vertical line */}
        <div className="absolute left-[11px] top-2 bottom-2 w-0.5 bg-gray-200" />

        {windows.map((w, i) => {
          const s = riskStyles[w.risk];
          return (
            <div key={i} className="relative flex gap-4 pb-6 last:pb-0">
              {/* Dot on the timeline */}
              <div
                className={`relative z-10 mt-1.5 w-[22px] h-[22px] shrink-0 rounded-full border-2 border-white ${s.dot} shadow-sm`}
              />

              {/* Card */}
              <div
                className={`flex-1 border-l-4 ${s.border} ${s.bg} p-4 rounded-r-xl`}
              >
                <div className="flex items-start justify-between gap-3 mb-1">
                  <h4 className={`font-bold text-lg ${s.text}`}>
                    {w.timeRange}
                  </h4>
                  <Badge
                    variant="outline"
                    className={`shrink-0 uppercase text-[10px] font-bold tracking-wider ${s.badge}`}
                  >
                    {w.risk} risk
                  </Badge>
                </div>
                <p className="text-sm text-gray-600 leading-relaxed">
                  {w.reason}
                </p>
                <div className="mt-2 text-xs text-gray-500">
                  <span className="font-bold text-gray-700 uppercase tracking-tighter mr-1">Impact:</span>
                  {w.impact}
                </div>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}
