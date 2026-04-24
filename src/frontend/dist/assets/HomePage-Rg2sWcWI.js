import { c as createLucideIcon, j as jsxRuntimeExports, u as useNavigate, r as reactExports, I as Input, B as Button, L as Link, Z as Zap } from "./index-BV_UP3b9.js";
import { E as EventCard } from "./EventCard-BjkgRby9.js";
import { B as Badge, s as sampleEvents } from "./sampleEvents-BX7lNiZr.js";
import { C as Calendar, U as Users, S as Star, a as Card } from "./StarRating-ClFg-aro.js";
import { u as useFavorites } from "./useFavorites-CqDsFOro.js";
import { m as motion } from "./proxy-Ba3TeJxd.js";
import "./map-pin-_Y7De1KV.js";
import "./clock-DcPweK9z.js";
/**
 * @license lucide-react v0.511.0 - ISC
 *
 * This source code is licensed under the ISC license.
 * See the LICENSE file in the root directory of this source tree.
 */
const __iconNode$4 = [
  ["path", { d: "M5 12h14", key: "1ays0h" }],
  ["path", { d: "m12 5 7 7-7 7", key: "xquz4c" }]
];
const ArrowRight = createLucideIcon("arrow-right", __iconNode$4);
/**
 * @license lucide-react v0.511.0 - ISC
 *
 * This source code is licensed under the ISC license.
 * See the LICENSE file in the root directory of this source tree.
 */
const __iconNode$3 = [
  ["path", { d: "M16 20V4a2 2 0 0 0-2-2h-4a2 2 0 0 0-2 2v16", key: "jecpp" }],
  ["rect", { width: "20", height: "14", x: "2", y: "6", rx: "2", key: "i6l2r4" }]
];
const Briefcase = createLucideIcon("briefcase", __iconNode$3);
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
      d: "m11 7.601-5.994 8.19a1 1 0 0 0 .1 1.298l.817.818a1 1 0 0 0 1.314.087L15.09 12",
      key: "80a601"
    }
  ],
  [
    "path",
    {
      d: "M16.5 21.174C15.5 20.5 14.372 20 13 20c-2.058 0-3.928 2.356-6 2-2.072-.356-2.775-3.369-1.5-4.5",
      key: "j0ngtp"
    }
  ],
  ["circle", { cx: "16", cy: "7", r: "5", key: "d08jfb" }]
];
const MicVocal = createLucideIcon("mic-vocal", __iconNode$2);
/**
 * @license lucide-react v0.511.0 - ISC
 *
 * This source code is licensed under the ISC license.
 * See the LICENSE file in the root directory of this source tree.
 */
const __iconNode$1 = [
  ["path", { d: "M9 18V5l12-2v13", key: "1jmyc2" }],
  ["circle", { cx: "6", cy: "18", r: "3", key: "fqmcym" }],
  ["circle", { cx: "18", cy: "16", r: "3", key: "1hluhg" }]
];
const Music = createLucideIcon("music", __iconNode$1);
/**
 * @license lucide-react v0.511.0 - ISC
 *
 * This source code is licensed under the ISC license.
 * See the LICENSE file in the root directory of this source tree.
 */
