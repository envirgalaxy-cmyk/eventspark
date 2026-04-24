import { c as createLucideIcon, u as useNavigate, a as useSearch, r as reactExports, j as jsxRuntimeExports, I as Input, B as Button, X } from "./index-BV_UP3b9.js";
import { E as EventCard } from "./EventCard-BjkgRby9.js";
import { S as Select, a as SelectTrigger, b as SelectValue, c as SelectContent, d as SelectItem } from "./select-VCH4Is1b.js";
import { s as sampleEvents, C as CATEGORIES } from "./sampleEvents-BX7lNiZr.js";
import "./StarRating-ClFg-aro.js";
import "./clock-DcPweK9z.js";
import "./map-pin-_Y7De1KV.js";
import "./Combination-DtENurLZ.js";
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
      d: "M10 20a1 1 0 0 0 .553.895l2 1A1 1 0 0 0 14 21v-7a2 2 0 0 1 .517-1.341L21.74 4.67A1 1 0 0 0 21 3H3a1 1 0 0 0-.742 1.67l7.225 7.989A2 2 0 0 1 10 14z",
      key: "sc7q7i"
    }
  ]
];
const Funnel = createLucideIcon("funnel", __iconNode$2);
/**
 * @license lucide-react v0.511.0 - ISC
 *
 * This source code is licensed under the ISC license.
 * See the LICENSE file in the root directory of this source tree.
 */
const __iconNode$1 = [
  ["path", { d: "m21 21-4.34-4.34", key: "14j7rj" }],
  ["circle", { cx: "11", cy: "11", r: "8", key: "4ej97u" }]
];
const Search = createLucideIcon("search", __iconNode$1);
/**
 * @license lucide-react v0.511.0 - ISC
 *
 * This source code is licensed under the ISC license.
 * See the LICENSE file in the root directory of this source tree.
 */
