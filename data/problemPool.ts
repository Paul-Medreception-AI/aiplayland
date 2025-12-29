import { PROBLEM_REGISTRY } from "@/data/problemRegistry";

export type ProblemPoolItem = {
  id: string;
  label: string;
  category: "business" | "cognitive" | "learning";
};

export type Problem = ProblemPoolItem;

export const PROBLEM_POOL: ProblemPoolItem[] = PROBLEM_REGISTRY.map((problem) => {
  const category: ProblemPoolItem["category"] =
    problem.lane === "business" ? "business" : problem.lane === "school" ? "learning" : "cognitive";

  return {
    id: problem.slug,
    label: problem.label,
    category,
  };
});
