import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";
import { Link, useRouterState } from "@tanstack/react-router";
import { Menu, X, Zap } from "lucide-react";
import { useState } from "react";

const navLinks = [
  { to: "/", label: "Home" },
  { to: "/events", label: "Events" },
  { to: "/contact", label: "Contact" },
];

export function Header() {
  const [menuOpen, setMenuOpen] = useState(false);
  const routerState = useRouterState();
  const currentPath = routerState.location.pathname;

  return (
    <header className="sticky top-0 z-50 bg-card/95 backdrop-blur-md border-b border-border shadow-sm">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16">
          {/* Logo */}
          <Link
            to="/"
            className="flex items-center gap-2 transition-smooth hover:opacity-80"
            data-ocid="header.logo_link"
          >
            <div className="w-8 h-8 rounded-lg bg-primary flex items-center justify-center">
              <Zap
                className="w-4 h-4 text-primary-foreground"
                fill="currentColor"
              />
            </div>
            <span className="font-display font-bold text-xl text-foreground tracking-tight">
              Event<span className="text-primary">Spark</span>
            </span>
          </Link>

          {/* Desktop nav */}
          <nav className="hidden md:flex items-center gap-1">
            {navLinks.map((link) => (
              <Link
                key={link.to}
                to={link.to}
                className={cn(
                  "px-4 py-2 rounded-lg text-sm font-medium transition-smooth",
                  currentPath === link.to
                    ? "text-primary bg-primary/10"
                    : "text-muted-foreground hover:text-foreground hover:bg-muted",
                )}
                data-ocid={`header.nav_${link.label.toLowerCase()}`}
              >
                {link.label}
              </Link>
            ))}
          </nav>

          {/* Desktop CTA */}
          <div className="hidden md:flex items-center gap-3">
            <Button
              asChild
              variant="default"
              size="sm"
              className="bg-secondary hover:bg-secondary/90 text-secondary-foreground font-semibold"
              data-ocid="header.browse_events_button"
            >
              <Link to="/events">Browse Events</Link>
            </Button>
          </div>

          {/* Mobile hamburger */}
          <button
            type="button"
            className="md:hidden p-2 rounded-lg text-muted-foreground hover:text-foreground hover:bg-muted transition-smooth"
            onClick={() => setMenuOpen((v) => !v)}
            aria-label={menuOpen ? "Close menu" : "Open menu"}
            data-ocid="header.mobile_menu_toggle"
          >
            {menuOpen ? (
              <X className="w-5 h-5" />
            ) : (
              <Menu className="w-5 h-5" />
            )}
          </button>
        </div>
      </div>

      {/* Mobile nav */}
      {menuOpen && (
        <div className="md:hidden border-t border-border bg-card px-4 py-3 flex flex-col gap-1">
          {navLinks.map((link) => (
            <Link
              key={link.to}
              to={link.to}
              className={cn(
                "px-4 py-3 rounded-lg text-sm font-medium transition-smooth",
                currentPath === link.to
                  ? "text-primary bg-primary/10"
                  : "text-muted-foreground hover:text-foreground hover:bg-muted",
              )}
              onClick={() => setMenuOpen(false)}
              data-ocid={`header.mobile_nav_${link.label.toLowerCase()}`}
            >
              {link.label}
            </Link>
          ))}
          <div className="pt-2 border-t border-border mt-1">
            <Button
              asChild
              className="w-full bg-secondary hover:bg-secondary/90 text-secondary-foreground font-semibold"
              data-ocid="header.mobile_browse_button"
            >
              <Link to="/events" onClick={() => setMenuOpen(false)}>
                Browse Events
              </Link>
            </Button>
          </div>
        </div>
      )}
    </header>
  );
}
