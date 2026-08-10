"use client";

import Image from "next/image";
import Link from "next/link";
import {
  ArrowRight,
  ChevronLeft,
  ChevronRight,
  MapPin,
  Pause,
  Play,
} from "lucide-react";
import { AnimatePresence, motion } from "framer-motion";
import { useCallback, useEffect, useRef, useState } from "react";
import { residences } from "@/data/residences";
import { ProgressBar } from "@/components/ProgressBar";

/** Compact pro collection stage — video + overlay, no tall status stack */
export function VideoResidenceFeed() {
  const total = residences.length;
  const [index, setIndex] = useState(0);
  const [playing, setPlaying] = useState(true);
  const videoRef = useRef<HTMLVideoElement>(null);
  const current = residences[index];

  const goTo = useCallback(
    (i: number) => {
      const next = Math.max(0, Math.min(total - 1, i));
      if (next === index) return;
      setIndex(next);
      setPlaying(true);
    },
    [index, total],
  );

  const goNext = useCallback(() => {
    if (index < total - 1) goTo(index + 1);
  }, [goTo, index, total]);

  const goPrev = useCallback(() => {
    if (index > 0) goTo(index - 1);
  }, [goTo, index]);

  useEffect(() => {
    const el = videoRef.current;
    if (!el) return;
    el.muted = true;
    if (playing) {
      const attempt = el.play();
      if (attempt) {
        attempt.catch(() => {
          const onReady = () => {
            void el.play().catch(() => undefined);
            el.removeEventListener("canplay", onReady);
          };
          el.addEventListener("canplay", onReady);
        });
      }
      return;
    }
    el.pause();
  }, [playing, index]);

  useEffect(() => {
    const onPlayAvance = (event: Event) => {
      const id = (event as CustomEvent<{ id?: string }>).detail?.id;
      const i = id ? residences.findIndex((r) => r.id === id) : 0;
      setIndex(i >= 0 ? i : 0);
      setPlaying(true);
    };
    window.addEventListener("omar:play-avance", onPlayAvance);
    return () => window.removeEventListener("omar:play-avance", onPlayAvance);
  }, []);

  return (
    <section id="casas" className="relative bg-[#0c0b0a] text-white">
      <div className="flex items-end justify-between gap-4 border-t border-white/10 px-5 py-5 md:px-12 md:py-6 lg:px-16">
        <div>
          <p className="text-[10px] tracking-[0.35em] text-[#c4a574] uppercase">
            Colección en vivo
          </p>
          <p className="mt-1 text-[12px] text-white/45">
            Tres residencias. Avance real.
          </p>
        </div>
        <div className="flex items-center gap-1.5">
          {residences.map((r, i) => (
            <button
              key={r.id}
              type="button"
              onClick={() => goTo(i)}
              aria-label={r.code}
              className={`h-1 w-6 rounded-full transition ${
                i === index ? "bg-[#e0c57a]" : "bg-white/20 hover:bg-white/40"
              }`}
            />
          ))}
        </div>
      </div>

      <div className="residence-video-frame relative mx-auto max-w-[1200px] overflow-hidden bg-[#12100e] md:mx-5 md:rounded-sm lg:mx-12 xl:mx-16">
        <AnimatePresence mode="wait" initial={false}>
          <motion.div
            key={current.id}
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.25 }}
            className="absolute inset-0 bg-[#12100e]"
          >
            <video
              ref={videoRef}
              className="absolute inset-0 h-full w-full object-cover"
              src={current.video}
              autoPlay
              playsInline
              loop
              muted
              preload="auto"
              controls={false}
              disablePictureInPicture
            />
          </motion.div>
        </AnimatePresence>

        <div className="pointer-events-none absolute inset-0 bg-gradient-to-t from-black/85 via-black/20 to-black/40" />

        {/* Top chrome */}
        <div className="absolute inset-x-0 top-0 z-20 flex items-center justify-between px-4 pt-4 md:px-6 md:pt-5">
          <p className="text-[10px] tracking-[0.28em] text-white/70 uppercase tabular-nums">
            <span className="text-white">{String(index + 1).padStart(2, "0")}</span>
            <span className="text-white/35"> / {String(total).padStart(2, "0")}</span>
          </p>
          <div className="flex items-center gap-3">
            <p className="text-[10px] tracking-[0.2em] text-[#e0c57a] uppercase tabular-nums">
              {current.progress}%
            </p>
            <button
              type="button"
              onClick={() => setPlaying((p) => !p)}
              aria-label={playing ? "Pausar" : "Reanudar"}
              className="pointer-events-auto flex h-8 w-8 items-center justify-center rounded-full border border-white/25 bg-black/35 text-white/90 backdrop-blur-sm"
            >
              {playing ? (
                <Pause size={12} fill="currentColor" />
              ) : (
                <Play size={12} fill="currentColor" className="ml-0.5" />
              )}
            </button>
          </div>
        </div>

        {index > 0 && (
          <button
            type="button"
            aria-label="Anterior"
            onClick={goPrev}
            className="absolute top-1/2 left-2 z-30 flex h-9 w-9 -translate-y-1/2 items-center justify-center rounded-full border border-white/15 bg-black/40 text-white/80 md:left-4"
          >
            <ChevronLeft size={18} strokeWidth={1.25} />
          </button>
        )}
        {index < total - 1 && (
          <button
            type="button"
            aria-label="Siguiente"
            onClick={goNext}
            className="absolute top-1/2 right-2 z-30 flex h-9 w-9 -translate-y-1/2 items-center justify-center rounded-full border border-white/15 bg-black/40 text-white/80 md:right-4"
          >
            <ChevronRight size={18} strokeWidth={1.25} />
          </button>
        )}

        {/* Bottom overlay — all key info, no tall stack below */}
        <div className="absolute inset-x-0 bottom-0 z-20 px-4 pb-4 md:px-6 md:pb-5">
          <div className="flex flex-col gap-3 sm:flex-row sm:items-end sm:justify-between">
            <div className="min-w-0">
              <p className="text-[9px] tracking-[0.32em] text-[#c4a574] uppercase">
                {current.code}
              </p>
              <h2 className="mt-1 text-[clamp(1.35rem,4vw,2rem)] font-semibold tracking-[0.06em] text-white uppercase">
                {current.name}
              </h2>
              <p className="mt-1 flex items-center gap-1 text-[11px] text-white/50">
                <MapPin size={11} className="shrink-0 opacity-70" />
                {current.location}
              </p>
              <div className="mt-2.5 max-w-[200px]">
                <ProgressBar
                  key={current.id}
                  value={current.progress}
                  tone="dark"
                  size="sm"
                  live
                />
              </div>
              {current.latestUpdate && (
                <p className="mt-2 truncate text-[10px] text-white/40">
                  {current.latestUpdate.date} · {current.latestUpdate.title}
                </p>
              )}
            </div>

            <div className="flex shrink-0 items-center gap-2 sm:flex-col sm:items-end">
              <div className="flex gap-1.5">
                {residences.map((r, i) => (
                  <button
                    key={r.id}
                    type="button"
                    onClick={() => goTo(i)}
                    className={`relative h-11 w-14 overflow-hidden border transition md:h-12 md:w-16 ${
                      i === index
                        ? "border-[#c4a574]"
                        : "border-white/20 opacity-60 hover:opacity-100"
                    }`}
                  >
                    <Image
                      src={r.image}
                      alt={r.name}
                      fill
                      className="object-cover"
                      sizes="64px"
                    />
                  </button>
                ))}
              </div>
              <Link
                href={`/residences/${current.id}`}
                className="inline-flex items-center gap-1.5 bg-[#c4a574] px-3.5 py-2 text-[9px] font-semibold tracking-[0.18em] text-ink uppercase transition hover:bg-[#e0c57a]"
              >
                Ver residencia
                <ArrowRight size={12} />
              </Link>
            </div>
          </div>
        </div>
      </div>

      <div className="h-8 md:h-10" />
    </section>
  );
}
