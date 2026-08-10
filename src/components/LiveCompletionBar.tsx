"use client";

import { motion } from "framer-motion";
import { useEffect, useState } from "react";
import { AnimatedCounter } from "@/components/AnimatedCounter";

function useSoftLiveProgress(base: number) {
  const [live, setLive] = useState(base);

  useEffect(() => {
    const tick = window.setInterval(() => {
      setLive((v) => {
        if (v >= Math.min(99.9, base + 1.2)) return v;
        if (Math.random() > 0.55) return v;
        return Math.round((v + 0.1) * 10) / 10;
      });
    }, 2800);
    return () => window.clearInterval(tick);
  }, [base]);

  return live;
}

/** Live completion progress bar with soft realtime ticks. */
export function LiveCompletionBar({
  baseProgress,
  residenceId,
}: {
  baseProgress: number;
  residenceId: string;
}) {
  const live = useSoftLiveProgress(baseProgress);
  const whole = Math.floor(live);
  const tenth = Math.round((live % 1) * 10);

  return (
    <div className="mt-4 rounded-xl border border-white/10 bg-white/[0.03] px-3.5 py-3.5">
      <div className="mb-2.5 flex items-end justify-between gap-3">
        <div>
          <p className="flex items-center gap-2 text-[9px] tracking-[0.28em] text-[#c4a574] uppercase">
            <span className="live-dot !bg-[#e0c57a]" />
            Progreso de terminación · en vivo
          </p>
          <p className="mt-1.5 flex items-baseline gap-1 text-white">
            <AnimatedCounter
              value={whole}
              className="display text-3xl font-light tabular-nums md:text-4xl"
            />
            <span className="text-lg text-white/50 tabular-nums">.{tenth}</span>
            <span className="ml-1 text-[11px] tracking-[0.2em] text-white/45 uppercase">
              %
            </span>
          </p>
        </div>
        <p className="pb-1 text-right text-[9px] tracking-[0.16em] text-white/40 uppercase">
          Actualiza en tiempo real
        </p>
      </div>

      <div className="relative h-2.5 overflow-hidden rounded-full bg-white/10">
        <motion.div
          key={residenceId}
          className="absolute inset-y-0 left-0 rounded-full bg-gradient-to-r from-[#9a8660] via-[#e0c57a] to-[#f0d78a]"
          initial={{ width: 0 }}
          animate={{ width: `${Math.min(100, live)}%` }}
          transition={{ duration: 0.55, ease: [0.22, 1, 0.36, 1] }}
        />
        <motion.div
          className="pointer-events-none absolute inset-y-0 w-16 bg-gradient-to-r from-transparent via-white/35 to-transparent"
          animate={{ left: ["-20%", "110%"] }}
          transition={{ duration: 2.4, repeat: Infinity, ease: "linear", repeatDelay: 1.1 }}
        />
      </div>
    </div>
  );
}
