export type AISolution = {
  slug: string;
  name: string;
  summary: string;
  tagline: string;
  type: "owned" | "curated";
  focus: string[];
  stats: { label: string; value: string }[];
  howItHelps: string[];
  steps: string[];
  links: { label: string; href: string }[];
};

export const aiSolutions: AISolution[] = [
  {
    slug: "katie-ai",
    name: "Katie AI",
    summary: "Voice-first call routing for clinics that removes manual phone trees.",
    tagline: "Daytime call router that eliminates phone trees and routes patients by intent.",
    type: "owned",
    focus: ["Voice", "Call Routing", "Clinical"],
    stats: [
      { label: "Hold time", value: "0s" },
      { label: "Routing accuracy", value: "98%" },
    ],
    howItHelps: [
      "Answers every incoming call instantly.",
      "Classifies intent and routes to the right department.",
      "Logs the interaction inside CRM or EMR inbox.",
    ],
    steps: [
      "Map clinic phone lines & coverage rules",
      "Configure specialty routing and provider availability",
      "Integrate with MedReception.ai dashboard for monitoring",
    ],
    links: [{ label: "Visit MedReception.ai", href: "https://www.medreception.ai" }],
  },
  {
    slug: "sallie-ai",
    name: "Sallie AI",
    summary: "Outbound scheduler that fills calendars when inbound slows down.",
    tagline: "Outbound call/text agent that reactivates leads and books visits.",
    type: "owned",
    focus: ["Voice", "SMS", "Outbound"],
    stats: [
      { label: "Reactivation rate", value: "3.2x" },
      { label: "Booking speed", value: "< 2 min" },
    ],
    howItHelps: [
      "Calls and texts missed leads until they book or opt out.",
      "Syncs open slots and offers the next-best time automatically.",
      "Hands warm transfers back to front desk when needed.",
    ],
    steps: [
      "Import last 30–60 days of missed leads",
      "Connect calendar and routing rules",
      "Tune outreach cadence by segment",
    ],
    links: [{ label: "Visit MedReception.ai", href: "https://www.medreception.ai/sallie-ai" }],
  },
  {
    slug: "annie-ai",
    name: "Annie AI",
    summary: "Night and weekend answering service that keeps clinicians safe.",
    tagline: "After-hours coverage that never misses a call.",
    type: "owned",
    focus: ["Voice", "After-hours", "Safety"],
    stats: [
      { label: "Coverage", value: "24/7" },
      { label: "Callback target", value: "< 15 min" },
    ],
    howItHelps: [
      "Provides guarded scripts and escalation paths.",
      "Notifies on-call providers the moment an urgent issue arises.",
      "Documents every call for compliance and QA.",
    ],
    steps: [
      "Define after-hours windows & provider rotations",
      "Train Annie on escalation ladders",
      "Monitor quality through MedReception.ai QA console",
    ],
    links: [{ label: "Visit MedReception.ai", href: "https://www.medreception.ai/after-hours" }],
  },
];
