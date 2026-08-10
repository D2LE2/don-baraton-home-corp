"use client";

import { AnimatePresence, motion } from "framer-motion";
import { useEffect, useState } from "react";

const ANNOUNCEMENTS = [
  "Omar Corp · Indiana",
  "14 viviendas vendidas",
  "13 familias en su hogar",
  "Listas privadas · acceso anticipado",
  "Residencias en obra · documentadas en vivo",
  "Prioridad real antes del mercado",
];

/** Black strip under featured residence — brand + proof announcements */
export function OmarAnnouncementBand() {
  const [index, setIndex] = useState(0);

  useEffect(() => {
    const id = window.setInterval(() => {
      setIndex((i) => (i + 1) % ANNOUNCEMENTS.length);
    }, 3200);
    return () => window.clearInterval(id);
  }, []);

  return (
    <section className="relative overflow-hidden bg-[#0a0908] text-white">
      <div className="pointer-events-none absolute inset-0 bg-[radial-gradient(ellipse_at_center,rgba(224,197,122,0.08),transparent_60%)]" />

      <div className="relative mx-auto flex max-w-[1100px] flex-col items-center gap-5 px-5 py-10 md:flex-row md:justify-between md:gap-8 md:px-12 md:py-12 lg:px-16">
        <div className="text-center md:text-left">
          <p className="text-[10px] tracking-[0.4em] text-[#e0c57a] uppercase">Omar Corp</p>
          <p className="mt-2 text-[13px] text-white/45 md:max-w-xs">
            Transformaciones reales. Acceso privado.
          </p>
        </div>

        <div className="flex min-h-[2.5rem] w-full max-w-md items-center justify-center md:justify-end">
          <AnimatePresence mode="wait">
            <motion.p
              key={index}
              initial={{ opacity: 0, y: 8 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -6 }}
              transition={{ duration: 0.35 }}
              className="text-center text-[15px] tracking-[0.08em] text-white/90 uppercase md:text-right md:text-base"
            >
              {ANNOUNCEMENTS[index]}
            </motion.p>
          </AnimatePresence>
        </div>

        <div className="hidden items-center gap-6 lg:flex">
          <div className="text-right">
            <p className="text-2xl font-light tabular-nums text-[#e0c57a]">14</p>
            <p className="mt-0.5 text-[9px] tracking-[0.2em] text-white/40 uppercase">
              Vendidas
            </p>
          </div>
          <div className="h-8 w-px bg-white/15" />
          <div className="text-right">
            <p className="text-2xl font-light tabular-nums text-[#e0c57a]">13</p>
            <p className="mt-0.5 text-[9px] tracking-[0.2em] text-white/40 uppercase">
              Familias
            </p>
          </div>
        </div>
      </div>

      <div className="border-t border-white/10">
        <div className="mx-auto flex max-w-[1100px] gap-6 overflow-hidden px-5 py-3 md:px-12 lg:px-16">
          <div className="flex animate-[omar-marquee_28s_linear_infinite] gap-10 whitespace-nowrap text-[10px] tracking-[0.22em] text-white/35 uppercase">
            {[...ANNOUNCEMENTS, ...ANNOUNCEMENTS].map((line, i) => (
              <span key={`${line}-${i}`} className="inline-flex items-center gap-10">
                {line}
                <span className="text-[#e0c57a]/50">·</span>
              </span>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}
