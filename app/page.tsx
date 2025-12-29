"use client";

import React, { useCallback, useEffect, useMemo, useRef, useState } from "react";
import Image from "next/image";
import { useRouter } from "next/navigation";
import { AnimatePresence, MotionConfig, motion, useReducedMotion } from "framer-motion";
import ProblemField from "@/components/ProblemField";
import type { Problem } from "@/data/problemPool";
import { LANE_CONTENT, LANE_ORDER, type LaneSlug } from "@/data/lanes";

type Stage = "pull" | "collapse" | "reveal" | "zap" | "orient" | "question";

type Lane = LaneSlug;
type SwirlPhase = "hidden" | "seed" | "pulse" | "ascend" | "settled";

const COPY: Record<Stage, { title?: string; lines: string[]; micro?: string; delay?: number }> = {
  pull: { lines: [], micro: undefined },
  collapse: { title: "AIPlayLand", lines: [], micro: "Where Problems Don’t Last Long", delay: 1 },
  reveal: { lines: ["Watch closely."], micro: "problems don’t stand still here" },
  zap: { lines: ["AI doesn’t replace people.", "It removes friction."], micro: "and friction hates speed" },
  orient: { lines: ["Every problem you see here is real.", "So are the solutions."], micro: "no demos · no pitches · no pressure" },
  question: { lines: ["What followed you here today?"], micro: "choose a direction — not a product" },
};

const CHOICES: { key: Lane; label: string; micro: string }[] = LANE_ORDER.map((slug) => {
  const lane = LANE_CONTENT[slug];
  return { key: slug, label: lane.choiceLabel, micro: lane.choiceMicro };
});

const ORB_COUNT = 12;
const FRAME_ORDER: Stage[] = ["collapse", "pull", "reveal", "zap", "orient", "question"];
const AUDIO_UNLOCK_EVENTS: Array<keyof DocumentEventMap> = ["pointerdown", "touchstart", "keydown"];
const AUDIO_TRACKS = [
  "/audio/ambient-coffee-time-part-1-436694.mp3",
  "/audio/balance-of-the-cosmos-363355.mp3",
  "/audio/black-hole-dreams-423388.mp3",
  "/audio/calm-of-the-cosmos-165862.mp3",
  "/audio/dark-matter-10710.mp3",
  "/audio/zen-landscapes-345448.mp3",
] as const;

const PROBLEMS: string[] = [];
const SWIRL_EMOJI = "🌀";

function clamp(n: number, a: number, b: number) {
  return Math.max(a, Math.min(b, n));
}

function pseudoRandom(seed: number, salt: number) {
  const x = Math.sin(seed * 12.9898 + salt * 78.233) * 43758.5453123;
  return x - Math.floor(x);
}

