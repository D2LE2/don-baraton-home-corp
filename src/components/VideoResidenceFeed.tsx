"use client";

import Link from "next/link";
import { ArrowLeft, ArrowRight, Lock, Volume2, VolumeX } from "lucide-react";
import { AnimatePresence, motion, type PanInfo } from "framer-motion";
import { useEffect, useRef, useState } from "react";
import { Countdown } from "@/components/Countdown";
import { UnlockModal } from "@/components/UnlockModal";
import { useNova } from "@/context/NovaContext";
import { residences, type Residence } from "@/data/residences";

function VideoSlide({
  residence,
  active,
}: {
  residence: Residence;
  active: boolean;
}) {
  const videoRef = useRef<HTMLVideoElement>(null);
  const { isUnlocked, ready } = useNova();
  const unlocked = ready && isUnlocked(residence.id);
  const [showHook, setShowHook] = useState(false);
  const [wantMore, setWantMore] = useState(false);
  const [unlockOpen, setUnlockOpen] = useState(false);
  const [muted, setMuted] = useState(true);

  useEffect(() => {
    const el = videoRef.current;
    if (!el) return;
    if (active) {
      void el.play().catch(() => undefined);
      setShowHook(false);
      setWantMore(false);
      const t1 = window.setTimeout(() => setShowHook(true), 1800);
      const t2 = window.setTimeout(() => setWantMore(true), 4200);
      return () => {
        window.clearTimeout(t1);
        window.clearTimeout(t2);
      };
    }
    el.pause();
  }, [active]);

  useEffect(() => {
    const el = videoRef.current;
    if (el) el.muted = muted;
  }, [muted]);

  return (
    <div className="relative h-full w-full shrink-0 overflow-hidden bg-ink">
      <video
        ref={videoRef}
        className="pointer-events-none absolute inset-0 h-full w-full object-cover"
        src={residence.video}
        poster={residence.image}
        playsInline
        loop
        muted={muted}
        preload={active ? "auto" : "metadata"}
        controls={false}
        disablePictureInPicture
      />

      <div className="pointer-events-none absolute inset-0 bg-gradient-to-b from-black/50 via-black/10 to-black/80" />

      <div className="relative z-10 flex h-full flex-col justify-between px-5 pb-24 pt-20 md:px-12 md:pb-20 md:pt-24">
        <div>
          <div className="flex flex-wrap items-center gap-3">
            <span className="inline-flex items-center gap-2 rounded-full border border-gold-soft/40 bg-black/35 px-3 py-1.5 text-[10px] tracking-[0.22em] text-gold-soft uppercase backdrop-blur-md">
              <span className="live-dot" />
              Video en vivo
            </span>
            <span className="text-[10px] tracking-[0.22em] text-white/50 uppercase">
              {residence.code}
            </span>
          </div>

          <h2 className="mt-5 text-3xl font-light tracking-[0.08em] text-white md:text-5xl">
            {residence.name}
          </h2>
          <p className="mt-2 text-sm text-white/60">{residence.location}</p>

          <motion.p
            initial={{ opacity: 0, y: 10 }}
            animate={showHook ? { opacity: 1, y: 0 } : { opacity: 0, y: 10 }}
            className="script mt-4 max-w-md text-2xl text-gold-soft md:text-3xl"
          >
            {residence.teaser}
          </motion.p>
        </div>

        <div className="max-w-xl">
          <div className="mb-4 flex items-end gap-6">
            <div>
              <p className="display text-4xl font-light text-white md:text-5xl">
                {residence.progress}%
              </p>
              <p className="mt-1 text-[10px] tracking-[0.25em] text-white/50 uppercase">Built</p>
            </div>
          </div>

          {!unlocked ? (
            <motion.div
              initial={{ opacity: 0, y: 12 }}
              animate={wantMore ? { opacity: 1, y: 0 } : { opacity: 0, y: 12 }}
              className="rounded-[1.5rem] border border-white/15 bg-black/45 p-4 backdrop-blur-md md:p-5"
            >
              <p className="text-[11px] tracking-[0.22em] text-gold-soft uppercase">
                Quieres ver más
              </p>
              <p className="mt-2 text-sm text-white/70">
                Desbloquea el Build Story completo con tus datos.
              </p>
              <button
                type="button"
                onClick={() => setUnlockOpen(true)}
                className="mt-4 inline-flex items-center gap-2 rounded-full bg-gold-soft px-5 py-2.5 text-[11px] font-medium tracking-[0.2em] text-ink uppercase"
              >
                <Lock size={14} />
                Desbloquear
                <ArrowRight size={14} />
              </button>
            </motion.div>
          ) : (
            <div className="space-y-3">
              <div className="rounded-[1.5rem] border border-gold-soft/25 bg-black/40 px-4 py-4 backdrop-blur-md">
                <Countdown
                  targetDate={residence.completionDate}
                  variant="gold"
                  size="sm"
                  label={`Tiempo restante · ${residence.expected}`}
                />
              </div>
              <Link
                href={`/residences/${residence.id}`}
                className="inline-flex items-center gap-2 rounded-full bg-gold-soft px-6 py-3 text-[11px] font-medium tracking-[0.2em] text-ink uppercase"
              >
                Ver Build Story
                <ArrowRight size={14} />
              </Link>
            </div>
          )}
        </div>
      </div>

      <button
        type="button"
        aria-label={muted ? "Activar sonido" : "Silenciar"}
        onClick={() => setMuted((m) => !m)}
        className="absolute top-20 right-5 z-20 flex h-10 w-10 items-center justify-center rounded-full border border-white/20 bg-black/40 text-white backdrop-blur-md md:right-10"
      >
        {muted ? <VolumeX size={15} /> : <Volume2 size={15} />}
      </button>

      <UnlockModal
        residence={residence}
        open={unlockOpen}
        onClose={() => setUnlockOpen(false)}
      />
    </div>
  );
}

