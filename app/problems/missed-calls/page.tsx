"use client";

import React, { useEffect, useRef, useState } from "react";
import { motion } from "framer-motion";
import Link from "next/link";

type Phase = 1 | 2 | 3 | 4 | 5 | 6 | 7;

export default function MissedCallsPage() {
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
        r: 58 + Math.random() * 20,
        drift: 0.12 + Math.random() * 0.05,
        wobble: 14 + Math.random() * 14,
      };
    });
  };
  useEffect(() => {
    const timeline: [Phase, number][] = [
      [1, 2000],
      [2, 2000],
      [3, 2000],
      [4, 1500],
      [5, 750],
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
      rings.current.push({ r: 0, alpha: 0.15, speed: 1 + Math.random() });
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
        const slowFactor = phase >= 5 ? 0.4 : phase >= 3 ? 0.7 : 1;
        ring.r += ring.speed * dt * slowFactor;
        ring.alpha *= phase >= 2 ? 0.985 : 0.99;
        ctx.beginPath();
        ctx.arc(w / 2, h / 2, ring.r, 0, Math.PI * 2);
        ctx.strokeStyle = `rgba(255,255,255,${ring.alpha})`;
        ctx.lineWidth = 1;
        ctx.stroke();
        if (ring.alpha < 0.01) rings.current.splice(i, 1);
      });

      if (phase >= 3 && orbs.current.length === 0 && !waitingOrbitRef.current) {
        waitingOrbitRef.current = true;
        const delay = phase >= 5 ? 0 : 500;
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
          const speed = 0.22 + orb.drift + idx * 0.02;
          orb.angle += speed * (dt / 1000);
          const wobbleR = orb.radius + Math.sin(tNorm * (1.2 + orb.drift)) * orb.wobble;
          const x = cx + Math.cos(orb.angle) * wobbleR;
          const y = cy + Math.sin(orb.angle) * wobbleR;

          ctx.save();
          ctx.translate(x, y);
          ctx.rotate(orb.angle * 0.15);
          const size = orb.r * 2;
          ctx.globalAlpha = 0.9;
          const img = orbImage.current;
          if (img && img.width && img.height) {
            const aspect = img.width / img.height;
            const drawW = size;
            const drawH = size / aspect;
            ctx.drawImage(img, -drawW / 2, -drawH / 2, drawW, drawH);
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
        <span className="text-white">Missed Calls</span>
      </nav>
      <canvas ref={canvasRef} className="absolute inset-0" />

      <MissedCallsText showCTAs={phase >= 3} />
    </main>
  );
}

const softEase: [number, number, number, number] = [0.22, 1, 0.36, 1];

function MissedCallsText({ showCTAs = false }: { showCTAs?: boolean }) {
  return (
    <div className="relative z-10 mx-auto flex min-h-[100svh] max-w-4xl flex-col items-center justify-center px-6 py-16">
      <div className="relative w-full max-w-[40ch] text-center">
        <motion.h1
          initial={{ opacity: 0, scale: 0.985, filter: "blur(6px)" }}
          animate={{ opacity: 1, scale: 1, filter: "blur(0px)" }}
          transition={{ duration: 1.2, ease: softEase }}
          className="text-4xl font-semibold leading-[1.05] tracking-tight text-white md:text-6xl"
        >
          Too many calls.
          <br />
          Not enough hands.
        </motion.h1>

        <div className="relative">
          <motion.p
            initial={{ opacity: 0, y: 6, filter: "blur(4px)" }}
            animate={{ opacity: 1, y: 0, filter: "blur(0px)" }}
            transition={{ duration: 1, delay: 0.5, ease: softEase }}
            className="mt-10 text-base leading-relaxed text-white/75 md:text-lg"
          >
            Every ring interrupts something.
            <br />
            Or gets missed completely.
          </motion.p>

          <motion.p
            initial={{ opacity: 0, y: 8 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.9, delay: 0.9, ease: softEase }}
            className="mt-10 text-sm leading-relaxed tracking-[0.015em] text-white/55 md:text-base"
          >
            Let’s change how this gets handled.
          </motion.p>

          <motion.p
            initial={{ opacity: 0, scale: 1.01, filter: "blur(3px)" }}
            animate={{ opacity: 1, scale: 1, filter: "blur(0px)" }}
            transition={{ duration: 1.1, delay: 1.3, ease: softEase }}
            className="mt-8 text-base leading-relaxed text-white/85 md:text-lg"
          >
            The right calls reach people.
            <br />
            Everything else gets handled without interruption.
          </motion.p>
        </div>

        <motion.p
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 1, delay: 1.8 }}
          className="mt-12 text-sm leading-relaxed text-white/60 md:text-base"
        >
          The phone still answers.
          <br />
          Your team doesn’t have to react to everything.
        </motion.p>

        {showCTAs && (
          <motion.div
            initial={{ opacity: 0, y: 12 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.5 }}
            className="mt-14 flex flex-col items-center gap-3"
          >
            <Link
              href="/problems/missed-calls/handle-it"
              className="text-base text-white underline decoration-white/25 underline-offset-4 transition hover:decoration-white/70 md:text-lg"
            >
              See how teams handle this →
            </Link>

            <Link
              href="/problems"
              className="text-sm text-white/70 underline decoration-white/10 underline-offset-4 transition hover:text-white"
            >
              Show me another problem →
            </Link>
          </motion.div>
        )}
      </div>
    </div>
  );
}

