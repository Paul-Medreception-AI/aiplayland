"use client";

import CinematicStory from "@/components/problems/CinematicStory";
import { getProblemConfig } from "@/data/problemConfigs";

const config = getProblemConfig("overbooking");

export default function OverbookingPage() {
  return (
    <CinematicStory
      slug="overbooking"
      label="Overbooking"
      headline={config.title}
      sublines={[config.description, ...config.narrative]}
      primaryCtaLabel={config.primaryCtaLabel ?? "See how it gets handled"}
      primaryCtaHref={config.primaryCtaHref ?? `/problems/overbooking/handle-it`}
      secondaryCtaLabel="Explore another problem"
      secondaryCtaHref="/problems"
    />
  );
}
