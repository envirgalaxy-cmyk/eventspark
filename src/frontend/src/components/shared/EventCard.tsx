import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { cn } from "@/lib/utils";
import type { Event } from "@/types";
import { Link } from "@tanstack/react-router";
import { Calendar, Heart, MapPin, Users } from "lucide-react";
import { CountdownTimer } from "./CountdownTimer";
import { StarRating } from "./StarRating";

interface EventCardProps {
  event: Event;
  isFavorite: boolean;
  onToggleFavorite: (id: bigint) => void;
  index?: number;
}

const CATEGORY_COLORS: Record<string, string> = {
  Music: "bg-primary/10 text-primary border-primary/20",
  Conference: "bg-accent/10 text-accent border-accent/20",
  Workshop: "bg-secondary/10 text-secondary border-secondary/20",
  Sports: "bg-green-500/10 text-green-600 border-green-500/20",
  Arts: "bg-pink-500/10 text-pink-600 border-pink-500/20",
  Business: "bg-amber-500/10 text-amber-600 border-amber-500/20",
};

function formatDate(ns: bigint): string {
  const ms = Number(ns / BigInt(1_000_000));
  return new Date(ms).toLocaleDateString("en-US", {
    weekday: "short",
    month: "short",
    day: "numeric",
    year: "numeric",
  });
}

const PLACEHOLDER = "/assets/images/placeholder.svg";

export function EventCard({
  event,
  isFavorite,
  onToggleFavorite,
  index = 0,
}: EventCardProps) {
  const seatsLeft = Number(event.availableSeats);
  const lowSeats = seatsLeft > 0 && seatsLeft < 50;
  const soldOut = seatsLeft === 0;
  const categoryStyle =
    CATEGORY_COLORS[event.category] ??
    "bg-muted text-muted-foreground border-border";

  return (
    <Card
      className="group overflow-hidden border border-border hover:border-primary/30 hover:shadow-lg transition-smooth bg-card"
      data-ocid={`event_card.item.${index + 1}`}
    >
      {/* Image */}
      <div className="relative overflow-hidden aspect-[16/9]">
        <img
          src={event.imageUrl || PLACEHOLDER}
          alt={event.title}
          className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-105"
          onError={(e) => {
            (e.currentTarget as HTMLImageElement).src = PLACEHOLDER;
          }}
        />
        {/* Overlay badges */}
        <div className="absolute top-3 left-3 flex items-center gap-2">
          <Badge
            className={cn("text-xs font-semibold border", categoryStyle)}
            variant="outline"
          >
            {event.category}
          </Badge>
          {soldOut && (
            <Badge variant="destructive" className="text-xs font-semibold">
              Sold Out
            </Badge>
          )}
          {lowSeats && !soldOut && (
            <Badge className="text-xs font-semibold bg-secondary/90 text-secondary-foreground border-0">
              {seatsLeft} left
            </Badge>
          )}
        </div>
        {/* Favorite button */}
        <button
          type="button"
          onClick={(e) => {
            e.preventDefault();
            e.stopPropagation();
            onToggleFavorite(event.id);
          }}
          className={cn(
            "absolute top-3 right-3 w-8 h-8 rounded-full flex items-center justify-center transition-smooth shadow-sm",
            isFavorite
              ? "bg-destructive text-destructive-foreground"
              : "bg-card/80 backdrop-blur-sm text-muted-foreground hover:text-destructive hover:bg-card",
          )}
          aria-label={isFavorite ? "Remove from favorites" : "Add to favorites"}
          data-ocid={`event_card.favorite_button.${index + 1}`}
        >
          <Heart
            className="w-4 h-4"
            fill={isFavorite ? "currentColor" : "none"}
          />
        </button>
        {/* Price */}
        <div className="absolute bottom-3 right-3">
          <span className="bg-card/90 backdrop-blur-sm font-display font-bold text-sm px-2.5 py-1 rounded-lg text-foreground shadow-sm">
            {event.price === 0 ? "Free" : `$${event.price}`}
          </span>
        </div>
      </div>

      {/* Content */}
      <CardContent className="p-4">
        <div className="mb-2">
          <CountdownTimer targetDate={event.date} compact />
        </div>

        <h3 className="font-display font-bold text-base text-foreground leading-snug mb-2 line-clamp-2 group-hover:text-primary transition-colors duration-200">
          {event.title}
        </h3>

        <div className="space-y-1.5 mb-3">
          <div className="flex items-center gap-1.5 text-muted-foreground min-w-0">
            <Calendar className="w-3.5 h-3.5 shrink-0" />
            <span className="text-xs truncate">{formatDate(event.date)}</span>
          </div>
          <div className="flex items-center gap-1.5 text-muted-foreground min-w-0">
            <MapPin className="w-3.5 h-3.5 shrink-0" />
            <span className="text-xs truncate">{event.city}</span>
          </div>
          {!soldOut && (
            <div className="flex items-center gap-1.5 text-muted-foreground min-w-0">
              <Users className="w-3.5 h-3.5 shrink-0" />
              <span className="text-xs">
                {seatsLeft.toLocaleString()} seats available
              </span>
            </div>
          )}
        </div>

        <div className="flex items-center justify-between gap-2">
          <StarRating
            rating={event.rating}
            reviewCount={Number(event.reviewCount)}
            size="sm"
          />
          <Button
            asChild
            size="sm"
            disabled={soldOut}
            className={cn(
              "text-xs font-semibold h-8 px-3 shrink-0",
              soldOut
                ? "opacity-50 cursor-not-allowed"
                : "bg-primary hover:bg-primary/90 text-primary-foreground",
            )}
            data-ocid={`event_card.view_button.${index + 1}`}
          >
            <Link to="/events/$id" params={{ id: event.id.toString() }}>
              {soldOut ? "Sold Out" : "View Details"}
            </Link>
          </Button>
        </div>
      </CardContent>
    </Card>
  );
}
