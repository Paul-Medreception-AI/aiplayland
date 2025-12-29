import { aiSolutions, type AISolution } from "@/data/aiSolutions";

export type ResponsePillar = {
  title: string;
  detail: string;
  metric: string;
};

export type FlowStep = {
  label: string;
  title: string;
  copy: string;
  highlights: string[];
};

export type PlaybookStep = {
  title: string;
  body: string;
};

export type SolutionSectionConfig = {
  id: string;
  label: string;
  eyebrow: string;
  description: string;
  solutionSlugs: string[];
  externalLink?: { label: string; href: string };
  externalSolutions?: { name: string; summary: string; href: string }[];
};

export type HandleItContent = {
  heroEyebrow: string;
  heroTitle: string;
  heroDescription: string;
  responsePillars: ResponsePillar[];
  flowSteps: FlowStep[];
  playbookSteps: PlaybookStep[];
  solutionSections: SolutionSectionConfig[];
};

const BASE_CONTENT: HandleItContent = {
  heroEyebrow: "Handle It Playbook",
  heroTitle: "What it looks like when no missed call slips through.",
  heroDescription:
    "This is the operating play for clinics that replaced hold music with adaptive AI. The phone still rings. You just don’t triage chaos anymore.",
  responsePillars: [
    {
      title: "Triage in 4 seconds",
      detail: "AI listens, tags urgency, and routes before humans stop what they’re doing.",
      metric: "≤4s",
    },
    {
      title: "Recover every attempt",
      detail: "Texts + voicemail summaries make it impossible to lose a caller twice.",
      metric: "100%",
    },
    {
      title: "Protect live teams",
      detail: "Staff only get pulled in when the AI detects escalation, not every ring.",
      metric: "82% fewer interrupts",
    },
  ],
  flowSteps: [
    {
      label: "01 · Capture",
      title: "Every ring is answered on-beat",
      copy: "The moment the line opens, callers hear a calm human-quality voice that confirms the practice, records intent, and keeps them in the loop. No hold music, no voicemail tree.",
      highlights: ["Adaptive greeting by time of day", "Instant CRM + EHR lookup", "Call + SMS confirmation"],
    },
    {
      label: "02 · Sense",
      title: "Signal is extracted automatically",
      copy: "Intent, emotion, and urgency are scored in realtime so the right human sees the right card only when it matters.",
      highlights: [
        "Medical lexicon tuned for missed-call scenarios",
        "Escalation score out of 100",
        "Compliance logging by default",
      ],
    },
    {
      label: "03 · Resolve",
      title: "AI handles the routine, people handle the rare",
      copy: "Scheduling, FAQs, prescription status, and transfers complete without desk intervention. Escalations arrive with transcripts, next steps, and recommended language.",
      highlights: ["Smart callbacks & SMS nudges", "Live handoff button for urgent calls", "Resolution audit trail for leadership"],
    },
  ],
  playbookSteps: [
    {
      title: "1. Map reality",
      body: "We import the last 60 days of signal to surface peak times, abandonment, and conversion leakage.",
    },
    {
      title: "2. Wire the line",
      body: "Forwarding rules, SMS numbers, and CRM/EHR webhooks get connected. No rip-and-replace—just reroute what already exists.",
    },
    {
      title: "3. Train the voice",
      body: "We fine-tune the lightorb agent on your tone, compliance statements, and escalation criteria so every answer feels on-brand.",
    },
    {
      title: "4. Launch & watch",
      body: "Dashboards show resolved vs. escalated calls, average triage time, and any call that still needs human follow-up.",
    },
  ],
  solutionSections: [
    {
      id: "medical",
      label: "Medical call orchestration",
      eyebrow: "Clinical systems",
      description: "MedReception.ai agents replace hold music with compliance-safe, adaptive call flows for clinics and care teams.",
      solutionSlugs: ["katie-ai", "annie-ai"],
    },
    {
      id: "small-business",
      label: "Small business revenue desks",
      eyebrow: "SMB services",
      description: "AIPlayPark orchestrations for home services, studios, and boutiques that need booking + outreach without a call center.",
      solutionSlugs: [],
      externalLink: { label: "Visit AIPlayPark for SMB automations", href: "https://www.aiplaypark.com" },
      externalSolutions: [
        {
          name: "Smith.ai Receptionist",
          summary: "Hybrid AI + live receptionists that book jobs, collect payments, and triage leads for local service businesses.",
          href: "https://smith.ai",
        },
        {
          name: "Conversica Revenue Digital Assistant",
          summary: "Autonomous outreach agent that nurtures inbound and dormant leads until they’re ready to talk to sales.",
          href: "https://www.conversica.com",
        },
      ],
    },
    {
      id: "enterprise",
      label: "Enterprise experience grids",
      eyebrow: "Enterprise",
      description: "Strategic rollouts for multi-location operations, tying phone, chat, and CRM telemetry into one adaptive layer.",
      solutionSlugs: [],
      externalLink: { label: "Explore enterprise deployments", href: "https://www.aiplaypark.com/business-operations" },
      externalSolutions: [
        {
          name: "PolyAI Voice Concierge",
          summary: "Natural-language voice agent tuned for high-volume accounts that routes intent without IVRs.",
          href: "https://poly.ai",
        },
        {
          name: "Dialpad Ai Contact Center",
          summary: "Enterprise CCaaS with live transcription, sentiment, and AI agent assist baked into every channel.",
          href: "https://www.dialpad.com/contact-center/",
        },
      ],
    },
  ],
};

