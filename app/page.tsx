"use client";

import React, { useCallback, useEffect, useMemo, useRef, useState } from "react";
import Image from "next/image";
import { AnimatePresence, MotionConfig, motion, useReducedMotion } from "framer-motion";

type Stage = "pull" | "collapse" | "reveal" | "zap" | "orient" | "question";

type Lane = "work" | "business" | "school" | "home" | "curiosity";
type SwirlPhase = "hidden" | "seed" | "pulse" | "ascend" | "settled";

const COPY: Record<Stage, { title?: string; lines: string[]; micro?: string; delay?: number }> = {
  pull: { lines: [], micro: undefined },
  collapse: { title: "AIPlayLand", lines: [], micro: "Where Problems Don’t Last Long", delay: 1 },
  reveal: { lines: ["Watch closely."], micro: "problems don’t stand still here" },
  zap: { lines: ["AI doesn’t replace people.", "It removes friction."], micro: "and friction hates speed" },
  orient: { lines: ["Every problem you see here is real.", "So are the solutions."], micro: "no demos · no pitches · no pressure" },
  question: { lines: ["What followed you here today?"], micro: "choose a direction — not a product" },
};

const CHOICES: { key: Lane; label: string; micro: string }[] = [
  { key: "work", label: "Work", micro: "emails · meetings · distractions" },
  { key: "business", label: "Business", micro: "calls · staffing · chaos" },
  { key: "school", label: "School", micro: "studying · focus · confidence" },
  { key: "home", label: "Home", micro: "time · energy · balance" },
  { key: "curiosity", label: "Curiosity", micro: "because you felt something" },
];

const PROBLEMS = ["📞 Missed Calls", "📬 Inbox Chaos", "📅 Overbooking", "📚 Homework Stress", "🌙 After-Hours Panic"];
const FRAME_ORDER: Stage[] = ["collapse", "pull", "reveal", "zap", "orient", "question"];

function clamp(n: number, a: number, b: number) {
  return Math.max(a, Math.min(b, n));
}

function pseudoRandom(seed: number, salt: number) {
  const x = Math.sin(seed * 12.9898 + salt * 78.233) * 43758.5453123;
  return x - Math.floor(x);
}

