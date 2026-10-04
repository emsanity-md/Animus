"use client";

/**
 * DriftWall — an infinite vertical drift of poster tiles.
 *
 * Derived from the supplied DriftWall, re-parameterised for Animus. The
 * motion survives; the showcase aesthetic does not. This is a printed
 * catalogue on warm paper with one vermilion accent, so the wall is
 * desaturated, flat, dimmed to near-texture, and masked into the page
 * rather than floating in front of it as tilted 3D cards.
 *
 * What was removed, and why:
 *
 *   Hover / focus / lift          The original gave every tile tabIndex=0 and
 *                                 role="button". With 5 columns x several
 *                                 copies that is ~90 focusable stops for
 *                                 background imagery, which would wreck
 *                                 this page's ~10-stop tab order. At 16%
 *                                 opacity a lift is invisible anyway. The
 *                                 wall is aria-hidden and non-focusable.
 *
 *   document.elementFromPoint()   Ran a forced hit-test on every pointermove
 *                                 purely to drive that hover state.
 *
 *   activeId / activate / release Only existed to serve the hover state.
 *
 * Kept: infinite column copies, per-column velocity with seeded variance,
 * damped pointer parallax, pause-on-hover, reduced-motion, and the rAF loop.
 *
 * Added: the loop is cancelled entirely when the wall scrolls out of view
 * rather than running forever against a display:none parent.
 */

import Image from "next/image";
import {
  useCallback,
  useEffect,
  useMemo,
  useRef,
  useState,
  useSyncExternalStore,
  type CSSProperties,
} from "react";
import { cn } from "cn";

export interface DriftWallItem {
  image: string;
  title: string;
}

export interface DriftWallProps {
  items: DriftWallItem[];
  columns?: number;
  tileWidth?: number;
  tileHeight?: number;
  gap?: number;
  radius?: number;
  /** Plane zoom. The original used 1.18 to hide edges under rotation;
   *  with tilt/turn at 0 that is just an unwanted zoom. */
  scale?: number;
  tilt?: number;
  turn?: number;
  roll?: number;
  parallax?: number;
  speed?: number;
  direction?: "up" | "down";
  variance?: number;
  pauseOnHover?: boolean;
  /** Tile opacity. At 0.32 this reads as a printed texture behind the text,
   *  not as content — and not so faint that it disappears. */
  dim?: number;
  grayscale?: boolean;
  /** Where the column field sits horizontally. The hero's text column is on
   *  the left, so centring the wall buries half of it behind copy that the
   *  scrim has to hide anyway. Offsetting it right uses the empty space. */
  planeX?: string;
  /** Theme ink, so the scrim flips with light/dark. */
  overlayColor?: string;
  fade?: number;
  className?: string;
}

interface ColumnMeta {
  copyHeight: number;
  copies: number;
}

/**
 * Golden-ratio-ish spread so columns don't drift in lockstep.
 */
function columnFactor(index: number, variance: number): number {
  const pseudo = ((index * 0.6180339887 + 0.35) % 1) * 2 - 1;
  return 1 + variance * pseudo;
}

const REDUCED_MOTION_QUERY = "(prefers-reduced-motion: reduce)";

/**
 * Reads the media query through useSyncExternalStore rather than
 * setState-in-an-effect. The effect version renders once with `false`, then
 * again with the real value — a cascading render, and exactly what the
 * react-hooks lint rule rejects. This resolves during render, is tear-free,
 * and matches how the theme toggle already handles hydration-sensitive
 * browser state. Server snapshot is `false` so the wall starts moving and
 * settles, rather than freezing for the first paint.
 */
function usePrefersReducedMotion(): boolean {
  return useSyncExternalStore(
    (onStoreChange) => {
      const mq = window.matchMedia(REDUCED_MOTION_QUERY);
      mq.addEventListener("change", onStoreChange);
      return () => mq.removeEventListener("change", onStoreChange);
    },
    () => window.matchMedia(REDUCED_MOTION_QUERY).matches,
    () => false,
  );
}

