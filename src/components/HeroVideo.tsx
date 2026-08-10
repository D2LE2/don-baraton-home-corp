"use client";

import { useEffect, useRef, useState } from "react";

type HeroVideoProps = {
  src: string;
  className?: string;
  objectPosition?: string;
  "aria-label"?: string;
  "aria-hidden"?: boolean;
};

/**
 * Autoplay video that stays on a solid surface until the first frame is ready —
 * no poster image flash while buffering.
 */
export function HeroVideo({
  src,
  className = "",
  objectPosition = "center",
  "aria-label": ariaLabel,
  "aria-hidden": ariaHidden,
}: HeroVideoProps) {
  const ref = useRef<HTMLVideoElement>(null);
  const [ready, setReady] = useState(false);

  useEffect(() => {
    setReady(false);
    const el = ref.current;
    if (!el) return;

    const markReady = () => setReady(true);

    if (el.readyState >= 2) {
      markReady();
    }

    el.addEventListener("loadeddata", markReady);
    el.addEventListener("canplay", markReady);
    el.addEventListener("playing", markReady);

    const play = el.play();
    if (play) {
      play.catch(() => {
        /* autoplay can be blocked; still reveal when data lands */
      });
    }

    return () => {
      el.removeEventListener("loadeddata", markReady);
      el.removeEventListener("canplay", markReady);
      el.removeEventListener("playing", markReady);
    };
  }, [src]);

  return (
    <div className="absolute inset-0 bg-[#1a1814]">
      <video
        ref={ref}
        className={`absolute inset-0 h-full w-full object-cover transition-opacity duration-500 ease-out ${
          ready ? "opacity-100" : "opacity-0"
        } ${className}`}
        style={{ objectPosition }}
        src={src}
        autoPlay
        muted
        loop
        playsInline
        preload="auto"
        controls={false}
        disablePictureInPicture
        aria-label={ariaLabel}
        aria-hidden={ariaHidden}
      />
    </div>
  );
}
