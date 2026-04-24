import { cn } from "@/lib/utils";
import { Star } from "lucide-react";

interface StarRatingProps {
  rating: number;
  max?: number;
  size?: "sm" | "md" | "lg";
  showValue?: boolean;
  reviewCount?: number;
  className?: string;
}

const sizeMap = {
  sm: "w-3 h-3",
  md: "w-4 h-4",
  lg: "w-5 h-5",
};

const textSizeMap = {
  sm: "text-xs",
  md: "text-sm",
  lg: "text-base",
};

export function StarRating({
  rating,
  max = 5,
  size = "sm",
  showValue = true,
  reviewCount,
  className,
}: StarRatingProps) {
  return (
    <div className={cn("flex items-center gap-1", className)}>
      <div className="flex items-center gap-0.5">
        {Array.from({ length: max }, (_, i) => i).map((i) => {
          const filled = i < Math.floor(rating);
          const partial = !filled && i < rating;
          return (
            <span key={i} className="relative inline-block">
              <Star
                className={cn(sizeMap[size], "text-muted/60")}
                fill="currentColor"
              />
              {(filled || partial) && (
                <span
                  className="absolute inset-0 overflow-hidden"
                  style={{ width: partial ? `${(rating % 1) * 100}%` : "100%" }}
                >
                  <Star
                    className={cn(sizeMap[size], "text-secondary")}
                    fill="currentColor"
                  />
                </span>
              )}
            </span>
          );
        })}
      </div>
      {showValue && (
        <span
          className={cn("font-semibold text-foreground", textSizeMap[size])}
        >
          {rating.toFixed(1)}
        </span>
      )}
      {reviewCount !== undefined && (
        <span className={cn("text-muted-foreground", textSizeMap[size])}>
          ({reviewCount.toLocaleString()})
        </span>
      )}
    </div>
  );
}
