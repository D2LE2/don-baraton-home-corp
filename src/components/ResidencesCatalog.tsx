"use client";

import Link from "next/link";
import { ChevronLeft, ChevronRight } from "lucide-react";
import { useCallback, useEffect, useRef, useState } from "react";
import { ResidenceCard } from "@/components/ResidenceCard";
import { WaitlistJoin } from "@/components/WaitlistJoin";
import { useNova } from "@/context/NovaContext";
import { residences, type Residence } from "@/data/residences";

/**
 * Airbnb-style horizontal listing rail — shared clean ResidenceCard.
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
        {residences.map((r, i) => (
          <div
            key={r.id}
            ref={(el) => {
              cardRefs.current[i] = el;
            }}
            className="catalog-peek-card shrink-0 snap-start"
          >
            <ResidenceCard
              residence={r}
              joined={isOnWaitlist(r.id)}
              priority={i === 0}
              onJoin={() => setActive(r)}
            />
          </div>
        ))}
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
