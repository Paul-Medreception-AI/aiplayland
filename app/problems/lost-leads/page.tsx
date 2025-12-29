"use client";

import React, { useEffect, useRef, useState } from "react";
import { motion } from "framer-motion";
import Link from "next/link";

type Phase = 1 | 2 | 3 | 4 | 5 | 6 | 7;

const HERO_HEADLINE = "When interest doesn’t evaporate after hours.";
const SUBLINES = [
  "Every inquiry is captured, acknowledged, and progressed—even when no one is at the desk.",
  "Leads stop slipping through the cracks, urgency is recognized, and the outreach happens automatically.",
  "Prospective clients get immediate confirmation so the relationship doesn’t go cold overnight.",
  "Your team only steps in when momentum really needs a human.",
];

export default function LostLeadsPage() {
  const canvasRef = useRef<HTMLCanvasElement | null>(null);
  const rings = useRef<{ r: number; alpha: number; speed: number }[]>([]);
  const orbs = useRef<{ angle: number; radius: number; r: number; drift: number; wobble: number }[]>([]);
  const orbImage = useRef<HTMLImageElement | null>(null);
  const sizeRef = useRef<{ w: number; h: number; dpr: number }>({ w: 0, h: 0, dpr: 1 });
  const orbReady = useRef(false);
  const raf = useRef<number | null>(null);
  const orbitTimerRef = useRef<number | null>(null);
  const waitingOrbitRef = useRef(false);
  const [phase, setPhase] = useState<Phase>(1);

  const spawnOrbs = (count = 4) => {
    orbs.current = Array.from({ length: count }, (_, i) => {
      const baseRadius = 320 + Math.random() * 120;
      const angle = (i / count) * Math.PI * 2 + Math.random() * 0.6;
      return {
        angle,
        radius: baseRadius,
        r: 48 + Math.random() * 22,
        drift: 0.15 + Math.random() * 0.05,
        wobble: 18 + Math.random() * 10,
      };
    });
  };

  useEffect(() => {
    const timeline: [Phase, number][] = [
      [1, 2000],
      [2, 2000],
      [3, 2000],
      [4, 1600],
      [5, 1000],
      [6, 2000],
      [7, 0],
    ];

    let idx = 0;
    const advance = () => {
      if (timeline[idx][1] === 0) return;
      setTimeout(() => {
        idx += 1;
        setPhase(timeline[idx][0]);
        advance();
      }, timeline[idx][1]);
    };
    advance();
  }, []);

  useEffect(() => {
    if (phase < 3) {
      if (orbitTimerRef.current) {
        clearTimeout(orbitTimerRef.current);
        orbitTimerRef.current = null;
      }
      waitingOrbitRef.current = false;
      orbs.current = [];
    }

    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext("2d");
    if (!ctx) return;

    const img = new Image();
    img.onload = () => {
      orbReady.current = true;
    };
    img.onerror = () => {
      orbReady.current = false;
    };
    img.src = "/images/lightorb.png?v=1";
    orbImage.current = img;

    const resize = () => {
      const dpr = Math.max(1, Math.min(2, window.devicePixelRatio || 1));
      const w = window.innerWidth;
      const h = window.innerHeight;
      sizeRef.current = { w, h, dpr };
      canvas.width = Math.floor(w * dpr);
      canvas.height = Math.floor(h * dpr);
      canvas.style.width = `${w}px`;
      canvas.style.height = `${h}px`;
    };
    resize();
    window.addEventListener("resize", resize);

    const spawnRing = () => {
      rings.current.push({ r: 0, alpha: 0.12, speed: 0.8 + Math.random() });
    };

    let last = performance.now();
    const loop = (time: number) => {
      const dt = time - last;
      last = time;
      const { w, h, dpr } = sizeRef.current;
      ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
      ctx.clearRect(0, 0, w, h);

      if (phase >= 2 && Math.random() < 0.15) spawnRing();

      rings.current.forEach((ring, i) => {
        const slowFactor = phase >= 5 ? 0.35 : phase >= 3 ? 0.65 : 1;
        ring.r += ring.speed * dt * slowFactor;
        ring.alpha *= phase >= 2 ? 0.987 : 0.993;
        ctx.beginPath();
        ctx.arc(w / 2, h / 2, ring.r, 0, Math.PI * 2);
        ctx.strokeStyle = `rgba(255,255,255,${ring.alpha})`;
        ctx.lineWidth = 1;
        ctx.stroke();
        if (ring.alpha < 0.01) rings.current.splice(i, 1);
      });

      if (phase >= 3 && orbs.current.length === 0 && !waitingOrbitRef.current) {
        waitingOrbitRef.current = true;
        const delay = phase >= 5 ? 0 : 450;
        orbitTimerRef.current = window.setTimeout(() => {
          spawnOrbs();
          waitingOrbitRef.current = false;
          orbitTimerRef.current = null;
        }, delay);
      }

      if (orbReady.current && orbImage.current && orbs.current.length) {
        const tNorm = time / 1000;
        const cx = w / 2;
        const cy = h / 2;

        orbs.current.forEach((orb, idx) => {
          const speed = 0.18 + orb.drift + idx * 0.015;
          orb.angle += speed * (dt / 1000);
          const wobbleR = orb.radius + Math.sin(tNorm * (1 + orb.drift)) * orb.wobble;
          const x = cx + Math.cos(orb.angle) * wobbleR;
          const y = cy + Math.sin(orb.angle) * wobbleR;

          ctx.save();
          ctx.translate(x, y);
          ctx.rotate(orb.angle * 0.1);
          const size = orb.r * 2;
          ctx.globalAlpha = 0.85;
          const imgNode = orbImage.current;
          if (imgNode && imgNode.width && imgNode.height) {
            const aspect = imgNode.width / imgNode.height;
            const drawW = size;
            const drawH = size / aspect;
            ctx.drawImage(imgNode, -drawW / 2, -drawH / 2, drawW, drawH);
          }
          ctx.restore();
        });
      }

      raf.current = requestAnimationFrame(loop);
    };

    raf.current = requestAnimationFrame(loop);
    return () => {
      if (raf.current) cancelAnimationFrame(raf.current);
      window.removeEventListener("resize", resize);
      if (orbitTimerRef.current) {
        clearTimeout(orbitTimerRef.current);
        orbitTimerRef.current = null;
      }
      waitingOrbitRef.current = false;
    };
  }, [phase]);

  return (
    <main className="relative min-h-[100svh] overflow-hidden bg-neutral-950 text-neutral-50">
      <nav className="relative z-20 mx-auto flex max-w-4xl items-center gap-2 px-6 pt-6 text-[11px] uppercase tracking-[0.3em] text-white/50">
        <Link href="/" className="transition hover:text-white">
          Home
        </Link>
        <span className="opacity-60">/</span>
        <Link href="/problems" className="transition hover:text-white">
          Problems
        </Link>
        <span className="opacity-60">/</span>
        <span className="text-white">Lost Leads</span>
      </nav>
      <canvas ref={canvasRef} className="absolute inset-0" />

      <LostLeadsText showCTAs={phase >= 3} />
    </main>
  );
}

