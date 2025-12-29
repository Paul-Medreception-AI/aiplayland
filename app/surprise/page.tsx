import { redirect } from "next/navigation";
import { getSurpriseProblem } from "@/lib/navigationLogic";

export default function SurprisePage({
  searchParams,
}: {
  searchParams?: { from?: string };
}) {
  const next = getSurpriseProblem(searchParams?.from);
  redirect(`/problems/${next}`);
}
