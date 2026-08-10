"use client";

import { AnimatePresence, motion } from "framer-motion";
import { useEffect, useState } from "react";
import { residences } from "@/data/residences";

const INITIALS = ["S.M.", "C.R.", "A.V.", "L.P.", "M.G.", "D.H."];

/**
 * Ultra-minimal live ticks for the headline banner — top-left only,
 * clear of progress (top-right) and CTAs (bottom).
 */
export function BannerLiveTicks() {
  const [online, setOnline] = useState(7);
  const [line, setLine] = useState<string | null>(null);
  const [lineId, setLineId] = useState(0);

  useEffect(() => {
    let cancelled = false;
    let tick = 0;
    let hideTimer: number | undefined;
    const lists = Object.fromEntries(residences.map((r) => [r.id, r.waitlistCount]));

    const pulse = () => {
      if (cancelled) return;
      tick += 1;
      const r = residences[tick % residences.length];
      const person = INITIALS[tick % INITIALS.length];
      const mode = tick % 4;

      setOnline((n) => Math.max(5, Math.min(14, n + (Math.random() > 0.5 ? 1 : -1))));

      let text: string;
      if (mode <= 2) {
        lists[r.id] = (lists[r.id] ?? r.waitlistCount) + 1;
        text = `${person} · lista ${r.code.replace("RESIDENCE ", "")} · ${lists[r.id]} en espera`;
      } else {
        text = `${4 + (tick % 5)} viendo ${r.code.replace("RESIDENCE ", "R.")} ahora`;
      }

      setLine(text);
      setLineId(tick);
      hideTimer = window.setTimeout(() => {
        if (!cancelled) setLine(null);
      }, 3200);
    };

    const start = window.setTimeout(pulse, 1800);
    const loop = window.setInterval(pulse, 5600);
    return () => {
      cancelled = true;
      window.clearTimeout(start);
      window.clearInterval(loop);
      if (hideTimer) window.clearTimeout(hideTimer);
    };
  }, []);

  return (
    <div className="pointer-events-none absolute top-[4.75rem] left-3 z-20 flex w-[min(72%,240px)] flex-col gap-1.5 md:top-[5.25rem] md:left-5 md:w-[260px]">
      <div className="flex items-center gap-2">
        <span className="relative flex h-1.5 w-1.5">
          <span className="absolute inline-flex h-full w-full animate-ping rounded-full bg-[#e0c57a] opacity-60" />
          <span className="relative inline-flex h-1.5 w-1.5 rounded-full bg-[#e0c57a]" />
        </span>
        <p className="text-[9px] tracking-[0.2em] text-white/70 uppercase tabular-nums">
          En vivo · {online}
        </p>
      </div>

      <AnimatePresence mode="wait">
        {line && (
          <motion.p
            key={lineId}
            initial={{ opacity: 0, y: -4 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.28 }}
            className="truncate border border-white/12 bg-black/50 px-2.5 py-1.5 text-[9px] tracking-[0.05em] text-white/80 uppercase backdrop-blur-sm md:text-[10px]"
          >
            {line}
          </motion.p>
        )}
      </AnimatePresence>
    </div>
  );
}