export default function Page() {
  const reduceMotion = useReducedMotion();
  const router = useRouter();
  const [stage, setStage] = useState<Stage>("collapse");
  const [muted, setMuted] = useState(false);
  const [selected, setSelected] = useState<Lane | null>(null);
  const [portalOpen, setPortalOpen] = useState(false);
  const audioRef = useRef<HTMLAudioElement | null>(null);
  const audioUnlockHandlerRef = useRef<((event: Event) => void) | null>(null);
  const audioSrcRef = useRef<string | null>(null);
  const [swirlPhase, setSwirlPhase] = useState<SwirlPhase>("hidden");
  const [textReady, setTextReady] = useState(false);
  const [ctaReady, setCtaReady] = useState(false);
  const ctaTimerRef = useRef<number | null>(null);
  const [highlightedOrb, setHighlightedOrb] = useState<number | null>(null);
  const [hoveredOrb, setHoveredOrb] = useState<number | null>(null);
  const [orbInteracted, setOrbInteracted] = useState(false);
  const [interactionLocked, setInteractionLocked] = useState(false);
  const [absorbingOrb, setAbsorbingOrb] = useState<number | null>(null);
  const [selectedProblem, setSelectedProblem] = useState<Problem | null>(null);
  const [problemActivatedId, setProblemActivatedId] = useState<string | null>(null);
  const [swirlBoost, setSwirlBoost] = useState(false);
  const [flashActive, setFlashActive] = useState(false);
  const [flashMode, setFlashMode] = useState<"orb" | "problem" | null>(null);
  const [welcomeActive, setWelcomeActive] = useState(false);
  const [trackSrc, setTrackSrc] = useState<string>(AUDIO_TRACKS[0]);
  const swirlTimers = useRef<number[]>([]);
  const orbCueTimerRef = useRef<number | null>(null);
  const orbCueResetRef = useRef<number | null>(null);
  const absorptionTimers = useRef<number[]>([]);

  const clearSwirlTimers = () => {
    swirlTimers.current.forEach((id) => window.clearTimeout(id));
    swirlTimers.current = [];
  };
  const clearOrbCueTimers = () => {
    if (orbCueTimerRef.current) window.clearTimeout(orbCueTimerRef.current);
    if (orbCueResetRef.current) window.clearTimeout(orbCueResetRef.current);
    orbCueTimerRef.current = null;
    orbCueResetRef.current = null;
  };
  const clearAbsorptionTimers = () => {
    absorptionTimers.current.forEach((id) => window.clearTimeout(id));
    absorptionTimers.current = [];
  };

  const queueSwirlTimer = (ms: number, fn: () => void) => {
    const id = window.setTimeout(fn, ms);
    swirlTimers.current.push(id);
    return id;
  };

  const clearCtaTimer = () => {
    if (ctaTimerRef.current) {
      window.clearTimeout(ctaTimerRef.current);
      ctaTimerRef.current = null;
    }
  };

  const scheduleCtaReveal = () => {
    clearCtaTimer();
    ctaTimerRef.current = window.setTimeout(() => {
      setCtaReady(true);
      ctaTimerRef.current = null;
    }, 300);
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
    return () => clearCtaTimer();
  }, [clearCtaTimer]);

  useEffect(() => {
    return () => {
      clearOrbCueTimers();
      clearAbsorptionTimers();
    };
  }, []);

  const clearAudioUnlockHandler = useCallback(() => {
    if (!audioUnlockHandlerRef.current) return;
    AUDIO_UNLOCK_EVENTS.forEach((event) => document.removeEventListener(event, audioUnlockHandlerRef.current as EventListener));
    audioUnlockHandlerRef.current = null;
  }, []);

  const requestAudioUnlock = useCallback(() => {
    if (audioUnlockHandlerRef.current) return;
    const handler = () => {
      if (!audioRef.current || audioRef.current.muted) return;
      audioRef.current
        .play()
        .then(() => {
          clearAudioUnlockHandler();
        })
        .catch(() => {
          // keep waiting for the next gesture
        });
    };
    audioUnlockHandlerRef.current = handler;
    AUDIO_UNLOCK_EVENTS.forEach((event) => document.addEventListener(event, handler));
  }, [clearAudioUnlockHandler]);

  useEffect(() => {
    return () => clearAudioUnlockHandler();
  }, [clearAudioUnlockHandler]);

  useEffect(() => {
    if (AUDIO_TRACKS.length <= 1) return;
    const choice = AUDIO_TRACKS[Math.floor(Math.random() * AUDIO_TRACKS.length)];
    if (choice) {
      setTrackSrc(choice);
    }
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
    clearCtaTimer();
    if (stage !== "collapse") {
      setSwirlPhase("settled");
      setTextReady(true);
      setCtaReady(false);
      return;
    }

    setSwirlPhase("hidden");
    setTextReady(false);
    setCtaReady(false);

    queueSwirlTimer(1200, () => setSwirlPhase("seed"));
    queueSwirlTimer(2200, () => setSwirlPhase("pulse"));
    queueSwirlTimer(3400, () => setSwirlPhase("ascend"));
    queueSwirlTimer(4800, () => {
      setSwirlPhase("settled");
      setTextReady(true);
    });
  }, [stage, reduceMotion]);

  useEffect(() => {
    setHighlightedOrb(null);
    setHoveredOrb(null);
    setAbsorbingOrb(null);
    setOrbInteracted(false);
    setSwirlBoost(false);
    setFlashActive(false);
    setFlashMode(null);
    setWelcomeActive(false);
    setSelectedProblem(null);
    setProblemActivatedId(null);
    setInteractionLocked(false);
    clearAbsorptionTimers();
    if (stage !== "reveal") {
      clearOrbCueTimers();
    }
  }, [stage]);

  useEffect(() => {
    if (reduceMotion || stage !== "reveal" || orbInteracted) {
      setHighlightedOrb(null);
      if (orbCueTimerRef.current) {
        window.clearTimeout(orbCueTimerRef.current);
        orbCueTimerRef.current = null;
      }
      if (orbCueResetRef.current) {
        window.clearTimeout(orbCueResetRef.current);
        orbCueResetRef.current = null;
      }
      return;
    }

    if (highlightedOrb !== null) return;

    orbCueTimerRef.current = window.setTimeout(() => {
      const choice = Math.floor(Math.random() * ORB_COUNT);
      setHighlightedOrb(choice);
      orbCueTimerRef.current = null;
    }, 2000);

    return () => {
      if (orbCueTimerRef.current) {
        window.clearTimeout(orbCueTimerRef.current);
        orbCueTimerRef.current = null;
      }
    };
  }, [stage, reduceMotion, orbInteracted, highlightedOrb]);

  useEffect(() => {
    if (orbCueResetRef.current) {
      window.clearTimeout(orbCueResetRef.current);
      orbCueResetRef.current = null;
    }
  }, [highlightedOrb]);

  useEffect(() => {
    if (reduceMotion) return;
    if (stage !== "pull") return;
    const timer = window.setTimeout(() => {
      advanceStage();
    }, 3200);
    return () => window.clearTimeout(timer);
  }, [stage, reduceMotion, advanceStage]);

  useEffect(() => {
    if (!audioRef.current) return;
    const a = audioRef.current;
    a.loop = true;
    a.volume = 0.18;
    a.muted = muted;
    if (audioSrcRef.current !== trackSrc) {
      a.src = trackSrc;
      a.load();
      audioSrcRef.current = trackSrc;
    }
    if (!muted) {
      a.play()
        .then(() => {
          clearAudioUnlockHandler();
        })
        .catch(() => {
          requestAudioUnlock();
        });
    } else {
      clearAudioUnlockHandler();
      a.pause();
      a.currentTime = 0;
    }
  }, [muted, trackSrc, clearAudioUnlockHandler, requestAudioUnlock]);

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

  const handleOrbHover = useCallback(
    (id: number) => {
      if (absorbingOrb !== null && absorbingOrb !== id) return;
      setHoveredOrb(id);
    },
    [absorbingOrb],
  );

  const handleOrbLeave = useCallback((id: number) => {
    setHoveredOrb((prev) => (prev === id ? null : prev));
  }, []);

  const triggerSwirlTransition = useCallback(
    (mode: "problem", onComplete?: () => void) => {
      setFlashMode(mode);
      const boostTimer = window.setTimeout(() => setSwirlBoost(true), 150);
      const flashTimer = window.setTimeout(() => setFlashActive(true), 1900);
      const advanceTimer = window.setTimeout(() => {
        setFlashActive(false);
        setSwirlBoost(false);
        if (onComplete) onComplete();
        advanceStage();
      }, 2550);

      absorptionTimers.current.push(boostTimer, flashTimer, advanceTimer);
    },
    [advanceStage],
  );

  const triggerOrbWelcomeSequence = useCallback(() => {
    setFlashMode("orb");
    const boostTimer = window.setTimeout(() => setSwirlBoost(true), 150);
    const flashStartTimer = window.setTimeout(() => setFlashActive(true), 1900);
    const flashEndTimer = window.setTimeout(() => setFlashActive(false), 3000);
    const settleTimer = window.setTimeout(() => setSwirlBoost(false), 3000);
    const welcomeTimer = window.setTimeout(() => setWelcomeActive(true), 3000);
    const selectorNavTimer = window.setTimeout(() => {
      router.push("/selector");
    }, 3800);
    absorptionTimers.current.push(
      boostTimer,
      flashStartTimer,
      flashEndTimer,
      settleTimer,
      welcomeTimer,
      selectorNavTimer,
    );
  }, [router]);

  const handleOrbClick = useCallback(
    (id: number) => {
      if (reduceMotion || stage !== "reveal" || orbInteracted || absorbingOrb !== null || interactionLocked) return;
      if (highlightedOrb !== id) return;
      setOrbInteracted(true);
      setInteractionLocked(true);
      setHighlightedOrb(id);
      setHoveredOrb(null);
      setAbsorbingOrb(id);
      clearOrbCueTimers();
      triggerOrbWelcomeSequence();
    },
    [reduceMotion, stage, orbInteracted, absorbingOrb, interactionLocked, highlightedOrb, triggerOrbWelcomeSequence],
  );

  const worldInteractive = stage === "reveal" || stage === "zap" || stage === "orient" || stage === "question";
  const problemsLocked = interactionLocked;

  const handleProblemSelect = useCallback(
    (problem: Problem) => {
      if (interactionLocked) return;
      if (reduceMotion || !worldInteractive) {
        router.push(`/problems/${problem.id}`);
        return;
      }
      setSelectedProblem(problem);
      setProblemActivatedId(problem.id);
      setInteractionLocked(true);
      setOrbInteracted(true);
      triggerSwirlTransition("problem", () => {
        router.push(`/problems/${problem.id}`);
      });
    },
    [reduceMotion, worldInteractive, interactionLocked, triggerSwirlTransition, router],
  );

  return (
    <>
      <MotionConfig reducedMotion={reduceMotion ? "always" : "never"}>
        <div className="relative min-h-screen w-full overflow-hidden bg-black text-white">
          <audio ref={audioRef} src={trackSrc} preload="auto" autoPlay playsInline aria-hidden="true" />
          <Starfield density={reduceMotion ? 50 : 120} />
          <BlackHole intensity={blackholeIntensity} stage={stage} />
         <SwirlGlyph stage={stage} phase={swirlPhase} boost={swirlBoost} />
          {flashActive && (
            <motion.div
              className="pointer-events-none absolute inset-0 z-50 bg-[#4FC3FF] mix-blend-screen"
              initial={{ opacity: 0 }}
              animate={
                flashMode === "orb" ? { opacity: [0, 0.62, 0.62, 0] } : { opacity: [0, 0.62, 0] }
              }
              transition={
                flashMode === "orb"
                  ? { duration: 1.1, ease: "easeOut", times: [0, 0.27, 0.73, 1] }
                  : { duration: 0.65, ease: "easeOut" }
              }
            />
          )}
          <AnimatePresence>
            {welcomeActive && (
              <motion.div
                className="pointer-events-none absolute inset-0 z-[60] flex items-center justify-center bg-black"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                transition={{ duration: 0.6, ease: "easeOut" }}
              >
                <div className="text-center">
                  <div className="text-xs uppercase tracking-[0.5em] text-white/50">WELCOME</div>
                </div>
              </motion.div>
            )}
          </AnimatePresence>
          {showWorld && (
            <AnimatePresence>
              <motion.div
                className="absolute inset-0 z-30"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                transition={{ duration: 0.9 }}
              >
                <WorldGlow />
                <ProblemField
                  locked={problemsLocked}
                  selectedId={selectedProblem?.id ?? null}
                  activatedId={problemActivatedId}
                  onSelect={handleProblemSelect}
                  allowNativeNavigation={reduceMotion || !worldInteractive}
                />
                <AISprites
                  active={showSprites}
                  stage={stage}
                  highlightedOrb={highlightedOrb}
                  hoveredOrb={hoveredOrb}
                  absorbingOrb={absorbingOrb}
                  onHover={handleOrbHover}
                  onLeave={handleOrbLeave}
                  onClick={handleOrbClick}
                />
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
          <div
            className={`relative z-40 pointer-events-none flex min-h-screen w-full flex-col items-center justify-center px-6 ${
              stage === "collapse" ? "pt-28 md:pt-36" : ""
            }`}
          >
            <AnimatePresence mode="wait">
              {(textReady || reduceMotion) && (
                <motion.div
                  key={`text-${stage}`}
                  initial={{ opacity: 0, y: 16 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -16 }}
                  transition={{ duration: 0.9, ease: "easeOut" }}
                  className="w-full"
                  onAnimationComplete={() => {
                    if (stage === "collapse") {
                      scheduleCtaReveal();
                    }
                  }}
                >
                  <CinematicText stage={stage} />
                </motion.div>
              )}
            </AnimatePresence>
            {stage === "collapse" && ctaReady && (
              <div className="mt-10 flex flex-col items-center gap-2">
                <motion.button
                  type="button"
                  onClick={advanceStage}
                  className="pointer-events-auto select-none text-base font-semibold uppercase tracking-[0.4em] text-white/55 cursor-pointer"
                  initial={{ opacity: 0.65, letterSpacing: "0.04em", textShadow: "0 0 0 rgba(0,0,0,0)" }}
                  whileHover={{
                    opacity: 1,
                    scale: 1.015,
                    letterSpacing: "0.055em",
                    textShadow: "0 0 14px rgba(147,197,253,0.35)",
                  }}
                  whileTap={{ scale: 0.985 }}
                  transition={{ duration: 0.32, ease: [0.22, 0.61, 0.36, 1] }}
                  style={{ background: "none" }}
                >
                  Step Inside
                </motion.button>
                <motion.span
                  initial={{ opacity: 0.45, y: 0 }}
                  whileHover={{ opacity: 0.7, y: -1 }}
                  transition={{ duration: 0.4, ease: "easeOut" }}
                  className="text-xs uppercase tracking-[0.3em] text-white/60"
                >
                  Most people never do.
                </motion.span>
              </div>
            )}
            <AnimatePresence>
              {showChoices && (
                <motion.div
                  id="lanes"
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
                          onClick={() => {
                            if (selected) router.push(`/${selected}`);
                          }}
                          className="pointer-events-auto group relative mt-6 rounded-2xl border border-white/15 bg-white/5 px-6 py-3 text-base font-semibold tracking-wide text-white/90 backdrop-blur hover:bg-white/10"
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
        "pointer-events-auto relative rounded-2xl border px-5 py-3 text-left backdrop-blur",
        active ? "border-white/30 bg-white/10" : "border-white/12 bg-white/5 hover:border-white/20 hover:bg-white/8",
      ].join(" ")}
    >
      <div className="text-sm font-semibold text-white/90">{label}</div>
      <div className="mt-1 text-[11px] text-white/55">{micro}</div>
      <span className="pointer-events-none absolute -right-2 -top-2 opacity-70">{SWIRL_EMOJI}</span>
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
    <div className="pointer-events-none absolute inset-0">
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

type Sprite = {
  id: number;
  start: { x: number; y: number };
  drift: { x: number; y: number };
  duration: number;
  delay: number;
  size: number;
  pulseDuration: number;
  pulseDelay: number;
};

function AISprites({
  active,
  stage,
  highlightedOrb,
  hoveredOrb,
  absorbingOrb,
  onHover,
  onLeave,
  onClick,
}: {
  active: boolean;
  stage: Stage;
  highlightedOrb: number | null;
  hoveredOrb: number | null;
  absorbingOrb: number | null;
  onHover: (id: number) => void;
  onLeave: (id: number) => void;
  onClick: (id: number) => void;
}) {
  const sprites = useMemo(
    () =>
      Array.from({ length: ORB_COUNT }).map((_, idx) => {
        const seed = idx + 1;
        const baseX = pseudoRandom(seed, 11) * 100;
        const baseY = pseudoRandom(seed, 13) * 100;
        const driftX = 12 + pseudoRandom(seed, 17) * 18;
        const driftY = 8 + pseudoRandom(seed, 19) * 14;
        const duration = 12 + pseudoRandom(seed, 23) * 10;
        const delay = pseudoRandom(seed, 29) * 5;
        const sizeSeed = pseudoRandom(seed, 31);
        const size = 20 + sizeSeed * 18;
        const pulseDuration = 6 + pseudoRandom(seed, 37) * 6;
        return {
          id: idx,
          start: { x: baseX, y: baseY },
          drift: { x: driftX, y: driftY },
          duration,
          delay,
          size,
          pulseDuration,
          pulseDelay: pseudoRandom(seed, 41) * 5,
        };
      }),
    [],
  );

  if (!active) return null;

  const swirlLeft = "50%";
  const swirlTop = "18%";
  const beckonLeft = "50%";
  const beckonTop = "52%";

  const buildOrbSpiral = (orbId: number) => {
    const steps = 16;
    const centerX = 50;
    const centerY = 18;
    const startX = 50;
    const startY = 52;
    const dx = startX - centerX;
    const dy = startY - centerY;
    const rStart = Math.max(0.001, Math.hypot(dx, dy));
    const r0 = rStart;
    const a0 = Math.atan2(dy, dx);
    const phaseJitter = (pseudoRandom(orbId + 1, 99) - 0.5) * (Math.PI * 0.55);
    const turns = 2.4;
    const left: string[] = [];
    const top: string[] = [];

    for (let i = 0; i < steps; i += 1) {
      const t = i / (steps - 1);
      const decay = Math.pow(1 - t, 1.85);
      const radius = r0 * decay;
      const angle = a0 + phaseJitter * (1 - t) + t * Math.PI * 2 * turns;
      left.push(`${centerX + Math.cos(angle) * radius}%`);
      top.push(`${centerY + Math.sin(angle) * radius}%`);
    }

    left[steps - 1] = swirlLeft;
    top[steps - 1] = swirlTop;

    return { left, top };
  };

  return (
    <div className="pointer-events-none absolute inset-0 z-50">
      {sprites.map((s) => {
        const isHighlighted = highlightedOrb === s.id;
        const isHovered = hoveredOrb === s.id;
        const isAbsorbing = absorbingOrb === s.id;
        const baseOpacity = isAbsorbing ? [0.9, 0.55, 0] : isHighlighted ? [0.75, 1, 0.85] : [0.45, 0.75, 0.45];
        const baseScale = isAbsorbing
          ? [1.0, 0.75, 0.35]
          : isHighlighted
            ? [1.08, 1.25, 1.08]
            : isHovered
              ? [1.05, 1.15, 1.05]
              : [1, 1.15, 1];

        const driftLeft: string[] = [
          `${s.start.x}%`,
          `${(s.start.x + s.drift.x) % 100}%`,
          `${(s.start.x + 100 - s.drift.x * 0.2) % 100}%`,
        ];
        const driftTop: string[] = [
          `${s.start.y}%`,
          `${(s.start.y + s.drift.y) % 100}%`,
          `${(s.start.y + 100 - s.drift.y * 0.2) % 100}%`,
        ];

        let pathLeft: string[] = driftLeft;
        let pathTop: string[] = driftTop;

        if (isAbsorbing) {
          const spiral = buildOrbSpiral(s.id);
          pathLeft = spiral.left;
          pathTop = spiral.top;
        } else if (isHighlighted) {
          pathLeft = [`${s.start.x}%`, beckonLeft];
          pathTop = [`${s.start.y}%`, beckonTop];
        }

        const isClickable = stage === "reveal" && isHighlighted && !isAbsorbing;

        return (
          <motion.div
            key={s.id}
            className="absolute -translate-x-1/2 -translate-y-1/2"
            initial={{
              left: `${s.start.x}%`,
              top: `${s.start.y}%`,
              opacity: 0,
            }}
            style={{ zIndex: isHighlighted || isAbsorbing ? 55 : 30 }}
            animate={{
              opacity: baseOpacity,
              left: pathLeft,
              top: pathTop,
            }}
            transition={{
              duration: isAbsorbing ? 1.9 : isHighlighted ? 0.95 : s.duration,
              delay: isAbsorbing ? 0 : isHighlighted ? 0 : s.delay,
              repeat: isAbsorbing ? 0 : isHighlighted ? 0 : Infinity,
              ease: "easeInOut",
            }}
          >
            <motion.button
              type="button"
              className={`pointer-events-auto relative flex items-center justify-center ${isClickable ? "cursor-pointer" : "cursor-default"}`}
              animate={{
                opacity: baseOpacity,
                scale: baseScale,
              }}
              transition={{
                duration: isAbsorbing ? 1.2 : isHighlighted ? 1.1 : s.pulseDuration,
                delay: isAbsorbing ? 0 : s.pulseDelay,
                repeat: isAbsorbing ? 0 : Infinity,
                ease: "easeInOut",
              }}
              style={{
                width: `${s.size + 6}px`,
                height: `${s.size + 6}px`,
                pointerEvents: isAbsorbing ? "none" : "auto",
              }}
              onMouseEnter={() => onHover(s.id)}
              onMouseLeave={() => onLeave(s.id)}
              onFocus={() => onHover(s.id)}
              onBlur={() => onLeave(s.id)}
              onClick={() => onClick(s.id)}
              aria-label="Interact with orb"
            >
              <div
                className="absolute inset-0 rounded-full"
                style={{
                  boxShadow: isHighlighted
                    ? "0 0 30px rgba(147,197,253,0.45), 0 0 55px rgba(147,197,253,0.35)"
                    : "0 0 20px rgba(147,197,253,0.35), 0 0 40px rgba(147,197,253,0.25)",
                  opacity: isAbsorbing ? 0.95 : 0.8,
                }}
              />
              <Image
                src="/images/lightorb.png"
                alt="Light orb"
                width={64}
                height={64}
                className="h-full w-full object-contain"
                style={{
                  width: `${s.size}px`,
                  height: `${s.size}px`,
                  transform: isHighlighted ? "translateY(-1px) scale(1.05)" : undefined,
                }}
                priority={false}
              />
            </motion.button>
          </motion.div>
        );
      })}
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

function SwirlGlyph({ stage, phase, boost }: { stage: Stage; phase: SwirlPhase; boost: boolean }) {
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
          scale: boost ? 1.08 : 1,
          opacity: boost ? 1 : 0.95,
        }}
        transition={{
          duration: boost ? 1.4 : phase === "pulse" ? 6 : 12,
          repeat: Infinity,
          ease: "linear",
        }}
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
