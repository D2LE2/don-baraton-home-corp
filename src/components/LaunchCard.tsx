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
import type { Residence } from "@/data/residences";

const INITIALS = ["S.M.", "C.R.", "A.V.", "L.P.", "M.G."];

export function LaunchCard({ residence }: { residence: Residence }) {
  const [waitlist, setWaitlist] = useState(residence.waitlistCount);
  const [viewers, setViewers] = useState(6 + (residence.followers % 5));
  const [tick, setTick] = useState<string | null>(null);
  const [tickId, setTickId] = useState(0);
  const [hovered, setHovered] = useState(false);

  const mx = useMotionValue(0.5);
  const my = useMotionValue(0.5);
  const glow = useMotionTemplate`radial-gradient(420px circle at ${mx}px ${my}px, rgba(196,165,116,0.14), transparent 55%)`;

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
        setTick(`${v} viendo esta residencia`);
      } else {
        setTick(`Progreso vivo · ${residence.progress}%`);
      }
      setTickId(i);
      hide = window.setTimeout(() => setTick(null), 2800);
    };

    const start = window.setTimeout(pulse, 1600);
    const loop = window.setInterval(pulse, 4800);
    return () => {
      window.clearTimeout(start);
      window.clearInterval(loop);
      if (hide) window.clearTimeout(hide);
    };
  }, [residence.followers, residence.progress, residence.waitlistCount]);

  const onMove = (e: MouseEvent<HTMLAnchorElement>) => {
    const rect = e.currentTarget.getBoundingClientRect();
    mx.set(e.clientX - rect.left);
    my.set(e.clientY - rect.top);
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 28 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, margin: "-40px" }}
      transition={{ duration: 0.65, ease: [0.22, 1, 0.36, 1] }}
      className="mx-auto max-w-lg md:max-w-xl"
    >
      <Link
        href={`/residences/${residence.id}`}
        onMouseEnter={() => setHovered(true)}
        onMouseLeave={() => setHovered(false)}
        onMouseMove={onMove}
        className="group relative block overflow-hidden rounded-2xl border border-[#e8e2d8] bg-white shadow-[0_20px_50px_rgba(20,16,10,0.14)] transition duration-300 hover:-translate-y-1 hover:shadow-[0_28px_64px_rgba(20,16,10,0.18)]"
      >
        <motion.div
          className="pointer-events-none absolute inset-0 z-10 opacity-0 transition-opacity duration-300 group-hover:opacity-100"
          style={{ background: glow }}
        />

        <div className="relative z-20 p-4 md:p-5">
          <div className="flex items-center justify-between gap-3">
            <div className="flex items-center gap-2">
              <span className="relative flex h-1.5 w-1.5">
                <span className="absolute inline-flex h-full w-full animate-ping rounded-full bg-emerald-500/70" />
                <span className="relative inline-flex h-1.5 w-1.5 rounded-full bg-emerald-500" />
              </span>
              <p className="text-[10px] tracking-[0.28em] text-[#b8924a] uppercase">
                Próximo lanzamiento
              </p>
            </div>
            <span className="inline-flex items-center gap-1 text-[9px] tracking-[0.16em] text-[#8a847a] uppercase transition group-hover:text-ink">
              Abrir
              <ArrowUpRight
                size={12}
                className={`transition duration-300 ${hovered ? "translate-x-0.5 -translate-y-0.5" : ""}`}
              />
            </span>
          </div>

          <div className="mt-3.5 flex gap-3.5">
            <div className="relative h-[84px] w-[100px] shrink-0 overflow-hidden rounded-xl md:h-[92px] md:w-[112px]">
              <motion.div
                className="absolute inset-0"
                animate={{ scale: hovered ? 1.06 : 1 }}
                transition={{ duration: 0.45 }}
              >
                <Image
                  src={residence.image}
                  alt=""
                  fill
                  className="object-cover"
                  sizes="112px"
                />
              </motion.div>
              <div className="absolute inset-x-0 bottom-0 bg-gradient-to-t from-black/55 to-transparent px-2 py-1.5">
                <p className="text-[8px] tracking-[0.14em] text-white/90 uppercase tabular-nums">
                  {residence.progress}% obra
                </p>
              </div>
            </div>

            <div className="min-w-0 flex-1">
              <p className="text-[13px] font-semibold tracking-[0.14em] text-ink uppercase md:text-[14px]">
                {residence.code}
              </p>
              <p className="mt-0.5 text-[12px] text-[#8a847a]">{residence.location}</p>

              <div className="mt-3">
                <div className="flex items-baseline justify-between gap-2">
                  <span className="text-[9px] tracking-[0.18em] text-[#9a8660] uppercase">
                    Transformación
                  </span>
                  <span className="text-[12px] font-medium text-ink tabular-nums">
                    <AnimatedCounter value={residence.progress} />%
                  </span>
                </div>
                <div className="relative mt-1.5 h-[3px] w-full overflow-hidden bg-[#ece7df]">
                  <motion.div
                    className="absolute inset-y-0 left-0 bg-[#c4a574]"
                    initial={{ width: 0 }}
                    whileInView={{ width: `${residence.progress}%` }}
                    viewport={{ once: true }}
                    transition={{ duration: 1.15, ease: [0.22, 1, 0.36, 1] }}
                  />
                  <motion.div
                    className="absolute inset-y-0 w-8 bg-gradient-to-r from-transparent via-white/70 to-transparent"
                    animate={{ left: ["-10%", "110%"] }}
                    transition={{ duration: 2.2, repeat: Infinity, ease: "linear", repeatDelay: 1.4 }}
                    style={{ width: 28 }}
                  />
                </div>
              </div>

              <div className="mt-3 grid grid-cols-4 gap-1 border-t border-[#f0ebe3] pt-2.5">
                {[
                  { Icon: BedDouble, label: `${residence.beds} Hab.` },
                  { Icon: Bath, label: `${residence.baths} Baños` },
                  { Icon: Ruler, label: `${residence.sqft.toLocaleString()} Sq` },
                  { Icon: Car, label: `${residence.garage} Gar.` },
                ].map(({ Icon, label }, i) => (
                  <motion.div
                    key={label}
                    initial={{ opacity: 0, y: 6 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    viewport={{ once: true }}
                    transition={{ delay: 0.08 * i, duration: 0.35 }}
                    className="flex flex-col items-start gap-0.5"
                  >
                    <Icon size={12} className="text-[#b8924a]" strokeWidth={1.5} />
                    <span className="text-[8px] tracking-[0.06em] text-[#6a655e] uppercase">
                      {label}
                    </span>
                  </motion.div>
                ))}
              </div>
            </div>
          </div>

          {/* Live social row */}
          <div className="mt-4 flex flex-wrap items-center gap-x-4 gap-y-2 border-t border-[#f0ebe3] pt-3">
            <p className="inline-flex items-center gap-1.5 text-[10px] text-[#6a655e]">
              <Users size={12} className="text-[#b8924a]" />
              <span className="font-medium text-ink tabular-nums">
                <AnimatedCounter value={waitlist} />
              </span>
              <span className="tracking-[0.08em] uppercase">en lista</span>
            </p>
            <p className="inline-flex items-center gap-1.5 text-[10px] text-[#6a655e]">
              <Eye size={12} className="text-[#b8924a]" />
              <span className="font-medium text-ink tabular-nums">
                <AnimatedCounter value={viewers} />
              </span>
              <span className="tracking-[0.08em] uppercase">viendo ahora</span>
            </p>
            <div className="min-h-[16px] min-w-0 flex-1">
              <AnimatePresence mode="wait">
                {tick && (
                  <motion.p
                    key={tickId}
                    initial={{ opacity: 0, x: 6 }}
                    animate={{ opacity: 1, x: 0 }}
                    exit={{ opacity: 0 }}
                    className="truncate text-[9px] tracking-[0.04em] text-[#9a8660]"
                  >
                    {tick}
                  </motion.p>
                )}
              </AnimatePresence>
            </div>
          </div>

          <div className="mt-3 flex flex-col gap-3 border-t border-[#f0ebe3] pt-3 sm:flex-row sm:items-center sm:justify-between">
            <p className="inline-flex items-center gap-1.5 text-[9px] tracking-[0.18em] text-[#b8924a] uppercase">
              <CalendarDays size={13} strokeWidth={1.75} />
              Coming Fall 2026
            </p>
            <Countdown
              targetDate={residence.completionDate}
              variant="light"
              size="sm"
            />
          </div>
        </div>
      </Link>
    </motion.div>
  );
}