export function DriftWall({
  items,
  columns = 5,
  tileWidth = 132,
  tileHeight = 198,
  gap = 14,
  radius = 6,
  scale = 1.02,
  tilt = 0,
  turn = 0,
  roll = 0,
  parallax = 0.5,
  speed = 26,
  direction = "up",
  variance = 0.45,
  pauseOnHover = true,
  dim = 0.32,
  grayscale = true,
  planeX = "50%",
  overlayColor = "var(--ink)",
  fade = 0.75,
  className = "",
}: DriftWallProps) {
  const containerRef = useRef<HTMLDivElement>(null);
  const planeRef = useRef<HTMLDivElement>(null);
  const trackRefs = useRef<(HTMLDivElement | null)[]>([]);
  const rafRef = useRef<number | null>(null);

  const offsetsRef = useRef<number[]>([]);
  const velocitiesRef = useRef<number[]>([]);
  const hoveredRef = useRef(false);
  const pointerRef = useRef({ x: 0, y: 0 });
  const pointerDampedRef = useRef({ x: 0, y: 0 });
  const lastTsRef = useRef<number | null>(null);

  const [containerHeight, setContainerHeight] = useState(600);
  const reduced = usePrefersReducedMotion();
  const [onScreen, setOnScreen] = useState(true);

  // Stop the loop entirely when the wall is off-screen. Running rAF against
  // a hidden hero is pure waste.
  useEffect(() => {
    const node = containerRef.current;
    if (!node) return;
    const io = new IntersectionObserver(
      ([entry]) => setOnScreen(entry.isIntersecting),
      { threshold: 0 },
    );
    io.observe(node);
    return () => io.disconnect();
  }, []);

  const columnItems = useMemo<DriftWallItem[][]>(() => {
    const cols: DriftWallItem[][] = Array.from({ length: columns }, () => []);
    items.forEach((item, i) => cols[i % columns].push(item));
    return cols.map((col) => (col.length ? col : items.slice(0, 1)));
  }, [items, columns]);

  const columnMeta = useMemo<ColumnMeta[]>(() => {
    const unit = tileHeight + gap;
    return columnItems.map((col) => {
      const copyHeight = Math.max(unit, col.length * unit);
      const copies = Math.max(2, Math.ceil((containerHeight * 1.6) / copyHeight) + 1);
      return { copyHeight, copies };
    });
  }, [columnItems, tileHeight, gap, containerHeight]);

  useEffect(() => {
    if (!containerRef.current) return;
    const ro = new ResizeObserver(([entry]) => {
      setContainerHeight(entry.contentRect.height || 600);
    });
    ro.observe(containerRef.current);
    return () => ro.disconnect();
  }, []);

  const baseVelocities = useMemo<number[]>(() => {
    const dirSign = direction === "up" ? 1 : -1;
    return columnItems.map((_, c) => {
      const altSign = c % 2 === 0 ? 1 : -1;
      return speed * columnFactor(c, variance) * dirSign * altSign;
    });
  }, [columnItems, speed, direction, variance]);

  useEffect(() => {
    offsetsRef.current = columnMeta.map(
      (meta, c) => meta.copyHeight * ((c * 0.37) % 1),
    );
    velocitiesRef.current = columnItems.map(() => 0);
  }, [columnMeta, columnItems]);

  const applyPlaneTransform = useCallback(
    (px: number, py: number) => {
      const plane = planeRef.current;
      if (!plane) return;
      plane.style.transform =
        `translate(-50%, -50%) scale(${scale}) ` +
        `rotateX(${tilt + py}deg) rotateY(${turn + px}deg) rotateZ(${roll}deg)`;
    },
    [tilt, turn, roll, scale],
  );

  useEffect(() => {
    if (!onScreen) {
      // Snap the plane back to neutral while hidden so it never resumes
      // mid-tilt from a stale pointer position.
      pointerRef.current = { x: 0, y: 0 };
      pointerDampedRef.current = { x: 0, y: 0 };
      applyPlaneTransform(0, 0);
      return;
    }

    const animate = (ts: number) => {
      if (lastTsRef.current === null) lastTsRef.current = ts;
      const dt = Math.min(0.05, Math.max(0, ts - lastTsRef.current) / 1000);
      lastTsRef.current = ts;

      const maxTilt = parallax * 8;
      const damp = 1 - Math.exp(-dt / 0.12);
      pointerDampedRef.current.x +=
        (pointerRef.current.x * maxTilt - pointerDampedRef.current.x) * damp;
      pointerDampedRef.current.y +=
        (-pointerRef.current.y * maxTilt - pointerDampedRef.current.y) * damp;
      applyPlaneTransform(pointerDampedRef.current.x, pointerDampedRef.current.y);

      for (let c = 0; c < trackRefs.current.length; c++) {
        const meta = columnMeta[c];
        const el = trackRefs.current[c];
        if (!meta || !el) continue;

        if (!reduced) {
          const paused = hoveredRef.current && pauseOnHover;
          const target = paused ? 0 : baseVelocities[c];
          const ease = 1 - Math.exp(-dt / (target === 0 ? 0.16 : 0.28));
          velocitiesRef.current[c] += (target - velocitiesRef.current[c]) * ease;
          let next = (offsetsRef.current[c] ?? 0) + velocitiesRef.current[c] * dt;
          next = ((next % meta.copyHeight) + meta.copyHeight) % meta.copyHeight;
          offsetsRef.current[c] = next;
        }

        el.style.transform = `translate3d(0, ${-(offsetsRef.current[c] ?? 0)}px, 0)`;
      }

      rafRef.current = requestAnimationFrame(animate);
    };

    rafRef.current = requestAnimationFrame(animate);
    return () => {
      if (rafRef.current) cancelAnimationFrame(rafRef.current);
      rafRef.current = null;
      lastTsRef.current = null;
    };
  }, [
    baseVelocities,
    columnMeta,
    pauseOnHover,
    parallax,
    reduced,
    onScreen,
    applyPlaneTransform,
  ]);

  const cssVars = useMemo<CSSProperties>(
    () =>
      ({
        "--dw-tile-w": `${tileWidth}px`,
        "--dw-tile-h": `${tileHeight}px`,
        "--dw-gap": `${gap}px`,
        "--dw-radius": `${radius}px`,
        "--dw-dim": dim,
        "--dw-gray": grayscale ? 1 : 0,
        "--dw-overlay": overlayColor,
        "--dw-edge": `${Math.max(0, (1 - fade) * 100)}%`,
        perspective: "1200px",
        perspectiveOrigin: "50% 50%",
        // Two functional gradients, not decoration: one dissolves the wall
        // into the page, the other softens the top and bottom edges.
        maskImage:
          "radial-gradient(ellipse 82% 86% at 50% 46%, #000 var(--dw-edge), transparent 100%), " +
          "linear-gradient(to top, #000 var(--dw-edge), transparent 100%)",
        WebkitMaskImage:
          "radial-gradient(ellipse 82% 86% at 50% 46%, #000 var(--dw-edge), transparent 100%), " +
          "linear-gradient(to top, #000 var(--dw-edge), transparent 100%)",
        WebkitMaskComposite: "source-in",
        maskComposite: "intersect",
      }) as CSSProperties,
    [tileWidth, tileHeight, gap, radius, dim, grayscale, overlayColor, fade],
  );

  return (
    <div
      ref={containerRef}
      aria-hidden="true"
      className={cn("relative size-full overflow-hidden", className)}
      style={cssVars}
      onPointerEnter={() => {
        hoveredRef.current = true;
      }}
      onPointerLeave={() => {
        hoveredRef.current = false;
        pointerRef.current = { x: 0, y: 0 };
      }}
      onPointerMove={(e) => {
        if (parallax <= 0 || reduced) return;
        const rect = containerRef.current?.getBoundingClientRect();
        if (!rect) return;
        pointerRef.current = {
          x: (e.clientX - rect.left) / rect.width - 0.5,
          y: (e.clientY - rect.top) / rect.height - 0.5,
        };
      }}
    >
      <div
        ref={planeRef}
        className="absolute top-1/2 flex flex-row [transform-style:preserve-3d] [transform-origin:50%_50%] will-change-transform"
        style={{ left: planeX }}
      >
        {columnItems.map((col, c) => {
          const meta = columnMeta[c];
          return (
            <div
              key={`col-${c}`}
              className="relative w-[calc(var(--dw-tile-w)+var(--dw-gap))] [transform-style:preserve-3d]"
            >
              <div
                className="flex flex-col [transform-style:preserve-3d] will-change-transform"
                ref={(el) => {
                  trackRefs.current[c] = el;
                }}
              >
                {Array.from({ length: meta.copies }, (_, copyIndex) =>
                  col.map((item, itemIndex) => (
                    <div
                      key={`${copyIndex}-${itemIndex}`}
                      className="relative h-[calc(var(--dw-tile-h)+var(--dw-gap))] w-[var(--dw-tile-w)] flex-none"
                    >
                      <div className="absolute inset-[calc(var(--dw-gap)/2)] overflow-hidden rounded-[var(--dw-radius)] bg-[#0b0b12] opacity-[var(--dw-dim)] [transform:translateZ(0)]">
                        <Image
                          src={item.image}
                          alt=""
                          fill
                          sizes={`${tileWidth}px`}
                          loading="lazy"
                          draggable={false}
                          className="object-cover [filter:grayscale(var(--dw-gray))_saturate(0.92)]"
                        />
                        <span
                          aria-hidden="true"
                          className="absolute inset-0 bg-[var(--dw-overlay)] opacity-35"
                        />
                      </div>
                    </div>
                  )),
                )}
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}