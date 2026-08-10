"use client";

import Image from "next/image";
import Link from "next/link";
import { ArrowLeft, ArrowRight, Lock, Volume2, VolumeX } from "lucide-react";
import { AnimatePresence, motion } from "framer-motion";
import { useCallback, useEffect, useRef, useState } from "react";
import { UnlockModal } from "@/components/UnlockModal";
import { useNova } from "@/context/NovaContext";
import { residences } from "@/data/residences";
import { useLiveSocialProof } from "@/hooks/useLiveSocialProof";
import { formatUsd, savingsPercent } from "@/lib/pricing";

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
      className={`w-[92vw] max-w-[1080px] shrink-0 snap-center transition duration-700 ${
        active ? "opacity-100" : "opacity-40"
      }`}
      onClick={() => {
        if (!active) onSelect();
      }}
    >
      {/* Cinematic frame — video is the hero */}
      <div className="relative aspect-[16/10] overflow-hidden bg-[#1a1814] md:aspect-[21/11]">
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
        {/* Hairline frame only — no dark wash over the film */}
        <div className="pointer-events-none absolute inset-0 ring-1 ring-inset ring-white/20" />

        <div className="absolute top-0 inset-x-0 z-10 flex items-start justify-between p-5 md:p-7">
          <p className="bg-white/90 px-3 py-1.5 text-[10px] tracking-[0.35em] text-ink uppercase backdrop-blur-sm">
            En vivo · {viewers} presentes
          </p>
          <AnimatePresence mode="popLayout">
            {active && toast && (
              <motion.p
                key={toast.id}
                initial={{ opacity: 0, y: -6 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0 }}
                className="max-w-[220px] bg-white/90 px-3 py-1.5 text-[10px] leading-relaxed tracking-[0.04em] text-ink/80 backdrop-blur-sm md:max-w-xs"
              >
                {toast.text}
              </motion.p>
            )}
          </AnimatePresence>
        </div>
      </div>

      {/* Editorial details under the film */}
      <div className="grid gap-8 border border-t-0 border-[#e8e2d8] bg-white px-5 py-8 md:grid-cols-[1.4fr_1fr] md:gap-12 md:px-10 md:py-10">
        <div>
          <div className="flex items-center gap-4">
            <span className="text-[11px] tracking-[0.4em] text-[#9a8660] uppercase">
              {residence.code}
            </span>
            <span className="h-px flex-1 bg-[#e8e2d8]" />
            <span className="text-[11px] tracking-[0.2em] text-[#8a847a] uppercase">
              {waitlistLive} en lista
            </span>
          </div>
          <h2 className="display mt-5 text-[clamp(2.4rem,5vw,4rem)] font-light leading-[0.95] tracking-[0.02em] text-ink">
            {residence.name}
          </h2>
          <p className="mt-3 text-sm tracking-[0.08em] text-[#8a847a] uppercase">
            {residence.location}
          </p>
          <p className="mt-5 max-w-md text-[15px] leading-relaxed text-[#5c574f]">
            {residence.teaser}
          </p>
        </div>

        <div className="flex flex-col justify-between border-t border-[#e8e2d8] pt-6 md:border-t-0 md:border-l md:pt-0 md:pl-10">
          <div>
            <p className="text-[10px] tracking-[0.35em] text-[#9a8660] uppercase">
              Precio de preventa
            </p>
            <p className="display mt-2 text-4xl font-light text-ink md:text-5xl">
              {formatUsd(residence.priceFrom)}
            </p>
            <p className="mt-2 text-sm text-[#8a847a]">
              Valor estimado {formatUsd(residence.marketValue)} ·{" "}
              <span className="text-ink">
                {savingsPercent(residence.priceFrom, residence.marketValue)}% bajo mercado
              </span>
            </p>
            <p className="mt-3 text-[12px] tracking-[0.06em] text-[#9a8660]">
              {residence.priceHook}
            </p>
          </div>

          <div className="mt-8">
            <div className="mb-2 flex justify-between text-[10px] tracking-[0.25em] text-[#8a847a] uppercase">
              <span>{currentStage?.label ?? "Construcción"}</span>
              <span className="text-ink">{residence.progress}%</span>
            </div>
            <div className="h-px overflow-hidden bg-[#e8e2d8]">
              <div
                className="h-full bg-[#9a8660] transition-[width] duration-1000 ease-out"
                style={{ width: active ? `${residence.progress}%` : "0%" }}
              />
            </div>
            <p className="mt-3 text-[11px] tracking-[0.18em] text-[#8a847a] uppercase">
              Entrega · {residence.expected}
            </p>

            <div className="mt-8">
              {!unlocked ? (
                <button
                  type="button"
                  onClick={(e) => {
                    e.stopPropagation();
                    onOpenUnlock();
                  }}
                  className="inline-flex items-center gap-3 border border-ink bg-ink px-8 py-3.5 text-[11px] tracking-[0.28em] text-white uppercase transition hover:bg-transparent hover:text-ink"
                >
                  <Lock size={13} />
                  Solicitar acceso
                </button>
              ) : (
                <Link
                  href={`/residences/${residence.id}`}
                  onClick={(e) => e.stopPropagation()}
                  className="inline-flex items-center gap-3 border border-ink bg-ink px-8 py-3.5 text-[11px] tracking-[0.28em] text-white uppercase transition hover:bg-transparent hover:text-ink"
                >
                  Build Story
                  <ArrowRight size={14} />
                </Link>
              )}
            </div>
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
    <section id="casas" className="relative overflow-hidden bg-[#faf8f4]">
      {/* Gallery header */}
      <div className="mx-auto max-w-[1200px] px-5 pt-16 md:px-10 md:pt-24">
        <div className="flex flex-col gap-8 border-b border-[#e8e2d8] pb-8 md:flex-row md:items-end md:justify-between">
          <div>
            <p className="text-[11px] tracking-[0.45em] text-[#9a8660] uppercase">
              Colección privada
            </p>
            <h2 className="display mt-4 text-[clamp(2.5rem,6vw,4.5rem)] font-light leading-[0.95] text-ink">
              Residencias
              <br />
              en construcción
            </h2>
          </div>
          <div className="flex flex-col items-start gap-5 md:items-end">
            <p className="max-w-xs text-right text-sm leading-relaxed text-[#8a847a] md:text-left">
              Desliza con calma. Cada propiedad es un lanzamiento — precio de preventa, obra y
              demanda en tiempo real.
            </p>
            <div className="flex items-center gap-3">
              <button
                type="button"
                aria-label={muted ? "Activar sonido" : "Silenciar"}
                onClick={() => setMuted((m) => !m)}
                className="flex h-10 w-10 items-center justify-center border border-[#d9d2c6] text-ink transition hover:border-ink"
              >
                {muted ? <VolumeX size={15} /> : <Volume2 size={15} />}
              </button>
              <button
                type="button"
                aria-label="Anterior"
                disabled={index === 0}
                onClick={() => scrollToIndex(index - 1)}
                className="flex h-10 w-10 items-center justify-center border border-[#d9d2c6] text-ink transition hover:border-ink disabled:opacity-25"
              >
                <ArrowLeft size={15} />
              </button>
              <button
                type="button"
                aria-label="Siguiente"
                disabled={index === total - 1}
                onClick={() => scrollToIndex(index + 1)}
                className="flex h-10 w-10 items-center justify-center border border-[#d9d2c6] text-ink transition hover:border-ink disabled:opacity-25"
              >
                <ArrowRight size={15} />
              </button>
            </div>
          </div>
        </div>

        <div className="mt-4 flex items-center justify-between text-[11px] tracking-[0.3em] text-[#8a847a] uppercase">
          <p>
            {String(index + 1).padStart(2, "0")} — {String(total).padStart(2, "0")}
          </p>
          <p>{current.name}</p>
        </div>
      </div>

      <div
        ref={scrollerRef}
        className="mt-8 flex snap-x snap-mandatory gap-6 overflow-x-auto scroll-smooth px-[4vw] pb-4 [-ms-overflow-style:none] [scrollbar-width:none] md:gap-10 md:px-[calc((100vw-1080px)/2)] [&::-webkit-scrollbar]:hidden"
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

      <div className="mx-auto flex max-w-[1200px] justify-center gap-3 px-5 py-10">
        {residences.map((r, i) => (
          <button
            key={r.id}
            type="button"
            aria-label={r.name}
            onClick={() => scrollToIndex(i)}
            className={`h-px transition-all duration-500 ${
              i === index ? "w-16 bg-ink" : "w-8 bg-[#d9d2c6] hover:bg-[#9a8660]"
            }`}
          />
        ))}
      </div>

      {/* Editorial catalog */}
      <div className="border-t border-[#e8e2d8] bg-white">
        <div className="mx-auto max-w-[1200px] px-5 py-20 md:px-10 md:py-28">
          <div className="mb-14 flex flex-col justify-between gap-6 md:flex-row md:items-end">
            <div>
              <p className="text-[11px] tracking-[0.45em] text-[#9a8660] uppercase">
                Inventario selecto
              </p>
              <h3 className="display mt-4 text-4xl font-light text-ink md:text-5xl">
                Comparar residencias
              </h3>
            </div>
            <Link
              href="/residences"
              className="inline-flex items-center gap-3 text-[11px] tracking-[0.28em] text-ink uppercase transition hover:text-[#9a8660]"
            >
              Showroom completo
              <ArrowRight size={14} />
            </Link>
          </div>

          <div className="divide-y divide-[#e8e2d8] border-y border-[#e8e2d8]">
            {residences.map((r, i) => {
              const selected = i === index;
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
                  className={`group grid w-full grid-cols-1 items-center gap-6 py-8 text-left transition md:grid-cols-[140px_1.2fr_1fr_auto] md:gap-10 md:py-10 ${
                    selected ? "bg-[#faf8f4]" : "hover:bg-[#faf8f4]"
                  }`}
                >
                  <div className="relative aspect-[4/3] overflow-hidden md:aspect-[5/4]">
                    <Image
                      src={r.image}
                      alt={r.name}
                      fill
                      className="object-cover transition duration-700 group-hover:scale-[1.03]"
                      sizes="180px"
                    />
                  </div>

                  <div>
                    <p className="text-[10px] tracking-[0.35em] text-[#9a8660] uppercase">
                      {String(i + 1).padStart(2, "0")} · {r.code}
                    </p>
                    <p className="display mt-2 text-3xl font-light text-ink md:text-4xl">
                      {r.name}
                    </p>
                    <p className="mt-2 text-sm text-[#8a847a]">{r.location}</p>
                  </div>

                  <div className="space-y-3">
                    <div className="flex items-baseline justify-between gap-4 md:block">
                      <p className="display text-2xl text-ink">{formatUsd(r.priceFrom)}</p>
                      <p className="text-xs tracking-[0.12em] text-[#8a847a] uppercase">
                        {r.progress}% construido · {r.waitlistCount} en lista
                      </p>
                    </div>
                    <div className="h-px bg-[#e8e2d8]">
                      <div
                        className="h-full bg-[#9a8660]"
                        style={{ width: `${r.progress}%` }}
                      />
                    </div>
                  </div>

                  <div className="flex items-center gap-3 text-[11px] tracking-[0.25em] text-ink uppercase">
                    {selected ? "En vista" : "Ver"}
                    <ArrowRight
                      size={14}
                      className="transition group-hover:translate-x-1"
                    />
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
