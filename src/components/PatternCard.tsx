import { Pattern } from "@/types";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";

const riskColor = {
  low: "bg-green-100 text-green-700 border-green-200",
  medium: "bg-yellow-100 text-yellow-700 border-yellow-200",
  high: "bg-red-100 text-red-600 border-red-200",
};

interface PatternCardProps {
  pattern: Pattern;
}

export function PatternCard({ pattern }: PatternCardProps) {
  return (
    <Card className="overflow-hidden">
      <CardContent className="pt-5 pb-4 space-y-3">
        <div className="flex items-start justify-between gap-3">
          <h3 className="font-semibold text-base leading-tight">
            {pattern.name}
          </h3>
          <Badge
            variant="outline"
            className={`shrink-0 uppercase text-[10px] font-bold tracking-wider ${riskColor[pattern.risk]}`}
          >
            {pattern.risk}
          </Badge>
        </div>

        <p className="text-sm text-muted-foreground">
          {pattern.timeRange} · {pattern.mood}
        </p>

        <div className="flex flex-wrap gap-1.5">
          {pattern.foods.map((food, i) => (
            <span
              key={i}
              className="text-xs bg-gray-100 text-gray-700 px-2 py-0.5 rounded-full"
            >
              {food}
            </span>
          ))}
        </div>

        <p className="text-[11px] text-gray-500 italic pt-1 border-t border-gray-50">
          <span className="font-semibold not-italic mr-1">Why:</span>
          {pattern.reasoning}
        </p>
      </CardContent>
    </Card>
  );
}
