import { cn } from "@/lib/utils";
import { Clock } from "lucide-react";
import { useEffect, useState } from "react";

interface CountdownTimerProps {
  targetDate: bigint; // nanoseconds
  className?: string;
  compact?: boolean;
}

interface TimeLeft {
  days: number;
  hours: number;
  minutes: number;
  seconds: number;
}

function getTimeLeft(targetNs: bigint): TimeLeft | null {
  const targetMs = Number(targetNs / BigInt(1_000_000));
  const diff = targetMs - Date.now();
  if (diff <= 0) return null;

  const totalSeconds = Math.floor(diff / 1000);
  return {
    days: Math.floor(totalSeconds / 86400),
    hours: Math.floor((totalSeconds % 86400) / 3600),
    minutes: Math.floor((totalSeconds % 3600) / 60),
    seconds: totalSeconds % 60,
  };
}

function pad(n: number) {
  return String(n).padStart(2, "0");
}

export function CountdownTimer({
  targetDate,
  className,
  compact = false,
}: CountdownTimerProps) {
  const [timeLeft, setTimeLeft] = useState<TimeLeft | null>(() =>
    getTimeLeft(targetDate),
  );

  useEffect(() => {
    const id = setInterval(() => {
      setTimeLeft(getTimeLeft(targetDate));
    }, 1000);
    return () => clearInterval(id);
  }, [targetDate]);

  if (!timeLeft) {
    return (
      <div
        className={cn(
          "flex items-center gap-1.5 text-muted-foreground",
          className,
        )}
      >
        <Clock className="w-3.5 h-3.5" />
        <span className="text-xs font-medium">Event has passed</span>
      </div>
    );
  }

  if (compact) {
    const display =
      timeLeft.days > 0
        ? `${timeLeft.days}d ${pad(timeLeft.hours)}h`
        : `${pad(timeLeft.hours)}h ${pad(timeLeft.minutes)}m`;
    return (
      <div className={cn("flex items-center gap-1.5", className)}>
        <Clock className="w-3.5 h-3.5 text-secondary" />
        <span className="text-xs font-semibold text-secondary">
          {display} left
        </span>
      </div>
    );
  }

  const units = [
    { label: "Days", value: timeLeft.days },
    { label: "Hours", value: timeLeft.hours },
    { label: "Mins", value: timeLeft.minutes },
    { label: "Secs", value: timeLeft.seconds },
  ];

  return (
    <div className={cn("flex items-center gap-2", className)}>
      <Clock className="w-4 h-4 text-secondary shrink-0" />
      <div className="flex items-center gap-1.5">
        {units.map((unit, i) => (
          <div key={unit.label} className="flex items-center gap-1.5">
            <div className="flex flex-col items-center">
              <span className="font-display font-bold text-lg leading-none text-foreground tabular-nums">
                {pad(unit.value)}
              </span>
              <span className="text-[10px] text-muted-foreground uppercase tracking-wide">
                {unit.label}
              </span>
            </div>
            {i < units.length - 1 && (
              <span className="text-muted-foreground font-bold text-lg leading-none mb-2">
                :
              </span>
            )}
          </div>
        ))}
      </div>
    </div>
  );
}
