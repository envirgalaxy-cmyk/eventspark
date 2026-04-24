import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Skeleton } from "@/components/ui/skeleton";
import { Textarea } from "@/components/ui/textarea";
import { sampleReviews, sampleTicketTiers } from "@/data/sampleEvents";
import { useEvent } from "@/hooks/useEvents";
import { useFavorites } from "@/hooks/useFavorites";
import { cn } from "@/lib/utils";
import type { Review } from "@/types";
import { Link, useParams } from "@tanstack/react-router";
import {
  Calendar,
  Check,
  CheckCircle,
  ChevronLeft,
  Copy,
  Facebook,
  Heart,
  Linkedin,
  MapPin,
  Share2,
  Star,
  Users,
  X,
} from "lucide-react";
import { motion } from "motion/react";
import { useEffect, useMemo, useRef, useState } from "react";
import { toast } from "sonner";
import { CountdownTimer } from "../components/shared/CountdownTimer";
import { StarRating } from "../components/shared/StarRating";

// ─────────────────────────────────────────────────────────
// Helpers
// ─────────────────────────────────────────────────────────
function formatDate(ns: bigint): string {
  const ms = Number(ns / BigInt(1_000_000));
  return new Date(ms).toLocaleDateString("en-US", {
    weekday: "long",
    month: "long",
    day: "numeric",
    year: "numeric",
  });
}

function formatTime(ns: bigint): string {
  const ms = Number(ns / BigInt(1_000_000));
  return new Date(ms).toLocaleTimeString("en-US", {
    hour: "numeric",
    minute: "2-digit",
  });
}

function formatReviewDate(ns: bigint): string {
  const ms = Number(ns / BigInt(1_000_000));
  return new Date(ms).toLocaleDateString("en-US", {
    month: "short",
    day: "numeric",
    year: "numeric",
  });
}

const CATEGORY_COLORS: Record<string, string> = {
  Music: "bg-primary/10 text-primary border-primary/20",
  Conference: "bg-accent/10 text-accent border-accent/20",
  Workshop: "bg-secondary/10 text-secondary border-secondary/20",
  Sports: "bg-green-500/10 text-green-600 border-green-500/20",
  Arts: "bg-pink-500/10 text-pink-600 border-pink-500/20",
  Business: "bg-amber-500/10 text-amber-600 border-amber-500/20",
};

const PLACEHOLDER = "/assets/images/placeholder.svg";

const GALLERY_SEEDS = [10, 20, 30, 40, 50, 60];

// Schedule data per event category
const SCHEDULES: Record<
  string,
  { time: string; title: string; speaker: string }[]
