"use client";

import React, { useEffect, useMemo, useRef, useState } from "react";
import { AnimatePresence, MotionConfig, motion, useReducedMotion } from "framer-motion";

type Stage =
  | "void"
  | "presence"
  | "pull"
  | "collapse"
  | "reveal"
  | "zap"
  | "orient"
  | "question";

type Lane = "work" | "business" | "school" | "home" | "curiosity";

const COPY: Record<Stage, { title?: string; lines: string[]; micro?: string }> = {
  void: { lines: [], micro: "loading curiosity…" },
  presence: { title: "AIPlayLand", lines: [], micro: "where problems come to disappear" },
  pull: { lines: ["You weren’t supposed to find this."], micro: "most people never slow down long enough" },
  collapse: { lines: ["This isn’t a website."], micro: "it’s a place" },
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

function clamp(n: number, a: number, b: number) {
  return Math.max(a, Math.min(b, n));
}

export default function Page() {
  const reduceMotion = useReducedMotion();
  const [stage, setStage] = useState<Stage>("void");
  const [muted, setMuted] = useState(true);
  const [selected, setSelected] = useState<Lane | null>(null);
  const [portalOpen, setPortalOpen] = useState(false);
  const [zapped, setZapped] = useState<Record<number, boolean>>({});
  const zapTimerRef = useRef<number | null>(null);
  const audioRef = useRef<HTMLAudioElement | null>(null);

  useEffect(() => {
    const timers: number[] = [];
    const t = (ms: number, fn: () => void) => timers.push(window.setTimeout(fn, ms));

    if (reduceMotion) {
      t(200, () => setStage("presence"));
      t(700, () => setStage("reveal"));
      t(1200, () => setStage("orient"));
      t(1600, () => setStage("question"));
      return () => timers.forEach(clearTimeout);
    }

    t(450, () => setStage("presence"));
    t(1800, () => setStage("pull"));
    t(3800, () => setStage("collapse"));
    t(5200, () => setStage("reveal"));
    t(7600, () => setStage("zap"));
    t(9800, () => setStage("orient"));
    t(11800, () => setStage("question"));

    return () => timers.forEach(clearTimeout);
  }, [reduceMotion]);

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
      case "void":
      case "presence":
        return 0.1;
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
  const showSprites = stage !== "void" && stage !== "presence";

  const onPick = (lane: Lane) => {
    setSelected(lane);
    setPortalOpen(true);
  };

  return (
    <MotionConfig reducedMotion={reduceMotion ? "always" : "never"}>
      <div className="relative min-h-screen w-full overflow-hidden bg-black text-white">
        <audio ref={audioRef} src="/audio/ambient-hum.mp3" />
        <Starfield density={reduceMotion ? 50 : 120} />
        <BlackHole intensity={blackholeIntensity} stage={stage} />

        <AnimatePresence>
          {showWorld && (
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
          )}
        </AnimatePresence>

        <div className="absolute right-4 top-4 z-50 flex items-center gap-2">
          <button
            onClick={() => setMuted((m) => !m)}
            className="rounded-full border border-white/15 bg-white/5 px-3 py-1 text-xs text-white/80 backdrop-blur hover:bg-white/10"
            aria-label={muted ? "Unmute ambient sound" : "Mute ambient sound"}
            title={muted ? "Sound off" : "Sound on"}
          >
            {muted ? "🔇" : "🔊"}
          </button>
          <div className="rounded-full border border-white/15 bg-white/5 px-3 py-1 text-xs text-white/70 backdrop-blur">🌀</div>
        </div>

        <div className="relative z-40 flex min-h-screen w-full flex-col items-center justify-center px-6">
          <CinematicText stage={stage} />

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

        {stage === "void" && (
          <div className="absolute bottom-5 left-6 z-30 text-[11px] text-white/35">loading curiosity…</div>
        )}

        <div className="pointer-events-none absolute bottom-4 right-6 z-20 hidden text-[11px] text-white/25 md:block">
          {reduceMotion ? "reduced motion enabled" : ""}
        </div>
      </div>
    </MotionConfig>
  );
}

function CinematicText({ stage }: { stage: Stage }) {
  const c = COPY[stage];

  return (
    <div className="text-center">
      {c.title && (
        <motion.div
          initial={{ opacity: 0, y: 8 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.9 }}
          className="text-4xl font-semibold tracking-tight sm:text-6xl"
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
            transition={{ duration: 0.7 }}
            className="mt-4 space-y-2"
          >
            {c.lines.map((line) => (
              <div key={line} className="text-xl font-medium text-white/90 sm:text-2xl">
                {line}
              </div>
            ))}
          </motion.div>
        )}
      </AnimatePresence>

      <AnimatePresence mode="wait">
        {c.micro && (
          <motion.div
            key={`${stage}-micro`}
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -8 }}
            transition={{ duration: 0.7, delay: 0.1 }}
            className="mt-3 text-xs tracking-wide text-white/55"
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
  const stars = useMemo(() => {
    const arr = [];
    for (let i = 0; i < density; i++) {
      arr.push({
        id: i,
        x: Math.random() * 100,
        y: Math.random() * 100,
        s: 0.6 + Math.random() * 1.6,
        o: 0.25 + Math.random() * 0.55,
        d: Math.random() * 6,
      });
    }
    return arr;
  }, [density]);

  return (
    <div className="absolute inset-0 z-0">
      {stars.map((st) => (
        <motion.span
          key={st.id}
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

  return (
    <motion.div
      className="absolute inset-0 z-10"
      animate={{ opacity: 0.7 + intensity * 0.25 }}
      transition={{ duration: 0.8 }}
    >
      <motion.div
        className="absolute left-1/2 top-1/2 h-[520px] w-[520px] -translate-x-1/2 -translate-y-1/2 rounded-full"
        style={{
          background:
            "radial-gradient(circle at 50% 50%, rgba(0,0,0,1) 0%, rgba(0,0,0,1) 32%, rgba(255,255,255,0.06) 42%, rgba(255,255,255,0.0) 70%)",
          filter: "blur(0px)",
        }}
        animate={{
          scale: isPull ? [0.9, 1.03, 0.98] : isCollapse ? [1.12, 0.15, 1.0] : [1.0, 1.02, 1.0],
          rotate: isCollapse ? [0, 360] : [0, 90, 0],
          opacity: isCollapse ? [0.95, 0.4, 0.75] : 0.75,
        }}
        transition={{ duration: isCollapse ? 1.8 : 6, repeat: isCollapse ? 0 : Infinity, ease: "easeInOut" }}
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
  const sprites = useMemo(() =>
    Array.from({ length: 7 }).map((_, idx) => ({
      id: idx,
      startX: Math.random() * 100,
      startY: Math.random() * 100,
      dur: 7 + Math.random() * 7,
      delay: Math.random() * 1.5,
    })),
  []);

  if (!active) return null;

  return (
    <div className="absolute inset-0 z-30">
      {sprites.map((s) => (
        <motion.div
          key={s.id}
          className="absolute"
          initial={{ left: `${s.startX}%`, top: `${s.startY}%`, opacity: 0 }}
          animate={{
            opacity: 1,
            left: [`${s.startX}%`, `${(s.startX + 30 + Math.random() * 50) % 100}%`, `${(s.startX + 70 + Math.random() * 40) % 100}%`],
            top: [`${s.startY}%`, `${(s.startY + 22 + Math.random() * 45) % 100}%`, `${(s.startY + 55 + Math.random() * 35) % 100}%`],
          }}
          transition={{ duration: s.dur, delay: s.delay, repeat: Infinity, ease: "easeInOut" }}
        >
          <div className="relative">
            <div className="h-3 w-3 rounded-full bg-white/80 shadow-[0_0_20px_rgba(255,255,255,0.35)]" />
            <div className="absolute -left-6 top-1/2 h-[2px] w-6 -translate-y-1/2 bg-white/25 blur-[0.5px]" />
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
