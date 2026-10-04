"use client";

/**
 * Reveal — a scroll-triggered entrance for whole blocks.
 *
 * This one is not from reactbits: every one of those components animates
 * an element in a particular way, and what the bands here need is a
 * single, quiet, consistent 12px rise. Animating 20 nodes individually
 * would be more code and more motion for the same result.
 *
 * Uses the same `useInView` primitive as CountUp, and drives plain CSS
 * custom-property classes so the browser owns the compositing.
 */

import { useInView } from "motion/react";
import { useRef } from "react";
import { cn } from "cn";

export interface RevealProps {
  children: React.ReactNode;
  className?: string;
  /** ms. Stagger between siblings, capped by the caller. */
  delay?: number;
}

export function Reveal({ children, className, delay = 0 }: RevealProps) {
  const ref = useRef<HTMLDivElement>(null);
  const isInView = useInView(ref, { once: true, margin: "-12% 0px" });

  return (
    <div
      ref={ref}
      className={cn("reveal", isInView && "reveal-shown", className)}
      style={delay ? ({ "--reveal-delay": `${delay}ms` } as React.CSSProperties) : undefined}
    >
      {children}
    </div>
  );
}