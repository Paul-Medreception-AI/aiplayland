"use client";

import { AnimatePresence, motion } from "framer-motion";
import Link from "next/link";
import { useMemo, useState } from "react";
import type { Problem } from "@/data/problemRegistry";

type StageKey = "calibrate" | "pair" | "accelerate";

const STAGES: Record<
  StageKey,
  {
    label: string;
    headline: string;
    body: string[];
    metrics: Array<{ label: string; value: string }>;
    feed: string[];
  }
> = {
  calibrate: {
    label: "Calibrate",
    headline: "Start with the signal, not the syllabus.",
    body: [
      "We sample how you explain a concept, where you stall, and how you correct yourself.",
      "A quick cadence of prompts surfaces the gaps faster than another silent reread.",
      "The session adapts to your pace instead of punishing you for slowing down.",
    ],
    metrics: [
      { label: "focus drop-off", value: "12 → 32 min" },
      { label: "cold starts", value: "cut by 68%" },
      { label: "notes captured", value: "auto" },
    ],
    feed: [
      "00:01 — “Explain it in 3 sentences.”",
      "00:04 — pause detected → slowed prompts",
      "00:07 — gap tagged: definitions vs. examples",
    ],
  },
  pair: {
    label: "Pair",
    headline: "An AI partner that behaves like the person who keeps you honest.",
    body: [
      "It alternates roles—sometimes you teach, sometimes you’re quizzed, sometimes you critique.",
      "If you drift, it asks you to prove a step instead of dumping an answer.",
      "You get the tension of a real partner without waiting on a text back.",
    ],
    metrics: [
      { label: "loop count", value: "3 full cycles" },
      { label: "micro-errors caught", value: "11" },
      { label: "confidence delta", value: "+34%" },
    ],
    feed: [
      "00:12 — “Switch: I’ll answer, you critique.”",
      "00:16 — error surfaced: skipped assumption",
      "00:19 — “Your turn. Prove the inverse.”",
    ],
  },
  accelerate: {
    label: "Accelerate",
    headline: "Momentum is what you keep—not what you start.",
    body: [
      "Summaries write themselves while you’re still in the session.",
      "Next block is scheduled, with questions you missed up front.",
      "You leave with a plan you don’t have to renegotiate tomorrow.",
    ],
    metrics: [
      { label: "retention checks", value: "passed" },
      { label: "return plan", value: "locked" },
      { label: "handoff", value: "calendar + notes" },
    ],
    feed: [
      "00:24 — summary drafted",
      "00:25 — follow-up prompts queued",
      "00:26 — break scheduled, return invite sent",
    ],
  },
};

export default function StudyPartnerExperience({ problem }: { problem: Problem }) {
  const [stage, setStage] = useState<StageKey>("calibrate");
  const stageOrder = useMemo(() => Object.keys(STAGES) as StageKey[], []);
  const data = STAGES[stage];

  return (
    <div className="relative min-h-screen overflow-hidden bg-black text-white">
      <div
        className="pointer-events-none absolute inset-0 opacity-70"
        style={{
          background:
            "radial-gradient(circle at 25% 20%, rgba(125,211,252,0.18), transparent 60%), radial-gradient(circle at 70% 65%, rgba(59,130,246,0.22), transparent 65%)",
        }}
      />

      <div className="relative z-10 mx-auto flex min-h-screen max-w-5xl flex-col gap-12 px-6 py-16">
        <header>
          <p className="text-xs uppercase tracking-[0.55em] text-white/50">guided experience</p>
          <h1 className="mt-6 text-4xl font-semibold tracking-tight sm:text-5xl">{problem.label}</h1>
          <p className="mt-4 max-w-2xl text-base text-white/70 sm:text-lg">
            Studying alone stalls momentum. This is how the AI partner keeps you moving: calibrate the signal, act like
            a partner, then lock momentum so you don’t start from zero tomorrow.
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
              <h2 className="mt-2 text-2xl font-semibold tracking-tight text-white">{data.headline}</h2>
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
                  {data.metrics.map((item) => (
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
          <Link
            href="/contact"
            className="rounded-full border border-white/20 bg-white/10 px-6 py-3 text-sm font-semibold uppercase tracking-[0.3em] text-white hover:bg-white/20"
          >
            Talk to the team
          </Link>
        </div>
      </div>
    </div>
  );
}
