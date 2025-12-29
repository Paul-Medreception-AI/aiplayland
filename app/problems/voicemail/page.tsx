"use client";

import CinematicStory from "@/components/problems/CinematicStory";
import { getProblemConfig } from "@/data/problemConfigs";

const config = getProblemConfig("voicemail");

export default function VoicemailPage() {
  return (
    <CinematicStory
      slug="voicemail"
      label="Voicemail Backlog"
      headline={config.title}
      sublines={[config.description, ...config.narrative]}
      primaryCtaLabel={config.primaryCtaLabel ?? "See how it gets handled"}
      primaryCtaHref={config.primaryCtaHref ?? `/problems/voicemail/handle-it`}
      secondaryCtaLabel="Explore another problem"
      secondaryCtaHref="/problems"
    />
  );
}
