"use client";

import Image from "next/image";
import Link from "next/link";
import { ArrowRight, Lock, Menu, X } from "lucide-react";
import { AnimatePresence, motion } from "framer-motion";
import { useState } from "react";
import { BannerLiveTicks } from "@/components/BannerLiveTicks";
import { LaunchCard } from "@/components/LaunchCard";
import { Logo } from "@/components/Logo";
import { OmarCredibility } from "@/components/OmarCredibility";
import { ProgressBar } from "@/components/ProgressBar";
import { ResidencesCatalog } from "@/components/ResidencesCatalog";
import { VideoResidenceFeed } from "@/components/VideoResidenceFeed";
import { residences } from "@/data/residences";

const fadeUp = {
  initial: { opacity: 0, y: 20 },
  whileInView: { opacity: 1, y: 0 },
  viewport: { once: true, margin: "-60px" },
  transition: { duration: 0.65, ease: [0.22, 1, 0.36, 1] as const },
};

export default function HomePage() {
  const [menuOpen, setMenuOpen] = useState(false);
  const featured = residences[0];

  return (
    <main className="overflow-x-hidden bg-[#f7f4ef] text-ink">
      {/* 1 — HERO: una sola composición */}
      <section className="relative bg-[#f7f4ef]">
        <header className="relative z-30 flex items-center justify-between px-5 pt-5 md:px-10 md:pt-7">
          <Logo size="md" />
          <button
            type="button"
            aria-label={menuOpen ? "Cerrar menú" : "Abrir menú"}
            onClick={() => setMenuOpen((v) => !v)}
            className="flex h-11 w-11 items-center justify-center rounded-full border border-[#e4dfd6] bg-white/80 text-ink shadow-sm backdrop-blur-sm"
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
              className="absolute top-[4.25rem] right-5 z-40 w-48 border border-[#e4dfd6] bg-white p-4 shadow-lg md:right-10"
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

        <div className="relative mt-5 w-full overflow-hidden md:mt-6">
          <div className="relative h-[min(58vh,560px)] min-h-[320px] w-full bg-[#1a1814]">
            <motion.div
              className="absolute inset-0"
              initial={{ scale: 1.06 }}
              animate={{ scale: 1 }}
              transition={{ duration: 9, ease: [0.22, 1, 0.36, 1] }}
            >
              <Image
                src={featured.image}
                alt={featured.name}
                fill
                priority
                className="object-cover object-[center_42%]"
                sizes="100vw"
              />
            </motion.div>
            <div className="absolute inset-0 bg-gradient-to-r from-black/75 via-black/40 to-black/20" />
            <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-transparent to-black/30" />

            <BannerLiveTicks />

            <div className="absolute top-4 right-4 z-20 w-[140px] md:top-5 md:right-5 md:w-[160px]">
              <div className="border border-white/15 bg-black/45 px-3 py-2 backdrop-blur-sm">
                <ProgressBar
                  value={featured.progress}
                  tone="dark"
                  size="sm"
                  showLabel
                  label="Progreso"
                  live
                />
              </div>
            </div>

            <div className="absolute inset-0 z-10 flex flex-col justify-end px-5 pb-28 md:px-10 md:pb-32 lg:px-16">
              <motion.p
                initial={{ opacity: 0, y: 8 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.55, delay: 0.1 }}
                className="text-[10px] tracking-[0.38em] text-[#e0c57a] uppercase"
              >
                Omar Corp · Indiana
              </motion.p>
              <motion.h1
                initial={{ opacity: 0, y: 14 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.7, delay: 0.22 }}
                className="mt-3 max-w-3xl text-[clamp(2rem,6.5vw,4rem)] font-semibold leading-[1.02] tracking-[0.04em] text-white uppercase"
              >
                Residencias en obra.
                <br />
                Acceso privado.
              </motion.h1>
              <motion.p
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ duration: 0.55, delay: 0.4 }}
                className="mt-3 max-w-md text-[13px] leading-relaxed text-white/65"
              >
                Mira el progreso en tiempo real. Únete a la lista de la residencia que quieres.
              </motion.p>
              <motion.div
                initial={{ opacity: 0, y: 8 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.55, delay: 0.5 }}
                className="mt-6 flex flex-wrap items-center gap-3"
              >
                <Link
                  href="#catalogo"
                  className="inline-flex items-center gap-2 bg-[#e0c57a] px-5 py-3 text-[11px] font-semibold tracking-[0.18em] text-ink uppercase transition hover:bg-white"
                >
                  Ver residencias
                  <ArrowRight size={14} />
                </Link>
                <Link
                  href="/private"
                  className="inline-flex items-center gap-1.5 border border-white/25 px-4 py-3 text-[10px] tracking-[0.16em] text-white/80 uppercase transition hover:border-white"
                >
                  <Lock size={11} />
                  Omar Private
                </Link>
              </motion.div>
            </div>
          </div>

          {/* Card bridges hero → rest of page */}
          <div className="relative z-20 -mt-16 px-4 md:-mt-20 md:px-10 lg:px-16">
            <LaunchCard residence={featured} />
          </div>
        </div>

        <p className="mx-auto max-w-lg px-5 pt-8 pb-12 text-center text-[13px] leading-relaxed text-[#6a655e] md:px-10">
          Omar Corp documenta cada transformación. Tú eliges la residencia, sigues el avance y
          entras a su lista — antes del mercado.
        </p>
      </section>

      {/* Soft divider */}
      <div className="h-px w-full bg-gradient-to-r from-transparent via-[#d9d0c3] to-transparent" />

      {/* 2 — Colección en vivo */}
      <VideoResidenceFeed />

      {/* Soft divider into catalog */}
      <div className="bg-[#f7f4ef] px-5 pt-2 md:px-12 lg:px-16">
        <div className="mx-auto h-px max-w-[1100px] bg-[#e4dfd6]" />
      </div>

      {/* 3 — Catálogo */}
      <ResidencesCatalog />

      {/* 4 — Credibilidad */}
      <OmarCredibility />

      {/* 5 — Proceso */}
      <section className="bg-[#f7f4ef] px-5 py-20 md:px-12 md:py-24 lg:px-16">
        <div className="mx-auto max-w-[1100px]">
          <motion.div {...fadeUp} className="max-w-xl">
            <p className="text-[10px] tracking-[0.35em] text-[#9a8660] uppercase">Cómo funciona</p>
            <h2 className="mt-3 text-3xl font-light leading-tight tracking-[0.03em] text-ink md:text-4xl">
              Tres pasos. Sin ruido.
            </h2>
          </motion.div>

          <div className="mt-12 grid gap-0 border-t border-[#e4dfd6] md:grid-cols-3">
            {[
              {
                step: "01",
                title: "Observa",
                copy: "Entra a la colección y mira cómo cambia cada residencia — avance real, no catálogo estático.",
              },
              {
                step: "02",
                title: "Elige y síguela",
                copy: "Únete a la lista de la propiedad que quieres. Prioridad para quien ya está dentro.",
              },
              {
                step: "03",
                title: "Posiciónate",
                copy: "Cuando esté lista, tú ya estabas ahí — con acceso privado y sin pelear el mercado.",
              },
            ].map((item, i) => (
              <motion.div
                key={item.step}
                initial={{ opacity: 0, y: 18 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: i * 0.1, duration: 0.5 }}
                className="border-[#e4dfd6] py-8 md:border-r md:px-7 md:py-10 md:first:pl-0 md:last:border-r-0 md:last:pr-0"
              >
                <p className="text-[10px] tracking-[0.35em] text-[#9a8660]">{item.step}</p>
                <h3 className="mt-4 text-xl font-light text-ink">{item.title}</h3>
                <p className="mt-3 text-[13px] leading-relaxed text-[#8a847a]">{item.copy}</p>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* 6 — Private → footer continuum (ink) */}
      <section className="bg-ink px-5 pt-20 pb-8 text-white md:px-12 md:pt-24 lg:px-16">
        <div className="mx-auto grid max-w-[1100px] items-center gap-12 md:grid-cols-2 md:gap-16">
          <motion.div {...fadeUp}>
            <p className="text-[10px] tracking-[0.35em] text-[#e0c57a] uppercase">Omar Private</p>
            <h2 className="mt-3 text-3xl font-light tracking-[0.06em] md:text-4xl">
              Acceso antes del mercado
            </h2>
            <p className="mt-4 max-w-md text-[14px] leading-relaxed text-white/50">
              Membresía por solicitud. Residencias, prioridad y actualizaciones — para quien está
              listo de verdad.
            </p>
            <Link
              href="/private"
              className="mt-8 inline-flex items-center gap-2 bg-[#e0c57a] px-7 py-3.5 text-[11px] font-semibold tracking-[0.2em] text-ink uppercase transition hover:bg-white"
            >
              Solicitar membresía
              <ArrowRight size={14} />
            </Link>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, scale: 0.98 }}
            whileInView={{ opacity: 1, scale: 1 }}
            viewport={{ once: true }}
            transition={{ duration: 0.7 }}
            className="relative aspect-[5/4] overflow-hidden md:aspect-[4/3]"
          >
            <Image
              src="/images/ellington.jpg"
              alt="Omar Private"
              fill
              className="object-cover"
              sizes="(max-width: 768px) 100vw, 50vw"
            />
            <div className="absolute inset-0 bg-gradient-to-t from-ink/60 to-transparent" />
            <p className="absolute bottom-6 left-6 text-[10px] tracking-[0.28em] text-[#e0c57a] uppercase">
              Antes de que salga al mercado
            </p>
          </motion.div>
        </div>

        <footer className="mx-auto mt-16 flex max-w-[1100px] flex-col items-start justify-between gap-5 border-t border-white/10 pt-8 sm:flex-row sm:items-center">
          <Logo light size="sm" />
          <p className="text-[10px] tracking-[0.18em] text-white/30 uppercase">
            Omar Corp · Indiana · Live residences
          </p>
        </footer>
      </section>
    </main>
  );
}