const softEase: [number, number, number, number] = [0.22, 1, 0.36, 1];

function LostLeadsText({ showCTAs = false }: { showCTAs?: boolean }) {
  return (
    <div className="relative z-10 mx-auto flex min-h-[100svh] max-w-4xl flex-col items-center justify-center px-6 py-16">
      <div className="relative w-full max-w-[42ch] text-center">
        <motion.h1
          initial={{ opacity: 0, scale: 0.985, filter: "blur(6px)" }}
          animate={{ opacity: 1, scale: 1, filter: "blur(0px)" }}
          transition={{ duration: 1.2, ease: softEase }}
          className="text-balance text-4xl font-semibold leading-tight tracking-tight text-white md:text-6xl"
          style={{ textWrap: "balance" }}
        >
          {HERO_HEADLINE}
        </motion.h1>

        <div className="relative">
          {SUBLINES.map((line, index) => (
            <motion.p
              key={line}
              initial={{ opacity: 0, y: 8, filter: "blur(4px)" }}
              animate={{ opacity: 1, y: 0, filter: "blur(0px)" }}
              transition={{ duration: 0.9, delay: 0.45 + index * 0.35, ease: softEase }}
              className={`mt-8 text-base leading-relaxed text-white/${index % 2 === 0 ? "80" : "65"} md:text-lg`}
            >
              {line}
            </motion.p>
          ))}
        </div>

        {showCTAs && (
          <motion.div
            initial={{ opacity: 0, y: 12 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.5 }}
            className="mt-14 flex flex-col items-center gap-3"
          >
            <Link
              href="/problems/lost-leads/handle-it"
              className="text-base text-white underline decoration-white/25 underline-offset-4 transition hover:decoration-white/70 md:text-lg"
            >
              See how lost leads get rescued →
            </Link>

            <Link
              href="/problems"
              className="text-sm text-white/70 underline decoration-white/10 underline-offset-4 transition hover:text-white"
            >
              Explore another problem →
            </Link>
          </motion.div>
        )}
      </div>
    </div>
  );
}
