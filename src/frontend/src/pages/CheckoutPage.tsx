import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Separator } from "@/components/ui/separator";
import { sampleEvents, sampleTicketTiers } from "@/data/sampleEvents";
import { cn } from "@/lib/utils";
import type { TicketTier } from "@/types";
import { useParams } from "@tanstack/react-router";
import {
  CalendarDays,
  Check,
  ChevronRight,
  CreditCard,
  Download,
  Lock,
  MapPin,
  Minus,
  Plus,
  ShieldCheck,
  Ticket,
  X,
} from "lucide-react";
import { AnimatePresence, motion } from "motion/react";
import { useCallback, useState } from "react";

// ─── helpers ────────────────────────────────────────────────────────────────

function formatDate(ns: bigint) {
  return new Date(Number(ns / BigInt(1_000_000))).toLocaleDateString("en-US", {
    weekday: "long",
    year: "numeric",
    month: "long",
    day: "numeric",
  });
}

function genConfirmationCode() {
  const chars = "ABCDEFGHJKLMNPQRSTUVWXYZ23456789";
  return Array.from(
    { length: 8 },
    () => chars[Math.floor(Math.random() * chars.length)],
  ).join("");
}

function fallbackTiers(eventId: string): TicketTier[] {
  const numId = Number.parseInt(eventId, 10);
  return [
    {
      id: BigInt(100),
      eventId: BigInt(numId),
      name: "Early Bird",
      price: 49,
      benefits: ["General access", "Event app", "Digital programme"],
      available: BigInt(80),
      total: BigInt(200),
    },
    {
      id: BigInt(101),
      eventId: BigInt(numId),
      name: "Standard",
      price: 89,
      benefits: [
        "Priority entry",
        "Welcome drink",
        "Printed programme",
        "Event tote bag",
      ],
      available: BigInt(120),
      total: BigInt(400),
    },
    {
      id: BigInt(102),
      eventId: BigInt(numId),
      name: "VIP",
      price: 199,
      benefits: [
        "Fast-track entry",
        "VIP lounge",
        "Meet & greet",
        "Exclusive merch",
        "Free bar",
      ],
      available: BigInt(20),
      total: BigInt(60),
    },
  ];
}

interface FormData {
  fullName: string;
  email: string;
  phone: string;
  address: string;
  postalCode: string;
}

interface FormErrors {
  fullName?: string;
  email?: string;
  phone?: string;
  address?: string;
  postalCode?: string;
}

function validateField(
  name: keyof FormData,
  value: string,
): string | undefined {
  if (!value.trim()) return "This field is required";
  if (name === "email" && !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(value))
    return "Enter a valid email address";
  if (name === "phone" && !/^\+?[\d\s\-().]{7,}$/.test(value))
    return "Enter a valid phone number";
  if (name === "postalCode" && value.trim().length < 3)
    return "Enter a valid postal code";
  return undefined;
}

// ─── Order Summary ───────────────────────────────────────────────────────────

interface OrderSummaryProps {
  tier: TicketTier | null;
  quantity: number;
  eventTitle: string;
}

