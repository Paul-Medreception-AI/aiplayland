import { PROBLEM_REGISTRY, type Problem } from "@/data/problemRegistry";
import type { Memory } from "@/lib/memory";

type MemorySnapshot = Memory;

function registryList(): Problem[] {
  return [...PROBLEM_REGISTRY];
}

export function getNextGuidedProblem(from: string | null | undefined, mem?: Memory) {
  const list = registryList().sort((a, b) => a.slug.localeCompare(b.slug));
  const current = from ? list.find((p) => p.slug === from) : undefined;

  if (!current) return list[0]?.slug ?? "missed-calls";

  const visited = new Set(mem?.visitedProblems ?? []);
  const cumulative = mem?.cumulativeMedicalSignal ?? 0;

  const candidates = list.filter((p) => p.slug !== current.slug);

  const scored = candidates
    .map((p) => {
      let score = 0;

      if (p.archetype === current.archetype) score += 100;
      if (!visited.has(p.slug)) score += 35;
      if (visited.has(p.slug)) score -= 120;

      if (cumulative >= 1.0) {
        if (p.lane === "business") score += 25;
        score += Math.round(p.medicalSignal * 40);
      }

      if (p.lane === current.lane) score += 6;

      return { slug: p.slug, score };
    })
    .sort((a, b) => (b.score !== a.score ? b.score - a.score : a.slug.localeCompare(b.slug)));

  return scored[0]?.slug ?? current.slug;
}

export function getRelatedProblems(from: string | null | undefined): Problem[] {
  const list = registryList().sort((a, b) => a.slug.localeCompare(b.slug));
  const current = from ? list.find((p) => p.slug === from) : undefined;

  if (!current) return list.slice(0, 5);

  return list
    .filter((p) => p.slug !== current.slug)
    .filter((p) => p.archetype === current.archetype || p.lane === current.lane)
    .slice(0, 5);
}

function hashString(input: string) {
  let h = 2166136261;
  for (let i = 0; i < input.length; i += 1) {
    h ^= input.charCodeAt(i);
    h = Math.imul(h, 16777619);
  }
  return h >>> 0;
}

export function getSurpriseProblem(from: string | null | undefined) {
  const list = registryList().sort((a, b) => a.slug.localeCompare(b.slug));
  const current = from ? list.find((p) => p.slug === from) : undefined;

  const candidates = list.filter((p) => (current ? p.archetype !== current.archetype : true));

  if (candidates.length === 0) return list[0]?.slug ?? "missed-calls";

  const seed = hashString(`${from ?? ""}::surprise`);
  const idx = seed % candidates.length;
  return candidates[idx].slug;
}