const __iconNode = [
  ["path", { d: "M6 9H4.5a2.5 2.5 0 0 1 0-5H6", key: "17hqa7" }],
  ["path", { d: "M18 9h1.5a2.5 2.5 0 0 0 0-5H18", key: "lmptdp" }],
  ["path", { d: "M4 22h16", key: "57wxv0" }],
  ["path", { d: "M10 14.66V17c0 .55-.47.98-.97 1.21C7.85 18.75 7 20.24 7 22", key: "1nw9bq" }],
  ["path", { d: "M14 14.66V17c0 .55.47.98.97 1.21C16.15 18.75 17 20.24 17 22", key: "1np0yb" }],
  ["path", { d: "M18 2H6v7a6 6 0 0 0 12 0V2Z", key: "u46fv3" }]
];
const Trophy = createLucideIcon("trophy", __iconNode);
const FEATURED_IDS = [1, 2, 3, 4, 5, 6];
const featuredEvents = sampleEvents.filter(
  (e) => FEATURED_IDS.includes(Number(e.id))
);
const CATEGORIES = [
  {
    label: "Concerts",
    icon: Music,
    color: "from-primary/20 to-primary/5 border-primary/30 hover:border-primary/60",
    iconColor: "text-primary",
    query: "Music"
  },
  {
    label: "Workshops",
    icon: Zap,
    color: "from-secondary/20 to-secondary/5 border-secondary/30 hover:border-secondary/60",
    iconColor: "text-secondary",
    query: "Workshop"
  },
  {
    label: "Conferences",
    icon: MicVocal,
    color: "from-accent/20 to-accent/5 border-accent/30 hover:border-accent/60",
    iconColor: "text-accent",
    query: "Conference"
  },
  {
    label: "All Events",
    icon: Calendar,
    color: "from-muted/60 to-muted/20 border-border hover:border-primary/40",
    iconColor: "text-foreground",
    query: ""
  }
];
const STATS = [
  { value: "500+", label: "Events", icon: Calendar },
  { value: "50K+", label: "Attendees", icon: Users },
  { value: "100+", label: "Cities", icon: Trophy },
  { value: "4.9", label: "Rating", icon: Star }
];
const TESTIMONIALS = [
  {
    name: "Jessica M.",
    role: "Concert-goer",
    text: "Found my favorite bands here before they became famous. The discovery features are unmatched.",
    avatar: "J"
  },
  {
    name: "David K.",
    role: "Tech Professional",
    text: "Booked three dev conferences in one afternoon. Clean interface, zero friction.",
    avatar: "D"
  },
  {
    name: "Ana R.",
    role: "Workshop Enthusiast",
    text: "The workshop listings are so detailed. I always know exactly what I'm signing up for.",
    avatar: "A"
  }
];
function HeroSection() {
  const navigate = useNavigate();
  const [query, setQuery] = reactExports.useState("");
  function handleSearch(e) {
    e.preventDefault();
    void navigate({ to: "/events", search: query ? { q: query } : {} });
  }
  return /* @__PURE__ */ jsxRuntimeExports.jsxs(
    "section",
    {
      className: "relative min-h-[92vh] flex items-center justify-center overflow-hidden",
      "data-ocid": "hero.section",
      children: [
        /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "absolute inset-0", children: [
          /* @__PURE__ */ jsxRuntimeExports.jsx(
            "img",
            {
              src: "/assets/generated/hero-event-crowd.dim_1600x700.jpg",
              alt: "Live event crowd",
              className: "w-full h-full object-cover"
            }
          ),
          /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "absolute inset-0 bg-gradient-to-b from-foreground/70 via-foreground/50 to-background/90" }),
          /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "absolute inset-0 bg-gradient-to-r from-primary/30 via-transparent to-accent/20" })
        ] }),
        /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "relative z-10 max-w-4xl mx-auto px-4 text-center", children: [
          /* @__PURE__ */ jsxRuntimeExports.jsxs(
            motion.div,
            {
              initial: { opacity: 0, y: 24 },
              animate: { opacity: 1, y: 0 },
              transition: { duration: 0.7, ease: "easeOut" },
              children: [
                /* @__PURE__ */ jsxRuntimeExports.jsx(Badge, { className: "mb-6 bg-primary/20 text-primary-foreground border border-primary/40 backdrop-blur-sm font-semibold tracking-wide uppercase text-xs px-4 py-1.5", children: "✦ The Smartest Way to Book Events" }),
                /* @__PURE__ */ jsxRuntimeExports.jsxs("h1", { className: "font-display font-bold text-5xl md:text-7xl lg:text-8xl leading-[0.95] text-white mb-6 tracking-tight", children: [
                  "Discover",
                  " ",
                  /* @__PURE__ */ jsxRuntimeExports.jsx("span", { className: "text-transparent bg-clip-text bg-gradient-to-r from-primary to-secondary", children: "Amazing" }),
                  /* @__PURE__ */ jsxRuntimeExports.jsx("br", {}),
                  "Events"
                ] }),
                /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: "text-white/80 text-lg md:text-xl mb-10 max-w-2xl mx-auto leading-relaxed", children: "From electric concerts and sold-out conferences to intimate workshops — find and book unforgettable experiences in your city." })
              ]
            }
          ),
          /* @__PURE__ */ jsxRuntimeExports.jsxs(
            motion.form,
            {
              initial: { opacity: 0, y: 16 },
              animate: { opacity: 1, y: 0 },
              transition: { duration: 0.6, delay: 0.25, ease: "easeOut" },
              onSubmit: handleSearch,
              className: "flex items-center gap-2 max-w-xl mx-auto mb-10",
              "data-ocid": "hero.search_form",
              children: [
                /* @__PURE__ */ jsxRuntimeExports.jsx(
                  Input,
                  {
                    value: query,
                    onChange: (e) => setQuery(e.target.value),
                    placeholder: "Search events, venues, cities…",
                    className: "h-14 bg-card/90 backdrop-blur-md border-border/60 text-foreground placeholder:text-muted-foreground font-body text-base rounded-xl shadow-lg flex-1",
                    "data-ocid": "hero.search_input"
                  }
                ),
                /* @__PURE__ */ jsxRuntimeExports.jsx(
                  Button,
                  {
                    type: "submit",
                    size: "lg",
                    className: "h-14 px-6 bg-primary hover:bg-primary/90 text-primary-foreground font-semibold rounded-xl shrink-0 shadow-lg transition-smooth",
                    "data-ocid": "hero.search_submit",
                    children: "Search"
                  }
                )
              ]
            }
          ),
          /* @__PURE__ */ jsxRuntimeExports.jsxs(
            motion.div,
            {
              initial: { opacity: 0, y: 12 },
              animate: { opacity: 1, y: 0 },
              transition: { duration: 0.5, delay: 0.4, ease: "easeOut" },
              className: "flex flex-wrap items-center justify-center gap-4",
              children: [
                /* @__PURE__ */ jsxRuntimeExports.jsx(
                  Button,
                  {
                    asChild: true,
                    size: "lg",
                    className: "h-12 px-8 bg-secondary hover:bg-secondary/90 text-secondary-foreground font-bold rounded-xl shadow-lg text-base transition-smooth",
                    "data-ocid": "hero.browse_events_button",
                    children: /* @__PURE__ */ jsxRuntimeExports.jsxs(Link, { to: "/events", children: [
                      "Browse Events ",
                      /* @__PURE__ */ jsxRuntimeExports.jsx(ArrowRight, { className: "ml-2 w-4 h-4" })
                    ] })
                  }
                ),
                /* @__PURE__ */ jsxRuntimeExports.jsx(
                  Button,
                  {
                    asChild: true,
                    size: "lg",
                    variant: "outline",
                    className: "h-12 px-8 bg-card/20 border-white/40 text-white hover:bg-card/40 hover:text-white font-semibold rounded-xl text-base backdrop-blur-sm transition-smooth",
                    "data-ocid": "hero.learn_more_button",
                    children: /* @__PURE__ */ jsxRuntimeExports.jsx(Link, { to: "/contact", children: "Learn More" })
                  }
                )
              ]
            }
          )
        ] }),
        /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "absolute bottom-0 left-0 right-0 h-32 bg-gradient-to-t from-background to-transparent pointer-events-none" })
      ]
    }
  );
}
function StatsSection() {
  return /* @__PURE__ */ jsxRuntimeExports.jsx(
    "section",
    {
      className: "bg-card border-y border-border py-14",
      "data-ocid": "stats.section",
      children: /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "max-w-5xl mx-auto px-4", children: /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "grid grid-cols-2 md:grid-cols-4 gap-6", children: STATS.map((stat, i) => {
        const Icon = stat.icon;
        return /* @__PURE__ */ jsxRuntimeExports.jsxs(
          motion.div,
          {
            initial: { opacity: 0, y: 20 },
            whileInView: { opacity: 1, y: 0 },
            viewport: { once: true },
            transition: { delay: i * 0.1, duration: 0.5 },
            className: "flex flex-col items-center text-center gap-2",
            "data-ocid": `stats.item.${i + 1}`,
            children: [
              /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "w-12 h-12 rounded-2xl bg-primary/10 flex items-center justify-center mb-1", children: /* @__PURE__ */ jsxRuntimeExports.jsx(Icon, { className: "w-6 h-6 text-primary" }) }),
              /* @__PURE__ */ jsxRuntimeExports.jsx("span", { className: "font-display font-bold text-4xl text-foreground tracking-tight", children: stat.value }),
              /* @__PURE__ */ jsxRuntimeExports.jsx("span", { className: "text-muted-foreground text-sm font-medium", children: stat.label })
            ]
          },
          stat.label
        );
      }) }) })
    }
  );
}
function CategoriesSection() {
  return /* @__PURE__ */ jsxRuntimeExports.jsx(
    "section",
    {
      className: "bg-background py-20 px-4",
      "data-ocid": "categories.section",
      children: /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "max-w-5xl mx-auto", children: [
        /* @__PURE__ */ jsxRuntimeExports.jsxs(
          motion.div,
          {
            initial: { opacity: 0, y: 20 },
            whileInView: { opacity: 1, y: 0 },
            viewport: { once: true },
            transition: { duration: 0.6 },
            className: "text-center mb-12",
            children: [
              /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: "text-primary font-semibold uppercase tracking-widest text-sm mb-3", children: "Explore by Category" }),
              /* @__PURE__ */ jsxRuntimeExports.jsx("h2", { className: "font-display font-bold text-4xl md:text-5xl text-foreground", children: "What are you into?" })
            ]
          }
        ),
        /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "grid grid-cols-2 md:grid-cols-4 gap-4", children: CATEGORIES.map((cat, i) => {
          const Icon = cat.icon;
          return /* @__PURE__ */ jsxRuntimeExports.jsx(
            motion.div,
            {
              initial: { opacity: 0, scale: 0.92 },
              whileInView: { opacity: 1, scale: 1 },
              viewport: { once: true },
              transition: { delay: i * 0.1, duration: 0.45 },
              children: /* @__PURE__ */ jsxRuntimeExports.jsx(
                Link,
                {
                  to: "/events",
                  search: cat.query ? { category: cat.query } : {},
                  children: /* @__PURE__ */ jsxRuntimeExports.jsxs(
                    Card,
                    {
                      className: `group cursor-pointer p-6 text-center bg-gradient-to-br border transition-smooth hover:-translate-y-1 hover:shadow-lg ${cat.color}`,
                      "data-ocid": `categories.item.${i + 1}`,
                      children: [
                        /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "mx-auto w-14 h-14 rounded-2xl flex items-center justify-center mb-4 bg-background/60 group-hover:bg-background transition-smooth", children: /* @__PURE__ */ jsxRuntimeExports.jsx(Icon, { className: `w-7 h-7 ${cat.iconColor}` }) }),
                        /* @__PURE__ */ jsxRuntimeExports.jsx("h3", { className: "font-display font-bold text-base text-foreground", children: cat.label })
                      ]
                    }
                  )
                }
              )
            },
            cat.label
          );
        }) })
      ] })
    }
  );
}
function FeaturedEventsSection() {
  const { isFavorite, toggle } = useFavorites();
  return /* @__PURE__ */ jsxRuntimeExports.jsx(
    "section",
    {
      className: "bg-muted/30 py-20 px-4",
      "data-ocid": "featured_events.section",
      children: /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "max-w-6xl mx-auto", children: [
        /* @__PURE__ */ jsxRuntimeExports.jsxs(
          motion.div,
          {
            initial: { opacity: 0, y: 20 },
            whileInView: { opacity: 1, y: 0 },
            viewport: { once: true },
            transition: { duration: 0.6 },
            className: "flex flex-col sm:flex-row sm:items-end justify-between mb-12 gap-4",
            children: [
              /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { children: [
                /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: "text-secondary font-semibold uppercase tracking-widest text-sm mb-3", children: "Hand-picked for You" }),
                /* @__PURE__ */ jsxRuntimeExports.jsx("h2", { className: "font-display font-bold text-4xl md:text-5xl text-foreground", children: "Featured Events" })
              ] }),
              /* @__PURE__ */ jsxRuntimeExports.jsx(
                Button,
                {
                  asChild: true,
                  variant: "outline",
                  className: "border-border hover:border-primary/50 hover:text-primary transition-smooth self-start sm:self-auto",
                  "data-ocid": "featured_events.view_all_button",
                  children: /* @__PURE__ */ jsxRuntimeExports.jsxs(Link, { to: "/events", children: [
                    "View All ",
                    /* @__PURE__ */ jsxRuntimeExports.jsx(ArrowRight, { className: "ml-1.5 w-4 h-4" })
                  ] })
                }
              )
            ]
          }
        ),
        /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6", children: featuredEvents.map((event, i) => /* @__PURE__ */ jsxRuntimeExports.jsx(
          motion.div,
          {
            initial: { opacity: 0, y: 28 },
            whileInView: { opacity: 1, y: 0 },
            viewport: { once: true },
            transition: { delay: i * 0.1, duration: 0.5 },
            children: /* @__PURE__ */ jsxRuntimeExports.jsx(
              EventCard,
              {
                event,
                isFavorite: isFavorite(event.id),
                onToggleFavorite: toggle,
                index: i
              }
            )
          },
          event.id.toString()
        )) })
      ] })
    }
  );
}
function TestimonialsSection() {
  return /* @__PURE__ */ jsxRuntimeExports.jsx(
    "section",
    {
      className: "bg-background py-20 px-4",
      "data-ocid": "testimonials.section",
      children: /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "max-w-5xl mx-auto", children: [
        /* @__PURE__ */ jsxRuntimeExports.jsxs(
          motion.div,
          {
            initial: { opacity: 0, y: 20 },
            whileInView: { opacity: 1, y: 0 },
            viewport: { once: true },
            transition: { duration: 0.6 },
            className: "text-center mb-12",
            children: [
              /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: "text-accent font-semibold uppercase tracking-widest text-sm mb-3", children: "What People Say" }),
              /* @__PURE__ */ jsxRuntimeExports.jsx("h2", { className: "font-display font-bold text-4xl md:text-5xl text-foreground", children: "Loved by event-goers" })
            ]
          }
        ),
        /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "grid grid-cols-1 md:grid-cols-3 gap-6", children: TESTIMONIALS.map((t, i) => /* @__PURE__ */ jsxRuntimeExports.jsx(
          motion.div,
          {
            initial: { opacity: 0, x: -20 },
            whileInView: { opacity: 1, x: 0 },
            viewport: { once: true },
            transition: { delay: i * 0.12, duration: 0.5 },
            children: /* @__PURE__ */ jsxRuntimeExports.jsxs(
              Card,
              {
                className: "p-6 bg-card border border-border hover:border-primary/30 hover:shadow-md transition-smooth",
                "data-ocid": `testimonials.item.${i + 1}`,
                children: [
                  /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "flex items-center gap-1 mb-4", children: Array.from({ length: 5 }, (_, si) => si).map((si) => /* @__PURE__ */ jsxRuntimeExports.jsx(
                    Star,
                    {
                      className: "w-4 h-4 fill-secondary text-secondary"
                    },
                    si
                  )) }),
                  /* @__PURE__ */ jsxRuntimeExports.jsxs("p", { className: "text-foreground/80 text-sm leading-relaxed mb-5 italic", children: [
                    '"',
                    t.text,
                    '"'
                  ] }),
                  /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex items-center gap-3", children: [
                    /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "w-9 h-9 rounded-full bg-primary flex items-center justify-center text-primary-foreground font-display font-bold text-sm", children: t.avatar }),
                    /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { children: [
                      /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: "font-semibold text-sm text-foreground", children: t.name }),
                      /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: "text-xs text-muted-foreground", children: t.role })
                    ] })
                  ] })
                ]
              }
            )
          },
          t.name
        )) })
      ] })
    }
  );
}
function NewsletterSection() {
  const emailRef = reactExports.useRef(null);
  function handleSubscribe(e) {
    e.preventDefault();
    if (emailRef.current) emailRef.current.value = "";
  }
  return /* @__PURE__ */ jsxRuntimeExports.jsx(
    "section",
    {
      className: "bg-gradient-to-br from-primary via-primary/90 to-accent py-20 px-4",
      "data-ocid": "newsletter.section",
      children: /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "max-w-2xl mx-auto text-center", children: /* @__PURE__ */ jsxRuntimeExports.jsxs(
        motion.div,
        {
          initial: { opacity: 0, y: 20 },
          whileInView: { opacity: 1, y: 0 },
          viewport: { once: true },
          transition: { duration: 0.6 },
          children: [
            /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "inline-flex items-center justify-center w-14 h-14 rounded-2xl bg-white/20 mb-6", children: /* @__PURE__ */ jsxRuntimeExports.jsx(Briefcase, { className: "w-7 h-7 text-white" }) }),
            /* @__PURE__ */ jsxRuntimeExports.jsx("h2", { className: "font-display font-bold text-4xl md:text-5xl text-white mb-4 leading-tight", children: "Never miss an event" }),
            /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: "text-white/80 text-lg mb-10 leading-relaxed", children: "Get exclusive early access, hot deals, and curated picks delivered straight to your inbox." }),
            /* @__PURE__ */ jsxRuntimeExports.jsxs(
              "form",
              {
                onSubmit: handleSubscribe,
                className: "flex flex-col sm:flex-row gap-3 max-w-md mx-auto",
                "data-ocid": "newsletter.form",
                children: [
                  /* @__PURE__ */ jsxRuntimeExports.jsx(
                    Input,
                    {
                      ref: emailRef,
                      type: "email",
                      required: true,
                      placeholder: "Enter your email address",
                      className: "h-12 bg-white/20 border-white/30 text-white placeholder:text-white/60 focus:bg-white/30 flex-1 rounded-xl backdrop-blur-sm",
                      "data-ocid": "newsletter.email_input"
                    }
                  ),
                  /* @__PURE__ */ jsxRuntimeExports.jsx(
                    Button,
                    {
                      type: "submit",
                      size: "lg",
                      className: "h-12 bg-secondary hover:bg-secondary/90 text-secondary-foreground font-bold px-8 rounded-xl shadow-lg transition-smooth shrink-0",
                      "data-ocid": "newsletter.subscribe_button",
                      children: "Subscribe"
                    }
                  )
                ]
              }
            ),
            /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: "text-white/50 text-xs mt-4", children: "No spam, ever. Unsubscribe anytime." })
          ]
        }
      ) })
    }
  );
}
function HomePage() {
  return /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { "data-ocid": "home.page", children: [
    /* @__PURE__ */ jsxRuntimeExports.jsx(HeroSection, {}),
    /* @__PURE__ */ jsxRuntimeExports.jsx(StatsSection, {}),
    /* @__PURE__ */ jsxRuntimeExports.jsx(CategoriesSection, {}),
    /* @__PURE__ */ jsxRuntimeExports.jsx(FeaturedEventsSection, {}),
    /* @__PURE__ */ jsxRuntimeExports.jsx(TestimonialsSection, {}),
    /* @__PURE__ */ jsxRuntimeExports.jsx(NewsletterSection, {})
  ] });
}
export {
  HomePage as default
};
