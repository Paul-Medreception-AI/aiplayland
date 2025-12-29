"use client";

import { Suspense } from "react";
import { useEffect } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import { getNextGuidedProblem } from "@/lib/navigationLogic";
import { loadMemory } from "@/lib/memory";

function GuidePageInner() {
  const router = useRouter();
  const params = useSearchParams();
  const from = params.get("from");

  useEffect(() => {
    const mem = loadMemory();
    const next = getNextGuidedProblem(from, mem);
    router.replace(`/problems/${next}`);
  }, [from, router]);

  return null;
}

export default function GuidePage() {
  return (
    <Suspense fallback={null}>
      <GuidePageInner />
    </Suspense>
  );
}