export default function Page() {
  const reduceMotion = useReducedMotion();
  const [stage, setStage] = useState<Stage>("collapse");
  const [muted, setMuted] = useState(true);
  const [selected, setSelected] = useState<Lane | null>(null);
  const [portalOpen, setPortalOpen] = useState(false);
  const [zapped, setZapped] = useState<Record<number, boolean>>({});
  const zapTimerRef = useRef<number | null>(null);
  const audioRef = useRef<HTMLAudioElement | null>(null);
  const [swirlPhase, setSwirlPhase] = useState<SwirlPhase>("hidden");
  const [textReady, setTextReady] = useState(false);
  const swirlTimers = useRef<number[]>([]);

  const clearSwirlTimers = () => {
    swirlTimers.current.forEach((id) => window.clearTimeout(id));
    swirlTimers.current = [];
  };

  const queueSwirlTimer = (ms: number, fn: () => void) => {
    const id = window.setTimeout(fn, ms);
    swirlTimers.current.push(id);
    return id;
  };

  const stageTimeline = useMemo<Stage[]>(
    () =>
      reduceMotion
        ? ["collapse", "reveal", "orient", "question"]
        : ["collapse", "pull", "reveal", "zap", "orient", "question"],
    [reduceMotion],
  );

  const advanceStage = useCallback(() => {
    setStage((prev) => {
      const idx = stageTimeline.indexOf(prev);
      if (idx === -1 || idx >= stageTimeline.length - 1) return prev;
      return stageTimeline[idx + 1];
    });
  }, [stageTimeline]);

  useEffect(() => {
    if (!stageTimeline.includes(stage)) {
      setStage(stageTimeline[0]);
    }
  }, [stageTimeline, stage]);

  useEffect(() => {
    const handleKey = (event: KeyboardEvent) => {
      if (event.code !== "Space") return;
      event.preventDefault();
      advanceStage();
    };

    window.addEventListener("keydown", handleKey);
    return () => window.removeEventListener("keydown", handleKey);
  }, [advanceStage]);

  useEffect(() => {
    return () => clearSwirlTimers();
  }, []);

  useEffect(() => {
    if (reduceMotion) {
      clearSwirlTimers();
      setSwirlPhase("settled");
      setTextReady(true);
    }
  }, [reduceMotion]);

  useEffect(() => {
    if (reduceMotion) return;
    clearSwirlTimers();
    if (stage !== "collapse") {
      setSwirlPhase("settled");
      setTextReady(true);
      return;
    }

    setSwirlPhase("hidden");
    setTextReady(false);

    queueSwirlTimer(1200, () => setSwirlPhase("seed"));
    queueSwirlTimer(2200, () => setSwirlPhase("pulse"));
    queueSwirlTimer(3400, () => setSwirlPhase("ascend"));
    queueSwirlTimer(4800, () => {
      setSwirlPhase("settled");
      setTextReady(true);
    });
  }, [stage, reduceMotion]);

  useEffect(() => {
    if (reduceMotion) return;
    const active = stage === "reveal" || stage === "zap" || stage === "orient" || stage === "question";
    if (!active) return;

    const loop = () => {
      setZapped((prev) => {
        const next = { ...prev };
        const idx = Math.floor(Math.random() * PROBLEMS.length);
        next[idx] = true;
        window.setTimeout(() => {
          setZapped((p2) => ({ ...p2, [idx]: false }));
        }, 900 + Math.random() * 900);
        return next;
      });

      zapTimerRef.current = window.setTimeout(loop, 650 + Math.random() * 550);
    };

    zapTimerRef.current = window.setTimeout(loop, 800);

    return () => {
      if (zapTimerRef.current) window.clearTimeout(zapTimerRef.current);
      zapTimerRef.current = null;
    };
  }, [stage, reduceMotion]);

  useEffect(() => {
    if (!audioRef.current) return;
    const a = audioRef.current;
    a.loop = true;
    a.volume = 0.18;
    a.muted = muted;
    if (!muted) {
      a.play().catch(() => {});
    } else {
      a.pause();
      a.currentTime = 0;
    }
  }, [muted]);

  const blackholeIntensity = useMemo(() => {
    if (reduceMotion) return 0.2;
    switch (stage) {
      case "pull":
        return 0.8;
      case "collapse":
        return 1.0;
      case "reveal":
      case "zap":
        return 0.55;
      case "orient":
      case "question":
        return 0.35;
      default:
        return 0.3;
    }
  }, [stage, reduceMotion]);

  const showWorld = stage === "reveal" || stage === "zap" || stage === "orient" || stage === "question";
  const showChoices = stage === "question";
  const showSprites = showWorld;
  const frameIndex = FRAME_ORDER.indexOf(stage);

  const onPick = (lane: Lane) => {
    setSelected(lane);
    setPortalOpen(true);
  };

  return (
    <>
      <MotionConfig reducedMotion={reduceMotion ? "always" : "never"}>
        <div className="relative min-h-screen w-full overflow-hidden bg-black text-white">
          <audio ref={audioRef} src="/audio/ambient-hum.mp3" />
          <Starfield density={reduceMotion ? 50 : 120} />
          <BlackHole intensity={blackholeIntensity} stage={stage} />
          <SwirlGlyph stage={stage} phase={swirlPhase} />
          {frameIndex >= 0 && (
            <div className="pointer-events-none absolute left-1/2 top-6 z-50 -translate-x-1/2 rounded-full border border-white/15 px-4 py-1 text-xs font-semibold uppercase tracking-[0.6em] text-white/80">
              Frame {frameIndex + 1}
            </div>
          )}
          {showWorld && (
            <AnimatePresence>
              <motion.div
                className="absolute inset-0"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                transition={{ duration: 0.9 }}
              >
                <WorldGlow />
                <Problems zapped={zapped} />
                <AISprites active={showSprites} />
              </motion.div>
            </AnimatePresence>
          )}
          <button
            onClick={() => setMuted((m) => !m)}
            className="absolute right-4 top-4 z-50 rounded-full border border-white/15 bg-white/5 px-3 py-1 text-xs text-white/80 backdrop-blur hover:bg-white/10"
            aria-label={muted ? "Unmute ambient sound" : "Mute ambient sound"}
            title={muted ? "Sound off" : "Sound on"}
          >
            {muted ? "🔇" : "🔊"}
          </button>
          <div className="relative z-40 flex min-h-screen w-full flex-col items-center justify-center px-6">
            <AnimatePresence mode="wait">
              {(textReady || reduceMotion) && (
                <motion.div
                  key={`text-${stage}`}
                  initial={{ opacity: 0, y: 16 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -16 }}
                  transition={{ duration: 0.9, ease: "easeOut" }}
                  className="w-full"
                >
                  <CinematicText stage={stage} />
                </motion.div>
              )}
            </AnimatePresence>
            <AnimatePresence>
              {showChoices && (
                <motion.div
                  initial={{ opacity: 0, y: 12 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: 12 }}
                  transition={{ duration: 0.6 }}
                  className="mt-10 w-full max-w-3xl"
                >
                  <div className="flex flex-wrap items-center justify-center gap-4">
                    {CHOICES.map((c) => (
                      <ChoiceChip
                        key={c.key}
                        active={selected === c.key}
                        label={c.label}
                        micro={c.micro}
                        onHover={() => setSelected(c.key)}
                        onClick={() => onPick(c.key)}
                      />
                    ))}
                  </div>

                  <AnimatePresence>
                    {portalOpen && selected ? (
                      <motion.div
                        initial={{ opacity: 0, y: 18 }}
                        animate={{ opacity: 1, y: 0 }}
                        exit={{ opacity: 0, y: 18 }}
                        transition={{ duration: 0.6 }}
                        className="mt-10 flex flex-col items-center"
                      >
                        <div className="text-sm text-white/75">Good choice.</div>
                        <div className="mt-1 text-xs text-white/55">this is where it gets interesting</div>
                        <motion.button
                          whileHover={{ scale: 1.03 }}
                          whileTap={{ scale: 0.98 }}
                          onClick={() => alert(`Portal opens → lane: ${selected}`)}
                          className="group relative mt-6 rounded-2xl border border-white/15 bg-white/5 px-6 py-3 text-base font-semibold tracking-wide text-white/90 backdrop-blur hover:bg-white/10"
                        >
                          <span className="relative z-10">Step Inside</span>
                          <span className="mt-1 block text-xs font-normal text-white/55">
                            no sign-ups · no sales · just AI in motion
                          </span>
                          <span className="pointer-events-none absolute inset-[-10px] -z-0 rounded-3xl opacity-60 blur-md transition group-hover:opacity-90">
                            <PortalRing />
                          </span>
                        </motion.button>

                        <div className="mt-16 flex justify-center">
                          <div className="text-[11px] text-white/30">built by people who actually use AI · not just talk about it</div>
                        </div>
                      </motion.div>
                    ) : null}
                  </AnimatePresence>
                </motion.div>
              )}
            </AnimatePresence>
          </div>

          <div className="pointer-events-none absolute bottom-4 right-6 z-20 hidden text-[11px] text-white/25 md:block">
            {reduceMotion ? "reduced motion enabled" : ""}
          </div>
        </div>
      </MotionConfig>
    </>
  );
}

