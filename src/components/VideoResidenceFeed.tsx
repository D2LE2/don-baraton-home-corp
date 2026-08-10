"use client";

import Image from "next/image";
import Link from "next/link";
import {
  ArrowRight,
  BedDouble,
  CalendarDays,
  Lock,
  Menu,
  Pause,
  Play,
  Ruler,
} from "lucide-react";
import { AnimatePresence, motion } from "framer-motion";
import { useCallback, useEffect, useMemo, useRef, useState } from "react";
import { UnlockModal } from "@/components/UnlockModal";
import { useNova } from "@/context/NovaContext";
import { residences } from "@/data/residences";
import { formatUsd } from "@/lib/pricing";

/** Fixed pipeline like the mock — mapped from % complete */
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
  const videoRef = useRef<HTMLVideoElement>(null);
  const { isUnlocked, ready } = useNova();

  const current = residences[index];
  const unlocked = ready && isUnlocked(current.id);
  const stageIdx = useMemo(
    () => pipelineIndex(current.progress),
    [current.progress],
  );

  const goTo = useCallback(
    (i: number) => {
      setIndex(Math.max(0, Math.min(total - 1, i)));
      setPlaying(false);
    },
    [total],
  );

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

  return (
    <section
      id="casas"
      className="relative flex min-h-[100dvh] flex-col bg-black text-white"
    >
      {/* ═══ ZONE 1: Hero media (matches mock upper half) ═══ */}
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

        {/* 01 / 03 EXCLUSIVE RESIDENCE */}
        <div className="absolute top-16 left-4 z-20 md:top-20 md:left-8">
          <p className="text-[10px] tracking-[0.28em] text-white/85 uppercase">
            <span className="text-white">
              {String(index + 1).padStart(2, "0")}
            </span>
            <span className="text-white/40">
              {" "}
              / {String(total).padStart(2, "0")}
            </span>
            <span className="ml-3 tracking-[0.32em]">Exclusive Residence</span>
          </p>
        </div>

        {/* Play — center of hero */}
        <div className="absolute inset-0 z-20 flex items-center justify-center">
          <button
            type="button"
            onClick={() => setPlaying((p) => !p)}
            className="flex flex-col items-center gap-2.5"
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

        {/* Vertical progress — ALWAYS visible like mock */}
        <div className="absolute top-[22%] right-3 z-20 w-[72px] md:right-6 md:w-24">
          <p className="text-[8px] leading-tight tracking-[0.12em] text-[#c4a574] uppercase md:text-[9px]">
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
                          ? "h-2 w-2 bg-[#c4a574] shadow-[0_0_10px_rgba(196,165,116,0.9)]"
                          : done
                            ? "h-1.5 w-1.5 bg-[#c4a574]"
                            : "h-1.5 w-1.5 bg-white/30"
                      }`}
                    />
                    {i < PIPELINE.length - 1 && (
                      <span
                        className={`w-px flex-1 min-h-[14px] ${
                          done || active ? "bg-[#c4a574]/60" : "bg-white/20"
                        }`}
                      />
                    )}
                  </div>
                  <p
                    className={`pb-2.5 text-[8px] tracking-[0.12em] uppercase md:text-[9px] ${
                      active
                        ? "font-medium text-[#c4a574]"
                        : done
                          ? "text-white/75"
                          : "text-white/35"
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

      {/* ═══ ZONE 2: Solid info panel (matches mock lower half) ═══ */}
      <div className="relative z-10 bg-[#0a0a0a] px-4 pb-5 pt-5 md:px-8 md:pb-7 md:pt-6">
        <p className="text-[10px] tracking-[0.35em] text-[#c4a574] uppercase">
          {current.code}
        </p>
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

        {/* Specs row — icon + text inline like mock */}
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

        {/* CTAs — stacked full width like mock */}
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

        {/* Bottom thumbnail carousel — peek more like mock */}
        <div className="mt-5 flex gap-2.5 overflow-x-auto pb-1 [-ms-overflow-style:none] [scrollbar-width:none] [&::-webkit-scrollbar]:hidden">
          {residences.map((r, i) => {
            const active = i === index;
            return (
              <button
                key={r.id}
                type="button"
                onClick={() => goTo(i)}
                className={`relative h-[64px] w-[108px] shrink-0 overflow-hidden rounded-md border md:h-[72px] md:w-[128px] ${
                  active ? "border-[#c4a574]" : "border-white/20"
                }`}
              >
                <Image
                  src={r.image}
                  alt={r.name}
                  fill
                  className="object-cover"
                  sizes="128px"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-black/90 via-black/30 to-transparent" />
                <div className="absolute inset-x-0 bottom-0 p-1.5 text-left">
                  <p className="text-[8px] font-medium tracking-[0.14em] text-white uppercase">
                    {String(i + 1).padStart(2, "0")}{" "}
                    {r.name.replace(/^THE\s+/i, "")}
                  </p>
                  <p className="text-[8px] text-[#c4a574]">{r.progress}%</p>
                </div>
              </button>
            );
          })}
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
