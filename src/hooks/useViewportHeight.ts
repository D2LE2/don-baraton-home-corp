"use client";

import { useEffect, useState } from "react";

/**
 * Large viewport in px (≈ 100lvh). Must NOT use live innerHeight —
 * with the URL bar visible that value is too short and the next
 * section peeks; updating it later when the bar hides causes a jump.
 */
export function measureLargeViewportHeight() {
  if (typeof window === "undefined") return 0;

  const probe = document.createElement("div");
  probe.setAttribute("aria-hidden", "true");
  probe.style.cssText =
    "position:fixed;left:0;top:0;height:100lvh;width:0;visibility:hidden;pointer-events:none;";
  document.documentElement.appendChild(probe);
  let h = Math.round(probe.offsetHeight || 0);
  probe.remove();

  if (!h) {
    h = Math.max(
      window.innerHeight || 0,
      document.documentElement?.clientHeight || 0,
      window.screen?.height || 0,
    );
  }

  // 1px buffer kills subpixel peeks on some Android browsers
  return h > 0 ? h + 1 : 0;
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
      const h = measureLargeViewportHeight();
      if (h <= 0) return;

      locked = h;
      setHeight(h);
      document.documentElement.style.setProperty("--app-vh", `${h}px`);
    };

    apply(true);

    const onResize = () => apply(false);
    const onOrientation = () => {
      window.setTimeout(() => apply(true), 250);
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
