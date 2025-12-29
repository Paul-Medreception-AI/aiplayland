"use client";

import { motion } from "framer-motion";
import { useState } from "react";
import MedReceptionRevealGate from "@/components/MedReceptionRevealGate";
import type { Problem } from "@/data/problemRegistry";
import NextChoice from "./NextChoice";

export default function DissolutionExperience({
  problem,
}: {
  problem: Problem;
}) {
  const [phase, setPhase] = useState<"words" | "melt" | "clean" | "choice">(
    "words",
  );

  return (
    <div className="relative flex min-h-screen flex-col items-center justify-center overflow-hidden bg-black text-white">
      {phase === "words" && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          onAnimationComplete={() => setTimeout(() => setPhase("melt"), 1200)}
          className="text-4xl font-semibold"
        >
          {problem.label}
        </motion.div>
      )}

      {phase === "melt" && (
        <motion.div
          initial={{ scale: 1, filter: "blur(0px)" }}
          animate={{ scale: 0.85, filter: "blur(18px)", opacity: 0 }}
          transition={{ duration: 1.2, ease: "easeInOut" }}
          onAnimationComplete={() => setPhase("clean")}
          className="text-4xl font-semibold"
        >
          {problem.label}
        </motion.div>
      )}

      {phase === "clean" && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 0.8 }}
          onAnimationComplete={() => setTimeout(() => setPhase("choice"), 1200)}
          className="text-sm tracking-wide text-white/60"
        >
          AI systems reorganizing…
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
