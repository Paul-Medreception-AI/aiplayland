"use client";

import { motion, AnimatePresence, type PanInfo } from "framer-motion";
import {
  useEffect,
  useMemo,
  useState,
  type KeyboardEvent as ReactKeyboardEvent,
  type MouseEvent as ReactMouseEvent,
} from "react";
import { PROBLEM_POOL, Problem } from "@/data/problemPool";

type ActiveProblem = Problem & {
  x: number;
  y: number;
};

const MAX_VISIBLE = 7;
const ROTATION_INTERVAL = 4200;
const SAFE_RADIUS = 320;
const RADIUS_VARIANCE = 220;

function randomPosition() {
  const radius = SAFE_RADIUS + Math.random() * RADIUS_VARIANCE;
  const angle = Math.random() * Math.PI * 2;

  return {
    x: Math.cos(angle) * radius,
    y: Math.sin(angle) * radius,
  };
}

type ProblemFieldProps = {
  locked: boolean;
  activatedId: string | null;
  selectedId: string | null;
  onSelect: (problem: Problem) => void;
  allowNativeNavigation?: boolean;
};

export default function ProblemField({
  locked,
  activatedId,
  selectedId,
  onSelect,
  allowNativeNavigation = false,
}: ProblemFieldProps) {
  const [active, setActive] = useState<ActiveProblem[]>([]);
  const [hoveredId, setHoveredId] = useState<string | null>(null);
  const [absorbingId, setAbsorbingId] = useState<string | null>(null);
  const [draggingId, setDraggingId] = useState<string | null>(null);
  const [viewportHeight, setViewportHeight] = useState<number>(0);

  const pool = useMemo(() => [...PROBLEM_POOL], []);

  useEffect(() => {
    setActive(
      pool
        .sort(() => 0.5 - Math.random())
        .slice(0, MAX_VISIBLE)
        .map((p) => ({ ...p, ...randomPosition() })),
    );
  }, [pool]);

  useEffect(() => {
    const update = () => setViewportHeight(window.innerHeight || 0);
    update();
    window.addEventListener("resize", update);
    return () => window.removeEventListener("resize", update);
  }, []);

  useEffect(() => {
    const interval = setInterval(() => {
      if (locked || absorbingId) return;
      setActive((current) => {
        const remaining = current.slice(1);
        const next =
          pool.find((p) => !current.some((c) => c.id === p.id)) ?? pool[Math.floor(Math.random() * pool.length)];

        return [
          ...remaining,
          {
            ...next,
            ...randomPosition(),
          },
        ];
      });
    }, ROTATION_INTERVAL);

    return () => clearInterval(interval);
  }, [pool, locked, absorbingId]);

  useEffect(() => {
    if (!activatedId) {
      setAbsorbingId(null);
      return;
    }
    setAbsorbingId(activatedId);
  }, [activatedId]);

  const handleClick = (problem: ActiveProblem) => {
    if (locked || absorbingId) return;
    setAbsorbingId(problem.id);
    onSelect(problem);
  };

  const shouldAllowNativeNavigation = (event: ReactMouseEvent<HTMLAnchorElement>) => {
    if (allowNativeNavigation) return true;
    if (event.defaultPrevented) return true;
    if (event.button === 1) return true;
    if (event.metaKey || event.ctrlKey || event.shiftKey || event.altKey) return true;
    return false;
  };

  const handleAnchorClick = (event: ReactMouseEvent<HTMLAnchorElement>, problem: ActiveProblem) => {
    if (locked || absorbingId || allowNativeNavigation) return;
    if (draggingId === problem.id) return;
    if (shouldAllowNativeNavigation(event)) return;
    event.preventDefault();
    event.stopPropagation();
    handleClick(problem);
  };

  const handleAnchorKeyDown = (event: ReactKeyboardEvent<HTMLAnchorElement>, problem: ActiveProblem) => {
    if (allowNativeNavigation) return;
    if (locked || absorbingId) return;
    if (event.key !== "Enter" && event.key !== " ") return;
    event.preventDefault();
    event.stopPropagation();
    handleClick(problem);
  };

  const handleMouseEnter = (id: string) => {
    if (locked) return;
    setHoveredId(id);
  };

  const handleMouseLeave = (id: string) => {
    setHoveredId((prev) => (prev === id ? null : prev));
  };

  const handleDragStart = (problem: ActiveProblem) => {
    if (locked || absorbingId) return;
    setDraggingId(problem.id);
    setHoveredId(problem.id);
  };

  const handleDragEnd = (_event: ReactMouseEvent<HTMLAnchorElement>, _info: PanInfo, problem: ActiveProblem) => {
    if (locked || absorbingId) {
      setDraggingId(null);
      return;
    }
    setDraggingId(null);
    handleClick(problem);
  };

  const containerClass = "absolute inset-0 z-40 flex items-center justify-center";

  const swirlTargetY = viewportHeight ? -Math.round(viewportHeight * 0.32) : -260;

  const buildSpiralKeyframes = (problem: ActiveProblem) => {
    const steps = 14;
    const centerX = 0;
    const centerY = swirlTargetY;
    const dx = problem.x - centerX;
    const dy = problem.y - centerY;
    const r0 = Math.max(1, Math.hypot(dx, dy));
    const a0 = Math.atan2(dy, dx);
    const turns = 2.25;
    const x: number[] = [];
    const y: number[] = [];
    const scale: number[] = [];
    const opacity: number[] = [];

    for (let i = 0; i < steps; i += 1) {
      const t = i / (steps - 1);
      const decay = Math.pow(1 - t, 1.85);
      const radius = r0 * decay;
      const angle = a0 + t * Math.PI * 2 * turns;
      const fadeStart = 0.78;
      const fadeT = t <= fadeStart ? 0 : (t - fadeStart) / (1 - fadeStart);

      x.push(centerX + Math.cos(angle) * radius);
      y.push(centerY + Math.sin(angle) * radius);
      scale.push(1.08 - t * 0.88);
      opacity.push(0.95 * (1 - fadeT));
    }

    x[steps - 1] = centerX;
    y[steps - 1] = centerY;
    scale[steps - 1] = 0.16;
    opacity[steps - 1] = 0;

    return { x, y, scale, opacity };
  };

  return (
    <div className={containerClass}>
      <AnimatePresence>
        {active.map((problem) => {
          const isAbsorbing = absorbingId === problem.id;
          const isHighlighted = hoveredId === problem.id || selectedId === problem.id;
          const spiral = isAbsorbing ? buildSpiralKeyframes(problem) : null;

          const animateOpacity = isAbsorbing ? spiral!.opacity : isHighlighted ? 0.95 : 0.75;
          const animateScale = isAbsorbing ? spiral!.scale : isHighlighted ? 1.06 : 1;
          const animateX = isAbsorbing ? spiral!.x : problem.x;
          const animateY = isAbsorbing ? spiral!.y : problem.y;
          return (
            <motion.a
              key={problem.id}
              href={`/problems/${problem.id}`}
              className="absolute rounded-full bg-white/5 px-4 py-2 text-xs text-white/80 backdrop-blur-sm"
              drag={!locked}
              dragSnapToOrigin
              dragMomentum={false}
              dragElastic={0.18}
              initial={{
                opacity: 0,
                scale: 0.95,
                x: problem.x * 1.05,
                y: problem.y * 1.05,
              }}
              animate={{
                opacity: animateOpacity,
                scale: animateScale,
                x: animateX,
                y: animateY,
              }}
              exit={{
                opacity: 0,
                scale: 0.9,
                x: problem.x * 0.9,
                y: problem.y * 0.9,
                transition: { duration: 0.6 },
              }}
              transition={{
                duration: isAbsorbing ? 1.9 : 0.8,
                ease: isAbsorbing ? "easeInOut" : "easeOut",
              }}
              style={{
                boxShadow: isHighlighted || isAbsorbing ? "0 0 20px rgba(147,197,253,0.38)" : "0 0 12px rgba(147,197,253,0.12)",
                border: isHighlighted || isAbsorbing ? "1px solid rgba(255,255,255,0.35)" : "1px solid rgba(255,255,255,0.08)",
                pointerEvents: Boolean(absorbingId) ? "none" : "auto",
                cursor: locked ? "default" : "pointer",
                textDecoration: "none",
              }}
              onMouseEnter={() => handleMouseEnter(problem.id)}
              onMouseLeave={() => handleMouseLeave(problem.id)}
              onClick={(event) => handleAnchorClick(event, problem)}
              onKeyDown={(event) => handleAnchorKeyDown(event, problem)}
              onDragStart={() => handleDragStart(problem)}
              onDragEnd={(event, info) => handleDragEnd(event as unknown as ReactMouseEvent<HTMLAnchorElement>, info, problem)}
              aria-disabled={locked || Boolean(absorbingId)}
            >
              {problem.label}
            </motion.a>
          );
        })}
      </AnimatePresence>
    </div>
  );
}
