export type ProblemArchetype = "dissolution" | "reframe" | "containment";

export type Problem = {
  slug: string;
  label: string;
  lane: "work" | "business" | "school" | "home" | "curiosity";
  archetype: ProblemArchetype;
  medicalSignal: number;
  medreceptionEligible: "yes" | "no";
};

export const PROBLEM_REGISTRY: Problem[] = [
  { slug: "missed-calls", label: "Missed Calls", lane: "business", archetype: "dissolution", medicalSignal: 1.0, medreceptionEligible: "yes" },
  { slug: "voicemail", label: "Voicemail Backlog", lane: "business", archetype: "dissolution", medicalSignal: 0.95, medreceptionEligible: "yes" },
  { slug: "voicemail-backlog", label: "Voicemail Backlog", lane: "business", archetype: "dissolution", medicalSignal: 0.95, medreceptionEligible: "yes" },
  { slug: "overbooking", label: "Overbooking", lane: "business", archetype: "dissolution", medicalSignal: 0.7, medreceptionEligible: "yes" },
  { slug: "scheduling-chaos", label: "Scheduling Chaos", lane: "business", archetype: "dissolution", medicalSignal: 0.85, medreceptionEligible: "yes" },
  { slug: "manual-followups", label: "Manual Follow-Ups", lane: "business", archetype: "dissolution", medicalSignal: 0.65, medreceptionEligible: "yes" },
  { slug: "lost-leads", label: "Lost Leads", lane: "business", archetype: "dissolution", medicalSignal: 0.6, medreceptionEligible: "yes" },
  { slug: "inbox-chaos", label: "Inbox Chaos", lane: "work", archetype: "dissolution", medicalSignal: 0.4, medreceptionEligible: "no" },
  { slug: "context-switching", label: "Context Switching", lane: "work", archetype: "dissolution", medicalSignal: 0.35, medreceptionEligible: "no" },
  { slug: "decision-fatigue", label: "Decision Fatigue", lane: "work", archetype: "reframe", medicalSignal: 0.25, medreceptionEligible: "no" },
  { slug: "focus-drift", label: "Focus Drift", lane: "work", archetype: "reframe", medicalSignal: 0.25, medreceptionEligible: "no" },
  { slug: "mental-load", label: "Mental Load", lane: "work", archetype: "reframe", medicalSignal: 0.25, medreceptionEligible: "no" },
  { slug: "too-many-tabs", label: "Too Many Tabs", lane: "work", archetype: "reframe", medicalSignal: 0.2, medreceptionEligible: "no" },
  { slug: "ai-confusion", label: "Overwhelmed by AI", lane: "work", archetype: "reframe", medicalSignal: 0.2, medreceptionEligible: "no" },
  { slug: "overwhelmed-by-ai", label: "Overwhelmed by AI", lane: "work", archetype: "reframe", medicalSignal: 0.2, medreceptionEligible: "no" },
  { slug: "learning-overload", label: "Too Much to Learn", lane: "school", archetype: "reframe", medicalSignal: 0.2, medreceptionEligible: "no" },
  { slug: "too-much-to-learn", label: "Too Much to Learn", lane: "school", archetype: "reframe", medicalSignal: 0.2, medreceptionEligible: "no" },
  { slug: "falling-behind", label: "Falling Behind", lane: "school", archetype: "reframe", medicalSignal: 0.2, medreceptionEligible: "no" },
  { slug: "homework-stress", label: "Homework Stress", lane: "school", archetype: "reframe", medicalSignal: 0.18, medreceptionEligible: "no" },
  { slug: "test-anxiety", label: "Test Anxiety", lane: "school", archetype: "reframe", medicalSignal: 0.18, medreceptionEligible: "no" },
  { slug: "no-study-partner", label: "No Study Partner", lane: "school", archetype: "reframe", medicalSignal: 0.18, medreceptionEligible: "no" },
  { slug: "after-hours-panic", label: "After-Hours Panic", lane: "business", archetype: "containment", medicalSignal: 1.0, medreceptionEligible: "yes" },
  { slug: "staff-burnout", label: "Burnout Risk", lane: "business", archetype: "containment", medicalSignal: 0.9, medreceptionEligible: "yes" },
  { slug: "burnout-risk", label: "Burnout Risk", lane: "business", archetype: "containment", medicalSignal: 0.9, medreceptionEligible: "yes" },
  { slug: "emergency-calls", label: "Emergency Calls", lane: "business", archetype: "containment", medicalSignal: 1.0, medreceptionEligible: "yes" },
  { slug: "staffing-gaps", label: "Staffing Gaps", lane: "business", archetype: "containment", medicalSignal: 0.8, medreceptionEligible: "yes" },
  { slug: "no-coverage", label: "No Coverage", lane: "business", archetype: "containment", medicalSignal: 0.85, medreceptionEligible: "yes" },
];

const PROBLEM_LOOKUP = new Map(PROBLEM_REGISTRY.map((problem) => [problem.slug, problem]));

function humanizeSlug(raw: string) {
  if (!raw) return "Unknown Problem";
  return raw
    .split("-")
    .map((word) => (word ? word[0].toUpperCase() + word.slice(1) : word))
    .join(" ");
}

export function getProblemBySlug(slug?: string): Problem {
  const safeSlug = (slug ?? "").toLowerCase();
  return (
    PROBLEM_LOOKUP.get(safeSlug) ?? {
      slug: safeSlug || "unknown",
      label: humanizeSlug(safeSlug || "Unknown"),
      lane: "curiosity",
      archetype: "reframe",
      medicalSignal: 0.1,
      medreceptionEligible: "no",
    }
  );
}

export function getCanonicalMedReceptionPath(slug?: string): string | null {
  const safeSlug = (slug ?? "").toLowerCase();
  const map: Record<string, string> = {
    "missed-calls": "/missed-calls-medical",
    "after-hours-panic": "/after-hours-answering",
    "voicemail-backlog": "/voicemail-management",
    voicemail: "/voicemail-management",
    "scheduling-chaos": "/medical-scheduling",
    "staffing-gaps": "/ai-medical-receptionist",
  };

  return map[safeSlug] ?? null;
}

export function getCanonicalMedReceptionUrl(slug?: string): string | null {
  const path = getCanonicalMedReceptionPath(slug);
  if (!path) return null;
  return `https://medreception.ai${path}`;
}
