import LanePage from "@/components/LanePage";
import { LANE_CONTENT } from "@/data/lanes";

export const metadata = {
  title: "Home · AIPlayLand",
};

export default function HomeLanePage() {
  return <LanePage content={LANE_CONTENT.home} />;
}
