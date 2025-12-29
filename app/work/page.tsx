import LanePage from "@/components/LanePage";
import { LANE_CONTENT } from "@/data/lanes";

export const metadata = {
  title: "Work · AIPlayLand",
};

export default function WorkPage() {
  return <LanePage content={LANE_CONTENT.work} />;
}
