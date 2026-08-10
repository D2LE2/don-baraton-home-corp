"use client";

import Image from "next/image";
import Link from "next/link";
import {
  ArrowRight,
  ChevronDown,
  Lock,
  Menu,
  X,
} from "lucide-react";
import { AnimatePresence, motion } from "framer-motion";
import { useState } from "react";
import { BannerLiveTicks } from "@/components/BannerLiveTicks";
import { HeroActivityFeed } from "@/components/HeroActivityFeed";
import { LaunchCard } from "@/components/LaunchCard";
import { Logo } from "@/components/Logo";
import { OmarCredibility } from "@/components/OmarCredibility";
import { ProgressBar } from "@/components/ProgressBar";
import { ResidencesCatalog } from "@/components/ResidencesCatalog";
import { VideoResidenceFeed } from "@/components/VideoResidenceFeed";
import { residences } from "@/data/residences";

export default function HomePage() {
  const [menuOpen, setMenuOpen] = useState(false);
  const featured = residences[0];

  return (
    <main className="overflow-x-hidden bg-white">
      {/* PRIMERA SECCIÓN — light launch hero (mockup) */}
      <section className="relative bg-white text-ink">
        <header className="relative z-30 flex items-center justify-between px-5 pt-5 md:px-10 md:pt-7">
          <Logo size="md" />
          <button
            type="button"
            aria-label={menuOpen ? "Cerrar menú" : "Abrir menú"}
            onClick={() => setMenuOpen((v) => !v)}
            className="flex h-11 w-11 items-center justify-center rounded-full border border-[#e8e2d8] bg-white text-ink shadow-sm"
          >
            {menuOpen ? <X size={16} /> : <Menu size={16} />}
          </button>
        </header>

        <AnimatePresence>
          {menuOpen && (
            <motion.nav
              initial={{ opacity: 0, y: -6 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0 }}
              className="absolute top-[4.25rem] right-5 z-40 w-48 border border-[#e8e2d8] bg-white p-4 shadow-lg md:right-10"
            >
              <div className="flex flex-col gap-3 text-[11px] tracking-[0.22em] text-ink/70 uppercase">
                <Link href="/#casas" onClick={() => setMenuOpen(false)}>
                  Colección
                </Link>
                <Link href="/#catalogo" onClick={() => setMenuOpen(false)}>
                  Catálogo
                </Link>
                <Link href="/residences" onClick={() => setMenuOpen(false)}>
                  Showroom
                </Link>
                <Link href="/private" onClick={() => setMenuOpen(false)}>
                  Omar Private
                </Link>
              </div>
            </motion.nav>
          )}
        </AnimatePresence>

        {/* Headline banner — cinematic still + live ticks */}
        <div className="relative z-10 pt-6 md:pt-8">
          <div className="relative w-full overflow-hidden">
            <div className="relative h-[min(42vh,320px)] min-h-[200px] w-full overflow-hidden bg-[#1a1814] sm:h-[min(46vh,380px)] md:h-[min(48vh,420px)]">
              <motion.div
                className="absolute inset-0"
                initial={{ scale: 1.08 }}
                animate={{ scale: 1 }}
                transition={{ duration: 8, ease: [0.22, 1, 0.36, 1] }}
              >
                <Image
                  src={featured.image}
                  alt=""
                  fill
                  priority
                  className="object-cover object-[center_38%]"
                  sizes="100vw"
                />
              </motion.div>

              <div className="absolute inset-0 bg-gradient-to-r from-black/75 via-black/45 to-black/25" />
              <div className="absolute inset-0 bg-gradient-to-t from-black/50 via-transparent to-black/25" />

              <BannerLiveTicks />

              <div className="absolute inset-0 z-10 flex flex-col justify-center px-5 pb-8 md:px-10 md:pb-10 lg:px-16">
                <motion.p
                  initial={{ opacity: 0, y: 8 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.6, delay: 0.15 }}
                  className="text-[10px] tracking-[0.4em] text-[#e0c57a] uppercase md:text-[11px]"
                >
                  Omar Corp · Indiana
                </motion.p>
                <motion.h1
                  initial={{ opacity: 0, y: 16 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.75, delay: 0.28 }}
                  className="mt-3 max-w-3xl text-[clamp(1.85rem,7vw,4rem)] font-semibold leading-[1.02] tracking-[0.04em] text-white uppercase"
                >
                  Residencias en obra.
                  <br />
                  Acceso privado.
                </motion.h1>
                <motion.p
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  transition={{ duration: 0.6, delay: 0.55 }}
                  className="mt-3 max-w-sm text-[11px] leading-relaxed text-white/65 md:text-[12px]"
                >
                  Progreso en tiempo real. Cupos limitados en lista privada.
                </motion.p>
              </div>
            </div>
          </div>

          <div className="mx-auto max-w-xl px-5 pt-5 md:mx-0 md:px-10 lg:px-16">
            <p className="max-w-md text-[12px] leading-relaxed tracking-[0.04em] text-[#6a655e] md:text-[13px]">
              Vas a ver el progreso de cada vivienda en tiempo real — etapas, avances y
              actualizaciones mientras se transforma.
            </p>
            <p className="mt-3 max-w-sm text-[14px] leading-relaxed text-[#8a847a] md:text-[15px]">
              Colección selecta en Indiana. Prioridad para quienes entran a la lista privada.
            </p>

            <Link
              href="/private"
              className="mt-7 inline-flex w-full max-w-sm items-center justify-center gap-2.5 rounded-md bg-ink px-6 py-3.5 text-[11px] font-medium tracking-[0.18em] text-[#e0c57a] uppercase transition hover:bg-ink/90 sm:w-auto"
            >
              Únete a la lista privada
              <ArrowRight size={14} />
            </Link>
            <p className="mt-3 flex items-center gap-1.5 text-[9px] tracking-[0.2em] text-[#9a948c] uppercase">
              <Lock size={10} />
              Acceso exclusivo. Cupos limitados.
            </p>
          </div>
        </div>

        {/* House image + overlapping launch card */}
        <div className="relative mt-8 md:mt-10">
          <div className="relative mx-auto h-[42vh] min-h-[280px] max-h-[420px] w-full overflow-hidden bg-[#1a1814] md:h-[48vh] md:max-h-[520px]">
            <Image
              src={featured.image}
              alt={featured.name}
              fill
              priority
              className="object-cover object-[center_45%]"
              sizes="100vw"
            />
            <div className="absolute inset-0 bg-gradient-to-t from-black/55 via-transparent to-transparent" />
            <HeroActivityFeed />

            {/* Minimal progress — Residence 001 */}
            <div className="absolute top-4 right-4 z-30 w-[148px] md:top-5 md:right-5 md:w-[168px]">
              <div className="rounded-md border border-white/15 bg-black/45 px-3 py-2 backdrop-blur-sm">
                <ProgressBar
                  value={featured.progress}
                  tone="dark"
                  size="sm"
                  showLabel
                  label="Progreso"
                />
              </div>
            </div>
          </div>

          {/* Floating launch card */}
          <div className="relative z-20 -mt-14 px-4 pb-2 md:-mt-16 md:px-10 lg:px-16">
            <LaunchCard residence={featured} />
          </div>

          <div className="flex flex-col items-center gap-1 pb-6 pt-5 text-[#b0aaa0]">
            <ChevronDown size={16} className="animate-bounce" />
            <span className="text-[9px] tracking-[0.28em] uppercase">
              Desliza para descubrir
            </span>
          </div>
        </div>
      </section>

      {/* Colección en vivo */}
      <VideoResidenceFeed />

      {/* Catálogo premium compacto */}
      <ResidencesCatalog />

      {/* Credibilidad Omar Corp */}
      <OmarCredibility />

      {/* Proceso */}
      <section className="relative bg-[#faf8f4] px-5 py-24 md:px-12 md:py-32 lg:px-16">
        <div className="mx-auto max-w-[1200px]">
          <motion.div
            initial={{ opacity: 0, y: 28 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, margin: "-80px" }}
            transition={{ duration: 0.7 }}
            className="max-w-2xl"
          >
            <p className="text-[11px] tracking-[0.45em] text-[#9a8660] uppercase">Proceso</p>
            <h2 className="display mt-4 text-4xl font-light leading-tight text-ink md:text-6xl">
              Tres pasos.
              <br />
              Cero ruido.
            </h2>
          </motion.div>

          <div className="mt-20 grid gap-0 border-t border-[#e8e2d8] md:grid-cols-3">
            {[
              {
                step: "01",
                title: "Observa",
                copy: "Entra a la colección y mira cómo cambia cada residencia — avance real, no catálogo estático.",
              },
              {
                step: "02",
                title: "Síguela",
                copy: "Cada actualización te acerca. Prioridad en la lista para quien ya está dentro.",
              },
              {
                step: "03",
                title: "Posiciónate",
                copy: "Acceso privado a la lista. Cuando esté lista, tú ya estabas ahí.",
              },
            ].map((item, i) => (
              <motion.div
                key={item.step}
                initial={{ opacity: 0, y: 24 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: i * 0.12, duration: 0.55 }}
                className="border-[#e8e2d8] py-10 md:border-r md:px-8 md:py-12 md:first:pl-0 md:last:border-r-0 md:last:pr-0"
              >
                <p className="text-[11px] tracking-[0.4em] text-[#9a8660]">{item.step}</p>
                <h3 className="display mt-6 text-3xl font-light text-ink">{item.title}</h3>
                <p className="mt-4 text-sm leading-relaxed text-[#8a847a]">{item.copy}</p>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Private */}
      <section className="bg-[#f3efe8] px-5 py-24 md:px-12 md:py-32 lg:px-16">
        <div className="mx-auto grid max-w-6xl items-center gap-14 md:grid-cols-2">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
          >
            <p className="text-[11px] tracking-[0.35em] text-gold uppercase">Mundo privado</p>
            <h2 className="mt-4 text-3xl font-light tracking-[0.08em] text-ink md:text-5xl">
              OMAR PRIVATE
            </h2>
            <p className="script mt-2 text-3xl text-gold">Solo para miembros.</p>
            <p className="mt-6 max-w-md text-base leading-relaxed text-muted">
              Acceso a residencias antes del mercado. Membresía por solicitud — para quien está
              listo de verdad.
            </p>
            <Link
              href="/private"
              className="mt-10 inline-flex items-center gap-2 rounded-full bg-ink px-8 py-4 text-[12px] tracking-[0.22em] text-gold-soft uppercase transition hover:bg-ink/90"
            >
              Solicitar membresía →
            </Link>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, scale: 0.97 }}
            whileInView={{ opacity: 1, scale: 1 }}
            viewport={{ once: true }}
            className="relative aspect-[4/5] overflow-hidden md:aspect-[5/6]"
          >
            <Image
              src="/images/ellington.jpg"
              alt="Omar Private"
              fill
              className="object-cover"
              sizes="(max-width: 768px) 100vw, 50vw"
            />
            <div className="absolute inset-0 bg-gradient-to-t from-ink/55 to-transparent" />
            <p className="absolute bottom-8 left-8 text-[11px] tracking-[0.3em] text-gold-soft uppercase">
              Antes de que salga al mercado
            </p>
          </motion.div>
        </div>
      </section>

      <footer className="border-t border-white/10 bg-ink px-5 py-12 md:px-12">
        <div className="mx-auto flex max-w-6xl flex-col items-start justify-between gap-6 sm:flex-row sm:items-center">
          <Logo light size="sm" />
          <p className="text-[11px] tracking-[0.15em] text-white/35 uppercase">
            Omar Corp · Indiana · Live residences
          </p>
        </div>
      </footer>
    </main>
  );
}
