export type Memory = {
  visitedProblems: string[];
  archetypeCounts: Record<string, number>;
  cumulativeMedicalSignal: number;
  guideUses: number;
  chooseUses: number;
  surpriseUses: number;
};

const KEY = "aiplayland_memory_v1";

export function loadMemory(): Memory {
  if (typeof window === "undefined") {
    return {
      visitedProblems: [],
      archetypeCounts: {},
      cumulativeMedicalSignal: 0,
      guideUses: 0,
      chooseUses: 0,
      surpriseUses: 0,
    };
  }

  try {
    const raw = localStorage.getItem(KEY);
    if (!raw) {
      return {
        visitedProblems: [],
        archetypeCounts: {},
        cumulativeMedicalSignal: 0,
        guideUses: 0,
        chooseUses: 0,
        surpriseUses: 0,
      };
    }

    const parsed = JSON.parse(raw) as Partial<Memory>;
    return {
      visitedProblems: Array.isArray(parsed.visitedProblems) ? parsed.visitedProblems : [],
      archetypeCounts: parsed.archetypeCounts && typeof parsed.archetypeCounts === "object" ? (parsed.archetypeCounts as Record<string, number>) : {},
      cumulativeMedicalSignal: typeof parsed.cumulativeMedicalSignal === "number" ? parsed.cumulativeMedicalSignal : 0,
      guideUses: typeof parsed.guideUses === "number" ? parsed.guideUses : 0,
      chooseUses: typeof parsed.chooseUses === "number" ? parsed.chooseUses : 0,
      surpriseUses: typeof parsed.surpriseUses === "number" ? parsed.surpriseUses : 0,
    };
  } catch {
    return {
      visitedProblems: [],
      archetypeCounts: {},
      cumulativeMedicalSignal: 0,
      guideUses: 0,
      chooseUses: 0,
      surpriseUses: 0,
    };
  }
}

export function saveMemory(mem: Memory) {
  if (typeof window === "undefined") return;
  localStorage.setItem(KEY, JSON.stringify(mem));
}

export function recordVisit(slug: string, archetype: string, medicalSignal: number) {
  const mem = loadMemory();
  const alreadyVisited = mem.visitedProblems.includes(slug);
  mem.visitedProblems = Array.from(new Set([...mem.visitedProblems, slug]));
  if (!alreadyVisited) {
    mem.cumulativeMedicalSignal += medicalSignal;
    mem.archetypeCounts[archetype] = (mem.archetypeCounts[archetype] || 0) + 1;
  }
  saveMemory(mem);
}

export function recordGuideUse() {
  const mem = loadMemory();
  mem.guideUses += 1;
  saveMemory(mem);
}

export function recordChooseUse() {
  const mem = loadMemory();
  mem.chooseUses += 1;
  saveMemory(mem);
}

export function recordSurpriseUse() {
  const mem = loadMemory();
  mem.surpriseUses += 1;
  saveMemory(mem);
}
