import { EventCard } from "@/components/shared/EventCard";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { CATEGORIES, sampleEvents } from "@/data/sampleEvents";
import type { Event } from "@/types";
import { useNavigate, useSearch } from "@tanstack/react-router";
import { Filter, Search, SlidersHorizontal, X } from "lucide-react";
import { useCallback, useEffect, useMemo, useState } from "react";

const CITIES = [
  "All Cities",
  "New York, NY",
  "Los Angeles, CA",
  "San Francisco, CA",
  "Chicago, IL",
  "Austin, TX",
  "Seattle, WA",
  "Brooklyn, NY",
];
const SORTS = [
  { value: "upcoming", label: "Upcoming First" },
  { value: "latest", label: "Latest First" },
  { value: "price-asc", label: "Price: Low to High" },
  { value: "price-desc", label: "Price: High to Low" },
];
const PAGE_SIZE = 12;

type SortKey = "upcoming" | "latest" | "price-asc" | "price-desc";

function applySort(events: Event[], sort: SortKey): Event[] {
  return [...events].sort((a, b) => {
    if (sort === "upcoming") return Number(a.date - b.date);
    if (sort === "latest") return Number(b.date - a.date);
    if (sort === "price-asc") return a.price - b.price;
    if (sort === "price-desc") return b.price - a.price;
    return 0;
  });
}

