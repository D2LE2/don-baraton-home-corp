"use client";

import { AnimatePresence, motion } from "framer-motion";
import { Eye, Home } from "lucide-react";
import { useEffect, useMemo, useState } from "react";
import { residences } from "@/data/residences";

type ActivityKind = "viewing" | "purchased";

type ActivityItem = {
  id: number;
  kind: ActivityKind;
  title: string;
  detail: string;
};

const FIRST = ["Sofía M.", "Carlos R.", "Ana V.", "Luis P.", "María G.", "Diego H."];
const CITIES = ["Indianapolis", "Fort Wayne", "South Bend", "Carmel", "Fishers"];

function relativeAgo(minutes: number) {
  if (minutes < 1) return "hace unos segundos";
  if (minutes === 1) return "hace 1 min";
  if (minutes < 60) return `hace ${minutes} min`;
  const h = Math.floor(minutes / 60);
  return h === 1 ? "hace 1 h" : `hace ${h} h`;
}

/** Soft live toasts — quieter, more believable social proof */
export function HeroActivityFeed() {
  const [visible, setVisible] = useState(false);
  const [item, setItem] = useState<ActivityItem | null>(null);

  const pool = useMemo(() => {
    const r0 = residences[0];
    const r1 = residences[1];
    const viewersNow = 6 + (r0.followers % 5); // 6–10 feels real, not inflated
    const closedYtd = 11;

    const items: Omit<ActivityItem, "id">[] = [
      {
        kind: "viewing",
        title: `${viewersNow} personas viendo residencias`,
        detail: `${relativeAgo(0)} · en la plataforma`,
      },
      {
        kind: "purchased",
        title: `${FIRST[1]} cerró una compra`,
        detail: `${CITIES[0]} · vía Omar Corp · ${relativeAgo(14)}`,
      },
      {
        kind: "viewing",
        title: `${FIRST[0]} abrió ${r0.code}`,
        detail: `${r0.location} · ${relativeAgo(2)}`,
      },
      {
        kind: "purchased",
        title: `${closedYtd} residencias entregadas con Omar Corp`,
        detail: `Indiana · actualizado hoy`,
      },
      {
        kind: "viewing",
        title: `${3 + (r0.waitlistCount % 4)} mirando ${r1?.code ?? r0.code}`,
        detail: `${r1?.location ?? r0.location} · ${relativeAgo(5)}`,
      },
      {
        kind: "purchased",
        title: `${FIRST[4]} reservó preventa`,
        detail: `${CITIES[3]} · Omar Private · ${relativeAgo(38)}`,
      },
      {
        kind: "viewing",
        title: `${FIRST[2]} sigue el avance de ${r0.code}`,
        detail: `${r0.progress}% transformada · ${relativeAgo(1)}`,
      },
    ];
    return items;
  }, []);

  useEffect(() => {
    let cancelled = false;
    let tick = 0;
    let hideTimer: number | undefined;

    const showNext = () => {
      if (cancelled) return;
      const next = pool[tick % pool.length];
      tick += 1;
      setItem({ ...next, id: tick });
      setVisible(true);
      hideTimer = window.setTimeout(() => {
        if (!cancelled) setVisible(false);
      }, 4200);
    };

    const start = window.setTimeout(showNext, 2200);
    const loop = window.setInterval(showNext, 6800);

    return () => {
      cancelled = true;
      window.clearTimeout(start);
      window.clearInterval(loop);
      if (hideTimer) window.clearTimeout(hideTimer);
    };
  }, [pool]);

  return (
    <div
      className="pointer-events-none absolute top-4 left-4 z-30 w-[min(100%-2rem,292px)] md:top-5 md:left-5"
      aria-live="polite"
    >
      <AnimatePresence mode="wait">
        {visible && item && (
          <motion.div
            key={item.id}
            initial={{ opacity: 0, y: -8, x: -4 }}
            animate={{ opacity: 1, y: 0, x: 0 }}
            exit={{ opacity: 0, y: -4 }}
            transition={{ duration: 0.4, ease: [0.22, 1, 0.36, 1] }}
            className="flex items-start gap-2.5 rounded-lg border border-white/70 bg-white/92 px-3 py-2.5 shadow-[0_10px_28px_rgba(20,16,10,0.16)] backdrop-blur-md"
          >
            <span
              className={`mt-0.5 flex h-7 w-7 shrink-0 items-center justify-center rounded-full ${
                item.kind === "viewing"
                  ? "bg-[#f0ebe3] text-[#7a6540]"
                  : "bg-ink text-[#e0c57a]"
              }`}
            >
              {item.kind === "viewing" ? <Eye size={13} /> : <Home size={13} />}
            </span>
            <div className="min-w-0 pt-0.5">
              <p className="text-[11.5px] leading-snug font-medium text-ink">{item.title}</p>
              <p className="mt-0.5 text-[10px] text-[#8a847a]">{item.detail}</p>
            </div>
            <span className="mt-1 ml-auto h-1.5 w-1.5 shrink-0 rounded-full bg-emerald-500/80" />
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
