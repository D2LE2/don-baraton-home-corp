"use client";

import Image from "next/image";
import Link from "next/link";
import {
  ArrowLeft,
  ArrowRight,
  Eye,
  Lock,
  Users,
  Volume2,
  VolumeX,
} from "lucide-react";
import { AnimatePresence, motion } from "framer-motion";
import { useCallback, useEffect, useRef, useState } from "react";
import { UnlockModal } from "@/components/UnlockModal";
import { useNova } from "@/context/NovaContext";
import { residences, type Residence } from "@/data/residences";
import { useLiveSocialProof } from "@/hooks/useLiveSocialProof";
import { formatUsd, savingsAmount, savingsPercent } from "@/lib/pricing";

function VideoSlide({
  residence,
  active,
  muted,
  onOpenUnlock,
  onSelect,
}: {
  residence: Residence;
  active: boolean;
  muted: boolean;
  onOpenUnlock: () => void;
  onSelect: () => void;
}) {
  const videoRef = useRef<HTMLVideoElement>(null);
  const { isUnlocked, ready } = useNova();
  const unlocked = ready && isUnlocked(residence.id);
  const { viewers, waitlistLive, toast, currentStage } = useLiveSocialProof(
    residence,
    active,
  );

  useEffect(() => {
    const el = videoRef.current;
    if (!el) return;
    if (active) {
      void el.play().catch(() => undefined);
      return;
    }
    el.pause();
  }, [active]);

  useEffect(() => {
    const el = videoRef.current;
    if (el) el.muted = muted;
  }, [muted]);

  return (
    <article
      className={`relative h-[70dvh] min-h-[480px] w-[86vw] max-w-[920px] shrink-0 snap-center overflow-hidden rounded-[1.75rem] bg-ink transition-[opacity,transform] duration-500 md:h-[74dvh] md:w-[72vw] ${
        active ? "scale-100 opacity-100" : "scale-[0.94] opacity-55"
      }`}
      onClick={() => {
        if (!active) onSelect();
      }}
    >
      <video
        ref={videoRef}
        className="pointer-events-none absolute inset-0 h-full w-full object-cover"
        src={residence.video}
        poster={residence.image}
        playsInline
        loop
        muted={muted}
        preload="auto"
        controls={false}
        disablePictureInPicture
      />

      <div className="pointer-events-none absolute inset-0 bg-black/30" />
      <div className="pointer-events-none absolute inset-0 bg-gradient-to-b from-black/75 via-transparent to-black/90" />

      <div className="pointer-events-none absolute top-5 right-5 z-20 w-[min(100%-2.5rem,260px)]">
        <AnimatePresence mode="popLayout">
          {active && toast && (
            <motion.div
              key={toast.id}
              initial={{ opacity: 0, y: -8 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0 }}
              className="rounded-2xl border border-white/15 bg-black/75 px-3 py-2.5 backdrop-blur-md"
            >
              <div className="flex items-start gap-2">
                <span className="live-dot mt-1 shrink-0" />
                <p className="text-[11px] leading-snug text-white/90">{toast.text}</p>
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </div>

      <div className="relative z-10 flex h-full flex-col justify-between p-5 md:p-8">
        <div className="flex flex-wrap items-center gap-2">
          <span className="inline-flex items-center gap-2 rounded-full border border-emerald-400/30 bg-emerald-500/15 px-3 py-1.5 text-[10px] tracking-[0.16em] text-emerald-200 uppercase">
            <Eye size={12} />
            {viewers} mirando
          </span>
          <span className="inline-flex items-center gap-2 rounded-full border border-gold-soft/35 bg-gold-soft/10 px-3 py-1.5 text-[10px] tracking-[0.16em] text-gold-soft uppercase">
            <Users size={12} />
            {waitlistLive} en lista
          </span>
        </div>

        <div className="max-w-xl rounded-[1.5rem] bg-black/55 p-5 backdrop-blur-md md:p-6">
          <p className="text-[10px] tracking-[0.3em] text-gold-soft uppercase">
            {residence.code}
          </p>
          <h2 className="mt-2 text-3xl font-light tracking-[0.08em] text-white md:text-5xl">
            {residence.name}
          </h2>
          <p className="mt-1 text-sm text-white/75">{residence.location}</p>
          <p className="script mt-3 text-2xl text-gold-soft md:text-3xl">{residence.teaser}</p>

          <div className="mt-5 flex flex-wrap items-end justify-between gap-4 border-t border-white/10 pt-5">
            <div>
              <p className="text-[10px] tracking-[0.22em] text-gold-soft uppercase">
                Precio de preventa
              </p>
              <p className="mt-1 display text-3xl text-white">
                {formatUsd(residence.priceFrom)}
              </p>
              <p className="mt-1 text-xs text-white/55">
                Mercado {formatUsd(residence.marketValue)} · -
                {savingsPercent(residence.priceFrom, residence.marketValue)}%
              </p>
            </div>
            <div className="min-w-[140px] flex-1">
              <div className="mb-1 flex justify-between text-[10px] tracking-[0.16em] text-white/60 uppercase">
                <span>{currentStage?.label ?? "Obra"}</span>
                <span>{residence.progress}%</span>
              </div>
              <div className="h-2 overflow-hidden rounded-full bg-white/15">
                <div
                  className="h-full rounded-full bg-gold-soft transition-[width] duration-700"
                  style={{ width: active ? `${residence.progress}%` : "0%" }}
                />
              </div>
            </div>
          </div>

          <div className="mt-5">
            {!unlocked ? (
              <button
                type="button"
                onClick={(e) => {
                  e.stopPropagation();
                  onOpenUnlock();
                }}
                className="inline-flex items-center gap-2 rounded-full bg-gold-soft px-6 py-3 text-[11px] font-medium tracking-[0.2em] text-ink uppercase"
              >
                <Lock size={14} />
                Solicitar acceso
              </button>
            ) : (
              <Link
                href={`/residences/${residence.id}`}
                onClick={(e) => e.stopPropagation()}
                className="inline-flex items-center gap-2 rounded-full bg-gold-soft px-6 py-3 text-[11px] font-medium tracking-[0.2em] text-ink uppercase"
              >
                Abrir Build Story
                <ArrowRight size={14} />
              </Link>
            )}
          </div>
        </div>
      </div>
    </article>
  );
}

export function VideoResidenceFeed() {
  const total = residences.length;
  const [index, setIndex] = useState(0);
  const [muted, setMuted] = useState(true);
  const [unlockOpen, setUnlockOpen] = useState(false);
  const scrollerRef = useRef<HTMLDivElement>(null);
  const cardRefs = useRef<(HTMLDivElement | null)[]>([]);
  const current = residences[index];

  const scrollToIndex = useCallback((i: number) => {
    const clamped = Math.max(0, Math.min(total - 1, i));
    setIndex(clamped);
    const node = cardRefs.current[clamped];
    node?.scrollIntoView({
      behavior: "smooth",
      inline: "center",
      block: "nearest",
    });
  }, [total]);

  // Keep index in sync with scroll snap
  useEffect(() => {
    const scroller = scrollerRef.current;
    if (!scroller) return;

    let frame = 0;
    const onScroll = () => {
      cancelAnimationFrame(frame);
      frame = requestAnimationFrame(() => {
        const center = scroller.scrollLeft + scroller.clientWidth / 2;
        let best = 0;
        let bestDist = Infinity;
        cardRefs.current.forEach((el, i) => {
          if (!el) return;
          const mid = el.offsetLeft + el.offsetWidth / 2;
          const dist = Math.abs(mid - center);
          if (dist < bestDist) {
            bestDist = dist;
            best = i;
          }
        });
        setIndex(best);
      });
    };

    scroller.addEventListener("scroll", onScroll, { passive: true });
    return () => {
      scroller.removeEventListener("scroll", onScroll);
      cancelAnimationFrame(frame);
    };
  }, []);

  // Warm-load all videos once
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
    <section id="casas" className="relative overflow-hidden bg-ink">
      <div className="mx-auto flex max-w-6xl items-end justify-between gap-6 px-5 pb-6 pt-14 md:px-10 md:pt-16">
        <div>
          <p className="text-[11px] tracking-[0.32em] text-gold-soft uppercase">
            Residencias activas
          </p>
          <h2 className="mt-2 text-3xl font-light tracking-wide text-white md:text-4xl">
            Recorrido en vivo
          </h2>
          <p className="mt-2 max-w-md text-sm text-white/55">
            Desliza para pasar de una residencia a otra. Hay más al lado.
          </p>
        </div>
        <div className="flex items-center gap-2">
          <button
            type="button"
            aria-label={muted ? "Activar sonido" : "Silenciar"}
            onClick={() => setMuted((m) => !m)}
            className="flex h-11 w-11 items-center justify-center rounded-full border border-white/20 text-white"
          >
            {muted ? <VolumeX size={15} /> : <Volume2 size={15} />}
          </button>
          <button
            type="button"
            aria-label="Anterior"
            disabled={index === 0}
            onClick={() => scrollToIndex(index - 1)}
            className="flex h-11 w-11 items-center justify-center rounded-full border border-white/20 text-white disabled:opacity-30"
          >
            <ArrowLeft size={16} />
          </button>
          <button
            type="button"
            aria-label="Siguiente"
            disabled={index === total - 1}
            onClick={() => scrollToIndex(index + 1)}
            className="flex h-11 w-11 items-center justify-center rounded-full border border-white/20 text-white disabled:opacity-30"
          >
            <ArrowRight size={16} />
          </button>
        </div>
      </div>

      <div
        ref={scrollerRef}
        className="flex snap-x snap-mandatory gap-4 overflow-x-auto scroll-smooth px-[7vw] pb-4 pt-2 [-ms-overflow-style:none] [scrollbar-width:none] md:gap-6 md:px-[14vw] [&::-webkit-scrollbar]:hidden"
      >
        {residences.map((r, i) => (
          <div
            key={r.id}
            ref={(el) => {
              cardRefs.current[i] = el;
            }}
            className="snap-center"
          >
            <VideoSlide
              residence={r}
              active={i === index}
              muted={muted}
              onSelect={() => scrollToIndex(i)}
              onOpenUnlock={() => setUnlockOpen(true)}
            />
          </div>
        ))}
      </div>

      <div className="mx-auto flex max-w-6xl items-center justify-between px-5 pb-10 pt-2 md:px-10">
        <p className="text-sm text-white/70">
          <span className="text-gold-soft">{String(index + 1).padStart(2, "0")}</span>
          <span className="text-white/35"> / {String(total).padStart(2, "0")}</span>
          <span className="mx-2 text-white/25">·</span>
          {current.name}
        </p>
        <div className="flex items-center gap-2">
          {residences.map((r, i) => (
            <button
              key={r.id}
              type="button"
              aria-label={r.name}
              onClick={() => scrollToIndex(i)}
              className={`h-1.5 rounded-full transition-all ${
                i === index ? "w-8 bg-gold-soft" : "w-1.5 bg-white/30 hover:bg-white/60"
              }`}
            />
          ))}
        </div>
      </div>

      {/* Catalog showcase */}
      <div className="border-t border-white/10 bg-[#0a0a0a] px-5 py-16 md:px-10 md:py-20">
        <div className="mx-auto max-w-6xl">
          <div className="flex flex-col justify-between gap-4 md:flex-row md:items-end">
            <div>
              <p className="text-[11px] tracking-[0.32em] text-gold-soft uppercase">
                Catálogo Omar Corp
              </p>
              <h3 className="mt-2 text-3xl font-light text-white md:text-4xl">
                Tres residencias. Una decisión.
              </h3>
              <p className="mt-2 max-w-lg text-sm text-white/50">
                Compara precio de preventa, avance de obra y demanda. Elige la que quieres seguir.
              </p>
            </div>
            <Link
              href="/residences"
              className="inline-flex items-center gap-2 text-[11px] tracking-[0.22em] text-gold-soft uppercase"
            >
              Ver showroom completo
              <ArrowRight size={14} />
            </Link>
          </div>

          <div className="mt-10 grid gap-5 md:grid-cols-3">
            {residences.map((r, i) => {
              const selected = i === index;
              const save = savingsAmount(r.priceFrom, r.marketValue);
              return (
                <button
                  key={r.id}
                  type="button"
                  onClick={() => {
                    scrollToIndex(i);
                    document.getElementById("casas")?.scrollIntoView({
                      behavior: "smooth",
                      block: "start",
                    });
                  }}
                  className={`group overflow-hidden rounded-[1.75rem] border text-left transition ${
                    selected
                      ? "border-gold-soft/50 bg-gold-soft/5"
                      : "border-white/10 bg-white/[0.02] hover:border-white/25"
                  }`}
                >
                  <div className="relative aspect-[4/3] overflow-hidden">
                    <Image
                      src={r.image}
                      alt={r.name}
                      fill
                      className="object-cover transition duration-700 group-hover:scale-105"
                      sizes="(max-width: 768px) 100vw, 33vw"
                    />
                    <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/20 to-transparent" />
                    <div className="absolute top-3 left-3 flex gap-2">
                      <span className="rounded-full bg-black/55 px-2.5 py-1 text-[9px] tracking-[0.18em] text-white uppercase backdrop-blur-md">
                        {r.progress}% obra
                      </span>
                      {selected && (
                        <span className="rounded-full bg-gold-soft px-2.5 py-1 text-[9px] tracking-[0.18em] text-ink uppercase">
                          En vista
                        </span>
                      )}
                    </div>
                    <div className="absolute inset-x-0 bottom-0 p-4">
                      <p className="text-[10px] tracking-[0.25em] text-gold-soft uppercase">
                        {r.code}
                      </p>
                      <p className="mt-1 text-xl tracking-[0.06em] text-white">{r.name}</p>
                    </div>
                  </div>
                  <div className="space-y-3 p-4">
                    <div className="flex items-end justify-between gap-3">
                      <div>
                        <p className="text-[10px] tracking-[0.2em] text-white/40 uppercase">
                          Desde
                        </p>
                        <p className="display text-2xl text-white">{formatUsd(r.priceFrom)}</p>
                      </div>
                      <p className="text-right text-[11px] text-emerald-300">
                        Ahorras {formatUsd(save, true)}
                      </p>
                    </div>
                    <div className="h-1.5 overflow-hidden rounded-full bg-white/10">
                      <div
                        className="h-full rounded-full bg-gold-soft"
                        style={{ width: `${r.progress}%` }}
                      />
                    </div>
                    <div className="flex items-center justify-between text-[11px] text-white/45">
                      <span>{r.waitlistCount}+ en lista</span>
                      <span className="tracking-[0.14em] text-gold-soft uppercase">
                        Ver en vivo →
                      </span>
                    </div>
                  </div>
                </button>
              );
            })}
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
