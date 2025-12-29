import LanePage from "@/components/LanePage";
import { LANE_CONTENT } from "@/data/lanes";

export const metadata = {
  title: "Business · AIPlayLand",
};

export default function BusinessPage() {
  return <LanePage content={LANE_CONTENT.business} />;
}
