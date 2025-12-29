"use client";

import { motion } from "framer-motion";
import { useState } from "react";
import MedReceptionRevealGate from "@/components/MedReceptionRevealGate";
import type { Problem } from "@/data/problemRegistry";
import NextChoice from "./NextChoice";

export default function ReframeExperience({
  problem,
}: {
  problem: Problem;
}) {
  const [phase, setPhase] = useState<"intro" | "chaos" | "organize" | "clarity" | "choice">("intro");

  return (
    <div className="relative flex min-h-screen flex-col items-center justify-center overflow-hidden bg-black text-white">
      {phase === "intro" && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 0.8, ease: "easeOut" }}
          onAnimationComplete={() => setTimeout(() => setPhase("chaos"), 600)}
          className="text-sm uppercase tracking-[0.6em] text-white/40"
        >
          Some problems don’t announce themselves.
        </motion.div>
      )}

      {phase === "chaos" && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          onAnimationComplete={() => setTimeout(() => setPhase("organize"), 1400)}
          className="text-4xl text-white/60"
        >
          {problem.label}
        </motion.div>
      )}

      {phase === "organize" && (
        <motion.div
          initial={{ letterSpacing: "0.5em" }}
          animate={{ letterSpacing: "0.08em", opacity: 1 }}
          transition={{ duration: 1.4, ease: "easeOut" }}
          onAnimationComplete={() => setPhase("clarity")}
          className="text-4xl font-semibold"
        >
          {problem.label}
        </motion.div>
      )}

      {phase === "clarity" && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 0.75 }}
          transition={{ duration: 0.6 }}
          onAnimationComplete={() => setTimeout(() => setPhase("choice"), 800)}
          className="text-sm tracking-wide text-white/60"
        >
          Clarity doesn’t remove complexity. It organizes it.
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
