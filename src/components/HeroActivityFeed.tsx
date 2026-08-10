"use client";

import { AnimatePresence, motion } from "framer-motion";
import { Eye, Home } from "lucide-react";
import { useEffect, useState } from "react";
import { residences } from "@/data/residences";

type ActivityKind = "viewing" | "purchased";

type ActivityItem = {
  id: number;
  kind: ActivityKind;
  title: string;
  detail: string;
};

const PURCHASED_VIA_OMAR = 18;
const NAMES = ["Sofía", "Carlos", "Ana", "Luis", "María", "Diego", "Camila", "Andrés"];

function buildPool(): Omit<ActivityItem, "id">[] {
  const totalFollowers = residences.reduce((n, r) => n + r.followers, 0);
  const activeViewers = 11 + (totalFollowers % 9);

  return [
    {
      kind: "viewing",
      title: `${activeViewers} personas viendo casas ahora`,
      detail: "Actividad en vivo · Omar Corp",
    },
    {
      kind: "purchased",
      title: `${PURCHASED_VIA_OMAR} residencias cerradas`,
      detail: "Compradas a través de Omar Corp",
    },
    {
      kind: "viewing",
      title: `${NAMES[0]} está viendo ${residences[0].code}`,
      detail: residences[0].location,
    },
    {
      kind: "purchased",
      title: `${NAMES[2]} reservó una residencia`,
      detail: "Cierre confirmado vía Omar Corp",
    },
    {
      kind: "viewing",
      title: `${8 + (totalFollowers % 5)} mirando ${residences[1]?.code ?? "una residencia"}`,
      detail: "Progreso visible en tiempo real",
    },
    {
      kind: "purchased",
      title: `Otra casa vendida esta semana`,
      detail: `${PURCHASED_VIA_OMAR} totales con Omar Corp`,
    },
  ];
}

/** Soft live toasts: viewers + purchases through Omar Corp */
export function HeroActivityFeed() {
  const [visible, setVisible] = useState(false);
  const [item, setItem] = useState<ActivityItem | null>(null);
  const pool = buildPool();

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
      }, 3400);
    };

    const start = window.setTimeout(showNext, 1400);
    const loop = window.setInterval(showNext, 5200);

    return () => {
      cancelled = true;
      window.clearTimeout(start);
      window.clearInterval(loop);
      if (hideTimer) window.clearTimeout(hideTimer);
    };
    // pool is stable for session
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  return (
    <div
      className="pointer-events-none absolute top-4 left-4 z-30 w-[min(100%-2rem,280px)] md:top-5 md:left-5"
      aria-live="polite"
    >
      <AnimatePresence mode="wait">
        {visible && item && (
          <motion.div
            key={item.id}
            initial={{ opacity: 0, y: -10, scale: 0.98 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: -6, scale: 0.98 }}
            transition={{ duration: 0.35, ease: [0.22, 1, 0.36, 1] }}
            className="flex items-start gap-3 rounded-xl border border-[#ece7df] bg-white/95 px-3.5 py-3 shadow-[0_12px_32px_rgba(20,16,10,0.14)] backdrop-blur-sm"
          >
            <span
              className={`mt-0.5 flex h-8 w-8 shrink-0 items-center justify-center rounded-full ${
                item.kind === "viewing"
                  ? "bg-[#f3efe8] text-[#8a6b2e]"
                  : "bg-ink text-[#e0c57a]"
              }`}
            >
              {item.kind === "viewing" ? <Eye size={14} /> : <Home size={14} />}
            </span>
            <div className="min-w-0 pt-0.5">
              <p className="text-[12px] leading-snug font-medium text-ink">{item.title}</p>
              <p className="mt-0.5 text-[10px] tracking-[0.04em] text-[#8a847a]">{item.detail}</p>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
