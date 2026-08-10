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

/** Light Airbnb featured launch — photo + white booking panel, no black boxes */
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
    <section id="lanzamiento" className="bg-[#f7f7f5] pt-10 pb-4 md:pt-14 md:pb-6">
      <div className="mx-auto max-w-[1200px] px-5 md:px-10 lg:px-12">
        <p className="mx-auto mb-8 max-w-lg text-center text-[15px] leading-relaxed text-[#6a6660]">
          Elige la residencia, sigue el avance y entra a su lista — antes del mercado.
        </p>

        <div className="grid items-stretch gap-4 lg:grid-cols-[1.35fr_0.9fr] lg:gap-5">
          <motion.div
            initial={{ opacity: 0, y: 12 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.5 }}
            className="relative overflow-hidden rounded-[1.35rem] bg-[#eceae6] shadow-[0_12px_36px_rgba(20,16,10,0.08)]"
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
              <div className="absolute inset-0 bg-gradient-to-t from-black/35 via-transparent to-transparent" />
              <div className="absolute top-4 left-4 flex items-center gap-2">
                <span className="rounded-full bg-white px-3 py-1.5 text-[12px] font-semibold text-ink shadow-sm">
                  Destacada
                </span>
                <span className="rounded-full bg-white/95 px-3 py-1.5 text-[12px] font-medium text-ink shadow-sm">
                  {residence.progress}% obra
                </span>
              </div>
              <div className="absolute inset-x-0 bottom-0 p-5 md:p-6">
                <p className="text-[12px] font-medium text-white/85">{residence.code}</p>
                <h2 className="mt-1 text-[1.6rem] font-semibold tracking-tight text-white md:text-[1.9rem]">
                  {residence.name}
                </h2>
                <p className="mt-1 flex items-center gap-1.5 text-[14px] text-white/85">
                  <MapPin size={14} />
                  {residence.location}
                </p>
              </div>
            </div>
          </motion.div>

          <motion.aside
            initial={{ opacity: 0, y: 12 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.5, delay: 0.08 }}
            className="flex flex-col justify-between rounded-[1.35rem] border border-[#ebe7e0] bg-white p-5 shadow-[0_12px_36px_rgba(20,16,10,0.06)] md:p-6"
          >
            <div>
              <div className="flex items-center justify-between gap-3">
                <p className="text-[12px] font-medium text-[#8a6b2e]">Próximo lanzamiento</p>
                <span className="inline-flex items-center gap-1.5 rounded-full bg-[#f3f1ec] px-2.5 py-1 text-[11px] font-medium text-[#5c574f]">
                  <span className="h-1.5 w-1.5 rounded-full bg-emerald-500" />
                  En vivo
                </span>
              </div>

              <h3 className="mt-4 text-[1.4rem] font-semibold tracking-tight text-ink">
                Reserva tu lugar en la lista
              </h3>
              <p className="mt-2 text-[14px] leading-relaxed text-[#6a6660]">
                Prioridad real cuando abra. Cupos limitados para esta residencia.
              </p>

              <div className="mt-5 grid grid-cols-2 gap-3">
                <div className="rounded-2xl bg-[#f7f6f3] px-3.5 py-3">
                  <p className="text-[11px] text-[#8a847a]">Lista</p>
                  <p className="mt-1 text-xl font-semibold tabular-nums text-ink">
                    <AnimatedCounter value={waitlist} />
                    <span className="text-sm font-medium text-[#8a847a]">+</span>
                  </p>
                </div>
                <div className="rounded-2xl bg-[#f7f6f3] px-3.5 py-3">
                  <p className="text-[11px] text-[#8a847a]">Viendo</p>
                  <p className="mt-1 flex items-center gap-1.5 text-xl font-semibold tabular-nums text-ink">
                    <Eye size={16} className="text-[#8a6b2e]" />
                    <AnimatedCounter value={viewers} />
                  </p>
                </div>
              </div>

              <div className="mt-4 flex flex-wrap gap-x-4 gap-y-2 text-[13px] text-[#6a6660]">
                <span className="inline-flex items-center gap-1.5">
                  <BedDouble size={14} className="text-[#8a6b2e]" />
                  {residence.beds} hab
                </span>
                <span className="inline-flex items-center gap-1.5">
                  <Bath size={14} className="text-[#8a6b2e]" />
                  {residence.baths} ba
                </span>
                <span className="inline-flex items-center gap-1.5">
                  <Ruler size={14} className="text-[#8a6b2e]" />
                  {residence.sqft.toLocaleString()} ft²
                </span>
                <span className="inline-flex items-center gap-1.5">
                  <Users size={14} className="text-[#8a6b2e]" />
                  lista activa
                </span>
              </div>

              <div className="mt-5">
                <ProgressBar
                  value={residence.progress}
                  size="sm"
                  showLabel
                  label="Avance de obra"
                  live
                />
              </div>

              <div className="mt-5">
                <p className="mb-2 text-[11px] text-[#8a847a]">Entrega estimada</p>
                <Countdown
                  targetDate={residence.completionDate}
                  variant="light"
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
                    className="mt-4 text-[12px] text-[#8a6b2e]"
                  >
                    {tick}
                  </motion.p>
                )}
              </AnimatePresence>
            </div>

            <div className="mt-6 flex flex-col gap-2.5">
              {joined ? (
                <span className="rounded-full border border-[#ebe7e0] py-3.5 text-center text-[14px] font-medium text-[#6a6660]">
                  Ya estás en esta lista
                </span>
              ) : (
                <button
                  type="button"
                  onClick={() => setWaitlistOpen(true)}
                  className="rounded-full bg-ink py-3.5 text-[14px] font-semibold text-white transition hover:bg-ink/90"
                >
                  Unirse a la lista
                </button>
              )}
              <Link
                href={`/residences/${residence.id}`}
                className="inline-flex items-center justify-center gap-1.5 rounded-full border border-[#ddd6cb] py-3.5 text-[14px] font-medium text-ink transition hover:border-ink"
              >
                Ver residencia
                <ArrowUpRight size={15} />
              </Link>
            </div>
          </motion.aside>
        </div>

        <div className="mt-5 flex flex-wrap items-center justify-center gap-2 md:justify-start">
          {["Omar Corp · Indiana", "14 viviendas vendidas", "13 familias en su hogar"].map(
            (label) => (
              <span
                key={label}
                className="rounded-full border border-[#ebe7e0] bg-white px-3.5 py-1.5 text-[12px] font-medium text-[#5c574f]"
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
