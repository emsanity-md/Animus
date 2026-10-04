"use client";

/**
 * BlurText — from reactbits.dev (Text Animations / Blur Text),
 * ported to TypeScript and retuned for Animus.
 *
 * The original rises 50px with a 10px blur per word. That reads as a
 * dramatic title card; here the travel is 18px and the blur is short,
 * because the hero is a catalogue masthead rather than a film title.
 *
 * Reduced motion is handled entirely in CSS, not here. See the note on
 * `initial` below: branching on `useReducedMotion()` cannot work in an
 * app-router server component, because the server has no way to know the
 * visitor's preference and would render the opposite state.
 *
 * The `blur-text` class is load-bearing. Motion serialises `initial` into
 * the server HTML as inline `opacity: 0`, so without scripting the words
 * would never appear. The <noscript> block in the root layout uses that
 * class to force the real styles back, and a `prefers-reduced-motion` block
 * in globals.css does the same for visitors who suppress motion.
 */

import { motion, useReducedMotion } from "motion/react";
import { Fragment, useEffect, useMemo, useRef, useState } from "react";
import { cn } from "cn";

type Frame = Record<string, number | string>;

const buildKeyframes = (from: Frame, steps: Frame[]) => {
  const keys = new Set([
    ...Object.keys(from),
    ...steps.flatMap((s) => Object.keys(s)),
  ]);

  const keyframes: Record<string, (number | string)[]> = {};
  keys.forEach((k) => {
    keyframes[k] = [from[k], ...steps.map((s) => s[k])];
  });
  return keyframes;
};

/**
 * Module scope, not per-render state: these are the fixed motion
 * endpoints. Keeping them out of the component means the keyframe object
 * is stable across renders.
 */
const FROM: Frame = { filter: "blur(9px)", opacity: 0, y: 18 };
const TO: Frame[] = [
  { filter: "blur(3.5px)", opacity: 0.5, y: 4 },
  { filter: "blur(0px)", opacity: 1, y: 0 },
];
/** The finished state, used directly when motion is suppressed. */
const RESTING: Frame = { filter: "blur(0px)", opacity: 1, y: 0 };
const KEYFRAMES = buildKeyframes(FROM, TO);

export interface BlurTextProps {
  text: string;
  /** ms between words. */
  delay?: number;
  /** seconds per animation step. */
  stepDuration?: number;
  className?: string;
}

export function BlurText({
  text,
  delay = 55,
  stepDuration = 0.26,
  className = "",
}: BlurTextProps) {
  const reducedMotion = useReducedMotion();
  const [inView, setInView] = useState(false);
  const ref = useRef<HTMLSpanElement>(null);

  useEffect(() => {
    const node = ref.current;
    if (!node || reducedMotion) return;

    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setInView(true);
          observer.disconnect();
        }
      },
      { threshold: 0.1 },
    );

    observer.observe(node);
    return () => observer.disconnect();
  }, [reducedMotion]);

  const words = useMemo(() => text.split(" "), [text]);

  const stepCount = TO.length + 1;
  const totalDuration = stepDuration * (stepCount - 1);
  const times = Array.from(
    { length: stepCount },
    (_, i) => (stepCount === 1 ? 0 : i / (stepCount - 1)),
  );

  return (
    /*
     * Normal inline flow, NOT display: flex.
     *
     * Each word is its own inline-block so it can be animated independently,
     * and the separator between words is a real text node *between* those
     * inline-blocks. In an inline formatting context that whitespace renders
     * as a space, which is the whole point.
     *
     * The previous version made this a flex row and put a trailing space
     * inside each word's span instead. That does not work: whitespace at the
     * end of a line box is collapsed away, so every separator vanished and the
     * headline rendered as "WathanimeinUltraHD." Flex was only ever there to
     * stop words breaking mid-word, which inline-block already does on its own
     * — and inline-block additionally wraps at the spaces, which is what a
     * reader expects from a line of type.
     */
    <span ref={ref} className={cn("blur-text", className)}>
      {words.map((word, index) => (
        <Fragment key={`${word}-${index}`}>
          {index > 0 ? " " : null}
          <motion.span
            className="inline-block will-change-[transform,filter,opacity]"
            /*
             * `initial` is deliberately NOT branched on reducedMotion.
             *
             * `useReducedMotion()` returns null on the server and a boolean in
             * the browser, so `initial={reducedMotion ? false : FROM}` made the
             * two sides disagree: the server emitted `opacity: 0;
             * filter: blur(9px); translateY(18px)` and the reduced-motion
             * client rendered the finished state instead. React reported a
             * hydration mismatch on every word of the <h1>, and until hydration
             * ran the headline was invisible — which is exactly the failure the
             * <noscript> rules exist to prevent, just on a different code path.
             *
             * So the initial state is unconditional, and the preference is
             * honoured downstream in CSS (@media prefers-reduced-motion in
             * globals.css), which does not require the server to know it.
             */
            initial={FROM}
            animate={reducedMotion ? RESTING : inView ? KEYFRAMES : FROM}
            transition={
              reducedMotion
                ? { duration: 0 }
                : {
                    duration: totalDuration,
                    times,
                    delay: (index * delay) / 1000,
                    ease: [0.22, 1, 0.36, 1],
                  }
            }
          >
            {word}
          </motion.span>
        </Fragment>
      ))}
    </span>
  );
}