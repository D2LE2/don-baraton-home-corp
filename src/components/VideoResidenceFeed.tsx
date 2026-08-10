"use client";

import Image from "next/image";
import Link from "next/link";
import {
  ArrowRight,
  CalendarDays,
  ChevronLeft,
  ChevronRight,
  Lock,
  MapPin,
  Pause,
  Play,
  UserRound,
} from "lucide-react";
import { AnimatePresence, motion } from "framer-motion";
import { useCallback, useEffect, useRef, useState } from "react";
import { residences, type Residence } from "@/data/residences";

function transformLabel(residence: Residence) {
  if (residence.status === "COMING SOON") return "Early stage";
  return "Active transform";
}

export function VideoResidenceFeed() {
  const total = residences.length;
  const [index, setIndex] = useState(0);
  const [playing, setPlaying] = useState(false);
  const videoRef = useRef<HTMLVideoElement>(null);

  const current = residences[index];

  const goTo = useCallback(
    (i: number) => {
      const next = Math.max(0, Math.min(total - 1, i));
      if (next === index) return;
      setIndex(next);
      setPlaying(false);
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
    if (playing) {
      void el.play().catch(() => undefined);
      return;
    }
    el.pause();
  }, [playing, index]);

  useEffect(() => {
    const onPlayAvance = (event: Event) => {
      const id = (event as CustomEvent<{ id?: string }>).detail?.id;
      const i = id ? residences.findIndex((r) => r.id === id) : 0;
      const next = i >= 0 ? i : 0;
      setIndex(next);
      setPlaying(false);
      window.setTimeout(() => setPlaying(true), 200);
    };

    window.addEventListener("omar:play-avance", onPlayAvance);
    return () => window.removeEventListener("omar:play-avance", onPlayAvance);
  }, []);

  return (
    <section id="casas" className="relative bg-black text-white">
      {/* Quiet bridge so the handoff from landing isn’t a hard cut */}
      <div className="border-t border-white/10 px-5 py-8 md:px-12 lg:px-16">
        <p className="text-[10px] tracking-[0.35em] text-[#c4a574] uppercase">
          Colección en vivo
        </p>
        <p className="mt-2 max-w-md text-sm text-white/50">
          Elige una residencia y mira cómo se transforma.
        </p>
      </div>

      {/* VIDEO — no drag (it fights vertical scroll on mobile) */}
      <div className="residence-video-frame relative overflow-hidden bg-[#12100e]">
        <AnimatePresence mode="wait" initial={false}>
          <motion.div
            key={current.id}
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.28 }}
            className="absolute inset-0 bg-[#12100e]"
          >
            <video
              ref={videoRef}
              className="absolute inset-0 h-full w-full object-cover"
              src={current.video}
              playsInline
              loop
              muted
              preload="auto"
              controls={false}
              disablePictureInPicture
            />
          </motion.div>
        </AnimatePresence>

        <div className="pointer-events-none absolute inset-0 bg-gradient-to-b from-black/45 via-transparent to-black/70" />

        <div className="absolute inset-x-0 top-0 z-20 flex items-center justify-between px-5 pt-5 md:px-10 md:pt-6">
          <p className="text-[11px] tracking-[0.28em] text-white/90 uppercase">
            <span className="font-medium text-white">
              {String(index + 1).padStart(2, "0")}
            </span>
            <span className="text-white/45">
              {" "}
              / {String(total).padStart(2, "0")}
            </span>
          </p>
          <p className="text-[11px] tracking-[0.22em] text-[#e0c57a] uppercase tabular-nums">
            {current.progress}% transformed
          </p>
        </div>

        <div className="pointer-events-none absolute inset-0 z-20 flex items-center justify-center">
          <button
            type="button"
            onClick={() => setPlaying((p) => !p)}
            aria-label={playing ? "Pausar" : "Ver transformación"}
            className="pointer-events-auto flex h-14 w-14 items-center justify-center rounded-full border border-white/55 bg-black/25 text-white backdrop-blur-[2px] transition hover:border-white md:h-16 md:w-16"
          >
            {playing ? (
              <Pause size={20} fill="currentColor" />
            ) : (
              <Play size={20} fill="currentColor" className="ml-0.5" />
            )}
          </button>
        </div>

        {index > 0 && (
          <button
            type="button"
            aria-label="Anterior"
            onClick={goPrev}
            className="absolute top-1/2 left-3 z-30 flex h-10 w-10 -translate-y-1/2 items-center justify-center rounded-full border border-white/20 bg-black/30 text-white/80 backdrop-blur-sm md:left-5"
          >
            <ChevronLeft size={20} strokeWidth={1.25} />
          </button>
        )}
        {index < total - 1 && (
          <button
            type="button"
            aria-label="Siguiente"
            onClick={goNext}
            className="absolute top-1/2 right-3 z-30 flex h-10 w-10 -translate-y-1/2 items-center justify-center rounded-full border border-white/20 bg-black/30 text-white/80 backdrop-blur-sm md:right-5"
          >
            <ChevronRight size={20} strokeWidth={1.25} />
          </button>
        )}
      </div>

      {/* Status — no listing sheet */}
      <div className="bg-black px-5 pb-14 pt-8 md:px-12 md:pb-16 md:pt-10 lg:px-16">
        <div className="mx-auto max-w-xl">
          <p className="text-[10px] tracking-[0.4em] text-[#c4a574] uppercase">
            {current.code}
          </p>
          <h2 className="mt-2.5 text-[clamp(2rem,7vw,3.5rem)] font-semibold tracking-[0.04em] text-white uppercase">
            {current.name}
          </h2>

          <p className="mt-2.5 flex items-center gap-1.5 text-[13px] text-white/50">
            <MapPin size={13} className="shrink-0 text-white/40" />
            {current.location}
          </p>

          <p className="mt-4 inline-flex items-center gap-2 text-[10px] tracking-[0.28em] text-emerald-400 uppercase">
            <span className="live-dot !bg-emerald-400" />
            {transformLabel(current)}
          </p>

          <div className="mt-7 flex items-end gap-4">
            <div className="shrink-0">
              <p className="text-[clamp(2.6rem,9vw,3.75rem)] font-light leading-none tracking-tight text-[#e0c57a] tabular-nums">
                {current.progress}%
              </p>
              <p className="mt-2 text-[9px] tracking-[0.28em] text-white/40 uppercase">
                Current progress
              </p>
            </div>
            <div className="mb-7 min-w-0 flex-1">
              <div className="h-[2px] overflow-hidden rounded-full bg-white/15">
                <div
                  className="h-full bg-[#e0c57a] transition-[width] duration-700 ease-out"
                  style={{ width: `${current.progress}%` }}
                />
              </div>
            </div>
          </div>

          {current.latestUpdate && (
            <Link
              href={`/residences/${current.id}`}
              className="group mt-7 flex items-center gap-3 overflow-hidden rounded-xl border border-white/10 bg-white/[0.04] p-3 transition hover:border-[#c4a574]/45"
            >
              <span className="flex h-10 w-10 shrink-0 items-center justify-center rounded-full bg-[#c4a574]/15 text-[#e0c57a]">
                <CalendarDays size={16} strokeWidth={1.75} />
              </span>
              <div className="min-w-0 flex-1">
                <p className="text-[9px] tracking-[0.24em] text-[#e0c57a] uppercase">
                  Latest update · {current.latestUpdate.date}
                </p>
                <p className="mt-1 flex items-center gap-1.5 text-[13px] text-white">
                  <span className="truncate">{current.latestUpdate.title}</span>
                  <ArrowRight size={13} className="shrink-0 opacity-70" />
                </p>
              </div>
              {current.latestUpdate.image && (
                <span className="relative h-14 w-[4.5rem] shrink-0 overflow-hidden rounded-md">
                  <Image
                    src={current.latestUpdate.image}
                    alt=""
                    fill
                    className="object-cover"
                    sizes="72px"
                  />
                </span>
              )}
            </Link>
          )}

          <p className="mt-7 flex items-start gap-2 text-[11px] leading-relaxed tracking-[0.06em] text-white/50 uppercase">
            <UserRound size={14} className="mt-0.5 shrink-0 text-white/35" />
            Sigue cada avance. Obtén prioridad cuando esté disponible.
          </p>

          <Link
            href={`/residences/${current.id}#follow`}
            className="mt-5 flex w-full items-center justify-center gap-2.5 rounded-lg bg-[#c4a574] px-5 py-3.5 text-[11px] font-semibold tracking-[0.22em] text-ink uppercase transition hover:bg-[#e0c57a]"
          >
            Follow this residence
            <ArrowRight size={15} />
          </Link>

          <p className="mt-4 flex items-center justify-center gap-1.5 text-[8px] tracking-[0.22em] text-white/35 uppercase">
            <Lock size={9} />
            Private list · Limited access
          </p>

          {/* Compact switcher — not a second catalog page */}
          <div className="mt-10 flex gap-2 overflow-x-auto pb-1 [-ms-overflow-style:none] [scrollbar-width:none] [&::-webkit-scrollbar]:hidden">
            {residences.map((r, i) => (
              <button
                key={r.id}
                type="button"
                onClick={() => goTo(i)}
                className={`relative h-16 w-24 shrink-0 overflow-hidden rounded-md border transition ${
                  i === index
                    ? "border-[#c4a574]"
                    : "border-white/15 opacity-70 hover:opacity-100"
                }`}
              >
                <Image
                  src={r.image}
                  alt={r.name}
                  fill
                  className="object-cover"
                  sizes="96px"
                />
              </button>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}
