"use client";

import Link from "next/link";
import { Eye, Lock, Pause, Play, Users, Volume2, VolumeX } from "lucide-react";
import {
  AnimatePresence,
  motion,
  useReducedMotion,
  type PanInfo,
} from "framer-motion";
import { useCallback, useEffect, useRef, useState } from "react";
import { UnlockModal } from "@/components/UnlockModal";
import { useNova } from "@/context/NovaContext";
import { residences, type Residence } from "@/data/residences";
import { useLiveSocialProof } from "@/hooks/useLiveSocialProof";

const SLIDE_MS = 8000;

function VideoSlide({
  residence,
  active,
  muted,
  onOpenUnlock,
}: {
  residence: Residence;
  active: boolean;
  muted: boolean;
  onOpenUnlock: () => void;
}) {
  const videoRef = useRef<HTMLVideoElement>(null);
  const { isUnlocked, ready } = useNova();
  const unlocked = ready && isUnlocked(residence.id);
  const [teaserIn, setTeaserIn] = useState(false);
  const { viewers, waitlistLive, toast, currentStage } = useLiveSocialProof(
    residence,
    active,
  );

  useEffect(() => {
    const el = videoRef.current;
    if (!el) return;
    if (active) {
      el.currentTime = 0;
      void el.play().catch(() => undefined);
      const t = window.setTimeout(() => setTeaserIn(true), 900);
      return () => window.clearTimeout(t);
    }
    el.pause();
  }, [active]);

  useEffect(() => {
    const el = videoRef.current;
    if (el) el.muted = muted;
  }, [muted]);

  return (
    <div className="relative h-full w-full overflow-hidden bg-ink">
      <motion.div
        className="absolute inset-0"
        initial={{ scale: 1.06 }}
        animate={active ? { scale: 1 } : { scale: 1.06 }}
        transition={{ duration: 7, ease: "linear" }}
      >
        <video
          ref={videoRef}
          className="pointer-events-none h-full w-full object-cover"
          src={residence.video}
          poster={residence.image}
          playsInline
          loop
          muted={muted}
          preload={active ? "auto" : "metadata"}
          controls={false}
          disablePictureInPicture
        />
      </motion.div>

      <div className="pointer-events-none absolute inset-0 bg-black/25" />
      <div className="pointer-events-none absolute inset-0 bg-gradient-to-b from-black/85 via-black/35 to-transparent" />
      <div className="pointer-events-none absolute inset-0 bg-gradient-to-t from-black/95 via-black/55 to-transparent" />
      <div className="pointer-events-none absolute inset-y-0 left-0 w-[55%] bg-gradient-to-r from-black/55 via-black/25 to-transparent" />

      {/* Live toasts */}
      <div className="pointer-events-none absolute top-28 right-4 z-20 w-[min(100%-2rem,280px)] md:top-32 md:right-10">
        <AnimatePresence mode="popLayout">
          {toast && (
            <motion.div
              key={toast.id}
              initial={{ opacity: 0, y: -10, x: 12 }}
              animate={{ opacity: 1, y: 0, x: 0 }}
              exit={{ opacity: 0, y: -8, x: 8 }}
              transition={{ duration: 0.35 }}
              className="rounded-2xl border border-white/15 bg-black/70 px-3.5 py-3 shadow-[0_12px_40px_rgba(0,0,0,0.45)] backdrop-blur-md"
            >
              <div className="flex items-start gap-2.5">
                <span className="live-dot mt-1.5 shrink-0" />
                <p className="text-[12px] leading-snug text-white/90">{toast.text}</p>
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </div>

      <div className="relative z-10 flex h-full flex-col justify-end px-5 pb-28 md:px-12 md:pb-32 lg:px-16">
        <motion.div
          initial={{ opacity: 0, y: 18 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.55, ease: [0.22, 1, 0.36, 1] }}
          className="max-w-2xl rounded-[1.75rem] bg-black/50 p-5 shadow-[0_20px_60px_rgba(0,0,0,0.45)] backdrop-blur-md md:p-7"
        >
          <div className="flex flex-wrap items-center gap-2">
            <span className="inline-flex items-center gap-2 rounded-full border border-emerald-400/30 bg-emerald-500/15 px-3 py-1.5 text-[10px] tracking-[0.18em] text-emerald-200 uppercase">
              <Eye size={12} />
              <span className="live-dot !bg-emerald-300" />
              {viewers} mirando ahora
            </span>
            <span className="inline-flex items-center gap-2 rounded-full border border-gold-soft/35 bg-gold-soft/10 px-3 py-1.5 text-[10px] tracking-[0.18em] text-gold-soft uppercase">
              <Users size={12} />
              {waitlistLive} en lista
              {residence.waitlistLimited ? " · limitada" : ""}
            </span>
          </div>

          <p className="mt-4 text-[11px] tracking-[0.35em] text-gold-soft uppercase drop-shadow-[0_2px_8px_rgba(0,0,0,0.85)]">
            {residence.code}
          </p>
          <h2 className="mt-2 text-4xl font-light tracking-[0.08em] text-white drop-shadow-[0_2px_12px_rgba(0,0,0,0.9)] md:text-6xl">
            {residence.name}
          </h2>
          <p className="mt-2 text-sm text-white/85 md:text-base">{residence.location}</p>

          <AnimatePresence>
            {teaserIn && (
              <motion.p
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0 }}
                transition={{ duration: 0.5 }}
                className="script mt-4 max-w-lg text-2xl text-gold-soft drop-shadow-[0_2px_10px_rgba(0,0,0,0.9)] md:text-3xl"
              >
                {residence.teaser}
              </motion.p>
            )}
          </AnimatePresence>

          {/* Visual construction progress */}
          <div className="mt-6">
            <div className="mb-2 flex items-end justify-between gap-3">
              <div>
                <p className="text-[10px] tracking-[0.28em] text-white/65 uppercase">
                  Progreso de obra
                </p>
                <p className="mt-1 text-sm text-white/85">
                  Etapa actual · {currentStage?.label ?? "En curso"}
                </p>
              </div>
              <p className="display text-3xl font-light text-white md:text-4xl">
                {residence.progress}%
              </p>
            </div>
            <div className="h-2.5 overflow-hidden rounded-full bg-white/15">
              <motion.div
                className="h-full rounded-full bg-gradient-to-r from-gold-soft/80 to-gold-soft"
                initial={{ width: 0 }}
                animate={{ width: active ? `${residence.progress}%` : 0 }}
                transition={{ duration: 1.1, ease: [0.22, 1, 0.36, 1] }}
              />
            </div>
            <div className="mt-2 flex justify-between text-[10px] tracking-[0.16em] text-white/55 uppercase">
              <span>Inicio</span>
              <span>Entrega · {residence.expected}</span>
            </div>
          </div>

          <div className="mt-6">
            {!unlocked ? (
              <button
                type="button"
                onClick={onOpenUnlock}
                className="group inline-flex items-center gap-3 rounded-full bg-gold-soft px-7 py-3.5 text-[11px] font-medium tracking-[0.22em] text-ink uppercase shadow-[0_0_32px_rgba(224,197,122,0.28)] transition hover:bg-white"
              >
                <Lock size={14} />
                Me interesa
                <span className="text-ink/60 transition group-hover:text-ink">· ver más</span>
              </button>
            ) : (
              <Link
                href={`/residences/${residence.id}`}
                className="inline-flex items-center gap-3 rounded-full bg-gold-soft px-7 py-3.5 text-[11px] font-medium tracking-[0.22em] text-ink uppercase"
              >
                Entrar al Build Story
              </Link>
            )}
            <p className="mt-3 text-[11px] tracking-[0.12em] text-white/70">
              {unlocked
                ? "Ya desbloqueaste esta residencia"
                : `${waitlistLive} personas ya están en la lista. Si te enamoras, toca.`}
            </p>
          </div>
        </motion.div>
      </div>
    </div>
  );
}

