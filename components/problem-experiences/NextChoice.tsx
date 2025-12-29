"use client";

import { motion } from "framer-motion";
import { useRouter } from "next/navigation";
import { recordChooseUse, recordGuideUse, recordSurpriseUse } from "@/lib/memory";

export default function NextChoice({
  fromSlug,
}: {
  fromSlug: string;
}) {
  const router = useRouter();

  function go(choice: "guide" | "choose" | "surprise") {
    if (choice === "guide") recordGuideUse();
    if (choice === "choose") recordChooseUse();
    if (choice === "surprise") recordSurpriseUse();
    router.push(`/${choice}?from=${fromSlug}`);
  }

  const options = ["Guide", "Choose", "Surprise"] as const;

  return (
    <div className="mt-16 flex justify-center gap-10 text-sm tracking-[0.3em] uppercase">
      {options.map((opt) => (
        <motion.div
          key={opt}
          whileHover={{
            opacity: 1,
            scale: 1.05,
            textShadow: "0 0 14px rgba(147,197,253,0.35)",
          }}
          initial={{ opacity: 0.6 }}
          transition={{ duration: 0.3 }}
          className="cursor-pointer select-none"
          onClick={() => go(opt.toLowerCase() as any)}
        >
          {opt}
        </motion.div>
      ))}
    </div>
  );
}
