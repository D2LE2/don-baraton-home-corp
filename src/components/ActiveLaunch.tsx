"use client";

import Image from "next/image";
import Link from "next/link";
import { Lock } from "lucide-react";
import { motion } from "framer-motion";
import { useState } from "react";
import { Countdown } from "@/components/Countdown";
import { WaitlistJoin } from "@/components/WaitlistJoin";
import { useNova } from "@/context/NovaContext";
import { residences } from "@/data/residences";

export function ActiveLaunch() {
  const featured = residences[0];
  const { isOnWaitlist } = useNova();
  const [open, setOpen] = useState(false);
  const joined = isOnWaitlist(featured.id);

  return (
    <section className="relative overflow-hidden bg-[#0c0c0c]">
      <div className="absolute inset-0">
        <Image
          src={featured.image}
          alt={featured.name}
          fill
          className="object-cover opacity-45"
          sizes="100vw"
        />
        <div className="absolute inset-0 bg-gradient-to-b from-ink via-ink/80 to-ink" />
      </div>

      <div className="relative mx-auto max-w-6xl px-5 py-24 md:px-12 md:py-28 lg:px-16">
        <motion.div
          initial={{ opacity: 0, y: 24 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: "-60px" }}
          transition={{ duration: 0.7 }}
          className="max-w-3xl"
        >
          <div className="flex flex-wrap items-center gap-3">
            <span className="rounded-full border border-gold-soft/40 bg-gold/15 px-3 py-1 text-[10px] tracking-[0.25em] text-gold-soft uppercase">
              Lanzamiento activo
            </span>
            <span className="text-[10px] tracking-[0.22em] text-white/45 uppercase">
              {featured.waitlistCount}+ en lista · Cupos limitados
            </span>
          </div>

          <p className="mt-8 text-[11px] tracking-[0.35em] text-gold-soft uppercase">
            {featured.code}
          </p>
          <h2 className="mt-3 text-4xl font-light tracking-[0.08em] text-white md:text-6xl">
            {featured.name}
          </h2>
          <p className="script mt-2 text-3xl text-gold-soft md:text-4xl">Se está terminando.</p>
          <p className="mt-5 max-w-lg text-base leading-relaxed text-white/60">
            {featured.progress}% construida en {featured.location}. Esta no es una casa en un
            catálogo — es un lanzamiento con tiempo real. Anótate antes de que se cierre.
          </p>

          <div className="mt-10 rounded-[1.75rem] border border-white/10 bg-white/[0.04] px-5 py-6 backdrop-blur-md md:px-8 md:py-8">
            <Countdown
              targetDate={featured.completionDate}
              variant="gold"
              size="lg"
              label={`Tiempo restante · Entrega ${featured.expected}`}
            />
            <div className="mt-6 flex flex-wrap gap-x-6 gap-y-2 border-t border-white/10 pt-5 text-[11px] tracking-[0.16em] text-white/55 uppercase">
              <span>
                {featured.beds} Hab · {featured.baths} Baños · {featured.sqft.toLocaleString()} SQ FT
              </span>
              <span>{featured.progress}% Built</span>
            </div>
          </div>

          <div className="mt-8 flex flex-col gap-4 sm:flex-row sm:items-center">
            <button
              type="button"
              onClick={() => setOpen(true)}
              className="inline-flex items-center justify-center gap-2 rounded-full bg-white px-8 py-4 text-[12px] tracking-[0.22em] text-ink uppercase transition hover:bg-gold-soft"
            >
              <Lock size={14} />
              {joined ? "Ya estás en la lista" : "Únete a la lista de espera"}
            </button>
            <Link
              href={`/residences/${featured.id}`}
              className="text-center text-[11px] tracking-[0.2em] text-white/55 uppercase transition hover:text-gold-soft sm:text-left"
            >
              Ver Build Story →
            </Link>
          </div>
        </motion.div>
      </div>

      <WaitlistJoin residence={featured} open={open} onClose={() => setOpen(false)} />
    </section>
  );
}