function OrderSummary({ tier, quantity, eventTitle }: OrderSummaryProps) {
  const subtotal = tier ? tier.price * quantity : 0;
  const tax = Number.parseFloat((subtotal * 0.1).toFixed(2));
  const total = subtotal + tax;

  return (
    <div className="bg-card border border-border rounded-2xl p-6 sticky top-24 shadow-md">
      <h3 className="font-display font-bold text-foreground text-lg mb-4">
        Order Summary
      </h3>

      {tier ? (
        <motion.div
          key={tier.id.toString()}
          initial={{ opacity: 0, y: 6 }}
          animate={{ opacity: 1, y: 0 }}
          className="space-y-3"
        >
          <div className="bg-primary/5 border border-primary/20 rounded-xl p-3">
            <p className="font-semibold text-foreground text-sm">{tier.name}</p>
            <p className="text-muted-foreground text-xs mt-0.5">{eventTitle}</p>
          </div>

          <div className="space-y-2 text-sm">
            <div className="flex justify-between text-muted-foreground">
              <span>
                ${tier.price.toFixed(2)} × {quantity}
              </span>
              <span className="text-foreground font-medium">
                ${subtotal.toFixed(2)}
              </span>
            </div>
            <div className="flex justify-between text-muted-foreground">
              <span>Taxes (10%)</span>
              <span className="text-foreground font-medium">
                ${tax.toFixed(2)}
              </span>
            </div>
          </div>

          <Separator />

          <div className="flex justify-between items-center">
            <span className="font-bold text-foreground">Total</span>
            <span className="font-display font-bold text-xl text-primary">
              ${total.toFixed(2)}
            </span>
          </div>
        </motion.div>
      ) : (
        <p className="text-muted-foreground text-sm">
          Select a ticket tier to see pricing.
        </p>
      )}

      <div className="mt-5 flex items-center gap-2 text-xs text-muted-foreground">
        <ShieldCheck className="w-4 h-4 text-green-500 shrink-0" />
        <span>Secure checkout · 256-bit SSL encryption</span>
      </div>
    </div>
  );
}

// ─── Ticket Tier Card ────────────────────────────────────────────────────────

interface TierCardProps {
  tier: TicketTier;
  selected: boolean;
  quantity: number;
  onSelect: () => void;
  onQuantityChange: (qty: number) => void;
}

function TierCard({
  tier,
  selected,
  quantity,
  onSelect,
  onQuantityChange,
}: TierCardProps) {
  const available = Number(tier.available);
  const isSoldOut = available === 0;
  const isLow = available > 0 && available <= 20;

  return (
    <motion.div
      layout
      onClick={() => !isSoldOut && onSelect()}
      data-ocid={`checkout.tier_card.${tier.name.toLowerCase().replace(/\s+/g, "_")}`}
      className={[
        "relative rounded-2xl border-2 p-5 cursor-pointer transition-smooth",
        isSoldOut
          ? "border-border opacity-50 cursor-not-allowed"
          : selected
            ? "border-primary bg-primary/5 shadow-lg"
            : "border-border bg-card hover:border-primary/50 hover:shadow-md",
      ].join(" ")}
    >
      {selected && (
        <span className="absolute top-3 right-3 w-6 h-6 bg-primary rounded-full flex items-center justify-center">
          <Check className="w-3.5 h-3.5 text-primary-foreground" />
        </span>
      )}

      <div className="flex items-start justify-between gap-4 mb-3">
        <div>
          <h4 className="font-display font-bold text-foreground">
            {tier.name}
          </h4>
          {isLow && !isSoldOut && (
            <Badge variant="destructive" className="mt-1 text-xs">
              Only {available} left
            </Badge>
          )}
          {isSoldOut && (
            <Badge
              variant="outline"
              className="mt-1 text-xs text-muted-foreground"
            >
              Sold Out
            </Badge>
          )}
        </div>
        <div className="text-right shrink-0">
          <p className="font-display font-bold text-2xl text-primary">
            ${tier.price}
          </p>
          <p className="text-xs text-muted-foreground">per ticket</p>
        </div>
      </div>

      <ul className="space-y-1 mb-4">
        {tier.benefits.map((b) => (
          <li
            key={b}
            className="flex items-center gap-2 text-sm text-muted-foreground"
          >
            <Check className="w-3.5 h-3.5 text-primary shrink-0" />
            {b}
          </li>
        ))}
      </ul>

      {selected && !isSoldOut && (
        <motion.div
          initial={{ opacity: 0, height: 0 }}
          animate={{ opacity: 1, height: "auto" }}
          className="flex items-center gap-3 pt-3 border-t border-primary/20"
          onClick={(e) => e.stopPropagation()}
        >
          <span className="text-sm font-medium text-foreground">Quantity</span>
          <div className="flex items-center gap-2 ml-auto">
            <button
              type="button"
              data-ocid="checkout.quantity_minus"
              onClick={() => onQuantityChange(Math.max(1, quantity - 1))}
              className="w-8 h-8 rounded-full border border-border flex items-center justify-center hover:bg-muted transition-colors"
            >
              <Minus className="w-3.5 h-3.5" />
            </button>
            <span className="w-8 text-center font-bold text-foreground">
              {quantity}
            </span>
            <button
              type="button"
              data-ocid="checkout.quantity_plus"
              onClick={() => onQuantityChange(Math.min(10, quantity + 1))}
              className="w-8 h-8 rounded-full border border-border flex items-center justify-center hover:bg-muted transition-colors"
            >
              <Plus className="w-3.5 h-3.5" />
            </button>
          </div>
        </motion.div>
      )}
    </motion.div>
  );
}

