"use client";

import Link from "next/link";
import { ArrowRight, Lock, Volume2, VolumeX } from "lucide-react";
import { motion } from "framer-motion";
import { useEffect, useRef, useState } from "react";
import { Countdown } from "@/components/Countdown";
import { UnlockModal } from "@/components/UnlockModal";
import { useNova } from "@/context/NovaContext";
import { residences, type Residence } from "@/data/residences";

function VideoCard({
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
      el.currentTime = 0;
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
    <article className="relative h-[100dvh] min-h-[680px] w-full shrink-0 snap-start overflow-hidden bg-ink">
      <video
        ref={videoRef}
        className="absolute inset-0 h-full w-full object-cover"
        src={residence.video}
        poster={residence.image}
        playsInline
        loop
        muted={muted}
        preload="metadata"
      />

      <div className="absolute inset-0 bg-gradient-to-b from-black/55 via-black/15 to-black/85" />

      {/* Emotional free layer — always visible */}
      <div className="relative z-10 flex h-full flex-col justify-between px-5 pb-28 pt-28 md:px-12 md:pb-24 md:pt-32 lg:px-16">
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
          {/* Free emotional peek */}
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
                    className="mt-4 inline-flex items-center gap-2 rounded-full bg-gold-soft px-6 py-3 text-[11px] font-medium tracking-[0.2em] text-ink uppercase transition hover:bg-white"
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
                  className="inline-flex items-center gap-2 rounded-full bg-gold-soft px-7 py-3.5 text-[11px] font-medium tracking-[0.2em] text-ink uppercase"
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
        className="absolute right-5 bottom-8 z-20 flex h-11 w-11 items-center justify-center rounded-full border border-white/20 bg-black/40 text-white backdrop-blur-md md:right-10"
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

export function VideoResidenceFeed() {
  const scrollerRef = useRef<HTMLDivElement>(null);
  const [active, setActive] = useState(0);

  useEffect(() => {
    const el = scrollerRef.current;
    if (!el) return;
    const onScroll = () => {
      const i = Math.round(el.scrollTop / Math.max(el.clientHeight, 1));
      setActive(i);
    };
    el.addEventListener("scroll", onScroll, { passive: true });
    return () => el.removeEventListener("scroll", onScroll);
  }, []);

  return (
    <section id="casas" className="relative bg-ink">
      <div className="pointer-events-none absolute inset-x-0 top-0 z-20 flex justify-center pt-6">
        <p className="rounded-full border border-white/15 bg-black/40 px-4 py-2 text-[10px] tracking-[0.28em] text-gold-soft uppercase backdrop-blur-md">
          La magia está en el video · Desliza cada casa
        </p>
      </div>

      <div ref={scrollerRef} className="snap-y-mandatory h-[100dvh] overflow-y-auto">
        {residences.map((r, i) => (
          <VideoCard key={r.id} residence={r} active={active === i} />
        ))}
      </div>

      <div className="pointer-events-none fixed top-1/2 right-5 z-30 hidden -translate-y-1/2 flex-col gap-2 md:flex">
        {residences.map((r, i) => (
          <button
            key={r.id}
            type="button"
            aria-label={r.name}
            onClick={() => {
              scrollerRef.current?.scrollTo({
                top: i * (scrollerRef.current?.clientHeight ?? 0),
                behavior: "smooth",
              });
            }}
            className={`pointer-events-auto h-2 rounded-full transition-all ${
              active === i ? "w-8 bg-gold-soft" : "w-2 bg-white/30 hover:bg-white/60"
            }`}
          />
        ))}
      </div>
    </section>
  );
}
