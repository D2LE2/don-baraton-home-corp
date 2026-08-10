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
import { useCallback, useEffect, useRef, useState } from "react";
import { Logo } from "@/components/Logo";
import { UnlockModal } from "@/components/UnlockModal";
import { useNova } from "@/context/NovaContext";
import { residences } from "@/data/residences";
import { formatUsd } from "@/lib/pricing";

const STAGE_LABELS_ES: Record<string, string> = {
  land: "Terreno",
  foundation: "Cimentación",
  framing: "Estructura",
  roofing: "Cubierta",
  exterior: "Exterior",
  interior: "Interior",
  kitchen: "Cocina",
  final: "Acabados",
  completed: "Entrega",
  design: "Diseño",
};

function stageLabel(id: string, fallback: string) {
  return STAGE_LABELS_ES[id] ?? fallback;
}

function formatDelivery(expected: string) {
  // "November 2026" -> "NOV 2026"
  const parts = expected.trim().split(/\s+/);
  if (parts.length >= 2) {
    return `${parts[0].slice(0, 3).toUpperCase()} ${parts[1]}`;
  }
  return expected.toUpperCase();
}

export function VideoResidenceFeed() {
  const total = residences.length;
  const [index, setIndex] = useState(0);
  const [playing, setPlaying] = useState(true);
  const [unlockOpen, setUnlockOpen] = useState(false);
  const [menuOpen, setMenuOpen] = useState(false);
  const videoRef = useRef<HTMLVideoElement>(null);
  const { isUnlocked, ready } = useNova();

  const current = residences[index];
  const unlocked = ready && isUnlocked(current.id);

  const goTo = useCallback((i: number) => {
    setIndex(Math.max(0, Math.min(total - 1, i)));
    setPlaying(true);
  }, [total]);

  useEffect(() => {
    const el = videoRef.current;
    if (!el) return;
    el.currentTime = 0;
    if (playing) void el.play().catch(() => undefined);
    else el.pause();
  }, [index, playing]);

  // Preload peers
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
      className="relative min-h-[100dvh] overflow-hidden bg-[#0a0a0a] text-white"
    >
      {/* Full-bleed media */}
      <div className="absolute inset-0">
        <Image
          src={current.image}
          alt={current.name}
          fill
          priority
          className={`object-cover transition-opacity duration-700 ${
            playing ? "opacity-0" : "opacity-100"
          }`}
          sizes="100vw"
        />
        <video
          ref={videoRef}
          key={current.id}
          className={`absolute inset-0 h-full w-full object-cover transition-opacity duration-700 ${
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
        <div className="absolute inset-0 bg-gradient-to-b from-black/55 via-black/15 to-black/92" />
        <div className="absolute inset-0 bg-gradient-to-r from-black/50 via-transparent to-black/35" />
      </div>

      {/* Top bar */}
      <header className="relative z-30 flex items-center justify-between px-5 pt-5 md:px-10 md:pt-7">
        <Logo light size="sm" href="/" />
        <button
          type="button"
          aria-label="Menú"
          onClick={() => setMenuOpen((v) => !v)}
          className="flex h-11 w-11 items-center justify-center rounded-full border border-white/25 text-white"
        >
          <Menu size={18} />
        </button>
      </header>

      <AnimatePresence>
        {menuOpen && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="absolute inset-x-0 top-20 z-40 mx-5 rounded-2xl border border-white/10 bg-black/85 p-5 backdrop-blur-md md:mx-10"
          >
            <div className="flex flex-col gap-4 text-[12px] tracking-[0.22em] text-white/80 uppercase">
              <Link href="/residences" onClick={() => setMenuOpen(false)}>
                Showroom
              </Link>
              <Link href="/private" onClick={() => setMenuOpen(false)}>
                Omar Private
              </Link>
              <a href="#casas" onClick={() => setMenuOpen(false)}>
                Residencias activas
              </a>
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Counter + exclusive */}
      <div className="relative z-20 px-5 pt-6 md:px-10">
        <p className="text-[11px] tracking-[0.35em] text-white/70">
          <span className="text-white">
            {String(index + 1).padStart(2, "0")}
          </span>
          <span className="text-white/35"> / {String(total).padStart(2, "0")}</span>
          <span className="mx-3 text-white/25">·</span>
          <span className="tracking-[0.28em] uppercase">Exclusive Residence</span>
        </p>
      </div>

      {/* Center play */}
      <div className="relative z-20 flex justify-center pt-10 md:pt-16">
        <button
          type="button"
          onClick={() => setPlaying((p) => !p)}
          className="group flex flex-col items-center gap-3"
        >
          <span className="flex h-16 w-16 items-center justify-center rounded-full border border-white/50 bg-black/25 text-white backdrop-blur-sm transition group-hover:border-gold-soft group-hover:text-gold-soft md:h-20 md:w-20">
            {playing ? (
              <Pause size={22} fill="currentColor" />
            ) : (
              <Play size={22} fill="currentColor" className="ml-0.5" />
            )}
          </span>
          <span className="text-[10px] tracking-[0.35em] text-white/80 uppercase">
            Ver transformación
          </span>
        </button>
      </div>

      {/* Vertical progress — desktop / large phones */}
      <div className="absolute top-[28%] right-4 z-20 hidden w-28 sm:block md:right-8 md:w-32">
        <p className="text-[10px] tracking-[0.2em] text-gold-soft uppercase">
          {current.progress}% Completado
        </p>
        <div className="mt-4 space-y-0">
          {current.stages.slice(0, 6).map((stage, i, arr) => {
            const done = stage.status === "done";
            const currentStage = stage.status === "current";
            return (
              <div key={stage.id} className="flex gap-3">
                <div className="flex flex-col items-center">
                  <span
                    className={`mt-0.5 h-2 w-2 rounded-full ${
                      currentStage
                        ? "bg-white shadow-[0_0_12px_rgba(255,255,255,0.85)]"
                        : done
                          ? "bg-gold-soft"
                          : "bg-white/25"
                    }`}
                  />
                  {i < arr.length - 1 && (
                    <span
                      className={`w-px flex-1 min-h-[18px] ${
                        done || currentStage ? "bg-gold-soft/50" : "bg-white/15"
                      }`}
                    />
                  )}
                </div>
                <p
                  className={`pb-3 text-[9px] tracking-[0.18em] uppercase ${
                    currentStage
                      ? "text-white"
                      : done
                        ? "text-white/70"
                        : "text-white/35"
                  }`}
                >
                  {stageLabel(stage.id, stage.label)}
                </p>
              </div>
            );
          })}
        </div>
      </div>

      {/* Bottom content */}
      <div className="absolute inset-x-0 bottom-0 z-20 px-5 pb-5 md:px-10 md:pb-8">
        <div className="max-w-xl">
          <p className="text-[11px] tracking-[0.35em] text-gold-soft uppercase">
            {current.code}
          </p>
          <h2 className="display mt-2 text-4xl font-light tracking-[0.04em] text-white md:text-6xl">
            {current.name}
          </h2>
          <p className="mt-2 text-sm text-white/55">{current.location}</p>

          <div className="mt-5 border-t border-white/15 pt-5">
            <p className="text-[10px] tracking-[0.3em] text-gold-soft uppercase">Desde</p>
            <p className="display mt-1 text-4xl font-light text-white md:text-5xl">
              {formatUsd(current.priceFrom)}
            </p>
            <p className="mt-2 text-[10px] tracking-[0.28em] text-gold-soft/90 uppercase">
              Acceso pre-construcción
            </p>
          </div>

          <div className="mt-6 grid grid-cols-3 gap-3 border-y border-white/10 py-4">
            <div className="flex flex-col gap-1.5">
              <CalendarDays size={14} className="text-gold-soft" />
              <p className="text-[9px] leading-snug tracking-[0.14em] text-white/70 uppercase">
                Entrega
                <br />
                {formatDelivery(current.expected)}
              </p>
            </div>
            <div className="flex flex-col gap-1.5">
              <Ruler size={14} className="text-gold-soft" />
              <p className="text-[9px] leading-snug tracking-[0.14em] text-white/70 uppercase">
                Área
                <br />
                {current.sqft.toLocaleString()} SQ FT
              </p>
            </div>
            <div className="flex flex-col gap-1.5">
              <BedDouble size={14} className="text-gold-soft" />
              <p className="text-[9px] leading-snug tracking-[0.14em] text-white/70 uppercase">
                {current.beds} Hab. {current.baths} Baños
              </p>
            </div>
          </div>

          {/* Mobile progress strip */}
          <div className="mt-4 sm:hidden">
            <div className="mb-1.5 flex justify-between text-[9px] tracking-[0.2em] text-white/55 uppercase">
              <span>Obra</span>
              <span className="text-gold-soft">{current.progress}% completado</span>
            </div>
            <div className="h-0.5 overflow-hidden bg-white/15">
              <div
                className="h-full bg-gold-soft transition-[width] duration-700"
                style={{ width: `${current.progress}%` }}
              />
            </div>
          </div>

          <div className="mt-5 flex flex-col gap-3 sm:flex-row">
            <Link
              href={`/residences/${current.id}`}
              className="inline-flex flex-1 items-center justify-center gap-2 rounded-xl bg-[#c4a574] px-6 py-3.5 text-[11px] font-medium tracking-[0.22em] text-ink uppercase transition hover:bg-[#d4b888]"
            >
              Ver residencia
              <ArrowRight size={14} />
            </Link>
            <button
              type="button"
              onClick={() => setUnlockOpen(true)}
              className="inline-flex flex-1 items-center justify-center gap-2 rounded-xl border border-white/35 px-6 py-3.5 text-[11px] tracking-[0.22em] text-white uppercase transition hover:border-gold-soft hover:text-gold-soft"
            >
              <Lock size={13} />
              {unlocked ? "Ya tienes acceso" : "Solicitar acceso"}
            </button>
          </div>

          <p className="mt-3 flex items-center justify-center gap-2 text-[9px] tracking-[0.22em] text-white/40 uppercase sm:justify-start">
            <Lock size={10} />
            Acceso privado · Cupos limitados
          </p>
        </div>

        {/* Thumbnail carousel */}
        <div className="mt-6 flex gap-3 overflow-x-auto pb-1 [-ms-overflow-style:none] [scrollbar-width:none] [&::-webkit-scrollbar]:hidden">
          {residences.map((r, i) => {
            const active = i === index;
            return (
              <button
                key={r.id}
                type="button"
                onClick={() => goTo(i)}
                className={`relative h-[72px] w-[118px] shrink-0 overflow-hidden rounded-lg border transition md:h-20 md:w-[140px] ${
                  active
                    ? "border-[#c4a574]"
                    : "border-white/15 opacity-70 hover:opacity-100"
                }`}
              >
                <Image
                  src={r.image}
                  alt={r.name}
                  fill
                  className="object-cover"
                  sizes="140px"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-black/85 via-black/20 to-transparent" />
                <div className="absolute inset-x-0 bottom-0 p-2 text-left">
                  <p className="text-[9px] tracking-[0.16em] text-white uppercase">
                    {String(i + 1).padStart(2, "0")} {r.name.replace("THE ", "")}
                  </p>
                  <p className="text-[9px] text-gold-soft">{r.progress}%</p>
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
