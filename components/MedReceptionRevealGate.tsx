"use client";

import { useEffect, useMemo, useState } from "react";
import MedReceptionReveal from "@/components/MedReceptionReveal";
import { loadMemory } from "@/lib/memory";
import { getCanonicalMedReceptionUrl, type Problem } from "@/data/problemRegistry";

const SESSION_KEY = "aiplayland_medreception_reveal_session_v1";
const MEDICAL_SIGNAL_THRESHOLD = 1.25;

export default function MedReceptionRevealGate({ problem }: { problem: Problem }) {
  const [shouldShow, setShouldShow] = useState(false);

  const canonicalUrl = useMemo(() => {
    if (problem.lane !== "business") return null;
    if (problem.medreceptionEligible === "no") return null;
    return getCanonicalMedReceptionUrl(problem.slug);
  }, [problem.slug, problem.lane, problem.medreceptionEligible]);

  useEffect(() => {
    if (!canonicalUrl) return;
    if (problem.lane !== "business") return;
    if (problem.medreceptionEligible === "no") return;

    const mem = loadMemory();
    if (mem.guideUses <= 0) return;
    if (mem.cumulativeMedicalSignal < MEDICAL_SIGNAL_THRESHOLD) return;

    const alreadyShown = typeof window !== "undefined" ? sessionStorage.getItem(SESSION_KEY) === "1" : false;
    if (alreadyShown) return;

    setShouldShow(true);
  }, [canonicalUrl, problem.lane, problem.medreceptionEligible]);

  useEffect(() => {
    if (!shouldShow) return;
    sessionStorage.setItem(SESSION_KEY, "1");
  }, [shouldShow]);

  if (!shouldShow || !canonicalUrl) return null;

  return <MedReceptionReveal href={canonicalUrl} />;
}
