"use client";

import Link from "next/link";
import { ArrowRight, Lock, Volume2, VolumeX } from "lucide-react";
import { motion } from "framer-motion";
import { useEffect, useRef, useState } from "react";
import { Countdown } from "@/components/Countdown";
import { UnlockModal } from "@/components/UnlockModal";
import { useNova } from "@/context/NovaContext";
import { residences, type Residence } from "@/data/residences";

function VideoCard({ residence }: { residence: Residence }) {
  const articleRef = useRef<HTMLElement>(null);
  const videoRef = useRef<HTMLVideoElement>(null);
  const { isUnlocked, ready } = useNova();
  const unlocked = ready && isUnlocked(residence.id);
  const [active, setActive] = useState(false);
  const [showHook, setShowHook] = useState(false);
  const [wantMore, setWantMore] = useState(false);
  const [unlockOpen, setUnlockOpen] = useState(false);
  const [muted, setMuted] = useState(true);

  useEffect(() => {
    const node = articleRef.current;
    if (!node) return;
    const observer = new IntersectionObserver(
      ([entry]) => {
        setActive(entry.isIntersecting && entry.intersectionRatio >= 0.45);
      },
      { threshold: [0.45, 0.65] },
    );
    observer.observe(node);
    return () => observer.disconnect();
  }, []);

  useEffect(() => {
    const el = videoRef.current;
    if (!el) return;
    if (active) {
      void el.play().catch(() => undefined);
      setShowHook(false);
      setWantMore(false);
      const t1 = window.setTimeout(() => setShowHook(true), 2200);
      const t2 = window.setTimeout(() => setWantMore(true), 4800);
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
    <article
      ref={articleRef}
      className="relative min-h-[100dvh] w-full overflow-hidden bg-ink"
      style={{ touchAction: "pan-y" }}
    >
      <video
        ref={videoRef}
        className="pointer-events-none absolute inset-0 h-full w-full object-cover"
        src={residence.video}
        poster={residence.image}
        playsInline
        loop
        muted={muted}
        preload="metadata"
        controls={false}
        disablePictureInPicture
      />

      <div className="pointer-events-none absolute inset-0 bg-gradient-to-b from-black/55 via-black/15 to-black/85" />

      <div className="relative z-10 flex min-h-[100dvh] flex-col justify-between px-5 pb-28 pt-28 md:px-12 md:pb-24 md:pt-32 lg:px-16">
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

          <motion.h2
            initial={false}
            animate={{ opacity: 1, y: 0 }}
            className="mt-6 text-4xl font-light tracking-[0.08em] text-white md:text-6xl"
          >
            {residence.name}
          </motion.h2>
          <p className="mt-2 text-sm text-white/60">{residence.location}</p>

          <motion.p
            initial={{ opacity: 0, y: 12 }}
            animate={showHook ? { opacity: 1, y: 0 } : { opacity: 0, y: 12 }}
            transition={{ duration: 0.6 }}
            className="script mt-5 max-w-md text-3xl text-gold-soft md:text-4xl"
          >
            {residence.teaser}
          </motion.p>
        </div>

        <div className="max-w-xl">
          <div className="mb-5 flex items-end gap-6">
            <div>
              <p className="display text-5xl font-light text-white md:text-6xl">
                {residence.progress}%
              </p>
              <p className="mt-1 text-[10px] tracking-[0.25em] text-white/50 uppercase">Built</p>
            </div>
            <p className="mb-2 max-w-xs text-sm leading-relaxed text-white/55">
              Siente la transformación. El resto de la historia está bloqueado.
            </p>
          </div>

          {!unlocked ? (
            <motion.div
              initial={{ opacity: 0, y: 16 }}
              animate={wantMore ? { opacity: 1, y: 0 } : { opacity: 0, y: 16 }}
              transition={{ duration: 0.55 }}
              className="rounded-[1.5rem] border border-white/15 bg-black/45 p-5 backdrop-blur-md"
            >
              <div className="flex items-start gap-3">
                <div className="mt-0.5 rounded-full bg-gold-soft/15 p-2 text-gold-soft">
                  <Lock size={16} />
                </div>
                <div className="flex-1">
                  <p className="text-[11px] tracking-[0.22em] text-gold-soft uppercase">
                    Quieres ver más
                  </p>
                  <p className="mt-2 text-sm leading-relaxed text-white/70">
                    Build Story, fotos de cada etapa, contador completo y lista de espera —
                    desbloquéalo con tus datos.
                  </p>
                  <button
                    type="button"
                    onClick={() => setUnlockOpen(true)}
                    className="pointer-events-auto mt-4 inline-flex items-center gap-2 rounded-full bg-gold-soft px-6 py-3 text-[11px] font-medium tracking-[0.2em] text-ink uppercase transition hover:bg-white"
                  >
                    Desbloquear propiedad
                    <ArrowRight size={14} />
                  </button>
                </div>
              </div>
            </motion.div>
          ) : (
            <motion.div
              initial={{ opacity: 0, y: 12 }}
              animate={{ opacity: 1, y: 0 }}
              className="space-y-4"
            >
              <div className="rounded-[1.5rem] border border-gold-soft/25 bg-black/40 px-5 py-5 backdrop-blur-md">
                <Countdown
                  targetDate={residence.completionDate}
                  variant="gold"
                  size="sm"
                  label={`Tiempo restante · ${residence.expected}`}
                />
              </div>
              <div className="flex flex-wrap gap-3">
                <Link
                  href={`/residences/${residence.id}`}
                  className="pointer-events-auto inline-flex items-center gap-2 rounded-full bg-gold-soft px-7 py-3.5 text-[11px] font-medium tracking-[0.2em] text-ink uppercase"
                >
                  Ver Build Story
                  <ArrowRight size={14} />
                </Link>
                <span className="inline-flex items-center rounded-full border border-white/20 px-4 py-3 text-[10px] tracking-[0.2em] text-white/60 uppercase">
                  Desbloqueada ✓
                </span>
              </div>
            </motion.div>
          )}
        </div>
      </div>

      <button
        type="button"
        aria-label={muted ? "Activar sonido" : "Silenciar"}
        onClick={() => setMuted((m) => !m)}
        className="pointer-events-auto absolute right-5 bottom-8 z-20 flex h-11 w-11 items-center justify-center rounded-full border border-white/20 bg-black/40 text-white backdrop-blur-md md:right-10"
      >
        {muted ? <VolumeX size={16} /> : <Volume2 size={16} />}
      </button>

      <UnlockModal
        residence={residence}
        open={unlockOpen}
        onClose={() => setUnlockOpen(false)}
      />
    </article>
  );
}

/** Videos en el scroll normal de la página — sin contenedor interno que atrapa */
export function VideoResidenceFeed() {
  return (
    <section id="casas" className="relative bg-ink">
      <div className="pointer-events-none sticky top-4 z-20 flex justify-center pt-2">
        <p className="rounded-full border border-white/15 bg-black/40 px-4 py-2 text-[10px] tracking-[0.28em] text-gold-soft uppercase backdrop-blur-md">
          La magia está en el video · Desliza cada casa
        </p>
      </div>

      {residences.map((r) => (
        <VideoCard key={r.id} residence={r} />
      ))}
    </section>
  );
}
