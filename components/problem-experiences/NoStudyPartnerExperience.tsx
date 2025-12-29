"use client";

import { AnimatePresence, motion } from "framer-motion";
import { useMemo, useState } from "react";
import type { Problem } from "@/data/problemRegistry";
import NextChoice from "./NextChoice";

type StageKey = "drift" | "sync" | "momentum";

const STAGES: Record<
  StageKey,
  {
    label: string;
    title: string;
    body: string[];
    diagnostics: Array<{ label: string; value: string }>;
    feed: string[];
  }
> = {
  drift: {
    label: "Drift",
    title: "Studying alone feels quiet, but the signal is weak.",
    body: [
      "Without another brain to ping ideas off, everything stays theoretical.",
      "You open the doc, scroll, tell yourself you’ll start after the next notification.",
      "Hours pass. Nothing sticks.",
    ],
    diagnostics: [
      { label: "focus decay", value: "after 12 minutes" },
      { label: "practice loops", value: "0 completed" },
      { label: "questions captured", value: "1 / 7" },
    ],
    feed: [
      "12:04 — stared at the same paragraph again",
      "12:18 — googled a shortcut answer",
      "12:33 — decided to “review tomorrow”",
    ],
  },
  sync: {
    label: "Sync",
    title: "AI steps in as a study partner that never looks at the clock.",
    body: [
      "It mirrors the cadence of a good partner: asks what you’re trying to prove, offers the next prompt only when you respond.",
      "When you drift, it pauses and nudges you back with a question, not a lecture.",
      "Your thinking moves from silent to conversational again.",
    ],
    diagnostics: [
      { label: "focus decay", value: "after 42 minutes" },
      { label: "practice loops", value: "3 completed" },
      { label: "questions captured", value: "7 / 7" },
    ],
    feed: [
      "12:06 — “Walk me through how you’d set up the proof.”",
      "12:17 — “Pause. Where could the error hide?”",
      "12:28 — “Switch roles. You quiz me.”",
    ],
  },
  momentum: {
    label: "Momentum",
    title: "The work stops feeling like punishment.",
    body: [
      "You leave the session with notes already organized, misconceptions flagged, and the next block queued.",
      "Momentum compounds because you aren’t spending energy figuring out how to start.",
      "It isn’t hype. It’s steady rhythm.",
    ],
    diagnostics: [
      { label: "confidence delta", value: "+38%" },
      { label: "retention checks", value: "passed" },
      { label: "next block", value: "scheduled" },
    ],
    feed: [
      "12:44 — summary auto-generated",
      "12:46 — follow-up deck queued",
      "12:48 — break scheduled, return plan locked",
    ],
  },
};

export default function NoStudyPartnerExperience({ problem }: { problem: Problem }) {
  const [stage, setStage] = useState<StageKey>("drift");
  const stageOrder = useMemo(() => Object.keys(STAGES) as StageKey[], []);
  const data = STAGES[stage];

  return (
    <div className="relative min-h-screen overflow-hidden bg-black text-white">
      <div
        className="pointer-events-none absolute inset-0 opacity-70"
        style={{
          background:
            "radial-gradient(circle at 30% 20%, rgba(125,211,252,0.18), transparent 60%), radial-gradient(circle at 70% 60%, rgba(59,130,246,0.22), transparent 65%)",
        }}
      />

      <div className="relative z-10 mx-auto flex min-h-screen max-w-5xl flex-col gap-12 px-6 py-16">
        <header>
          <p className="text-xs uppercase tracking-[0.55em] text-white/50">guided experience</p>
          <h1 className="mt-6 text-4xl font-semibold tracking-tight sm:text-5xl">{problem.label}</h1>
          <p className="mt-4 max-w-2xl text-base text-white/70 sm:text-lg">
            You don’t need another flashcard deck. You need the feeling of someone keeping pace with you. So we built
            an AI partner that behaves like the friend who refused to let you coast.
          </p>
        </header>

        <div className="flex flex-wrap gap-3 text-xs uppercase tracking-[0.35em] text-white/55">
          {stageOrder.map((key) => (
            <button
              key={key}
              type="button"
              onClick={() => setStage(key)}
              className={`rounded-full border px-4 py-2 transition ${
                stage === key
                  ? "border-white/90 bg-white/10 text-white"
                  : "border-white/15 bg-white/0 text-white/55 hover:border-white/35 hover:text-white/80"
              }`}
            >
              {STAGES[key].label}
            </button>
          ))}
        </div>

        <AnimatePresence mode="wait">
          <motion.section
            key={stage}
            initial={{ opacity: 0, y: 12 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -12 }}
            transition={{ duration: 0.5, ease: "easeOut" }}
            className="grid gap-8 rounded-3xl border border-white/10 bg-white/5 p-8 backdrop-blur lg:grid-cols-[3fr_2fr]"
          >
            <div>
              <p className="text-sm uppercase tracking-[0.4em] text-white/50">State</p>
              <h2 className="mt-2 text-2xl font-semibold tracking-tight text-white">{data.title}</h2>
              <ul className="mt-6 space-y-4 text-base text-white/70">
                {data.body.map((line) => (
                  <li key={line} className="flex items-start gap-3">
                    <span className="mt-2 h-[6px] w-[6px] rounded-full bg-white/60" />
                    <span>{line}</span>
                  </li>
                ))}
              </ul>
            </div>

            <div className="space-y-6">
              <div className="rounded-2xl border border-white/10 bg-black/30 p-5 shadow-[0_0_20px_rgba(96,165,250,0.25)]">
                <p className="text-xs uppercase tracking-[0.35em] text-white/45">Live diagnostics</p>
                <div className="mt-4 space-y-3">
                  {data.diagnostics.map((item) => (
                    <div key={item.label} className="flex items-center justify-between text-sm text-white/75">
                      <span className="text-white/55">{item.label}</span>
                      <span className="font-mono text-white">{item.value}</span>
                    </div>
                  ))}
                </div>
              </div>

              <div className="rounded-2xl border border-white/10 bg-black/30 p-5">
                <p className="text-xs uppercase tracking-[0.35em] text-white/45">Session feed</p>
                <div className="mt-4 space-y-3 text-sm text-white/75">
                  {data.feed.map((entry) => (
                    <p key={entry} className="font-mono text-xs sm:text-sm">
                      {entry}
                    </p>
                  ))}
                </div>
              </div>
            </div>
          </motion.section>
        </AnimatePresence>

        <div className="mt-auto flex flex-col items-center gap-8 pb-10">
          <p className="text-center text-sm text-white/60">
            When you leave, everything is already organized for the next session. That’s the “partner” part.
          </p>
          <NextChoice fromSlug={problem.slug} />
        </div>
      </div>
    </div>
  );
}
