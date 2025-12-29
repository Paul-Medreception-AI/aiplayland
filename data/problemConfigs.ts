import { getProblemBySlug } from "@/data/problemRegistry";

export type ProblemConfig = {
  slug: string;
  title: string;
  description: string;
  category: string;
  narrative: string[];
  primaryCtaLabel?: string;
  primaryCtaHref?: string;
  secondaryCtaLabel?: string;
  secondaryCtaHref?: string;
};

const CORE = "Core Operations / Practice Stressors";
const AI_COGNITIVE = "AI / Cognitive Overload";
const EDUCATION = "Education / Personal Stressors";
const COVERAGE = "Coverage / After-Hours / Staffing";

const handleItHref = (slug: string) => `/problems/${slug}/handle-it`;

export const PROBLEM_CONFIGS: Record<string, ProblemConfig> = {
  "missed-calls": {
    slug: "missed-calls",
    title: "What it looks like when no call disappears.",
    description: "Every ring is answered, intent is captured, and urgency is recognized before your team is interrupted.",
    category: CORE,
    narrative: [
      "Every ring is answered instantly, even when staff are already on the line.",
      "Intent is scored and routed before a person gets interrupted.",
      "Only true escalations reach the desk—with transcripts and next steps.",
    ],
    primaryCtaLabel: "See how it gets handled",
    primaryCtaHref: handleItHref("missed-calls"),
  },
  voicemail: {
    slug: "voicemail",
    title: "When voicemail stops being a black hole.",
    description: "Messages arrive organized, summarized, and routed—without forcing staff to listen line by line.",
    category: CORE,
    narrative: [
      "Voicemails transcribe themselves and show up as structured tasks.",
      "Urgent clips bubble to the top while FYI items wait quietly.",
      "Teams reply with one tap instead of rewinding recordings.",
    ],
    primaryCtaHref: handleItHref("voicemail"),
  },
  "voicemail-backlog": {
    slug: "voicemail-backlog",
    title: "When voicemail stops being a black hole.",
    description: "Messages arrive organized, summarized, and routed—without forcing staff to listen line by line.",
    category: CORE,
    narrative: [
      "Voicemails transcribe themselves and show up as structured tasks.",
      "Urgent clips bubble to the top while FYI items wait quietly.",
      "Teams reply with one tap instead of rewinding recordings.",
    ],
    primaryCtaHref: handleItHref("voicemail-backlog"),
  },
  overbooking: {
    slug: "overbooking",
    title: "When the schedule stops fighting itself.",
    description: "Appointments fill intelligently, cancellations self-correct, and capacity reflects reality—not hope.",
    category: CORE,
    narrative: [
      "AI watches openings, cancellations, and waitlists simultaneously.",
      "Double-booking stops because inventory reflects live reality.",
      "Staff see a calm grid instead of patchwork scheduling.",
    ],
    primaryCtaHref: handleItHref("overbooking"),
  },
  "scheduling-chaos": {
    slug: "scheduling-chaos",
    title: "When booking no longer feels like triage.",
    description: "Requests resolve automatically, calendars stay clean, and staff stop negotiating availability all day.",
    category: CORE,
    narrative: [
      "Requests resolve automatically across phone, text, and web.",
      "Calendars stay clean as rules enforce themselves.",
      "Staff spend time approving exceptions, not playing Tetris.",
    ],
    primaryCtaHref: handleItHref("scheduling-chaos"),
  },
  "manual-followups": {
    slug: "manual-followups",
    title: "When follow-ups happen without reminders.",
    description: "Calls, texts, and nudges run in the background so nothing depends on memory or sticky notes.",
    category: CORE,
    narrative: [
      "Call, text, and email nudges go out the moment they matter.",
      "Status updates sync back so everyone sees progress.",
      "Humans only jump in when empathy or nuance is required.",
    ],
    primaryCtaHref: handleItHref("manual-followups"),
  },
  "lost-leads": {
    slug: "lost-leads",
    title: "When interest doesn’t evaporate after hours.",
    description: "Every inquiry is captured, acknowledged, and progressed—even when no one is at the desk.",
    category: CORE,
    narrative: [
      "Leads stop slipping through the cracks; urgency is recognized automatically.",
      "Prospective clients get immediate confirmation so interest stays warm.",
      "Your team steps in only when momentum really needs a human.",
    ],
    primaryCtaLabel: "See how lost leads get rescued",
    primaryCtaHref: handleItHref("lost-leads"),
  },
  "inbox-chaos": {
    slug: "inbox-chaos",
    title: "When the inbox stops dictating your day.",
    description: "Messages sort themselves, urgency is surfaced, and only what matters reaches humans.",
    category: CORE,
    narrative: [
      "Messages triage themselves into actions, briefs, and FYIs.",
      "Urgent threads surface with context while noise stays muted.",
      "Humans respond to what matters instead of checking every ping.",
    ],
    primaryCtaHref: handleItHref("inbox-chaos"),
  },
  "context-switching": {
    slug: "context-switching",
    title: "When your attention stays where it belongs.",
    description: "Interruptions decrease, tasks stay intact, and staff stop mentally bouncing between roles.",
    category: CORE,
    narrative: [
      "AI sequences work so attention stays inside one lane.",
      "Micro handoffs happen quietly in the background.",
      "Staff finish blocks of work without reloading their brain.",
    ],
    primaryCtaHref: handleItHref("context-switching"),
  },
  "decision-fatigue": {
    slug: "decision-fatigue",
    title: "When fewer decisions demand energy.",
    description: "Routine choices resolve automatically, preserving focus for judgment that actually matters.",
    category: CORE,
    narrative: [
      "Routine decisions auto-resolve with documented reasoning.",
      "Playbooks surface only when a judgment call is truly needed.",
      "Leaders reserve energy for strategy instead of repetitive approvals.",
    ],
    primaryCtaHref: handleItHref("decision-fatigue"),
  },
  "focus-drift": {
    slug: "focus-drift",
    title: "When focus stops leaking away.",
    description: "Work blocks stay uninterrupted as background systems absorb low-stakes noise.",
    category: CORE,
    narrative: [
      "Systems buffer interruptions and schedule deep work windows.",
      "Lightweight interactions stay asynchronous.",
      "Teams feel flow again because background noise is absorbed.",
    ],
    primaryCtaHref: handleItHref("focus-drift"),
  },
  "mental-load": {
    slug: "mental-load",
    title: "When the invisible weight lifts.",
    description: "Processes carry themselves, so staff aren’t holding workflows in their heads.",
    category: CORE,
    narrative: [
      "Processes carry themselves so staff aren’t memorizing steps.",
      "AI tracks handoffs, reminders, and dependencies automatically.",
      "People experience clarity instead of juggling invisible work.",
    ],
    primaryCtaHref: handleItHref("mental-load"),
  },
  "too-many-tabs": {
    slug: "too-many-tabs",
    title: "When work collapses into one flow.",
    description: "Calls, messages, and actions converge instead of fragmenting across tools.",
    category: CORE,
    narrative: [
      "Calls, messages, and actions converge into one panel.",
      "Context sticks with the work no matter which channel started it.",
      "There’s finally a single source of truth for status.",
    ],
    primaryCtaHref: handleItHref("too-many-tabs"),
  },
  "ai-confusion": {
    slug: "ai-confusion",
    title: "When AI stops feeling like homework.",
    description: "One adaptive system replaces scattered tools, dashboards, and half-configured automations.",
    category: AI_COGNITIVE,
    narrative: [
      "One adaptive layer replaces scattered bots and half-built automations.",
      "Staff use plain language instead of memorizing prompts.",
      "The system teaches itself on your workflows.",
    ],
    primaryCtaHref: handleItHref("ai-confusion"),
  },
  "overwhelmed-by-ai": {
    slug: "overwhelmed-by-ai",
    title: "When AI stops feeling like homework.",
    description: "One adaptive system replaces scattered tools, dashboards, and half-configured automations.",
    category: AI_COGNITIVE,
    narrative: [
      "One adaptive layer replaces scattered bots and half-built automations.",
      "Staff use plain language instead of memorizing prompts.",
      "The system teaches itself on your workflows.",
    ],
    primaryCtaHref: handleItHref("overwhelmed-by-ai"),
  },
  "learning-overload": {
    slug: "learning-overload",
    title: "When learning curves flatten.",
    description: "Systems adapt to your workflow instead of forcing staff to adapt to software.",
    category: AI_COGNITIVE,
    narrative: [
      "Training plans adapt to role, pace, and mastery.",
      "Just-in-time coaching appears inside the workflow.",
      "Onboarding feels like a guide, not a scavenger hunt.",
    ],
    primaryCtaHref: handleItHref("learning-overload"),
  },
  "too-much-to-learn": {
    slug: "too-much-to-learn",
    title: "When learning curves flatten.",
    description: "Systems adapt to your workflow instead of forcing staff to adapt to software.",
    category: AI_COGNITIVE,
    narrative: [
      "Training plans adapt to role, pace, and mastery.",
      "Just-in-time coaching appears inside the workflow.",
      "Onboarding feels like a guide, not a scavenger hunt.",
    ],
    primaryCtaHref: handleItHref("too-much-to-learn"),
  },
  "falling-behind": {
    slug: "falling-behind",
    title: "When you stop chasing the day.",
    description: "Backlogs resolve continuously instead of compounding overnight.",
    category: AI_COGNITIVE,
    narrative: [
      "Backlogs resolve continuously instead of exploding overnight.",
      "AI preps briefs so humans can commit quickly.",
      "Teams feel caught up because tomorrow is already staged.",
    ],
    primaryCtaHref: handleItHref("falling-behind"),
  },
  "homework-stress": {
    slug: "homework-stress",
    title: "When studying feels supported, not isolating.",
    description: "Guidance, pacing, and feedback appear exactly when needed.",
    category: EDUCATION,
    narrative: [
      "Guidance, pacing, and accountability show up exactly when needed.",
      "Study plans adapt when life happens.",
      "Students feel accompanied rather than isolated.",
    ],
    primaryCtaHref: handleItHref("homework-stress"),
  },
  "test-anxiety": {
    slug: "test-anxiety",
    title: "When preparation replaces panic.",
    description: "Study sessions adapt to gaps, not guesses, reducing last-minute stress.",
    category: EDUCATION,
    narrative: [
      "Prep targets the actual gaps instead of random chapters.",
      "Feedback motivates with next best actions.",
      "Exam day feels calm because the reps were real.",
    ],
    primaryCtaHref: handleItHref("test-anxiety"),
  },
  "no-study-partner": {
    slug: "no-study-partner",
    title: "When learning isn’t a solo sport.",
    description: "A steady, responsive guide replaces silence and uncertainty.",
    category: EDUCATION,
    narrative: [
      "Learners always have a responsive coach to bounce ideas off.",
      "Sessions stay structured even without a classmate.",
      "Confidence grows because progress is visible.",
    ],
    primaryCtaHref: handleItHref("no-study-partner"),
  },
  "after-hours-panic": {
    slug: "after-hours-panic",
    title: "When nights and weekends feel contained.",
    description: "Urgency is recognized, routine issues are handled, and escalation is precise.",
    category: COVERAGE,
    narrative: [
      "After-hours calls route by urgency without waking the whole team.",
      "Patients feel cared for because they hear a confident voice.",
      "On-call providers only get pinged when it truly matters.",
    ],
    primaryCtaHref: handleItHref("after-hours-panic"),
  },
  "staff-burnout": {
    slug: "staff-burnout",
    title: "When the system protects the people.",
    description: "Workload evens out, interruptions decrease, and staff recover margin.",
    category: COVERAGE,
    narrative: [
      "Workloads balance themselves as AI absorbs repetitive tasks.",
      "Interruptions decrease so people finish what they start.",
      "Leaders see overload early and adjust before burnout hits.",
    ],
    primaryCtaHref: handleItHref("staff-burnout"),
  },
  "burnout-risk": {
    slug: "burnout-risk",
    title: "When the system protects the people.",
    description: "Workload evens out, interruptions decrease, and staff recover margin.",
    category: COVERAGE,
    narrative: [
      "Workloads balance themselves as AI absorbs repetitive tasks.",
      "Interruptions decrease so people finish what they start.",
      "Leaders see overload early and adjust before burnout hits.",
    ],
    primaryCtaHref: handleItHref("burnout-risk"),
  },
  "emergency-calls": {
    slug: "emergency-calls",
    title: "When emergencies reach humans immediately.",
    description: "True urgency cuts the line without amplifying noise.",
    category: COVERAGE,
    narrative: [
      "True emergencies cut the line with a protected escalation path.",
      "Context travels with the call so clinicians act immediately.",
      "Everything else stays calm instead of triggering panic.",
    ],
    primaryCtaHref: handleItHref("emergency-calls"),
  },
  "staffing-gaps": {
    slug: "staffing-gaps",
    title: "When coverage doesn’t depend on headcount.",
    description: "Calls and requests resolve even when teams are thin.",
    category: COVERAGE,
    narrative: [
      "Coverage isn’t tied to who is physically at the desk.",
      "AI resolves routine requests even when headcount dips.",
      "Leaders scale capacity without scrambling for temp help.",
    ],
    primaryCtaHref: handleItHref("staffing-gaps"),
  },
  "no-coverage": {
    slug: "no-coverage",
    title: "When the phone still answers—always.",
    description: "Nights, weekends, and gaps stay covered without on-call chaos.",
    category: COVERAGE,
    narrative: [
      "Phones still answer at 2 a.m. without draining the team.",
      "Escalations reach the right person with zero guesswork.",
      "Patients trust the brand because the line is always alive.",
    ],
    primaryCtaHref: handleItHref("no-coverage"),
  },
};

export function getProblemConfig(slug: string): ProblemConfig {
  if (PROBLEM_CONFIGS[slug]) {
    return PROBLEM_CONFIGS[slug];
  }

  const fallbackProblem = getProblemBySlug(slug);
  return {
    slug,
    title: `${fallbackProblem.label} needs a new playbook.`,
    description: `AI absorbs ${fallbackProblem.label.toLowerCase()} so your team doesn’t have to.`,
    category: "Handle It Playbook",
    narrative: [
      `${fallbackProblem.label} currently drags humans away from higher value work.`,
      "Signals get delayed or lost in handoffs.",
      "Let AI hold the noise so teams can focus on the moments that matter.",
    ],
    primaryCtaHref: handleItHref(slug),
  };
}
