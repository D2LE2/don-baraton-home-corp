"use client";

import Image from "next/image";
import Link from "next/link";
import { Lock, ArrowRight } from "lucide-react";
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
    <section className="relative overflow-hidden bg-[#0a0a0a]">
      <div className="absolute inset-0">
        <Image
          src={featured.image}
          alt={featured.name}
          fill
          className="object-cover opacity-40"
          sizes="100vw"
        />
        <div className="absolute inset-0 bg-gradient-to-b from-ink via-ink/85 to-ink" />
        <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_30%_20%,rgba(196,163,90,0.12),transparent_55%)]" />
      </div>

      <div className="relative mx-auto max-w-6xl px-5 py-24 md:px-12 md:py-28 lg:px-16">
        <motion.div
          initial={{ opacity: 0, y: 28 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: "-60px" }}
          transition={{ duration: 0.7 }}
          className="max-w-3xl"
        >
          <div className="flex flex-wrap items-center gap-3">
            <span className="inline-flex items-center gap-2 rounded-full border border-gold-soft/40 bg-gold/15 px-3 py-1.5 text-[10px] tracking-[0.25em] text-gold-soft uppercase">
              <span className="live-dot" />
              Lanzamiento activo
            </span>
            <span className="text-[10px] tracking-[0.22em] text-white/45 uppercase">
              {featured.waitlistCount}+ en lista · Cupos limitados
            </span>
          </div>

          <p className="mt-8 text-[11px] tracking-[0.35em] text-gold-soft uppercase">
            Omar Corp · {featured.code}
          </p>
          <h2 className="mt-3 text-4xl font-light tracking-[0.08em] text-white md:text-6xl">
            {featured.name}
          </h2>
          <p className="script mt-2 text-3xl text-gold-soft md:text-4xl">Se está terminando.</p>
          <p className="mt-5 max-w-lg text-base leading-relaxed text-white/60">
            {featured.progress}% construida en {featured.location}. Contador real. Lista de espera
            abierta. Si te late — anótate ahora.
          </p>

          <div className="mt-10 rounded-[1.75rem] border border-gold-soft/20 bg-black/40 px-5 py-6 shadow-[0_0_60px_rgba(196,163,90,0.08)] backdrop-blur-md md:px-8 md:py-8">
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
              className="inline-flex items-center justify-center gap-2 rounded-full bg-gold-soft px-8 py-4 text-[12px] font-medium tracking-[0.2em] text-ink uppercase shadow-[0_0_36px_rgba(224,197,122,0.3)] transition hover:bg-white"
            >
              <Lock size={14} />
              {joined ? "Ya estás en la lista" : "Únete a la lista ahora"}
            </button>
            <Link
              href={`/residences/${featured.id}`}
              className="inline-flex items-center gap-2 text-center text-[11px] tracking-[0.2em] text-white/55 uppercase transition hover:text-gold-soft sm:text-left"
            >
              Ver cómo nace
              <ArrowRight size={14} />
            </Link>
          </div>
        </motion.div>
      </div>

      <WaitlistJoin residence={featured} open={open} onClose={() => setOpen(false)} />
    </section>
  );
}
