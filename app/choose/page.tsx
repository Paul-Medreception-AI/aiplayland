"use client";

import { Suspense } from "react";
import Link from "next/link";
import { useSearchParams } from "next/navigation";
import { getRelatedProblems } from "@/lib/navigationLogic";

function ChoosePageInner() {
  const params = useSearchParams();
  const from = params.get("from");

  const options = getRelatedProblems(from);

  return (
    <div className="flex min-h-screen items-center justify-center bg-black px-6 text-white">
      <div className="w-full max-w-xl">
        <div className="mb-8 text-center">
          <div className="text-xs uppercase tracking-[0.28em] text-white/50">choose</div>
          <div className="mt-3 text-lg text-white/80">Pick what you want next.</div>
        </div>

        <div className="space-y-4">
          {options.map((p) => (
            <Link
              key={p.slug}
              href={`/problems/${p.slug}`}
              className="block rounded-xl border border-white/15 bg-white/5 p-4 transition hover:bg-white/10"
            >
              <div className="text-sm font-medium text-white/90">{p.label}</div>
              <div className="mt-1 text-[11px] tracking-wide text-white/50">from: {from ?? "—"}</div>
            </Link>
          ))}
        </div>

        <div className="mt-10 text-center text-[11px] tracking-wide text-white/45">You can always go back and choose again.</div>
      </div>
    </div>
  );
}

export default function ChoosePage() {
  return (
    <Suspense
      fallback={<div className="flex min-h-screen items-center justify-center bg-black px-6 text-white">Loading…</div>}
    >
      <ChoosePageInner />
    </Suspense>
  );
}
