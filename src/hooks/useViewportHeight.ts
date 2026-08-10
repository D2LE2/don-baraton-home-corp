"use client";

import { useEffect, useState } from "react";

/**
 * Measure once and lock. Mobile browsers fire resize when the URL bar
 * shows/hides — updating height mid-scroll jumps the page.
 * Only remeasure on real width / orientation changes.
 */
export function measureAppVh() {
  if (typeof window === "undefined") return 0;
  return Math.max(
    window.innerHeight || 0,
    document.documentElement?.clientHeight || 0,
  );
}

export function useViewportHeight() {
  const [height, setHeight] = useState(0);

  useEffect(() => {
    let locked = 0;
    let lastWidth = window.innerWidth;

    const apply = (force: boolean) => {
      const w = window.innerWidth;
      const widthChanged = Math.abs(w - lastWidth) >= 8;
      if (!force && locked > 0 && !widthChanged) return;

      lastWidth = w;
      const h = measureAppVh();
      if (!force && locked > 0 && Math.abs(h - locked) < 24 && !widthChanged) {
        return;
      }

      locked = h;
      setHeight(h);
      document.documentElement.style.setProperty("--app-vh", `${h}px`);
    };

    apply(true);

    const onResize = () => apply(false);
    const onOrientation = () => {
      window.setTimeout(() => apply(true), 200);
    };

    window.addEventListener("resize", onResize);
    window.addEventListener("orientationchange", onOrientation);

    return () => {
      window.removeEventListener("resize", onResize);
      window.removeEventListener("orientationchange", onOrientation);
    };
  }, []);

  return height;
}
