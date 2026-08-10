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
    // Align like Amazon: active card to the left, next card peeks on the right
    const styles = getComputedStyle(scroller);
    const padLeft = Number.parseFloat(styles.paddingLeft) || 0;
    scroller.scrollTo({ left: Math.max(0, el.offsetLeft - padLeft), behavior });
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
        const styles = getComputedStyle(scroller);
        const padLeft = Number.parseFloat(styles.paddingLeft) || 0;
        const marker = scroller.scrollLeft + padLeft + 24;
        let best = 0;
        let bestDist = Infinity;
        cardRefs.current.forEach((card, i) => {
          if (!card) return;
          const dist = Math.abs(card.offsetLeft - marker);
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
    <section id="casas" className="relative bg-[#141210] text-white">
      <div className="mx-auto flex max-w-[1180px] items-end justify-between gap-4 px-5 py-8 md:px-12 md:py-10 lg:px-16">
        <div>
          <p className="text-[11px] font-medium tracking-[0.08em] text-[#e0c57a]">
            Colección en vivo
          </p>
          <h2 className="mt-1.5 text-[1.45rem] font-semibold tracking-tight text-white md:text-[1.75rem]">
            Mira cómo se transforman
          </h2>
          <p className="mt-1.5 text-[14px] text-white/45">
            Desliza para ver la siguiente residencia
          </p>
        </div>
        <p className="text-[13px] font-medium text-white/40 tabular-nums">
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
          className="residence-peek-scroller flex snap-x snap-mandatory gap-4 overflow-x-auto scroll-smooth pb-2 md:gap-5"
        >
          {residences.map((r, i) => {
            const active = i === index;
            return (
              <article
                key={r.id}
                ref={(el) => {
                  cardRefs.current[i] = el;
                }}
                data-active={active ? "true" : "false"}
                className="residence-peek-card relative shrink-0 snap-start overflow-hidden rounded-2xl bg-[#1c1916]"
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
                    sizes="(max-width: 768px) 78vw, 64vw"
                    priority={i === 0}
                  />

                  <div
                    className={`pointer-events-none absolute inset-0 transition ${
                      active
                        ? "bg-gradient-to-t from-black/50 via-transparent to-transparent"
                        : "bg-gradient-to-r from-transparent via-transparent to-black/10"
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
                    <div className="absolute inset-y-0 left-0 z-10 flex w-[48%] items-end bg-gradient-to-r from-black/60 to-transparent p-4">
                      <div>
                        <p className="text-[11px] font-medium text-[#e0c57a]">
                          {r.code.replace("RESIDENCE ", "R.")}
                        </p>
                        <p className="mt-1 text-[15px] font-semibold tracking-tight text-white">
                          {r.name}
                        </p>
                      </div>
                    </div>
                  )}
                </div>

                {active && (
                  <div className="border-t border-white/10 bg-[#1c1916] px-4 py-4 md:px-5 md:py-5">
                    <div className="flex flex-col gap-4 sm:flex-row sm:items-end sm:justify-between">
                      <div className="min-w-0">
                        <p className="text-[11px] font-medium text-[#e0c57a]">
                          {r.code}
                        </p>
                        <h3 className="mt-1 text-xl font-semibold tracking-tight text-white">
                          {r.name}
                        </h3>
                        <p className="mt-1.5 flex items-center gap-1 text-[13px] text-white/50">
                          <MapPin size={13} className="shrink-0 opacity-70" />
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
                          <span className="inline-flex items-center rounded-full border border-white/20 px-4 py-2.5 text-[12px] font-medium text-white/70">
                            En esta lista
                          </span>
                        ) : (
                          <button
                            type="button"
                            onClick={(e) => {
                              e.stopPropagation();
                              setWaitlistOpen(true);
                            }}
                            className="rounded-full bg-[#e0c57a] px-4 py-2.5 text-[12px] font-semibold text-ink transition hover:bg-white"
                          >
                            Unirse a lista
                          </button>
                        )}
                        <Link
                          href={`/residences/${r.id}`}
                          onClick={(e) => e.stopPropagation()}
                          className="inline-flex items-center gap-1.5 rounded-full border border-white/25 px-4 py-2.5 text-[12px] font-medium text-white/90 transition hover:border-white"
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

      <div className="h-12 bg-gradient-to-b from-[#141210] to-[#f6f5f3] md:h-14" />
    </section>
  );
}
