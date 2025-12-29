"use client";

import Image from "next/image";
import Link from "next/link";
import { motion, useAnimation } from "framer-motion";
import { useEffect } from "react";
import { PROBLEM_REGISTRY } from "@/data/problemRegistry";
import { PROBLEM_PAGES } from "@/data/problemPages";

const problemCopy = PROBLEM_PAGES.reduce<Record<string, (typeof PROBLEM_PAGES)[number]>>(
  (acc, page) => {
    acc[page.slug] = page;
    return acc;
  },
  {},
);

const LANES: Record<string, string> = {
  business: "Business Operations",
  work: "Knowledge Work",
  personal: "Individual",
};

const problemsByLane = PROBLEM_REGISTRY.reduce<Record<string, typeof PROBLEM_REGISTRY>>((acc, problem) => {
  const lane = problem.lane ?? "business";
  if (!acc[lane]) {
    acc[lane] = [];
  }
  acc[lane].push(problem);
  return acc;
}, {});

Object.keys(problemsByLane).forEach((lane) => {
  problemsByLane[lane] = problemsByLane[lane].sort((a, b) => a.label.localeCompare(b.label));
});

type OrbPath = {
  id: string;
  initial: { left: string; top: string; rotate: number; scale?: number };
  entry: {
    left: string[];
    top: string[];
    rotate: number[];
    scale: number[];
    opacity: number[];
  };
  hover: {
    left: string[];
    top: string[];
    rotate: number[];
  };
  duration: number;
  delay: number;
  hoverDuration?: number;
};

const DEBUG_GRID = false;
const GRID_MARKS = Array.from({ length: 11 }, (_, i) => i * 10);

const ORB_PATHS: OrbPath[] = [
  {
    id: "left-orb",
    initial: { left: "15%", top: "12%", rotate: -6, scale: 0.52 },
    entry: {
      left: ["15%"],
      top: ["12%"],
      rotate: [-6],
      scale: [0.52],
      opacity: [1],
    },
    hover: {
      left: ["15%", "13%"],
      top: ["12%", "10%"],
      rotate: [-6, -8],
    },
    duration: 0.1,
    delay: 0,
    hoverDuration: 3,
  },
  {
    id: "right-orb",
    initial: { left: "58%", top: "12%", rotate: 6, scale: 0.52 },
    entry: {
      left: ["58%"],
      top: ["12%"],
      rotate: [6],
      scale: [0.52],
      opacity: [1],
    },
    hover: {
      left: ["58%", "60%"],
      top: ["12%", "10%"],
      rotate: [6, 8],
    },
    duration: 0.1,
    delay: 0,
    hoverDuration: 3,
  },
];

function AnimatedOrb({ config }: { config: OrbPath }) {
  const controls = useAnimation();

  useEffect(() => {
    const runSequence = async () => {
      await controls.start({
        left: config.entry.left,
        top: config.entry.top,
        rotate: config.entry.rotate,
        scale: config.entry.scale,
        opacity: config.entry.opacity,
        transition: {
          duration: config.duration,
          ease: "easeInOut",
          delay: config.delay,
          times: config.entry.left.map((_, idx) =>
            config.entry.left.length === 1 ? 0 : idx / (config.entry.left.length - 1),
          ),
        },
      });

      await controls.start({
        left: config.hover.left,
        top: config.hover.top,
        rotate: config.hover.rotate,
        transition: {
          duration: config.hoverDuration ?? 3.2,
          ease: "easeInOut",
          repeat: Infinity,
          repeatType: "reverse",
        },
      });
    };

    runSequence();
  }, [config, controls]);

  return (
    <motion.div
      initial={{
        left: config.initial.left,
        top: config.initial.top,
        rotate: config.initial.rotate,
        scale: config.initial.scale ?? 0.4,
        opacity: 0,
      }}
      animate={controls}
      className="absolute h-44 w-44 drop-shadow-[0_0_30px_rgba(255,255,255,0.45)]"
    >
      <Image src="/images/lightorb.png" alt="" fill sizes="176px" className="object-contain opacity-90" priority />
    </motion.div>
  );
}

