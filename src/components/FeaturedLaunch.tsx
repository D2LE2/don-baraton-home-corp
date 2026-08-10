"use client";

import Image from "next/image";
import Link from "next/link";
import {
  ArrowUpRight,
  Bath,
  BedDouble,
  Eye,
  MapPin,
  Ruler,
  Users,
} from "lucide-react";
import { AnimatePresence, motion } from "framer-motion";
import { useEffect, useState } from "react";
import { AnimatedCounter } from "@/components/AnimatedCounter";
import { Countdown } from "@/components/Countdown";
import { ProgressBar } from "@/components/ProgressBar";
import { WaitlistJoin } from "@/components/WaitlistJoin";
import { useNova } from "@/context/NovaContext";
import type { Residence } from "@/data/residences";

const INITIALS = ["S.M.", "C.R.", "A.V.", "L.P.", "M.G."];

/**
 * Uber × Airbnb featured launch — photo + booking panel side by side,
 * never a second card stacked under the image.
 */
export function FeaturedLaunch({ residence }: { residence: Residence }) {
  const { isOnWaitlist } = useNova();
  const joined = isOnWaitlist(residence.id);
  const [waitlistOpen, setWaitlistOpen] = useState(false);
  const [waitlist, setWaitlist] = useState(residence.waitlistCount);
  const [viewers, setViewers] = useState(6 + (residence.followers % 5));
  const [tick, setTick] = useState<string | null>(null);
  const [tickId, setTickId] = useState(0);

  useEffect(() => {
    let n = residence.waitlistCount;
    let v = 6 + (residence.followers % 5);
    let i = 0;
    let hide: number | undefined;

    const pulse = () => {
      i += 1;
      const mode = i % 3;
      if (mode === 0) {
        n += 1;
        setWaitlist(n);
        setTick(`${INITIALS[i % INITIALS.length]} entró a la lista`);
      } else if (mode === 1) {
        v = Math.max(4, Math.min(16, v + (Math.random() > 0.45 ? 1 : -1)));
        setViewers(v);
        setTick(`${v} viendo ahora`);
      } else {
        setTick(`${residence.progress}% en obra`);
      }
      setTickId(i);
      hide = window.setTimeout(() => setTick(null), 2600);
    };

    const start = window.setTimeout(pulse, 1600);
    const loop = window.setInterval(pulse, 5200);
    return () => {
      window.clearTimeout(start);
      window.clearInterval(loop);
      if (hide) window.clearTimeout(hide);
    };
  }, [residence.followers, residence.progress, residence.waitlistCount]);

  return (
    <section id="lanzamiento" className="bg-[#f6f5f3] pt-10 pb-4 md:pt-14 md:pb-6">
      <div className="mx-auto max-w-[1200px] px-5 md:px-10 lg:px-12">
        <p className="mx-auto mb-8 max-w-lg text-center text-[15px] leading-relaxed text-[#6a6660]">
          Elige la residencia, sigue el avance y entra a su lista — antes del mercado.
        </p>

        <div className="grid items-stretch gap-4 lg:grid-cols-[1.35fr_0.9fr] lg:gap-5">
          {/* Photo plane */}
          <motion.div
            initial={{ opacity: 0, y: 12 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.5 }}
            className="relative overflow-hidden rounded-[1.35rem] bg-[#111] shadow-[0_20px_50px_rgba(10,8,6,0.18)]"
          >
            <div className="relative aspect-[4/3] w-full lg:aspect-auto lg:h-full lg:min-h-[460px]">
              <Image
                src="/images/monroe-featured.jpg"
                alt={residence.name}
                fill
                priority
                className="object-cover"
                sizes="(max-width: 1024px) 100vw, 65vw"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-black/45 via-transparent to-black/10" />
              <div className="absolute top-4 left-4 flex items-center gap-2">
                <span className="rounded-full bg-white px-3 py-1.5 text-[12px] font-semibold text-ink shadow-sm">
                  Destacada
                </span>
                <span className="rounded-full bg-black/45 px-3 py-1.5 text-[12px] font-medium text-white backdrop-blur-md">
                  {residence.progress}% obra
                </span>
              </div>
              <div className="absolute inset-x-0 bottom-0 p-5 md:p-6">
                <p className="text-[12px] font-medium text-[#e0c57a]">
                  {residence.code}
                </p>
                <h2 className="mt-1 text-[1.6rem] font-semibold tracking-tight text-white md:text-[1.9rem]">
                  {residence.name}
                </h2>
                <p className="mt-1 flex items-center gap-1.5 text-[14px] text-white/75">
                  <MapPin size={14} />
                  {residence.location}
                </p>
              </div>
            </div>
          </motion.div>

          {/* Uber-style booking panel beside photo */}
          <motion.aside
            initial={{ opacity: 0, y: 12 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.5, delay: 0.08 }}
            className="flex flex-col justify-between rounded-[1.35rem] bg-[#0f0e0c] p-5 text-white shadow-[0_20px_50px_rgba(10,8,6,0.2)] md:p-6"
          >
            <div>
              <div className="flex items-center justify-between gap-3">
                <p className="text-[12px] font-medium tracking-[0.08em] text-[#e0c57a] uppercase">
                  Próximo lanzamiento
                </p>
                <span className="inline-flex items-center gap-1.5 rounded-full bg-white/8 px-2.5 py-1 text-[11px] text-white/70">
                  <span className="h-1.5 w-1.5 rounded-full bg-emerald-400" />
                  En vivo
                </span>
              </div>

              <h3 className="mt-4 text-[1.45rem] font-semibold tracking-tight">
                Reserva tu lugar en la lista
              </h3>
              <p className="mt-2 text-[14px] leading-relaxed text-white/55">
                Prioridad real cuando abra. Cupos limitados para esta residencia.
              </p>

              <div className="mt-5 grid grid-cols-2 gap-3">
                <div className="rounded-2xl bg-white/[0.06] px-3.5 py-3">
                  <p className="text-[11px] text-white/45">Lista</p>
                  <p className="mt-1 text-xl font-semibold tabular-nums text-[#e0c57a]">
                    <AnimatedCounter value={waitlist} />
                    <span className="text-sm font-medium text-white/50">+</span>
                  </p>
                </div>
                <div className="rounded-2xl bg-white/[0.06] px-3.5 py-3">
                  <p className="text-[11px] text-white/45">Viendo</p>
                  <p className="mt-1 flex items-center gap-1.5 text-xl font-semibold tabular-nums">
                    <Eye size={16} className="text-[#e0c57a]" />
                    <AnimatedCounter value={viewers} />
                  </p>
                </div>
              </div>

              <div className="mt-4 flex flex-wrap gap-x-4 gap-y-2 text-[13px] text-white/60">
                <span className="inline-flex items-center gap-1.5">
                  <BedDouble size={14} className="text-[#e0c57a]" />
                  {residence.beds} hab
                </span>
                <span className="inline-flex items-center gap-1.5">
                  <Bath size={14} className="text-[#e0c57a]" />
                  {residence.baths} ba
                </span>
                <span className="inline-flex items-center gap-1.5">
                  <Ruler size={14} className="text-[#e0c57a]" />
                  {residence.sqft.toLocaleString()} ft²
                </span>
                <span className="inline-flex items-center gap-1.5">
                  <Users size={14} className="text-[#e0c57a]" />
                  lista activa
                </span>
              </div>

              <div className="mt-5">
                <ProgressBar
                  value={residence.progress}
                  tone="dark"
                  size="sm"
                  showLabel
                  label="Avance de obra"
                  live
                />
              </div>

              <div className="mt-5">
                <p className="mb-2 text-[11px] text-white/40">Entrega estimada</p>
                <Countdown
                  targetDate={residence.completionDate}
                  variant="dark"
                  size="sm"
                />
              </div>

              <AnimatePresence mode="wait">
                {tick && (
                  <motion.p
                    key={tickId}
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    exit={{ opacity: 0 }}
                    className="mt-4 text-[12px] text-[#e0c57a]/90"
                  >
                    {tick}
                  </motion.p>
                )}
              </AnimatePresence>
            </div>

            <div className="mt-6 flex flex-col gap-2.5">
              {joined ? (
                <span className="rounded-full border border-white/20 py-3.5 text-center text-[14px] font-medium text-white/70">
                  Ya estás en esta lista
                </span>
              ) : (
                <button
                  type="button"
                  onClick={() => setWaitlistOpen(true)}
                  className="rounded-full bg-[#e0c57a] py-3.5 text-[14px] font-semibold text-ink transition hover:bg-white"
                >
                  Unirse a la lista
                </button>
              )}
              <Link
                href={`/residences/${residence.id}`}
                className="inline-flex items-center justify-center gap-1.5 rounded-full border border-white/20 py-3.5 text-[14px] font-medium text-white transition hover:border-white"
              >
                Ver residencia
                <ArrowUpRight size={15} />
              </Link>
            </div>
          </motion.aside>
        </div>

        {/* Proof chips — not a full black stacked band */}
        <div className="mt-5 flex flex-wrap items-center justify-center gap-2 md:justify-start">
          {["Omar Corp · Indiana", "14 viviendas vendidas", "13 familias en su hogar"].map(
            (label) => (
              <span
                key={label}
                className="rounded-full border border-[#e4dfd6] bg-white px-3.5 py-1.5 text-[12px] font-medium text-[#5c574f]"
              >
                {label}
              </span>
            ),
          )}
        </div>
      </div>

      <WaitlistJoin
        residence={residence}
        open={waitlistOpen}
        onClose={() => setWaitlistOpen(false)}
      />
    </section>
  );
}
