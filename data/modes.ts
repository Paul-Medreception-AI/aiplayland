export type ModeKey = "improve" | "explore" | "resolve";

export type ModeDef = {
  key: ModeKey;
  label: string;
  microLines: string[];
  suggested: Array<{
    slug: string;
    label: string;
    hint: string;
  }>;
};

export const MODES: Record<ModeKey, ModeDef> = {
  improve: {
    key: "improve",
    label: "Improve",
    microLines: [
      "Small frictions compound.",
      "We’ll remove the drag first.",
      "Then you get time back.",
    ],
    suggested: [
      { slug: "inbox-chaos", label: "Inbox Chaos", hint: "triage → clarity" },
      { slug: "context-switching", label: "Context Switching", hint: "focus returns" },
      { slug: "decision-fatigue", label: "Decision Fatigue", hint: "reduce choices" },
    ],
  },
  explore: {
    key: "explore",
    label: "Explore",
    microLines: [
      "No destination. Just discovery.",
      "Follow what catches your attention.",
      "The system will adapt.",
    ],
    suggested: [
      { slug: "overwhelmed-by-ai", label: "Overwhelmed by AI", hint: "what’s real" },
      { slug: "too-much-to-learn", label: "Too Much to Learn", hint: "steady progress" },
      { slug: "focus-drift", label: "Focus Drift", hint: "gentle guidance" },
    ],
  },
  resolve: {
    key: "resolve",
    label: "Resolve",
    microLines: [
      "Something is leaking.",
      "We’ll stop the bleeding.",
      "Then we harden the system.",
    ],
    suggested: [
      { slug: "missed-calls", label: "Missed Calls", hint: "catch everything" },
      { slug: "after-hours-panic", label: "After-Hours Panic", hint: "24/7 coverage" },
      { slug: "voicemail-backlog", label: "Voicemail Backlog", hint: "no pileups" },
    ],
  },
};
