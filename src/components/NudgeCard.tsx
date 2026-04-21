import { Nudge } from "@/types";
import { Card, CardContent } from "@/components/ui/card";

interface NudgeCardProps {
  nudge: Nudge;
}

export function NudgeCard({ nudge }: NudgeCardProps) {
  return (
    <Card className="border-green-100 bg-green-50/60 overflow-hidden">
      <CardContent className="pt-5 pb-4 space-y-2">
        <h3 className="font-bold text-green-800 text-base">
          {nudge.title}
        </h3>
        <p className="text-sm text-green-900 leading-relaxed">
          👉 {nudge.action}
        </p>
        <div className="text-xs text-green-700 bg-white/60 px-3 py-1.5 rounded-md inline-block mt-1">
          💡 Improves {nudge.benefit}
        </div>
        <p className="text-[11px] text-green-800/60 italic pt-2 border-t border-green-200/50">
          {nudge.reasoning}
        </p>
      </CardContent>
    </Card>
  );
}
