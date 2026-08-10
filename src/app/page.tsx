"use client";

import Image from "next/image";
import Link from "next/link";
import { ArrowRight, ChevronDown, Lock, Menu, X } from "lucide-react";
import { AnimatePresence, motion } from "framer-motion";
import { useState } from "react";
import { BannerLiveTicks } from "@/components/BannerLiveTicks";
import { FeaturedLaunch } from "@/components/FeaturedLaunch";
import { Logo } from "@/components/Logo";
import { OmarCredibility } from "@/components/OmarCredibility";
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
    <main className="overflow-x-hidden bg-[#f7f7f5] text-ink">
      {/* 1 — HERO full viewport (segunda sección solo tras scroll) */}
      <section className="relative h-[100dvh] min-h-[100dvh] overflow-hidden bg-[#1a1814]">
        <motion.div
          className="absolute inset-0"
          initial={{ scale: 1.06 }}
          animate={{ scale: 1 }}
          transition={{ duration: 9, ease: [0.22, 1, 0.36, 1] }}
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
        <div className="absolute inset-0 bg-gradient-to-r from-black/75 via-black/40 to-black/20" />
        <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-transparent to-black/35" />

        <header className="absolute inset-x-0 top-0 z-30 flex items-center justify-between px-5 pt-5 md:px-10 md:pt-7">
          <Logo size="md" light />
          <button
            type="button"
            aria-label={menuOpen ? "Cerrar menú" : "Abrir menú"}
            onClick={() => setMenuOpen((v) => !v)}
            className="flex h-11 w-11 items-center justify-center rounded-full border border-white/20 bg-black/35 text-white shadow-sm backdrop-blur-sm"
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
              className="absolute top-[4.25rem] right-5 z-40 w-48 border border-white/15 bg-black/80 p-4 shadow-lg backdrop-blur-md md:right-10"
            >
              <div className="flex flex-col gap-3 text-[11px] tracking-[0.22em] text-white/75 uppercase">
                <Link href="/#lanzamiento" onClick={() => setMenuOpen(false)}>
                  Lanzamiento
                </Link>
                <Link href="/#casas" onClick={() => setMenuOpen(false)}>
                  Colección
                </Link>
                <Link href="/#catalogo" onClick={() => setMenuOpen(false)}>
                  Catálogo
                </Link>
                <Link href="/private" onClick={() => setMenuOpen(false)}>
                  Omar Private
                </Link>
              </div>
            </motion.nav>
          )}
        </AnimatePresence>

        <BannerLiveTicks />

        <div className="absolute inset-0 z-10 flex flex-col justify-end px-5 pb-16 md:px-10 md:pb-20 lg:px-16">
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
            className="mt-3 max-w-3xl text-[clamp(2.25rem,7vw,4.25rem)] font-semibold leading-[1.05] tracking-tight text-white"
          >
            Residencias en obra.
            <br />
            Acceso privado.
          </motion.h1>
          <motion.p
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 0.55, delay: 0.4 }}
            className="mt-4 max-w-md text-[15px] leading-relaxed text-white/70 md:text-[16px]"
          >
            Mira el progreso en tiempo real. Únete a la lista de la residencia que quieres.
          </motion.p>
          <motion.div
            initial={{ opacity: 0, y: 8 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.55, delay: 0.5 }}
            className="mt-7 flex flex-wrap items-center gap-3"
          >
                <Link
                  href="#lanzamiento"
                  className="inline-flex items-center gap-2 rounded-full bg-[#e0c57a] px-6 py-3.5 text-[13px] font-semibold text-ink transition hover:bg-white"
                >
                  Ver primer lanzamiento
                  <ArrowRight size={14} />
                </Link>
                <Link
                  href="/private"
                  className="inline-flex items-center gap-1.5 rounded-full border border-white/30 bg-white/5 px-5 py-3.5 text-[13px] font-medium text-white/90 backdrop-blur-sm transition hover:border-white hover:bg-white/10"
                >
                  <Lock size={12} />
                  Omar Private
                </Link>
          </motion.div>
        </div>

        <a
          href="#lanzamiento"
          aria-label="Ir al lanzamiento"
          className="absolute bottom-5 left-1/2 z-20 flex -translate-x-1/2 flex-col items-center gap-1 text-white/45 transition hover:text-white/80"
        >
          <motion.span
            animate={{ y: [0, 5, 0] }}
            transition={{ duration: 1.8, repeat: Infinity, ease: "easeInOut" }}
          >
            <ChevronDown size={18} strokeWidth={1.25} />
          </motion.span>
        </a>
      </section>

      {/* 2 — Featured: photo + booking panel side by side */}
      <FeaturedLaunch residence={featured} />

      {/* 3 — Residencias en fila (Airbnb rail, no stack) */}
      <ResidencesCatalog />

      {/* 4 — Colección en vivo */}
      <VideoResidenceFeed />

      {/* 5 — Credibilidad */}
      <OmarCredibility />

      {/* 6 — Proceso */}
      <section className="bg-[#f7f7f5] px-5 py-16 md:px-12 md:py-20 lg:px-16">
        <div className="mx-auto max-w-[1100px]">
          <motion.div {...fadeUp} className="max-w-xl">
            <p className="text-[12px] font-medium text-[#8a6b2e]">Cómo funciona</p>
            <h2 className="mt-1.5 text-[1.75rem] font-semibold leading-tight tracking-tight text-ink md:text-[2.15rem]">
              Tres pasos. Sin ruido.
            </h2>
          </motion.div>

          <div className="mt-8 grid gap-4 md:mt-10 md:grid-cols-3 md:gap-5">
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
                className="rounded-[1.25rem] border border-[#ebe4da] bg-white p-6 shadow-[0_8px_24px_rgba(20,16,10,0.04)] md:p-7"
              >
                <p className="text-[12px] font-medium text-[#8a6b2e]">{item.step}</p>
                <h3 className="mt-3 text-xl font-semibold tracking-tight text-ink">{item.title}</h3>
                <p className="mt-2.5 text-[14px] leading-relaxed text-[#6a6660]">{item.copy}</p>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* 7 — Private (light) */}
      <section className="bg-white px-5 pt-16 pb-8 text-ink md:px-12 md:pt-20 lg:px-16">
        <div className="mx-auto grid max-w-[1100px] items-center gap-10 md:grid-cols-2 md:gap-14">
          <motion.div {...fadeUp}>
            <p className="text-[12px] font-medium text-[#8a6b2e]">Omar Private</p>
            <h2 className="mt-2 text-[1.75rem] font-semibold tracking-tight md:text-[2.15rem]">
              Acceso antes del mercado
            </h2>
            <p className="mt-4 max-w-md text-[15px] leading-relaxed text-[#6a6660]">
              Membresía por solicitud. Residencias, prioridad y actualizaciones — para quien está
              listo de verdad.
            </p>
            <Link
              href="/private"
              className="mt-8 inline-flex items-center gap-2 rounded-full bg-ink px-7 py-3.5 text-[14px] font-semibold text-white transition hover:bg-ink/90"
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
            className="relative aspect-[5/4] overflow-hidden rounded-[1.35rem] md:aspect-[4/3]"
          >
            <Image
              src="/images/ellington.jpg"
              alt="Omar Private"
              fill
              className="object-cover"
              sizes="(max-width: 768px) 100vw, 50vw"
            />
            <div className="absolute inset-0 bg-gradient-to-t from-black/35 to-transparent" />
            <p className="absolute bottom-6 left-6 text-[13px] font-medium text-white">
              Antes de que salga al mercado
            </p>
          </motion.div>
        </div>

        <footer className="mx-auto mt-14 flex max-w-[1100px] flex-col items-start justify-between gap-4 border-t border-[#ebe7e0] pt-6 sm:flex-row sm:items-center">
          <Logo size="sm" />
          <p className="text-[12px] text-[#8a847a]">Omar Corp · Indiana · Live residences</p>
        </footer>
      </section>
    </main>
  );
}
