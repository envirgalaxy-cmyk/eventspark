import { EventCard } from "@/components/shared/EventCard";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { sampleEvents } from "@/data/sampleEvents";
import { useFavorites } from "@/hooks/useFavorites";
import { Link, useNavigate } from "@tanstack/react-router";
import {
  ArrowRight,
  Briefcase,
  Calendar,
  Mic2,
  Music,
  Star,
  Trophy,
  Users,
  Zap,
} from "lucide-react";
import { motion } from "motion/react";
import { useRef, useState } from "react";

// ─── Data ────────────────────────────────────────────────────────────────────

const FEATURED_IDS = [1, 2, 3, 4, 5, 6];
const featuredEvents = sampleEvents.filter((e) =>
  FEATURED_IDS.includes(Number(e.id)),
);

const CATEGORIES = [
  {
    label: "Concerts",
    icon: Music,
    color:
      "from-primary/20 to-primary/5 border-primary/30 hover:border-primary/60",
    iconColor: "text-primary",
    query: "Music",
  },
  {
    label: "Workshops",
    icon: Zap,
    color:
      "from-secondary/20 to-secondary/5 border-secondary/30 hover:border-secondary/60",
    iconColor: "text-secondary",
    query: "Workshop",
  },
  {
    label: "Conferences",
    icon: Mic2,
    color: "from-accent/20 to-accent/5 border-accent/30 hover:border-accent/60",
    iconColor: "text-accent",
    query: "Conference",
  },
  {
    label: "All Events",
    icon: Calendar,
    color: "from-muted/60 to-muted/20 border-border hover:border-primary/40",
    iconColor: "text-foreground",
    query: "",
  },
];

const STATS = [
  { value: "500+", label: "Events", icon: Calendar },
  { value: "50K+", label: "Attendees", icon: Users },
  { value: "100+", label: "Cities", icon: Trophy },
  { value: "4.9", label: "Rating", icon: Star },
];

const TESTIMONIALS = [
  {
    name: "Jessica M.",
    role: "Concert-goer",
    text: "Found my favorite bands here before they became famous. The discovery features are unmatched.",
    avatar: "J",
  },
  {
    name: "David K.",
    role: "Tech Professional",
    text: "Booked three dev conferences in one afternoon. Clean interface, zero friction.",
    avatar: "D",
  },
  {
    name: "Ana R.",
    role: "Workshop Enthusiast",
    text: "The workshop listings are so detailed. I always know exactly what I'm signing up for.",
    avatar: "A",
  },
];

// ─── Sub-components ───────────────────────────────────────────────────────────

function HeroSection() {
  const navigate = useNavigate();
  const [query, setQuery] = useState("");

  function handleSearch(e: React.FormEvent) {
    e.preventDefault();
    void navigate({ to: "/events", search: query ? { q: query } : {} });
  }

  return (
    <section
      className="relative min-h-[92vh] flex items-center justify-center overflow-hidden"
      data-ocid="hero.section"
    >
      {/* Background image + overlay */}
      <div className="absolute inset-0">
        <img
          src="/assets/generated/hero-event-crowd.dim_1600x700.jpg"
          alt="Live event crowd"
          className="w-full h-full object-cover"
        />
        <div className="absolute inset-0 bg-gradient-to-b from-foreground/70 via-foreground/50 to-background/90" />
        <div className="absolute inset-0 bg-gradient-to-r from-primary/30 via-transparent to-accent/20" />
      </div>

      {/* Content */}
      <div className="relative z-10 max-w-4xl mx-auto px-4 text-center">
        <motion.div
          initial={{ opacity: 0, y: 24 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.7, ease: "easeOut" }}
        >
          <Badge className="mb-6 bg-primary/20 text-primary-foreground border border-primary/40 backdrop-blur-sm font-semibold tracking-wide uppercase text-xs px-4 py-1.5">
            ✦ The Smartest Way to Book Events
          </Badge>

          <h1 className="font-display font-bold text-5xl md:text-7xl lg:text-8xl leading-[0.95] text-white mb-6 tracking-tight">
            Discover{" "}
            <span className="text-transparent bg-clip-text bg-gradient-to-r from-primary to-secondary">
              Amazing
            </span>
            <br />
            Events
          </h1>

          <p className="text-white/80 text-lg md:text-xl mb-10 max-w-2xl mx-auto leading-relaxed">
            From electric concerts and sold-out conferences to intimate
            workshops — find and book unforgettable experiences in your city.
          </p>
        </motion.div>

        {/* Search bar */}
        <motion.form
          initial={{ opacity: 0, y: 16 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.25, ease: "easeOut" }}
          onSubmit={handleSearch}
          className="flex items-center gap-2 max-w-xl mx-auto mb-10"
          data-ocid="hero.search_form"
        >
          <Input
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            placeholder="Search events, venues, cities…"
            className="h-14 bg-card/90 backdrop-blur-md border-border/60 text-foreground placeholder:text-muted-foreground font-body text-base rounded-xl shadow-lg flex-1"
            data-ocid="hero.search_input"
          />
          <Button
            type="submit"
            size="lg"
            className="h-14 px-6 bg-primary hover:bg-primary/90 text-primary-foreground font-semibold rounded-xl shrink-0 shadow-lg transition-smooth"
            data-ocid="hero.search_submit"
          >
            Search
          </Button>
        </motion.form>

        {/* CTA buttons */}
        <motion.div
          initial={{ opacity: 0, y: 12 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.4, ease: "easeOut" }}
          className="flex flex-wrap items-center justify-center gap-4"
        >
          <Button
            asChild
            size="lg"
            className="h-12 px-8 bg-secondary hover:bg-secondary/90 text-secondary-foreground font-bold rounded-xl shadow-lg text-base transition-smooth"
            data-ocid="hero.browse_events_button"
          >
            <Link to="/events">
              Browse Events <ArrowRight className="ml-2 w-4 h-4" />
            </Link>
          </Button>
          <Button
            asChild
            size="lg"
            variant="outline"
            className="h-12 px-8 bg-card/20 border-white/40 text-white hover:bg-card/40 hover:text-white font-semibold rounded-xl text-base backdrop-blur-sm transition-smooth"
            data-ocid="hero.learn_more_button"
          >
            <Link to="/contact">Learn More</Link>
          </Button>
        </motion.div>
      </div>

      {/* Bottom fade */}
      <div className="absolute bottom-0 left-0 right-0 h-32 bg-gradient-to-t from-background to-transparent pointer-events-none" />
    </section>
  );
}

