"use client";

import Link from "next/link";
import { aiSolutions, type AISolution } from "@/data/aiSolutions";

type ExternalSolution = {
  name: string;
  summary: string;
  href: string;
};

type SolutionSectionConfig = {
  id: string;
  label: string;
  eyebrow: string;
  description: string;
  solutionSlugs: string[];
  externalLink?: { label: string; href: string };
  externalSolutions?: ExternalSolution[];
};

type SolutionSection = SolutionSectionConfig & { solutions: AISolution[] };

const SOLUTION_LOOKUP: Record<string, AISolution> = Object.fromEntries(
  aiSolutions.map((solution) => [solution.slug, solution]),
);

const SOLUTION_SECTIONS: SolutionSection[] = [
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
].map((section) => ({
  ...section,
  solutions: section.solutionSlugs.map((slug) => SOLUTION_LOOKUP[slug]).filter((solution): solution is AISolution => Boolean(solution)),
}));

const RESPONSE_PILLARS = [
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
];

const FLOW_STEPS = [
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
    highlights: ["Medical lexicon tuned for missed-call scenarios", "Escalation score out of 100", "Compliance logging by default"],
  },
  {
    label: "03 · Resolve",
    title: "AI handles the routine, people handle the rare",
    copy: "Scheduling, FAQs, prescription status, and transfers complete without desk intervention. Escalations arrive with transcripts, next steps, and recommended language.",
    highlights: ["Smart callbacks & SMS nudges", "Live handoff button for urgent calls", "Resolution audit trail for leadership"],
  },
];