> = {
  Music: [
    { time: "4:00 PM", title: "Doors Open & DJ Set", speaker: "DJ Lena K" },
    { time: "5:30 PM", title: "Opening Act", speaker: "The Static Waves" },
    {
      time: "7:00 PM",
      title: "Main Stage Headliner",
      speaker: "Aurora Collective",
    },
    {
      time: "9:00 PM",
      title: "Closing Set & Fireworks",
      speaker: "DJ Maximus",
    },
  ],
  Conference: [
    {
      time: "9:00 AM",
      title: "Registration & Networking Breakfast",
      speaker: "",
    },
    {
      time: "10:00 AM",
      title: "Opening Keynote: The Future of Software",
      speaker: "Dr. Alicia Chen, Google",
    },
    {
      time: "11:30 AM",
      title: "Workshop: High-Performance APIs",
      speaker: "Marcus Webb, Meta",
    },
    { time: "1:00 PM", title: "Lunch & Sponsor Showcase", speaker: "" },
    {
      time: "2:30 PM",
      title: "Panel: Scaling to Millions of Users",
      speaker: "4 Industry Leaders",
    },
    {
      time: "4:30 PM",
      title: "Closing Keynote & Q&A",
      speaker: "Sofia Park, YC Partner",
    },
  ],
  Workshop: [
    {
      time: "10:00 AM",
      title: "Introduction & Material Overview",
      speaker: "Lead Instructor",
    },
    {
      time: "10:30 AM",
      title: "Hands-On Session 1",
      speaker: "Small Group Work",
    },
    { time: "12:00 PM", title: "Lunch Break", speaker: "" },
    {
      time: "1:00 PM",
      title: "Hands-On Session 2",
      speaker: "Advanced Techniques",
    },
    {
      time: "3:00 PM",
      title: "Showcase & Critique",
      speaker: "Group Presentation",
    },
  ],
  Sports: [
    { time: "6:00 PM", title: "Warm-Up & Fan Zone Opens", speaker: "" },
    {
      time: "7:00 PM",
      title: "Opening Ceremony & Player Introductions",
      speaker: "",
    },
    { time: "7:30 PM", title: "First Half / Period", speaker: "" },
    { time: "9:00 PM", title: "Halftime Show", speaker: "Live Entertainment" },
    { time: "9:30 PM", title: "Second Half / Period", speaker: "" },
    { time: "11:00 PM", title: "Post-Game Celebration", speaker: "" },
  ],
  Arts: [
    { time: "7:00 PM", title: "House Opens", speaker: "" },
    { time: "7:30 PM", title: "Pre-Show Music", speaker: "Live Orchestra" },
    { time: "8:00 PM", title: "Act I", speaker: "Pacific Theatre Company" },
    { time: "9:15 PM", title: "Intermission", speaker: "" },
    { time: "9:30 PM", title: "Act II", speaker: "Pacific Theatre Company" },
    {
      time: "11:00 PM",
      title: "Post-Show Meet & Greet",
      speaker: "Cast Members",
    },
  ],
  Business: [
    { time: "6:00 PM", title: "Networking & Cocktails", speaker: "" },
    {
      time: "7:00 PM",
      title: "Welcome & Format Overview",
      speaker: "MC Sarah Okonkwo",
    },
    { time: "7:15 PM", title: "Pitches 1–5", speaker: "Founders Present" },
    { time: "8:15 PM", title: "Break & Audience Vote", speaker: "" },
    { time: "8:30 PM", title: "Pitches 6–10", speaker: "Founders Present" },
    { time: "9:30 PM", title: "Investor Panel Q&A", speaker: "VC Panel" },
  ],
};

const DEFAULT_SCHEDULE = [
  { time: "10:00 AM", title: "Event Opens", speaker: "" },
  { time: "11:00 AM", title: "Main Program", speaker: "Featured Guests" },
  { time: "1:00 PM", title: "Break", speaker: "" },
  { time: "2:00 PM", title: "Afternoon Sessions", speaker: "" },
  { time: "4:00 PM", title: "Closing Remarks", speaker: "" },
];

// ─────────────────────────────────────────────────────────
// Interactive star selector
// ─────────────────────────────────────────────────────────
function StarSelector({
  value,
  onChange,
}: {
  value: number;
  onChange: (v: number) => void;
}) {
  const [hover, setHover] = useState(0);
  return (
    <div className="flex items-center gap-1">
      {Array.from({ length: 5 }, (_, i) => i + 1).map((n) => (
        <button
          key={n}
          type="button"
          className="transition-smooth focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring rounded"
          onMouseEnter={() => setHover(n)}
          onMouseLeave={() => setHover(0)}
          onClick={() => onChange(n)}
          aria-label={`Rate ${n} star${n > 1 ? "s" : ""}`}
        >
          <Star
            className={cn(
              "w-7 h-7 transition-colors duration-150",
              n <= (hover || value)
                ? "text-secondary fill-secondary"
                : "text-muted-foreground/30 fill-muted-foreground/10",
            )}
          />
        </button>
      ))}
    </div>
  );
}

