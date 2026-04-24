import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Textarea } from "@/components/ui/textarea";
import {
  CheckCircle2,
  ChevronDown,
  Clock,
  Mail,
  MapPin,
  Phone,
  Send,
} from "lucide-react";
import { useState } from "react";

// ── Types ──────────────────────────────────────────────────────────────────

interface FormState {
  name: string;
  email: string;
  subject: string;
  message: string;
}

interface FormErrors {
  name?: string;
  email?: string;
  subject?: string;
  message?: string;
}

const SUBJECTS = [
  { value: "general", label: "General Inquiry" },
  { value: "submission", label: "Event Submission" },
  { value: "partnership", label: "Partnership" },
  { value: "support", label: "Support" },
];

const FAQS = [
  {
    q: "How do I book tickets for an event?",
    a: "Browse our Events page, select the event you're interested in, choose your ticket tier, and proceed through checkout. You'll receive a confirmation email with your QR code ticket.",
  },
  {
    q: "Can I get a refund or transfer my ticket?",
    a: "Refunds are available up to 48 hours before the event. Ticket transfers to another person can be requested any time before the event starts — contact our support team with your booking reference.",
  },
  {
    q: "How do I submit my own event to the platform?",
    a: "Use the 'Event Submission' option in the contact form above. Provide your event name, date, location, and a brief description. Our team reviews submissions within 3–5 business days.",
  },
  {
    q: "Are there group or corporate ticket discounts?",
    a: "Yes! Groups of 10 or more qualify for a 15% discount. Corporate packages with custom branding and reserved seating are also available — reach out via the Partnership inquiry.",
  },
  {
    q: "What payment methods are accepted?",
    a: "We accept all major credit and debit cards (Visa, Mastercard, Amex), as well as Apple Pay and Google Pay at checkout.",
  },
];

const INFO_CARDS = [
  {
    icon: Mail,
    label: "Email Us",
    value: "hello@eventspot.io",
    sub: "We reply within 24 hours",
    color: "text-primary",
    bg: "bg-primary/10",
  },
  {
    icon: Phone,
    label: "Call Us",
    value: "+1 (800) 555-0198",
    sub: "Mon–Fri, 9 AM – 6 PM EST",
    color: "text-secondary",
    bg: "bg-secondary/10",
  },
  {
    icon: MapPin,
    label: "Visit Us",
    value: "250 Event Plaza, Suite 400",
    sub: "New York, NY 10001",
    color: "text-accent",
    bg: "bg-accent/10",
  },
  {
    icon: Clock,
    label: "Office Hours",
    value: "Mon – Fri: 9 AM – 6 PM",
    sub: "Sat: 10 AM – 2 PM (Support only)",
    color: "text-primary",
    bg: "bg-primary/10",
  },
];

// ── Contact Form ───────────────────────────────────────────────────────────

