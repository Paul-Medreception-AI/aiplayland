export type ProblemPage = {
  slug: string;
  label: string;
  lane: "work" | "business" | "school" | "home" | "curiosity";
  headline: string;
  subhead: string;
  description: string;
  whyItHurts: string[];
  whatAIChanges: string[];
  nextStepLabel: string;
};

export const PROBLEM_PAGES: ProblemPage[] = [
  {
    slug: "missed-calls",
    label: "Missed Calls",
    lane: "business",
    headline: "Missed calls aren’t a phone problem.",
    subhead: "They’re a revenue and trust problem.",
    description: "Every missed call is a person who tried to reach you and couldn’t. Most never call back.",
    whyItHurts: [
      "Patients assume you’re unavailable",
      "Front desks can’t answer every call",
      "Voicemails pile up and go unanswered",
    ],
    whatAIChanges: [
      "Every call is answered instantly",
      "Urgent calls are routed correctly",
      "Nothing slips through the cracks",
    ],
    nextStepLabel: "See how calls get handled",
  },
  {
    slug: "inbox-chaos",
    label: "Inbox Chaos",
    lane: "work",
    headline: "Your inbox isn’t communication.",
    subhead: "It’s cognitive overload.",
    description: "Email was never designed to manage modern work. AI can absorb the noise so you don’t have to.",
    whyItHurts: [
      "Constant context switching",
      "Important messages get buried",
      "You never feel caught up",
    ],
    whatAIChanges: [
      "Messages are triaged automatically",
      "Only important items reach you",
      "Focus becomes possible again",
    ],
    nextStepLabel: "Watch inbox friction disappear",
  },
  {
    slug: "after-hours-panic",
    label: "After-Hours Panic",
    lane: "business",
    headline: "Emergencies don’t respect office hours.",
    subhead: "Someone still needs to answer.",
    description: "After-hours calls create anxiety for patients and burnout for staff.",
    whyItHurts: [
      "Staff get interrupted at night",
      "Urgent calls are missed or delayed",
      "Patients feel abandoned",
    ],
    whatAIChanges: [
      "Calls are answered 24/7",
      "Urgency is assessed automatically",
      "Staff are only interrupted when needed",
    ],
    nextStepLabel: "See after-hours handling",
  },
];
