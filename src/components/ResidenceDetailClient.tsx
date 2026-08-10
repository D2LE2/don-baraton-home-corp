"use client";

import Image from "next/image";
import Link from "next/link";
import {
  ArrowLeft,
  ArrowUpRight,
  Bath,
  BedDouble,
  CalendarDays,
  Car,
  Check,
  Circle,
  MapPin,
  Ruler,
} from "lucide-react";
import { AnimatePresence, motion } from "framer-motion";
import { useMemo, useState } from "react";
import { Countdown } from "@/components/Countdown";
import { HeroVideo } from "@/components/HeroVideo";
import { Logo } from "@/components/Logo";
import { ProgressBar } from "@/components/ProgressBar";
import { WaitlistJoin } from "@/components/WaitlistJoin";
import { useNova } from "@/context/NovaContext";
import type { Residence } from "@/data/residences";
import { formatUsd, savingsPercent } from "@/lib/pricing";

export function ResidenceDetailClient({ residence }: { residence: Residence }) {
  const { isOnWaitlist } = useNova();
  const joined = isOnWaitlist(residence.id);
  const [waitlistOpen, setWaitlistOpen] = useState(false);
  const [stageId, setStageId] = useState(
    residence.stages.find((s) => s.status === "current")?.id ?? residence.stages[0]?.id,
  );
  const [lightbox, setLightbox] = useState<string | null>(null);

  const stage = residence.stages.find((s) => s.id === stageId) ?? residence.stages[0];
  const gallery = useMemo(() => {
    const imgs = [
      residence.image,
      ...residence.stages.flatMap((s) => s.images),
      residence.latestUpdate?.image,
    ].filter(Boolean) as string[];
    return Array.from(new Set(imgs));
  }, [residence]);

  return (
    <main className="min-h-screen overflow-x-hidden bg-[#f7f4ef] text-ink">
      <header className="sticky top-0 z-40 flex items-center justify-between border-b border-black/5 bg-[#f7f4ef]/90 px-5 py-4 backdrop-blur-md md:px-10">
        <Link
          href="/#catalogo"
          className="flex items-center gap-2 text-[11px] tracking-[0.2em] text-[#6a655e] uppercase transition hover:text-ink"
        >
          <ArrowLeft size={15} />
          Catálogo
        </Link>
        <Logo size="sm" />
        <Link href="/private" className="text-[10px] tracking-[0.2em] text-[#b8924a] uppercase">
          Private
        </Link>
      </header>

      {/* Cinematic hero */}
      <section className="relative h-[min(78vh,720px)] min-h-[420px] overflow-hidden bg-[#12100e]">
        <HeroVideo
          src={residence.video}
          objectPosition="center 40%"
          aria-label={residence.name}
        />
        <div className="absolute inset-0 bg-gradient-to-t from-black/85 via-black/30 to-black/40" />
        <div className="absolute inset-0 bg-gradient-to-r from-black/50 via-transparent to-transparent" />

        <div className="absolute inset-x-0 bottom-0 z-10 px-5 pb-8 md:px-10 md:pb-10">
          <div className="mx-auto flex max-w-6xl flex-col gap-6 lg:flex-row lg:items-end lg:justify-between">
            <div className="max-w-2xl">
              <p className="inline-flex items-center gap-2 text-[10px] tracking-[0.32em] text-[#e0c57a] uppercase">
                <span className="relative flex h-1.5 w-1.5">
                  <span className="absolute inline-flex h-full w-full animate-ping rounded-full bg-[#e0c57a]/70" />
                  <span className="relative inline-flex h-1.5 w-1.5 rounded-full bg-[#e0c57a]" />
                </span>
                {residence.code} · en obra
              </p>
              <motion.h1
                initial={{ opacity: 0, y: 16 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.7 }}
                className="mt-3 text-[clamp(2.4rem,7vw,4.5rem)] font-semibold leading-[0.95] tracking-[0.04em] text-white uppercase"
              >
                {residence.name}
              </motion.h1>
              <p className="mt-3 flex items-center gap-1.5 text-[13px] text-white/60">
                <MapPin size={13} />
                {residence.location}
              </p>
              <p className="mt-3 max-w-md text-[14px] leading-relaxed text-white/70">
                {residence.teaser}
              </p>
              <div className="mt-5 max-w-xs">
                <ProgressBar
                  value={residence.progress}
                  tone="dark"
                  showLabel
                  label="Transformación"
                  live
                />
              </div>
            </div>

            <div className="w-full max-w-sm border border-white/15 bg-black/45 p-4 backdrop-blur-md md:p-5">
              <p className="text-[9px] tracking-[0.24em] text-[#e0c57a] uppercase">
                Precio de preventa
              </p>
              <p className="mt-2 text-2xl font-light tracking-wide text-white md:text-3xl">
                Desde {formatUsd(residence.priceFrom)}
              </p>
              <p className="mt-1 text-[11px] text-white/45">
                Mercado ~{formatUsd(residence.marketValue)} ·{" "}
                {savingsPercent(residence.priceFrom, residence.marketValue)}% de ventaja
              </p>
              <p className="mt-3 text-[10px] tracking-[0.12em] text-white/50 uppercase">
                Entrega · {residence.expected}
              </p>
              <div className="mt-4">
                <Countdown targetDate={residence.completionDate} variant="gold" size="sm" />
              </div>
              <button
                type="button"
                onClick={() => setWaitlistOpen(true)}
                className="mt-5 w-full bg-[#e0c57a] py-3 text-[10px] font-semibold tracking-[0.2em] text-ink uppercase transition hover:bg-white"
              >
                {joined ? "Ya estás en esta lista" : "Unirse a la lista de esta residencia"}
              </button>
            </div>
          </div>
        </div>
      </section>

      {/* Specs */}
      <section className="border-b border-[#e8e2d8] bg-white px-5 py-6 md:px-10">
        <div className="mx-auto grid max-w-6xl grid-cols-2 gap-4 sm:grid-cols-4 md:gap-8">
          {[
            { Icon: BedDouble, label: "Habitaciones", value: String(residence.beds) },
            { Icon: Bath, label: "Baños", value: String(residence.baths) },
            { Icon: Ruler, label: "Sq Ft", value: residence.sqft.toLocaleString() },
            { Icon: Car, label: "Garage", value: String(residence.garage) },
          ].map(({ Icon, label, value }) => (
            <div key={label} className="flex items-center gap-3">
              <Icon size={16} className="text-[#b8924a]" strokeWidth={1.5} />
              <div>
                <p className="text-[9px] tracking-[0.18em] text-[#9a8660] uppercase">{label}</p>
                <p className="text-[15px] font-medium text-ink tabular-nums">{value}</p>
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* Gallery */}
      <section className="px-5 py-14 md:px-10 md:py-16">
        <div className="mx-auto max-w-6xl">
          <div className="flex items-end justify-between gap-4">
            <div>
              <p className="text-[10px] tracking-[0.32em] text-[#9a8660] uppercase">Galería</p>
              <h2 className="mt-2 text-2xl font-light tracking-[0.04em] text-ink md:text-3xl">
                La residencia, en imágenes
              </h2>
            </div>
            <p className="hidden text-[12px] text-[#8a847a] sm:block">
              {gallery.length} momentos documentados
            </p>
          </div>

          <div className="mt-8 grid grid-cols-2 gap-2 md:grid-cols-4 md:gap-3">
            {gallery.slice(0, 8).map((src, i) => (
              <motion.button
                key={`${src}-${i}`}
                type="button"
                initial={{ opacity: 0, y: 12 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: i * 0.04, duration: 0.4 }}
                onClick={() => setLightbox(src)}
                className={`relative overflow-hidden bg-[#ebe6de] ${
                  i === 0 ? "col-span-2 aspect-[16/10] md:row-span-2 md:aspect-auto md:h-full" : "aspect-[4/3]"
                }`}
              >
                <Image
                  src={src}
                  alt=""
                  fill
                  className="object-cover transition duration-700 hover:scale-[1.03]"
                  sizes="(max-width: 768px) 50vw, 25vw"
                />
              </motion.button>
            ))}
          </div>
        </div>
      </section>

      {/* Progress + stages */}
      <section className="border-y border-[#e8e2d8] bg-white px-5 py-14 md:px-10 md:py-16">
        <div className="mx-auto grid max-w-6xl gap-10 lg:grid-cols-[0.9fr_1.1fr] lg:gap-14">
          <div>
            <p className="text-[10px] tracking-[0.32em] text-[#9a8660] uppercase">Progreso en vivo</p>
            <h2 className="mt-2 text-2xl font-light tracking-[0.04em] text-ink md:text-3xl">
              {residence.progress}% transformada
            </h2>
            <p className="mt-3 max-w-sm text-[13px] leading-relaxed text-[#8a847a]">
              Cada etapa queda documentada. Selecciona un momento para ver el avance real de{" "}
              {residence.name.replace("THE ", "")}.
            </p>
            <div className="mt-6">
              <ProgressBar value={residence.progress} showLabel label="Obra actual" live />
            </div>
            {residence.latestUpdate && (
              <div className="mt-6 border border-[#ece7df] bg-[#faf8f4] p-4">
                <p className="text-[9px] tracking-[0.22em] text-[#b8924a] uppercase">
                  Última actualización · {residence.latestUpdate.date}
                </p>
                <p className="mt-2 text-[14px] font-medium text-ink">{residence.latestUpdate.title}</p>
                <p className="mt-1 text-[12px] leading-relaxed text-[#8a847a]">
                  {residence.latestUpdate.body}
                </p>
              </div>
            )}
          </div>

          <div>
            <ul className="space-y-1.5">
              {residence.stages.map((s) => {
                const active = s.id === stageId;
                return (
                  <li key={s.id}>
                    <button
                      type="button"
                      onClick={() => setStageId(s.id)}
                      className={`flex w-full items-center gap-3 px-3 py-3 text-left transition ${
                        active ? "bg-ink text-white" : "hover:bg-black/[0.03]"
                      }`}
                    >
                      <span
                        className={`flex h-6 w-6 items-center justify-center rounded-full border ${
                          s.status === "done"
                            ? active
                              ? "border-[#e0c57a] bg-[#e0c57a] text-ink"
                              : "border-[#c4a574] text-[#c4a574]"
                            : s.status === "current"
                              ? "border-[#c4a574] text-[#c4a574]"
                              : active
                                ? "border-white/30 text-white/40"
                                : "border-[#ddd6cb] text-[#b0aaa0]"
                        }`}
                      >
                        {s.status === "done" ? (
                          <Check size={12} strokeWidth={2.5} />
                        ) : (
                          <Circle size={8} fill={s.status === "current" ? "currentColor" : "none"} />
                        )}
                      </span>
                      <span className="flex-1 text-[13px] tracking-wide">{s.label}</span>
                      <span
                        className={`text-[9px] tracking-[0.18em] uppercase ${
                          active ? "text-[#e0c57a]" : "text-[#9a8660]"
                        }`}
                      >
                        {s.date}
                      </span>
                    </button>
                  </li>
                );
              })}
            </ul>

            <AnimatePresence mode="wait">
              {stage && (
                <motion.div
                  key={stage.id}
                  initial={{ opacity: 0, y: 8 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0 }}
                  transition={{ duration: 0.3 }}
                  className="mt-4 overflow-hidden border border-[#ece7df]"
                >
                  <button
                    type="button"
                    className="relative aspect-[16/10] w-full"
                    onClick={() => setLightbox(stage.images[0])}
                  >
                    <Image
                      src={stage.images[0]}
                      alt={stage.label}
                      fill
                      className="object-cover"
                      sizes="(max-width: 1024px) 100vw, 50vw"
                    />
                  </button>
                  <div className="bg-[#faf8f4] p-4">
                    <p className="text-[9px] tracking-[0.22em] text-[#b8924a] uppercase">
                      {stage.date}
                      {stage.status === "current" ? " · En curso" : ""}
                    </p>
                    <h3 className="mt-1 text-lg text-ink">{stage.label}</h3>
                    <p className="mt-1.5 text-[13px] leading-relaxed text-[#8a847a]">
                      {stage.description}
                    </p>
                  </div>
                </motion.div>
              )}
            </AnimatePresence>
          </div>
        </div>
      </section>

      {/* Waitlist band */}
      <section className="bg-ink px-5 py-14 text-white md:px-10 md:py-16">
        <div className="mx-auto flex max-w-6xl flex-col gap-8 lg:flex-row lg:items-center lg:justify-between">
          <div className="max-w-xl">
            <p className="text-[10px] tracking-[0.32em] text-[#e0c57a] uppercase">
              Lista exclusiva · {residence.code}
            </p>
            <h2 className="mt-3 text-2xl font-light tracking-[0.04em] md:text-3xl">
              Reserva tu lugar en esta residencia
            </h2>
            <p className="mt-3 text-[13px] leading-relaxed text-white/50">
              {residence.waitlistCount}+ personas ya siguen este avance
              {residence.waitlistLimited ? " · cupos limitados" : ""}. Prioridad real cuando abra.
            </p>
            <p className="mt-4 inline-flex items-center gap-1.5 text-[11px] text-white/40">
              <CalendarDays size={13} />
              Entrega estimada {residence.expected}
            </p>
          </div>
          <div className="flex flex-col gap-3 sm:flex-row sm:items-center">
            <button
              type="button"
              onClick={() => setWaitlistOpen(true)}
              className="bg-[#e0c57a] px-7 py-3.5 text-[11px] font-semibold tracking-[0.2em] text-ink uppercase transition hover:bg-white"
            >
              {joined ? "Gestionar / ya unido" : "Unirme a esta lista"}
            </button>
            <Link
              href="/private/apply"
              className="inline-flex items-center justify-center gap-1.5 border border-white/20 px-6 py-3.5 text-[11px] tracking-[0.18em] text-white/80 uppercase transition hover:border-white"
            >
              Omar Private
              <ArrowUpRight size={14} />
            </Link>
          </div>
        </div>
      </section>

      <WaitlistJoin
        residence={residence}
        open={waitlistOpen}
        onClose={() => setWaitlistOpen(false)}
      />

      <AnimatePresence>
        {lightbox && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-[70] flex items-center justify-center bg-black/85 p-4"
            onClick={() => setLightbox(null)}
          >
            <motion.div
              initial={{ scale: 0.96, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.98, opacity: 0 }}
              className="relative h-[min(80vh,720px)] w-full max-w-5xl"
              onClick={(e) => e.stopPropagation()}
            >
              <Image src={lightbox} alt="" fill className="object-contain" sizes="100vw" />
              <button
                type="button"
                onClick={() => setLightbox(null)}
                className="absolute top-3 right-3 bg-white/90 px-3 py-1.5 text-[10px] tracking-[0.18em] text-ink uppercase"
              >
                Cerrar
              </button>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </main>
  );
}
