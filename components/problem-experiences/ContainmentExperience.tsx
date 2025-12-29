"use client";

import { motion } from "framer-motion";
import { useState } from "react";
import MedReceptionRevealGate from "@/components/MedReceptionRevealGate";
import type { Problem } from "@/data/problemRegistry";
import NextChoice from "./NextChoice";

export default function ContainmentExperience({
  problem,
}: {
  problem: Problem;
}) {
  const [phase, setPhase] = useState<"alert" | "contain" | "stable" | "choice">(
    "alert",
  );

  return (
    <div className="relative flex min-h-screen flex-col items-center justify-center overflow-hidden bg-black text-white">
      {phase === "alert" && (
        <motion.div
          initial={{ scale: 0.9, opacity: 0 }}
          animate={{ scale: 1, opacity: 1 }}
          onAnimationComplete={() => setTimeout(() => setPhase("contain"), 1000)}
          className="text-4xl font-semibold text-red-400"
        >
          {problem.label}
        </motion.div>
      )}

      {phase === "contain" && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 0.8 }}
          onAnimationComplete={() => setTimeout(() => setPhase("stable"), 1200)}
          className="text-sm tracking-wide text-white/60"
        >
          Containing risk…
        </motion.div>
      )}

      {phase === "stable" && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 0.8 }}
          transition={{ duration: 0.6 }}
          onAnimationComplete={() => setTimeout(() => setPhase("choice"), 800)}
          className="text-sm tracking-wide text-white/60"
        >
          Stability restored.
        </motion.div>
      )}

      {phase === "choice" && (
        <>
          <MedReceptionRevealGate problem={problem} />
          <NextChoice fromSlug={problem.slug} />
        </>
      )}
    </div>
  );
}