function StatsSection() {
  return (
    <section
      className="bg-card border-y border-border py-14"
      data-ocid="stats.section"
    >
      <div className="max-w-5xl mx-auto px-4">
        <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
          {STATS.map((stat, i) => {
            const Icon = stat.icon;
            return (
              <motion.div
                key={stat.label}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: i * 0.1, duration: 0.5 }}
                className="flex flex-col items-center text-center gap-2"
                data-ocid={`stats.item.${i + 1}`}
              >
                <div className="w-12 h-12 rounded-2xl bg-primary/10 flex items-center justify-center mb-1">
                  <Icon className="w-6 h-6 text-primary" />
                </div>
                <span className="font-display font-bold text-4xl text-foreground tracking-tight">
                  {stat.value}
                </span>
                <span className="text-muted-foreground text-sm font-medium">
                  {stat.label}
                </span>
              </motion.div>
            );
          })}
        </div>
      </div>
    </section>
  );
}

function CategoriesSection() {
  return (
    <section
      className="bg-background py-20 px-4"
      data-ocid="categories.section"
    >
      <div className="max-w-5xl mx-auto">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6 }}
          className="text-center mb-12"
        >
          <p className="text-primary font-semibold uppercase tracking-widest text-sm mb-3">
            Explore by Category
          </p>
          <h2 className="font-display font-bold text-4xl md:text-5xl text-foreground">
            What are you into?
          </h2>
        </motion.div>

        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
          {CATEGORIES.map((cat, i) => {
            const Icon = cat.icon;
            return (
              <motion.div
                key={cat.label}
                initial={{ opacity: 0, scale: 0.92 }}
                whileInView={{ opacity: 1, scale: 1 }}
                viewport={{ once: true }}
                transition={{ delay: i * 0.1, duration: 0.45 }}
              >
                <Link
                  to="/events"
                  search={cat.query ? { category: cat.query } : {}}
                >
                  <Card
                    className={`group cursor-pointer p-6 text-center bg-gradient-to-br border transition-smooth hover:-translate-y-1 hover:shadow-lg ${cat.color}`}
                    data-ocid={`categories.item.${i + 1}`}
                  >
                    <div className="mx-auto w-14 h-14 rounded-2xl flex items-center justify-center mb-4 bg-background/60 group-hover:bg-background transition-smooth">
                      <Icon className={`w-7 h-7 ${cat.iconColor}`} />
                    </div>
                    <h3 className="font-display font-bold text-base text-foreground">
                      {cat.label}
                    </h3>
                  </Card>
                </Link>
              </motion.div>
            );
          })}
        </div>
      </div>
    </section>
  );
}

