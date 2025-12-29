"use client";

import { AnimatePresence, motion, useReducedMotion } from "framer-motion";
import { useEffect, useMemo, useRef, useState, type PointerEvent as ReactPointerEvent } from "react";
import Link from "next/link";
import { MODES, type ModeKey } from "@/data/modes";
import { useRouter } from "next/navigation";

const SWIRL_EMOJI = "🌀";

function angleToMode(deg: number): ModeKey {
  const a = ((deg % 360) + 360) % 360;
  if (a < 120) return "improve";
  if (a < 240) return "explore";
  return "resolve";
}

export default function SwirlSelectorExperience() {
  const router = useRouter();
  const reduceMotion = useReducedMotion();

  const [phase, setPhase] = useState<"intro" | "select" | "micro" | "suggest">("intro");
  const [rotation, setRotation] = useState(0);
  const [activeMode, setActiveMode] = useState<ModeKey | null>(null);
  const autoSpinRef = useRef<number | null>(null);

  const dragging = useRef(false);
  const center = useRef<{ x: number; y: number } | null>(null);
  const lastAngle = useRef<number | null>(null);

  const mode = activeMode ? MODES[activeMode] : null;
  const highlightedMode: ModeKey | null = activeMode ?? (phase === "select" ? angleToMode(rotation) : null);

  const words = useMemo(
    () => [
      { key: "improve" as const, label: MODES.improve.label, x: "15%", y: "15%" },
      { key: "explore" as const, label: MODES.explore.label, x: "85%", y: "15%" },
      { key: "resolve" as const, label: MODES.resolve.label, x: "50%", y: "86%" },
    ],
    [],
  );

  const canInteract = phase === "select";
  const liveSelection = highlightedMode ? MODES[highlightedMode] : null;

  useEffect(() => {
    if (!canInteract) {
      if (autoSpinRef.current) {
        window.clearInterval(autoSpinRef.current);
        autoSpinRef.current = null;
      }
      return;
    }

    autoSpinRef.current = window.setInterval(() => {
      setRotation((r) => r + 8);
    }, 80);

    return () => {
      if (autoSpinRef.current) {
        window.clearInterval(autoSpinRef.current);
        autoSpinRef.current = null;
      }
    };
  }, [canInteract]);

  function start() {
    setPhase("select");
  }

  function selectMode(m: ModeKey) {
    if (activeMode) return;
    setActiveMode(m);
    setPhase("micro");
    window.setTimeout(() => setPhase("suggest"), reduceMotion ? 600 : 2200);
  }

  function computeAngle(clientX: number, clientY: number) {
    if (!center.current) return 0;
    const dx = clientX - center.current.x;
    const dy = clientY - center.current.y;
    return (Math.atan2(dy, dx) * 180) / Math.PI;
  }

  function onPointerDown(e: ReactPointerEvent<HTMLDivElement>) {
    if (!canInteract) return;
    if (autoSpinRef.current) {
      window.clearInterval(autoSpinRef.current);
      autoSpinRef.current = null;
    }
    dragging.current = true;
    e.currentTarget.setPointerCapture(e.pointerId);

    const rect = e.currentTarget.getBoundingClientRect();
    center.current = { x: rect.left + rect.width / 2, y: rect.top + rect.height / 2 };
    lastAngle.current = computeAngle(e.clientX, e.clientY);
  }

  function onPointerMove(e: ReactPointerEvent<HTMLDivElement>) {
    if (!dragging.current || !canInteract) return;
    const a = computeAngle(e.clientX, e.clientY);
    const prev = lastAngle.current ?? a;

    let delta = a - prev;
    if (delta > 180) delta -= 360;
    if (delta < -180) delta += 360;

    setRotation((r) => r + delta * 0.9);
    lastAngle.current = a;
  }

  function onPointerUp() {
    if (!dragging.current || !canInteract) return;
    dragging.current = false;
    const m = angleToMode(rotation);
    selectMode(m);
  }

  function goProblem(slug: string) {
    router.push(`/problems/${slug}`);
  }

  return (
    <div className="relative min-h-screen w-full overflow-hidden bg-black text-white">
      <nav className="absolute left-0 right-0 top-6 z-20 flex justify-center px-6 text-[11px] uppercase tracking-[0.3em] text-white/50">
        <div className="flex items-center gap-2 rounded-full border border-white/10 bg-white/5 px-4 py-2 backdrop-blur">
          <Link href="/" className="transition hover:text-white">
            Home
          </Link>
          <span className="opacity-60">/</span>
          <span className="text-white">Selector</span>
        </div>
      </nav>

      <div
        className="pointer-events-none absolute inset-0"
        style={{
          background: "radial-gradient(circle at 50% 35%, rgba(147,197,253,0.10), rgba(0,0,0,0) 60%)",
        }}
      />

      <div className="pointer-events-none absolute inset-0">
        {Array.from({ length: 9 }).map((_, i) => (
          <motion.div
            key={i}
            className="absolute rounded-full"
            style={{
              left: `${10 + (i * 9) % 80}%`,
              top: `${18 + (i * 13) % 70}%`,
              width: `${6 + (i % 4) * 3}px`,
              height: `${6 + (i % 4) * 3}px`,
              boxShadow: "0 0 18px rgba(147,197,253,0.20)",
              background: "rgba(147,197,253,0.35)",
            }}
            animate={reduceMotion ? { opacity: 0.35 } : { opacity: [0.25, 0.55, 0.25], y: [0, -10, 0] }}
            transition={reduceMotion ? { duration: 0 } : { duration: 8 + i, repeat: Infinity, ease: "easeInOut" }}
          />
        ))}
      </div>

      <div className="relative z-10 flex min-h-screen flex-col items-center justify-center px-6 text-center">
        <AnimatePresence>
          {phase === "intro" && (
            <motion.div
              initial={{ opacity: 0, y: 14 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -10 }}
              transition={{ duration: 0.8, ease: "easeOut" }}
              className="max-w-2xl"
            >
              <div className="text-xs tracking-[0.28em] text-white/50 uppercase">initiation</div>
              <h1 className="mt-4 text-4xl sm:text-5xl font-semibold tracking-tight">The swirl doesn’t pick your topic.</h1>
              <p className="mt-5 text-white/70">It chooses how the experience unfolds.</p>

              <motion.div
                whileHover={{
                  opacity: 1,
                  scale: 1.015,
                  letterSpacing: "0.055em",
                  textShadow: "0 0 14px rgba(147,197,253,0.35)",
                }}
                initial={{ opacity: 0.65, letterSpacing: "0.04em", textShadow: "0 0 0 rgba(0,0,0,0)" }}
                transition={{ duration: 0.32, ease: [0.22, 0.61, 0.36, 1] }}
                onClick={start}
                className="mt-10 inline-block cursor-pointer select-none text-sm text-white"
              >
                Step Into Selection
                <div className="mt-2 text-[11px] text-white/45 tracking-wide">Improve · Explore · Resolve</div>
              </motion.div>
            </motion.div>
          )}
        </AnimatePresence>

        <AnimatePresence>
          {(phase === "select" || phase === "micro" || phase === "suggest") && (
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ duration: 0.7 }}
              className="relative flex flex-col items-center"
            >
              <motion.div
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.8, delay: 0.05 }}
                className="mb-10"
              >
                <div className="text-xs tracking-[0.28em] text-white/50 uppercase">choose your mode</div>
                <div className="mt-3 text-lg text-white/80">
                  {phase === "select"
                    ? liveSelection?.label ?? "Spin the swirl… or choose a word."
                    : activeMode
                      ? MODES[activeMode].label
                      : " "}
                </div>
                {phase === "select" && (
                  <div className="mt-1 text-xs uppercase tracking-[0.35em] text-white/45">
                    {liveSelection ? "following rotation" : "spin to reveal"}
                  </div>
                )}
              </motion.div>

              <div className="relative h-[340px] w-[320px] sm:h-[420px] sm:w-[420px]">
                {words.map((w) => {
                  const isActive = activeMode === w.key;
                  const clickable = phase === "select" && !activeMode;
                  const isHighlighted = highlightedMode === w.key;

                  return (
                    <motion.div
                      key={w.key}
                      className="absolute -translate-x-1/2 -translate-y-1/2"
                      style={{ left: w.x, top: w.y }}
                      initial={{ opacity: 0, scale: 0.98 }}
                      animate={{
                        opacity:
                          phase === "select"
                            ? isHighlighted
                              ? 1
                              : 0.35
                            : isActive
                              ? 1
                              : 0.18,
                        scale: isHighlighted ? 1.04 : 1,
                      }}
                      transition={{ duration: 0.5, ease: "easeOut" }}
                    >
                      <motion.div
                        whileHover={
                          clickable
                            ? {
                                opacity: 1,
                                scale: 1.02,
                                letterSpacing: "0.06em",
                                textShadow: "0 0 14px rgba(147,197,253,0.30)",
                              }
                            : {}
                        }
                        transition={{ duration: 0.32, ease: [0.22, 0.61, 0.36, 1] }}
                        onClick={() => clickable && selectMode(w.key)}
                        className={[
                          "select-none text-sm sm:text-base tracking-[0.22em] uppercase transition-colors",
                          clickable ? "cursor-pointer" : "cursor-default",
                          isHighlighted ? "text-white font-semibold" : "text-white/70",
                        ].join(" ")}
                      >
                        {w.label}
                      </motion.div>
                    </motion.div>
                  );
                })}

                <motion.div
                  className="absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2"
                  onPointerDown={onPointerDown}
                  onPointerMove={onPointerMove}
                  onPointerUp={onPointerUp}
                  style={{ touchAction: "none" }}
                >
                  <motion.div
                    animate={
                      reduceMotion
                        ? { opacity: 1 }
                        : phase === "micro" || phase === "suggest"
                          ? {
                              rotate: rotation,
                              scale: [1, 1.03, 1],
                              filter: "drop-shadow(0 0 28px rgba(147,197,253,0.35))",
                            }
                          : {
                              rotate: rotation,
                              scale: 1,
                              filter: "drop-shadow(0 0 22px rgba(147,197,253,0.25))",
                            }
                    }
                    transition={
                      reduceMotion
                        ? { duration: 0 }
                        : phase === "micro" || phase === "suggest"
                          ? { duration: 1.2, ease: "easeInOut" }
                          : { duration: 0.2, ease: "linear" }
                    }
                    className="h-[220px] w-[220px] sm:h-[280px] sm:w-[280px]"
                  >
                    <motion.span
                      aria-label="Swirl"
                      role="img"
                      className="flex h-full w-full select-none items-center justify-center text-[140px] leading-none text-white drop-shadow-[0_0_35px_rgba(79,195,255,0.65)] sm:text-[200px]"
                      animate={{
                        rotate: phase === "select" ? [0, 360] : 0,
                      }}
                      transition={{
                        duration: 8,
                        repeat: phase === "select" ? Infinity : 0,
                        ease: "linear",
                      }}
                    >
                      {SWIRL_EMOJI}
                    </motion.span>
                  </motion.div>

                  {phase === "select" && (
                    <div className="mt-16 text-[11px] text-white/45 tracking-wide">drag to spin · release to commit</div>
                  )}
                </motion.div>
              </div>

              <AnimatePresence>
                {phase === "micro" && mode && (
                  <motion.div
                    initial={{ opacity: 0, y: 14 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0 }}
                    transition={{ duration: 0.7, ease: "easeOut" }}
                    className="mt-10 max-w-xl"
                  >
                    <MicroJourney lines={mode.microLines} />
                  </motion.div>
                )}
              </AnimatePresence>

              <AnimatePresence>
                {phase === "suggest" && mode && (
                  <motion.div
                    initial={{ opacity: 0, y: 18 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.7, ease: "easeOut" }}
                    className="mt-12 w-full max-w-3xl"
                  >
                    <div className="text-xs tracking-[0.28em] text-white/50 uppercase">suggested portals</div>

                    <div className="mt-6 grid gap-4 sm:grid-cols-3">
                      {mode.suggested.map((s) => (
                        <button
                          key={s.slug}
                          onClick={() => goProblem(s.slug)}
                          className="group rounded-2xl border border-white/15 bg-white/5 p-5 text-left backdrop-blur transition hover:bg-white/10"
                        >
                          <div className="text-sm font-medium text-white/90">{s.label}</div>
                          <div className="mt-2 text-xs text-white/55">{s.hint}</div>
                          <div className="mt-6 text-[11px] tracking-wide text-white/45 group-hover:text-white/70">enter →</div>
                        </button>
                      ))}
                    </div>

                  </motion.div>
                )}
              </AnimatePresence>
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </div>
  );
}

function MicroJourney({ lines }: { lines: string[] }) {
  return (
    <div className="space-y-4">
      {lines.map((line, i) => (
        <motion.div
          key={line}
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.7, ease: "easeOut", delay: 0.25 * i }}
          className="text-sm sm:text-base text-white/70"
        >
          {line}
        </motion.div>
      ))}
    </div>
  );
}
