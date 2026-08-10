"use client";

import Image from "next/image";
import Link from "next/link";
import {
  ArrowRight,
  BedDouble,
  CalendarDays,
  ChevronRight,
  Lock,
  Menu,
  Pause,
  Play,
  Ruler,
} from "lucide-react";
import { AnimatePresence, motion, type PanInfo } from "framer-motion";
import { useCallback, useEffect, useMemo, useRef, useState } from "react";
import { AnimatedCounter } from "@/components/AnimatedCounter";
import { LiveCompletionBar } from "@/components/LiveCompletionBar";
import { UnlockModal } from "@/components/UnlockModal";
import { useNova } from "@/context/NovaContext";
import { residences } from "@/data/residences";
import { useLiveViewersMap } from "@/hooks/useLiveViewersMap";
import { formatUsd } from "@/lib/pricing";

const PIPELINE = [
  "Terreno",
  "Diseño",
  "Cimentación",
  "Estructura",
  "Interior",
  "Acabados",
] as const;

function pipelineIndex(progress: number) {
  if (progress >= 95) return 5;
  if (progress >= 70) return 4;
  if (progress >= 45) return 3;
  if (progress >= 25) return 2;
  if (progress >= 10) return 1;
  return 0;
}

function formatDelivery(expected: string) {
  const parts = expected.trim().split(/\s+/);
  if (parts.length >= 2) {
    return `${parts[0].slice(0, 3).toUpperCase()} ${parts[1]}`;
  }
  return expected.toUpperCase();
}

const slideVariants = {
  enter: (dir: number) => ({ x: dir > 0 ? "28%" : "-28%", opacity: 0 }),
  center: { x: 0, opacity: 1 },
  exit: (dir: number) => ({ x: dir > 0 ? "-22%" : "22%", opacity: 0 }),
};