function CinematicText({ stage }: { stage: Stage }) {
  const c = COPY[stage];
  const introCollapse = stage === "collapse";
  const titleDelay = c.delay ?? (introCollapse ? 0 : 0);

  return (
    <div className="text-center">
      {c.title && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{
            duration: introCollapse ? 1.5 : 0.9,
            delay: titleDelay,
            ease: "easeOut",
          }}
          className="text-5xl font-semibold tracking-tight sm:text-7xl"
        >
          {c.title}
        </motion.div>
      )}

      <AnimatePresence mode="popLayout">
        {(c.lines?.length ?? 0) > 0 && (
          <motion.div
            key={stage}
            initial={{ opacity: 0, y: 10, filter: "blur(6px)" }}
            animate={{ opacity: 1, y: 0, filter: "blur(0px)" }}
            exit={{ opacity: 0, y: -8, filter: "blur(6px)" }}
            transition={{ duration: 0.7, ease: "easeOut" }}
            className="mt-4 space-y-2"
          >
            {c.lines.map((line, idx) => (
              <motion.div
                key={line}
                className="text-3xl font-medium text-white/90 sm:text-4xl"
                animate={{ opacity: 1, y: 0, letterSpacing: "0em", scale: 1 }}
                transition={{ duration: 0.5, ease: "easeOut", delay: idx * 0.05 }}
              >
                {line}
              </motion.div>
            ))}
          </motion.div>
        )}
      </AnimatePresence>

      <AnimatePresence mode="wait">
        {c.micro && (
          <motion.div
            key={`${stage}-micro`}
            initial={introCollapse ? { opacity: 0, y: 18 } : { opacity: 0, y: 10 }}
            animate={
              introCollapse
                ? { opacity: 1, y: 6, letterSpacing: "0.35em" }
                : { opacity: 1, y: 0, letterSpacing: "0.2em" }
            }
            exit={{ opacity: 0, y: -8 }}
            transition={{
              duration: introCollapse ? 1.2 : 0.7,
              delay: introCollapse ? titleDelay + 0.4 : 0.1,
              ease: "easeOut",
            }}
            className="mt-3 text-sm tracking-wide text-white/70"
          >
            {c.micro}
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}

function ChoiceChip({
  label,
  micro,
  active,
  onHover,
  onClick,
}: {
  label: string;
  micro: string;
  active: boolean;
  onHover: () => void;
  onClick: () => void;
}) {
  return (
    <motion.button
      whileHover={{ scale: 1.03 }}
      whileTap={{ scale: 0.98 }}
      onMouseEnter={onHover}
      onFocus={onHover}
      onClick={onClick}
      className={[
        "relative rounded-2xl border px-5 py-3 text-left backdrop-blur",
        active ? "border-white/30 bg-white/10" : "border-white/12 bg-white/5 hover:border-white/20 hover:bg-white/8",
      ].join(" ")}
    >
      <div className="text-sm font-semibold text-white/90">{label}</div>
      <div className="mt-1 text-[11px] text-white/55">{micro}</div>
      <span className="pointer-events-none absolute -right-2 -top-2 opacity-70">🌀</span>
    </motion.button>
  );
}

function Starfield({ density }: { density: number }) {
  const [seed] = useState(() => Math.random());
  const [stars, setStars] = useState<
    { id: number; x: number; y: number; s: number; o: number; d: number }[]
  >([]);

  useEffect(() => {
    setStars(() => {
      return Array.from({ length: density }).map((_, i) => {
        const base = density * 17 + i * 31 + seed * 1000;
        return {
          id: i,
          x: pseudoRandom(base, 1) * 100,
          y: pseudoRandom(base, 2) * 100,
          s: 0.6 + pseudoRandom(base, 3) * 1.6,
          o: 0.25 + pseudoRandom(base, 4) * 0.55,
          d: pseudoRandom(base, 5) * 6,
        };
      });
    });
  }, [density, seed]);

  return (
    <div className="absolute inset-0 z-0">
      {stars.map((st) => (
        <motion.span
          key={`${seed}-${st.id}`}
          className="absolute block rounded-full bg-white"
          style={{ left: `${st.x}%`, top: `${st.y}%`, width: st.s, height: st.s, opacity: st.o }}
          animate={{ opacity: [st.o, clamp(st.o + 0.25, 0, 1), st.o] }}
          transition={{ duration: 2.5 + st.d, repeat: Infinity, ease: "easeInOut" }}
        />
      ))}
    </div>
  );
}

function BlackHole({ intensity, stage }: { intensity: number; stage: Stage }) {
  const isCollapse = stage === "collapse";
  const isPull = stage === "pull";
  const collapsingNow = stage === "collapse";

  return (
    <motion.div
      className="absolute inset-0 z-10"
      animate={{ opacity: 0.7 + intensity * 0.25 }}
      transition={{ duration: 0.8 }}
    >
      <motion.div
        className="absolute left-1/2 top-1/2 h-[620px] w-[620px] -translate-x-1/2 -translate-y-1/2 rounded-full"
        style={{
          background:
            "radial-gradient(circle at 50% 50%, rgba(0,0,0,1) 0%, rgba(0,0,0,1) 32%, rgba(255,255,255,0.06) 42%, rgba(255,255,255,0.0) 70%)",
        }}
        animate={{
          scale: isPull
            ? [1.4, 1.08, 1.0]
            : isCollapse
              ? [1.7, 0.35, 1.4, 0.4]
              : [1.0, 1.04, 1.0],
          rotate: isCollapse ? [0, 120, 220, 300] : [0, 90, 0],
          opacity: isCollapse ? [0.95, 0.35, 0.65, 0.2] : 0.78,
          filter: isCollapse ? ["blur(8px)", "blur(3px)", "blur(5px)", "blur(1px)"] : "blur(0px)",
        }}
        transition={{
          duration: isCollapse ? 3.8 : isPull ? 1.2 : 6,
          ease: "easeInOut",
          repeat: isCollapse ? 0 : Infinity,
        }}
      />

      <motion.div
        className="absolute left-1/2 top-1/2 h-[780px] w-[780px] -translate-x-1/2 -translate-y-1/2 rounded-full border border-white/5"
        animate={{
          scale: collapsingNow ? [1.2, 0.45, 1.05, 0.35] : [1, 1.05, 1],
          opacity: collapsingNow ? [0.4, 0.2, 0.28, 0.12] : [0.15, 0.25, 0.15],
          rotate: collapsingNow ? [0, 50, 110] : [0, 30, 0],
          filter: collapsingNow ? ["blur(4px)", "blur(1px)", "blur(3px)", "blur(0px)"] : ["blur(0px)", "blur(3px)", "blur(0px)"],
        }}
        transition={{
          duration: collapsingNow ? 3.2 : 4.5,
          ease: "easeInOut",
          repeat: collapsingNow ? 0 : Infinity,
        }}
        style={{
          background:
            "radial-gradient(circle, rgba(16,35,66,0.25) 0%, rgba(0,0,0,0) 65%)",
        }}
      />

      <div
        className="absolute inset-0"
        style={{
          background:
            "radial-gradient(circle at 50% 50%, rgba(255,255,255,0.02) 0%, rgba(255,255,255,0.03) 18%, rgba(255,255,255,0.0) 55%)",
        }}
      />
    </motion.div>
  );
}

function WorldGlow() {
  return (
    <div className="absolute inset-0">
      <div
        className="absolute inset-0 opacity-80"
        style={{
          background:
            "radial-gradient.circle at 50% 55%, rgba(255,255,255,0.04) 0%, rgba(255,255,255,0.02) 22%, rgba(0,0,0,0) 62%)",
        }}
      />
      <div
        className="absolute inset-0 opacity-70"
        style={{
          background:
            "radial-gradient(circle at 20% 20%, rgba(255,255,255,0.03) 0%, rgba(0,0,0,0) 45%), radial-gradient(circle at 80% 30%, rgba(255,255,255,0.02) 0%, rgba(0,0,0,0) 50%)",
        }}
      />
    </div>
  );
}

function Problems({ zapped }: { zapped: Record<number, boolean> }) {
  return (
    <div className="absolute inset-0 z-20">
      {PROBLEMS.map((p, i) => {
        const left = 12 + (i * 76) / Math.max(1, PROBLEMS.length - 1);
        const top = 25 + (i % 2 === 0 ? 10 : 22);

        return (
          <motion.div
            key={p}
            className="absolute rounded-2xl border border-white/10 bg-white/5 px-4 py-3 text-sm text-white/80 backdrop-blur"
            style={{ left: `${left}%`, top: `${top}%` }}
            animate={{
              y: zapped[i] ? -14 : [0, -10, 0],
              opacity: zapped[i] ? [0.9, 0.0] : [0.75, 0.95, 0.75],
              scale: zapped[i] ? [1.0, 0.75] : [1.0, 1.02, 1.0],
              filter: zapped[i] ? ["blur(0px)", "blur(8px)"] : ["blur(0px)", "blur(0px)"]
            }}
            transition={{ duration: zapped[i] ? 0.55 : 7 + i, repeat: zapped[i] ? 0 : Infinity, ease: "easeInOut" }}
          >
            {p}
          </motion.div>
        );
      })}
    </div>
  );
}

function AISprites({ active }: { active: boolean }) {
  const sprites = useMemo(
    () =>
      Array.from({ length: 7 }).map((_, idx) => {
        const seed = idx + 1;
        const startX = pseudoRandom(seed, 11) * 100;
        const startY = pseudoRandom(seed, 13) * 100;
        const left1 = (startX + 30 + pseudoRandom(seed, 17) * 50) % 100;
        const left2 = (startX + 70 + pseudoRandom(seed, 19) * 40) % 100;
        const top1 = (startY + 22 + pseudoRandom(seed, 23) * 45) % 100;
        const top2 = (startY + 55 + pseudoRandom(seed, 29) * 35) % 100;
        return {
          id: idx,
          positions: {
            left: [`${startX}%`, `${left1}%`, `${left2}%`],
            top: [`${startY}%`, `${top1}%`, `${top2}%`],
          },
          duration: 7 + pseudoRandom(seed, 31) * 7,
          delay: pseudoRandom(seed, 37) * 1.5,
        };
      }),
    [],
  );

  if (!active) return null;

  return (
    <div className="absolute inset-0 z-30">
      {sprites.map((s) => (
        <motion.div
          key={s.id}
          className="absolute"
          initial={{ left: s.positions.left[0], top: s.positions.top[0], opacity: 0 }}
          animate={{
            opacity: 1,
            left: s.positions.left,
            top: s.positions.top,
          }}
          transition={{ duration: s.duration, delay: s.delay, repeat: Infinity, ease: "easeInOut" }}
        >
          <div className="relative">
            <Image
              src="/images/BlueOrb.png"
              alt="Blue orb"
              width={48}
              height={48}
              className="h-10 w-10 object-contain drop-shadow-[0_0_40px_rgba(79,195,255,0.45)]"
              priority={false}
            />
          </div>
        </motion.div>
      ))}
    </div>
  );
}

function PortalRing() {
  return (
    <div
      className="h-full w-full"
      style={{
        background:
          "radial-gradient(circle at 50% 50%, rgba(255,255,255,0.12) 0%, rgba(255,255,255,0.07) 28%, rgba(255,255,255,0.02) 48%, rgba(255,255,255,0.0) 70%)",
        borderRadius: "24px",
      }}
    />
  );
}

function SwirlGlyph({ stage, phase }: { stage: Stage; phase: SwirlPhase }) {
  const show = phase !== "hidden";
  const scaleMap: Record<SwirlPhase, number> = {
    hidden: 0.375,
    seed: 1.5,
    pulse: 3.75,
    ascend: 2.625,
    settled: 2.0,
  };
  const topTarget =
    stage === "collapse"
      ? phase === "ascend" || phase === "settled"
        ? "32%"
        : "50%"
      : "18%";
  const blur = phase === "seed" ? "blur(6px)" : phase === "pulse" ? "blur(3px)" : "blur(0px)";
  const haloOpacity = phase === "pulse" ? 0.85 : 0.55;

  return (
    <motion.div
      className="pointer-events-none absolute left-1/2 z-40 -translate-x-1/2"
      initial={{ opacity: 0, scale: 0.4, top: "50%" }}
      animate={{
        opacity: show ? 0.95 : 0,
        scale: scaleMap[phase],
        top: topTarget,
        filter: blur,
      }}
      transition={{ duration: 0.8, ease: "easeInOut" }}
    >
      <motion.div
        className="relative flex items-center justify-center"
        animate={{
          rotate: 360,
        }}
        transition={{ duration: phase === "pulse" ? 6 : 12, repeat: Infinity, ease: "linear" }}
      >
        <div className="absolute inset-[-45px] rounded-full border border-white/15" style={{ opacity: haloOpacity }} />
        <div
          className="absolute inset-[-90px] rounded-full"
          style={{
            opacity: haloOpacity * 0.6,
            background: "radial-gradient(circle, rgba(79,195,255,0.3) 0%, rgba(79,195,255,0.05) 55%, rgba(0,0,0,0) 80%)",
            filter: "blur(30px)",
          }}
        />
        <span className="text-[120px] leading-none drop-shadow-[0_0_45px_rgba(79,195,255,0.65)]">🌀</span>
      </motion.div>
    </motion.div>
  );
}
