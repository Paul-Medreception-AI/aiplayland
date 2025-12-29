"use client";

import { motion } from "framer-motion";
import Link from "next/link";

export default function MedReceptionReveal({ href }: { href: string }) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 6 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.6, ease: "easeOut" }}
      className="mt-10 text-center text-sm text-white/60"
    >
      <p className="italic">Some teams don’t solve this manually anymore.</p>

      <Link
        href={href}
        className="mt-2 inline-block text-white/70 transition hover:text-white"
      >
        See how clinics handle this →
      </Link>
    </motion.div>
  );
}
