import { c as createLucideIcon, j as jsxRuntimeExports, b as cn, r as reactExports } from "./index-BV_UP3b9.js";
import { C as Clock } from "./clock-DcPweK9z.js";
/**
 * @license lucide-react v0.511.0 - ISC
 *
 * This source code is licensed under the ISC license.
 * See the LICENSE file in the root directory of this source tree.
 */
const __iconNode$3 = [
  ["path", { d: "M8 2v4", key: "1cmpym" }],
  ["path", { d: "M16 2v4", key: "4m81vk" }],
  ["rect", { width: "18", height: "18", x: "3", y: "4", rx: "2", key: "1hopcy" }],
  ["path", { d: "M3 10h18", key: "8toen8" }]
];
const Calendar = createLucideIcon("calendar", __iconNode$3);
/**
 * @license lucide-react v0.511.0 - ISC
 *
 * This source code is licensed under the ISC license.
 * See the LICENSE file in the root directory of this source tree.
 */
const __iconNode$2 = [
  [
    "path",
    {
      d: "M19 14c1.49-1.46 3-3.21 3-5.5A5.5 5.5 0 0 0 16.5 3c-1.76 0-3 .5-4.5 2-1.5-1.5-2.74-2-4.5-2A5.5 5.5 0 0 0 2 8.5c0 2.3 1.5 4.05 3 5.5l7 7Z",
      key: "c3ymky"
    }
  ]
];
const Heart = createLucideIcon("heart", __iconNode$2);
/**
 * @license lucide-react v0.511.0 - ISC
 *
 * This source code is licensed under the ISC license.
 * See the LICENSE file in the root directory of this source tree.
 */
const __iconNode$1 = [
  [
    "path",
    {
      d: "M11.525 2.295a.53.53 0 0 1 .95 0l2.31 4.679a2.123 2.123 0 0 0 1.595 1.16l5.166.756a.53.53 0 0 1 .294.904l-3.736 3.638a2.123 2.123 0 0 0-.611 1.878l.882 5.14a.53.53 0 0 1-.771.56l-4.618-2.428a2.122 2.122 0 0 0-1.973 0L6.396 21.01a.53.53 0 0 1-.77-.56l.881-5.139a2.122 2.122 0 0 0-.611-1.879L2.16 9.795a.53.53 0 0 1 .294-.906l5.165-.755a2.122 2.122 0 0 0 1.597-1.16z",
      key: "r04s7s"
    }
  ]
];
const Star = createLucideIcon("star", __iconNode$1);
/**
 * @license lucide-react v0.511.0 - ISC
 *
 * This source code is licensed under the ISC license.
 * See the LICENSE file in the root directory of this source tree.
 */