const LANE_SOLUTION_SECTIONS: Record<string, SolutionSectionConfig[]> = {
  business: [
    {
      id: "medical",
      label: "Medical call orchestration",
      eyebrow: "Clinical systems",
      description: "MedReception.ai agents replace hold music with compliance-safe, adaptive call flows for clinics and care teams.",
      solutionSlugs: ["katie-ai", "sallie-ai", "annie-ai"],
    },
    {
      id: "small-business",
      label: "Small business revenue desks",
      eyebrow: "SMB services",
      description: "AIPlayPark orchestrations for home services, studios, and boutiques that need booking + outreach without a call center.",
      solutionSlugs: [],
      externalLink: { label: "Visit AIPlayPark for SMB automations", href: "https://www.aiplaypark.com" },
      externalSolutions: [
        {
          name: "Smith.ai Receptionist",
          summary: "Hybrid AI + live receptionists that book jobs, collect payments, and triage leads for local service businesses.",
          href: "https://smith.ai",
        },
        {
          name: "Conversica Revenue Digital Assistant",
          summary: "Autonomous outreach agent that nurtures inbound and dormant leads until they’re ready to talk to sales.",
          href: "https://www.conversica.com",
        },
      ],
    },
    {
      id: "enterprise",
      label: "Enterprise experience grids",
      eyebrow: "Enterprise",
      description: "Strategic rollouts for multi-location operations, tying phone, chat, and CRM telemetry into one adaptive layer.",
      solutionSlugs: [],
      externalLink: { label: "Explore enterprise deployments", href: "https://www.aiplaypark.com/business-operations" },
      externalSolutions: [
        {
          name: "PolyAI Voice Concierge",
          summary: "Natural-language voice agent tuned for high-volume accounts that routes intent without IVRs.",
          href: "https://poly.ai",
        },
        {
          name: "Dialpad Ai Contact Center",
          summary: "Enterprise CCaaS with live transcription, sentiment, and AI agent assist baked into every channel.",
          href: "https://www.dialpad.com/contact-center/",
        },
      ],
    },
  ],
  work: [
    {
      id: "productivity",
      label: "Flow protection",
      eyebrow: "Knowledge work",
      description: "Calm automations that protect focus time and remove inbox noise.",
      solutionSlugs: [],
      externalLink: { label: "Browse AIPlayPark flows", href: "https://www.aiplaypark.com/work" },
    },
  ],
  school: [
    {
      id: "study-support",
      label: "Study support",
      eyebrow: "Learning",
      description: "Outbound nudges and scheduling to keep learners on track without overwhelm.",
      solutionSlugs: [],
      externalLink: { label: "See learning flows", href: "https://www.aiplaypark.com/personal-learning" },
    },
  ],
};

const HANDLE_IT_ALIAS_MAP: Record<string, string> = {
  voicemail: "voicemail",
  "voicemail-backlog": "voicemail",
  "overwhelmed-by-ai": "ai-confusion",
  "too-much-to-learn": "learning-overload",
  "burnout-risk": "staff-burnout",
};