const __iconNode = [
  ["line", { x1: "21", x2: "14", y1: "4", y2: "4", key: "obuewd" }],
  ["line", { x1: "10", x2: "3", y1: "4", y2: "4", key: "1q6298" }],
  ["line", { x1: "21", x2: "12", y1: "12", y2: "12", key: "1iu8h1" }],
  ["line", { x1: "8", x2: "3", y1: "12", y2: "12", key: "ntss68" }],
  ["line", { x1: "21", x2: "16", y1: "20", y2: "20", key: "14d8ph" }],
  ["line", { x1: "12", x2: "3", y1: "20", y2: "20", key: "m0wm8r" }],
  ["line", { x1: "14", x2: "14", y1: "2", y2: "6", key: "14e1ph" }],
  ["line", { x1: "8", x2: "8", y1: "10", y2: "14", key: "1i6ji0" }],
  ["line", { x1: "16", x2: "16", y1: "18", y2: "22", key: "1lctlv" }]
];
const SlidersHorizontal = createLucideIcon("sliders-horizontal", __iconNode);
const CITIES = [
  "All Cities",
  "New York, NY",
  "Los Angeles, CA",
  "San Francisco, CA",
  "Chicago, IL",
  "Austin, TX",
  "Seattle, WA",
  "Brooklyn, NY"
];
const SORTS = [
  { value: "upcoming", label: "Upcoming First" },
  { value: "latest", label: "Latest First" },
  { value: "price-asc", label: "Price: Low to High" },
  { value: "price-desc", label: "Price: High to Low" }
];
const PAGE_SIZE = 12;
function applySort(events, sort) {
  return [...events].sort((a, b) => {
    if (sort === "upcoming") return Number(a.date - b.date);
    if (sort === "latest") return Number(b.date - a.date);
    if (sort === "price-asc") return a.price - b.price;
    if (sort === "price-desc") return b.price - a.price;
    return 0;
  });
}
function EventsPage() {
  const navigate = useNavigate();
  const rawSearch = useSearch({ strict: false });
  const urlCategory = rawSearch.category ?? "All";
  const urlCity = rawSearch.city ?? "All Cities";
  const urlSort = rawSearch.sort ?? "upcoming";
  const urlMinPrice = rawSearch.minPrice ?? "";
  const urlMaxPrice = rawSearch.maxPrice ?? "";
  const urlPage = Number(rawSearch.page ?? "1");
  const urlQuery = rawSearch.q ?? "";
  const [searchInput, setSearchInput] = reactExports.useState(urlQuery);
  const [minPriceInput, setMinPriceInput] = reactExports.useState(urlMinPrice);
  const [maxPriceInput, setMaxPriceInput] = reactExports.useState(urlMaxPrice);
  const [showFilters, setShowFilters] = reactExports.useState(false);
  reactExports.useEffect(() => {
    setSearchInput(urlQuery);
  }, [urlQuery]);
  reactExports.useEffect(() => {
    setMinPriceInput(urlMinPrice);
  }, [urlMinPrice]);
  reactExports.useEffect(() => {
    setMaxPriceInput(urlMaxPrice);
  }, [urlMaxPrice]);
  const [favorites, setFavorites] = reactExports.useState(/* @__PURE__ */ new Set());
  const toggleFavorite = reactExports.useCallback((id) => {
    setFavorites((prev) => {
      const next = new Set(prev);
      next.has(id) ? next.delete(id) : next.add(id);
      return next;
    });
  }, []);
  const pushParams = reactExports.useCallback(
    (patch) => {
      const next = {};
      const current = {
        q: urlQuery,
        category: urlCategory,
        city: urlCity,
        sort: urlSort,
        minPrice: urlMinPrice,
        maxPrice: urlMaxPrice,
        page: String(urlPage),
        ...patch
      };
      for (const [k, v] of Object.entries(current)) {
        const skip = !v || k === "q" && !v || k === "category" && v === "All" || k === "city" && v === "All Cities" || k === "sort" && v === "upcoming" || k === "page" && v === "1" || k === "minPrice" && !v || k === "maxPrice" && !v;
        if (!skip) next[k] = v;
      }
      navigate({
        search: next,
        replace: true
      });
    },
    [
      urlQuery,
      urlCategory,
      urlCity,
      urlSort,
      urlMinPrice,
      urlMaxPrice,
      urlPage,
      navigate
    ]
  );
  const filtered = reactExports.useMemo(() => {
    let result = sampleEvents;
    if (urlQuery) {
      const q = urlQuery.toLowerCase();
      result = result.filter((e) => e.title.toLowerCase().includes(q));
    }
    if (urlCategory !== "All")
      result = result.filter((e) => e.category === urlCategory);
    if (urlCity !== "All Cities")
      result = result.filter((e) => e.city === urlCity);
    const min = Number(urlMinPrice);
    const max = Number(urlMaxPrice);
    if (urlMinPrice && !Number.isNaN(min))
      result = result.filter((e) => e.price >= min);
    if (urlMaxPrice && !Number.isNaN(max))
      result = result.filter((e) => e.price <= max);
    return applySort(result, urlSort);
  }, [urlQuery, urlCategory, urlCity, urlMinPrice, urlMaxPrice, urlSort]);
  const totalPages = Math.max(1, Math.ceil(filtered.length / PAGE_SIZE));
  const safePage = Math.min(Math.max(1, urlPage), totalPages);
  const paginated = filtered.slice(
    (safePage - 1) * PAGE_SIZE,
    safePage * PAGE_SIZE
  );
  const hasActiveFilters = urlQuery || urlCategory !== "All" || urlCity !== "All Cities" || urlMinPrice || urlMaxPrice || urlSort !== "upcoming";
  function clearFilters() {
    setSearchInput("");
    setMinPriceInput("");
    setMaxPriceInput("");
    navigate({
      search: {},
      replace: true
    });
  }
  function handleSearchSubmit(e) {
    e.preventDefault();
    pushParams({ q: searchInput || void 0, page: "1" });
  }
  function handlePriceApply() {
    pushParams({
      minPrice: minPriceInput || void 0,
      maxPrice: maxPriceInput || void 0,
      page: "1"
    });
  }
  return /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "min-h-screen bg-background", children: [
    /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "bg-card border-b border-border shadow-sm", children: /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "container mx-auto px-4 py-8", children: /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex flex-col md:flex-row md:items-end gap-4 justify-between", children: [
      /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { children: [
        /* @__PURE__ */ jsxRuntimeExports.jsx("h1", { className: "font-display font-bold text-3xl md:text-4xl text-foreground tracking-tight", children: "Browse Events" }),
        /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: "text-muted-foreground mt-1 text-sm", children: "Discover concerts, workshops, conferences, and more" })
      ] }),
      /* @__PURE__ */ jsxRuntimeExports.jsxs(
        "form",
        {
          onSubmit: handleSearchSubmit,
          className: "flex gap-2 w-full md:w-auto",
          children: [
            /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "relative flex-1 md:w-80", children: [
              /* @__PURE__ */ jsxRuntimeExports.jsx(Search, { className: "absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground pointer-events-none" }),
              /* @__PURE__ */ jsxRuntimeExports.jsx(
                Input,
                {
                  value: searchInput,
                  onChange: (e) => setSearchInput(e.target.value),
                  placeholder: "Search events…",
                  className: "pl-9 bg-background border-input",
                  "data-ocid": "events.search_input"
                }
              )
            ] }),
            /* @__PURE__ */ jsxRuntimeExports.jsx(
              Button,
              {
                type: "submit",
                className: "bg-primary text-primary-foreground shrink-0",
                "data-ocid": "events.search_submit_button",
                children: "Search"
              }
            )
          ]
        }
      )
    ] }) }) }),
    /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "container mx-auto px-4 py-6", children: [
      /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "flex gap-2 flex-wrap mb-5", children: CATEGORIES.map((cat) => /* @__PURE__ */ jsxRuntimeExports.jsx(
        "button",
        {
          type: "button",
          onClick: () => pushParams({
            category: cat === "All" ? void 0 : cat,
            page: "1"
          }),
          className: `px-4 py-1.5 rounded-full text-sm font-semibold border transition-smooth ${urlCategory === cat || cat === "All" && urlCategory === "All" ? "bg-primary text-primary-foreground border-primary shadow-sm" : "bg-card text-muted-foreground border-border hover:border-primary/40 hover:text-foreground"}`,
          "data-ocid": `events.category_filter.${cat.toLowerCase()}`,
          children: cat
        },
        cat
      )) }),
      /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex flex-col sm:flex-row gap-3 mb-6", children: [
        /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex gap-3 flex-wrap flex-1", children: [
          /* @__PURE__ */ jsxRuntimeExports.jsxs(
            Select,
            {
              value: urlCity,
              onValueChange: (v) => pushParams({
                city: v === "All Cities" ? void 0 : v,
                page: "1"
              }),
              children: [
                /* @__PURE__ */ jsxRuntimeExports.jsx(
                  SelectTrigger,
                  {
                    className: "w-44 bg-card border-input",
                    "data-ocid": "events.city_select",
                    children: /* @__PURE__ */ jsxRuntimeExports.jsx(SelectValue, { placeholder: "All Cities" })
                  }
                ),
                /* @__PURE__ */ jsxRuntimeExports.jsx(SelectContent, { children: CITIES.map((c) => /* @__PURE__ */ jsxRuntimeExports.jsx(SelectItem, { value: c, children: c }, c)) })
              ]
            }
          ),
          /* @__PURE__ */ jsxRuntimeExports.jsxs(
            Select,
            {
              value: urlSort,
              onValueChange: (v) => pushParams({
                sort: v === "upcoming" ? void 0 : v,
                page: "1"
              }),
              children: [
                /* @__PURE__ */ jsxRuntimeExports.jsx(
                  SelectTrigger,
                  {
                    className: "w-48 bg-card border-input",
                    "data-ocid": "events.sort_select",
                    children: /* @__PURE__ */ jsxRuntimeExports.jsx(SelectValue, {})
                  }
                ),
                /* @__PURE__ */ jsxRuntimeExports.jsx(SelectContent, { children: SORTS.map((s) => /* @__PURE__ */ jsxRuntimeExports.jsx(SelectItem, { value: s.value, children: s.label }, s.value)) })
              ]
            }
          ),
          /* @__PURE__ */ jsxRuntimeExports.jsxs(
            Button,
            {
              variant: "outline",
              size: "default",
              onClick: () => setShowFilters((p) => !p),
              className: `gap-2 border-input ${showFilters ? "bg-primary/10 border-primary/40 text-primary" : "bg-card text-muted-foreground hover:text-foreground"}`,
              "data-ocid": "events.price_filter_toggle",
              children: [
                /* @__PURE__ */ jsxRuntimeExports.jsx(SlidersHorizontal, { className: "w-4 h-4" }),
                "Price Range"
              ]
            }
          ),
          hasActiveFilters && /* @__PURE__ */ jsxRuntimeExports.jsxs(
            Button,
            {
              variant: "ghost",
              size: "default",
              onClick: clearFilters,
              className: "gap-1.5 text-muted-foreground hover:text-foreground",
              "data-ocid": "events.clear_filters_button",
              children: [
                /* @__PURE__ */ jsxRuntimeExports.jsx(X, { className: "w-4 h-4" }),
                "Clear"
              ]
            }
          )
        ] }),
        /* @__PURE__ */ jsxRuntimeExports.jsxs(
          "div",
          {
            className: "text-sm text-muted-foreground self-center shrink-0",
            "data-ocid": "events.results_count",
            children: [
              "Showing",
              " ",
              /* @__PURE__ */ jsxRuntimeExports.jsx("span", { className: "font-semibold text-foreground", children: paginated.length }),
              " ",
              "of",
              " ",
              /* @__PURE__ */ jsxRuntimeExports.jsx("span", { className: "font-semibold text-foreground", children: filtered.length }),
              " ",
              "events"
            ]
          }
        )
      ] }),
      showFilters && /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "bg-card border border-border rounded-xl p-4 mb-6 flex flex-wrap items-end gap-4 shadow-sm", children: [
        /* @__PURE__ */ jsxRuntimeExports.jsx(Funnel, { className: "w-4 h-4 text-muted-foreground self-center" }),
        /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex flex-col gap-1", children: [
          /* @__PURE__ */ jsxRuntimeExports.jsx(
            "label",
            {
              htmlFor: "min-price",
              className: "text-xs font-medium text-muted-foreground",
              children: "Min Price ($)"
            }
          ),
          /* @__PURE__ */ jsxRuntimeExports.jsx(
            Input,
            {
              id: "min-price",
              type: "number",
              min: 0,
              value: minPriceInput,
              onChange: (e) => setMinPriceInput(e.target.value),
              placeholder: "0",
              className: "w-28 bg-background border-input",
              "data-ocid": "events.min_price_input"
            }
          )
        ] }),
        /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex flex-col gap-1", children: [
          /* @__PURE__ */ jsxRuntimeExports.jsx(
            "label",
            {
              htmlFor: "max-price",
              className: "text-xs font-medium text-muted-foreground",
              children: "Max Price ($)"
            }
          ),
          /* @__PURE__ */ jsxRuntimeExports.jsx(
            Input,
            {
              id: "max-price",
              type: "number",
              min: 0,
              value: maxPriceInput,
              onChange: (e) => setMaxPriceInput(e.target.value),
              placeholder: "1000",
              className: "w-28 bg-background border-input",
              "data-ocid": "events.max_price_input"
            }
          )
        ] }),
        /* @__PURE__ */ jsxRuntimeExports.jsx(
          Button,
          {
            onClick: handlePriceApply,
            className: "bg-primary text-primary-foreground",
            "data-ocid": "events.price_apply_button",
            children: "Apply"
          }
        ),
        (urlMinPrice || urlMaxPrice) && /* @__PURE__ */ jsxRuntimeExports.jsxs(
          Button,
          {
            variant: "ghost",
            size: "sm",
            onClick: () => {
              setMinPriceInput("");
              setMaxPriceInput("");
              pushParams({
                minPrice: void 0,
                maxPrice: void 0,
                page: "1"
              });
            },
            className: "text-muted-foreground",
            "data-ocid": "events.price_clear_button",
            children: [
              /* @__PURE__ */ jsxRuntimeExports.jsx(X, { className: "w-4 h-4 mr-1" }),
              " Clear price"
            ]
          }
        )
      ] }),
      paginated.length > 0 ? /* @__PURE__ */ jsxRuntimeExports.jsxs(jsxRuntimeExports.Fragment, { children: [
        /* @__PURE__ */ jsxRuntimeExports.jsx(
          "div",
          {
            className: "grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6",
            "data-ocid": "events.list",
            children: paginated.map((event, i) => /* @__PURE__ */ jsxRuntimeExports.jsx(
              EventCard,
              {
                event,
                isFavorite: favorites.has(event.id),
                onToggleFavorite: toggleFavorite,
                index: (safePage - 1) * PAGE_SIZE + i
              },
              event.id.toString()
            ))
          }
        ),
        totalPages > 1 && /* @__PURE__ */ jsxRuntimeExports.jsxs(
          "div",
          {
            className: "flex items-center justify-center gap-4 mt-10",
            "data-ocid": "events.pagination",
            children: [
              /* @__PURE__ */ jsxRuntimeExports.jsx(
                Button,
                {
                  variant: "outline",
                  onClick: () => pushParams({ page: String(safePage - 1) }),
                  disabled: safePage <= 1,
                  className: "gap-2 border-input bg-card",
                  "data-ocid": "events.pagination_prev",
                  children: "← Prev"
                }
              ),
              /* @__PURE__ */ jsxRuntimeExports.jsxs("span", { className: "text-sm text-muted-foreground", children: [
                "Page",
                " ",
                /* @__PURE__ */ jsxRuntimeExports.jsx("span", { className: "font-semibold text-foreground", children: safePage }),
                " ",
                "of",
                " ",
                /* @__PURE__ */ jsxRuntimeExports.jsx("span", { className: "font-semibold text-foreground", children: totalPages })
              ] }),
              /* @__PURE__ */ jsxRuntimeExports.jsx(
                Button,
                {
                  variant: "outline",
                  onClick: () => pushParams({ page: String(safePage + 1) }),
                  disabled: safePage >= totalPages,
                  className: "gap-2 border-input bg-card",
                  "data-ocid": "events.pagination_next",
                  children: "Next →"
                }
              )
            ]
          }
        )
      ] }) : /* @__PURE__ */ jsxRuntimeExports.jsxs(
        "div",
        {
          className: "flex flex-col items-center justify-center py-24 gap-5 text-center",
          "data-ocid": "events.empty_state",
          children: [
            /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "w-16 h-16 rounded-2xl bg-muted flex items-center justify-center", children: /* @__PURE__ */ jsxRuntimeExports.jsx(Search, { className: "w-8 h-8 text-muted-foreground" }) }),
            /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { children: [
              /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: "font-display font-bold text-xl text-foreground mb-1", children: "No events found" }),
              /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: "text-muted-foreground text-sm max-w-xs", children: "Try adjusting your search or filters to find what you're looking for." })
            ] }),
            /* @__PURE__ */ jsxRuntimeExports.jsxs(
              Button,
              {
                onClick: clearFilters,
                className: "bg-primary text-primary-foreground gap-2",
                "data-ocid": "events.empty_state_clear_button",
                children: [
                  /* @__PURE__ */ jsxRuntimeExports.jsx(X, { className: "w-4 h-4" }),
                  "Clear all filters"
                ]
              }
            )
          ]
        }
      )
    ] })
  ] });
}
export {
  EventsPage as default
};
