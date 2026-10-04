"use client";

import { useEffect, useRef, useState } from "react";
import Image from "next/image";
import { cn } from "cn";

/**
 * 1. The frame. `aspect-[0.707]` rather than `aspect-2/3`, because AniList
 *    covers are not 2:3 — see COVER_RATIO in src/lib/poster-art.ts for the
 *    measured spread. A 2:3 frame crops the sides off every poster it was
 *    given. The flat fill means the box is the right shape before a byte of
 *    artwork arrives, which is what holds CLS at 0 across a grid of sixty
 *    remote covers.
 * 2. The fade. Covers are hotlinked from a third-party CDN, so on a cold
 *    cache they arrive late. Without this they pop in at full opacity, which
 *    on a grid of posters reads as a flicker rather than as loading.
 * 3. The already-cached case. `onLoad` does not fire for an image the browser
 *    had in hand before React attached the handler, so the ref check on mount
 *    is what stops a cached cover from sitting invisible at opacity 0.
 *
 * Deliberately not a skeleton: the flat fill IS the placeholder. A pulsing
 * skeleton behind every cover would be sixty animations competing with each
 * other for a page whose real content is the artwork.
 */
export function PosterImage({
  src,
  alt,
  sizes,
  quality,
  priority = false,
  className,
  imageClassName,
}: {
  src: string;
  alt: string;
  sizes: string;
  quality?: 75 | 90;
  priority?: boolean;
  /** Classes for the frame. */
  className?: string;
  /** Classes for the <img> itself, for hover transforms etc. */
  imageClassName?: string;
}) {
  const ref = useRef<HTMLImageElement>(null);
  const [loaded, setLoaded] = useState(false);

  useEffect(() => {
    if (ref.current?.complete) setLoaded(true);
  }, []);

  return (
    <div
      className={cn(
        "relative aspect-[0.707] overflow-hidden rounded-md bg-sand ring-1 ring-hairline",
        className,
      )}
    >
      <Image
        ref={ref}
        src={src}
        alt={alt}
        fill
        sizes={sizes}
        quality={quality}
        priority={priority}
        onLoad={() => setLoaded(true)}
        className={cn(
          "object-cover transition-opacity duration-500 ease-out",
          loaded ? "opacity-100" : "opacity-0",
          imageClassName,
        )}
      />
    </div>
  );
}
