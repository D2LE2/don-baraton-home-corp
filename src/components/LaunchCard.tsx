"use client";

import Image from "next/image";
import Link from "next/link";
import {
  ArrowUpRight,
  Bath,
  BedDouble,
  CalendarDays,
  Car,
  Eye,
  Ruler,
  Users,
} from "lucide-react";
import { AnimatePresence, motion, useMotionTemplate, useMotionValue } from "framer-motion";
import { useEffect, useState, type MouseEvent } from "react";
import { AnimatedCounter } from "@/components/AnimatedCounter";
import { Countdown } from "@/components/Countdown";
import { ProgressBar } from "@/components/ProgressBar";
import { WaitlistJoin } from "@/components/WaitlistJoin";
import { useNova } from "@/context/NovaContext";
import type { Residence } from "@/data/residences";

const INITIALS = ["S.M.", "C.R.", "A.V.", "L.P.", "M.G."];

/** Flat rectangular launch strip — wide, not tall */
export function LaunchCard({ residence }: { residence: Residence }) {
  const { isOnWaitlist } = useNova();
  const joined = isOnWaitlist(residence.id);
  const [waitlistOpen, setWaitlistOpen] = useState(false);
  const [waitlist, setWaitlist] = useState(residence.waitlistCount);
  const [viewers, setViewers] = useState(6 + (residence.followers % 5));
  const [tick, setTick] = useState<string | null>(null);
  const [tickId, setTickId] = useState(0);
  const [hovered, setHovered] = useState(false);

  const mx = useMotionValue(0.5);
  const my = useMotionValue(0.5);
  const glow = useMotionTemplate`radial-gradient(420px circle at ${mx}px ${my}px, rgba(196,165,116,0.12), transparent 55%)`;

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

  const onMove = (e: MouseEvent<HTMLDivElement>) => {
    const rect = e.currentTarget.getBoundingClientRect();
    mx.set(e.clientX - rect.left);
    my.set(e.clientY - rect.top);
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, margin: "-40px" }}
      transition={{ duration: 0.55, ease: [0.22, 1, 0.36, 1] }}
      className="mx-auto w-full max-w-3xl md:max-w-4xl"
    >
      <div
        onMouseEnter={() => setHovered(true)}
        onMouseLeave={() => setHovered(false)}
        onMouseMove={onMove}
        className="group relative overflow-hidden rounded-xl border border-[#e4dfd6] bg-white shadow-[0_14px_40px_rgba(20,16,10,0.12)] transition duration-300 hover:-translate-y-0.5"
      >
        <motion.div
          className="pointer-events-none absolute inset-0 z-10 opacity-0 transition-opacity duration-300 group-hover:opacity-100"
          style={{ background: glow }}
        />

        <div className="relative z-20 flex flex-col gap-3 p-3 sm:flex-row sm:items-stretch sm:gap-4 sm:p-3.5">
          {/* Thumb — landscape */}
          <div className="relative h-[88px] w-full shrink-0 overflow-hidden rounded-lg sm:h-auto sm:w-[148px] md:w-[168px]">
            <motion.div
              className="absolute inset-0"
              animate={{ scale: hovered ? 1.05 : 1 }}
              transition={{ duration: 0.4 }}
            >
              <Image
                src={residence.image}
                alt=""
                fill
                className="object-cover object-[center_40%]"
                sizes="168px"
              />
            </motion.div>
            <div className="absolute inset-x-0 bottom-0 bg-gradient-to-t from-black/50 to-transparent px-2 py-1">
              <p className="text-[8px] tracking-[0.14em] text-white/90 uppercase tabular-nums">
                {residence.progress}%
              </p>
            </div>
          </div>

          {/* Main content row */}
          <div className="flex min-w-0 flex-1 flex-col justify-between gap-2.5">
            <div className="flex items-start justify-between gap-3">
              <div className="min-w-0">
                <div className="flex items-center gap-2">
                  <span className="relative flex h-1.5 w-1.5">
                    <span className="absolute inline-flex h-full w-full animate-ping rounded-full bg-emerald-500/70" />
                    <span className="relative inline-flex h-1.5 w-1.5 rounded-full bg-emerald-500" />
                  </span>
                  <p className="text-[9px] tracking-[0.24em] text-[#b8924a] uppercase">
                    Próximo lanzamiento
                  </p>
                </div>
                <p className="mt-1 text-[13px] font-semibold tracking-[0.12em] text-ink uppercase md:text-[14px]">
                  {residence.code}
                </p>
                <p className="mt-0.5 truncate text-[11px] text-[#8a847a]">{residence.location}</p>
              </div>

              <div className="hidden shrink-0 sm:block">
                <Countdown
                  targetDate={residence.completionDate}
                  variant="light"
                  size="sm"
                />
              </div>
            </div>

            <ProgressBar
              value={residence.progress}
              size="sm"
              showLabel
              label="Obra"
              className="max-w-md"
            />

            <div className="flex flex-wrap items-center gap-x-3 gap-y-1.5">
              <span className="inline-flex items-center gap-1 text-[9px] text-[#6a655e] uppercase">
                <BedDouble size={11} className="text-[#b8924a]" />
                {residence.beds}
              </span>
              <span className="inline-flex items-center gap-1 text-[9px] text-[#6a655e] uppercase">
                <Bath size={11} className="text-[#b8924a]" />
                {residence.baths}
              </span>
              <span className="inline-flex items-center gap-1 text-[9px] text-[#6a655e] uppercase">
                <Ruler size={11} className="text-[#b8924a]" />
                {residence.sqft.toLocaleString()}
              </span>
              <span className="inline-flex items-center gap-1 text-[9px] text-[#6a655e] uppercase">
                <Car size={11} className="text-[#b8924a]" />
                {residence.garage}
              </span>
              <span className="hidden h-3 w-px bg-[#e4dfd6] sm:inline-block" />
              <span className="inline-flex items-center gap-1 text-[9px] text-[#6a655e]">
                <Users size={11} className="text-[#b8924a]" />
                <span className="font-medium text-ink tabular-nums">
                  <AnimatedCounter value={waitlist} />
                </span>
                <span className="uppercase">lista</span>
              </span>
              <span className="inline-flex items-center gap-1 text-[9px] text-[#6a655e]">
                <Eye size={11} className="text-[#b8924a]" />
                <span className="font-medium text-ink tabular-nums">
                  <AnimatedCounter value={viewers} />
                </span>
              </span>
              <AnimatePresence mode="wait">
                {tick && (
                  <motion.span
                    key={tickId}
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    exit={{ opacity: 0 }}
                    className="truncate text-[9px] text-[#9a8660]"
                  >
                    · {tick}
                  </motion.span>
                )}
              </AnimatePresence>
            </div>

            <div className="flex items-center gap-2 border-t border-[#f0ebe3] pt-2.5 sm:border-0 sm:pt-0">
              <p className="mr-auto hidden items-center gap-1 text-[8px] tracking-[0.14em] text-[#b8924a] uppercase sm:inline-flex">
                <CalendarDays size={11} />
                Fall 2026
              </p>
              <div className="sm:hidden">
                <Countdown
                  targetDate={residence.completionDate}
                  variant="light"
                  size="sm"
                />
              </div>
              {joined ? (
                <span className="border border-[#e8e2d8] px-3 py-2 text-[9px] tracking-[0.14em] text-[#6a655e] uppercase">
                  En lista
                </span>
              ) : (
                <button
                  type="button"
                  onClick={() => setWaitlistOpen(true)}
                  className="bg-ink px-3.5 py-2 text-[9px] font-medium tracking-[0.16em] text-[#e0c57a] uppercase transition hover:bg-ink/90"
                >
                  Unirse a lista
                </button>
              )}
              <Link
                href={`/residences/${residence.id}`}
                className="inline-flex h-8 w-8 items-center justify-center border border-[#e8e2d8] text-[#9a8660] transition hover:border-ink hover:text-ink"
                aria-label="Ver residencia"
              >
                <ArrowUpRight size={14} />
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
