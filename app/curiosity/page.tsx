import LanePage from "@/components/LanePage";
import { LANE_CONTENT } from "@/data/lanes";

export const metadata = {
  title: "Curiosity · AIPlayLand",
};

export default function CuriosityPage() {
  return <LanePage content={LANE_CONTENT.curiosity} />;
}