function BouncingOrbs() {
  return (
    <div className="pointer-events-none absolute inset-0 z-20 overflow-hidden mix-blend-screen">
      {ORB_PATHS.map((orb) => (
        <AnimatedOrb key={orb.id} config={orb} />
      ))}
    </div>
  );
}

function DebugGrid() {
  return (
    <div className="pointer-events-none absolute inset-0 z-10">
      <div className="absolute inset-0 bg-[repeating-linear-gradient(90deg,rgba(255,255,255,0.08)_0,rgba(255,255,255,0.08)_1px,transparent_1px,transparent_4%)]" />
      <div className="absolute inset-0 bg-[repeating-linear-gradient(180deg,rgba(255,255,255,0.06)_0,rgba(255,255,255,0.06)_1px,transparent_1px,transparent_6%)]" />
      <div className="absolute inset-0 flex flex-col justify-between py-2 text-[10px] tracking-[0.2em] text-white/60">
        <div className="flex justify-between px-4">
          {GRID_MARKS.map((mark) => (
            <span key={`top-${mark}`} className="relative -translate-x-1/2">
              {mark}%
            </span>
          ))}
        </div>
        <div className="flex justify-between px-4 opacity-60">
          {GRID_MARKS.map((mark) => (
            <span key={`bottom-${mark}`} className="relative -translate-x-1/2">
              {mark}%
            </span>
          ))}
        </div>
      </div>
      <div className="absolute inset-y-0 left-1/2 w-px bg-white/30 opacity-60" />
    </div>
  );
}

