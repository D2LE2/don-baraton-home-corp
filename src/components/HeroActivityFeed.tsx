"use client";

import { AnimatePresence, motion } from "framer-motion";
import { useEffect, useState } from "react";
import { residences } from "@/data/residences";

type ActivityItem = {
  id: number;
  accent: "gold" | "mute" | "soft";
  line: string;
  meta: string;
};

const INITIALS = ["S.M.", "C.R.", "A.V.", "L.P.", "M.G.", "D.H.", "I.T.", "J.N."];

function ago(seconds: number) {
  if (seconds < 45) return "hace un momento";
  if (seconds < 90) return "hace 1 min";
  if (seconds < 3600) return `hace ${Math.round(seconds / 60)} min`;
  return `hace ${Math.round(seconds / 3600)} h`;
}

/** Compact, discreet live activity — waitlist + presence, no playful chrome */
export function HeroActivityFeed() {
  const [visible, setVisible] = useState(false);
  const [item, setItem] = useState<ActivityItem | null>(null);
  const [waitlists, setWaitlists] = useState(() =>
    Object.fromEntries(residences.map((r) => [r.id, r.waitlistCount])),
  );

  useEffect(() => {
    let cancelled = false;
    let tick = 0;
    let hideTimer: number | undefined;
    const listCounts: Record<string, number> = Object.fromEntries(
      residences.map((r) => [r.id, r.waitlistCount]),
    );

    const showNext = () => {
      if (cancelled) return;
      tick += 1;
      const person = INITIALS[tick % INITIALS.length];
      const residence = residences[tick % residences.length];
      const mode = tick % 5; // bias toward waitlist

      let next: Omit<ActivityItem, "id">;

      if (mode === 0 || mode === 1 || mode === 2) {
        listCounts[residence.id] = (listCounts[residence.id] ?? residence.waitlistCount) + 1;
        setWaitlists({ ...listCounts });
        const count = listCounts[residence.id];
        next = {
          accent: "gold",
          line: `${person} · lista de espera · ${residence.code}`,
          meta: `${count} en espera · ${residence.location.split(",")[0]} · ${ago(6 + (tick % 50))}`,
        };
      } else if (mode === 3) {
        const viewers = 4 + ((residence.followers + tick) % 6);
        next = {
          accent: "soft",
          line: `${viewers} viendo ${residence.code}`,
          meta: `${residence.location.split(",")[0]} · ${ago(tick % 30)}`,
        };
      } else {
        next = {
          accent: "mute",
          line: `Cierre vía Omar Corp`,
          meta: `${11 + (tick % 3)} residencias · Indiana · ${ago(1200)}`,
        };
      }

      setItem({ ...next, id: tick });
      setVisible(true);
      hideTimer = window.setTimeout(() => {
        if (!cancelled) setVisible(false);
      }, 3600);
    };

    const start = window.setTimeout(showNext, 2400);
    const loop = window.setInterval(showNext, 7000);

    return () => {
      cancelled = true;
      window.clearTimeout(start);
      window.clearInterval(loop);
      if (hideTimer) window.clearTimeout(hideTimer);
    };
  }, []);

  return (
    <div
      className="pointer-events-none absolute bottom-20 left-4 z-20 w-[min(70%,200px)] md:bottom-24 md:left-5 md:w-[214px]"
      aria-live="polite"
    >
      <div className="border border-white/12 bg-black/50 px-2 py-1.5 backdrop-blur-sm">
        <p className="text-[7px] tracking-[0.24em] text-white/40 uppercase">
          Lista de espera · en vivo
        </p>
        <ul className="mt-1 space-y-0.5">
          {residences.map((r) => (
            <li
              key={r.id}
              className="flex items-baseline justify-between gap-2 text-[9px] text-white/70"
            >
              <span className="truncate tracking-[0.08em] uppercase">{r.code.replace("RESIDENCE ", "R.")}</span>
              <motion.span
                key={waitlists[r.id]}
                initial={{ opacity: 0.4 }}
                animate={{ opacity: 1 }}
                className="font-medium text-[#e0c57a] tabular-nums"
              >
                {waitlists[r.id] ?? r.waitlistCount}
              </motion.span>
            </li>
          ))}
        </ul>
      </div>

      <AnimatePresence mode="wait">
        {visible && item && (
          <motion.div
            key={item.id}
            initial={{ opacity: 0, y: 4 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.3 }}
            className="mt-1.5 border border-white/12 bg-black/55 px-2 py-1.5 backdrop-blur-sm"
          >
            <div className="flex items-center gap-1.5">
              <span
                className={`h-px w-2.5 shrink-0 ${
                  item.accent === "gold"
                    ? "bg-[#e0c57a]"
                    : item.accent === "mute"
                      ? "bg-white/55"
                      : "bg-white/30"
                }`}
              />
              <p className="min-w-0 truncate text-[9px] leading-tight text-white/85">
                {item.line}
              </p>
            </div>
            <p className="mt-0.5 pl-[14px] text-[8px] text-white/40">{item.meta}</p>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
