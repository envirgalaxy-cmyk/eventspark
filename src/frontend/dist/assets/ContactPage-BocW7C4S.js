import { c as createLucideIcon, j as jsxRuntimeExports, aj as Mail, r as reactExports, B as Button, I as Input } from "./index-BV_UP3b9.js";
import { L as Label } from "./label-Y5Mqef9e.js";
import { S as Select, a as SelectTrigger, b as SelectValue, c as SelectContent, d as SelectItem, C as ChevronDown } from "./select-VCH4Is1b.js";
import { T as Textarea } from "./textarea-WK_3Szce.js";
import { M as MapPin } from "./map-pin-_Y7De1KV.js";
import { C as Clock } from "./clock-DcPweK9z.js";
import "./Combination-DtENurLZ.js";
/**
 * @license lucide-react v0.511.0 - ISC
 *
 * This source code is licensed under the ISC license.
 * See the LICENSE file in the root directory of this source tree.
 */
const __iconNode$2 = [
  ["circle", { cx: "12", cy: "12", r: "10", key: "1mglay" }],
  ["path", { d: "m9 12 2 2 4-4", key: "dzmm74" }]
];
const CircleCheck = createLucideIcon("circle-check", __iconNode$2);
/**
 * @license lucide-react v0.511.0 - ISC
 *
 * This source code is licensed under the ISC license.
 * See the LICENSE file in the root directory of this source tree.
 */
const __iconNode$1 = [
  [
    "path",
    {
      d: "M13.832 16.568a1 1 0 0 0 1.213-.303l.355-.465A2 2 0 0 1 17 15h3a2 2 0 0 1 2 2v3a2 2 0 0 1-2 2A18 18 0 0 1 2 4a2 2 0 0 1 2-2h3a2 2 0 0 1 2 2v3a2 2 0 0 1-.8 1.6l-.468.351a1 1 0 0 0-.292 1.233 14 14 0 0 0 6.392 6.384",
      key: "9njp5v"
    }
  ]
];
const Phone = createLucideIcon("phone", __iconNode$1);
/**
 * @license lucide-react v0.511.0 - ISC
 *
 * This source code is licensed under the ISC license.
 * See the LICENSE file in the root directory of this source tree.
 */
