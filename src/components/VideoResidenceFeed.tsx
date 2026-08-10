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

export function VideoResidenceFeed() {
  const total = residences.length;
  const [index, setIndex] = useState(0);
  const [playing, setPlaying] = useState(false);
  const [unlockOpen, setUnlockOpen] = useState(false);
  const [menuOpen, setMenuOpen] = useState(false);
  const [hintVisible, setHintVisible] = useState(true);
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

  const goTo = useCallback(
    (i: number) => {
      setIndex(Math.max(0, Math.min(total - 1, i)));
      setPlaying(false);
      setHintVisible(false);
    },
    [total],
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
    residences.forEach((r) => {
      const link = document.createElement("link");
      link.rel = "preload";
      link.as = "video";
      link.href = r.video;
      document.head.appendChild(link);
    });
  }, []);

  // Soft hide slide hint after a few seconds
  useEffect(() => {
    if (!hintVisible || index >= total - 1) return;
    const t = window.setTimeout(() => setHintVisible(false), 5200);
    return () => window.clearTimeout(t);
  }, [hintVisible, index, total]);

  function onDragEnd(_: unknown, info: PanInfo) {
    const dist = info.offset.x;
    const vel = info.velocity.x;
    if (dist < -56 || vel < -400) goNext();
    else if (dist > 56 || vel > 400) goPrev();
  }

  return (
    <section
      id="casas"
      className="relative flex min-h-[100dvh] flex-col bg-black text-white"
    >
      <motion.div
        className="relative flex min-h-[100dvh] flex-col touch-pan-y"
        drag="x"
        dragConstraints={{ left: 0, right: 0 }}
        dragElastic={0.12}
        onDragEnd={onDragEnd}
      >
        {/* ═══ ZONE 1: Hero ═══ */}
        <div className="relative min-h-[42vh] flex-1 overflow-hidden md:min-h-[48vh]">
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
            key={current.id}
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
          <div className="absolute inset-0 bg-gradient-to-b from-black/50 via-transparent to-black/70" />

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

          <div className="absolute top-16 left-4 z-20 md:top-20 md:left-8">
            <p className="rounded-md bg-black/55 px-2.5 py-1.5 text-[10px] tracking-[0.28em] text-white uppercase shadow-[0_4px_20px_rgba(0,0,0,0.35)] backdrop-blur-sm md:text-[11px]">
              <span className="font-semibold text-white">
                {String(index + 1).padStart(2, "0")}
              </span>
              <span className="text-white/70">
                {" "}
                / {String(total).padStart(2, "0")}
              </span>
              <span className="ml-3 font-medium tracking-[0.32em] text-white">
                Exclusive Residence
              </span>
            </p>
          </div>

          {/* Live viewers — current property */}
          <div className="absolute top-16 right-14 z-20 md:top-20 md:right-20">
            <p className="inline-flex items-center gap-2 rounded-md bg-black/55 px-2.5 py-1.5 text-[9px] tracking-[0.18em] text-white uppercase backdrop-blur-sm">
              <span className="live-dot !bg-emerald-400" />
              {viewersNow} mirando
            </p>
          </div>

          {/* Play */}
          <div className="absolute inset-0 z-20 flex items-center justify-center pointer-events-none">
            <button
              type="button"
              onClick={() => setPlaying((p) => !p)}
              className="pointer-events-auto flex flex-col items-center gap-2.5"
            >
              <span className="flex h-[52px] w-[52px] items-center justify-center rounded-full border border-white/70 bg-black/20 text-white backdrop-blur-[2px]">
                {playing ? (
                  <Pause size={18} fill="currentColor" />
                ) : (
                  <Play size={18} fill="currentColor" className="ml-0.5" />
                )}
              </span>
              <span className="text-[9px] tracking-[0.4em] text-white uppercase">
                Ver transformación
              </span>
            </button>
          </div>

          {/* Minimal slide hint arrow */}
          {index < total - 1 && (
            <button
              type="button"
              aria-label="Siguiente residencia"
              onClick={goNext}
              className="absolute top-1/2 right-3 z-30 -translate-y-1/2 text-white/70 transition hover:text-white md:right-5"
            >
              <motion.span
                animate={
                  hintVisible
                    ? { x: [0, 6, 0], opacity: [0.45, 1, 0.45] }
                    : { x: 0, opacity: 0.7 }
                }
                transition={
                  hintVisible
                    ? { duration: 1.6, repeat: Infinity, ease: "easeInOut" }
                    : { duration: 0.3 }
                }
                className="flex flex-col items-center gap-1"
              >
                <ChevronRight size={22} strokeWidth={1.25} />
                {hintVisible && (
                  <span className="text-[8px] tracking-[0.28em] uppercase">
                    Slide
                  </span>
                )}
              </motion.span>
            </button>
          )}

          {index > 0 && (
            <button
              type="button"
              aria-label="Residencia anterior"
              onClick={goPrev}
              className="absolute top-1/2 left-3 z-30 -translate-y-1/2 rotate-180 text-white/55 transition hover:text-white md:left-5"
            >
              <ChevronRight size={20} strokeWidth={1.25} />
            </button>
          )}

          {/* Vertical progress */}
          <div className="absolute top-[18%] right-2 z-20 w-[88px] rounded-lg bg-black/55 px-2.5 py-3 shadow-[0_8px_30px_rgba(0,0,0,0.45)] backdrop-blur-md md:right-5 md:w-[110px] md:px-3 md:py-3.5">
            <p className="text-[9px] font-semibold leading-tight tracking-[0.14em] text-[#e0c57a] uppercase md:text-[10px]">
              {current.progress}% Completado
            </p>
            <div className="mt-3">
              {PIPELINE.map((label, i) => {
                const done = i < stageIdx;
                const active = i === stageIdx;
                return (
                  <div key={label} className="flex gap-2">
                    <div className="flex w-2.5 flex-col items-center">
                      <span
                        className={`mt-[3px] rounded-full ${
                          active
                            ? "h-2 w-2 bg-[#e0c57a] shadow-[0_0_10px_rgba(224,197,122,0.95)]"
                            : done
                              ? "h-1.5 w-1.5 bg-[#e0c57a]"
                              : "h-1.5 w-1.5 bg-white/50"
                        }`}
                      />
                      {i < PIPELINE.length - 1 && (
                        <span
                          className={`w-px flex-1 min-h-[14px] ${
                            done || active ? "bg-[#e0c57a]/70" : "bg-white/30"
                          }`}
                        />
                      )}
                    </div>
                    <p
                      className={`pb-2.5 text-[9px] font-medium tracking-[0.1em] uppercase drop-shadow-[0_1px_4px_rgba(0,0,0,0.9)] md:text-[10px] ${
                        active
                          ? "text-[#e0c57a]"
                          : done
                            ? "text-white"
                            : "text-white/75"
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

        {/* ═══ ZONE 2: Info panel ═══ */}
        <div className="relative z-10 bg-[#0a0a0a] px-4 pb-5 pt-5 md:px-8 md:pb-7 md:pt-6">
          <div className="flex flex-wrap items-center gap-3">
            <p className="text-[10px] tracking-[0.35em] text-[#c4a574] uppercase">
              {current.code}
            </p>
            <span className="inline-flex items-center gap-1.5 text-[9px] tracking-[0.16em] text-emerald-300/90 uppercase">
              <span className="live-dot !bg-emerald-400" />
              {viewersNow} en vivo
            </span>
            <span className="text-[9px] tracking-[0.16em] text-white/45 uppercase">
              · {current.progress}% terminación
            </span>
          </div>
          <h2 className="mt-1.5 text-[clamp(1.85rem,7vw,3.25rem)] font-semibold tracking-[0.04em] text-white uppercase">
            {current.name}
          </h2>
          <p className="mt-1 text-[13px] text-white/55">{current.location}</p>

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

          {/* Thumbs with live viewers + progress */}
          <div className="mt-5 flex gap-2.5 overflow-x-auto pb-1 [-ms-overflow-style:none] [scrollbar-width:none] [&::-webkit-scrollbar]:hidden">
            {residences.map((r, i) => {
              const active = i === index;
              const v = liveViewers[r.id] ?? 0;
              return (
                <button
                  key={r.id}
                  type="button"
                  onClick={() => goTo(i)}
                  className={`relative h-[72px] w-[120px] shrink-0 overflow-hidden rounded-md border md:h-[80px] md:w-[140px] ${
                    active ? "border-[#c4a574]" : "border-white/20"
                  }`}
                >
                  <Image
                    src={r.image}
                    alt={r.name}
                    fill
                    className="object-cover"
                    sizes="140px"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-black/95 via-black/35 to-transparent" />
                  <div className="absolute inset-x-0 bottom-0 space-y-0.5 p-1.5 text-left">
                    <p className="text-[8px] font-medium tracking-[0.14em] text-white uppercase">
                      {String(i + 1).padStart(2, "0")}{" "}
                      {r.name.replace(/^THE\s+/i, "")}
                    </p>
                    <p className="flex items-center gap-1 text-[8px] text-[#c4a574]">
                      {r.progress}% obra
                      <span className="text-white/35">·</span>
                      <span className="inline-flex items-center gap-1 text-emerald-300">
                        <span className="live-dot !h-1.5 !w-1.5 !bg-emerald-400" />
                        {v}
                      </span>
                    </p>
                  </div>
                </button>
              );
            })}
          </div>
        </div>
      </motion.div>

      <UnlockModal
        residence={current}
        open={unlockOpen}
        onClose={() => setUnlockOpen(false)}
      />
    </section>
  );
}
