"use client";

import Image from "next/image";
import Link from "next/link";
import {
  ArrowUpRight,
  Bath,
  BedDouble,
  Eye,
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

/** Clean listing strip under featured photo — Airbnb-calm, interaction-focused */
export function LaunchCard({ residence }: { residence: Residence }) {
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
    const loop = window.setInterval(pulse, 4800);
    return () => {
      window.clearTimeout(start);
      window.clearInterval(loop);
      if (hide) window.clearTimeout(hide);
    };
  }, [residence.followers, residence.progress, residence.waitlistCount]);

  return (
    <motion.div
      initial={{ opacity: 0, y: 16 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, margin: "-40px" }}
      transition={{ duration: 0.5, ease: [0.22, 1, 0.36, 1] }}
      className="mx-auto w-full max-w-5xl"
    >
      <div className="overflow-hidden rounded-2xl border border-[#ebe4da] bg-white shadow-[0_8px_30px_rgba(20,16,10,0.06)]">
        <div className="flex flex-col gap-5 p-4 sm:flex-row sm:items-center sm:gap-6 sm:p-5 md:p-6">
          <div className="relative hidden h-[120px] w-[160px] shrink-0 overflow-hidden rounded-xl md:block">
            <Image
              src={residence.image}
              alt=""
              fill
              className="object-cover"
              sizes="160px"
            />
          </div>

          <div className="min-w-0 flex-1">
            <div className="flex flex-wrap items-center gap-2">
              <span className="inline-flex items-center gap-1.5 rounded-full bg-[#f3efe8] px-2.5 py-1 text-[11px] font-medium text-[#8a6b2e]">
                <span className="h-1.5 w-1.5 rounded-full bg-emerald-500" />
                Próximo lanzamiento
              </span>
              <AnimatePresence mode="wait">
                {tick && (
                  <motion.span
                    key={tickId}
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    exit={{ opacity: 0 }}
                    className="text-[12px] text-[#8a847a]"
                  >
                    {tick}
                  </motion.span>
                )}
              </AnimatePresence>
            </div>

            <h3 className="mt-2 text-[1.15rem] font-semibold tracking-tight text-ink md:text-[1.35rem]">
              {residence.name}
            </h3>
            <p className="mt-0.5 text-[14px] text-[#6f6a63]">
              {residence.location} · {residence.code}
            </p>

            <div className="mt-3 flex flex-wrap items-center gap-x-4 gap-y-1.5 text-[13px] text-[#6f6a63]">
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
                <AnimatedCounter value={waitlist} /> en lista
              </span>
              <span className="inline-flex items-center gap-1.5">
                <Eye size={14} className="text-[#8a6b2e]" />
                <AnimatedCounter value={viewers} /> viendo
              </span>
            </div>

            <ProgressBar
              value={residence.progress}
              size="sm"
              showLabel
              label="Obra"
              className="mt-4 max-w-sm"
            />
          </div>

          <div className="flex shrink-0 flex-col items-stretch gap-3 sm:items-end">
            <Countdown
              targetDate={residence.completionDate}
              variant="light"
              size="sm"
            />
            <div className="flex gap-2">
              {joined ? (
                <span className="rounded-full border border-[#ebe4da] px-4 py-2.5 text-[13px] font-medium text-[#6f6a63]">
                  En lista
                </span>
              ) : (
                <button
                  type="button"
                  onClick={() => setWaitlistOpen(true)}
                  className="rounded-full bg-ink px-5 py-2.5 text-[13px] font-medium text-white transition hover:bg-ink/90"
                >
                  Unirse a lista
                </button>
              )}
              <Link
                href={`/residences/${residence.id}`}
                className="inline-flex h-11 w-11 items-center justify-center rounded-full border border-[#ebe4da] text-ink transition hover:border-ink"
                aria-label="Ver residencia"
              >
                <ArrowUpRight size={16} />
              </Link>
            </div>
          </div>
        </div>
      </div>

      <WaitlistJoin
        residence={residence}
        open={waitlistOpen}
        onClose={() => setWaitlistOpen(false)}
      />
    </motion.div>
  );
}
