"use client";

import Image from "next/image";
import Link from "next/link";
import { ChevronLeft, ChevronRight, Heart } from "lucide-react";
import { useCallback, useEffect, useRef, useState } from "react";
import { ProgressBar } from "@/components/ProgressBar";
import { WaitlistJoin } from "@/components/WaitlistJoin";
import { useNova } from "@/context/NovaContext";
import { residences, type Residence } from "@/data/residences";

/**
 * Airbnb-style horizontal listing rail — cards sit beside each other
 * with a peek of the next one (never a tall stack of rows).
 */
export function ResidencesCatalog() {
  const { isOnWaitlist } = useNova();
  const [active, setActive] = useState<Residence | null>(null);
  const [index, setIndex] = useState(0);
  const scrollerRef = useRef<HTMLDivElement>(null);
  const cardRefs = useRef<(HTMLElement | null)[]>([]);

  const scrollToIndex = useCallback((i: number) => {
    const next = Math.max(0, Math.min(residences.length - 1, i));
    const el = cardRefs.current[next];
    const scroller = scrollerRef.current;
    if (!el || !scroller) return;
    const pad = Number.parseFloat(getComputedStyle(scroller).paddingLeft) || 0;
    scroller.scrollTo({ left: Math.max(0, el.offsetLeft - pad), behavior: "smooth" });
    setIndex(next);
  }, []);

  useEffect(() => {
    const scroller = scrollerRef.current;
    if (!scroller) return;
    let raf = 0;
    const onScroll = () => {
      cancelAnimationFrame(raf);
      raf = requestAnimationFrame(() => {
        const pad = Number.parseFloat(getComputedStyle(scroller).paddingLeft) || 0;
        const marker = scroller.scrollLeft + pad + 40;
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

  return (
    <section id="catalogo" className="bg-[#f7f7f5] py-12 md:py-16">
      <div className="mx-auto mb-6 flex max-w-[1200px] items-end justify-between gap-4 px-5 md:mb-8 md:px-10 lg:px-12">
        <div>
          <p className="text-[12px] font-medium text-[#8a6b2e]">Residencias</p>
          <h2 className="mt-1 text-[1.55rem] font-semibold tracking-tight text-ink md:text-[1.85rem]">
            Explora la colección
          </h2>
          <p className="mt-1.5 text-[14px] text-[#6a6660]">
            Desliza — cada casa tiene su propia lista
          </p>
        </div>
        <div className="hidden items-center gap-2 sm:flex">
          <button
            type="button"
            aria-label="Anterior"
            disabled={index <= 0}
            onClick={() => scrollToIndex(index - 1)}
            className="flex h-10 w-10 items-center justify-center rounded-full border border-[#ddd6cb] bg-white text-ink transition enabled:hover:border-ink disabled:opacity-30"
          >
            <ChevronLeft size={18} />
          </button>
          <button
            type="button"
            aria-label="Siguiente"
            disabled={index >= residences.length - 1}
            onClick={() => scrollToIndex(index + 1)}
            className="flex h-10 w-10 items-center justify-center rounded-full border border-[#ddd6cb] bg-white text-ink transition enabled:hover:border-ink disabled:opacity-30"
          >
            <ChevronRight size={18} />
          </button>
        </div>
      </div>

      <div
        ref={scrollerRef}
        className="catalog-peek-scroller flex snap-x snap-mandatory gap-4 overflow-x-auto scroll-smooth pb-2"
      >
        {residences.map((r, i) => {
          const joined = isOnWaitlist(r.id);
          return (
            <article
              key={r.id}
              ref={(el) => {
                cardRefs.current[i] = el;
              }}
              className="catalog-peek-card group shrink-0 snap-start"
            >
              <Link
                href={`/residences/${r.id}`}
                className="relative block aspect-[4/3] overflow-hidden rounded-[1.25rem] bg-[#e8e2d8] shadow-[0_10px_30px_rgba(20,16,10,0.08)]"
              >
                <Image
                  src={r.image}
                  alt={r.name}
                  fill
                  className="object-cover transition duration-700 ease-out group-hover:scale-[1.04]"
                  sizes="(max-width: 768px) 78vw, 360px"
                />
                <div className="absolute top-3 left-3 rounded-full bg-white/95 px-2.5 py-1 text-[11px] font-semibold text-ink shadow-sm">
                  {r.progress}% obra
                </div>
                <button
                  type="button"
                  aria-label="Unirse a lista"
                  onClick={(e) => {
                    e.preventDefault();
                    if (!joined) setActive(r);
                  }}
                  className="absolute top-3 right-3 flex h-9 w-9 items-center justify-center rounded-full bg-black/30 text-white backdrop-blur-sm transition hover:bg-black/45"
                >
                  <Heart
                    size={15}
                    className={joined ? "fill-[#e0c57a] text-[#e0c57a]" : ""}
                    strokeWidth={1.75}
                  />
                </button>
              </Link>

              <div className="mt-3.5 px-0.5">
                <div className="flex items-start justify-between gap-2">
                  <div className="min-w-0">
                    <Link
                      href={`/residences/${r.id}`}
                      className="block truncate text-[15px] font-semibold tracking-tight text-ink hover:underline"
                    >
                      {r.name}
                    </Link>
                    <p className="mt-0.5 truncate text-[13px] text-[#6a6660]">{r.location}</p>
                  </div>
                  <span className="shrink-0 rounded-full bg-[#efeae2] px-2 py-0.5 text-[11px] font-medium text-[#8a6b2e]">
                    {r.code.replace("RESIDENCE ", "R.")}
                  </span>
                </div>

                <p className="mt-1.5 text-[13px] text-[#6a6660]">
                  {r.beds} hab · {r.baths} ba · {r.waitlistCount}+ en lista
                </p>

                <ProgressBar value={r.progress} size="sm" className="mt-2.5 max-w-[180px]" />

                <div className="mt-3 flex items-center gap-2">
                  {joined ? (
                    <span className="text-[12px] font-medium text-[#8a6b2e]">En tu lista</span>
                  ) : (
                    <button
                      type="button"
                      onClick={() => setActive(r)}
                      className="rounded-full bg-ink px-3.5 py-2 text-[12px] font-semibold text-white transition hover:bg-ink/90"
                    >
                      Unirse
                    </button>
                  )}
                  <Link
                    href={`/residences/${r.id}`}
                    className="rounded-full border border-[#ddd6cb] bg-white px-3.5 py-2 text-[12px] font-medium text-ink transition hover:border-ink"
                  >
                    Ver
                  </Link>
                </div>
              </div>
            </article>
          );
        })}
      </div>

      <div className="mt-6 flex justify-center px-5">
        <Link
          href="/residences"
          className="rounded-full border border-[#ddd6cb] bg-white px-5 py-2.5 text-[13px] font-medium text-ink transition hover:border-ink"
        >
          Ver showroom completo
        </Link>
      </div>

      {active && (
        <WaitlistJoin
          residence={active}
          open={Boolean(active)}
          onClose={() => setActive(null)}
        />
      )}
    </section>
  );
}