export default function EventsPage() {
  const navigate = useNavigate();
  const rawSearch = useSearch({ strict: false }) as Record<string, string>;

  // Derive filter state from URL params
  const urlCategory = rawSearch.category ?? "All";
  const urlCity = rawSearch.city ?? "All Cities";
  const urlSort = (rawSearch.sort as SortKey) ?? "upcoming";
  const urlMinPrice = rawSearch.minPrice ?? "";
  const urlMaxPrice = rawSearch.maxPrice ?? "";
  const urlPage = Number(rawSearch.page ?? "1");
  const urlQuery = rawSearch.q ?? "";

  // Local input state (committed on Enter/submit)
  const [searchInput, setSearchInput] = useState(urlQuery);
  const [minPriceInput, setMinPriceInput] = useState(urlMinPrice);
  const [maxPriceInput, setMaxPriceInput] = useState(urlMaxPrice);
  const [showFilters, setShowFilters] = useState(false);

  // Sync inputs when URL changes externally
  useEffect(() => {
    setSearchInput(urlQuery);
  }, [urlQuery]);
  useEffect(() => {
    setMinPriceInput(urlMinPrice);
  }, [urlMinPrice]);
  useEffect(() => {
    setMaxPriceInput(urlMaxPrice);
  }, [urlMaxPrice]);

  // Favorites
  const [favorites, setFavorites] = useState<Set<bigint>>(new Set());
  const toggleFavorite = useCallback((id: bigint) => {
    setFavorites((prev) => {
      const next = new Set(prev);
      next.has(id) ? next.delete(id) : next.add(id);
      return next;
    });
  }, []);

  // Build URL params helper
  const pushParams = useCallback(
    (patch: Record<string, string | undefined>) => {
      const next: Record<string, string> = {};
      const current: Record<string, string> = {
        q: urlQuery,
        category: urlCategory,
        city: urlCity,
        sort: urlSort,
        minPrice: urlMinPrice,
        maxPrice: urlMaxPrice,
        page: String(urlPage),
        ...patch,
      };
      for (const [k, v] of Object.entries(current)) {
        const skip =
          !v ||
          (k === "q" && !v) ||
          (k === "category" && v === "All") ||
          (k === "city" && v === "All Cities") ||
          (k === "sort" && v === "upcoming") ||
          (k === "page" && v === "1") ||
          (k === "minPrice" && !v) ||
          (k === "maxPrice" && !v);
        if (!skip) next[k] = v;
      }
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      navigate({
        search: next as unknown as Parameters<typeof navigate>[0]["search"],
        replace: true,
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
      navigate,
    ],
  );

  // Filter + sort
  const filtered = useMemo(() => {
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
    safePage * PAGE_SIZE,
  );

  const hasActiveFilters =
    urlQuery ||
    urlCategory !== "All" ||
    urlCity !== "All Cities" ||
    urlMinPrice ||
    urlMaxPrice ||
    urlSort !== "upcoming";

  function clearFilters() {
    setSearchInput("");
    setMinPriceInput("");
    setMaxPriceInput("");
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    navigate({
      search: {} as unknown as Parameters<typeof navigate>[0]["search"],
      replace: true,
    });
  }

  function handleSearchSubmit(e: React.FormEvent) {
    e.preventDefault();
    pushParams({ q: searchInput || undefined, page: "1" });
  }

  function handlePriceApply() {
    pushParams({
      minPrice: minPriceInput || undefined,
      maxPrice: maxPriceInput || undefined,
      page: "1",
    });
  }

  return (
    <div className="min-h-screen bg-background">
      {/* Hero bar */}
      <div className="bg-card border-b border-border shadow-sm">
        <div className="container mx-auto px-4 py-8">
          <div className="flex flex-col md:flex-row md:items-end gap-4 justify-between">
            <div>
              <h1 className="font-display font-bold text-3xl md:text-4xl text-foreground tracking-tight">
                Browse Events
              </h1>
              <p className="text-muted-foreground mt-1 text-sm">
                Discover concerts, workshops, conferences, and more
              </p>
            </div>
            {/* Search */}
            <form
              onSubmit={handleSearchSubmit}
              className="flex gap-2 w-full md:w-auto"
            >
              <div className="relative flex-1 md:w-80">
                <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground pointer-events-none" />
                <Input
                  value={searchInput}
                  onChange={(e) => setSearchInput(e.target.value)}
                  placeholder="Search events…"
                  className="pl-9 bg-background border-input"
                  data-ocid="events.search_input"
                />
              </div>
              <Button
                type="submit"
                className="bg-primary text-primary-foreground shrink-0"
                data-ocid="events.search_submit_button"
              >
                Search
              </Button>
            </form>
          </div>
        </div>
      </div>

      <div className="container mx-auto px-4 py-6">
        {/* Category row */}
        <div className="flex gap-2 flex-wrap mb-5">
          {CATEGORIES.map((cat) => (
            <button
              key={cat}
              type="button"
              onClick={() =>
                pushParams({
                  category: cat === "All" ? undefined : cat,
                  page: "1",
                })
              }
              className={`px-4 py-1.5 rounded-full text-sm font-semibold border transition-smooth ${
                urlCategory === cat || (cat === "All" && urlCategory === "All")
                  ? "bg-primary text-primary-foreground border-primary shadow-sm"
                  : "bg-card text-muted-foreground border-border hover:border-primary/40 hover:text-foreground"
              }`}
              data-ocid={`events.category_filter.${cat.toLowerCase()}`}
            >
              {cat}
            </button>
          ))}
        </div>

        {/* Filter row */}
        <div className="flex flex-col sm:flex-row gap-3 mb-6">
          <div className="flex gap-3 flex-wrap flex-1">
            {/* City */}
            <Select
              value={urlCity}
              onValueChange={(v) =>
                pushParams({
                  city: v === "All Cities" ? undefined : v,
                  page: "1",
                })
              }
            >
              <SelectTrigger
                className="w-44 bg-card border-input"
                data-ocid="events.city_select"
              >
                <SelectValue placeholder="All Cities" />
              </SelectTrigger>
              <SelectContent>
                {CITIES.map((c) => (
                  <SelectItem key={c} value={c}>
                    {c}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>

            {/* Sort */}
            <Select
              value={urlSort}
              onValueChange={(v) =>
                pushParams({
                  sort: v === "upcoming" ? undefined : v,
                  page: "1",
                })
              }
            >
              <SelectTrigger
                className="w-48 bg-card border-input"
                data-ocid="events.sort_select"
              >
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                {SORTS.map((s) => (
                  <SelectItem key={s.value} value={s.value}>
                    {s.label}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>

            {/* Price range toggle */}
            <Button
              variant="outline"
              size="default"
              onClick={() => setShowFilters((p) => !p)}
              className={`gap-2 border-input ${showFilters ? "bg-primary/10 border-primary/40 text-primary" : "bg-card text-muted-foreground hover:text-foreground"}`}
              data-ocid="events.price_filter_toggle"
            >
              <SlidersHorizontal className="w-4 h-4" />
              Price Range
            </Button>

            {/* Clear filters */}
            {hasActiveFilters && (
              <Button
                variant="ghost"
                size="default"
                onClick={clearFilters}
                className="gap-1.5 text-muted-foreground hover:text-foreground"
                data-ocid="events.clear_filters_button"
              >
                <X className="w-4 h-4" />
                Clear
              </Button>
            )}
          </div>

          {/* Results count */}
          <div
            className="text-sm text-muted-foreground self-center shrink-0"
            data-ocid="events.results_count"
          >
            Showing{" "}
            <span className="font-semibold text-foreground">
              {paginated.length}
            </span>{" "}
            of{" "}
            <span className="font-semibold text-foreground">
              {filtered.length}
            </span>{" "}
            events
          </div>
        </div>

        {/* Price range panel */}
        {showFilters && (
          <div className="bg-card border border-border rounded-xl p-4 mb-6 flex flex-wrap items-end gap-4 shadow-sm">
            <Filter className="w-4 h-4 text-muted-foreground self-center" />
            <div className="flex flex-col gap-1">
              <label
                htmlFor="min-price"
                className="text-xs font-medium text-muted-foreground"
              >
                Min Price ($)
              </label>
              <Input
                id="min-price"
                type="number"
                min={0}
                value={minPriceInput}
                onChange={(e) => setMinPriceInput(e.target.value)}
                placeholder="0"
                className="w-28 bg-background border-input"
                data-ocid="events.min_price_input"
              />
            </div>
            <div className="flex flex-col gap-1">
              <label
                htmlFor="max-price"
                className="text-xs font-medium text-muted-foreground"
              >
                Max Price ($)
              </label>
              <Input
                id="max-price"
                type="number"
                min={0}
                value={maxPriceInput}
                onChange={(e) => setMaxPriceInput(e.target.value)}
                placeholder="1000"
                className="w-28 bg-background border-input"
                data-ocid="events.max_price_input"
              />
            </div>
            <Button
              onClick={handlePriceApply}
              className="bg-primary text-primary-foreground"
              data-ocid="events.price_apply_button"
            >
              Apply
            </Button>
            {(urlMinPrice || urlMaxPrice) && (
              <Button
                variant="ghost"
                size="sm"
                onClick={() => {
                  setMinPriceInput("");
                  setMaxPriceInput("");
                  pushParams({
                    minPrice: undefined,
                    maxPrice: undefined,
                    page: "1",
                  });
                }}
                className="text-muted-foreground"
                data-ocid="events.price_clear_button"
              >
                <X className="w-4 h-4 mr-1" /> Clear price
              </Button>
            )}
          </div>
        )}

        {/* Events grid */}
        {paginated.length > 0 ? (
          <>
            <div
              className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6"
              data-ocid="events.list"
            >
              {paginated.map((event, i) => (
                <EventCard
                  key={event.id.toString()}
                  event={event}
                  isFavorite={favorites.has(event.id)}
                  onToggleFavorite={toggleFavorite}
                  index={(safePage - 1) * PAGE_SIZE + i}
                />
              ))}
            </div>

            {/* Pagination */}
            {totalPages > 1 && (
              <div
                className="flex items-center justify-center gap-4 mt-10"
                data-ocid="events.pagination"
              >
                <Button
                  variant="outline"
                  onClick={() => pushParams({ page: String(safePage - 1) })}
                  disabled={safePage <= 1}
                  className="gap-2 border-input bg-card"
                  data-ocid="events.pagination_prev"
                >
                  ← Prev
                </Button>
                <span className="text-sm text-muted-foreground">
                  Page{" "}
                  <span className="font-semibold text-foreground">
                    {safePage}
                  </span>{" "}
                  of{" "}
                  <span className="font-semibold text-foreground">
                    {totalPages}
                  </span>
                </span>
                <Button
                  variant="outline"
                  onClick={() => pushParams({ page: String(safePage + 1) })}
                  disabled={safePage >= totalPages}
                  className="gap-2 border-input bg-card"
                  data-ocid="events.pagination_next"
                >
                  Next →
                </Button>
              </div>
            )}
          </>
        ) : (
          <div
            className="flex flex-col items-center justify-center py-24 gap-5 text-center"
            data-ocid="events.empty_state"
          >
            <div className="w-16 h-16 rounded-2xl bg-muted flex items-center justify-center">
              <Search className="w-8 h-8 text-muted-foreground" />
            </div>
            <div>
              <p className="font-display font-bold text-xl text-foreground mb-1">
                No events found
              </p>
              <p className="text-muted-foreground text-sm max-w-xs">
                Try adjusting your search or filters to find what you're looking
                for.
              </p>
            </div>
            <Button
              onClick={clearFilters}
              className="bg-primary text-primary-foreground gap-2"
              data-ocid="events.empty_state_clear_button"
            >
              <X className="w-4 h-4" />
              Clear all filters
            </Button>
          </div>
        )}
      </div>
    </div>
  );
}