const __iconNode = [
  ["path", { d: "M16 21v-2a4 4 0 0 0-4-4H6a4 4 0 0 0-4 4v2", key: "1yyitq" }],
  ["path", { d: "M16 3.128a4 4 0 0 1 0 7.744", key: "16gr8j" }],
  ["path", { d: "M22 21v-2a4 4 0 0 0-3-3.87", key: "kshegd" }],
  ["circle", { cx: "9", cy: "7", r: "4", key: "nufk8" }]
];
const Users = createLucideIcon("users", __iconNode);
function Card({ className, ...props }) {
  return /* @__PURE__ */ jsxRuntimeExports.jsx(
    "div",
    {
      "data-slot": "card",
      className: cn(
        "bg-card text-card-foreground flex flex-col gap-6 rounded-xl border py-6 shadow-sm",
        className
      ),
      ...props
    }
  );
}
function CardHeader({ className, ...props }) {
  return /* @__PURE__ */ jsxRuntimeExports.jsx(
    "div",
    {
      "data-slot": "card-header",
      className: cn(
        "@container/card-header grid auto-rows-min grid-rows-[auto_auto] items-start gap-1.5 px-6 has-data-[slot=card-action]:grid-cols-[1fr_auto] [.border-b]:pb-6",
        className
      ),
      ...props
    }
  );
}
function CardTitle({ className, ...props }) {
  return /* @__PURE__ */ jsxRuntimeExports.jsx(
    "div",
    {
      "data-slot": "card-title",
      className: cn("leading-none font-semibold", className),
      ...props
    }
  );
}
function CardContent({ className, ...props }) {
  return /* @__PURE__ */ jsxRuntimeExports.jsx(
    "div",
    {
      "data-slot": "card-content",
      className: cn("px-6", className),
      ...props
    }
  );
}
function getTimeLeft(targetNs) {
  const targetMs = Number(targetNs / BigInt(1e6));
  const diff = targetMs - Date.now();
  if (diff <= 0) return null;
  const totalSeconds = Math.floor(diff / 1e3);
  return {
    days: Math.floor(totalSeconds / 86400),
    hours: Math.floor(totalSeconds % 86400 / 3600),
    minutes: Math.floor(totalSeconds % 3600 / 60),
    seconds: totalSeconds % 60
  };
}
function pad(n) {
  return String(n).padStart(2, "0");
}
function CountdownTimer({
  targetDate,
  className,
  compact = false
}) {
  const [timeLeft, setTimeLeft] = reactExports.useState(
    () => getTimeLeft(targetDate)
  );
  reactExports.useEffect(() => {
    const id = setInterval(() => {
      setTimeLeft(getTimeLeft(targetDate));
    }, 1e3);
    return () => clearInterval(id);
  }, [targetDate]);
  if (!timeLeft) {
    return /* @__PURE__ */ jsxRuntimeExports.jsxs(
      "div",
      {
        className: cn(
          "flex items-center gap-1.5 text-muted-foreground",
          className
        ),
        children: [
          /* @__PURE__ */ jsxRuntimeExports.jsx(Clock, { className: "w-3.5 h-3.5" }),
          /* @__PURE__ */ jsxRuntimeExports.jsx("span", { className: "text-xs font-medium", children: "Event has passed" })
        ]
      }
    );
  }
  if (compact) {
    const display = timeLeft.days > 0 ? `${timeLeft.days}d ${pad(timeLeft.hours)}h` : `${pad(timeLeft.hours)}h ${pad(timeLeft.minutes)}m`;
    return /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: cn("flex items-center gap-1.5", className), children: [
      /* @__PURE__ */ jsxRuntimeExports.jsx(Clock, { className: "w-3.5 h-3.5 text-secondary" }),
      /* @__PURE__ */ jsxRuntimeExports.jsxs("span", { className: "text-xs font-semibold text-secondary", children: [
        display,
        " left"
      ] })
    ] });
  }
  const units = [
    { label: "Days", value: timeLeft.days },
    { label: "Hours", value: timeLeft.hours },
    { label: "Mins", value: timeLeft.minutes },
    { label: "Secs", value: timeLeft.seconds }
  ];
  return /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: cn("flex items-center gap-2", className), children: [
    /* @__PURE__ */ jsxRuntimeExports.jsx(Clock, { className: "w-4 h-4 text-secondary shrink-0" }),
    /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "flex items-center gap-1.5", children: units.map((unit, i) => /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex items-center gap-1.5", children: [
      /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex flex-col items-center", children: [
        /* @__PURE__ */ jsxRuntimeExports.jsx("span", { className: "font-display font-bold text-lg leading-none text-foreground tabular-nums", children: pad(unit.value) }),
        /* @__PURE__ */ jsxRuntimeExports.jsx("span", { className: "text-[10px] text-muted-foreground uppercase tracking-wide", children: unit.label })
      ] }),
      i < units.length - 1 && /* @__PURE__ */ jsxRuntimeExports.jsx("span", { className: "text-muted-foreground font-bold text-lg leading-none mb-2", children: ":" })
    ] }, unit.label)) })
  ] });
}
const sizeMap = {
  sm: "w-3 h-3",
  md: "w-4 h-4",
  lg: "w-5 h-5"
};
const textSizeMap = {
  sm: "text-xs",
  md: "text-sm",
  lg: "text-base"
};
function StarRating({
  rating,
  max = 5,
  size = "sm",
  showValue = true,
  reviewCount,
  className
}) {
  return /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: cn("flex items-center gap-1", className), children: [
    /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "flex items-center gap-0.5", children: Array.from({ length: max }, (_, i) => i).map((i) => {
      const filled = i < Math.floor(rating);
      const partial = !filled && i < rating;
      return /* @__PURE__ */ jsxRuntimeExports.jsxs("span", { className: "relative inline-block", children: [
        /* @__PURE__ */ jsxRuntimeExports.jsx(
          Star,
          {
            className: cn(sizeMap[size], "text-muted/60"),
            fill: "currentColor"
          }
        ),
        (filled || partial) && /* @__PURE__ */ jsxRuntimeExports.jsx(
          "span",
          {
            className: "absolute inset-0 overflow-hidden",
            style: { width: partial ? `${rating % 1 * 100}%` : "100%" },
            children: /* @__PURE__ */ jsxRuntimeExports.jsx(
              Star,
              {
                className: cn(sizeMap[size], "text-secondary"),
                fill: "currentColor"
              }
            )
          }
        )
      ] }, i);
    }) }),
    showValue && /* @__PURE__ */ jsxRuntimeExports.jsx(
      "span",
      {
        className: cn("font-semibold text-foreground", textSizeMap[size]),
        children: rating.toFixed(1)
      }
    ),
    reviewCount !== void 0 && /* @__PURE__ */ jsxRuntimeExports.jsxs("span", { className: cn("text-muted-foreground", textSizeMap[size]), children: [
      "(",
      reviewCount.toLocaleString(),
      ")"
    ] })
  ] });
}
export {
  Calendar as C,
  Heart as H,
  Star as S,
  Users as U,
  Card as a,
  CardContent as b,
  CountdownTimer as c,
  StarRating as d,
  CardHeader as e,
  CardTitle as f
};