// ─── Confirmation Modal ──────────────────────────────────────────────────────

interface ConfirmationModalProps {
  open: boolean;
  onClose: () => void;
  confirmationCode: string;
  eventTitle: string;
  eventDate: string;
  eventLocation: string;
  tierName: string;
  quantity: number;
  total: number;
}

function ConfirmationModal({
  open,
  onClose,
  confirmationCode,
  eventTitle,
  eventDate,
  eventLocation,
  tierName,
  quantity,
  total,
}: ConfirmationModalProps) {
  // Generate QR code via Google Charts API (no library needed, no camera scan)
  const qrUrl = `https://chart.googleapis.com/chart?cht=qr&chs=200x200&chl=${encodeURIComponent(confirmationCode)}&choe=UTF-8`;

  return (
    <Dialog open={open} onOpenChange={onClose}>
      <DialogContent
        data-ocid="checkout.confirmation.dialog"
        className="max-w-md sm:max-w-lg w-full rounded-2xl p-0 overflow-hidden"
      >
        {/* Header band */}
        <div className="bg-primary px-6 py-5 text-primary-foreground">
          <div className="flex items-center gap-3 mb-1">
            <div className="w-8 h-8 rounded-full bg-white/20 flex items-center justify-center">
              <Check className="w-4 h-4" />
            </div>
            <DialogTitle className="font-display font-bold text-xl text-primary-foreground">
              Booking Confirmed!
            </DialogTitle>
          </div>
          <p className="text-primary-foreground/80 text-sm ml-11">
            Your tickets are reserved. See you there!
          </p>
        </div>

        <div className="p-6 space-y-5">
          {/* Confirmation code */}
          <div className="bg-muted/50 rounded-xl p-4 text-center">
            <p className="text-xs text-muted-foreground uppercase tracking-widest mb-1">
              Confirmation Code
            </p>
            <p
              data-ocid="checkout.confirmation.code"
              className="font-mono font-bold text-2xl tracking-[0.15em] text-foreground"
            >
              {confirmationCode}
            </p>
          </div>

          {/* QR Code */}
          <div className="flex justify-center">
            <div className="border-4 border-border rounded-xl overflow-hidden p-2 bg-white">
              <img
                src={qrUrl}
                alt={`QR code for booking ${confirmationCode}`}
                width={160}
                height={160}
                className="block"
              />
            </div>
          </div>

          {/* Event details */}
          <div className="space-y-2 text-sm">
            <div className="flex items-start gap-2">
              <Ticket className="w-4 h-4 text-primary mt-0.5 shrink-0" />
              <div>
                <p className="font-semibold text-foreground">{eventTitle}</p>
                <p className="text-muted-foreground">
                  {tierName} × {quantity}
                </p>
              </div>
            </div>
            <div className="flex items-center gap-2">
              <CalendarDays className="w-4 h-4 text-primary shrink-0" />
              <span className="text-muted-foreground">{eventDate}</span>
            </div>
            <div className="flex items-center gap-2">
              <MapPin className="w-4 h-4 text-primary shrink-0" />
              <span className="text-muted-foreground">{eventLocation}</span>
            </div>
          </div>

          <Separator />

          <div className="flex justify-between items-center">
            <span className="font-medium text-foreground">Total Paid</span>
            <span className="font-display font-bold text-lg text-primary">
              ${total.toFixed(2)}
            </span>
          </div>
        </div>

        <DialogFooter className="px-6 pb-6 pt-0 flex-row gap-3">
          <Button
            variant="outline"
            data-ocid="checkout.confirmation.download_button"
            className="flex-1 gap-2"
          >
            <Download className="w-4 h-4" />
            Download Ticket
          </Button>
          <Button
            data-ocid="checkout.confirmation.close_button"
            onClick={onClose}
            className="flex-1"
          >
            Done
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}

// ─── Main Page ───────────────────────────────────────────────────────────────

export default function CheckoutPage() {
  const { eventId } = useParams({ from: "/checkout/$eventId" });

  const event =
    sampleEvents.find((e) => e.id.toString() === eventId) ?? sampleEvents[0];
  const rawTiers = sampleTicketTiers[eventId] ?? fallbackTiers(eventId);
  const tiers = rawTiers.slice(0, 3); // max 3 tiers shown

  // Step: "tickets" | "attendee" | "payment"
  const [step, setStep] = useState<"tickets" | "attendee" | "payment">(
    "tickets",
  );

  // Ticket selection
  const [selectedTierId, setSelectedTierId] = useState<bigint | null>(
    tiers[0]?.id ?? null,
  );
  const [quantity, setQuantity] = useState(1);
  const selectedTier = tiers.find((t) => t.id === selectedTierId) ?? null;

  // Attendee form
  const [form, setForm] = useState<FormData>({
    fullName: "",
    email: "",
    phone: "",
    address: "",
    postalCode: "",
  });
  const [errors, setErrors] = useState<FormErrors>({});
  const [touched, setTouched] = useState<
    Partial<Record<keyof FormData, boolean>>
  >({});

  // Confirmation
  const [confirmationCode, setConfirmationCode] = useState("");
  const [showConfirmation, setShowConfirmation] = useState(false);

  // Order totals
  const subtotal = selectedTier ? selectedTier.price * quantity : 0;
  const tax = Number.parseFloat((subtotal * 0.1).toFixed(2));
  const total = subtotal + tax;

  const handleBlur = useCallback(
    (name: keyof FormData) => {
      setTouched((p) => ({ ...p, [name]: true }));
      const err = validateField(name, form[name]);
      setErrors((p) => ({ ...p, [name]: err }));
    },
    [form],
  );

  const handleChange = useCallback(
    (name: keyof FormData, value: string) => {
      setForm((p) => ({ ...p, [name]: value }));
      if (touched[name]) {
        const err = validateField(name, value);
        setErrors((p) => ({ ...p, [name]: err }));
      }
    },
    [touched],
  );

  const validateAll = useCallback(() => {
    const allTouched: Partial<Record<keyof FormData, boolean>> = {
      fullName: true,
      email: true,
      phone: true,
      address: true,
      postalCode: true,
    };
    setTouched(allTouched);
    const newErrors: FormErrors = {};
    for (const k of Object.keys(form) as (keyof FormData)[]) {
      const err = validateField(k, form[k]);
      if (err) newErrors[k] = err;
    }
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  }, [form]);

  const handlePayNow = () => {
    if (step === "tickets") {
      setStep("attendee");
      return;
    }
    if (step === "attendee") {
      if (!validateAll()) return;
      setStep("payment");
      return;
    }
    // Step: payment — show confirmation
    const code = genConfirmationCode();
    setConfirmationCode(code);
    setShowConfirmation(true);
  };

  const stepIndex = step === "tickets" ? 0 : step === "attendee" ? 1 : 2;
  const steps = ["Tickets", "Attendee", "Payment"] as const;

  return (
    <div className="bg-background min-h-screen">
      {/* Top bar */}
      <div className="bg-card border-b border-border">
        <div className="container mx-auto px-4 py-4 flex items-center justify-between">
          <div className="flex items-center gap-2 text-sm text-muted-foreground">
            <Ticket className="w-4 h-4" />
            <span className="font-medium text-foreground">{event.title}</span>
          </div>

          {/* Step progress */}
          <div className="flex items-center gap-1">
            {steps.map((s, i) => (
              <div key={s} className="flex items-center gap-1">
                <div
                  className={[
                    "w-6 h-6 rounded-full flex items-center justify-center text-xs font-bold transition-smooth",
                    i < stepIndex
                      ? "bg-primary text-primary-foreground"
                      : i === stepIndex
                        ? "bg-primary text-primary-foreground ring-4 ring-primary/20"
                        : "bg-muted text-muted-foreground",
                  ].join(" ")}
                >
                  {i < stepIndex ? <Check className="w-3 h-3" /> : i + 1}
                </div>
                <span
                  className={`hidden sm:inline text-xs font-medium ${
                    i === stepIndex
                      ? "text-foreground"
                      : "text-muted-foreground"
                  }`}
                >
                  {s}
                </span>
                {i < steps.length - 1 && (
                  <ChevronRight className="w-3 h-3 text-muted-foreground mx-1" />
                )}
              </div>
            ))}
          </div>
        </div>
      </div>

      <div className="container mx-auto px-4 py-8">
        {/* Event summary */}
        <div className="flex items-center gap-4 mb-8 p-4 bg-card border border-border rounded-2xl">
          <img
            src={event.imageUrl}
            alt={event.title}
            className="w-20 h-14 object-cover rounded-xl shrink-0"
          />
          <div className="min-w-0">
            <h1 className="font-display font-bold text-xl text-foreground truncate">
              {event.title}
            </h1>
            <div className="flex flex-wrap items-center gap-x-4 gap-y-1 mt-1 text-sm text-muted-foreground">
              <span className="flex items-center gap-1">
                <CalendarDays className="w-3.5 h-3.5" />
                {formatDate(event.date)}
              </span>
              <span className="flex items-center gap-1">
                <MapPin className="w-3.5 h-3.5" />
                {event.venue}, {event.city}
              </span>
            </div>
          </div>
        </div>

        {/* Two-column layout */}
        <div className="grid grid-cols-1 lg:grid-cols-[1fr_360px] gap-8 items-start">
          {/* Left: form area */}
          <div>
            <AnimatePresence mode="wait">
              {/* ── STEP 1: Ticket Selection ── */}
              {step === "tickets" && (
                <motion.div
                  key="tickets"
                  initial={{ opacity: 0, x: -20 }}
                  animate={{ opacity: 1, x: 0 }}
                  exit={{ opacity: 0, x: 20 }}
                >
                  <h2 className="font-display font-bold text-2xl text-foreground mb-5">
                    Select Your Ticket
                  </h2>
                  <div className="space-y-4">
                    {tiers.map((tier) => (
                      <TierCard
                        key={tier.id.toString()}
                        tier={tier}
                        selected={selectedTierId === tier.id}
                        quantity={quantity}
                        onSelect={() => {
                          setSelectedTierId(tier.id);
                          setQuantity(1);
                        }}
                        onQuantityChange={setQuantity}
                      />
                    ))}
                  </div>
                </motion.div>
              )}

              {/* ── STEP 2: Attendee Form ── */}
              {step === "attendee" && (
                <motion.div
                  key="attendee"
                  initial={{ opacity: 0, x: -20 }}
                  animate={{ opacity: 1, x: 0 }}
                  exit={{ opacity: 0, x: 20 }}
                >
                  <h2 className="font-display font-bold text-2xl text-foreground mb-5">
                    Attendee Details
                  </h2>
                  <div className="bg-card border border-border rounded-2xl p-6 space-y-5">
                    {/* Full Name */}
                    <div className="space-y-1.5">
                      <Label htmlFor="fullName">Full Name *</Label>
                      <Input
                        id="fullName"
                        data-ocid="checkout.attendee.full_name.input"
                        placeholder="Jane Smith"
                        value={form.fullName}
                        onChange={(e) =>
                          handleChange("fullName", e.target.value)
                        }
                        onBlur={() => handleBlur("fullName")}
                        className={errors.fullName ? "border-destructive" : ""}
                      />
                      {errors.fullName && touched.fullName && (
                        <p
                          data-ocid="checkout.attendee.full_name.field_error"
                          className="text-destructive text-xs"
                        >
                          {errors.fullName}
                        </p>
                      )}
                    </div>

                    {/* Email */}
                    <div className="space-y-1.5">
                      <Label htmlFor="email">Email Address *</Label>
                      <Input
                        id="email"
                        type="email"
                        data-ocid="checkout.attendee.email.input"
                        placeholder="jane@example.com"
                        value={form.email}
                        onChange={(e) => handleChange("email", e.target.value)}
                        onBlur={() => handleBlur("email")}
                        className={errors.email ? "border-destructive" : ""}
                      />
                      {errors.email && touched.email && (
                        <p
                          data-ocid="checkout.attendee.email.field_error"
                          className="text-destructive text-xs"
                        >
                          {errors.email}
                        </p>
                      )}
                    </div>

                    {/* Phone */}
                    <div className="space-y-1.5">
                      <Label htmlFor="phone">Phone Number *</Label>
                      <Input
                        id="phone"
                        type="tel"
                        data-ocid="checkout.attendee.phone.input"
                        placeholder="+1 (555) 000-0000"
                        value={form.phone}
                        onChange={(e) => handleChange("phone", e.target.value)}
                        onBlur={() => handleBlur("phone")}
                        className={errors.phone ? "border-destructive" : ""}
                      />
                      {errors.phone && touched.phone && (
                        <p
                          data-ocid="checkout.attendee.phone.field_error"
                          className="text-destructive text-xs"
                        >
                          {errors.phone}
                        </p>
                      )}
                    </div>

                    {/* Address */}
                    <div className="space-y-1.5">
                      <Label htmlFor="address">Address *</Label>
                      <Input
                        id="address"
                        data-ocid="checkout.attendee.address.input"
                        placeholder="123 Main St, Suite 4"
                        value={form.address}
                        onChange={(e) =>
                          handleChange("address", e.target.value)
                        }
                        onBlur={() => handleBlur("address")}
                        className={errors.address ? "border-destructive" : ""}
                      />
                      {errors.address && touched.address && (
                        <p
                          data-ocid="checkout.attendee.address.field_error"
                          className="text-destructive text-xs"
                        >
                          {errors.address}
                        </p>
                      )}
                    </div>

                    {/* Postal Code */}
                    <div className="space-y-1.5">
                      <Label htmlFor="postalCode">Postal Code *</Label>
                      <Input
                        id="postalCode"
                        data-ocid="checkout.attendee.postal_code.input"
                        placeholder="90210"
                        value={form.postalCode}
                        onChange={(e) =>
                          handleChange("postalCode", e.target.value)
                        }
                        onBlur={() => handleBlur("postalCode")}
                        className={
                          errors.postalCode ? "border-destructive" : ""
                        }
                      />
                      {errors.postalCode && touched.postalCode && (
                        <p
                          data-ocid="checkout.attendee.postal_code.field_error"
                          className="text-destructive text-xs"
                        >
                          {errors.postalCode}
                        </p>
                      )}
                    </div>
                  </div>
                </motion.div>
              )}

              {/* ── STEP 3: Payment ── */}
              {step === "payment" && (
                <motion.div
                  key="payment"
                  initial={{ opacity: 0, x: -20 }}
                  animate={{ opacity: 1, x: 0 }}
                  exit={{ opacity: 0, x: 20 }}
                >
                  <h2 className="font-display font-bold text-2xl text-foreground mb-5">
                    Payment
                  </h2>
                  <div className="bg-card border border-border rounded-2xl p-6 space-y-5">
                    {/* Demo notice */}
                    <div className="flex items-center gap-3 bg-secondary/10 border border-secondary/30 rounded-xl p-3">
                      <ShieldCheck className="w-5 h-5 text-secondary shrink-0" />
                      <p className="text-sm text-muted-foreground">
                        <span className="font-semibold text-foreground">
                          Demo — no real payment processed.
                        </span>{" "}
                        This is a simulation only.
                      </p>
                    </div>

                    {/* Card number (read-only) */}
                    <div className="space-y-1.5">
                      <Label htmlFor="cardNumber">Card Number</Label>
                      <div className="relative">
                        <CreditCard className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
                        <Input
                          id="cardNumber"
                          data-ocid="checkout.payment.card_number.input"
                          value="4111 1111 1111 1111"
                          readOnly
                          className="pl-9 font-mono bg-muted/40 text-muted-foreground cursor-default"
                        />
                      </div>
                    </div>

                    <div className="grid grid-cols-2 gap-4">
                      {/* Expiry */}
                      <div className="space-y-1.5">
                        <Label htmlFor="expiry">Expiry</Label>
                        <Input
                          id="expiry"
                          data-ocid="checkout.payment.expiry.input"
                          placeholder="MM/YY"
                          maxLength={5}
                          className="font-mono"
                        />
                      </div>

                      {/* CVV */}
                      <div className="space-y-1.5">
                        <Label
                          htmlFor="cvv"
                          className="flex items-center gap-1.5"
                        >
                          CVV
                          <Lock className="w-3 h-3 text-muted-foreground" />
                        </Label>
                        <Input
                          id="cvv"
                          data-ocid="checkout.payment.cvv.input"
                          value="***"
                          readOnly
                          className="font-mono bg-muted/40 text-muted-foreground cursor-default"
                          maxLength={4}
                        />
                      </div>
                    </div>

                    <div className="flex items-center gap-2 text-xs text-muted-foreground pt-1">
                      <Lock className="w-3.5 h-3.5 shrink-0" />
                      <span>
                        Your payment details are encrypted and secure.
                      </span>
                    </div>
                  </div>
                </motion.div>
              )}
            </AnimatePresence>

            {/* Navigation buttons */}
            <div className="flex items-center gap-3 mt-6">
              {step !== "tickets" && (
                <Button
                  variant="outline"
                  data-ocid="checkout.back_button"
                  onClick={() =>
                    setStep(step === "payment" ? "attendee" : "tickets")
                  }
                  className="gap-2"
                >
                  <X className="w-4 h-4" />
                  Back
                </Button>
              )}

              <Button
                data-ocid="checkout.pay_now_button"
                disabled={!selectedTier}
                onClick={handlePayNow}
                className={cn(
                  "flex-1 gap-2 font-display font-bold text-base py-5",
                  step === "payment"
                    ? "bg-secondary text-secondary-foreground hover:bg-secondary/90"
                    : "",
                )}
              >
                {step === "tickets" && (
                  <>
                    Continue to Attendee Details
                    <ChevronRight className="w-4 h-4" />
                  </>
                )}
                {step === "attendee" && (
                  <>
                    Continue to Payment
                    <ChevronRight className="w-4 h-4" />
                  </>
                )}
                {step === "payment" && (
                  <>
                    <Lock className="w-4 h-4" />
                    Pay ${total.toFixed(2)} Now
                  </>
                )}
              </Button>
            </div>
          </div>

          {/* Right: order summary */}
          <OrderSummary
            tier={selectedTier}
            quantity={quantity}
            eventTitle={event.title}
          />
        </div>
      </div>

      {/* Confirmation Modal */}
      <ConfirmationModal
        open={showConfirmation}
        onClose={() => setShowConfirmation(false)}
        confirmationCode={confirmationCode}
        eventTitle={event.title}
        eventDate={formatDate(event.date)}
        eventLocation={`${event.venue}, ${event.city}`}
        tierName={selectedTier?.name ?? ""}
        quantity={quantity}
        total={total}
      />
    </div>
  );
}
