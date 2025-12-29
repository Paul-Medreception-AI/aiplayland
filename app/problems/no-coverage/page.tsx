"use client";

import CinematicStory from "@/components/problems/CinematicStory";
import { getProblemConfig } from "@/data/problemConfigs";

const config = getProblemConfig("no-coverage");

export default function NoCoveragePage() {
  return (
    <CinematicStory
      slug="no-coverage"
      label="No Coverage"
      headline={config.title}
      sublines={[config.description, ...config.narrative]}
      primaryCtaLabel={config.primaryCtaLabel ?? "See how it gets handled"}
      primaryCtaHref={config.primaryCtaHref ?? `/problems/no-coverage/handle-it`}
      secondaryCtaLabel="Explore another problem"
      secondaryCtaHref="/problems"
    />
  );
}