function FeaturedEventsSection() {
  const { isFavorite, toggle } = useFavorites();

  return (
    <section
      className="bg-muted/30 py-20 px-4"
      data-ocid="featured_events.section"
    >
      <div className="max-w-6xl mx-auto">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6 }}
          className="flex flex-col sm:flex-row sm:items-end justify-between mb-12 gap-4"
        >
          <div>
            <p className="text-secondary font-semibold uppercase tracking-widest text-sm mb-3">
              Hand-picked for You
            </p>
            <h2 className="font-display font-bold text-4xl md:text-5xl text-foreground">
              Featured Events
            </h2>
          </div>
          <Button
            asChild
            variant="outline"
            className="border-border hover:border-primary/50 hover:text-primary transition-smooth self-start sm:self-auto"
            data-ocid="featured_events.view_all_button"
          >
            <Link to="/events">
              View All <ArrowRight className="ml-1.5 w-4 h-4" />
            </Link>
          </Button>
        </motion.div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
          {featuredEvents.map((event, i) => (
            <motion.div
              key={event.id.toString()}
              initial={{ opacity: 0, y: 28 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: i * 0.1, duration: 0.5 }}
            >
              <EventCard
                event={event}
                isFavorite={isFavorite(event.id)}
                onToggleFavorite={toggle}
                index={i}
              />
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
}

function TestimonialsSection() {
  return (
    <section
      className="bg-background py-20 px-4"
      data-ocid="testimonials.section"
    >
      <div className="max-w-5xl mx-auto">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6 }}
          className="text-center mb-12"
        >
          <p className="text-accent font-semibold uppercase tracking-widest text-sm mb-3">
            What People Say
          </p>
          <h2 className="font-display font-bold text-4xl md:text-5xl text-foreground">
            Loved by event-goers
          </h2>
        </motion.div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {TESTIMONIALS.map((t, i) => (
            <motion.div
              key={t.name}
              initial={{ opacity: 0, x: -20 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true }}
              transition={{ delay: i * 0.12, duration: 0.5 }}
            >
              <Card
                className="p-6 bg-card border border-border hover:border-primary/30 hover:shadow-md transition-smooth"
                data-ocid={`testimonials.item.${i + 1}`}
              >
                <div className="flex items-center gap-1 mb-4">
                  {Array.from({ length: 5 }, (_, si) => si).map((si) => (
                    <Star
                      key={si}
                      className="w-4 h-4 fill-secondary text-secondary"
                    />
                  ))}
                </div>
                <p className="text-foreground/80 text-sm leading-relaxed mb-5 italic">
                  "{t.text}"
                </p>
                <div className="flex items-center gap-3">
                  <div className="w-9 h-9 rounded-full bg-primary flex items-center justify-center text-primary-foreground font-display font-bold text-sm">
                    {t.avatar}
                  </div>
                  <div>
                    <p className="font-semibold text-sm text-foreground">
                      {t.name}
                    </p>
                    <p className="text-xs text-muted-foreground">{t.role}</p>
                  </div>
                </div>
              </Card>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
}

function NewsletterSection() {
  const emailRef = useRef<HTMLInputElement>(null);

  function handleSubscribe(e: React.FormEvent) {
    e.preventDefault();
    if (emailRef.current) emailRef.current.value = "";
  }

  return (
    <section
      className="bg-gradient-to-br from-primary via-primary/90 to-accent py-20 px-4"
      data-ocid="newsletter.section"
    >
      <div className="max-w-2xl mx-auto text-center">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6 }}
        >
          <div className="inline-flex items-center justify-center w-14 h-14 rounded-2xl bg-white/20 mb-6">
            <Briefcase className="w-7 h-7 text-white" />
          </div>
          <h2 className="font-display font-bold text-4xl md:text-5xl text-white mb-4 leading-tight">
            Never miss an event
          </h2>
          <p className="text-white/80 text-lg mb-10 leading-relaxed">
            Get exclusive early access, hot deals, and curated picks delivered
            straight to your inbox.
          </p>

          <form
            onSubmit={handleSubscribe}
            className="flex flex-col sm:flex-row gap-3 max-w-md mx-auto"
            data-ocid="newsletter.form"
          >
            <Input
              ref={emailRef}
              type="email"
              required
              placeholder="Enter your email address"
              className="h-12 bg-white/20 border-white/30 text-white placeholder:text-white/60 focus:bg-white/30 flex-1 rounded-xl backdrop-blur-sm"
              data-ocid="newsletter.email_input"
            />
            <Button
              type="submit"
              size="lg"
              className="h-12 bg-secondary hover:bg-secondary/90 text-secondary-foreground font-bold px-8 rounded-xl shadow-lg transition-smooth shrink-0"
              data-ocid="newsletter.subscribe_button"
            >
              Subscribe
            </Button>
          </form>

          <p className="text-white/50 text-xs mt-4">
            No spam, ever. Unsubscribe anytime.
          </p>
        </motion.div>
      </div>
    </section>
  );
}

// ─── Page ─────────────────────────────────────────────────────────────────────

export default function HomePage() {
  return (
    <div data-ocid="home.page">
      <HeroSection />
      <StatsSection />
      <CategoriesSection />
      <FeaturedEventsSection />
      <TestimonialsSection />
      <NewsletterSection />
    </div>
  );
}
