"use client";

import CinematicStory from "@/components/problems/CinematicStory";
import { getProblemConfig } from "@/data/problemConfigs";

const config = getProblemConfig("decision-fatigue");

export default function DecisionFatiguePage() {
  return (
    <CinematicStory
      slug="decision-fatigue"
      label="Decision Fatigue"
      headline={config.title}
      sublines={[config.description, ...config.narrative]}
      primaryCtaLabel={config.primaryCtaLabel ?? "See how it gets handled"}
      primaryCtaHref={config.primaryCtaHref ?? `/problems/decision-fatigue/handle-it`}
      secondaryCtaLabel="Explore another problem"
      secondaryCtaHref="/problems"
    />
  );
}

