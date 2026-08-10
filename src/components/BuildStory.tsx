"use client";

import Image from "next/image";
import { motion, AnimatePresence } from "framer-motion";
import { Play, X } from "lucide-react";
import { useState } from "react";
import type { BuildStage } from "@/data/residences";

export function BuildStory({ stages }: { stages: BuildStage[] }) {
  const storyStages = stages.filter((s) => s.status !== "upcoming" || s.id === stages.find((x) => x.status === "upcoming")?.id);
  const visible = stages.filter((s) => s.status === "done" || s.status === "current");
  const [active, setActive] = useState<BuildStage | null>(null);

  return (
    <section className="px-5 py-16 md:px-10">
      <div className="mx-auto max-w-3xl">
        <p className="text-[11px] tracking-[0.3em] text-gold uppercase">The Build Story</p>
        <h2 className="mt-3 text-3xl font-light tracking-wide text-ink md:text-4xl">
          WATCH IT BECOME HOME.
        </h2>
        <p className="mt-3 max-w-xl text-sm leading-relaxed text-muted">
          Arrastra la historia. Cada etapa documenta cómo esta propiedad pasó de terreno vacío a
          residencia moderna.
        </p>

        <div className="relative mt-12">
          <div className="absolute top-0 bottom-0 left-[19px] w-px bg-gradient-to-b from-gold via-border to-transparent md:left-1/2 md:-translate-x-px" />

          <ul className="space-y-10">
            {visible.map((stage, i) => (
              <motion.li
                key={stage.id}
                initial={{ opacity: 0, y: 24 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true, margin: "-40px" }}
                transition={{ duration: 0.5, delay: i * 0.05 }}
                className="relative grid gap-4 md:grid-cols-2 md:gap-10"
              >
                <div
                  className={`flex items-start gap-4 md:contents ${
                    i % 2 === 1 ? "md:flex-row-reverse" : ""
                  }`}
                >
                  <div className="relative z-10 flex h-10 w-10 shrink-0 items-center justify-center rounded-full border border-gold bg-white md:absolute md:left-1/2 md:-translate-x-1/2">
                    <span
                      className={`h-2.5 w-2.5 rounded-full ${
                        stage.status === "current" ? "animate-pulse-gold bg-gold" : "bg-gold"
                      }`}
                    />
                  </div>

                  <button
                    type="button"
                    onClick={() => setActive(stage)}
                    className={`ml-2 w-full text-left md:ml-0 ${
                      i % 2 === 0 ? "md:pr-16 md:text-right" : "md:col-start-2 md:pl-16"
                    }`}
                  >
                    <p className="text-[11px] tracking-[0.25em] text-gold uppercase">{stage.date}</p>
                    <h3 className="mt-1 text-xl font-medium tracking-wide text-ink">{stage.label}</h3>
                    <p className="mt-2 text-sm text-muted">{stage.description}</p>
                    {stage.status === "current" && (
                      <p className="mt-2 text-[11px] tracking-[0.2em] text-gold uppercase">
                        In progress
                      </p>
                    )}
                  </button>

                  <button
                    type="button"
                    onClick={() => setActive(stage)}
                    className={`group relative ml-14 overflow-hidden rounded-2xl md:ml-0 ${
                      i % 2 === 0
                        ? "md:col-start-2 md:pl-16"
                        : "md:col-start-1 md:row-start-1 md:pr-16"
                    }`}
                  >
                    <div className="relative aspect-[4/3] overflow-hidden rounded-2xl">
                      <Image
                        src={stage.images[0]}
                        alt={stage.label}
                        fill
                        className="object-cover transition duration-700 group-hover:scale-105"
                        sizes="(max-width: 768px) 90vw, 360px"
                      />
                      {stage.hasVideo && (
                        <span className="absolute inset-0 flex items-center justify-center bg-black/20">
                          <span className="flex h-12 w-12 items-center justify-center rounded-full bg-white/90 text-ink">
                            <Play size={18} fill="currentColor" />
                          </span>
                        </span>
                      )}
                    </div>
                  </button>
                </div>
              </motion.li>
            ))}
          </ul>

          {storyStages.length > 0 && (
            <p className="mt-10 text-center text-[11px] tracking-[0.2em] text-muted uppercase">
              Toca cualquier etapa para ver fotos y detalles
            </p>
          )}
        </div>
      </div>

      <AnimatePresence>
        {active && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-50 flex items-end justify-center bg-black/50 p-4 backdrop-blur-sm md:items-center"
            onClick={() => setActive(null)}
          >
            <motion.div
              initial={{ y: 40, opacity: 0 }}
              animate={{ y: 0, opacity: 1 }}
              exit={{ y: 40, opacity: 0 }}
              onClick={(e) => e.stopPropagation()}
              className="max-h-[85vh] w-full max-w-lg overflow-y-auto rounded-3xl bg-white p-5 shadow-2xl"
            >
              <div className="mb-4 flex items-start justify-between">
                <div>
                  <p className="text-[11px] tracking-[0.25em] text-gold uppercase">{active.date}</p>
                  <h3 className="mt-1 text-2xl font-light text-ink">{active.label}</h3>
                </div>
                <button
                  type="button"
                  aria-label="Cerrar"
                  onClick={() => setActive(null)}
                  className="rounded-full bg-black/5 p-2"
                >
                  <X size={18} />
                </button>
              </div>
              <div className="relative aspect-[4/3] overflow-hidden rounded-2xl">
                <Image src={active.images[0]} alt={active.label} fill className="object-cover" />
              </div>
              <p className="mt-4 text-sm leading-relaxed text-muted">{active.description}</p>
              {active.hasVideo && (
                <p className="mt-3 text-[11px] tracking-[0.2em] text-gold uppercase">
                  Video disponible en esta etapa
                </p>
              )}
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </section>
  );
}
