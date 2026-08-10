"use client";

import Image from "next/image";
import Link from "next/link";
import { ArrowLeft, ArrowRight, ChevronDown } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
import { useCallback, useEffect, useRef, useState } from "react";
import { Logo } from "@/components/Logo";
import { residences, type Residence } from "@/data/residences";

const statusStyles: Record<Residence["status"], string> = {
  AVAILABLE: "border-gold-soft/50 bg-gold/20 text-gold-soft",
  "PRIVATE LIST OPEN": "border-white/30 bg-white/10 text-white",
  "COMING SOON": "border-white/20 bg-black/30 text-white/70",
};

function ResidencePanel({
  residence,
  index,
  total,
  active,
}: {
  residence: Residence;
  index: number;
  total: number;
  active: boolean;
}) {
  const progressLabel =
    residence.progress < 15
      ? "CONSTRUCTION BEGINS SOON"
      : `${residence.progress}% BUILT`;

  return (
    <section className="relative flex h-[100dvh] min-h-[640px] w-full shrink-0 snap-start flex-col overflow-hidden bg-ink">
      <motion.div
        animate={active ? { scale: 1 } : { scale: 1.06 }}
        transition={{ duration: 1.1, ease: [0.22, 1, 0.36, 1] }}
        className="absolute inset-0"
      >
        <Image
          src={residence.image}
          alt={residence.name}
          fill
          priority={index === 0}
          className="object-cover"
          sizes="100vw"
        />
      </motion.div>
      <div className="absolute inset-0 bg-gradient-to-b from-black/50 via-black/15 to-black/80" />

      <div className="relative z-10 flex h-full flex-col justify-between px-5 pb-28 pt-28 md:px-12 md:pb-24 md:pt-32 lg:px-16">
        <AnimatePresence mode="wait">
          {active && (
            <motion.div
              key={`top-${residence.id}`}
              initial={{ opacity: 0, y: 18 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -10 }}
              transition={{ duration: 0.45 }}
            >
              <div className="flex flex-wrap items-center gap-3">
                <span
                  className={`rounded-full border px-3 py-1 text-[10px] tracking-[0.22em] uppercase ${statusStyles[residence.status]}`}
                >
                  {residence.status}
                </span>
                <span className="text-[10px] tracking-[0.25em] text-white/55 uppercase">
                  {String(index + 1).padStart(2, "0")} / {String(total).padStart(2, "0")}
                </span>
              </div>

              <p className="mt-7 text-[11px] tracking-[0.4em] text-gold-soft uppercase">
                {residence.code}
              </p>
              <h1 className="mt-2 text-4xl font-light tracking-[0.1em] text-white md:text-6xl lg:text-7xl">
                {residence.name}
              </h1>
              <p className="mt-3 text-sm text-white/65 md:text-base">{residence.location}</p>
            </motion.div>
          )}
        </AnimatePresence>

        <AnimatePresence mode="wait">
          {active && (
            <motion.div
              key={`bottom-${residence.id}`}
              initial={{ opacity: 0, y: 24 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: 10 }}
              transition={{ duration: 0.5, delay: 0.05 }}
            >
              <p className="display text-5xl font-light text-white md:text-7xl lg:text-8xl">
                {progressLabel}
              </p>
              <p className="mt-5 text-sm tracking-[0.14em] text-white/80 uppercase">
                {residence.beds} BED · {residence.baths} BATH ·{" "}
                {residence.sqft.toLocaleString()} SQ FT
              </p>
              <p className="mt-2 text-sm text-white/50">Expected · {residence.expected}</p>
              <p className="mt-1 text-[11px] tracking-[0.2em] text-white/40 uppercase">
                {residence.followers} people following
              </p>

              <div className="mt-8 flex flex-wrap items-center gap-3">
                <Link
                  href={`/residences/${residence.id}`}
                  className="group inline-flex items-center gap-2 rounded-full bg-white px-7 py-3.5 text-[11px] tracking-[0.22em] text-ink uppercase transition hover:bg-gold-soft"
                >
                  Watch Build Story
                  <ArrowRight size={14} className="transition group-hover:translate-x-0.5" />
                </Link>
                <Link
                  href={`/residences/${residence.id}#follow`}
                  className="rounded-full border border-white/25 px-6 py-3.5 text-[11px] tracking-[0.2em] text-white uppercase transition hover:border-white/50"
                >
                  Follow
                </Link>
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </section>
  );
}

export default function ResidencesPage() {
  const scrollerRef = useRef<HTMLDivElement>(null);
  const [active, setActive] = useState(0);
  const [introDone, setIntroDone] = useState(false);
  const total = residences.length;

  const goTo = useCallback((index: number) => {
    const el = scrollerRef.current;
    if (!el) return;
    const clamped = Math.max(0, Math.min(total - 1, index));
    el.scrollTo({ top: clamped * el.clientHeight, behavior: "smooth" });
  }, [total]);

  useEffect(() => {
    const el = scrollerRef.current;
    if (!el) return;

    const onScroll = () => {
      const i = Math.round(el.scrollTop / el.clientHeight);
      setActive(i);
      if (i > 0) setIntroDone(true);
    };

    el.addEventListener("scroll", onScroll, { passive: true });
    return () => el.removeEventListener("scroll", onScroll);
  }, []);

  return (
    <main className="relative bg-ink">
      {/* Fixed chrome */}
      <div className="pointer-events-none fixed inset-x-0 top-0 z-40 flex items-center justify-between px-5 py-5 md:px-10">
        <Link
          href="/"
          className="pointer-events-auto flex items-center gap-2 rounded-full bg-black/35 px-3 py-2 text-white/80 backdrop-blur-md transition hover:text-white"
        >
          <ArrowLeft size={16} />
          <span className="hidden sm:inline">
            <Logo light size="sm" as="span" />
          </span>
        </Link>

        <div className="pointer-events-auto flex items-center gap-2 rounded-full bg-black/35 px-2 py-2 backdrop-blur-md">
          {residences.map((r, i) => (
            <button
              key={r.id}
              type="button"
              aria-label={`Ir a ${r.name}`}
              onClick={() => goTo(i)}
              className={`h-1.5 rounded-full transition-all ${
                active === i ? "w-8 bg-gold-soft" : "w-1.5 bg-white/35 hover:bg-white/60"
              }`}
            />
          ))}
        </div>

        <Link
          href="/private"
          className="pointer-events-auto rounded-full border border-white/20 bg-black/35 px-4 py-2 text-[10px] tracking-[0.2em] text-gold-soft uppercase backdrop-blur-md"
        >
          Private
        </Link>
      </div>

      {/* Side index — desktop */}
      <aside className="pointer-events-none fixed top-1/2 right-6 z-40 hidden -translate-y-1/2 flex-col gap-4 lg:flex">
        {residences.map((r, i) => (
          <button
            key={r.id}
            type="button"
            onClick={() => goTo(i)}
            className={`pointer-events-auto text-right transition ${
              active === i ? "text-gold-soft" : "text-white/35 hover:text-white/70"
            }`}
          >
            <span className="block text-[10px] tracking-[0.25em] uppercase">
              {String(i + 1).padStart(2, "0")}
            </span>
            <span className="mt-0.5 block text-[11px] tracking-[0.12em] uppercase">
              {r.name.replace("THE ", "")}
            </span>
          </button>
        ))}
      </aside>

      {/* Bottom hint */}
      {!introDone && active === 0 && (
        <div className="pointer-events-none fixed inset-x-0 bottom-6 z-40 flex flex-col items-center gap-1 text-white/40 md:bottom-8">
          <ChevronDown className="animate-bounce" size={18} />
          <span className="text-[9px] tracking-[0.3em] uppercase">Siguiente residencia</span>
        </div>
      )}

      <div
        ref={scrollerRef}
        className="snap-y-mandatory h-[100dvh] overflow-y-auto"
      >
        {residences.map((r, i) => (
          <ResidencePanel
            key={r.id}
            residence={r}
            index={i}
            total={total}
            active={active === i}
          />
        ))}
      </div>
    </main>
  );
}
