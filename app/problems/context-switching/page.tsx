"use client";

import CinematicStory from "@/components/problems/CinematicStory";
import { getProblemConfig } from "@/data/problemConfigs";

const config = getProblemConfig("context-switching");

export default function ContextSwitchingPage() {
  return (
    <CinematicStory
      slug="context-switching"
      label="Context Switching"
      headline={config.title}
      sublines={[config.description, ...config.narrative]}
      primaryCtaLabel={config.primaryCtaLabel ?? "See how it gets handled"}
      primaryCtaHref={config.primaryCtaHref ?? `/problems/context-switching/handle-it`}
      secondaryCtaLabel="Explore another problem"
      secondaryCtaHref="/problems"
    />
  );
}