// ─────────────────────────────────────────────────────────
// Lightbox
// ─────────────────────────────────────────────────────────
function Lightbox({
  src,
  onClose,
}: {
  src: string;
  onClose: () => void;
}) {
  useEffect(() => {
    const handler = (e: KeyboardEvent) => e.key === "Escape" && onClose();
    window.addEventListener("keydown", handler);
    return () => window.removeEventListener("keydown", handler);
  }, [onClose]);

  return (
    <div
      className="fixed inset-0 z-50 bg-foreground/80 backdrop-blur-sm flex items-center justify-center p-4"
      onClick={onClose}
      onKeyDown={(e) => e.key === "Escape" && onClose()}
      role="presentation"
      tabIndex={-1}
      data-ocid="gallery.lightbox"
    >
      <button
        type="button"
        className="absolute top-4 right-4 w-10 h-10 rounded-full bg-card/90 flex items-center justify-center text-foreground hover:bg-card transition-smooth"
        onClick={onClose}
        aria-label="Close lightbox"
        data-ocid="gallery.lightbox.close_button"
      >
        <X className="w-5 h-5" />
      </button>
      <button
        type="button"
        onClick={(e) => e.stopPropagation()}
        className="focus:outline-none p-0 bg-transparent border-0"
        aria-label="Gallery image"
      >
        <img
          src={src}
          alt="Gallery preview"
          className="max-w-full max-h-[90vh] object-contain rounded-xl shadow-2xl"
        />
      </button>
    </div>
  );
}