export function VideoResidenceFeed() {
  const [index, setIndex] = useState(0);
  const total = residences.length;
  const current = residences[index];

  function go(next: number) {
    setIndex(Math.max(0, Math.min(total - 1, next)));
  }

  function onDragEnd(_: unknown, info: PanInfo) {
    const threshold = 60;
    if (info.offset.x < -threshold) go(index + 1);
    else if (info.offset.x > threshold) go(index - 1);
  }

  return (
    <section id="casas" className="relative bg-ink">
      <div className="flex items-center justify-between px-5 py-5 md:px-10">
        <div>
          <p className="text-[11px] tracking-[0.3em] text-gold-soft uppercase">Residencias</p>
          <p className="mt-1 text-sm text-white/55">
            Desliza · {String(index + 1).padStart(2, "0")} / {String(total).padStart(2, "0")}
          </p>
        </div>
        <div className="flex items-center gap-2">
          <button
            type="button"
            aria-label="Anterior"
            onClick={() => go(index - 1)}
            disabled={index === 0}
            className="flex h-10 w-10 items-center justify-center rounded-full border border-white/20 text-white disabled:opacity-30"
          >
            <ArrowLeft size={16} />
          </button>
          <button
            type="button"
            aria-label="Siguiente"
            onClick={() => go(index + 1)}
            disabled={index === total - 1}
            className="flex h-10 w-10 items-center justify-center rounded-full border border-white/20 text-white disabled:opacity-30"
          >
            <ArrowRight size={16} />
          </button>
        </div>
      </div>

      <div className="relative h-[78dvh] min-h-[520px] overflow-hidden md:h-[82dvh]">
        <AnimatePresence initial={false} mode="popLayout">
          <motion.div
            key={current.id}
            className="absolute inset-0"
            initial={{ opacity: 0, x: 40 }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: -40 }}
            transition={{ duration: 0.35, ease: [0.22, 1, 0.36, 1] }}
            drag="x"
            dragConstraints={{ left: 0, right: 0 }}
            dragElastic={0.18}
            onDragEnd={onDragEnd}
          >
            <VideoSlide residence={current} active />
          </motion.div>
        </AnimatePresence>
      </div>

      <div className="flex items-center justify-center gap-2 pb-8">
        {residences.map((r, i) => (
          <button
            key={r.id}
            type="button"
            aria-label={r.name}
            onClick={() => go(i)}
            className={`h-1.5 rounded-full transition-all ${
              i === index ? "w-8 bg-gold-soft" : "w-1.5 bg-white/35 hover:bg-white/60"
            }`}
          />
        ))}
      </div>
    </section>
  );
}
