import LanePage from "@/components/LanePage";
import { LANE_CONTENT } from "@/data/lanes";

export const metadata = {
  title: "School · AIPlayLand",
};

export default function SchoolPage() {
  return <LanePage content={LANE_CONTENT.school} />;
}
