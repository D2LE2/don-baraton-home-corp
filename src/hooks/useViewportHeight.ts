"use client";

import { useEffect, useState } from "react";

/** Exact visible viewport height — avoids svh/dvh gaps that peek the next section. */
export function useViewportHeight() {
  const [height, setHeight] = useState(0);

  useEffect(() => {
    const apply = () => {
      const h = Math.round(window.visualViewport?.height ?? window.innerHeight);
      setHeight(h);
      document.documentElement.style.setProperty("--app-vh", `${h}px`);
    };

    apply();
    window.addEventListener("resize", apply);
    window.addEventListener("orientationchange", apply);
    window.visualViewport?.addEventListener("resize", apply);
    window.visualViewport?.addEventListener("scroll", apply);

    return () => {
      window.removeEventListener("resize", apply);
      window.removeEventListener("orientationchange", apply);
      window.visualViewport?.removeEventListener("resize", apply);
      window.visualViewport?.removeEventListener("scroll", apply);
    };
  }, []);

  return height;
}
