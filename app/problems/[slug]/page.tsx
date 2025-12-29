import { notFound } from "next/navigation";
import { PROBLEM_PAGES, type ProblemPage } from "@/data/problemPages";
import { PROBLEM_REGISTRY, getProblemBySlug, type Problem } from "@/data/problemRegistry";
import CinematicProblemExperience from "@/components/problems/CinematicProblemExperience";
import LostLeadsPage from "../lost-leads/page";
import AfterHoursPanicPage from "../after-hours-panic/page";
import DecisionFatiguePage from "../decision-fatigue/page";
import VoicemailPage from "../voicemail/page";
import OverbookingPage from "../overbooking/page";
import SchedulingChaosPage from "../scheduling-chaos/page";
import ManualFollowupsPage from "../manual-followups/page";
import InboxChaosPage from "../inbox-chaos/page";
import ContextSwitchingPage from "../context-switching/page";
import FocusDriftPage from "../focus-drift/page";
import MentalLoadPage from "../mental-load/page";
import TooManyTabsPage from "../too-many-tabs/page";
import AIConfusionPage from "../ai-confusion/page";
import LearningOverloadPage from "../learning-overload/page";
import FallingBehindPage from "../falling-behind/page";
import HomeworkStressPage from "../homework-stress/page";
import TestAnxietyPage from "../test-anxiety/page";
import NoStudyPartnerPage from "../no-study-partner/page";
import StaffBurnoutPage from "../staff-burnout/page";
import BurnoutRiskPage from "../burnout-risk/page";
import EmergencyCallsPage from "../emergency-calls/page";
import StaffingGapsPage from "../staffing-gaps/page";
import NoCoveragePage from "../no-coverage/page";

type ProblemPageProps = {
  params: { slug: string };
};

export function generateStaticParams() {
  return PROBLEM_REGISTRY.map((problem) => ({ slug: problem.slug }));
}

export default function ProblemPage({ params }: ProblemPageProps) {
  const problem = getProblemBySlug(params.slug);
  if (!problem) {
    notFound();
  }

  if (problem.slug === "lost-leads") {
    return <LostLeadsPage />;
  }

  if (problem.slug === "after-hours-panic") {
    return <AfterHoursPanicPage />;
  }

  if (problem.slug === "decision-fatigue") {
    return <DecisionFatiguePage />;
  }

  if (problem.slug === "voicemail" || problem.slug === "voicemail-backlog") {
    return <VoicemailPage />;
  }

  if (problem.slug === "overbooking") {
    return <OverbookingPage />;
  }

  if (problem.slug === "scheduling-chaos") {
    return <SchedulingChaosPage />;
  }

  if (problem.slug === "manual-followups") {
    return <ManualFollowupsPage />;
  }

  if (problem.slug === "inbox-chaos") {
    return <InboxChaosPage />;
  }

  if (problem.slug === "context-switching") {
    return <ContextSwitchingPage />;
  }

  if (problem.slug === "focus-drift") {
    return <FocusDriftPage />;
  }

  if (problem.slug === "mental-load") {
    return <MentalLoadPage />;
  }

  if (problem.slug === "too-many-tabs") {
    return <TooManyTabsPage />;
  }

  if (problem.slug === "ai-confusion" || problem.slug === "overwhelmed-by-ai") {
    return <AIConfusionPage />;
  }

  if (problem.slug === "learning-overload" || problem.slug === "too-much-to-learn") {
    return <LearningOverloadPage />;
  }

  if (problem.slug === "falling-behind") {
    return <FallingBehindPage />;
  }

  if (problem.slug === "homework-stress") {
    return <HomeworkStressPage />;
  }

  if (problem.slug === "test-anxiety") {
    return <TestAnxietyPage />;
  }

  if (problem.slug === "no-study-partner") {
    return <NoStudyPartnerPage />;
  }

  if (problem.slug === "staff-burnout") {
    return <StaffBurnoutPage />;
  }

  if (problem.slug === "burnout-risk") {
    return <BurnoutRiskPage />;
  }

  if (problem.slug === "emergency-calls") {
    return <EmergencyCallsPage />;
  }

  if (problem.slug === "staffing-gaps") {
    return <StaffingGapsPage />;
  }

  if (problem.slug === "no-coverage") {
    return <NoCoveragePage />;
  }

  const content = PROBLEM_PAGES.find((page) => page.slug === problem.slug) ?? createFallbackContent(problem);
  return <CinematicProblemExperience problem={problem} pageContent={content} />;
}

function createFallbackContent(problem: Problem): ProblemPage {
  return {
    slug: problem.slug,
    label: problem.label,
    lane: problem.lane,
    headline: `${problem.label} needs a new playbook.`,
    subhead: "Let’s reprogram how this gets handled.",
    description: `Right now ${problem.label.toLowerCase()} drags teams away from real work. That stops here.`,
    whyItHurts: [
      "It drains focus",
      "Customers lose patience",
      "The signal gets buried",
    ],
    whatAIChanges: ["AI absorbs the noise", "Escalations arrive prepared", "Leaders get clarity"],
    nextStepLabel: "see how it gets handled",
  };
}