export default function ProblemsLandingPage() {
  return (
    <main className="relative min-h-screen overflow-hidden bg-neutral-950 text-white">
      <nav className="mx-auto flex max-w-6xl items-center gap-2 px-6 pt-6 text-[11px] uppercase tracking-[0.3em] text-white/50">
        <Link href="/" className="transition hover:text-white">
          Home
        </Link>
        <span className="opacity-60">/</span>
        <span className="text-white">Problems</span>
      </nav>

      <section className="relative overflow-hidden border-b border-white/5 bg-gradient-to-b from-[#050d20] via-[#071330] to-[#050b18]">
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_top,_rgba(255,255,255,0.12),_transparent_65%)] opacity-60" />
        {DEBUG_GRID && <DebugGrid />}
        <BouncingOrbs />
        <div className="relative mx-auto flex max-w-6xl flex-col gap-8 px-6 py-20 lg:flex-row lg:items-end lg:justify-between">
          <div className="space-y-6 lg:max-w-3xl">
            <p className="text-xs uppercase tracking-[0.5em] text-white/60">Problem Field</p>
            <h1 className="text-4xl font-semibold leading-tight md:text-5xl">
              Every problem the AI systems can absorb right now.
            </h1>
            <p className="text-lg text-white/80">
              Click any problem to drop directly into its narrative experience.
            </p>
          </div>
          <div className="space-y-3 text-sm text-white/70">
            <p className="text-white">Fast links</p>
            <div className="flex flex-wrap gap-3">
              <Link
                href="/problems/missed-calls"
                className="rounded-full border border-white/20 px-4 py-2 text-xs uppercase tracking-[0.25em] text-white/80 transition hover:border-white hover:text-white"
              >
                Missed Calls
              </Link>
              <Link
                href="/problems/inbox-chaos"
                className="rounded-full border border-white/20 px-4 py-2 text-xs uppercase tracking-[0.25em] text-white/80 transition hover:border-white hover:text-white"
              >
                Inbox Chaos
              </Link>
              <Link
                href="/problems/no-study-partner"
                className="rounded-full border border-white/20 px-4 py-2 text-xs uppercase tracking-[0.25em] text-white/80 transition hover:border-white hover:text-white"
              >
                No Study Partner
              </Link>
            </div>
          </div>
        </div>
      </section>

      <section className="mx-auto max-w-6xl px-6 py-16">
        <div className="space-y-16">
          {Object.entries(problemsByLane).map(([lane, problems]) => (
            <div key={lane} className="space-y-6">
              <div className="flex flex-col gap-2">
                <p className="text-xs uppercase tracking-[0.4em] text-white/50">{LANES[lane] ?? lane}</p>
                <h2 className="text-2xl font-semibold">{problems.length} live problem{problems.length > 1 ? "s" : ""}</h2>
                <p className="text-sm text-white/60">
                  {lane === "business"
                    ? "Business operations, client access, and phone chaos."
                    : lane === "work"
                      ? "Creative and knowledge work friction points."
                      : "Personal focus problems the AI field can absorb."}
                </p>
              </div>

              <div className="grid gap-6 md:grid-cols-2">
                {problems.map((problem) => {
                  const copy = problemCopy[problem.slug];
                  return (
                    <motion.article
                      key={problem.slug}
                      whileHover={{ y: -4, opacity: 1 }}
                      className="relative flex h-full flex-col rounded-3xl border border-white/15 bg-gradient-to-br from-white/10 via-white/[0.07] to-transparent/5 p-6 text-white/90 shadow-[0_30px_80px_rgba(6,12,30,0.35)] backdrop-blur transition"
                    >
                      <div className="flex items-center justify-between">
                        <p className="text-xs uppercase tracking-[0.4em] text-white/60">{problem.archetype ?? "Flow"}</p>
                        <span className="rounded-full border border-white/20 bg-white/10 px-3 py-1 text-xs text-white/80">
                          {problem.lane ?? "all"}
                        </span>
                      </div>
                      <h3 className="mt-4 text-2xl font-semibold text-white">{problem.label}</h3>
                      <p className="mt-3 text-sm leading-relaxed text-white/80">
                        {copy?.description ?? "Narrative coming online soon. Hit the orb anyway—we’ll still walk you through it."}
                      </p>
                      {(copy?.whyItHurts?.length ?? 0) > 0 && (
                        <ul className="mt-4 space-y-1 text-xs text-white/70">
                          {copy!.whyItHurts!.slice(0, 3).map((item) => (
                            <li key={item} className="flex items-center gap-2">
                              <span className="h-1.5 w-1.5 rounded-full bg-white/60" />
                              <span>{item}</span>
                            </li>
                          ))}
                        </ul>
                      )}
                      <div className="mt-6 flex flex-wrap gap-3 text-sm">
                        <Link
                          href={`/problems/${problem.slug}`}
                          className="inline-flex items-center rounded-full border border-white/30 bg-white/10 px-4 py-2 font-semibold text-white transition hover:border-white hover:bg-white/20"
                        >
                          Enter experience →
                        </Link>
                        {problem.slug === "missed-calls" && (
                          <Link
                            href="/problems/missed-calls/handle-it"
                            className="inline-flex items-center rounded-full border border-white/20 px-4 py-2 text-white/85 transition hover:border-white hover:text-white"
                          >
                            Handle it playbook →
                          </Link>
                        )}
                      </div>
                    </motion.article>
                  );
                })}
              </div>
            </div>
          ))}
        </div>
      </section>

      <section className="border-t border-white/10 bg-neutral-950">
        <div className="mx-auto flex max-w-4xl flex-col items-center gap-6 px-6 py-20 text-center">
          <p className="text-xs uppercase tracking-[0.5em] text-white/50">Need a new problem captured?</p>
          <h3 className="text-3xl font-semibold text-white">Drop it into the field. We’ll film a new experience within 48 hours.</h3>
          <Link
            href="/contact"
            className="rounded-full border border-white px-6 py-3 text-sm font-semibold text-white transition hover:bg-white hover:text-neutral-900"
          >
            Submit a problem →
          </Link>
        </div>
      </section>
    </main>
  );
}
