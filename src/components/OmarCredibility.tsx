"use client";

import { motion, useInView } from "framer-motion";
import { useEffect, useRef, useState } from "react";
import { AnimatedCounter } from "@/components/AnimatedCounter";

const STATS = [
  {
    value: 14,
    label: "Viviendas vendidas",
    detail: "Transacciones completadas a través de Omar Corp",
  },
  {
    value: 13,
    label: "Familias en su hogar",
    detail: "Entregas reales en Indiana · 2024–2026",
  },
  {
    value: 248,
    label: "En listas privadas",
    detail: "Personas siguiendo residencias en obra ahora",
  },
  {
    value: 92,
    suffix: "%",
    label: "Prioridad cumplida",
    detail: "Miembros de lista contactados antes del mercado",
  },
] as const;

const PULSES = [
  "Cierre reciente · Residence 004 · Carmel · vía Omar Corp",
  "Familia N. recibió llaves en Fort Wayne · hace 9 días",
  "Lista privada · Residence 001 · 3 nuevos ingresos hoy",
  "Preventa cerrada · Logansport corridor · Omar Private",
];

function StatBlock({
  value,
  suffix = "",
  label,
  detail,
  delay,
}: {
  value: number;
  suffix?: string;
  label: string;
  detail: string;
  delay: number;
}) {
  const ref = useRef<HTMLDivElement>(null);
  const inView = useInView(ref, { once: true, margin: "-60px" });
  const [n, setN] = useState(0);

  useEffect(() => {
    if (inView) setN(value);
  }, [inView, value]);

  return (
    <motion.div
      ref={ref}
      initial={{ opacity: 0, y: 18 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, margin: "-40px" }}
      transition={{ duration: 0.55, delay }}
      className="rounded-[1.25rem] border border-[#ebe7e0] bg-white p-5 shadow-[0_8px_24px_rgba(20,16,10,0.04)] md:p-6"
    >
      <p className="text-[clamp(2.1rem,4vw,2.8rem)] font-semibold leading-none tracking-tight text-ink tabular-nums">
        <AnimatedCounter value={n} duration={1400} />
        {suffix}
      </p>
      <p className="mt-3 text-[13px] font-semibold text-ink">{label}</p>
      <p className="mt-1.5 text-[13px] leading-relaxed text-[#6a6660]">{detail}</p>
    </motion.div>
  );
}

/** Light credibility band — proof without black panels */
export function OmarCredibility() {
  const [pulse, setPulse] = useState(0);

  useEffect(() => {
    const id = window.setInterval(() => {
      setPulse((p) => (p + 1) % PULSES.length);
    }, 4200);
    return () => window.clearInterval(id);
  }, []);

  return (
    <section className="relative bg-[#f7f7f5] text-ink">
      <div className="relative mx-auto max-w-[1200px] px-5 py-14 md:px-12 md:py-16 lg:px-16">
        <div className="flex flex-col gap-3 md:flex-row md:items-end md:justify-between">
          <div className="max-w-xl">
            <p className="text-[12px] font-medium text-[#8a6b2e]">Resultados Omar Corp</p>
            <h2 className="mt-1.5 text-[1.65rem] font-semibold leading-tight tracking-tight text-ink md:text-[2rem]">
              Lo que ya entregamos
            </h2>
          </div>
          <p className="max-w-sm text-[14px] leading-relaxed text-[#6a6660]">
            Cierres reales, familias en su hogar y listas privadas con prioridad.
          </p>
        </div>

        <div className="mt-8 grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
          {STATS.map((s, i) => (
            <StatBlock
              key={s.label}
              value={s.value}
              suffix={"suffix" in s ? s.suffix : ""}
              label={s.label}
              detail={s.detail}
              delay={i * 0.08}
            />
          ))}
        </div>

        <div className="mt-8 flex flex-col gap-2 rounded-[1.25rem] border border-[#ebe7e0] bg-white px-5 py-4 sm:flex-row sm:items-center sm:justify-between">
          <div className="flex items-center gap-2">
            <span className="relative flex h-1.5 w-1.5">
              <span className="absolute inline-flex h-full w-full animate-ping rounded-full bg-emerald-500/70" />
              <span className="relative inline-flex h-1.5 w-1.5 rounded-full bg-emerald-500" />
            </span>
            <p className="text-[12px] font-medium text-[#8a847a]">Actividad reciente</p>
          </div>
          <motion.p
            key={pulse}
            initial={{ opacity: 0, y: 6 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.35 }}
            className="text-[13px] text-[#5c574f] md:text-right"
          >
            {PULSES[pulse]}
          </motion.p>
        </div>
      </div>
    </section>
  );
}