export function VideoResidenceFeed() {
  const total = residences.length;
  const reduceMotion = useReducedMotion();
  const [index, setIndex] = useState(0);
  const [direction, setDirection] = useState(1);
  const [paused, setPaused] = useState(false);
  const [inView, setInView] = useState(false);
  const [muted, setMuted] = useState(true);
  const [unlockOpen, setUnlockOpen] = useState(false);
  const [progress, setProgress] = useState(0);
  const sectionRef = useRef<HTMLElement>(null);
  const rafRef = useRef<number | null>(null);
  const startRef = useRef(0);
  const heldRef = useRef(0);

  const current = residences[index];
  const next = residences[(index + 1) % total];

  const goTo = useCallback(
    (nextIndex: number, dir?: number) => {
      const wrapped = ((nextIndex % total) + total) % total;
      setDirection(
        dir ?? (wrapped > index || (index === total - 1 && wrapped === 0) ? 1 : -1),
      );
      setIndex(wrapped);
      setProgress(0);
      heldRef.current = 0;
      startRef.current = performance.now();
    },
    [index, total],
  );

  const goNext = useCallback(() => goTo(index + 1, 1), [goTo, index]);
  const goPrev = useCallback(() => goTo(index - 1, -1), [goTo, index]);

  useEffect(() => {
    const node = sectionRef.current;
    if (!node) return;
    const observer = new IntersectionObserver(
      ([entry]) => setInView(entry.isIntersecting && entry.intersectionRatio >= 0.35),
      { threshold: [0.2, 0.35, 0.55] },
    );
    observer.observe(node);
    return () => observer.disconnect();
  }, []);

  const autoplayBlocked = paused || unlockOpen || !inView || !!reduceMotion;

  useEffect(() => {
    if (autoplayBlocked) {
      if (rafRef.current) cancelAnimationFrame(rafRef.current);
      rafRef.current = null;
      return;
    }

    startRef.current = performance.now() - heldRef.current;

    const tick = (now: number) => {
      const elapsed = now - startRef.current;
      const ratio = Math.min(1, elapsed / SLIDE_MS);
      setProgress(ratio);
      if (ratio >= 1) {
        heldRef.current = 0;
        goNext();
        return;
      }
      rafRef.current = requestAnimationFrame(tick);
    };

    rafRef.current = requestAnimationFrame(tick);
    return () => {
      if (rafRef.current) cancelAnimationFrame(rafRef.current);
      rafRef.current = null;
      const elapsed = performance.now() - startRef.current;
      heldRef.current = Math.min(SLIDE_MS, Math.max(0, elapsed));
    };
  }, [autoplayBlocked, goNext, index]);

  function onDragEnd(_: unknown, info: PanInfo) {
    const threshold = 70;
    if (info.offset.x < -threshold || info.velocity.x < -500) goNext();
    else if (info.offset.x > threshold || info.velocity.x > 500) goPrev();
  }

  const variants = {
    enter: (dir: number) => ({
      x: dir > 0 ? "12%" : "-12%",
      opacity: 0,
      scale: 1.02,
    }),
    center: { x: 0, opacity: 1, scale: 1 },
    exit: (dir: number) => ({
      x: dir > 0 ? "-10%" : "10%",
      opacity: 0,
      scale: 0.98,
    }),
  };

  return (
    <section ref={sectionRef} id="casas" className="relative bg-ink">
      {/* Orientation header */}
      <div className="absolute inset-x-0 top-0 z-30 px-4 pt-5 md:px-10 md:pt-7">
        <div className="mb-4 flex items-center justify-between gap-4 rounded-2xl bg-black/55 px-4 py-3 shadow-[0_12px_40px_rgba(0,0,0,0.35)] backdrop-blur-md md:px-5">
          <div>
            <p className="text-[10px] tracking-[0.32em] text-white/70 uppercase">
              Tour de residencias
            </p>
            <p className="mt-1 text-sm text-white">
              <span className="font-medium text-gold-soft">
                {String(index + 1).padStart(2, "0")}
              </span>
              <span className="text-white/55"> / {String(total).padStart(2, "0")}</span>
              <span className="mx-2 text-white/35">·</span>
              <span className="tracking-[0.08em]">{current.name}</span>
            </p>
          </div>
          <div className="flex items-center gap-2">
            <button
              type="button"
              aria-label={paused ? "Reanudar tour" : "Pausar tour"}
              onClick={() => setPaused((p) => !p)}
              className="flex h-9 w-9 items-center justify-center rounded-full border border-white/25 bg-black/55 text-white backdrop-blur-md"
            >
              {paused || unlockOpen ? <Play size={14} /> : <Pause size={14} />}
            </button>
            <button
              type="button"
              aria-label={muted ? "Activar sonido" : "Silenciar"}
              onClick={() => setMuted((m) => !m)}
              className="flex h-9 w-9 items-center justify-center rounded-full border border-white/25 bg-black/55 text-white backdrop-blur-md"
            >
              {muted ? <VolumeX size={14} /> : <Volume2 size={14} />}
            </button>
          </div>
        </div>

        {/* Story progress segments */}
        <div className="flex gap-1.5 rounded-full bg-black/40 p-1.5 backdrop-blur-sm">
          {residences.map((r, i) => {
            const fill =
              i < index ? 1 : i === index ? (reduceMotion ? 1 : progress) : 0;
            return (
              <button
                key={r.id}
                type="button"
                aria-label={`Ir a ${r.name}`}
                onClick={() => goTo(i, i > index ? 1 : -1)}
                className="group h-1.5 flex-1 overflow-hidden rounded-full bg-white/30"
              >
                <span
                  className="block h-full origin-left rounded-full bg-gold-soft transition-[width] duration-75 ease-linear group-hover:bg-white"
                  style={{ width: `${fill * 100}%` }}
                />
              </button>
            );
          })}
        </div>
      </div>

      {/* Stage */}
      <div className="relative h-[88dvh] min-h-[560px] overflow-hidden touch-pan-y">
        <AnimatePresence initial={false} custom={direction} mode="popLayout">
          <motion.div
            key={current.id}
            custom={direction}
            variants={variants}
            initial="enter"
            animate="center"
            exit="exit"
            transition={{ duration: 0.55, ease: [0.22, 1, 0.36, 1] }}
            drag="x"
            dragConstraints={{ left: 0, right: 0 }}
            dragElastic={0.14}
            onDragStart={() => setPaused(true)}
            onDragEnd={(e, info) => {
              onDragEnd(e, info);
              setPaused(false);
            }}
            className="absolute inset-0 cursor-grab active:cursor-grabbing"
          >
            <VideoSlide
              residence={current}
              active={inView}
              muted={muted}
              onOpenUnlock={() => {
                setPaused(true);
                setUnlockOpen(true);
              }}
            />
          </motion.div>
        </AnimatePresence>

        {/* Next peek label */}
        <div className="pointer-events-none absolute right-5 bottom-36 z-20 hidden rounded-xl bg-black/55 px-3 py-2 text-right backdrop-blur-md md:right-10 md:block">
          <p className="text-[9px] tracking-[0.28em] text-white/70 uppercase">Siguiente</p>
          <p className="mt-1 text-xs tracking-[0.14em] text-white">{next.name}</p>
        </div>
      </div>

      {/* Filmstrip — always know where you are */}
      <div className="border-t border-white/8 bg-[#070707] px-4 py-4 md:px-10">
        <div className="mx-auto flex max-w-6xl gap-3 overflow-x-auto pb-1 [-ms-overflow-style:none] [scrollbar-width:none] [&::-webkit-scrollbar]:hidden">
          {residences.map((r, i) => {
            const active = i === index;
            return (
              <button
                key={r.id}
                type="button"
                onClick={() => goTo(i, i > index ? 1 : -1)}
                className={`relative flex min-w-[148px] flex-1 items-center gap-3 rounded-2xl border px-3 py-2.5 text-left transition ${
                  active
                    ? "border-gold-soft/45 bg-gold-soft/10"
                    : "border-white/10 bg-white/[0.03] hover:border-white/25"
                }`}
              >
                <div
                  className="h-12 w-12 shrink-0 overflow-hidden rounded-xl bg-cover bg-center"
                  style={{ backgroundImage: `url(${r.image})` }}
                />
                <div className="min-w-0">
                  <p
                    className={`truncate text-[11px] tracking-[0.16em] uppercase ${
                      active ? "text-gold-soft" : "text-white/70"
                    }`}
                  >
                    {r.name}
                  </p>
                  <p className="mt-0.5 truncate text-[10px] text-white/45">
                    {r.progress}% obra · {r.waitlistCount}+ lista
                  </p>
                </div>
                {active && (
                  <span className="absolute top-2 right-2 h-1.5 w-1.5 rounded-full bg-gold-soft" />
                )}
              </button>
            );
          })}
        </div>
        <p className="mx-auto mt-3 max-w-6xl text-center text-[10px] tracking-[0.2em] text-white/30 uppercase md:text-left">
          {autoplayBlocked ? "Tour en pausa" : "Avance automático"} · desliza o toca otra casa
        </p>
      </div>

      <UnlockModal
        residence={current}
        open={unlockOpen}
        onClose={() => {
          setUnlockOpen(false);
          setPaused(false);
        }}
      />
    </section>
  );
}
