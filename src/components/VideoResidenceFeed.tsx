"use client";

import Image from "next/image";
import Link from "next/link";
import { ArrowRight, ChevronRight, Pause, Play } from "lucide-react";
import { AnimatePresence, motion, type PanInfo } from "framer-motion";
import { useCallback, useEffect, useRef, useState } from "react";
import { residences } from "@/data/residences";
import { formatUsd } from "@/lib/pricing";

const slideVariants = {
  enter: (dir: number) => ({ x: dir > 0 ? "18%" : "-18%", opacity: 0 }),
  center: { x: 0, opacity: 1 },
  exit: (dir: number) => ({ x: dir > 0 ? "-14%" : "14%", opacity: 0 }),
};

export function VideoResidenceFeed() {
  const total = residences.length;
  const [index, setIndex] = useState(0);
  const [direction, setDirection] = useState(1);
  const [playing, setPlaying] = useState(false);
  const [hintVisible, setHintVisible] = useState(true);
  const videoRef = useRef<HTMLVideoElement>(null);

  const current = residences[index];

  const goTo = useCallback(
    (i: number, dir?: number) => {
      const next = Math.max(0, Math.min(total - 1, i));
      if (next === index) return;
      setDirection(dir ?? (next > index ? 1 : -1));
      setIndex(next);
      setPlaying(false);
      setHintVisible(false);
    },
    [index, total],
  );

  const goNext = useCallback(() => {
    if (index < total - 1) goTo(index + 1, 1);
  }, [goTo, index, total]);

  const goPrev = useCallback(() => {
    if (index > 0) goTo(index - 1, -1);
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
    residences.forEach((r) => {
      const link = document.createElement("link");
      link.rel = "preload";
      link.as = "video";
      link.href = r.video;
      document.head.appendChild(link);
    });
  }, []);

  useEffect(() => {
    const onPlayAvance = (event: Event) => {
      const id = (event as CustomEvent<{ id?: string }>).detail?.id;
      const i = id ? residences.findIndex((r) => r.id === id) : 0;
      const next = i >= 0 ? i : 0;

      setIndex((prev) => {
        if (next !== prev) setDirection(next > prev ? 1 : -1);
        return next;
      });
      setHintVisible(false);
      window.setTimeout(() => setPlaying(true), 380);
    };

    window.addEventListener("omar:play-avance", onPlayAvance);
    return () => window.removeEventListener("omar:play-avance", onPlayAvance);
  }, []);

  useEffect(() => {
    if (!hintVisible || index >= total - 1) return;
    const t = window.setTimeout(() => setHintVisible(false), 4800);
    return () => window.clearTimeout(t);
  }, [hintVisible, index, total]);

  function onDragEnd(_: unknown, info: PanInfo) {
    if (info.offset.x < -56 || info.velocity.x < -400) goNext();
    else if (info.offset.x > 56 || info.velocity.x > 400) goPrev();
  }

  return (
    <section id="casas" className="relative bg-black text-white">
      {/* 1 — VIDEO: emotion only */}
      <div className="residence-video-frame relative overflow-hidden">
        <motion.div
          className="absolute inset-0 touch-pan-y"
          drag="x"
          dragConstraints={{ left: 0, right: 0 }}
          dragElastic={0.14}
          onDragEnd={onDragEnd}
        >
          <AnimatePresence initial={false} custom={direction} mode="popLayout">
            <motion.div
              key={current.id}
              custom={direction}
              variants={slideVariants}
              initial="enter"
              animate="center"
              exit="exit"
              transition={{ duration: 0.42, ease: [0.22, 1, 0.36, 1] }}
              className="absolute inset-0"
            >
              <Image
                src={current.image}
                alt={current.name}
                fill
                priority
                className={`object-cover object-center transition-opacity duration-500 ${
                  playing ? "opacity-0" : "opacity-100"
                }`}
                sizes="100vw"
              />
              <video
                ref={videoRef}
                className={`absolute inset-0 h-full w-full object-cover transition-opacity duration-500 ${
                  playing ? "opacity-100" : "opacity-0"
                }`}
                src={current.video}
                poster={current.image}
                playsInline
                loop
                muted
                preload="auto"
                controls={false}
                disablePictureInPicture
              />
            </motion.div>
          </AnimatePresence>
        </motion.div>

        <div className="pointer-events-none absolute inset-0 bg-gradient-to-b from-black/50 via-transparent to-black/70" />

        {/* Single meta row on the frame */}
        <div className="absolute inset-x-0 top-0 z-20 flex items-center justify-between px-5 pt-5 md:px-10 md:pt-8">
          <p className="text-[11px] tracking-[0.28em] text-white/90 uppercase">
            <span className="font-medium text-white">
              {String(index + 1).padStart(2, "0")}
            </span>
            <span className="text-white/45">
              {" "}
              / {String(total).padStart(2, "0")}
            </span>
          </p>
          <p className="text-[11px] tracking-[0.22em] text-[#e0c57a] uppercase">
            {current.progress}% completed
          </p>
        </div>

        {/* Play — alone in the center */}
        <div className="pointer-events-none absolute inset-0 z-20 flex items-center justify-center">
          <button
            type="button"
            onClick={() => setPlaying((p) => !p)}
            aria-label={playing ? "Pausar" : "Ver transformación"}
            className="pointer-events-auto flex h-16 w-16 items-center justify-center rounded-full border border-white/55 bg-black/25 text-white backdrop-blur-[2px] transition hover:border-white hover:bg-black/40 md:h-[72px] md:w-[72px]"
          >
            {playing ? (
              <Pause size={22} fill="currentColor" />
            ) : (
              <Play size={22} fill="currentColor" className="ml-0.5" />
            )}
          </button>
        </div>

        {index < total - 1 && (
          <button
            type="button"
            aria-label="Siguiente"
            onClick={goNext}
            className="absolute top-1/2 right-3 z-30 -translate-y-1/2 text-white/70 md:right-6"
          >
            <motion.span
              animate={hintVisible ? { x: [0, 5, 0] } : { x: 0 }}
              transition={
                hintVisible
                  ? { duration: 1.5, repeat: Infinity, ease: "easeInOut" }
                  : undefined
              }
            >
              <ChevronRight size={26} strokeWidth={1.15} />
            </motion.span>
          </button>
        )}
        {index > 0 && (
          <button
            type="button"
            aria-label="Anterior"
            onClick={goPrev}
            className="absolute top-1/2 left-3 z-30 -translate-y-1/2 rotate-180 text-white/60 md:left-6"
          >
            <ChevronRight size={24} strokeWidth={1.15} />
          </button>
        )}
      </div>

      {/* 2 — RESIDENCE: decision */}
      <div className="bg-black px-5 pb-12 pt-8 md:px-12 md:pb-16 md:pt-10 lg:px-16">
        <AnimatePresence initial={false} custom={direction} mode="wait">
          <motion.div
            key={current.id}
            custom={direction}
            variants={slideVariants}
            initial="enter"
            animate="center"
            exit="exit"
            transition={{ duration: 0.36, ease: [0.22, 1, 0.36, 1] }}
            className="mx-auto max-w-xl"
          >
            <p className="text-[10px] tracking-[0.4em] text-[#c4a574] uppercase">
              {current.code}
            </p>
            <h2 className="mt-3 text-[clamp(2rem,7vw,3.5rem)] font-semibold tracking-[0.04em] text-white uppercase">
              {current.name}
            </h2>
            <p className="mt-2 text-[15px] text-white/50">{current.location}</p>

            <div className="mt-8">
              <p className="text-[clamp(1.85rem,5vw,2.75rem)] font-semibold tracking-tight text-white">
                {formatUsd(current.priceFrom)}
              </p>
              <p className="mt-1.5 text-[10px] tracking-[0.32em] text-[#c4a574] uppercase">
                Pre-construction
              </p>
            </div>

            <div className="mt-8">
              <div className="flex items-baseline justify-between gap-3">
                <p className="text-[10px] tracking-[0.28em] text-white/55 uppercase">
                  {current.progress}% complete
                </p>
              </div>
              <div className="mt-2.5 h-px overflow-hidden bg-white/15">
                <motion.div
                  key={`progress-${current.id}`}
                  className="h-full bg-[#e0c57a]"
                  initial={{ width: 0 }}
                  animate={{ width: `${current.progress}%` }}
                  transition={{ duration: 0.9, ease: [0.22, 1, 0.36, 1] }}
                />
              </div>
            </div>

            <Link
              href={`/residences/${current.id}`}
              className="group mt-10 inline-flex items-center gap-3 text-[12px] font-medium tracking-[0.28em] text-white uppercase transition hover:text-[#e0c57a]"
            >
              View residence
              <ArrowRight
                size={16}
                className="transition group-hover:translate-x-1"
              />
            </Link>
          </motion.div>
        </AnimatePresence>
      </div>

      {/* 3 — CATALOG: discover (black → ivory bridge) */}
      <div className="bg-[#faf8f4] px-5 py-14 md:px-12 md:py-20 lg:px-16">
        <div className="mx-auto max-w-[1100px]">
          <p className="text-[11px] tracking-[0.4em] text-[#9a8660] uppercase">
            Private collection
          </p>
          <h3 className="display mt-3 text-3xl font-light text-ink md:text-4xl">
            Explore the residences.
          </h3>

          <div className="mt-10 grid gap-5 sm:grid-cols-3">
            {residences.map((r, i) => {
              const active = i === index;
              return (
                <button
                  key={r.id}
                  type="button"
                  onClick={() => goTo(i, i > index ? 1 : -1)}
                  className={`group text-left transition ${
                    active ? "opacity-100" : "opacity-80 hover:opacity-100"
                  }`}
                >
                  <div className="relative aspect-[4/3] overflow-hidden">
                    <Image
                      src={r.image}
                      alt={r.name}
                      fill
                      className="object-cover transition duration-700 group-hover:scale-[1.03]"
                      sizes="(max-width: 640px) 100vw, 33vw"
                    />
                    <div className="absolute inset-0 bg-gradient-to-t from-black/55 via-transparent to-transparent" />
                    {active && (
                      <span className="absolute bottom-0 left-0 h-0.5 w-full bg-[#c4a574]" />
                    )}
                  </div>
                  <div className="mt-4 flex items-baseline justify-between gap-3">
                    <p className="text-[13px] font-medium tracking-[0.18em] text-ink uppercase">
                      {r.name}
                    </p>
                    <p className="text-[11px] tracking-[0.14em] text-[#9a8660] uppercase tabular-nums">
                      {r.progress}%
                    </p>
                  </div>
                </button>
              );
            })}
          </div>
        </div>
      </div>
    </section>
  );
}
