"use client";

import Image from "next/image";
import Link from "next/link";
import {
  ArrowRight,
  ChevronLeft,
  ChevronRight,
  MapPin,
  Pause,
  Play,
} from "lucide-react";
import { useCallback, useEffect, useRef, useState } from "react";
import { ProgressBar } from "@/components/ProgressBar";
import { WaitlistJoin } from "@/components/WaitlistJoin";
import { useNova } from "@/context/NovaContext";
import { residences } from "@/data/residences";

/**
 * Amazon-style peek carousel — large residence cards with the next one
 * visibly sliding in from the side so the collection feels swipeable.
 */
export function VideoResidenceFeed() {
  const total = residences.length;
  const [index, setIndex] = useState(0);
  const [playing, setPlaying] = useState(true);
  const [waitlistOpen, setWaitlistOpen] = useState(false);
  const scrollerRef = useRef<HTMLDivElement>(null);
  const cardRefs = useRef<(HTMLElement | null)[]>([]);
  const videoRefs = useRef<(HTMLVideoElement | null)[]>([]);
  const current = residences[index];
  const { isOnWaitlist } = useNova();
  const joined = isOnWaitlist(current.id);

  const scrollToIndex = useCallback((i: number, behavior: ScrollBehavior = "smooth") => {
    const next = Math.max(0, Math.min(total - 1, i));
    const el = cardRefs.current[next];
    const scroller = scrollerRef.current;
    if (!el || !scroller) return;
    const left = el.offsetLeft - (scroller.clientWidth - el.clientWidth) / 2;
    scroller.scrollTo({ left: Math.max(0, left), behavior });
    setIndex(next);
    setPlaying(true);
    setWaitlistOpen(false);
  }, [total]);

  const goNext = useCallback(() => {
    if (index < total - 1) scrollToIndex(index + 1);
  }, [index, scrollToIndex, total]);

  const goPrev = useCallback(() => {
    if (index > 0) scrollToIndex(index - 1);
  }, [index, scrollToIndex]);

  // Sync active index from scroll position (peek carousel)
  useEffect(() => {
    const scroller = scrollerRef.current;
    if (!scroller) return;

    let raf = 0;
    const onScroll = () => {
      cancelAnimationFrame(raf);
      raf = requestAnimationFrame(() => {
        const center = scroller.scrollLeft + scroller.clientWidth / 2;
        let best = 0;
        let bestDist = Infinity;
        cardRefs.current.forEach((card, i) => {
          if (!card) return;
          const mid = card.offsetLeft + card.clientWidth / 2;
          const dist = Math.abs(mid - center);
          if (dist < bestDist) {
            bestDist = dist;
            best = i;
          }
        });
        setIndex((prev) => (prev === best ? prev : best));
      });
    };

    scroller.addEventListener("scroll", onScroll, { passive: true });
    return () => {
      cancelAnimationFrame(raf);
      scroller.removeEventListener("scroll", onScroll);
    };
  }, []);

  // Play only the active video
  useEffect(() => {
    videoRefs.current.forEach((el, i) => {
      if (!el) return;
      if (i === index && playing) {
        el.muted = true;
        const attempt = el.play();
        if (attempt) {
          attempt.catch(() => undefined);
        }
      } else {
        el.pause();
      }
    });
  }, [index, playing]);

  useEffect(() => {
    const onPlayAvance = (event: Event) => {
      const id = (event as CustomEvent<{ id?: string }>).detail?.id;
      const i = id ? residences.findIndex((r) => r.id === id) : 0;
      scrollToIndex(i >= 0 ? i : 0, "auto");
    };
    window.addEventListener("omar:play-avance", onPlayAvance);
    return () => window.removeEventListener("omar:play-avance", onPlayAvance);
  }, [scrollToIndex]);

  return (
    <section id="casas" className="relative bg-[#0f0e0c] text-white">
      <div className="flex items-center justify-between gap-4 px-5 py-5 md:px-12 md:py-6 lg:px-16">
        <div>
          <p className="text-[10px] tracking-[0.35em] text-[#c4a574] uppercase">
            Colección en vivo
          </p>
          <p className="mt-1.5 text-[12px] text-white/40">
            Desliza — hay más residencias al lado
          </p>
        </div>
        <p className="text-[10px] tracking-[0.22em] text-white/40 uppercase tabular-nums">
          {String(index + 1).padStart(2, "0")} / {String(total).padStart(2, "0")}
        </p>
      </div>

      <div className="relative">
        {index > 0 && (
          <button
            type="button"
            aria-label="Anterior"
            onClick={goPrev}
            className="absolute top-1/2 left-2 z-30 hidden h-11 w-11 -translate-y-1/2 items-center justify-center rounded-full border border-white/20 bg-black/55 text-white/90 backdrop-blur-sm md:left-4 md:flex lg:left-8"
          >
            <ChevronLeft size={20} strokeWidth={1.25} />
          </button>
        )}
        {index < total - 1 && (
          <button
            type="button"
            aria-label="Siguiente"
            onClick={goNext}
            className="absolute top-1/2 right-2 z-30 flex h-11 w-11 -translate-y-1/2 items-center justify-center rounded-full border border-white/20 bg-black/55 text-white/90 backdrop-blur-sm md:right-4 lg:right-8"
          >
            <ChevronRight size={20} strokeWidth={1.25} />
          </button>
        )}

        <div
          ref={scrollerRef}
          className="residence-peek-scroller flex snap-x snap-mandatory gap-3 overflow-x-auto scroll-smooth pb-1 md:gap-4"
        >
          {residences.map((r, i) => {
            const active = i === index;
            return (
              <article
                key={r.id}
                ref={(el) => {
                  cardRefs.current[i] = el;
                }}
                className="residence-peek-card relative shrink-0 snap-center overflow-hidden bg-[#12100e]"
                onClick={() => {
                  if (!active) scrollToIndex(i);
                }}
              >
                <div className="relative aspect-[16/10] w-full md:aspect-[16/9]">
                  <video
                    ref={(el) => {
                      videoRefs.current[i] = el;
                    }}
                    className="absolute inset-0 h-full w-full object-cover"
                    src={r.video}
                    autoPlay={active}
                    playsInline
                    loop
                    muted
                    preload={Math.abs(i - index) <= 1 ? "auto" : "metadata"}
                    controls={false}
                    disablePictureInPicture
                  />
                  <Image
                    src={r.image}
                    alt=""
                    fill
                    className={`object-cover transition-opacity duration-500 ${
                      active && playing ? "opacity-0" : "opacity-100"
                    }`}
                    sizes="(max-width: 768px) 88vw, 72vw"
                    priority={i === 0}
                  />

                  <div
                    className={`pointer-events-none absolute inset-0 transition ${
                      active
                        ? "bg-gradient-to-t from-black/50 via-transparent to-black/15"
                        : "bg-black/45"
                    }`}
                  />

                  {active && (
                    <button
                      type="button"
                      onClick={(e) => {
                        e.stopPropagation();
                        setPlaying((p) => !p);
                      }}
                      aria-label={playing ? "Pausar" : "Reanudar"}
                      className="absolute top-3 right-3 z-20 flex h-9 w-9 items-center justify-center rounded-full border border-white/20 bg-black/40 text-white/90 backdrop-blur-sm"
                    >
                      {playing ? (
                        <Pause size={13} fill="currentColor" />
                      ) : (
                        <Play size={13} fill="currentColor" className="ml-0.5" />
                      )}
                    </button>
                  )}

                  {!active && (
                    <div className="absolute inset-0 z-10 flex items-end p-4">
                      <div>
                        <p className="text-[9px] tracking-[0.28em] text-[#c4a574] uppercase">
                          {r.code}
                        </p>
                        <p className="mt-1 text-sm font-semibold tracking-[0.06em] text-white/90 uppercase">
                          {r.name}
                        </p>
                      </div>
                    </div>
                  )}
                </div>

                {active && (
                  <div className="border-t border-white/10 bg-[#12100e] px-4 py-4 md:px-5 md:py-5">
                    <div className="flex flex-col gap-4 sm:flex-row sm:items-end sm:justify-between">
                      <div className="min-w-0">
                        <p className="text-[10px] tracking-[0.28em] text-[#c4a574] uppercase">
                          {r.code}
                        </p>
                        <h2 className="mt-1 text-lg font-semibold tracking-[0.05em] text-white uppercase md:text-xl">
                          {r.name}
                        </h2>
                        <p className="mt-1.5 flex items-center gap-1 text-[12px] text-white/45">
                          <MapPin size={12} className="shrink-0 opacity-70" />
                          {r.location}
                        </p>
                        <div className="mt-3 max-w-[180px]">
                          <ProgressBar
                            key={r.id}
                            value={r.progress}
                            tone="dark"
                            size="sm"
                            showLabel
                            label="Progreso"
                            live
                          />
                        </div>
                      </div>
                      <div className="flex shrink-0 gap-2">
                        {joined ? (
                          <span className="inline-flex items-center border border-white/20 px-3.5 py-2.5 text-[10px] tracking-[0.16em] text-white/65 uppercase">
                            En esta lista
                          </span>
                        ) : (
                          <button
                            type="button"
                            onClick={(e) => {
                              e.stopPropagation();
                              setWaitlistOpen(true);
                            }}
                            className="bg-[#c4a574] px-4 py-2.5 text-[10px] font-semibold tracking-[0.16em] text-ink uppercase transition hover:bg-[#e0c57a]"
                          >
                            Unirse a lista
                          </button>
                        )}
                        <Link
                          href={`/residences/${r.id}`}
                          onClick={(e) => e.stopPropagation()}
                          className="inline-flex items-center gap-1.5 border border-white/25 px-3.5 py-2.5 text-[10px] tracking-[0.16em] text-white/85 uppercase transition hover:border-white"
                        >
                          Ver
                          <ArrowRight size={12} />
                        </Link>
                      </div>
                    </div>
                  </div>
                )}
              </article>
            );
          })}
        </div>
      </div>

      {/* Peek hint dots */}
      <div className="mt-4 flex items-center justify-center gap-2 px-5 pb-2">
        {residences.map((r, i) => (
          <button
            key={r.id}
            type="button"
            aria-label={r.code}
            onClick={() => scrollToIndex(i)}
            className={`h-1 rounded-full transition-all ${
              i === index ? "w-7 bg-[#e0c57a]" : "w-2 bg-white/25 hover:bg-white/45"
            }`}
          />
        ))}
      </div>

      <WaitlistJoin
        residence={current}
        open={waitlistOpen}
        onClose={() => setWaitlistOpen(false)}
      />

      <div className="h-10 bg-gradient-to-b from-[#0f0e0c] to-[#f7f4ef] md:h-12" />
    </section>
  );
}
