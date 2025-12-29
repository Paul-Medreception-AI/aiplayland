export type LaneSlug = "work" | "business" | "school" | "home" | "curiosity";

export type LaneContent = {
  slug: LaneSlug;
  choiceLabel: string;
  choiceMicro: string;
  heroHeadline: string;
  heroSubhead: string;
  summary: string;
  ctaLabel: string;
  ctaHref: string;
};

export const LANE_ORDER: LaneSlug[] = ["work", "business", "school", "home", "curiosity"];

export const LANE_CONTENT: Record<LaneSlug, LaneContent> = {
  work: {
    slug: "work",
    choiceLabel: "Work",
    choiceMicro: "emails · meetings · distractions",
    heroHeadline: "AI that keeps the day moving",
    heroSubhead: "From inbox triage to decision briefs in seconds.",
    summary: "See how teams remove the sludge between ideas and action.",
    ctaLabel: "Enter the work lane",
    ctaHref: "/work",
  },
  business: {
    slug: "business",
    choiceLabel: "Business",
    choiceMicro: "calls · staffing · chaos",
    heroHeadline: "Operational calm, on demand",
    heroSubhead: "AI that keeps leads warm, teams synced, and revenue visible.",
    summary: "Explore real automations that make companies feel lighter.",
    ctaLabel: "Visit the business lane",
    ctaHref: "/business",
  },
  school: {
    slug: "school",
    choiceLabel: "School",
    choiceMicro: "studying · focus · confidence",
    heroHeadline: "Learning that keeps up",
    heroSubhead: "Personal study allies, research copilots, and exam calmers.",
    summary: "Meet the AI workflows students actually lean on.",
    ctaLabel: "Walk the school lane",
    ctaHref: "/school",
  },
  home: {
    slug: "home",
    choiceLabel: "Home",
    choiceMicro: "time · energy · balance",
    heroHeadline: "Domestic autopilot mode",
    heroSubhead: "Delegating chores, schedules, and life admin to AI.",
    summary: "See the routines that give hours back every week.",
    ctaLabel: "Enter the home lane",
    ctaHref: "/home",
  },
  curiosity: {
    slug: "curiosity",
    choiceLabel: "Curiosity",
    choiceMicro: "because you felt something",
    heroHeadline: "Follow the signal",
    heroSubhead: "Explore the experiments and side quests that started here.",
    summary: "Proof that fun projects become serious influence.",
    ctaLabel: "Unlock the curiosity lane",
    ctaHref: "/curiosity",
  },
};
