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
import { ProgressBar } from "@/components/ProgressBar";
import { WaitlistJoin } from "@/components/WaitlistJoin";
import { useNova } from "@/context/NovaContext";
import { residences } from "@/data/residences";

/** Video-first collection — property footage stays clear; meta lives under the frame */
export function VideoResidenceFeed() {
  const total = residences.length;
  const [index, setIndex] = useState(0);
  const [playing, setPlaying] = useState(true);
  const [waitlistOpen, setWaitlistOpen] = useState(false);
  const videoRef = useRef<HTMLVideoElement>(null);
  const current = residences[index];
  const { isOnWaitlist } = useNova();
  const joined = isOnWaitlist(current.id);

  const goTo = useCallback(
    (i: number) => {
      const next = Math.max(0, Math.min(total - 1, i));
      if (next === index) return;
      setIndex(next);
      setPlaying(true);
      setWaitlistOpen(false);
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
    <section id="casas" className="relative bg-[#0f0e0c] text-white">
      <div className="flex items-center justify-between gap-4 px-5 py-5 md:px-12 md:py-6 lg:px-16">
        <p className="text-[10px] tracking-[0.35em] text-[#c4a574] uppercase">
          Colección en vivo
        </p>
        <p className="text-[10px] tracking-[0.22em] text-white/40 uppercase tabular-nums">
          {String(index + 1).padStart(2, "0")} / {String(total).padStart(2, "0")}
        </p>
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

        {/* Soft edge only — video stays readable */}
        <div className="pointer-events-none absolute inset-0 bg-gradient-to-t from-black/35 via-transparent to-black/20" />

        <button
          type="button"
          onClick={() => setPlaying((p) => !p)}
          aria-label={playing ? "Pausar" : "Reanudar"}
          className="absolute top-3 right-3 z-20 flex h-9 w-9 items-center justify-center rounded-full border border-white/20 bg-black/40 text-white/90 backdrop-blur-sm md:top-4 md:right-4"
        >
          {playing ? (
            <Pause size={13} fill="currentColor" />
          ) : (
            <Play size={13} fill="currentColor" className="ml-0.5" />
          )}
        </button>

        {index > 0 && (
          <button
            type="button"
            aria-label="Anterior"
            onClick={goPrev}
            className="absolute top-1/2 left-2 z-30 flex h-10 w-10 -translate-y-1/2 items-center justify-center rounded-full border border-white/15 bg-black/35 text-white/85 md:left-4"
          >
            <ChevronLeft size={18} strokeWidth={1.25} />
          </button>
        )}
        {index < total - 1 && (
          <button
            type="button"
            aria-label="Siguiente"
            onClick={goNext}
            className="absolute top-1/2 right-2 z-30 flex h-10 w-10 -translate-y-1/2 items-center justify-center rounded-full border border-white/15 bg-black/35 text-white/85 md:right-4"
          >
            <ChevronRight size={18} strokeWidth={1.25} />
          </button>
        )}
      </div>

      {/* Meta + actions under the video — property footage is the focus */}
      <div className="mx-auto max-w-[1200px] px-5 pt-5 pb-2 md:px-12 md:pt-6 lg:px-16">
        <div className="flex flex-col gap-4 sm:flex-row sm:items-end sm:justify-between">
          <div className="min-w-0">
            <p className="text-[10px] tracking-[0.28em] text-[#c4a574] uppercase">
              {current.code}
            </p>
            <h2 className="mt-1 text-xl font-semibold tracking-[0.05em] text-white uppercase md:text-2xl">
              {current.name}
            </h2>
            <p className="mt-1.5 flex items-center gap-1 text-[12px] text-white/45">
              <MapPin size={12} className="shrink-0 opacity-70" />
              {current.location}
            </p>
            <div className="mt-3 max-w-[180px]">
              <ProgressBar
                key={current.id}
                value={current.progress}
                tone="dark"
                size="sm"
                showLabel
                label="Progreso"
                live
              />
            </div>
          </div>

          <div className="flex shrink-0 flex-col gap-3 sm:items-end">
            <div className="flex gap-1.5">
              {residences.map((r, i) => (
                <button
                  key={r.id}
                  type="button"
                  onClick={() => goTo(i)}
                  aria-label={r.code}
                  className={`relative h-12 w-16 overflow-hidden border transition md:h-14 md:w-[4.5rem] ${
                    i === index
                      ? "border-[#c4a574]"
                      : "border-white/15 opacity-55 hover:opacity-100"
                  }`}
                >
                  <Image
                    src={r.image}
                    alt={r.name}
                    fill
                    className="object-cover"
                    sizes="72px"
                  />
                </button>
              ))}
            </div>
            <div className="flex gap-2">
              {joined ? (
                <span className="inline-flex items-center border border-white/20 px-3.5 py-2.5 text-[10px] tracking-[0.16em] text-white/65 uppercase">
                  En esta lista
                </span>
              ) : (
                <button
                  type="button"
                  onClick={() => setWaitlistOpen(true)}
                  className="bg-[#c4a574] px-4 py-2.5 text-[10px] font-semibold tracking-[0.16em] text-ink uppercase transition hover:bg-[#e0c57a]"
                >
                  Unirse a lista
                </button>
              )}
              <Link
                href={`/residences/${current.id}`}
                className="inline-flex items-center gap-1.5 border border-white/25 px-3.5 py-2.5 text-[10px] tracking-[0.16em] text-white/85 uppercase transition hover:border-white"
              >
                Ver
                <ArrowRight size={12} />
              </Link>
            </div>
          </div>
        </div>
      </div>

      <WaitlistJoin
        residence={current}
        open={waitlistOpen}
        onClose={() => setWaitlistOpen(false)}
      />

      <div className="h-10 bg-gradient-to-b from-[#0f0e0c] to-[#f7f4ef] md:h-12" />
    </section>
  );
}