// ─────────────────────────────────────────────────────────
// Main page
// ─────────────────────────────────────────────────────────
export default function EventDetailPage() {
  const { id } = useParams({ from: "/events/$id" });
  const eventId = BigInt(id);
  const { data: event, isLoading } = useEvent(eventId);
  const { isFavorite, toggle } = useFavorites();

  const tiers = useMemo(
    () => sampleTicketTiers[id] ?? sampleTicketTiers["1"],
    [id],
  );
  const reviews = useMemo(() => {
    const base = sampleReviews[id] ?? sampleReviews["1"];
    return base;
  }, [id]);

  const [localReviews, setLocalReviews] = useState<Review[]>([]);
  const allReviews = useMemo(
    () => [...localReviews, ...reviews],
    [localReviews, reviews],
  );

  const [lightboxSrc, setLightboxSrc] = useState<string | null>(null);
  const [reviewDialogOpen, setReviewDialogOpen] = useState(false);
  const [reviewRating, setReviewRating] = useState(5);
  const [reviewName, setReviewName] = useState("");
  const [reviewComment, setReviewComment] = useState("");
  const [copied, setCopied] = useState(false);

  const isFav = event ? isFavorite(event.id) : false;

  const cheapestAvailable = useMemo(
    () =>
      tiers
        .filter((t) => Number(t.available) > 0)
        .sort((a, b) => a.price - b.price)[0] ?? null,
    [tiers],
  );

  const schedule = event
    ? (SCHEDULES[event.category] ?? DEFAULT_SCHEDULE)
    : DEFAULT_SCHEDULE;

  const avgRating = useMemo(() => {
    if (!allReviews.length) return event?.rating ?? 0;
    const sum = allReviews.reduce((acc, r) => acc + Number(r.rating), 0);
    return sum / allReviews.length;
  }, [allReviews, event]);

  function handleCopyLink() {
    navigator.clipboard.writeText(window.location.href).then(() => {
      setCopied(true);
      toast.success("Link copied to clipboard!");
      setTimeout(() => setCopied(false), 2000);
    });
  }

  function handleShare(platform: "twitter" | "facebook" | "linkedin") {
    if (!event) return;
    const url = encodeURIComponent(window.location.href);
    const text = encodeURIComponent(
      `Check out "${event.title}" — grab your tickets now!`,
    );
    const shareUrls = {
      twitter: `https://twitter.com/intent/tweet?text=${text}&url=${url}`,
      facebook: `https://www.facebook.com/sharer/sharer.php?u=${url}`,
      linkedin: `https://www.linkedin.com/sharing/share-offsite/?url=${url}`,
    };
    window.open(shareUrls[platform], "_blank", "width=600,height=500,noopener");
  }

  function handleSubmitReview(e: React.FormEvent) {
    e.preventDefault();
    if (!event) return;
    if (!reviewName.trim() || !reviewComment.trim()) {
      toast.error("Please fill in all fields.");
      return;
    }
    const newReview: Review = {
      id: BigInt(Date.now()),
      eventId: event.id,
      authorName: reviewName.trim(),
      rating: BigInt(reviewRating),
      comment: reviewComment.trim(),
      date: BigInt(Date.now()) * BigInt(1_000_000),
    };
    setLocalReviews((prev) => [newReview, ...prev]);
    toast.success("Review submitted!");
    setReviewDialogOpen(false);
    setReviewName("");
    setReviewComment("");
    setReviewRating(5);
  }

  // ─── Loading skeleton ───
  if (isLoading) {
    return (
      <div className="max-w-5xl mx-auto px-4 py-10 space-y-8">
        <Skeleton className="w-full aspect-[21/9] rounded-2xl" />
        <div className="space-y-4">
          <Skeleton className="h-8 w-2/3" />
          <Skeleton className="h-4 w-1/3" />
          <Skeleton className="h-4 w-1/2" />
        </div>
      </div>
    );
  }

  if (!event) {
    return (
      <div className="flex flex-col items-center justify-center min-h-[60vh] gap-4">
        <p className="text-2xl font-display font-bold text-foreground">
          Event not found
        </p>
        <Button asChild variant="outline">
          <Link to="/events">Browse Events</Link>
        </Button>
      </div>
    );
  }

  const categoryStyle =
    CATEGORY_COLORS[event.category] ??
    "bg-muted text-muted-foreground border-border";
  const soldOut = Number(event.availableSeats) === 0;

  return (
    <>
      {lightboxSrc && (
        <Lightbox src={lightboxSrc} onClose={() => setLightboxSrc(null)} />
      )}

      {/* ── Hero ── */}
      <div className="relative w-full" style={{ maxHeight: "560px" }}>
        <div className="aspect-[21/9] max-h-[560px] overflow-hidden">
          <img
            src={event.imageUrl || PLACEHOLDER}
            alt={event.title}
            className="w-full h-full object-cover"
            onError={(e) => {
              (e.currentTarget as HTMLImageElement).src = PLACEHOLDER;
            }}
          />
        </div>
        {/* Gradient overlay */}
        <div className="absolute inset-0 bg-gradient-to-t from-foreground/90 via-foreground/40 to-transparent" />

        {/* Back nav */}
        <div className="absolute top-5 left-5">
          <Button
            asChild
            variant="outline"
            size="sm"
            className="bg-card/80 backdrop-blur-sm border-border/50 text-foreground hover:bg-card"
            data-ocid="event_detail.back_button"
          >
            <Link to="/events">
              <ChevronLeft className="w-4 h-4 mr-1" />
              All Events
            </Link>
          </Button>
        </div>

        {/* Favorite button */}
        <button
          type="button"
          onClick={() => toggle(event.id)}
          className={cn(
            "absolute top-5 right-5 w-11 h-11 rounded-full flex items-center justify-center transition-smooth shadow-lg",
            isFav
              ? "bg-pink-500 text-white"
              : "bg-card/80 backdrop-blur-sm text-muted-foreground hover:text-pink-500 hover:bg-card",
          )}
          aria-label={isFav ? "Remove from favorites" : "Add to favorites"}
          data-ocid="event_detail.favorite_button"
        >
          <Heart className="w-5 h-5" fill={isFav ? "currentColor" : "none"} />
        </button>

        {/* Hero content */}
        <div className="absolute bottom-0 left-0 right-0 p-6 md:p-10">
          <div className="max-w-5xl mx-auto">
            <div className="flex flex-wrap gap-2 mb-3">
              <Badge
                className={cn("border font-semibold text-sm", categoryStyle)}
                variant="outline"
              >
                {event.category}
              </Badge>
              {soldOut && (
                <Badge variant="destructive" className="font-semibold text-sm">
                  Sold Out
                </Badge>
              )}
            </div>
            <h1 className="font-display font-bold text-3xl md:text-5xl text-white leading-tight mb-4">
              {event.title}
            </h1>
            <div className="flex flex-wrap items-center gap-x-6 gap-y-2 text-white/80 text-sm">
              <span className="flex items-center gap-1.5">
                <Calendar className="w-4 h-4 shrink-0" />
                {formatDate(event.date)} · {formatTime(event.date)}
              </span>
              <span className="flex items-center gap-1.5">
                <MapPin className="w-4 h-4 shrink-0" />
                {event.venue}, {event.city}
              </span>
              <StarRating
                rating={event.rating}
                reviewCount={Number(event.reviewCount)}
                size="sm"
                className="[&_span.text-muted-foreground]:text-white/70 [&_span.text-foreground]:text-white"
              />
            </div>
          </div>
        </div>
      </div>

      {/* ── Page body ── */}
      <div className="max-w-5xl mx-auto px-4 pb-32 md:pb-10">
        {/* ── Countdown ── */}
        <motion.div
          initial={{ opacity: 0, y: 16 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.4 }}
          className="bg-card border border-border rounded-2xl px-6 py-5 mt-8 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4"
          data-ocid="event_detail.countdown_section"
        >
          <div>
            <p className="text-xs font-semibold uppercase tracking-widest text-muted-foreground mb-1">
              Event starts in
            </p>
            <CountdownTimer targetDate={event.date} />
          </div>
          <div className="flex items-center gap-2">
            <Users className="w-4 h-4 text-muted-foreground" />
            <span className="text-sm text-muted-foreground">
              <span className="font-bold text-foreground">
                {Number(event.availableSeats).toLocaleString()}
              </span>{" "}
              seats remaining
            </span>
          </div>
        </motion.div>

        {/* ── Social share ── */}
        <motion.div
          initial={{ opacity: 0, y: 16 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.4, delay: 0.05 }}
          className="flex flex-wrap items-center gap-3 mt-6"
          data-ocid="event_detail.share_section"
        >
          <span className="flex items-center gap-1.5 text-sm text-muted-foreground font-medium">
            <Share2 className="w-4 h-4" /> Share:
          </span>
          <button
            type="button"
            onClick={() => handleShare("twitter")}
            className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-sky-400/10 text-sky-500 hover:bg-sky-400/20 text-sm font-semibold transition-smooth"
            aria-label="Share on Twitter"
            data-ocid="event_detail.share_twitter"
          >
            <X className="w-3.5 h-3.5" />
            Twitter / X
          </button>
          <button
            type="button"
            onClick={() => handleShare("facebook")}
            className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-blue-500/10 text-blue-600 hover:bg-blue-500/20 text-sm font-semibold transition-smooth"
            aria-label="Share on Facebook"
            data-ocid="event_detail.share_facebook"
          >
            <Facebook className="w-3.5 h-3.5" />
            Facebook
          </button>
          <button
            type="button"
            onClick={() => handleShare("linkedin")}
            className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-blue-700/10 text-blue-700 hover:bg-blue-700/20 text-sm font-semibold transition-smooth"
            aria-label="Share on LinkedIn"
            data-ocid="event_detail.share_linkedin"
          >
            <Linkedin className="w-3.5 h-3.5" />
            LinkedIn
          </button>
          <button
            type="button"
            onClick={handleCopyLink}
            className={cn(
              "flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-sm font-semibold transition-smooth",
              copied
                ? "bg-green-500/10 text-green-600"
                : "bg-muted text-muted-foreground hover:bg-muted/70",
            )}
            aria-label="Copy link"
            data-ocid="event_detail.copy_link_button"
          >
            {copied ? (
              <Check className="w-3.5 h-3.5" />
            ) : (
              <Copy className="w-3.5 h-3.5" />
            )}
            {copied ? "Copied!" : "Copy Link"}
          </button>
        </motion.div>

        {/* ── Two-column layout (main + sidebar) ── */}
        <div className="mt-10 grid grid-cols-1 lg:grid-cols-[1fr_320px] gap-10">
          {/* ── Left column ── */}
          <div className="space-y-12 min-w-0">
            {/* Overview */}
            <motion.section
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.4 }}
              data-ocid="event_detail.overview_section"
            >
              <h2 className="font-display font-bold text-2xl text-foreground mb-4">
                About This Event
              </h2>
              <p className="text-muted-foreground leading-relaxed text-base">
                {event.description}
              </p>
            </motion.section>

            {/* Schedule */}
            <motion.section
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.4 }}
              data-ocid="event_detail.schedule_section"
            >
              <h2 className="font-display font-bold text-2xl text-foreground mb-5">
                Event Schedule
              </h2>
              <div className="space-y-0">
                {schedule.map((item, i) => (
                  <div
                    key={`${item.time}-${item.title}`}
                    className="relative flex gap-5 pb-6 last:pb-0"
                    data-ocid={`event_detail.schedule_item.${i + 1}`}
                  >
                    {/* Timeline line */}
                    <div className="flex flex-col items-center shrink-0">
                      <div className="w-3 h-3 rounded-full bg-primary mt-1 shrink-0 z-10" />
                      {i < schedule.length - 1 && (
                        <div className="w-px flex-1 bg-border mt-1" />
                      )}
                    </div>
                    <div className="min-w-0">
                      <p className="text-xs font-bold text-primary uppercase tracking-wider mb-0.5">
                        {item.time}
                      </p>
                      <p className="font-display font-semibold text-base text-foreground leading-snug">
                        {item.title}
                      </p>
                      {item.speaker && (
                        <p className="text-sm text-muted-foreground mt-0.5">
                          {item.speaker}
                        </p>
                      )}
                    </div>
                  </div>
                ))}
              </div>
            </motion.section>

            {/* Gallery */}
            <motion.section
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.4 }}
              data-ocid="event_detail.gallery_section"
            >
              <h2 className="font-display font-bold text-2xl text-foreground mb-5">
                Gallery
              </h2>
              <div className="grid grid-cols-2 sm:grid-cols-3 gap-3">
                {GALLERY_SEEDS.map((seed, i) => {
                  const src = `https://picsum.photos/seed/${seed + Number(event.id) * 7}/600/400`;
                  return (
                    <button
                      key={seed}
                      type="button"
                      onClick={() => setLightboxSrc(src)}
                      className="group relative aspect-[4/3] overflow-hidden rounded-xl border border-border hover:border-primary/40 transition-smooth focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring"
                      aria-label={`View gallery image ${i + 1}`}
                      data-ocid={`event_detail.gallery_item.${i + 1}`}
                    >
                      <img
                        src={src}
                        alt={`Gallery ${i + 1}`}
                        className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-105"
                      />
                      <div className="absolute inset-0 bg-foreground/0 group-hover:bg-foreground/20 transition-smooth" />
                    </button>
                  );
                })}
              </div>
            </motion.section>

            {/* Venue */}
            <motion.section
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.4 }}
              data-ocid="event_detail.venue_section"
            >
              <h2 className="font-display font-bold text-2xl text-foreground mb-5">
                Venue
              </h2>
              <div className="grid sm:grid-cols-2 gap-5">
                <div className="bg-card border border-border rounded-2xl p-5 space-y-3">
                  <div>
                    <p className="font-display font-bold text-lg text-foreground">
                      {event.venue}
                    </p>
                    <p className="text-sm text-muted-foreground">
                      {event.location}
                    </p>
                    <p className="text-sm text-muted-foreground">
                      {event.city}
                    </p>
                  </div>
                  <div className="flex items-center gap-2 pt-1 border-t border-border">
                    <Users className="w-4 h-4 text-muted-foreground" />
                    <span className="text-sm text-muted-foreground">
                      Capacity:{" "}
                      <span className="font-semibold text-foreground">
                        {Number(event.capacity).toLocaleString()}
                      </span>
                    </span>
                  </div>
                </div>
                {/* Map placeholder */}
                <div className="relative rounded-2xl overflow-hidden bg-muted border border-border min-h-[180px] flex items-center justify-center">
                  <div className="text-center p-6">
                    <MapPin className="w-8 h-8 text-primary mx-auto mb-2" />
                    <p className="font-display font-semibold text-sm text-foreground">
                      {event.venue}
                    </p>
                    <p className="text-xs text-muted-foreground mt-1">
                      {event.city}
                    </p>
                  </div>
                  {/* Decorative grid */}
                  <div
                    className="absolute inset-0 opacity-10"
                    style={{
                      backgroundImage:
                        "linear-gradient(oklch(var(--border)) 1px, transparent 1px), linear-gradient(90deg, oklch(var(--border)) 1px, transparent 1px)",
                      backgroundSize: "32px 32px",
                    }}
                  />
                </div>
              </div>
            </motion.section>

            {/* Reviews */}
            <motion.section
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.4 }}
              data-ocid="event_detail.reviews_section"
            >
              <div className="flex items-center justify-between mb-5 flex-wrap gap-3">
                <div>
                  <h2 className="font-display font-bold text-2xl text-foreground mb-1">
                    Reviews
                  </h2>
                  <div className="flex items-center gap-3">
                    <StarRating
                      rating={avgRating}
                      reviewCount={allReviews.length}
                      size="md"
                    />
                  </div>
                </div>
                <Button
                  onClick={() => setReviewDialogOpen(true)}
                  className="bg-primary hover:bg-primary/90 text-primary-foreground"
                  data-ocid="event_detail.add_review_button"
                >
                  Add Review
                </Button>
              </div>

              {allReviews.length === 0 ? (
                <div
                  className="text-center py-10 text-muted-foreground border border-dashed border-border rounded-2xl"
                  data-ocid="event_detail.reviews_empty_state"
                >
                  No reviews yet. Be the first to share your experience!
                </div>
              ) : (
                <div className="space-y-4">
                  {allReviews.map((review, i) => (
                    <div
                      key={review.id.toString()}
                      className="bg-card border border-border rounded-2xl p-5"
                      data-ocid={`event_detail.review_item.${i + 1}`}
                    >
                      <div className="flex items-start justify-between gap-3 mb-2">
                        <div>
                          <p className="font-semibold text-sm text-foreground">
                            {review.authorName}
                          </p>
                          <p className="text-xs text-muted-foreground">
                            {formatReviewDate(review.date)}
                          </p>
                        </div>
                        <StarRating
                          rating={Number(review.rating)}
                          size="sm"
                          showValue={false}
                        />
                      </div>
                      <p className="text-sm text-muted-foreground leading-relaxed">
                        {review.comment}
                      </p>
                    </div>
                  ))}
                </div>
              )}
            </motion.section>
          </div>

          {/* ── Right sidebar (tickets) ── */}
          <div className="lg:block">
            <div
              className="sticky top-24 space-y-4"
              data-ocid="event_detail.tickets_section"
            >
              <h2 className="font-display font-bold text-xl text-foreground">
                Ticket Options
              </h2>
              {tiers.map((tier, i) => {
                const isAvailable = Number(tier.available) > 0;
                return (
                  <Card
                    key={tier.id.toString()}
                    className={cn(
                      "border transition-smooth",
                      isAvailable
                        ? "border-border hover:border-primary/40 hover:shadow-md"
                        : "border-border opacity-60",
                    )}
                    data-ocid={`event_detail.ticket_tier.${i + 1}`}
                  >
                    <CardHeader className="pb-2 pt-4 px-4">
                      <div className="flex items-start justify-between gap-2">
                        <CardTitle className="font-display text-base font-bold text-foreground">
                          {tier.name}
                        </CardTitle>
                        <span className="font-display font-bold text-xl text-primary shrink-0">
                          ${tier.price}
                        </span>
                      </div>
                      {!isAvailable ? (
                        <Badge variant="destructive" className="w-fit text-xs">
                          Sold Out
                        </Badge>
                      ) : (
                        <p className="text-xs text-muted-foreground">
                          {Number(tier.available)} seats left
                        </p>
                      )}
                    </CardHeader>
                    <CardContent className="px-4 pb-4">
                      <ul className="space-y-1.5 mb-4">
                        {tier.benefits.map((b) => (
                          <li
                            key={b}
                            className="flex items-center gap-2 text-sm text-muted-foreground"
                          >
                            <CheckCircle className="w-3.5 h-3.5 text-primary shrink-0" />
                            {b}
                          </li>
                        ))}
                      </ul>
                      <Button
                        asChild={isAvailable}
                        disabled={!isAvailable}
                        className={cn(
                          "w-full font-semibold",
                          isAvailable
                            ? "bg-secondary hover:bg-secondary/90 text-secondary-foreground"
                            : "bg-muted text-muted-foreground cursor-not-allowed",
                        )}
                        data-ocid={`event_detail.get_tickets_button.${i + 1}`}
                      >
                        {isAvailable ? (
                          <Link
                            to="/checkout/$eventId"
                            params={{ eventId: id }}
                          >
                            Get Tickets
                          </Link>
                        ) : (
                          "Sold Out"
                        )}
                      </Button>
                    </CardContent>
                  </Card>
                );
              })}
            </div>
          </div>
        </div>
      </div>

      {/* ── Sticky booking bar ── */}
      {cheapestAvailable && (
        <>
          {/* Mobile: bottom bar */}
          <div
            className="fixed bottom-0 left-0 right-0 lg:hidden z-40 bg-card border-t border-border px-4 py-3 flex items-center justify-between gap-3"
            data-ocid="event_detail.sticky_booking_bar"
          >
            <div className="min-w-0">
              <p className="font-display font-bold text-sm text-foreground truncate">
                {event.title}
              </p>
              <p className="text-xs text-muted-foreground">
                From{" "}
                <span className="font-bold text-primary">
                  ${cheapestAvailable.price}
                </span>
              </p>
            </div>
            <Button
              asChild
              className="bg-secondary hover:bg-secondary/90 text-secondary-foreground font-bold shrink-0"
              data-ocid="event_detail.sticky_get_tickets_button"
            >
              <Link to="/checkout/$eventId" params={{ eventId: id }}>
                Get Tickets
              </Link>
            </Button>
          </div>

          {/* Desktop: fixed bottom-right floating card */}
          <div
            className="hidden lg:flex fixed bottom-8 right-8 z-40 flex-col gap-2 w-64 bg-card border border-border rounded-2xl shadow-2xl p-4"
            data-ocid="event_detail.sticky_booking_card"
          >
            <div className="min-w-0">
              <p className="text-xs font-semibold uppercase tracking-widest text-muted-foreground mb-1">
                From
              </p>
              <p className="font-display font-bold text-2xl text-primary">
                ${cheapestAvailable.price}
              </p>
              <p className="text-xs text-muted-foreground truncate mt-0.5">
                {cheapestAvailable.name}
              </p>
            </div>
            <Button
              asChild
              className="w-full bg-secondary hover:bg-secondary/90 text-secondary-foreground font-bold mt-1"
              data-ocid="event_detail.sticky_get_tickets_button_desktop"
            >
              <Link to="/checkout/$eventId" params={{ eventId: id }}>
                Get Tickets
              </Link>
            </Button>
          </div>
        </>
      )}

      {/* ── Add Review Dialog ── */}
      <Dialog open={reviewDialogOpen} onOpenChange={setReviewDialogOpen}>
        <DialogContent
          className="max-w-md"
          data-ocid="event_detail.review_dialog"
        >
          <DialogHeader>
            <DialogTitle className="font-display text-xl">
              Write a Review
            </DialogTitle>
          </DialogHeader>
          <form onSubmit={handleSubmitReview} className="space-y-5 mt-2">
            <div className="space-y-2">
              <Label>Your Rating</Label>
              <StarSelector value={reviewRating} onChange={setReviewRating} />
            </div>
            <div className="space-y-2">
              <Label htmlFor="review-name">Your Name</Label>
              <Input
                id="review-name"
                placeholder="e.g. Alex M."
                value={reviewName}
                onChange={(e) => setReviewName(e.target.value)}
                maxLength={80}
                data-ocid="event_detail.review_name_input"
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="review-comment">
                Comment{" "}
                <span className="text-muted-foreground font-normal">
                  ({reviewComment.length}/500)
                </span>
              </Label>
              <Textarea
                id="review-comment"
                placeholder="Share your experience..."
                value={reviewComment}
                onChange={(e) => setReviewComment(e.target.value)}
                maxLength={500}
                rows={4}
                data-ocid="event_detail.review_comment_textarea"
              />
            </div>
            <div className="flex gap-3 justify-end">
              <Button
                type="button"
                variant="outline"
                onClick={() => setReviewDialogOpen(false)}
                data-ocid="event_detail.review_cancel_button"
              >
                Cancel
              </Button>
              <Button
                type="submit"
                className="bg-primary hover:bg-primary/90 text-primary-foreground"
                data-ocid="event_detail.review_submit_button"
              >
                Submit Review
              </Button>
            </div>
          </form>
        </DialogContent>
      </Dialog>
    </>
  );
}
