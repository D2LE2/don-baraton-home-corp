"use client";

import { AnimatePresence, motion } from "framer-motion";
import { useEffect, useState } from "react";

const ANNOUNCEMENTS = [
  "Omar Corp · Indiana",
  "14 viviendas vendidas",
  "13 familias en su hogar",
  "Listas privadas · acceso anticipado",
  "Residencias en obra · documentadas en vivo",
];

/** Slim proof strip — calm, readable, not a second hero */
export function OmarAnnouncementBand() {
  const [index, setIndex] = useState(0);

  useEffect(() => {
    const id = window.setInterval(() => {
      setIndex((i) => (i + 1) % ANNOUNCEMENTS.length);
    }, 3400);
    return () => window.clearInterval(id);
  }, []);

  return (
    <section className="bg-[#111110] text-white">
      <div className="mx-auto flex max-w-[1180px] flex-col items-center justify-between gap-4 px-5 py-6 md:flex-row md:px-12 md:py-7 lg:px-16">
        <p className="text-[12px] font-medium tracking-[0.12em] text-[#e0c57a] uppercase">
          Omar Corp
        </p>

        <div className="flex min-h-[1.5rem] items-center justify-center">
          <AnimatePresence mode="wait">
            <motion.p
              key={index}
              initial={{ opacity: 0, y: 6 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -4 }}
              transition={{ duration: 0.3 }}
              className="text-center text-[14px] text-white/85 md:text-[15px]"
            >
              {ANNOUNCEMENTS[index]}
            </motion.p>
          </AnimatePresence>
        </div>

        <div className="flex items-center gap-5 text-[12px] text-white/45">
          <span>
            <span className="font-semibold text-[#e0c57a]">14</span> vendidas
          </span>
          <span className="h-3 w-px bg-white/15" />
          <span>
            <span className="font-semibold text-[#e0c57a]">13</span> familias
          </span>
        </div>
      </div>
    </section>
  );
}