const __iconNode = [
  [
    "path",
    {
      d: "M14.536 21.686a.5.5 0 0 0 .937-.024l6.5-19a.496.496 0 0 0-.635-.635l-19 6.5a.5.5 0 0 0-.024.937l7.93 3.18a2 2 0 0 1 1.112 1.11z",
      key: "1ffxy3"
    }
  ],
  ["path", { d: "m21.854 2.147-10.94 10.939", key: "12cjpa" }]
];
const Send = createLucideIcon("send", __iconNode);
const SUBJECTS = [
  { value: "general", label: "General Inquiry" },
  { value: "submission", label: "Event Submission" },
  { value: "partnership", label: "Partnership" },
  { value: "support", label: "Support" }
];
const FAQS = [
  {
    q: "How do I book tickets for an event?",
    a: "Browse our Events page, select the event you're interested in, choose your ticket tier, and proceed through checkout. You'll receive a confirmation email with your QR code ticket."
  },
  {
    q: "Can I get a refund or transfer my ticket?",
    a: "Refunds are available up to 48 hours before the event. Ticket transfers to another person can be requested any time before the event starts — contact our support team with your booking reference."
  },
  {
    q: "How do I submit my own event to the platform?",
    a: "Use the 'Event Submission' option in the contact form above. Provide your event name, date, location, and a brief description. Our team reviews submissions within 3–5 business days."
  },
  {
    q: "Are there group or corporate ticket discounts?",
    a: "Yes! Groups of 10 or more qualify for a 15% discount. Corporate packages with custom branding and reserved seating are also available — reach out via the Partnership inquiry."
  },
  {
    q: "What payment methods are accepted?",
    a: "We accept all major credit and debit cards (Visa, Mastercard, Amex), as well as Apple Pay and Google Pay at checkout."
  }
];
const INFO_CARDS = [
  {
    icon: Mail,
    label: "Email Us",
    value: "hello@eventspot.io",
    sub: "We reply within 24 hours",
    color: "text-primary",
    bg: "bg-primary/10"
  },
  {
    icon: Phone,
    label: "Call Us",
    value: "+1 (800) 555-0198",
    sub: "Mon–Fri, 9 AM – 6 PM EST",
    color: "text-secondary",
    bg: "bg-secondary/10"
  },
  {
    icon: MapPin,
    label: "Visit Us",
    value: "250 Event Plaza, Suite 400",
    sub: "New York, NY 10001",
    color: "text-accent",
    bg: "bg-accent/10"
  },
  {
    icon: Clock,
    label: "Office Hours",
    value: "Mon – Fri: 9 AM – 6 PM",
    sub: "Sat: 10 AM – 2 PM (Support only)",
    color: "text-primary",
    bg: "bg-primary/10"
  }
];
function ContactForm() {
  const [form, setForm] = reactExports.useState({
    name: "",
    email: "",
    subject: "",
    message: ""
  });
  const [errors, setErrors] = reactExports.useState({});
  const [submitted, setSubmitted] = reactExports.useState(false);
  function validate() {
    const e = {};
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
  function handleBlur(field) {
    setErrors((prev) => {
      const e = { ...prev };
      if (field === "name") {
        e.name = form.name.trim() ? void 0 : "Name is required.";
      }
      if (field === "email") {
        if (!form.email.trim()) e.email = "Email is required.";
        else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(form.email))
          e.email = "Enter a valid email address.";
        else e.email = void 0;
      }
      if (field === "message") {
        if (!form.message.trim()) e.message = "Message is required.";
        else if (form.message.trim().length < 10)
          e.message = "Message must be at least 10 characters.";
        else e.message = void 0;
      }
      return e;
    });
  }
  function handleSubmit(e) {
    e.preventDefault();
    if (validate()) {
      setSubmitted(true);
    }
  }
  if (submitted) {
    return /* @__PURE__ */ jsxRuntimeExports.jsxs(
      "div",
      {
        "data-ocid": "contact.success_state",
        className: "flex flex-col items-center justify-center gap-4 py-16 text-center",
        children: [
          /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "w-16 h-16 rounded-full bg-primary/15 flex items-center justify-center", children: /* @__PURE__ */ jsxRuntimeExports.jsx(CircleCheck, { className: "w-8 h-8 text-primary" }) }),
          /* @__PURE__ */ jsxRuntimeExports.jsx("h3", { className: "text-xl font-display font-bold text-foreground", children: "Message sent!" }),
          /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: "text-muted-foreground max-w-xs", children: "We'll get back to you soon." }),
          /* @__PURE__ */ jsxRuntimeExports.jsx(
            Button,
            {
              variant: "outline",
              className: "mt-2",
              onClick: () => {
                setForm({ name: "", email: "", subject: "", message: "" });
                setErrors({});
                setSubmitted(false);
              },
              "data-ocid": "contact.send_another_button",
              children: "Send another message"
            }
          )
        ]
      }
    );
  }
  return /* @__PURE__ */ jsxRuntimeExports.jsxs("form", { onSubmit: handleSubmit, noValidate: true, className: "space-y-5", children: [
    /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "space-y-1.5", children: [
      /* @__PURE__ */ jsxRuntimeExports.jsx(Label, { htmlFor: "contact-name", children: "Full Name" }),
      /* @__PURE__ */ jsxRuntimeExports.jsx(
        Input,
        {
          id: "contact-name",
          placeholder: "Jane Smith",
          value: form.name,
          onChange: (e) => setForm({ ...form, name: e.target.value }),
          onBlur: () => handleBlur("name"),
          "data-ocid": "contact.name_input",
          "aria-invalid": !!errors.name,
          "aria-describedby": errors.name ? "contact-name-error" : void 0
        }
      ),
      errors.name && /* @__PURE__ */ jsxRuntimeExports.jsx(
        "p",
        {
          id: "contact-name-error",
          className: "text-xs text-destructive",
          "data-ocid": "contact.name_input.field_error",
          children: errors.name
        }
      )
    ] }),
    /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "space-y-1.5", children: [
      /* @__PURE__ */ jsxRuntimeExports.jsx(Label, { htmlFor: "contact-email", children: "Email Address" }),
      /* @__PURE__ */ jsxRuntimeExports.jsx(
        Input,
        {
          id: "contact-email",
          type: "email",
          placeholder: "jane@example.com",
          value: form.email,
          onChange: (e) => setForm({ ...form, email: e.target.value }),
          onBlur: () => handleBlur("email"),
          "data-ocid": "contact.email_input",
          "aria-invalid": !!errors.email,
          "aria-describedby": errors.email ? "contact-email-error" : void 0
        }
      ),
      errors.email && /* @__PURE__ */ jsxRuntimeExports.jsx(
        "p",
        {
          id: "contact-email-error",
          className: "text-xs text-destructive",
          "data-ocid": "contact.email_input.field_error",
          children: errors.email
        }
      )
    ] }),
    /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "space-y-1.5", children: [
      /* @__PURE__ */ jsxRuntimeExports.jsx(Label, { htmlFor: "contact-subject", children: "Subject" }),
      /* @__PURE__ */ jsxRuntimeExports.jsxs(
        Select,
        {
          value: form.subject,
          onValueChange: (val) => setForm({ ...form, subject: val }),
          children: [
            /* @__PURE__ */ jsxRuntimeExports.jsx(
              SelectTrigger,
              {
                id: "contact-subject",
                "data-ocid": "contact.subject_select",
                "aria-invalid": !!errors.subject,
                children: /* @__PURE__ */ jsxRuntimeExports.jsx(SelectValue, { placeholder: "Select a subject…" })
              }
            ),
            /* @__PURE__ */ jsxRuntimeExports.jsx(SelectContent, { children: SUBJECTS.map((s) => /* @__PURE__ */ jsxRuntimeExports.jsx(SelectItem, { value: s.value, children: s.label }, s.value)) })
          ]
        }
      ),
      errors.subject && /* @__PURE__ */ jsxRuntimeExports.jsx(
        "p",
        {
          className: "text-xs text-destructive",
          "data-ocid": "contact.subject_select.field_error",
          children: errors.subject
        }
      )
    ] }),
    /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "space-y-1.5", children: [
      /* @__PURE__ */ jsxRuntimeExports.jsx(Label, { htmlFor: "contact-message", children: "Message" }),
      /* @__PURE__ */ jsxRuntimeExports.jsx(
        Textarea,
        {
          id: "contact-message",
          placeholder: "Tell us how we can help…",
          rows: 5,
          value: form.message,
          onChange: (e) => setForm({ ...form, message: e.target.value }),
          onBlur: () => handleBlur("message"),
          "data-ocid": "contact.message_textarea",
          "aria-invalid": !!errors.message,
          "aria-describedby": errors.message ? "contact-message-error" : void 0,
          className: "resize-none"
        }
      ),
      errors.message && /* @__PURE__ */ jsxRuntimeExports.jsx(
        "p",
        {
          id: "contact-message-error",
          className: "text-xs text-destructive",
          "data-ocid": "contact.message_textarea.field_error",
          children: errors.message
        }
      )
    ] }),
    /* @__PURE__ */ jsxRuntimeExports.jsxs(
      Button,
      {
        type: "submit",
        size: "lg",
        className: "w-full font-semibold gap-2",
        "data-ocid": "contact.submit_button",
        children: [
          /* @__PURE__ */ jsxRuntimeExports.jsx(Send, { className: "w-4 h-4" }),
          "Send Message"
        ]
      }
    )
  ] });
}
function FaqItem({ q, a, index }) {
  const [open, setOpen] = reactExports.useState(false);
  return /* @__PURE__ */ jsxRuntimeExports.jsxs(
    "div",
    {
      className: "border border-border rounded-xl overflow-hidden",
      "data-ocid": `contact.faq.item.${index + 1}`,
      children: [
        /* @__PURE__ */ jsxRuntimeExports.jsxs(
          "button",
          {
            type: "button",
            className: "w-full flex items-center justify-between gap-4 px-5 py-4 text-left bg-card hover:bg-muted/40 transition-colors duration-200 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring",
            onClick: () => setOpen((o) => !o),
            "aria-expanded": open,
            "data-ocid": `contact.faq.toggle.${index + 1}`,
            children: [
              /* @__PURE__ */ jsxRuntimeExports.jsx("span", { className: "font-display font-semibold text-foreground text-sm sm:text-base", children: q }),
              /* @__PURE__ */ jsxRuntimeExports.jsx(
                ChevronDown,
                {
                  className: `w-5 h-5 text-muted-foreground shrink-0 transition-transform duration-200 ${open ? "rotate-180" : ""}`
                }
              )
            ]
          }
        ),
        open && /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "px-5 py-4 bg-muted/20 border-t border-border text-muted-foreground text-sm leading-relaxed", children: a })
      ]
    }
  );
}
function ContactPage() {
  return /* @__PURE__ */ jsxRuntimeExports.jsxs("main", { "data-ocid": "contact.page", children: [
    /* @__PURE__ */ jsxRuntimeExports.jsxs("section", { className: "relative overflow-hidden bg-card border-b border-border", children: [
      /* @__PURE__ */ jsxRuntimeExports.jsx(
        "div",
        {
          "aria-hidden": "true",
          className: "absolute -top-20 -right-20 w-72 h-72 rounded-full bg-primary/10 blur-3xl pointer-events-none"
        }
      ),
      /* @__PURE__ */ jsxRuntimeExports.jsx(
        "div",
        {
          "aria-hidden": "true",
          className: "absolute -bottom-10 left-10 w-56 h-56 rounded-full bg-secondary/10 blur-3xl pointer-events-none"
        }
      ),
      /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "relative z-10 max-w-4xl mx-auto px-4 py-20 text-center", children: [
        /* @__PURE__ */ jsxRuntimeExports.jsx("span", { className: "inline-block px-4 py-1.5 rounded-full bg-primary/10 text-primary text-xs font-semibold tracking-widest uppercase mb-5", children: "Contact Us" }),
        /* @__PURE__ */ jsxRuntimeExports.jsxs("h1", { className: "font-display text-4xl sm:text-5xl md:text-6xl font-bold text-foreground leading-tight mb-5", children: [
          "Get In",
          " ",
          /* @__PURE__ */ jsxRuntimeExports.jsx("span", { className: "bg-gradient-to-r from-primary via-accent to-secondary bg-clip-text text-transparent", children: "Touch" })
        ] }),
        /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: "text-muted-foreground text-lg sm:text-xl max-w-2xl mx-auto leading-relaxed", children: "Have a question, want to list your event, or just want to say hello? We'd love to hear from you. Our team is here to help." })
      ] })
    ] }),
    /* @__PURE__ */ jsxRuntimeExports.jsx(
      "section",
      {
        className: "bg-background py-14 px-4",
        "data-ocid": "contact.info.section",
        children: /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "max-w-5xl mx-auto grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5", children: INFO_CARDS.map((card) => /* @__PURE__ */ jsxRuntimeExports.jsxs(
          "div",
          {
            className: "bg-card border border-border rounded-2xl p-5 flex flex-col gap-3 hover:shadow-md transition-smooth",
            children: [
              /* @__PURE__ */ jsxRuntimeExports.jsx(
                "div",
                {
                  className: `w-10 h-10 rounded-xl flex items-center justify-center ${card.bg}`,
                  children: /* @__PURE__ */ jsxRuntimeExports.jsx(card.icon, { className: `w-5 h-5 ${card.color}` })
                }
              ),
              /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { children: [
                /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: "text-xs font-semibold uppercase tracking-widest text-muted-foreground mb-1", children: card.label }),
                /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: "font-display font-semibold text-foreground text-sm", children: card.value }),
                /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: "text-xs text-muted-foreground mt-0.5", children: card.sub })
              ] })
            ]
          },
          card.label
        )) })
      }
    ),
    /* @__PURE__ */ jsxRuntimeExports.jsx(
      "section",
      {
        className: "bg-muted/30 py-16 px-4",
        "data-ocid": "contact.form.section",
        children: /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "max-w-5xl mx-auto grid grid-cols-1 lg:grid-cols-5 gap-10", children: [
          /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "lg:col-span-3 bg-card border border-border rounded-2xl p-8 shadow-sm", children: [
            /* @__PURE__ */ jsxRuntimeExports.jsx("h2", { className: "font-display text-2xl font-bold text-foreground mb-1", children: "Send Us a Message" }),
            /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: "text-muted-foreground text-sm mb-7", children: "Fill in the form and we'll get back to you within 24 hours." }),
            /* @__PURE__ */ jsxRuntimeExports.jsx(ContactForm, {})
          ] }),
          /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "lg:col-span-2 flex flex-col gap-5", children: [
            /* @__PURE__ */ jsxRuntimeExports.jsxs(
              "div",
              {
                className: "flex-1 min-h-[240px] rounded-2xl overflow-hidden relative flex flex-col items-center justify-center text-center p-8 gap-4 border border-border",
                "data-ocid": "contact.map_placeholder",
                style: {
                  background: "linear-gradient(135deg, oklch(0.6 0.2 275 / 0.12) 0%, oklch(0.58 0.18 254 / 0.15) 50%, oklch(0.72 0.22 52 / 0.1) 100%)"
                },
                children: [
                  /* @__PURE__ */ jsxRuntimeExports.jsx(
                    "div",
                    {
                      "aria-hidden": "true",
                      className: "absolute inset-0 opacity-[0.07]",
                      style: {
                        backgroundImage: "linear-gradient(oklch(0.6 0.2 275) 1px, transparent 1px), linear-gradient(90deg, oklch(0.6 0.2 275) 1px, transparent 1px)",
                        backgroundSize: "32px 32px"
                      }
                    }
                  ),
                  /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "relative z-10", children: [
                    /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "w-14 h-14 rounded-full bg-primary/20 flex items-center justify-center mx-auto mb-3", children: /* @__PURE__ */ jsxRuntimeExports.jsx(MapPin, { className: "w-7 h-7 text-primary" }) }),
                    /* @__PURE__ */ jsxRuntimeExports.jsx("h3", { className: "font-display font-bold text-foreground text-lg mb-1", children: "Visit Our Office" }),
                    /* @__PURE__ */ jsxRuntimeExports.jsxs("p", { className: "text-muted-foreground text-sm leading-relaxed", children: [
                      "250 Event Plaza, Suite 400",
                      /* @__PURE__ */ jsxRuntimeExports.jsx("br", {}),
                      "New York, NY 10001",
                      /* @__PURE__ */ jsxRuntimeExports.jsx("br", {}),
                      "United States"
                    ] })
                  ] })
                ]
              }
            ),
            /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "bg-card border border-border rounded-2xl p-6", children: [
              /* @__PURE__ */ jsxRuntimeExports.jsx("h3", { className: "font-display font-semibold text-foreground mb-3 text-sm uppercase tracking-wider", children: "Quick Links" }),
              /* @__PURE__ */ jsxRuntimeExports.jsx("ul", { className: "space-y-2.5 text-sm text-muted-foreground", children: [
                "Browse upcoming events",
                "Submit an event",
                "Partnership opportunities",
                "Press & media inquiries"
              ].map((link) => /* @__PURE__ */ jsxRuntimeExports.jsxs(
                "li",
                {
                  className: "flex items-center gap-2.5 group cursor-pointer hover:text-primary transition-colors duration-200",
                  children: [
                    /* @__PURE__ */ jsxRuntimeExports.jsx("span", { className: "w-1.5 h-1.5 rounded-full bg-primary/50 group-hover:bg-primary transition-colors duration-200 shrink-0" }),
                    link
                  ]
                },
                link
              )) })
            ] })
          ] })
        ] })
      }
    ),
    /* @__PURE__ */ jsxRuntimeExports.jsx(
      "section",
      {
        className: "bg-background py-16 px-4",
        "data-ocid": "contact.faq.section",
        children: /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "max-w-3xl mx-auto", children: [
          /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "text-center mb-10", children: [
            /* @__PURE__ */ jsxRuntimeExports.jsx("span", { className: "inline-block px-4 py-1.5 rounded-full bg-secondary/10 text-secondary text-xs font-semibold tracking-widest uppercase mb-4", children: "FAQ" }),
            /* @__PURE__ */ jsxRuntimeExports.jsx("h2", { className: "font-display text-3xl sm:text-4xl font-bold text-foreground", children: "Frequently Asked Questions" }),
            /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: "text-muted-foreground mt-3 text-sm sm:text-base", children: "Can't find your answer here? Send us a message above." })
          ] }),
          /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "space-y-3", "data-ocid": "contact.faq.list", children: FAQS.map((item) => /* @__PURE__ */ jsxRuntimeExports.jsx(
            FaqItem,
            {
              q: item.q,
              a: item.a,
              index: FAQS.indexOf(item)
            },
            item.q
          )) })
        ] })
      }
    ),
    /* @__PURE__ */ jsxRuntimeExports.jsx("section", { className: "bg-card border-t border-border py-12 px-4", children: /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "max-w-xl mx-auto text-center", children: [
      /* @__PURE__ */ jsxRuntimeExports.jsx("h3", { className: "font-display text-xl font-bold text-foreground mb-2", children: "Still have questions?" }),
      /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: "text-muted-foreground text-sm mb-6", children: "Our support team is online Mon – Fri, 9 AM – 6 PM EST." }),
      /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex flex-wrap items-center justify-center gap-3", children: [
        /* @__PURE__ */ jsxRuntimeExports.jsxs(
          "a",
          {
            href: "mailto:hello@eventspot.io",
            className: "inline-flex items-center gap-2 px-5 py-2.5 rounded-xl bg-primary text-primary-foreground font-semibold text-sm hover:opacity-90 transition-smooth focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring",
            "data-ocid": "contact.email_cta_button",
            children: [
              /* @__PURE__ */ jsxRuntimeExports.jsx(Mail, { className: "w-4 h-4" }),
              "hello@eventspot.io"
            ]
          }
        ),
        /* @__PURE__ */ jsxRuntimeExports.jsxs(
          "a",
          {
            href: "tel:+18005550198",
            className: "inline-flex items-center gap-2 px-5 py-2.5 rounded-xl border border-border bg-card text-foreground font-semibold text-sm hover:bg-muted transition-smooth focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring",
            "data-ocid": "contact.phone_cta_button",
            children: [
              /* @__PURE__ */ jsxRuntimeExports.jsx(Phone, { className: "w-4 h-4" }),
              "+1 (800) 555-0198"
            ]
          }
        )
      ] })
    ] }) })
  ] });
}
export {
  ContactPage as default
};