export function VideoResidenceFeed() {
  const total = residences.length;
  const [index, setIndex] = useState(0);
  const [direction, setDirection] = useState(1);
  const [playing, setPlaying] = useState(false);
  const [unlockOpen, setUnlockOpen] = useState(false);
  const [menuOpen, setMenuOpen] = useState(false);
  const [hintVisible, setHintVisible] = useState(true);
  const [liveFlash, setLiveFlash] = useState<string | null>(null);
  const prevViewersRef = useRef<number | null>(null);
  const videoRef = useRef<HTMLVideoElement>(null);
  const { isUnlocked, ready } = useNova();

  const current = residences[index];
  const unlocked = ready && isUnlocked(current.id);
  const liveViewers = useLiveViewersMap(current.id);
  const viewersNow = liveViewers[current.id] ?? 0;
  const stageIdx = useMemo(
    () => pipelineIndex(current.progress),
    [current.progress],
  );

  useEffect(() => {
    const prev = prevViewersRef.current;
    prevViewersRef.current = viewersNow;
    if (prev === null || prev === viewersNow) return;
    const delta = viewersNow - prev;
    const id = window.setTimeout(() => {
      setLiveFlash(delta > 0 ? `+${delta} entró` : `−${Math.abs(delta)}`);
    }, 0);
    const clear = window.setTimeout(() => setLiveFlash(null), 1600);
    return () => {
      window.clearTimeout(id);
      window.clearTimeout(clear);
    };
  }, [viewersNow]);

  const goTo = useCallback(
    (i: number, dir?: number) => {
      const next = Math.max(0, Math.min(total - 1, i));
      if (next === index) return;
      setDirection(dir ?? (next > index ? 1 : -1));
      setIndex(next);
      setPlaying(false);
      setHintVisible(false);
      prevViewersRef.current = null;
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
    if (!hintVisible || index >= total - 1) return;
    const t = window.setTimeout(() => setHintVisible(false), 4800);
    return () => window.clearTimeout(t);
  }, [hintVisible, index, total]);

  function onDragEnd(_: unknown, info: PanInfo) {
    if (info.offset.x < -56 || info.velocity.x < -400) goNext();
    else if (info.offset.x > 56 || info.velocity.x > 400) goPrev();
  }

  return (
    <section id="casas" className="relative flex min-h-[100dvh] flex-col bg-black text-white">
      <div className="relative flex min-h-[100dvh] flex-col">
        {/* HERO */}
        <div className="relative min-h-[46vh] flex-1 overflow-hidden md:min-h-[52vh]">
          <motion.div
            className="absolute inset-0 touch-pan-y"
            drag="x"
            dragConstraints={{ left: 0, right: 0 }}
            dragElastic={0.16}
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
                  className={`object-cover object-center ${
                    playing ? "opacity-0" : "opacity-100"
                  }`}
                  sizes="100vw"
                />
                <video
                  ref={videoRef}
                  className={`absolute inset-0 h-full w-full object-cover ${
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

          <div className="pointer-events-none absolute inset-0 bg-gradient-to-b from-black/60 via-transparent to-black/75" />

          {/* Header */}
          <header className="absolute inset-x-0 top-0 z-30 flex items-center justify-between px-4 pt-4 md:px-8 md:pt-6">
            <Link href="/" className="flex items-center gap-2.5">
              <span className="display text-2xl font-medium leading-none text-[#c4a574]">
                OC
              </span>
              <span className="flex flex-col leading-none">
                <span className="text-[11px] font-medium tracking-[0.28em] text-white uppercase">
                  Omar
                </span>
                <span className="mt-0.5 text-[8px] tracking-[0.35em] text-[#c4a574] uppercase">
                  Corp
                </span>
              </span>
            </Link>
            <button
              type="button"
              aria-label="Menú"
              onClick={() => setMenuOpen((v) => !v)}
              className="flex h-10 w-10 items-center justify-center rounded-full border border-white/40"
            >
              <Menu size={16} />
            </button>
          </header>

          <AnimatePresence>
            {menuOpen && (
              <motion.nav
                initial={{ opacity: 0, y: -8 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0 }}
                className="absolute top-16 right-4 z-40 w-48 border border-white/15 bg-black/90 p-4 backdrop-blur-md md:right-8"
              >
                <div className="flex flex-col gap-3 text-[11px] tracking-[0.22em] text-white/80 uppercase">
                  <Link href="/residences" onClick={() => setMenuOpen(false)}>
                    Showroom
                  </Link>
                  <Link href="/private" onClick={() => setMenuOpen(false)}>
                    Omar Private
                  </Link>
                </div>
              </motion.nav>
            )}
          </AnimatePresence>

          {/* ONE clean top meta row — no overlap */}
          <div className="absolute top-[58px] inset-x-4 z-20 flex items-center justify-between gap-2 md:top-[72px] md:inset-x-8">
            <p className="min-w-0 truncate rounded-md bg-black/60 px-2.5 py-1.5 text-[10px] tracking-[0.22em] text-white uppercase backdrop-blur-sm">
              <span className="font-semibold">
                {String(index + 1).padStart(2, "0")}
              </span>
              <span className="text-white/55">
                {" "}
                / {String(total).padStart(2, "0")}
              </span>
              <span className="ml-2 hidden tracking-[0.28em] sm:inline">
                Exclusive Residence
              </span>
            </p>
            <div className="relative shrink-0">
              <p className="inline-flex items-center gap-1.5 rounded-md bg-black/60 px-2.5 py-1.5 text-[9px] tracking-[0.16em] text-white uppercase backdrop-blur-sm">
                <span className="live-dot !bg-emerald-400" />
                <AnimatedCounter value={viewersNow} className="tabular-nums" />{" "}
                mirando
              </p>
              <AnimatePresence>
                {liveFlash && (
                  <motion.span
                    key={liveFlash}
                    initial={{ opacity: 0, y: 4 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0 }}
                    className="absolute top-full right-0 mt-1 whitespace-nowrap rounded bg-emerald-500/20 px-2 py-0.5 text-[8px] tracking-[0.12em] text-emerald-300 uppercase"
                  >
                    {liveFlash}
                  </motion.span>
                )}
              </AnimatePresence>
            </div>
          </div>

          {/* Play */}
          <div className="pointer-events-none absolute inset-0 z-20 flex items-center justify-center">
            <button
              type="button"
              onClick={() => setPlaying((p) => !p)}
              className="pointer-events-auto flex flex-col items-center gap-2.5"
            >
              <span className="flex h-[52px] w-[52px] items-center justify-center rounded-full border border-white/70 bg-black/30 text-white backdrop-blur-[2px]">
                {playing ? (
                  <Pause size={18} fill="currentColor" />
                ) : (
                  <Play size={18} fill="currentColor" className="ml-0.5" />
                )}
              </span>
              <span className="text-[9px] tracking-[0.4em] text-white uppercase drop-shadow">
                Ver transformación
              </span>
            </button>
          </div>

          {/* Slide arrows */}
          {index < total - 1 && (
            <button
              type="button"
              aria-label="Siguiente"
              onClick={goNext}
              className="absolute top-1/2 right-3 z-30 -translate-y-1/2 text-white/80 md:right-4"
            >
              <motion.span
                animate={hintVisible ? { x: [0, 5, 0] } : { x: 0 }}
                transition={
                  hintVisible
                    ? { duration: 1.5, repeat: Infinity, ease: "easeInOut" }
                    : undefined
                }
              >
                <ChevronRight size={24} strokeWidth={1.2} />
              </motion.span>
            </button>
          )}
          {index > 0 && (
            <button
              type="button"
              aria-label="Anterior"
              onClick={goPrev}
              className="absolute top-1/2 left-3 z-30 -translate-y-1/2 rotate-180 text-white/70 md:left-4"
            >
              <ChevronRight size={22} strokeWidth={1.2} />
            </button>
          )}

          {/* Progress panel — bottom-right of hero, clear of top row */}
          <div className="absolute right-3 bottom-4 z-20 w-[100px] rounded-lg bg-black/65 px-2.5 py-2.5 backdrop-blur-md md:right-6 md:bottom-6 md:w-[118px]">
            <p className="text-[9px] font-semibold tracking-[0.12em] text-[#e0c57a] uppercase">
              <AnimatedCounter value={current.progress} className="tabular-nums" />
              % Completado
            </p>
            <div className="mt-1.5 h-0.5 overflow-hidden rounded-full bg-white/15">
              <motion.div
                key={`bar-${current.id}`}
                className="h-full bg-[#e0c57a]"
                initial={{ width: 0 }}
                animate={{ width: `${current.progress}%` }}
                transition={{ duration: 0.9, ease: [0.22, 1, 0.36, 1] }}
              />
            </div>
            <div className="mt-2.5">
              {PIPELINE.map((label, i) => {
                const done = i < stageIdx;
                const active = i === stageIdx;
                return (
                  <div key={label} className="flex gap-2">
                    <div className="flex w-2 flex-col items-center">
                      <span
                        className={`mt-0.5 rounded-full ${
                          active
                            ? "h-1.5 w-1.5 bg-[#e0c57a] shadow-[0_0_8px_rgba(224,197,122,0.9)]"
                            : done
                              ? "h-1 w-1 bg-[#e0c57a]"
                              : "h-1 w-1 bg-white/40"
                        }`}
                      />
                      {i < PIPELINE.length - 1 && (
                        <span
                          className={`w-px flex-1 min-h-[11px] ${
                            done || active ? "bg-[#e0c57a]/60" : "bg-white/25"
                          }`}
                        />
                      )}
                    </div>
                    <p
                      className={`pb-1.5 text-[8px] font-medium tracking-[0.08em] uppercase md:text-[9px] ${
                        active
                          ? "text-[#e0c57a]"
                          : done
                            ? "text-white"
                            : "text-white/65"
                      }`}
                    >
                      {label}
                    </p>
                  </div>
                );
              })}
            </div>
          </div>
        </div>

        {/* INFO PANEL — clear slide swap */}
        <div className="relative z-10 overflow-hidden bg-[#0a0a0a] px-4 pb-5 pt-5 md:px-8 md:pb-7 md:pt-6">
          <AnimatePresence initial={false} custom={direction} mode="wait">
            <motion.div
              key={current.id}
              custom={direction}
              variants={slideVariants}
              initial="enter"
              animate="center"
              exit="exit"
              transition={{ duration: 0.38, ease: [0.22, 1, 0.36, 1] }}
            >
              <div className="flex flex-wrap items-center gap-x-3 gap-y-1">
                <p className="text-[10px] tracking-[0.35em] text-[#c4a574] uppercase">
                  {current.code}
                </p>
                <span className="inline-flex items-center gap-1.5 text-[9px] tracking-[0.16em] text-emerald-300 uppercase">
                  <span className="live-dot !bg-emerald-400" />
                  <AnimatedCounter value={viewersNow} className="tabular-nums" />{" "}
                  en vivo
                </span>
                <span className="text-[9px] tracking-[0.16em] text-white/45 uppercase">
                  ·{" "}
                  <AnimatedCounter
                    value={current.progress}
                    className="tabular-nums"
                  />
                  % terminación
                </span>
              </div>

              <h2 className="mt-2 text-[clamp(1.85rem,7vw,3.25rem)] font-semibold tracking-[0.04em] text-white uppercase">
                {current.name}
              </h2>
              <p className="mt-1 text-[13px] text-white/55">{current.location}</p>

              <LiveCompletionBar
                key={current.id}
                residenceId={current.id}
                baseProgress={current.progress}
              />

              <div className="mt-4">
                <p className="text-[clamp(1.6rem,5vw,2.4rem)] font-semibold tracking-tight text-white">
                  <span className="mr-2 text-[11px] font-normal tracking-[0.28em] text-[#c4a574] uppercase">
                    Desde
                  </span>
                  {formatUsd(current.priceFrom)}
                </p>
                <p className="mt-1 text-[9px] tracking-[0.28em] text-[#c4a574] uppercase">
                  Acceso pre-construcción
                </p>
              </div>

              <div className="mt-5 grid grid-cols-3 gap-2 border-y border-white/12 py-3.5">
                <div className="flex items-start gap-2">
                  <CalendarDays size={14} className="mt-0.5 shrink-0 text-white/70" />
                  <p className="text-[9px] leading-snug tracking-[0.12em] text-white/70 uppercase">
                    Entrega
                    <br />
                    {formatDelivery(current.expected)}
                  </p>
                </div>
                <div className="flex items-start gap-2 border-x border-white/12 px-2">
                  <Ruler size={14} className="mt-0.5 shrink-0 text-white/70" />
                  <p className="text-[9px] leading-snug tracking-[0.12em] text-white/70 uppercase">
                    Área
                    <br />
                    {current.sqft.toLocaleString()} SQ FT
                  </p>
                </div>
                <div className="flex items-start gap-2 pl-1">
                  <BedDouble size={14} className="mt-0.5 shrink-0 text-white/70" />
                  <p className="text-[9px] leading-snug tracking-[0.12em] text-white/70 uppercase">
                    {current.beds} Hab.
                    <br />
                    {current.baths} Baños
                  </p>
                </div>
              </div>
            </motion.div>
          </AnimatePresence>

          <div className="mt-4 space-y-2.5">
            <Link
              href={`/residences/${current.id}`}
              className="flex w-full items-center justify-center gap-2 rounded-lg bg-[#c4a574] py-3.5 text-[11px] font-semibold tracking-[0.22em] text-black uppercase"
            >
              Ver residencia
              <ArrowRight size={14} />
            </Link>
            <button
              type="button"
              onClick={() => setUnlockOpen(true)}
              className="flex w-full items-center justify-center gap-2 rounded-lg border border-white/40 bg-transparent py-3.5 text-[11px] tracking-[0.22em] text-white uppercase"
            >
              <Lock size={13} />
              {unlocked ? "Acceso desbloqueado" : "Solicitar acceso"}
            </button>
          </div>

          <p className="mt-3 flex items-center justify-center gap-1.5 text-[8px] tracking-[0.22em] text-white/40 uppercase">
            <Lock size={9} />
            Acceso privado · Cupos limitados
          </p>

          {/* Catalog — clear and obvious */}
          <div className="mt-7 border-t border-white/15 pt-5">
            <div className="mb-3 flex items-end justify-between gap-3">
              <div>
                <p className="text-[10px] tracking-[0.32em] text-[#c4a574] uppercase">
                  Catálogo
                </p>
                <p className="mt-1 text-sm text-white/80">
                  Elige otra residencia · desliza o toca
                </p>
              </div>
              <p className="text-[10px] tracking-[0.2em] text-white/40 uppercase">
                {total} disponibles
              </p>
            </div>

            <div className="flex gap-3 overflow-x-auto pb-2 [-ms-overflow-style:none] [scrollbar-width:none] [&::-webkit-scrollbar]:hidden">
              {residences.map((r, i) => {
                const active = i === index;
                const v = liveViewers[r.id] ?? 0;
                return (
                  <button
                    key={r.id}
                    type="button"
                    onClick={() => goTo(i, i > index ? 1 : -1)}
                    className={`relative h-[108px] w-[168px] shrink-0 overflow-hidden rounded-xl border-2 transition md:h-[120px] md:w-[200px] ${
                      active
                        ? "border-[#c4a574] shadow-[0_0_0_1px_rgba(196,165,116,0.35)]"
                        : "border-white/20 opacity-80 hover:opacity-100"
                    }`}
                  >
                    <Image
                      src={r.image}
                      alt={r.name}
                      fill
                      className="object-cover"
                      sizes="200px"
                    />
                    <div className="absolute inset-0 bg-gradient-to-t from-black via-black/40 to-black/10" />
                    <div className="absolute inset-x-0 top-0 p-2">
                      <div className="h-1 overflow-hidden rounded-full bg-white/20">
                        <div
                          className="h-full bg-[#e0c57a]"
                          style={{ width: `${r.progress}%` }}
                        />
                      </div>
                    </div>
                    {active && (
                      <span className="absolute top-2 right-2 rounded bg-[#c4a574] px-1.5 py-0.5 text-[8px] font-semibold tracking-[0.14em] text-black uppercase">
                        Vista
                      </span>
                    )}
                    <div className="absolute inset-x-0 bottom-0 space-y-1 p-2.5 text-left">
                      <p className="text-[11px] font-semibold tracking-[0.14em] text-white uppercase">
                        {String(i + 1).padStart(2, "0")}{" "}
                        {r.name.replace(/^THE\s+/i, "")}
                      </p>
                      <p className="flex items-center gap-1.5 text-[10px] text-[#e0c57a]">
                        <AnimatedCounter value={r.progress} className="tabular-nums" />
                        % obra
                        <span className="text-white/35">·</span>
                        <span className="inline-flex items-center gap-1 text-emerald-300">
                          <span className="live-dot !h-1.5 !w-1.5 !bg-emerald-400" />
                          <AnimatedCounter value={v} className="tabular-nums" />
                        </span>
                      </p>
                    </div>
                  </button>
                );
              })}
            </div>
          </div>
        </div>
      </div>

      <UnlockModal
        residence={current}
        open={unlockOpen}
        onClose={() => setUnlockOpen(false)}
      />
    </section>
  );
}