const PROBLEM_HANDLE_IT_CONTENT: Record<string, HandleItContent> = {
  "missed-calls": {
    ...BASE_CONTENT,
    solutionSections: LANE_SOLUTION_SECTIONS.business,
  },
  voicemail: {
    ...BASE_CONTENT,
    heroTitle: "What it looks like when voicemail never piles up.",
    heroDescription:
      "This is the operating play for teams that replaced voicemail trees with structured signal intake. Messages still come in. They just don’t rot in a queue anymore.",
    responsePillars: [
      {
        title: "Triage in 6 seconds",
        detail: "AI converts voicemail into structured intent before anyone listens.",
        metric: "≤6s",
      },
      {
        title: "Every message processed",
        detail: "No voicemail gets “heard too late.”",
        metric: "100%",
      },
      {
        title: "Protect live teams",
        detail: "Staff review summaries, not recordings.",
        metric: "76% fewer interruptions",
      },
    ],
    flowSteps: [
      {
        label: "01 · Capture",
        title: "Every message becomes structured immediately",
        copy: "The moment a voicemail ends, it’s transcribed, summarized, and acknowledged—no waiting for someone to “check messages.”",
        highlights: ["Instant transcription + summary", "SMS confirmation to the caller", "No voicemail-only dead ends"],
      },
      {
        label: "02 · Sense",
        title: "Priority is detected automatically",
        copy: "Urgency, topic, and follow-up needs are scored so only the right messages reach humans.",
        highlights: ["Domain-tuned language detection", "Urgency score out of 100", "Compliance logging by default"],
      },
      {
        label: "03 · Resolve",
        title: "Routine replies handled automatically",
        copy: "FAQs, scheduling requests, and callbacks happen without staff touching audio files.",
        highlights: ["Smart callbacks & SMS responses", "Escalation packets with summaries", "Clear audit trail"],
      },
    ],
    solutionSections: [
      {
        id: "medical-message-intake",
        label: "Medical message intake",
        eyebrow: "Clinical systems",
        description: "MedReception.ai triages every voicemail into structured, compliant summaries for clinical inboxes.",
        solutionSlugs: ["katie-ai"],
      },
      {
        id: "smb-booking-desks",
        label: "Small business booking desks",
        eyebrow: "SMB services",
        description: "AIPlayPark automations turn service-business voicemails into held appointments and confirmations.",
        solutionSlugs: [],
        externalLink: { label: "Visit AIPlayPark for SMB automations", href: "https://www.aiplaypark.com" },
      },
      {
        id: "enterprise-contact-centers",
        label: "Enterprise contact centers",
        eyebrow: "Enterprise",
        description: "Voice analytics and CCaaS partners keep enterprise voicemail queues empty and audited.",
        solutionSlugs: [],
        externalLink: { label: "Explore enterprise deployments", href: "https://www.aiplaypark.com/business-operations" },
      },
    ],
  },
  "no-study-partner": {
    ...BASE_CONTENT,
    heroTitle: "What it looks like when self-study feels supported.",
    heroDescription:
      "This is the operating play for students who need a responsive co-pilot even when there isn’t a classmate available.",
    responsePillars: [
      {
        title: "Accountability loops",
        detail: "Check-ins happen automatically so momentum never disappears.",
        metric: "Daily",
      },
      {
        title: "Peer energy without peers",
        detail: "AI mirrors the cadence of a real partner, day or night.",
        metric: "24/7",
      },
      {
        title: "Progress is visible",
        detail: "Students see exactly how far they’ve come—which keeps them showing up.",
        metric: "Transparent",
      },
    ],
    flowSteps: [
      {
        label: "01 · Capture",
        title: "Intent gets logged the moment motivation spikes",
        copy: "Session goals, deadlines, and blockers are captured in seconds so nothing depends on memory or a friend texting back.",
        highlights: ["Goal & deadline prompts", "Energy + mood check", "Instant session kickoff"],
      },
      {
        label: "02 · Sense",
        title: "Rhythm adapts to how the learner feels",
        copy: "The system senses pace, confidence, and comprehension to adjust the plan like a thoughtful partner would.",
        highlights: ["Adaptive pacing", "Comprehension spot checks", "Encouragement nudges"],
      },
      {
        label: "03 · Resolve",
        title: "Every session ends with a next step",
        copy: "Action items, review prompts, and celebration notes ensure the student always knows what’s next and never feels alone.",
        highlights: ["Auto-generated next steps", "Shareable progress recap", "Gentle reminders"],
      },
    ],
    playbookSteps: [
      { title: "1. Map the study landscape", body: "Import syllabi, assignments, and testing milestones to understand what success looks like." },
      { title: "2. Design the rituals", body: "Set cadence, reminder style, and tone so support feels like a trusted partner rather than a nag." },
      { title: "3. Load the collaboration kit", body: "Add flashcards, question banks, and accountability prompts that match the subject matter." },
      { title: "4. Broadcast progress", body: "Send digest summaries to tutors, parents, or the learner themselves so everyone sees the wins." },
    ],
    solutionSections: [
      {
        id: "study-support",
        label: "Study support pods",
        eyebrow: "Learning",
        description: "AIPlayPark’s learning pods create a structured, always-on study buddy.",
        solutionSlugs: [],
        externalLink: { label: "See learning flows", href: "https://www.aiplaypark.com/personal-learning" },
      },
      {
        id: "mentor-benches",
        label: "Mentor benches",
        eyebrow: "Coaching",
        description: "Counselors and tutors get clean visibility into effort and obstacles so they can intervene quickly.",
        solutionSlugs: [],
      },
      {
        id: "family-dashboards",
        label: "Family dashboards",
        eyebrow: "Support circle",
        description: "Parents see steady progress updates, removing the pressure to interrogate or nag.",
        solutionSlugs: [],
      },
    ],
  },
  "test-anxiety": {
    ...BASE_CONTENT,
    heroTitle: "What it looks like when preparation replaces panic.",
    heroDescription:
      "This is the operating play for students who trade late-night spirals for adaptive, confidence-building reps. Exams still come. They just don’t feel like cliff dives.",
    responsePillars: [
      {
        title: "Confidence built every session",
        detail: "Each study block ends with proof of progress.",
        metric: "Daily",
      },
      {
        title: "Gaps surfaced instantly",
        detail: "Weak spots are detected before cram week.",
        metric: "≤60s",
      },
      {
        title: "Calm on exam day",
        detail: "Warmups mimic the real test so nerves drop.",
        metric: "1.7× calmer",
      },
    ],
    flowSteps: [
      {
        label: "01 · Capture",
        title: "Signals of stress are caught early",
        copy: "Calendar spikes, missed checkpoints, and frantic messages trigger a calm intervention before panic locks in.",
        highlights: ["Mood + workload check-ins", "Adaptive study prompts", "Guardian notifications"],
      },
      {
        label: "02 · Sense",
        title: "Gaps and energy levels get profiled",
        copy: "AI grades readiness by topic, time of day, and focus so each session targets the next best rep.",
        highlights: ["Topic mastery scoring", "Focus/energy sensing", "Smart pacing recommendations"],
      },
      {
        label: "03 · Resolve",
        title: "Practice mirrors the real thing",
        copy: "Students run short, adaptive drills with immediate feedback and encouragement—no guessing if they’re ready.",
        highlights: ["Micro-assessments", "Positive coaching scripts", "Shareable progress trail"],
      },
    ],
    playbookSteps: [
      { title: "1. Map the stress profile", body: "Review recent grades, upcoming exams, and personal constraints to understand why anxiety spikes." },
      { title: "2. Tune the ritual", body: "Set daily check-ins, session length, and reward structure so the cadence feels sustainable." },
      { title: "3. Load smart practice", body: "Import curricula, past exams, and flashcards so the AI drills on real material." },
      { title: "4. Report calm signals", body: "Dashboards show mastery, streaks, and mindset notes for the student, parents, or coaches." },
    ],
    solutionSections: [
      {
        id: "study-support",
        label: "Study support pods",
        eyebrow: "Learning",
        description: "Adaptive nudgers keep students on track with warm accountability and real-time adjustments.",
        solutionSlugs: [],
        externalLink: { label: "See learning flows", href: "https://www.aiplaypark.com/personal-learning" },
      },
      {
        id: "wellness-coaches",
        label: "Wellness coaches",
        eyebrow: "Care network",
        description: "Guidance counselors and therapists get structured updates instead of SOS texts.",
        solutionSlugs: [],
      },
      {
        id: "family-dashboards",
        label: "Family dashboards",
        eyebrow: "Support circle",
        description: "Parents see readiness signals without hovering, so they can encourage—not interrogate.",
        solutionSlugs: [],
      },
    ],
  },
  "emergency-calls": {
    ...BASE_CONTENT,
    heroTitle: "What it looks like when escalation actually escalates.",
    heroDescription:
      "This is the operating play for teams that replaced vague “urgent” flags with deterministic action.",
    responsePillars: [
      {
        title: "Escalate in 2 seconds",
        detail: "Urgency is declared without friction.",
        metric: "≤2s",
      },
      {
        title: "Deterministic",
        detail: "No ambiguity about who responds next.",
        metric: "Deterministic",
      },
      {
        title: "Lives and outcomes protected",
        detail: "Critical teams get context before reacting.",
        metric: "Protected",
      },
    ],
    flowSteps: [
      {
        label: "01 · Capture",
        title: "Urgency is declared without friction",
        copy: "Callers don’t need to know the right words. Intake stays calm even when they can’t.",
        highlights: ["Natural-language intake", "Panic-tolerant prompts", "Continuous presence"],
      },
      {
        label: "02 · Sense",
        title: "True urgency is separated from noise",
        copy: "Not everything labeled “urgent” is treated the same. Risk is scored before it interrupts humans.",
        highlights: ["Risk scoring", "Keyword + sentiment fusion", "Escalation confidence score"],
      },
      {
        label: "03 · Resolve",
        title: "Escalation is decisive and logged",
        copy: "The right person is notified immediately—with transcripts, recommendations, and a QA trail.",
        highlights: ["Priority alerts", "Transcript + recommendation", "Post-event review trail"],
      },
    ],
    solutionSections: [
      {
        id: "clinical-emergencies",
        label: "Clinical emergencies",
        eyebrow: "Care teams",
        description: "MedReception.ai keeps clinical escalation ladders guarded and instant.",
        solutionSlugs: ["annie-ai"],
      },
      {
        id: "safety-incidents",
        label: "Safety incidents",
        eyebrow: "Safety",
        description: "Safety teams route only confirmed emergencies to humans.",
        solutionSlugs: [],
      },
      {
        id: "critical-ops",
        label: "Critical operations",
        eyebrow: "Enterprise",
        description: "Enterprise ops blend AI listeners with CCaaS alerts for decisive action.",
        solutionSlugs: [],
        externalLink: { label: "Explore enterprise deployments", href: "https://www.aiplaypark.com/business-operations" },
      },
    ],
  },
  "no-coverage": {
    ...BASE_CONTENT,
    heroTitle: "What it looks like when there’s always a fallback.",
    heroDescription:
      "This is the operating play for teams that replaced single-point failure with layered resilience. People can be unavailable. The system never is.",
    responsePillars: [
      {
        title: "Fallback in 1 second",
        detail: "Every request hits a backup immediately.",
        metric: "≤1s",
      },
      {
        title: "Always a responder",
        detail: "Layered coverage replaces single points of failure.",
        metric: "Always",
      },
      {
        title: "Zero blind spots",
        detail: "Nothing disappears into voicemail or inbox gaps.",
        metric: "Zero blind spots",
      },
    ],
    flowSteps: [
      {
        label: "01 · Capture",
        title: "Every request enters a guarded intake",
        copy: "Nothing assumes someone is present. Intake reassures callers while routing begins automatically.",
        highlights: ["Universal intake layer", "Time-aware routing", "Immediate caller reassurance"],
      },
      {
        label: "02 · Sense",
        title: "Coverage reality is evaluated instantly",
        copy: "The system knows who can respond right now—and who cannot.",
        highlights: ["Real-time availability checks", "Role-based eligibility", "Risk thresholds"],
      },
      {
        label: "03 · Resolve",
        title: "Requests route to the next safest option",
        copy: "No dead ends. No guesswork. Escalations ladder until someone accountable accepts.",
        highlights: ["Tiered escalation paths", "Context-rich handoffs", "Full accountability trail"],
      },
    ],
    solutionSections: [
      {
        id: "clinic-fallback",
        label: "Clinics",
        eyebrow: "Care teams",
        description: "Clinics pair daytime agents with after-hours guardians for seamless coverage.",
        solutionSlugs: ["katie-ai", "annie-ai"],
      },
      {
        id: "on-call-rotations",
        label: "On-call rotations",
        eyebrow: "Safety",
        description: "On-call ladders update automatically as staff come and go.",
        solutionSlugs: [],
      },
      {
        id: "operations",
        label: "Operations",
        eyebrow: "Ops",
        description: "Ops leaders see live coverage maps and failover states.",
        solutionSlugs: [],
        externalLink: { label: "See coverage automations", href: "https://www.aiplaypark.com/business-operations" },
      },
    ],
  },
  "voicemail-backlog": {
    ...BASE_CONTENT,
    heroTitle: "What it looks like when voicemail never piles up.",
    heroDescription:
      "This is the operating play for teams that replaced voicemail trees with structured signal intake. Messages still come in. They just don’t rot in a queue anymore.",
    responsePillars: [
      {
        title: "Triage in 6 seconds",
        detail: "AI converts voicemail into structured intent before anyone listens.",
        metric: "≤6s",
      },
      {
        title: "Every message processed",
        detail: "No voicemail gets “heard too late.”",
        metric: "100%",
      },
      {
        title: "Protect live teams",
        detail: "Staff review summaries, not recordings.",
        metric: "76% fewer interruptions",
      },
    ],
    flowSteps: [
      {
        label: "01 · Capture",
        title: "Every message becomes structured immediately",
        copy: "The moment a voicemail ends, it’s transcribed, summarized, and acknowledged—no waiting for someone to “check messages.”",
        highlights: ["Instant transcription + summary", "SMS confirmation to the caller", "No voicemail-only dead ends"],
      },
      {
        label: "02 · Sense",
        title: "Priority is detected automatically",
        copy: "Urgency, topic, and follow-up needs are scored so only the right messages reach humans.",
        highlights: ["Domain-tuned language detection", "Urgency score out of 100", "Compliance logging by default"],
      },
      {
        label: "03 · Resolve",
        title: "Routine replies handled automatically",
        copy: "FAQs, scheduling requests, and callbacks happen without staff touching audio files.",
        highlights: ["Smart callbacks & SMS responses", "Escalation packets with summaries", "Clear audit trail"],
      },
    ],
    solutionSections: [
      {
        id: "medical-message-intake",
        label: "Medical message intake",
        eyebrow: "Clinical systems",
        description: "MedReception.ai triages every voicemail into structured, compliant summaries for clinical inboxes.",
        solutionSlugs: ["katie-ai"],
      },
      {
        id: "smb-booking-desks",
        label: "Small business booking desks",
        eyebrow: "SMB services",
        description: "AIPlayPark automations turn service-business voicemails into held appointments and confirmations.",
        solutionSlugs: [],
        externalLink: { label: "Visit AIPlayPark for SMB automations", href: "https://www.aiplaypark.com" },
      },
      {
        id: "enterprise-contact-centers",
        label: "Enterprise contact centers",
        eyebrow: "Enterprise",
        description: "Voice analytics and CCaaS partners keep enterprise voicemail queues empty and audited.",
        solutionSlugs: [],
        externalLink: { label: "Explore enterprise deployments", href: "https://www.aiplaypark.com/business-operations" },
      },
    ],
  },
  overbooking: {
    ...BASE_CONTENT,
    heroTitle: "What it looks like when schedules stop collapsing.",
    heroDescription:
      "This is the operating play for teams that replaced reactive scheduling with load-aware orchestration. Appointments still fill. They just don’t crush the day.",
    responsePillars: [
      {
        title: "Load check in 5 seconds",
        detail: "AI evaluates capacity before confirming.",
        metric: "≤5s",
      },
      {
        title: "Surprise double-books",
        detail: "Conflicts are blocked upstream.",
        metric: "0",
      },
      {
        title: "Fewer downstream delays",
        detail: "Schedules stay honest.",
        metric: "61% fewer downstream delays",
      },
    ],
    flowSteps: [
      {
        label: "01 · Capture",
        title: "Requests enter through a single gate",
        copy: "All booking requests flow through one intake layer—calls, texts, or forms.",
        highlights: ["Unified intake point", "Caller expectations set immediately", "No manual slot guessing"],
      },
      {
        label: "02 · Sense",
        title: "Capacity is evaluated in real time",
        copy: "The system checks provider load, buffers, and downstream impact.",
        highlights: ["Capacity thresholds by role", "Time-of-day sensitivity", "Escalation flags"],
      },
      {
        label: "03 · Resolve",
        title: "Bookings happen without breaking the day",
        copy: "Safe bookings auto-confirm. Risky ones reroute or defer.",
        highlights: ["Smart rescheduling prompts", "Human approval only when needed", "Visibility for leadership"],
      },
    ],
    solutionSections: [
      {
        id: "clinical-scheduling",
        label: "Clinical scheduling",
        eyebrow: "Care delivery",
        description: "Load-aware schedulers keep providers booked without double-stacking rooms or staff.",
        solutionSlugs: ["katie-ai", "sallie-ai"],
      },
      {
        id: "service-businesses",
        label: "Service-based businesses",
        eyebrow: "SMB services",
        description: "Studios and practices keep classes full while respecting instructor capacity.",
        solutionSlugs: [],
        externalLink: { label: "Visit AIPlayPark for scheduling automations", href: "https://www.aiplaypark.com" },
      },
      {
        id: "multi-location",
        label: "Multi-location teams",
        eyebrow: "Enterprise",
        description: "Enterprise grid controllers keep resources balanced across markets automatically.",
        solutionSlugs: [],
        externalLink: { label: "Explore enterprise deployments", href: "https://www.aiplaypark.com/business-operations" },
      },
    ],
  },
  "scheduling-chaos": {
    ...BASE_CONTENT,
    heroTitle: "What it looks like when calendars become reliable again.",
    heroDescription:
      "This is the operating play for teams that replaced ad-hoc scheduling with intent-driven coordination.",
    responsePillars: [
      {
        title: "Clarity in 4 seconds",
        detail: "Intent is captured before time is assigned.",
        metric: "≤4s",
      },
      {
        title: "Correct-first bookings",
        detail: "Appointments land in the right slot the first time.",
        metric: "92%",
      },
      {
        title: "Fewer back-and-forths",
        detail: "Intelligent routing minimizes rewrites.",
        metric: "68% fewer back-and-forths",
      },
    ],
    flowSteps: [
      {
        label: "01 · Capture",
        title: "Intent before time",
        copy: "Requests are captured by need, not by slot.",
        highlights: ["Reason-for-visit first", "Constraints collected automatically", "No premature booking"],
      },
      {
        label: "02 · Sense",
        title: "Rules resolve complexity",
        copy: "AI maps intent to the correct calendar, provider, or resource.",
        highlights: ["Specialty-aware routing", "Availability logic", "Conflict detection"],
      },
      {
        label: "03 · Resolve",
        title: "Confirmed once, not three times",
        copy: "Appointments finalize cleanly or escalate with context.",
        highlights: ["Auto-confirmation", "SMS reminders", "Change audit trail"],
      },
    ],
    solutionSections: [
      {
        id: "clinics",
        label: "Clinics",
        eyebrow: "Care teams",
        description: "Intent-driven schedulers keep clinical calendars clean.",
        solutionSlugs: ["katie-ai"],
      },
      {
        id: "studios",
        label: "Studios & practices",
        eyebrow: "SMB services",
        description: "Studios and practices let AI coordinate availability without spreadsheets.",
        solutionSlugs: [],
        externalLink: { label: "See AIPlayPark coordination flows", href: "https://www.aiplaypark.com" },
      },
      {
        id: "enterprise-ops",
        label: "Enterprise ops",
        eyebrow: "Enterprise",
        description: "Multi-site operations get a single source of truth for bookings.",
        solutionSlugs: [],
        externalLink: { label: "Explore enterprise deployments", href: "https://www.aiplaypark.com/business-operations" },
      },
    ],
  },
  "manual-followups": {
    ...BASE_CONTENT,
    heroTitle: "What it looks like when nothing relies on memory.",
    heroDescription:
      "This is the operating play for teams that replaced sticky notes and reminders with automated follow-through.",
    responsePillars: [
      {
        title: "Follow-up scheduled in 3 seconds",
        detail: "Commitments become system actions immediately.",
        metric: "≤3s",
      },
      {
        title: "No dropped threads",
        detail: "Every promise is captured and tracked.",
        metric: "100%",
      },
      {
        title: "Fewer mental pings",
        detail: "People stop carrying reminders in their head.",
        metric: "71% fewer mental pings",
      },
    ],
    flowSteps: [
      {
        label: "01 · Capture",
        title: "Commitments are recorded automatically",
        copy: "Every “we’ll follow up” becomes a system action.",
        highlights: ["Intent captured in real time", "Timestamped commitments", "No reliance on recall"],
      },
      {
        label: "02 · Sense",
        title: "Priority is inferred",
        copy: "The system understands which follow-ups matter most.",
        highlights: ["Urgency scoring", "SLA windows", "Owner assignment"],
      },
      {
        label: "03 · Resolve",
        title: "Follow-ups happen without chasing",
        copy: "Messages, calls, or nudges execute automatically.",
        highlights: ["SMS / voice nudges", "Escalation if ignored", "Completion tracking"],
      },
    ],
    solutionSections: [
      {
        id: "care-coordination",
        label: "Care coordination",
        eyebrow: "Clinical",
        description: "Automated reminders keep care teams in sync with patients.",
        solutionSlugs: ["sallie-ai"],
      },
      {
        id: "sales-followup",
        label: "Sales follow-up",
        eyebrow: "Revenue",
        description: "Revenue desks keep prospects warm without manual chasing.",
        solutionSlugs: [],
        externalLink: { label: "Visit AIPlayPark outbound flows", href: "https://www.aiplaypark.com" },
      },
      {
        id: "operations",
        label: "Operations",
        eyebrow: "Ops",
        description: "Ops teams convert ad-hoc reminders into automatic nudges.",
        solutionSlugs: [],
      },
    ],
  },
  "lost-leads": {
    ...BASE_CONTENT,
    heroTitle: "What it looks like when interest never goes dark.",
    heroDescription:
      "This is the operating play for teams that replaced passive intake with persistent, respectful engagement.",
    responsePillars: [
      {
        title: "Engage in 5 seconds",
        detail: "Every new inquiry gets an immediate response.",
        metric: "≤5s",
      },
      {
        title: "Recovered attempts",
        detail: "No one wonders if a lead received care.",
        metric: "89%",
      },
      {
        title: "Response velocity",
        detail: "Follow-ups run twice as fast as traditional desks.",
        metric: "2×",
      },
    ],
    flowSteps: [
      {
        label: "01 · Capture",
        title: "Every inquiry is acknowledged instantly",
        copy: "No lead waits for a human response window.",
        highlights: ["Immediate confirmation", "Context captured", "Next step set"],
      },
      {
        label: "02 · Sense",
        title: "Readiness is assessed",
        copy: "AI determines how warm the lead actually is.",
        highlights: ["Intent signals", "Timing indicators", "Confidence scoring"],
      },
      {
        label: "03 · Resolve",
        title: "Leads are nurtured, not chased",
        copy: "Follow-ups continue until resolution or opt-out.",
        highlights: ["Smart drip outreach", "Escalation on engagement", "Conversion visibility"],
      },
    ],
    solutionSections: [
      {
        id: "inbound-leads",
        label: "Inbound leads",
        eyebrow: "Revenue desks",
        description: "Ensure every inbound interest is acknowledged and guided.",
        solutionSlugs: ["sallie-ai"],
      },
      {
        id: "service-inquiries",
        label: "Service inquiries",
        eyebrow: "SMB services",
        description: "Studios and practices keep inquiries alive while staff sleep.",
        solutionSlugs: [],
      },
      {
        id: "revenue-teams",
        label: "Revenue teams",
        eyebrow: "Enterprise",
        description: "RevOps gains a consistent nurture layer that respects human bandwidth.",
        solutionSlugs: [],
      },
    ],
  },
  "inbox-chaos": {
    ...BASE_CONTENT,
    heroTitle: "What it looks like when inboxes stop deciding your day.",
    heroDescription: "This is the operating play for teams that replaced unread counts with prioritized signal.",
    responsePillars: [
      {
        title: "Sort in 4 seconds",
        detail: "Every new inbound gets triaged instantly.",
        metric: "≤4s",
      },
      {
        title: "Noise filtered",
        detail: "Only meaningful threads reach humans.",
        metric: "83%",
      },
      {
        title: "Fewer reactive replies",
        detail: "Workdays stop being dictated by inbox refresh.",
        metric: "65% fewer reactive replies",
      },
    ],
    flowSteps: [
      {
        label: "01 · Capture",
        title: "Everything enters one stream",
        copy: "Emails, messages, and alerts are unified.",
        highlights: ["Central intake", "Metadata preserved", "No channel silos"],
      },
      {
        label: "02 · Sense",
        title: "Signal is separated from noise",
        copy: "Topics and urgency are clustered automatically.",
        highlights: ["Topic detection", "Priority scoring", "Duplicate collapse"],
      },
      {
        label: "03 · Resolve",
        title: "Only what matters reaches humans",
        copy: "Low-impact items self-resolve or queue quietly.",
        highlights: ["Deferred handling", "Escalation summaries", "Clean audit trail"],
      },
    ],
    solutionSections: [
      {
        id: "clinical-inboxes",
        label: "Clinical inboxes",
        eyebrow: "Care teams",
        description: "Clinical inboxes convert chaos into prioritized worklists.",
        solutionSlugs: ["katie-ai"],
      },
      {
        id: "support-queues",
        label: "Support queues",
        eyebrow: "CX",
        description: "Support teams route only the meaningful cases to humans.",
        solutionSlugs: [],
      },
      {
        id: "internal-ops",
        label: "Internal ops",
        eyebrow: "Ops",
        description: "Internal ops get calm dashboards instead of inbox alarms.",
        solutionSlugs: [],
      },
    ],
  },
  "context-switching": {
    ...BASE_CONTENT,
    heroTitle: "What it looks like when focus stays intact.",
    heroDescription:
      "This is the operating play for teams that replaced constant interruption with intelligent gating.",
    responsePillars: [
      {
        title: "Interrupt check in 2 seconds",
        detail: "Requests are evaluated before they reach humans.",
        metric: "≤2s",
      },
      {
        title: "Interrupts blocked",
        detail: "Only high-value work breaks focus.",
        metric: "78%",
      },
      {
        title: "Deep work time",
        detail: "Teams regain concentrated blocks.",
        metric: "1.4×",
      },
    ],
    flowSteps: [
      {
        label: "01 · Capture",
        title: "Interruptions are intercepted",
        copy: "Requests don’t hit humans immediately.",
        highlights: ["Intake buffer", "Auto-acknowledgment", "Expectation setting"],
      },
      {
        label: "02 · Sense",
        title: "Importance is evaluated",
        copy: "Only true interruptions pass through.",
        highlights: ["Urgency scoring", "Role awareness", "Time sensitivity"],
      },
      {
        label: "03 · Resolve",
        title: "Focus is preserved by default",
        copy: "Humans engage only when impact justifies it.",
        highlights: ["Batched delivery", "Context-rich alerts", "Fewer task resets"],
      },
    ],
    solutionSections: [
      {
        id: "knowledge-work",
        label: "Knowledge work",
        eyebrow: "Workflows",
        description: "Knowledge workers get a protective gate for their attention.",
        solutionSlugs: [],
      },
      {
        id: "clinical-teams",
        label: "Clinical teams",
        eyebrow: "Clinical",
        description: "Clinicians see only high-impact requests when they’re scrubbed in.",
        solutionSlugs: ["katie-ai"],
      },
      {
        id: "ops-teams",
        label: "Operations",
        eyebrow: "Ops",
        description: "Ops teams batch interruptions and stay in flow.",
        solutionSlugs: [],
      },
    ],
  },
  "decision-fatigue": {
    ...BASE_CONTENT,
    heroTitle: "What it looks like when small choices disappear.",
    heroDescription:
      "This is the operating play for teams that replaced constant micro-decisions with defaults and rules.",
    responsePillars: [
      {
        title: "Decision removed in 3 seconds",
        detail: "AI notices repeat choices before humans do.",
        metric: "≤3s",
      },
      {
        title: "Fewer daily decisions",
        detail: "The brainpower tax keeps dropping.",
        metric: "54%",
      },
      {
        title: "Quality goes up",
        detail: "Only meaningful judgment calls reach leaders.",
        metric: "Higher-quality outcomes",
      },
    ],
    flowSteps: [
      {
        label: "01 · Capture",
        title: "Decisions are identified",
        copy: "Repeated choices are flagged automatically.",
        highlights: ["Pattern recognition", "Frequency detection", "Impact assessment"],
      },
      {
        label: "02 · Sense",
        title: "Defaults are created",
        copy: "The system learns what “usually works.”",
        highlights: ["Rule formation", "Confidence thresholds", "Override paths"],
      },
      {
        label: "03 · Resolve",
        title: "Only exceptions reach humans",
        copy: "Most decisions resolve themselves.",
        highlights: ["Auto-execution", "Escalation only on ambiguity", "Transparency maintained"],
      },
    ],
    solutionSections: [
      {
        id: "clinic-decisions",
        label: "Clinics",
        eyebrow: "Care teams",
        description: "Clinics let AI handle predictable decisions around routing and follow-up.",
        solutionSlugs: ["katie-ai"],
      },
      {
        id: "managers",
        label: "Managers",
        eyebrow: "Leadership",
        description: "Managers reserve judgment for strategy, not repeat approvals.",
        solutionSlugs: [],
      },
      {
        id: "operators",
        label: "Operators",
        eyebrow: "Ops",
        description: "Operators codify their best calls so work hums without them.",
        solutionSlugs: [],
      },
    ],
  },
  "after-hours-panic": {
    ...BASE_CONTENT,
    heroTitle: "What it looks like when nights stay quiet.",
    heroDescription:
      "This is the operating play for teams that replaced voicemail dread with guarded, always-on coverage.",
    responsePillars: [
      {
        title: "Immediate intake",
        detail: "No ring goes unanswered, no matter the hour.",
        metric: "24/7",
      },
      {
        title: "Missed urgent calls",
        detail: "Every true emergency gets to a human.",
        metric: "0",
      },
      {
        title: "Callback window",
        detail: "On-call teams respond with context in minutes.",
        metric: "<15 min",
      },
    ],
    flowSteps: [
      {
        label: "01 · Capture",
        title: "Calls are answered instantly",
        copy: "No ring goes unanswered, no matter the hour.",
        highlights: ["Calm voice intake", "Caller reassurance", "No voicemail trees"],
      },
      {
        label: "02 · Sense",
        title: "Risk is assessed immediately",
        copy: "Urgency is scored before escalation.",
        highlights: ["Medical or business lexicon", "Risk thresholds", "Compliance logging"],
      },
      {
        label: "03 · Resolve",
        title: "Only true emergencies escalate",
        copy: "On-call staff engage with full context.",
        highlights: ["Transcript + summary", "Recommended response", "QA trail"],
      },
    ],
    solutionSections: [
      {
        id: "after-hours-clinics",
        label: "After-hours clinics",
        eyebrow: "Clinical coverage",
        description: "Guarded AI reception keeps clinics calm overnight.",
        solutionSlugs: ["annie-ai"],
      },
      {
        id: "on-call-teams",
        label: "On-call teams",
        eyebrow: "Safety",
        description: "On-call rosters get only the calls that truly need them.",
        solutionSlugs: [],
      },
      {
        id: "safety-workflows",
        label: "Safety workflows",
        eyebrow: "Operations",
        description: "Safety programs document every escalation for QA.",
        solutionSlugs: [],
      },
    ],
  },
  "staff-burnout": {
    ...BASE_CONTENT,
    heroTitle: "What it looks like when teams stop absorbing everything.",
    heroDescription:
      "This is the operating play for teams that replaced overload with intelligent buffering.",
    responsePillars: [
      {
        title: "Load check in 1 second",
        detail: "Workload is measured passively.",
        metric: "≤1s",
      },
      {
        title: "Fewer overload events",
        detail: "Teams recover margin before things break.",
        metric: "67%",
      },
      {
        title: "Sustainable pace",
        detail: "Work moves without burning people out.",
        metric: "Restored",
      },
    ],
    flowSteps: [
      {
        label: "01 · Capture",
        title: "Workload is monitored passively",
        copy: "No self-reporting required.",
        highlights: ["Volume tracking", "Interrupt frequency", "Escalation counts"],
      },
      {
        label: "02 · Sense",
        title: "Burnout signals are detected",
        copy: "Risk rises before failure occurs.",
        highlights: ["Trend analysis", "Threshold alerts", "Team-level visibility"],
      },
      {
        label: "03 · Resolve",
        title: "Load is redistributed automatically",
        copy: "Work shifts before people break.",
        highlights: ["Routing adjustments", "Deferred tasks", "Leadership insight"],
      },
    ],
    solutionSections: [
      {
        id: "clinical-teams",
        label: "Clinical teams",
        eyebrow: "Care teams",
        description: "Clinical desks shed repetitive work to MedReception.ai buffers.",
        solutionSlugs: ["katie-ai", "annie-ai"],
      },
      {
        id: "front-desks",
        label: "Front desks",
        eyebrow: "Operations",
        description: "Front desks stay sane with AI absorbing noise.",
        solutionSlugs: [],
      },
      {
        id: "ops-staff",
        label: "Ops staff",
        eyebrow: "Ops",
        description: "Ops teams get load dashboards and automation knobs.",
        solutionSlugs: [],
      },
    ],
  },
};

export function getHandleItContent(slug: string, label: string, lane?: string): HandleItContent {
  const safeSlug = (slug ?? "").toLowerCase();
  const resolvedSlug = HANDLE_IT_ALIAS_MAP[safeSlug] ?? safeSlug;
  if (PROBLEM_HANDLE_IT_CONTENT[resolvedSlug]) {
    return PROBLEM_HANDLE_IT_CONTENT[resolvedSlug];
  }

  const laneSections = (lane && LANE_SOLUTION_SECTIONS[lane]) || LANE_SOLUTION_SECTIONS.business || BASE_CONTENT.solutionSections;

  return {
    ...BASE_CONTENT,
    heroTitle: `What it looks like when ${label.toLowerCase()} gets absorbed by AI.`,
    heroDescription: `This is the operating play for teams that let AI intercept ${label.toLowerCase()} so humans stay in flow.`,
    solutionSections: laneSections,
  };
}

export const SOLUTION_LOOKUP: Record<string, AISolution> = Object.fromEntries(
  aiSolutions.map((solution) => [solution.slug, solution]),
);
