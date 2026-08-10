"use client";

import { useEffect, useState } from "react";

/**
 * Large layout viewport height — never shrink to visualViewport.
 * visualViewport/dvh is shorter when browser chrome shows, which lets the
 * next section peek under the hero without scrolling.
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
    const apply = () => {
      const h = measureAppVh();
      setHeight(h);
      document.documentElement.style.setProperty("--app-vh", `${h}px`);
    };

    apply();
    window.addEventListener("resize", apply);
    window.addEventListener("orientationchange", apply);

    return () => {
      window.removeEventListener("resize", apply);
      window.removeEventListener("orientationchange", apply);
    };
  }, []);

  return height;
}
