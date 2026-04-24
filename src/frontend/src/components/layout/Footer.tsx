import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Link } from "@tanstack/react-router";
import { Instagram, Linkedin, Mail, Twitter, Zap } from "lucide-react";

const footerLinks = {
  Discover: [
    { label: "Browse Events", to: "/events" },
    { label: "Concerts & Music", to: "/events" },
    { label: "Workshops", to: "/events" },
    { label: "Conferences", to: "/events" },
  ],
  Company: [
    { label: "About EventSpark", to: "/" },
    { label: "Contact Us", to: "/contact" },
    { label: "Press Kit", to: "/" },
    { label: "Careers", to: "/" },
  ],
  Support: [
    { label: "Help Center", to: "/" },
    { label: "Refund Policy", to: "/" },
    { label: "Privacy Policy", to: "/" },
    { label: "Terms of Service", to: "/" },
  ],
};

export function Footer() {
  const year = new Date().getFullYear();
  const hostname =
    typeof window !== "undefined"
      ? encodeURIComponent(window.location.hostname)
      : "";

  return (
    <footer className="bg-card border-t border-border">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-8 mb-10">
          {/* Brand */}
          <div className="lg:col-span-2">
            <Link to="/" className="flex items-center gap-2 mb-4 w-fit">
              <div className="w-8 h-8 rounded-lg bg-primary flex items-center justify-center">
                <Zap
                  className="w-4 h-4 text-primary-foreground"
                  fill="currentColor"
                />
              </div>
              <span className="font-display font-bold text-xl text-foreground">
                Event<span className="text-primary">Spark</span>
              </span>
            </Link>
            <p className="text-muted-foreground text-sm leading-relaxed mb-5 max-w-xs">
              Discover and book the best live events near you. From concerts to
              workshops — your next unforgettable experience starts here.
            </p>
            {/* Newsletter */}
            <p className="text-sm font-semibold text-foreground mb-2">
              Get event updates
            </p>
            <form className="flex gap-2" onSubmit={(e) => e.preventDefault()}>
              <Input
                type="email"
                placeholder="Your email"
                className="h-9 text-sm"
                data-ocid="footer.newsletter_input"
              />
              <Button
                type="submit"
                size="sm"
                className="bg-primary hover:bg-primary/90 text-primary-foreground shrink-0"
                data-ocid="footer.newsletter_submit"
              >
                <Mail className="w-4 h-4" />
              </Button>
            </form>
          </div>

          {/* Link columns */}
          {Object.entries(footerLinks).map(([heading, links]) => (
            <div key={heading}>
              <h4 className="font-display font-semibold text-sm text-foreground mb-3 uppercase tracking-wide">
                {heading}
              </h4>
              <ul className="space-y-2">
                {links.map((link) => (
                  <li key={link.label}>
                    <Link
                      to={link.to}
                      className="text-sm text-muted-foreground hover:text-primary transition-colors duration-200"
                    >
                      {link.label}
                    </Link>
                  </li>
                ))}
              </ul>
            </div>
          ))}
        </div>

        {/* Bottom bar */}
        <div className="pt-6 border-t border-border flex flex-col sm:flex-row items-center justify-between gap-4">
          <p className="text-xs text-muted-foreground">
            © {year}. Built with love using{" "}
            <a
              href={`https://caffeine.ai?utm_source=caffeine-footer&utm_medium=referral&utm_content=${hostname}`}
              target="_blank"
              rel="noopener noreferrer"
              className="text-primary hover:underline"
            >
              caffeine.ai
            </a>
          </p>
          <div className="flex items-center gap-3">
            {[
              { Icon: Twitter, label: "Twitter" },
              { Icon: Instagram, label: "Instagram" },
              { Icon: Linkedin, label: "LinkedIn" },
            ].map(({ Icon, label }) => (
              <a
                key={label}
                href="https://caffeine.ai"
                aria-label={label}
                className="w-8 h-8 rounded-lg bg-muted flex items-center justify-center text-muted-foreground hover:text-primary hover:bg-primary/10 transition-smooth"
              >
                <Icon className="w-4 h-4" />
              </a>
            ))}
          </div>
        </div>
      </div>
    </footer>
  );
}
