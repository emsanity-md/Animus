"use client";

/**
 * CountUp — from reactbits.dev (Text Animations / Count Up),
 * ported to TypeScript.
 *
 * One deliberate change from the original: the final value is rendered
 * as real text in the server HTML, and the animation only takes over the
 * node once it runs. The reactbits version starts from an empty span, so
 * the number is invisible without JavaScript and flashes at 0 for
 * reduced-motion users before settling. Here, no-JS and reduced-motion
 * both read the correct figure immediately.
 */

import {
  useMotionValue,
  useReducedMotion,
  useSpring,
  useInView,
} from "motion/react";
import { useEffect, useRef } from "react";

export interface CountUpProps {
  to: number;
  from?: number;
  /** seconds. */
  duration?: number;
  /** seconds to wait after entering the viewport. */
  delay?: number;
  className?: string;
}

const format = (value: number) =>
  new Intl.NumberFormat("en-US", { maximumFractionDigits: 0 }).format(
    Math.round(value),
  );

export function CountUp({
  to,
  from = 0,
  duration = 1.4,
  delay = 0,
  className = "",
}: CountUpProps) {
  const ref = useRef<HTMLSpanElement>(null);
  const reducedMotion = useReducedMotion();
  const isInView = useInView(ref, { once: true, margin: "0px" });

  const motionValue = useMotionValue(from);
  const springValue = useSpring(motionValue, {
    damping: 20 + 40 * (1 / duration),
    stiffness: 100 * (1 / duration),
  });

  useEffect(() => {
    if (!isInView || reducedMotion) return;

    const node = ref.current;
    if (node) node.textContent = format(from);

    const startId = setTimeout(() => motionValue.set(to), delay * 1000);

    return () => {
      clearTimeout(startId);
      if (node) node.textContent = format(to);
    };
  }, [isInView, reducedMotion, motionValue, from, to, delay]);

  useEffect(() => {
    const unsubscribe = springValue.on("change", (latest) => {
      const node = ref.current;
      if (node) node.textContent = format(latest);
    });
    return () => unsubscribe();
  }, [springValue]);

  return (
    <span className={className} ref={ref}>
      {format(to)}
    </span>
  );
}