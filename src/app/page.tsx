"use client";

import Image from "next/image";
import Link from "next/link";
import { ArrowRight, Lock, Menu, Play, X } from "lucide-react";
import { AnimatePresence, motion } from "framer-motion";
import { useEffect, useState } from "react";
import { Logo } from "@/components/Logo";
import { VideoResidenceFeed } from "@/components/VideoResidenceFeed";
import { useNova } from "@/context/NovaContext";
import { getActiveResidenceCount, getActiveResidences, playResidenceAvance } from "@/data/residences";
import { useViewportHeight } from "@/hooks/useViewportHeight";

export default function HomePage() {
  const viewportH = useViewportHeight();
  const { membership } = useNova();
  const [menuOpen, setMenuOpen] = useState(false);
  const activeCount = getActiveResidenceCount();
  const activeResidences = getActiveResidences();

  useEffect(() => {
    if (viewportH > 0) {
      document.documentElement.style.setProperty("--app-vh", `${viewportH}px`);
    }
  }, [viewportH]);

  return (
    <main className="overflow-x-hidden bg-ink">
      {/* In-flow hero — native scroll, no fixed/transform lag */}
      <section
        className="hero-viewport relative isolate overflow-hidden bg-ink"
        style={
          viewportH > 0
            ? { height: viewportH, minHeight: viewportH }
            : undefined
        }
      >
        <div className="absolute inset-0">
          <Image
            src="/images/monroe.jpg"
            alt="Omar Corp residence in transformation"
            fill
            priority
            className="animate-ken object-cover object-[center_38%]"
            sizes="100vw"
          />
        </div>

        <div className="absolute inset-0 bg-[linear-gradient(180deg,rgba(5,5,5,0.55)_0%,rgba(5,5,5,0.15)_28%,rgba(5,5,5,0.35)_52%,rgba(5,5,5,0.92)_100%)]" />
        <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_60%_35%,transparent_0%,rgba(0,0,0,0.45)_100%)]" />

        {/* Header */}
        <header className="absolute inset-x-0 top-0 z-30 flex items-center justify-between px-5 py-5 md:px-10 md:py-6">
          <Logo light size="md" />
          <div className="flex items-center gap-2.5">
            <Link
              href={membership.status === "approved" ? "/private/status" : "/private"}
              className="inline-flex items-center gap-2 rounded-full border border-[#c4a574]/70 px-3.5 py-2 text-[9px] tracking-[0.22em] text-[#e0c57a] uppercase backdrop-blur-md transition hover:border-[#e0c57a] hover:bg-black/30"
            >
              <Lock size={11} strokeWidth={1.75} />
              {membership.status === "approved" ? "Miembro" : "Private"}
            </Link>
            <button
              type="button"
              aria-label={menuOpen ? "Cerrar menú" : "Abrir menú"}
              onClick={() => setMenuOpen((v) => !v)}
              className="flex h-10 w-10 items-center justify-center rounded-full border border-white/25 text-white backdrop-blur-md"
            >
              {menuOpen ? <X size={16} /> : <Menu size={16} />}
            </button>
          </div>
        </header>

        <AnimatePresence>
          {menuOpen && (
            <motion.nav
              initial={{ opacity: 0, y: -6 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0 }}
              className="absolute top-[4.5rem] right-5 z-40 w-48 border border-white/15 bg-black/90 p-4 backdrop-blur-md md:right-10"
            >
              <div className="flex flex-col gap-3 text-[11px] tracking-[0.22em] text-white/80 uppercase">
                <Link href="/#casas" onClick={() => setMenuOpen(false)}>
                  Colección
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

        {/* Composition — one locked viewport, mockup hierarchy */}
        <div className="relative z-10 flex h-full flex-col px-5 pb-4 pt-[4.75rem] md:px-12 md:pb-6 lg:px-16">
          {/* Mid: real active count + play avance */}
          <div className="mt-[8%] flex items-center justify-between md:mt-[10%]">
            <div className="flex items-stretch gap-3">
              <span className="w-px bg-[#c4a574]/85" />
              <div>
                <p className="text-[1.75rem] font-light leading-none tracking-[0.06em] text-white tabular-nums md:text-[2rem]">
                  {String(activeCount).padStart(2, "0")}
                </p>
                <p className="mt-1.5 max-w-[7.5rem] text-[9px] leading-snug tracking-[0.2em] text-white/70 uppercase">
                  Residencias activas
                </p>
              </div>
            </div>

            <button
              type="button"
              onClick={() => playResidenceAvance(activeResidences[0]?.id)}
              className="group flex flex-col items-center gap-2 text-white"
            >
              <span className="flex h-14 w-14 items-center justify-center rounded-full border border-white/75 transition group-hover:border-[#e0c57a] group-hover:text-[#e0c57a] md:h-[3.75rem] md:w-[3.75rem]">
                <Play size={18} fill="currentColor" className="ml-0.5" />
              </span>
              <span className="text-[9px] tracking-[0.28em] text-white/75 uppercase">
                Ver avance
              </span>
            </button>
          </div>

          <div className="mt-auto">
            <motion.div
              initial={{ opacity: 0, y: 24 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.9, ease: [0.22, 1, 0.36, 1] }}
              className="max-w-xl"
            >
              <h1 className="text-[clamp(1.7rem,6.2vw,3.75rem)] font-light leading-[1.05] tracking-[0.02em] text-white drop-shadow-[0_4px_24px_rgba(0,0,0,0.75)]">
                VE LA CASA ANTES
                <br />
                DE QUE{" "}
                <span className="text-[#e0c57a]">SEA HOGAR.</span>
              </h1>

              <div className="mt-3.5 flex items-center gap-3">
                <span className="h-px w-7 shrink-0 bg-[#c4a574]" />
                <p className="text-[8px] tracking-[0.2em] text-white/80 uppercase md:text-[10px]">
                  Acceso exclusivo a residencias en transformación
                </p>
              </div>

              <p className="mt-2.5 inline-flex items-center gap-2 text-[8px] tracking-[0.22em] text-[#e0c57a] uppercase md:text-[9px]">
                <span className="h-1.5 w-1.5 rounded-full bg-[#e0c57a]" />
                Proyectos en transformación
              </p>

              <Link
                href="/#casas"
                className="group mt-4 inline-flex w-full max-w-sm items-center justify-center gap-3 rounded-md bg-[#c4a574] px-5 py-3.5 text-[10px] font-semibold tracking-[0.2em] text-ink uppercase transition hover:bg-[#e0c57a] sm:w-auto md:text-[11px]"
              >
                Entrar a la colección
                <ArrowRight size={14} className="transition group-hover:translate-x-1" />
              </Link>

              <p className="mt-2.5 flex items-center gap-1.5 text-[8px] tracking-[0.2em] text-white/45 uppercase">
                <Lock size={9} />
                Lista privada · Acceso limitado
              </p>
            </motion.div>

            <div className="mt-4 flex gap-2.5 overflow-x-auto pb-0.5 [-ms-overflow-style:none] [scrollbar-width:none] md:gap-3 [&::-webkit-scrollbar]:hidden">
              {activeResidences.map((r, i) => (
                <button
                  key={r.id}
                  type="button"
                  onClick={() => playResidenceAvance(r.id)}
                  className={`relative w-[140px] shrink-0 overflow-hidden rounded-md border bg-black/50 text-left backdrop-blur-md transition md:w-[160px] ${
                    i === 0
                      ? "border-[#c4a574]/85"
                      : "border-white/15 hover:border-white/35"
                  }`}
                >
                  <div className="relative h-[64px] w-full md:h-[72px]">
                    <Image
                      src={r.image}
                      alt={r.name}
                      fill
                      className="object-cover"
                      sizes="160px"
                    />
                    <div className="absolute inset-0 bg-gradient-to-t from-black/75 to-transparent" />
                  </div>
                  <div className="space-y-1 px-2 py-2">
                    <p className="truncate text-[8px] font-medium tracking-[0.14em] text-white uppercase md:text-[9px]">
                      {String(i + 1).padStart(2, "0")} {r.name}
                    </p>
                    <p className="text-[7px] tracking-[0.12em] text-[#e0c57a] uppercase md:text-[8px]">
                      {r.progress}% completado
                    </p>
                    <div className="h-px overflow-hidden bg-white/15">
                      <div
                        className="h-full bg-[#c4a574]"
                        style={{ width: `${r.progress}%` }}
                      />
                    </div>
                  </div>
                </button>
              ))}
            </div>

            <div className="mt-3.5 flex flex-col items-center gap-1 self-center">
              <span className="text-[8px] tracking-[0.3em] text-white/45 uppercase">
                Desliza para explorar
              </span>
              <span className="h-px w-7 bg-[#c4a574]/80" />
            </div>
          </div>
        </div>
      </section>

      {/* Video houses — the magic + unlock */}
      <VideoResidenceFeed />

      {/* Simple 3 steps — editorial */}
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

      {/* Cinematic teaser */}
      <section className="relative min-h-[85vh] overflow-hidden">
        <Image
          src="/images/harrison.jpg"
          alt=""
          fill
          className="object-cover"
          sizes="100vw"
        />
        <div className="absolute inset-0 bg-ink/50" />
        <div className="absolute inset-0 bg-gradient-to-r from-ink via-ink/75 to-transparent" />

        <div className="relative z-10 flex min-h-[85vh] flex-col justify-center px-5 py-24 md:px-12 lg:px-16">
          <motion.div
            initial={{ opacity: 0, y: 24 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.7 }}
            className="max-w-xl"
          >
            <p className="inline-flex items-center gap-2 text-[11px] tracking-[0.35em] text-gold-soft uppercase">
              <span className="live-dot" />
              Showroom en vivo
            </p>
            <h2 className="mt-5 text-4xl font-light tracking-[0.05em] text-white md:text-6xl">
              CADA CASA
              <br />
              ES UN LANZAMIENTO.
            </h2>
            <p className="mt-5 max-w-md text-base leading-relaxed text-white/60">
              No es Zillow. No es un catálogo. Es Omar Corp: residencias activas, contador real y
              lista de espera para quien quiere entrar primero.
            </p>
            <Link
              href="/#casas"
              className="group mt-10 inline-flex items-center gap-3 rounded-full bg-white px-8 py-4 text-[12px] tracking-[0.22em] text-ink uppercase transition hover:bg-gold-soft"
            >
              Quiero entrar
              <ArrowRight size={16} className="transition group-hover:translate-x-1" />
            </Link>
          </motion.div>
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
