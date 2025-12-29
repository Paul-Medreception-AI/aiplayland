"use client";

import React, { useEffect, useRef, useState } from "react";
import { motion } from "framer-motion";
import Link from "next/link";
import type { Problem } from "@/data/problemRegistry";
import type { ProblemPage } from "@/data/problemPages";
import { getProblemConfig } from "@/data/problemConfigs";

type Phase = 1 | 2 | 3 | 4 | 5 | 6 | 7;

type CinematicProblemExperienceProps = {
  problem: Problem;
  pageContent: ProblemPage;
};

export default function CinematicProblemExperience({ problem, pageContent }: CinematicProblemExperienceProps) {
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

  const problemConfig = getProblemConfig(problem.slug);
  const heroTitle = problemConfig.title;
  const heroSubtitle = pageContent.subhead || problemConfig.description;

  const segments = [
    {
      phaseGate: 3,
      text: problemConfig.description,
      className: "mb-4 text-xl",
    },
    {
      phaseGate: 3,
      text: pageContent.description,
      className: "mb-4 text-xl",
    },
    {
      phaseGate: 4,
      text: pageContent.whyItHurts?.length ? `Why it hurts: ${pageContent.whyItHurts.join(" · ")}` : "",
      className: "mb-4 text-lg opacity-80",
    },
    {
      phaseGate: 5,
      text: pageContent.whatAIChanges?.length ? `What AI changes: ${pageContent.whatAIChanges.join(" · ")}` : "",
      className: "mb-4 text-xl",
    },
    {
      phaseGate: 6,
      text: pageContent.nextStepLabel ? `Ready to ${pageContent.nextStepLabel.toLowerCase()}.` : "",
      className: "mb-8 text-lg opacity-80",
    },
  ].filter((segment) => segment.text);

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
        <span className="text-white">{problem.label}</span>
      </nav>
      <canvas ref={canvasRef} className="absolute inset-0" />

      <div className="relative z-10 mx-auto flex min-h-[100svh] max-w-3xl flex-col items-center justify-center px-6 text-center">
        {phase <= 5 && (
          <>
            <motion.h1 className="mb-6 text-4xl font-semibold md:text-6xl">{heroTitle}</motion.h1>
            <motion.p className="mb-6 text-lg text-white/70">{heroSubtitle}</motion.p>
          </>
        )}

        {segments.map(
          (segment) =>
            phase >= segment.phaseGate && (
              <motion.p key={segment.text} className={segment.className}>
                {segment.text}
              </motion.p>
            ),
        )}

        {phase === 7 && (
          <div className="flex flex-col gap-3">
            <Link href={`/problems/${problem.slug}/handle-it`} className="text-lg underline">
              {pageContent.nextStepLabel || "See how to handle it"} →
            </Link>
            <Link href="/problems" className="text-sm opacity-70">
              Explore other problems →
            </Link>
          </div>
        )}
      </div>
    </main>
  );
}
