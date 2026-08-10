"use client";

import { useEffect, useMemo, useState } from "react";
import { residences } from "@/data/residences";

function seedFrom(id: string) {
  return id.split("").reduce((acc, ch) => acc + ch.charCodeAt(0), 0);
}

function baseFor(id: string) {
  return 8 + (seedFrom(id) % 16);
}

/** Live viewer counts for every residence — gentle realtime fluctuation. */
export function useLiveViewersMap(activeId: string) {
  const initial = useMemo(() => {
    const map: Record<string, number> = {};
    residences.forEach((r) => {
      map[r.id] = baseFor(r.id);
    });
    return map;
  }, []);

  const [viewers, setViewers] = useState(initial);

  useEffect(() => {
    const tick = window.setInterval(() => {
      setViewers((prev) => {
        const next = { ...prev };
        residences.forEach((r) => {
          const current = next[r.id] ?? baseFor(r.id);
          const chance = r.id === activeId ? 0.78 : 0.5;
          if (Math.random() > chance) return;
          const delta = Math.random() > 0.48 ? 1 : -1;
          next[r.id] = Math.max(3, Math.min(48, current + delta));
        });
        return next;
      });
    }, 2400);
    return () => window.clearInterval(tick);
  }, [activeId]);

  return viewers;
}
