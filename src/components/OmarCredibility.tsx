"use client";

import { motion, useInView } from "framer-motion";
import { useEffect, useRef, useState } from "react";
import { AnimatedCounter } from "@/components/AnimatedCounter";

const STATS = [
  {
    value: 13,
    label: "Residencias cerradas",
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
      className="border-t border-white/10 pt-6 md:border-t-0 md:border-l md:pt-0 md:pl-8 md:first:border-l-0 md:first:pl-0"
    >
      <p className="text-[clamp(2.4rem,5vw,3.5rem)] font-light leading-none tracking-tight text-[#e0c57a] tabular-nums">
        <AnimatedCounter value={n} duration={1400} />
        {suffix}
      </p>
      <p className="mt-3 text-[11px] tracking-[0.22em] text-white/85 uppercase">{label}</p>
      <p className="mt-2 max-w-[220px] text-[12px] leading-relaxed text-white/40">{detail}</p>
    </motion.div>
  );
}

/** Credible Omar Corp proof — closed homes, families, private lists */
export function OmarCredibility() {
  const [pulse, setPulse] = useState(0);

  useEffect(() => {
    const id = window.setInterval(() => {
      setPulse((p) => (p + 1) % PULSES.length);
    }, 4200);
    return () => window.clearInterval(id);
  }, []);

  return (
    <section className="relative overflow-hidden bg-ink text-white">
      <div className="pointer-events-none absolute inset-0 bg-[radial-gradient(ellipse_at_top_right,rgba(224,197,122,0.12),transparent_55%)]" />

      <div className="relative mx-auto max-w-[1200px] px-5 py-16 md:px-12 md:py-20 lg:px-16">
        <div className="flex flex-col gap-6 border-b border-white/10 pb-10 md:flex-row md:items-end md:justify-between">
          <div className="max-w-xl">
            <p className="text-[10px] tracking-[0.35em] text-[#e0c57a] uppercase">
              Resultados Omar Corp
            </p>
            <h2 className="mt-3 text-[clamp(1.75rem,4vw,2.75rem)] font-light leading-tight tracking-[0.04em] text-white">
              Lo que ya entregamos.
            </h2>
          </div>
          <p className="max-w-sm text-[13px] leading-relaxed text-white/45">
            Cierres reales, familias en su hogar y listas privadas con prioridad — el mismo estándar
            que verás en cada residencia de esta colección.
          </p>
        </div>

        <div className="mt-10 grid gap-8 sm:grid-cols-2 lg:grid-cols-4 lg:gap-0">
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

        <div className="mt-12 flex flex-col gap-3 border-t border-white/10 pt-6 sm:flex-row sm:items-center sm:justify-between">
          <div className="flex items-center gap-2">
            <span className="relative flex h-1.5 w-1.5">
              <span className="absolute inline-flex h-full w-full animate-ping rounded-full bg-[#e0c57a]/70" />
              <span className="relative inline-flex h-1.5 w-1.5 rounded-full bg-[#e0c57a]" />
            </span>
            <p className="text-[9px] tracking-[0.28em] text-white/40 uppercase">Actividad reciente</p>
          </div>
          <motion.p
            key={pulse}
            initial={{ opacity: 0, y: 6 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.35 }}
            className="text-[12px] tracking-[0.04em] text-white/70 md:text-right"
          >
            {PULSES[pulse]}
          </motion.p>
        </div>
      </div>
    </section>
  );
}
