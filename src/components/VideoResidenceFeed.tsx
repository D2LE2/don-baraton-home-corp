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
import { residences } from "@/data/residences";
import { useLiveSocialProof } from "@/hooks/useLiveSocialProof";
import { formatUsd, savingsAmount, savingsPercent } from "@/lib/pricing";

function VideoSlide({
  residence,
  active,
  muted,
  onOpenUnlock,
  onSelect,
}: {
  residence: (typeof residences)[number];
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
      className={`w-[88vw] max-w-[880px] shrink-0 snap-center overflow-hidden rounded-[1.75rem] border bg-white shadow-[0_24px_80px_rgba(20,16,10,0.08)] transition duration-500 ${
        active
          ? "scale-100 border-gold/35 opacity-100"
          : "scale-[0.96] border-border opacity-70"
      }`}
      onClick={() => {
        if (!active) onSelect();
      }}
    >
      {/* Video area — clean, almost no cover */}
      <div className="relative aspect-[16/10] bg-[#ece8e1] md:aspect-[16/9]">
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

        <div className="absolute top-4 left-4 z-10 flex flex-wrap gap-2">
          <span className="inline-flex items-center gap-1.5 rounded-full border border-black/5 bg-white/95 px-3 py-1.5 text-[10px] tracking-[0.14em] text-ink uppercase shadow-sm">
            <Eye size={12} className="text-emerald-600" />
            {viewers} mirando
          </span>
          <span className="inline-flex items-center gap-1.5 rounded-full border border-black/5 bg-white/95 px-3 py-1.5 text-[10px] tracking-[0.14em] text-ink uppercase shadow-sm">
            <Users size={12} className="text-gold" />
            {waitlistLive} en lista
          </span>
        </div>

        <div className="pointer-events-none absolute top-4 right-4 z-10 w-[min(100%-2rem,240px)]">
          <AnimatePresence mode="popLayout">
            {active && toast && (
              <motion.div
                key={toast.id}
                initial={{ opacity: 0, y: -8 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0 }}
                className="rounded-2xl border border-black/5 bg-white/95 px-3 py-2.5 shadow-lg backdrop-blur-md"
              >
                <div className="flex items-start gap-2">
                  <span className="live-dot mt-1 shrink-0" />
                  <p className="text-[11px] leading-snug text-ink/80">{toast.text}</p>
                </div>
              </motion.div>
            )}
          </AnimatePresence>
        </div>
      </div>

      {/* Info below video — never covers it */}
      <div className="space-y-5 bg-white p-5 md:p-7">
        <div className="flex flex-wrap items-start justify-between gap-4">
          <div>
            <p className="text-[10px] tracking-[0.28em] text-gold uppercase">
              {residence.code}
            </p>
            <h2 className="mt-1 text-2xl font-light tracking-[0.06em] text-ink md:text-4xl">
              {residence.name}
            </h2>
            <p className="mt-1 text-sm text-muted">{residence.location}</p>
            <p className="script mt-2 text-2xl text-gold md:text-3xl">{residence.teaser}</p>
          </div>
          <div className="text-right">
            <p className="text-[10px] tracking-[0.2em] text-muted uppercase">Preventa</p>
            <p className="display mt-1 text-3xl text-ink">{formatUsd(residence.priceFrom)}</p>
            <p className="mt-1 text-xs text-muted line-through">
              {formatUsd(residence.marketValue)}
            </p>
            <p className="mt-1 text-[11px] font-medium text-emerald-700">
              -{savingsPercent(residence.priceFrom, residence.marketValue)}% vs mercado
            </p>
          </div>
        </div>

        <div>
          <div className="mb-1.5 flex justify-between text-[10px] tracking-[0.16em] text-muted uppercase">
            <span>Obra · {currentStage?.label ?? "En curso"}</span>
            <span className="text-ink">{residence.progress}%</span>
          </div>
          <div className="h-2 overflow-hidden rounded-full bg-[#ece8e1]">
            <div
              className="h-full rounded-full bg-gold transition-[width] duration-700"
              style={{ width: active ? `${residence.progress}%` : "0%" }}
            />
          </div>
          <p className="mt-2 text-xs text-muted">Entrega · {residence.expected}</p>
        </div>

        <div className="flex flex-wrap items-center gap-3">
          {!unlocked ? (
            <button
              type="button"
              onClick={(e) => {
                e.stopPropagation();
                onOpenUnlock();
              }}
              className="inline-flex items-center gap-2 rounded-full bg-ink px-6 py-3 text-[11px] font-medium tracking-[0.2em] text-white uppercase transition hover:bg-ink/90"
            >
              <Lock size={14} />
              Solicitar acceso
            </button>
          ) : (
            <Link
              href={`/residences/${residence.id}`}
              onClick={(e) => e.stopPropagation()}
              className="inline-flex items-center gap-2 rounded-full bg-ink px-6 py-3 text-[11px] font-medium tracking-[0.2em] text-white uppercase"
            >
              Abrir Build Story
              <ArrowRight size={14} />
            </Link>
          )}
          <p className="text-xs text-muted">{residence.priceHook}</p>
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

  const scrollToIndex = useCallback(
    (i: number) => {
      const clamped = Math.max(0, Math.min(total - 1, i));
      setIndex(clamped);
      cardRefs.current[clamped]?.scrollIntoView({
        behavior: "smooth",
        inline: "center",
        block: "nearest",
      });
    },
    [total],
  );

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
    <section id="casas" className="relative overflow-hidden bg-[#f7f5f1]">
      <div className="mx-auto flex max-w-6xl items-end justify-between gap-6 px-5 pb-6 pt-14 md:px-10 md:pt-16">
        <div>
          <p className="text-[11px] tracking-[0.32em] text-gold uppercase">
            Residencias activas
          </p>
          <h2 className="mt-2 text-3xl font-light tracking-wide text-ink md:text-4xl">
            Recorrido en vivo
          </h2>
          <p className="mt-2 max-w-md text-sm text-muted">
            Desliza para pasar de una residencia a otra. Hay más al lado.
          </p>
        </div>
        <div className="flex items-center gap-2">
          <button
            type="button"
            aria-label={muted ? "Activar sonido" : "Silenciar"}
            onClick={() => setMuted((m) => !m)}
            className="flex h-11 w-11 items-center justify-center rounded-full border border-border bg-white text-ink shadow-sm"
          >
            {muted ? <VolumeX size={15} /> : <Volume2 size={15} />}
          </button>
          <button
            type="button"
            aria-label="Anterior"
            disabled={index === 0}
            onClick={() => scrollToIndex(index - 1)}
            className="flex h-11 w-11 items-center justify-center rounded-full border border-border bg-white text-ink shadow-sm disabled:opacity-30"
          >
            <ArrowLeft size={16} />
          </button>
          <button
            type="button"
            aria-label="Siguiente"
            disabled={index === total - 1}
            onClick={() => scrollToIndex(index + 1)}
            className="flex h-11 w-11 items-center justify-center rounded-full border border-border bg-white text-ink shadow-sm disabled:opacity-30"
          >
            <ArrowRight size={16} />
          </button>
        </div>
      </div>

      <div
        ref={scrollerRef}
        className="flex snap-x snap-mandatory gap-5 overflow-x-auto scroll-smooth px-[6vw] pb-6 pt-2 [-ms-overflow-style:none] [scrollbar-width:none] md:gap-7 md:px-[14vw] [&::-webkit-scrollbar]:hidden"
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

      <div className="mx-auto flex max-w-6xl items-center justify-between px-5 pb-12 pt-1 md:px-10">
        <p className="text-sm text-muted">
          <span className="font-medium text-gold">
            {String(index + 1).padStart(2, "0")}
          </span>
          <span className="text-border"> / {String(total).padStart(2, "0")}</span>
          <span className="mx-2 text-border">·</span>
          <span className="text-ink">{current.name}</span>
        </p>
        <div className="flex items-center gap-2">
          {residences.map((r, i) => (
            <button
              key={r.id}
              type="button"
              aria-label={r.name}
              onClick={() => scrollToIndex(i)}
              className={`h-1.5 rounded-full transition-all ${
                i === index ? "w-8 bg-gold" : "w-1.5 bg-border hover:bg-muted"
              }`}
            />
          ))}
        </div>
      </div>

      {/* Light premium catalog */}
      <div className="border-t border-border bg-white px-5 py-16 md:px-10 md:py-20">
        <div className="mx-auto max-w-6xl">
          <div className="flex flex-col justify-between gap-4 md:flex-row md:items-end">
            <div>
              <p className="text-[11px] tracking-[0.32em] text-gold uppercase">
                Catálogo Omar Corp
              </p>
              <h3 className="mt-2 text-3xl font-light text-ink md:text-4xl">
                Tres residencias. Una decisión.
              </h3>
              <p className="mt-2 max-w-lg text-sm text-muted">
                Compara precio de preventa, avance de obra y demanda.
              </p>
            </div>
            <Link
              href="/residences"
              className="inline-flex items-center gap-2 text-[11px] tracking-[0.22em] text-gold uppercase"
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
                      ? "border-gold bg-[#fbf8f2] shadow-[0_16px_40px_rgba(20,16,10,0.06)]"
                      : "border-border bg-white hover:border-gold/40"
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
                    <div className="absolute top-3 left-3 flex gap-2">
                      <span className="rounded-full bg-white/95 px-2.5 py-1 text-[9px] tracking-[0.16em] text-ink uppercase shadow-sm">
                        {r.progress}% obra
                      </span>
                      {selected && (
                        <span className="rounded-full bg-ink px-2.5 py-1 text-[9px] tracking-[0.16em] text-white uppercase">
                          En vista
                        </span>
                      )}
                    </div>
                  </div>
                  <div className="space-y-3 p-5">
                    <div>
                      <p className="text-[10px] tracking-[0.22em] text-gold uppercase">
                        {r.code}
                      </p>
                      <p className="mt-1 text-xl tracking-[0.04em] text-ink">{r.name}</p>
                      <p className="mt-1 text-sm text-muted">{r.location}</p>
                    </div>
                    <div className="flex items-end justify-between gap-3">
                      <div>
                        <p className="text-[10px] tracking-[0.18em] text-muted uppercase">Desde</p>
                        <p className="display text-2xl text-ink">{formatUsd(r.priceFrom)}</p>
                      </div>
                      <p className="text-right text-[11px] text-emerald-700">
                        Ahorras {formatUsd(save, true)}
                      </p>
                    </div>
                    <div className="h-1.5 overflow-hidden rounded-full bg-[#ece8e1]">
                      <div
                        className="h-full rounded-full bg-gold"
                        style={{ width: `${r.progress}%` }}
                      />
                    </div>
                    <div className="flex items-center justify-between text-[11px] text-muted">
                      <span>{r.waitlistCount}+ en lista</span>
                      <span className="tracking-[0.14em] text-gold uppercase">Ver en vivo →</span>
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