function ContactForm() {
  const [form, setForm] = useState<FormState>({
    name: "",
    email: "",
    subject: "",
    message: "",
  });
  const [errors, setErrors] = useState<FormErrors>({});
  const [submitted, setSubmitted] = useState(false);

  function validate(): boolean {
    const e: FormErrors = {};
    if (!form.name.trim()) e.name = "Name is required.";
    if (!form.email.trim()) {
      e.email = "Email is required.";
    } else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(form.email)) {
      e.email = "Enter a valid email address.";
    }
    if (!form.subject) e.subject = "Please select a subject.";
    if (!form.message.trim()) e.message = "Message is required.";
    else if (form.message.trim().length < 10)
      e.message = "Message must be at least 10 characters.";
    setErrors(e);
    return Object.keys(e).length === 0;
  }

  function handleBlur(field: keyof FormState) {
    setErrors((prev) => {
      const e: FormErrors = { ...prev };
      if (field === "name") {
        e.name = form.name.trim() ? undefined : "Name is required.";
      }
      if (field === "email") {
        if (!form.email.trim()) e.email = "Email is required.";
        else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(form.email))
          e.email = "Enter a valid email address.";
        else e.email = undefined;
      }
      if (field === "message") {
        if (!form.message.trim()) e.message = "Message is required.";
        else if (form.message.trim().length < 10)
          e.message = "Message must be at least 10 characters.";
        else e.message = undefined;
      }
      return e;
    });
  }

  function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    if (validate()) {
      setSubmitted(true);
    }
  }

  if (submitted) {
    return (
      <div
        data-ocid="contact.success_state"
        className="flex flex-col items-center justify-center gap-4 py-16 text-center"
      >
        <div className="w-16 h-16 rounded-full bg-primary/15 flex items-center justify-center">
          <CheckCircle2 className="w-8 h-8 text-primary" />
        </div>
        <h3 className="text-xl font-display font-bold text-foreground">
          Message sent!
        </h3>
        <p className="text-muted-foreground max-w-xs">
          We'll get back to you soon.
        </p>
        <Button
          variant="outline"
          className="mt-2"
          onClick={() => {
            setForm({ name: "", email: "", subject: "", message: "" });
            setErrors({});
            setSubmitted(false);
          }}
          data-ocid="contact.send_another_button"
        >
          Send another message
        </Button>
      </div>
    );
  }

  return (
    <form onSubmit={handleSubmit} noValidate className="space-y-5">
      {/* Name */}
      <div className="space-y-1.5">
        <Label htmlFor="contact-name">Full Name</Label>
        <Input
          id="contact-name"
          placeholder="Jane Smith"
          value={form.name}
          onChange={(e) => setForm({ ...form, name: e.target.value })}
          onBlur={() => handleBlur("name")}
          data-ocid="contact.name_input"
          aria-invalid={!!errors.name}
          aria-describedby={errors.name ? "contact-name-error" : undefined}
        />
        {errors.name && (
          <p
            id="contact-name-error"
            className="text-xs text-destructive"
            data-ocid="contact.name_input.field_error"
          >
            {errors.name}
          </p>
        )}
      </div>

      {/* Email */}
      <div className="space-y-1.5">
        <Label htmlFor="contact-email">Email Address</Label>
        <Input
          id="contact-email"
          type="email"
          placeholder="jane@example.com"
          value={form.email}
          onChange={(e) => setForm({ ...form, email: e.target.value })}
          onBlur={() => handleBlur("email")}
          data-ocid="contact.email_input"
          aria-invalid={!!errors.email}
          aria-describedby={errors.email ? "contact-email-error" : undefined}
        />
        {errors.email && (
          <p
            id="contact-email-error"
            className="text-xs text-destructive"
            data-ocid="contact.email_input.field_error"
          >
            {errors.email}
          </p>
        )}
      </div>

      {/* Subject */}
      <div className="space-y-1.5">
        <Label htmlFor="contact-subject">Subject</Label>
        <Select
          value={form.subject}
          onValueChange={(val) => setForm({ ...form, subject: val })}
        >
          <SelectTrigger
            id="contact-subject"
            data-ocid="contact.subject_select"
            aria-invalid={!!errors.subject}
          >
            <SelectValue placeholder="Select a subject…" />
          </SelectTrigger>
          <SelectContent>
            {SUBJECTS.map((s) => (
              <SelectItem key={s.value} value={s.value}>
                {s.label}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
        {errors.subject && (
          <p
            className="text-xs text-destructive"
            data-ocid="contact.subject_select.field_error"
          >
            {errors.subject}
          </p>
        )}
      </div>

      {/* Message */}
      <div className="space-y-1.5">
        <Label htmlFor="contact-message">Message</Label>
        <Textarea
          id="contact-message"
          placeholder="Tell us how we can help…"
          rows={5}
          value={form.message}
          onChange={(e) => setForm({ ...form, message: e.target.value })}
          onBlur={() => handleBlur("message")}
          data-ocid="contact.message_textarea"
          aria-invalid={!!errors.message}
          aria-describedby={
            errors.message ? "contact-message-error" : undefined
          }
          className="resize-none"
        />
        {errors.message && (
          <p
            id="contact-message-error"
            className="text-xs text-destructive"
            data-ocid="contact.message_textarea.field_error"
          >
            {errors.message}
          </p>
        )}
      </div>

      <Button
        type="submit"
        size="lg"
        className="w-full font-semibold gap-2"
        data-ocid="contact.submit_button"
      >
        <Send className="w-4 h-4" />
        Send Message
      </Button>
    </form>
  );
}

// ── FAQ Item ───────────────────────────────────────────────────────────────

function FaqItem({ q, a, index }: { q: string; a: string; index: number }) {
  const [open, setOpen] = useState(false);
  return (
    <div
      className="border border-border rounded-xl overflow-hidden"
      data-ocid={`contact.faq.item.${index + 1}`}
    >
      <button
        type="button"
        className="w-full flex items-center justify-between gap-4 px-5 py-4 text-left bg-card hover:bg-muted/40 transition-colors duration-200 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring"
        onClick={() => setOpen((o) => !o)}
        aria-expanded={open}
        data-ocid={`contact.faq.toggle.${index + 1}`}
      >
        <span className="font-display font-semibold text-foreground text-sm sm:text-base">
          {q}
        </span>
        <ChevronDown
          className={`w-5 h-5 text-muted-foreground shrink-0 transition-transform duration-200 ${
            open ? "rotate-180" : ""
          }`}
        />
      </button>
      {open && (
        <div className="px-5 py-4 bg-muted/20 border-t border-border text-muted-foreground text-sm leading-relaxed">
          {a}
        </div>
      )}
    </div>
  );
}

// ── Main Page ──────────────────────────────────────────────────────────────

export default function ContactPage() {
  return (
    <main data-ocid="contact.page">
      {/* Hero */}
      <section className="relative overflow-hidden bg-card border-b border-border">
        <div
          aria-hidden="true"
          className="absolute -top-20 -right-20 w-72 h-72 rounded-full bg-primary/10 blur-3xl pointer-events-none"
        />
        <div
          aria-hidden="true"
          className="absolute -bottom-10 left-10 w-56 h-56 rounded-full bg-secondary/10 blur-3xl pointer-events-none"
        />
        <div className="relative z-10 max-w-4xl mx-auto px-4 py-20 text-center">
          <span className="inline-block px-4 py-1.5 rounded-full bg-primary/10 text-primary text-xs font-semibold tracking-widest uppercase mb-5">
            Contact Us
          </span>
          <h1 className="font-display text-4xl sm:text-5xl md:text-6xl font-bold text-foreground leading-tight mb-5">
            Get In{" "}
            <span className="bg-gradient-to-r from-primary via-accent to-secondary bg-clip-text text-transparent">
              Touch
            </span>
          </h1>
          <p className="text-muted-foreground text-lg sm:text-xl max-w-2xl mx-auto leading-relaxed">
            Have a question, want to list your event, or just want to say hello?
            We'd love to hear from you. Our team is here to help.
          </p>
        </div>
      </section>

      {/* Info Cards */}
      <section
        className="bg-background py-14 px-4"
        data-ocid="contact.info.section"
      >
        <div className="max-w-5xl mx-auto grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5">
          {INFO_CARDS.map((card) => (
            <div
              key={card.label}
              className="bg-card border border-border rounded-2xl p-5 flex flex-col gap-3 hover:shadow-md transition-smooth"
            >
              <div
                className={`w-10 h-10 rounded-xl flex items-center justify-center ${card.bg}`}
              >
                <card.icon className={`w-5 h-5 ${card.color}`} />
              </div>
              <div>
                <p className="text-xs font-semibold uppercase tracking-widest text-muted-foreground mb-1">
                  {card.label}
                </p>
                <p className="font-display font-semibold text-foreground text-sm">
                  {card.value}
                </p>
                <p className="text-xs text-muted-foreground mt-0.5">
                  {card.sub}
                </p>
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* Form + Map */}
      <section
        className="bg-muted/30 py-16 px-4"
        data-ocid="contact.form.section"
      >
        <div className="max-w-5xl mx-auto grid grid-cols-1 lg:grid-cols-5 gap-10">
          {/* Form card */}
          <div className="lg:col-span-3 bg-card border border-border rounded-2xl p-8 shadow-sm">
            <h2 className="font-display text-2xl font-bold text-foreground mb-1">
              Send Us a Message
            </h2>
            <p className="text-muted-foreground text-sm mb-7">
              Fill in the form and we'll get back to you within 24 hours.
            </p>
            <ContactForm />
          </div>

          {/* Sidebar */}
          <div className="lg:col-span-2 flex flex-col gap-5">
            {/* Map placeholder */}
            <div
              className="flex-1 min-h-[240px] rounded-2xl overflow-hidden relative flex flex-col items-center justify-center text-center p-8 gap-4 border border-border"
              data-ocid="contact.map_placeholder"
              style={{
                background:
                  "linear-gradient(135deg, oklch(0.6 0.2 275 / 0.12) 0%, oklch(0.58 0.18 254 / 0.15) 50%, oklch(0.72 0.22 52 / 0.1) 100%)",
              }}
            >
              <div
                aria-hidden="true"
                className="absolute inset-0 opacity-[0.07]"
                style={{
                  backgroundImage:
                    "linear-gradient(oklch(0.6 0.2 275) 1px, transparent 1px), linear-gradient(90deg, oklch(0.6 0.2 275) 1px, transparent 1px)",
                  backgroundSize: "32px 32px",
                }}
              />
              <div className="relative z-10">
                <div className="w-14 h-14 rounded-full bg-primary/20 flex items-center justify-center mx-auto mb-3">
                  <MapPin className="w-7 h-7 text-primary" />
                </div>
                <h3 className="font-display font-bold text-foreground text-lg mb-1">
                  Visit Our Office
                </h3>
                <p className="text-muted-foreground text-sm leading-relaxed">
                  250 Event Plaza, Suite 400
                  <br />
                  New York, NY 10001
                  <br />
                  United States
                </p>
              </div>
            </div>

            {/* Quick links */}
            <div className="bg-card border border-border rounded-2xl p-6">
              <h3 className="font-display font-semibold text-foreground mb-3 text-sm uppercase tracking-wider">
                Quick Links
              </h3>
              <ul className="space-y-2.5 text-sm text-muted-foreground">
                {[
                  "Browse upcoming events",
                  "Submit an event",
                  "Partnership opportunities",
                  "Press & media inquiries",
                ].map((link) => (
                  <li
                    key={link}
                    className="flex items-center gap-2.5 group cursor-pointer hover:text-primary transition-colors duration-200"
                  >
                    <span className="w-1.5 h-1.5 rounded-full bg-primary/50 group-hover:bg-primary transition-colors duration-200 shrink-0" />
                    {link}
                  </li>
                ))}
              </ul>
            </div>
          </div>
        </div>
      </section>

      {/* FAQ */}
      <section
        className="bg-background py-16 px-4"
        data-ocid="contact.faq.section"
      >
        <div className="max-w-3xl mx-auto">
          <div className="text-center mb-10">
            <span className="inline-block px-4 py-1.5 rounded-full bg-secondary/10 text-secondary text-xs font-semibold tracking-widest uppercase mb-4">
              FAQ
            </span>
            <h2 className="font-display text-3xl sm:text-4xl font-bold text-foreground">
              Frequently Asked Questions
            </h2>
            <p className="text-muted-foreground mt-3 text-sm sm:text-base">
              Can't find your answer here? Send us a message above.
            </p>
          </div>
          <div className="space-y-3" data-ocid="contact.faq.list">
            {FAQS.map((item) => (
              <FaqItem
                key={item.q}
                q={item.q}
                a={item.a}
                index={FAQS.indexOf(item)}
              />
            ))}
          </div>
        </div>
      </section>

      {/* Bottom CTA */}
      <section className="bg-card border-t border-border py-12 px-4">
        <div className="max-w-xl mx-auto text-center">
          <h3 className="font-display text-xl font-bold text-foreground mb-2">
            Still have questions?
          </h3>
          <p className="text-muted-foreground text-sm mb-6">
            Our support team is online Mon – Fri, 9 AM – 6 PM EST.
          </p>
          <div className="flex flex-wrap items-center justify-center gap-3">
            <a
              href="mailto:hello@eventspot.io"
              className="inline-flex items-center gap-2 px-5 py-2.5 rounded-xl bg-primary text-primary-foreground font-semibold text-sm hover:opacity-90 transition-smooth focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring"
              data-ocid="contact.email_cta_button"
            >
              <Mail className="w-4 h-4" />
              hello@eventspot.io
            </a>
            <a
              href="tel:+18005550198"
              className="inline-flex items-center gap-2 px-5 py-2.5 rounded-xl border border-border bg-card text-foreground font-semibold text-sm hover:bg-muted transition-smooth focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring"
              data-ocid="contact.phone_cta_button"
            >
              <Phone className="w-4 h-4" />
              +1 (800) 555-0198
            </a>
          </div>
        </div>
      </section>
    </main>
  );
}
