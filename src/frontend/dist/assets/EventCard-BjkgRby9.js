import { j as jsxRuntimeExports, b as cn, B as Button, L as Link } from "./index-BV_UP3b9.js";
import { B as Badge } from "./sampleEvents-BX7lNiZr.js";
import { a as Card, H as Heart, b as CardContent, c as CountdownTimer, C as Calendar, U as Users, d as StarRating } from "./StarRating-ClFg-aro.js";
import { M as MapPin } from "./map-pin-_Y7De1KV.js";
const CATEGORY_COLORS = {
  Music: "bg-primary/10 text-primary border-primary/20",
  Conference: "bg-accent/10 text-accent border-accent/20",
  Workshop: "bg-secondary/10 text-secondary border-secondary/20",
  Sports: "bg-green-500/10 text-green-600 border-green-500/20",
  Arts: "bg-pink-500/10 text-pink-600 border-pink-500/20",
  Business: "bg-amber-500/10 text-amber-600 border-amber-500/20"
};
function formatDate(ns) {
  const ms = Number(ns / BigInt(1e6));
  return new Date(ms).toLocaleDateString("en-US", {
    weekday: "short",
    month: "short",
    day: "numeric",
    year: "numeric"
  });
}
const PLACEHOLDER = "/assets/images/placeholder.svg";
function EventCard({
  event,
  isFavorite,
  onToggleFavorite,
  index = 0
}) {
  const seatsLeft = Number(event.availableSeats);
  const lowSeats = seatsLeft > 0 && seatsLeft < 50;
  const soldOut = seatsLeft === 0;
  const categoryStyle = CATEGORY_COLORS[event.category] ?? "bg-muted text-muted-foreground border-border";
  return /* @__PURE__ */ jsxRuntimeExports.jsxs(
    Card,
    {
      className: "group overflow-hidden border border-border hover:border-primary/30 hover:shadow-lg transition-smooth bg-card",
      "data-ocid": `event_card.item.${index + 1}`,
      children: [
        /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "relative overflow-hidden aspect-[16/9]", children: [
          /* @__PURE__ */ jsxRuntimeExports.jsx(
            "img",
            {
              src: event.imageUrl || PLACEHOLDER,
              alt: event.title,
              className: "w-full h-full object-cover transition-transform duration-500 group-hover:scale-105",
              onError: (e) => {
                e.currentTarget.src = PLACEHOLDER;
              }
            }
          ),
          /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "absolute top-3 left-3 flex items-center gap-2", children: [
            /* @__PURE__ */ jsxRuntimeExports.jsx(
              Badge,
              {
                className: cn("text-xs font-semibold border", categoryStyle),
                variant: "outline",
                children: event.category
              }
            ),
            soldOut && /* @__PURE__ */ jsxRuntimeExports.jsx(Badge, { variant: "destructive", className: "text-xs font-semibold", children: "Sold Out" }),
            lowSeats && !soldOut && /* @__PURE__ */ jsxRuntimeExports.jsxs(Badge, { className: "text-xs font-semibold bg-secondary/90 text-secondary-foreground border-0", children: [
              seatsLeft,
              " left"
            ] })
          ] }),
          /* @__PURE__ */ jsxRuntimeExports.jsx(
            "button",
            {
              type: "button",
              onClick: (e) => {
                e.preventDefault();
                e.stopPropagation();
                onToggleFavorite(event.id);
              },
              className: cn(
                "absolute top-3 right-3 w-8 h-8 rounded-full flex items-center justify-center transition-smooth shadow-sm",
                isFavorite ? "bg-destructive text-destructive-foreground" : "bg-card/80 backdrop-blur-sm text-muted-foreground hover:text-destructive hover:bg-card"
              ),
              "aria-label": isFavorite ? "Remove from favorites" : "Add to favorites",
              "data-ocid": `event_card.favorite_button.${index + 1}`,
              children: /* @__PURE__ */ jsxRuntimeExports.jsx(
                Heart,
                {
                  className: "w-4 h-4",
                  fill: isFavorite ? "currentColor" : "none"
                }
              )
            }
          ),
          /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "absolute bottom-3 right-3", children: /* @__PURE__ */ jsxRuntimeExports.jsx("span", { className: "bg-card/90 backdrop-blur-sm font-display font-bold text-sm px-2.5 py-1 rounded-lg text-foreground shadow-sm", children: event.price === 0 ? "Free" : `$${event.price}` }) })
        ] }),
        /* @__PURE__ */ jsxRuntimeExports.jsxs(CardContent, { className: "p-4", children: [
          /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "mb-2", children: /* @__PURE__ */ jsxRuntimeExports.jsx(CountdownTimer, { targetDate: event.date, compact: true }) }),
          /* @__PURE__ */ jsxRuntimeExports.jsx("h3", { className: "font-display font-bold text-base text-foreground leading-snug mb-2 line-clamp-2 group-hover:text-primary transition-colors duration-200", children: event.title }),
          /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "space-y-1.5 mb-3", children: [
            /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex items-center gap-1.5 text-muted-foreground min-w-0", children: [
              /* @__PURE__ */ jsxRuntimeExports.jsx(Calendar, { className: "w-3.5 h-3.5 shrink-0" }),
              /* @__PURE__ */ jsxRuntimeExports.jsx("span", { className: "text-xs truncate", children: formatDate(event.date) })
            ] }),
            /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex items-center gap-1.5 text-muted-foreground min-w-0", children: [
              /* @__PURE__ */ jsxRuntimeExports.jsx(MapPin, { className: "w-3.5 h-3.5 shrink-0" }),
              /* @__PURE__ */ jsxRuntimeExports.jsx("span", { className: "text-xs truncate", children: event.city })
            ] }),
            !soldOut && /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex items-center gap-1.5 text-muted-foreground min-w-0", children: [
              /* @__PURE__ */ jsxRuntimeExports.jsx(Users, { className: "w-3.5 h-3.5 shrink-0" }),
              /* @__PURE__ */ jsxRuntimeExports.jsxs("span", { className: "text-xs", children: [
                seatsLeft.toLocaleString(),
                " seats available"
              ] })
            ] })
          ] }),
          /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex items-center justify-between gap-2", children: [
            /* @__PURE__ */ jsxRuntimeExports.jsx(
              StarRating,
              {
                rating: event.rating,
                reviewCount: Number(event.reviewCount),
                size: "sm"
              }
            ),
            /* @__PURE__ */ jsxRuntimeExports.jsx(
              Button,
              {
                asChild: true,
                size: "sm",
                disabled: soldOut,
                className: cn(
                  "text-xs font-semibold h-8 px-3 shrink-0",
                  soldOut ? "opacity-50 cursor-not-allowed" : "bg-primary hover:bg-primary/90 text-primary-foreground"
                ),
                "data-ocid": `event_card.view_button.${index + 1}`,
                children: /* @__PURE__ */ jsxRuntimeExports.jsx(Link, { to: "/events/$id", params: { id: event.id.toString() }, children: soldOut ? "Sold Out" : "View Details" })
              }
            )
          ] })
        ] })
      ]
    }
  );
}
export {
  EventCard as E
};
