import { motion } from "framer-motion";
import { DangerWindow } from "@/types";
import { Badge } from "@/components/ui/badge";

const riskStyles = {
  high: {
    border: "border-l-red-500",
    glow: "bg-red-500",
    chip: "bg-red-500/15 text-red-400 border-red-500/20",
  },
  medium: {
    border: "border-l-yellow-500",
    glow: "bg-yellow-500",
    chip: "bg-yellow-500/15 text-yellow-400 border-yellow-500/20",
  },
  low: {
    border: "border-l-green-500",
    glow: "bg-green-500",
    chip: "bg-green-500/15 text-green-400 border-green-500/20",
  },
};

interface DangerTimelineProps {
  windows: DangerWindow[];
}

export function DangerTimeline({ windows }: DangerTimelineProps) {
  return (
    <div className="space-y-6">
      <div className="bg-white/[0.04] border border-white/[0.08] rounded-xl p-4 text-sm text-gray-400 backdrop-blur-sm">
        Most of your unhealthy decisions happen during these time windows.
      </div>

      <div className="relative space-y-0">
        {/* Vertical line with gradient */}
        <div className="absolute left-[11px] top-2 bottom-2 w-[1px] bg-gradient-to-b from-white/20 via-white/10 to-transparent" />

        {windows.map((w, i) => {
          const s = riskStyles[w.risk];
          return (
            <motion.div
              key={i}
              initial={{ opacity: 0, x: -10 }}
              whileInView={{ opacity: 1, x: 0 }}
              transition={{ delay: i * 0.1 }}
              viewport={{ once: true }}
              className="relative flex gap-6 pb-8 last:pb-0"
            >
              {/* Dot with glow effect */}
              <div className="relative z-10 mt-1.5 shrink-0">
                <div className={`w-[22px] h-[22px] rounded-full border-2 border-[#0a0a0f] ${s.glow} shadow-[0_0_10px_rgba(255,255,255,0.2)]`} />
                <div className={`absolute inset-0 rounded-full blur-md opacity-40 ${s.glow}`} />
              </div>

              {/* Card with subtle glass effect */}
              <div
                className={`flex-1 border-l-4 ${s.border} bg-white/[0.03] backdrop-blur-md p-5 rounded-r-2xl border border-white/[0.05] hover:border-white/20 transition-all duration-300 group`}
              >
                <div className="flex items-start justify-between gap-4 mb-2">
                  <h4 className="font-bold text-lg tracking-tight text-white group-hover:text-teal-300 transition-colors">
                    {w.timeRange}
                  </h4>
                  <Badge
                    variant="outline"
                    className={`shrink-0 uppercase text-[10px] font-bold tracking-widest px-2.5 py-0.5 ${s.chip}`}
                  >
                    {w.risk} risk
                  </Badge>
                </div>
                
                <p className="text-sm text-gray-400 leading-relaxed mb-4">
                  {w.reason}
                </p>

                <div className="flex items-center gap-2 text-xs">
                  <span className="font-mono text-teal-400/60 uppercase tracking-widest">Impact</span>
                  <div className="h-[1px] flex-1 bg-white/[0.06]" />
                  <span className="text-gray-300 italic">{w.impact}</span>
                </div>
              </div>
            </motion.div>
          );
        })}
      </div>
    </div>
  );
}

