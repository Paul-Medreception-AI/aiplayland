"use client";

import { motion } from "framer-motion";

type ProblemPageClientProps = {
  headline: string;
  subhead: string;
  description: string;
  whyItHurts: string[];
  whatAIChanges: string[];
  nextStepLabel: string;
};

export default function ProblemPageClient({
  headline,
  subhead,
  description,
  whyItHurts,
  whatAIChanges,
  nextStepLabel,
}: ProblemPageClientProps) {
  return (
    <div className="relative min-h-screen bg-black px-6 py-24 text-white">
      <div
        className="pointer-events-none absolute inset-0"
        style={{
          background: "radial-gradient(circle at 50% 30%, rgba(147,197,253,0.08), transparent 60%)",
        }}
      />

      <div className="relative z-10 mx-auto max-w-3xl">
        <motion.h1
          initial={{ opacity: 0, y: 24 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.7 }}
          className="text-4xl font-semibold tracking-tight md:text-5xl"
        >
          {headline}
        </motion.h1>

        <motion.p
          initial={{ opacity: 0, y: 18 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.7, delay: 0.1 }}
          className="mt-4 text-lg text-white/70"
        >
          {subhead}
        </motion.p>

        <p className="mt-8 text-white/80">{description}</p>

        <section className="mt-12">
          <h2 className="text-sm uppercase tracking-wide text-white/50">Why this hurts</h2>
          <ul className="mt-4 space-y-2">
            {whyItHurts.map((item) => (
              <li key={item} className="text-white/75">
                — {item}
              </li>
            ))}
          </ul>
        </section>

        <section className="mt-12">
          <h2 className="text-sm uppercase tracking-wide text-white/50">What AI changes</h2>
          <ul className="mt-4 space-y-2">
            {whatAIChanges.map((item) => (
              <li key={item} className="text-white/85">
                + {item}
              </li>
            ))}
          </ul>
        </section>

        <motion.div
          initial={{ opacity: 0, y: 18 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.25 }}
          className="mt-16"
        >
          <button className="rounded-2xl border border-white/20 bg-white/10 px-6 py-3 text-sm backdrop-blur hover:bg-white/15">
            {nextStepLabel}
          </button>
        </motion.div>
      </div>
    </div>
  );
}
