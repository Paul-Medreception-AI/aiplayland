"use client";

import { useEffect } from "react";
import { recordVisit } from "@/lib/memory";

export default function ProblemVisitRecorder({
  slug,
  archetype,
  medicalSignal,
}: {
  slug: string;
  archetype: string;
  medicalSignal: number;
}) {
  useEffect(() => {
    recordVisit(slug, archetype, medicalSignal);
  }, [slug, archetype, medicalSignal]);

  return null;
}