const PLAYBOOK_STEPS = [
  {
    title: "1. Map reality",
    body: "We import the last 60 days of missed-call data to surface peak times, voicemail abandonment, and conversion leakage.",
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
];

export default function HandleMissedCallsPage() {
  return (
    <main className="bg-neutral-950 text-neutral-50">
      <nav className="mx-auto flex max-w-6xl items-center gap-2 px-6 pt-6 text-[11px] uppercase tracking-[0.3em] text-white/50">
        <Link href="/" className="transition hover:text-white">
          Home
        </Link>
        <span className="opacity-60">/</span>
        <Link href="/problems" className="transition hover:text-white">
          Problems
        </Link>
        <span className="opacity-60">/</span>
        <Link href="/problems/missed-calls" className="transition hover:text-white">
          Missed Calls
        </Link>
        <span className="opacity-60">/</span>
        <span className="text-white">Handle It</span>
      </nav>
      <section className="relative overflow-hidden border-b border-white/5 bg-gradient-to-b from-[#0b1a3a] via-[#0f2352] to-[#091327]">
        <div className="absolute inset-0 opacity-40">
          <div className="absolute inset-0 bg-[radial-gradient(circle_at_top,_rgba(255,255,255,0.18),_rgba(9,19,39,0))]" />
        </div>
        <div className="relative mx-auto flex max-w-6xl flex-col gap-10 px-6 py-20 lg:flex-row lg:items-end lg:justify-between">
          <div className="space-y-6 lg:max-w-3xl">
            <Link href="/problems/missed-calls" className="inline-flex items-center text-sm text-white/70 transition hover:text-white">
              ← Back to Missed Calls
            </Link>
            <p className="text-sm uppercase tracking-[0.5em] text-white/60">Handle It Playbook</p>
            <h1 className="text-4xl font-semibold leading-tight text-white md:text-5xl">
              What it looks like when no missed call slips through.
            </h1>
            <p className="text-lg text-white/80 md:text-xl">
              This is the operating play for clinics that replaced hold music with adaptive AI. The phone still rings. You just don’t
              triage chaos anymore.
            </p>
            <div className="flex flex-wrap gap-3 text-sm">
              {SOLUTION_SECTIONS.map((section) => (
                <a
                  key={section.id}
                  href={`#${section.id}`}
                  className="inline-flex items-center rounded-full border border-white/20 px-4 py-2 text-white/80 transition hover:border-white hover:text-white"
                >
                  {section.label}
                </a>
              ))}
            </div>
          </div>
          <div className="grid gap-4 text-sm text-white/80 md:grid-cols-3">
            {RESPONSE_PILLARS.map((pillar) => (
              <div key={pillar.title} className="rounded-2xl border border-white/10 bg-white/5 p-4 backdrop-blur">
                <p className="text-3xl font-semibold text-white">{pillar.metric}</p>
                <p className="mt-2 text-base font-medium text-white">{pillar.title}</p>
                <p className="mt-1 text-xs leading-relaxed text-white/70">{pillar.detail}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      <section className="mx-auto max-w-5xl px-6 py-16">
        <div className="space-y-10">
          {FLOW_STEPS.map((step) => (
            <div key={step.label} className="rounded-3xl border border-white/10 bg-white/5 p-8 shadow-[0_40px_120px_rgba(4,7,20,0.45)]">
              <p className="text-xs uppercase tracking-[0.4em] text-white/60">{step.label}</p>
              <div className="mt-3 flex flex-col gap-6 lg:flex-row lg:items-center lg:justify-between">
                <div className="space-y-4 lg:max-w-3xl">
                  <h2 className="text-3xl font-semibold text-white">{step.title}</h2>
                  <p className="text-base leading-relaxed text-white/80">{step.copy}</p>
                </div>
                <ul className="grid gap-2 text-sm text-white/80 lg:w-64">
                  {step.highlights.map((highlight) => (
                    <li key={highlight} className="rounded-xl border border-white/10 bg-white/5 px-4 py-3 text-white/90">
                      {highlight}
                    </li>
                  ))}
                </ul>
              </div>
            </div>
          ))}
        </div>
      </section>

      <section className="border-t border-white/5 bg-gradient-to-b from-neutral-950 to-[#080f22]">
        <div className="mx-auto max-w-5xl px-6 py-16">
          <div className="flex flex-col gap-6 lg:flex-row lg:items-center lg:justify-between">
            <div>
              <p className="text-xs uppercase tracking-[0.4em] text-white/60">Playbook</p>
              <h3 className="mt-3 text-3xl font-semibold text-white">Launch sequence (10 business days)</h3>
            </div>
            <Link
              href="/contact"
              className="inline-flex items-center justify-center rounded-full border border-white/20 bg-white/10 px-5 py-3 text-sm font-semibold text-white transition hover:border-white hover:bg-white/20"
            >
              Talk through your call volume →
            </Link>
          </div>

          <div className="mt-10 grid gap-6 md:grid-cols-2">
            {PLAYBOOK_STEPS.map((step, index) => (
              <div key={step.title} className="rounded-3xl border border-white/10 bg-white/5 p-6 text-white/80">
                <div className="text-xs uppercase tracking-[0.3em] text-white/50">Step {index + 1}</div>
                <h4 className="mt-3 text-xl font-semibold text-white">{step.title}</h4>
                <p className="mt-2 text-sm leading-relaxed">{step.body}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {SOLUTION_SECTIONS.map((section) => (
        <section key={section.id} id={section.id} className="border-t border-white/10 bg-neutral-950">
          <div className="mx-auto max-w-5xl px-6 py-16">
            <div className="flex flex-col gap-4 text-center lg:text-left">
              <p className="text-xs uppercase tracking-[0.4em] text-white/60">{section.eyebrow}</p>
              <h3 className="text-3xl font-semibold text-white">{section.label}</h3>
              <p className="text-sm text-white/70">{section.description}</p>
              {section.externalLink && (
                <Link
                  href={section.externalLink.href}
                  className="inline-flex items-center justify-center rounded-full border border-white/20 bg-white/10 px-5 py-2 text-sm font-semibold text-white transition hover:border-white hover:bg-white/20 lg:self-start"
                >
                  {section.externalLink.label} →
                </Link>
              )}
            </div>
            {section.solutions.length > 0 && (
              <div className="mt-10 grid gap-6 md:grid-cols-2">
                {section.solutions.map((solution) => (
                  <div
                    key={solution.slug}
                    className="flex flex-col gap-4 rounded-3xl border border-white/10 bg-white/5 p-6 text-white/80 shadow-[0_30px_80px_rgba(4,7,20,0.45)]"
                  >
                    <div>
                      <p className="text-xs uppercase tracking-[0.35em] text-white/60">
                        {solution.type === "owned" ? "owned" : "curated"}
                      </p>
                      <h4 className="mt-2 text-2xl font-semibold text-white">{solution.name}</h4>
                      <p className="mt-2 text-sm text-white/70">{solution.summary}</p>
                    </div>
                    <p className="text-sm text-white/60">{solution.tagline}</p>
                    <div className="flex flex-wrap gap-2 text-xs text-white/70">
                      {solution.focus.map((tag) => (
                        <span key={tag} className="rounded-full border border-white/15 px-3 py-1">
                          {tag}
                        </span>
                      ))}
                    </div>
                    <div className="flex flex-wrap gap-4 text-sm text-white">
                      {solution.stats.map((stat) => (
                        <div key={stat.label} className="rounded-2xl border border-white/10 px-3 py-2 text-center">
                          <p className="text-xl font-semibold text-white">{stat.value}</p>
                          <p className="text-xs uppercase tracking-[0.25em] text-white/60">{stat.label}</p>
                        </div>
                      ))}
                    </div>
                    <div>
                      <p className="text-xs uppercase tracking-[0.35em] text-white/50">How it helps</p>
                      <ul className="mt-2 space-y-1 text-sm text-white/70">
                        {solution.howItHelps.map((item) => (
                          <li key={item} className="flex gap-2">
                            <span className="text-white/60">•</span>
                            <span>{item}</span>
                          </li>
                        ))}
                      </ul>
                    </div>
                    <div className="text-xs uppercase tracking-[0.35em] text-white/50">Activation steps</div>
                    <ul className="space-y-1 text-sm text-white/70">
                      {solution.steps.map((step) => (
                        <li key={step} className="flex gap-2">
                          <span className="text-white/60">→</span>
                          <span>{step}</span>
                        </li>
                      ))}
                    </ul>
                    <div className="flex flex-wrap gap-3">
                      {solution.links.map((link) => (
                        <Link
                          key={link.href}
                          href={link.href}
                          className="inline-flex flex-1 items-center justify-center rounded-full border border-white/20 bg-white/10 px-4 py-2 text-sm font-semibold text-white transition hover:border-white hover:bg-white/20"
                        >
                          {link.label} →
                        </Link>
                      ))}
                    </div>
                  </div>
                ))}
              </div>
            )}
            {section.solutions.length === 0 && section.externalSolutions && (
              <div className="mt-10 grid gap-6 md:grid-cols-2">
                {section.externalSolutions.map((solution) => (
                  <div
                    key={solution.name}
                    className="flex flex-col gap-4 rounded-3xl border border-white/10 bg-white/5 p-6 text-white/85 shadow-[0_30px_80px_rgba(4,7,20,0.45)]"
                  >
                    <div>
                      <p className="text-xs uppercase tracking-[0.35em] text-white/60">recommended system</p>
                      <h4 className="mt-2 text-2xl font-semibold text-white">{solution.name}</h4>
                      <p className="mt-2 text-sm text-white/70">{solution.summary}</p>
                    </div>
                    <Link
                      href={solution.href}
                      className="inline-flex items-center justify-center rounded-full border border-white/20 bg-white/10 px-4 py-2 text-sm font-semibold text-white transition hover:border-white hover:bg-white/20"
                    >
                      Visit {solution.name} →
                    </Link>
                  </div>
                ))}
              </div>
            )}
          </div>
        </section>
      ))}

      <section className="border-t border-white/10 bg-neutral-950">
        <div className="mx-auto flex max-w-5xl flex-col items-center gap-6 px-6 py-20 text-center">
          <p className="text-sm uppercase tracking-[0.5em] text-white/50">Ready next</p>
          <h4 className="text-3xl font-semibold text-white">Keep the cinematic field engaged or jump straight into another problem.</h4>
          <div className="flex flex-col gap-4 w-full max-w-md">
            <Link
              href="/problems/missed-calls"
              className="rounded-full border border-white/20 bg-white/10 px-6 py-3 text-sm font-semibold text-white transition hover:border-white hover:bg-white/20"
            >
              Replay the missed calls canvas →
            </Link>
            <Link
              href="/problems"
              className="rounded-full border border-white/10 px-6 py-3 text-sm font-semibold text-white/80 transition hover:border-white/60 hover:text-white"
            >
              Explore another problem →
            </Link>
          </div>
        </div>
      </section>
    </main>
  );
}
