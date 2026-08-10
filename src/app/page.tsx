"use client";

import Image from "next/image";
import Link from "next/link";
import {
  ArrowRight,
  Camera,
  Crown,
  Lock,
  Menu,
  Play,
  Users,
  X,
} from "lucide-react";
import { AnimatePresence, motion } from "framer-motion";
import { useEffect, useState } from "react";
import { Logo } from "@/components/Logo";
import { VideoResidenceFeed } from "@/components/VideoResidenceFeed";
import { useNova } from "@/context/NovaContext";
import {
  getActiveResidenceCount,
  getActiveResidences,
  playResidenceAvance,
} from "@/data/residences";
import { useViewportHeight } from "@/hooks/useViewportHeight";

const LIST_AVATARS = [
  { initials: "MR", tone: "bg-[#3d3428]" },
  { initials: "AL", tone: "bg-[#2a3340]" },
  { initials: "JS", tone: "bg-[#3a2f3a]" },
  { initials: "CK", tone: "bg-[#2f3a32]" },
  { initials: "DN", tone: "bg-[#403528]" },
];

export default function HomePage() {
  const viewportH = useViewportHeight();
  const { membership } = useNova();
  const [menuOpen, setMenuOpen] = useState(false);
  const activeCount = getActiveResidenceCount();
  const activeResidences = getActiveResidences();
  const featured = activeResidences[0];
  const listNow = Math.min(
    99,
    activeResidences.reduce((sum, r) => sum + Math.round(r.waitlistCount * 0.08), 0) || 24,
  );

  useEffect(() => {
    if (viewportH > 0) {
      document.documentElement.style.setProperty("--app-vh", `${viewportH}px`);
    }
  }, [viewportH]);

  return (
    <main className="overflow-x-hidden bg-ink">
      {/* PRIMERA SECCIÓN — hero + social + residencias activas */}
      <section className="bg-black text-white">
        {/* Hero media */}
        <div
          className="hero-viewport relative isolate overflow-hidden"
          style={
            viewportH > 0
              ? { height: viewportH, minHeight: viewportH }
              : undefined
          }
        >
          <div className="absolute inset-0">
            <Image
              src={featured?.image ?? "/images/monroe.jpg"}
              alt={featured?.name ?? "Omar Corp residence"}
              fill
              priority
              className="object-cover object-[center_40%]"
              sizes="100vw"
            />
          </div>
          <div className="absolute inset-0 bg-[linear-gradient(180deg,rgba(5,5,5,0.62)_0%,rgba(5,5,5,0.2)_32%,rgba(5,5,5,0.45)_62%,rgba(5,5,5,0.94)_100%)]" />
          <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_70%_40%,transparent_0%,rgba(0,0,0,0.5)_100%)]" />

          <header className="absolute inset-x-0 top-0 z-30 flex items-center justify-between px-5 py-5 md:px-10 md:py-6">
            <Logo light size="md" />
            <div className="flex items-center gap-2.5">
              <Link
                href={membership.status === "approved" ? "/private/status" : "/private"}
                className="inline-flex items-center gap-2 rounded-full border border-[#c4a574]/70 px-3.5 py-2 text-[9px] tracking-[0.22em] text-[#e0c57a] uppercase backdrop-blur-md"
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

          {/* Center play */}
          <div className="pointer-events-none absolute inset-0 z-20 flex items-center justify-center">
            <button
              type="button"
              onClick={() => playResidenceAvance(featured?.id)}
              aria-label="Ver avance"
              className="pointer-events-auto flex h-[4.25rem] w-[4.25rem] items-center justify-center rounded-full border border-white/60 bg-white/10 text-white backdrop-blur-[2px] transition hover:border-[#e0c57a] hover:bg-black/30 md:h-20 md:w-20"
            >
              <Play size={22} fill="currentColor" className="ml-0.5" />
            </button>
          </div>

          {/* Right: progress of featured */}
          {featured && (
            <div className="absolute top-[38%] right-5 z-20 w-[7.5rem] md:right-10 md:w-36 lg:right-16">
              <p className="text-[clamp(2rem,6vw,2.75rem)] font-light leading-none tracking-tight text-[#e0c57a] tabular-nums">
                {featured.progress}%
              </p>
              <p className="mt-1.5 text-[9px] tracking-[0.28em] text-white/70 uppercase">
                Transformed
              </p>
              <div className="relative mt-3 h-[2px] bg-white/20">
                <div
                  className="absolute inset-y-0 left-0 bg-[#e0c57a]"
                  style={{ width: `${featured.progress}%` }}
                />
                <span
                  className="absolute top-1/2 h-2 w-2 -translate-y-1/2 rounded-full bg-white"
                  style={{ left: `calc(${featured.progress}% - 4px)` }}
                />
              </div>
            </div>
          )}

          {/* Bottom-right live */}
          <p className="absolute right-5 bottom-6 z-20 inline-flex items-center gap-2 text-[9px] tracking-[0.22em] text-white/80 uppercase md:right-10 md:bottom-8">
            <span className="live-dot !bg-emerald-400" />
            Actualizaciones en vivo
          </p>

          {/* Left copy */}
          <div className="relative z-10 flex h-full flex-col justify-end px-5 pb-8 pt-24 md:px-10 md:pb-10 lg:px-16">
            <div className="max-w-xl">
              <p className="text-[11px] tracking-[0.28em] text-white/85 uppercase">
                <span className="font-medium">01</span>
                <span className="text-white/40">
                  {" "}
                  / {String(activeCount).padStart(2, "0")}
                </span>
              </p>

              <p className="mt-4 inline-flex items-center gap-2 text-[10px] tracking-[0.28em] text-[#e0c57a] uppercase">
                <span className="h-1.5 w-1.5 rounded-full bg-[#e0c57a]" />
                Proyecto en transformación
              </p>

              <h1 className="mt-4 text-[clamp(1.85rem,6.5vw,3.75rem)] font-light leading-[1.05] tracking-[0.02em] text-white">
                VE LA CASA ANTES
                <br />
                DE QUE SEA{" "}
                <span className="text-[#e0c57a]">HOGAR.</span>
              </h1>

              <p className="mt-4 max-w-sm text-[13px] leading-relaxed text-white/75 md:text-[15px]">
                Sigue cada avance en tiempo real y sé el primero en elegir tu futura casa.
              </p>

              <div className="mt-6 flex flex-col gap-3 sm:flex-row sm:items-center">
                <Link
                  href="/#casas"
                  className="group inline-flex items-center justify-center gap-2.5 rounded-md bg-[#c4a574] px-6 py-3.5 text-[11px] font-semibold tracking-[0.2em] text-ink uppercase transition hover:bg-[#e0c57a]"
                >
                  Entrar a la colección
                  <ArrowRight size={14} className="transition group-hover:translate-x-1" />
                </Link>
                <Link
                  href="/private"
                  className="inline-flex items-center justify-center gap-2 rounded-md border border-[#c4a574]/55 px-5 py-3.5 text-[10px] tracking-[0.2em] text-[#e0c57a] uppercase transition hover:border-[#e0c57a] hover:bg-white/5"
                >
                  <Lock size={12} />
                  Lista privada
                </Link>
              </div>
            </div>
          </div>
        </div>

        {/* Social proof capsule */}
        <div className="relative z-10 -mt-5 px-4 md:-mt-6 md:px-10 lg:px-16">
          <div className="mx-auto flex max-w-5xl flex-col gap-3 rounded-2xl border border-white/10 bg-[#121212] px-4 py-3.5 shadow-[0_12px_40px_rgba(0,0,0,0.45)] sm:flex-row sm:items-center sm:justify-between sm:gap-4 sm:px-5">
            <p className="inline-flex items-center gap-2 text-[10px] tracking-[0.18em] text-[#e0c57a] uppercase">
              <Users size={14} strokeWidth={1.75} />
              {listNow} en la lista ahora
            </p>
            <div className="flex items-center gap-2">
              <div className="flex -space-x-2">
                {LIST_AVATARS.map((a) => (
                  <span
                    key={a.initials}
                    className={`flex h-8 w-8 items-center justify-center rounded-full border-2 border-[#121212] text-[9px] font-medium tracking-wide text-white/80 ${a.tone}`}
                  >
                    {a.initials}
                  </span>
                ))}
              </div>
              <span className="text-[11px] text-white/45">+{Math.max(listNow - 5, 19)}</span>
            </div>
            <p className="inline-flex items-center gap-2 text-[10px] tracking-[0.12em] text-white/65 uppercase sm:tracking-[0.16em]">
              <span className="live-dot !bg-emerald-400" />
              María S. se unió hace 2 min
            </p>
          </div>
        </div>

        {/* Residencias activas */}
        <div className="px-5 pt-10 pb-8 md:px-10 md:pt-14 md:pb-10 lg:px-16">
          <div className="mx-auto max-w-5xl">
            <div className="flex items-end justify-between gap-4">
              <p className="text-[11px] tracking-[0.35em] text-[#c4a574] uppercase">
                Residencias activas
              </p>
              <Link
                href="/#casas"
                className="inline-flex items-center gap-1.5 text-[10px] tracking-[0.22em] text-[#e0c57a] uppercase transition hover:text-white"
              >
                Ver todas
                <ArrowRight size={12} />
              </Link>
            </div>

            <div className="mt-6 grid gap-4 sm:grid-cols-3">
              {activeResidences.map((r, i) => (
                <button
                  key={r.id}
                  type="button"
                  onClick={() => playResidenceAvance(r.id)}
                  className="group text-left"
                >
                  <div className="relative aspect-[5/4] overflow-hidden rounded-lg">
                    <Image
                      src={r.image}
                      alt={r.name}
                      fill
                      className="object-cover transition duration-500 group-hover:scale-[1.03]"
                      sizes="(max-width: 640px) 100vw, 33vw"
                    />
                    <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-black/10 to-transparent" />
                    <span className="absolute top-3 left-3 rounded-full bg-[#c4a574] px-2.5 py-1 text-[9px] font-semibold tracking-[0.16em] text-ink">
                      {String(i + 1).padStart(2, "0")}
                    </span>
                  </div>
                  <p className="mt-3 text-[13px] font-medium tracking-[0.16em] text-white uppercase">
                    {r.name}
                  </p>
                  <p className="mt-1.5 text-[10px] tracking-[0.18em] text-[#e0c57a] uppercase tabular-nums">
                    {r.progress}% transformed
                  </p>
                  <div className="mt-2 h-px overflow-hidden bg-white/15">
                    <div
                      className="h-full bg-[#c4a574]"
                      style={{ width: `${r.progress}%` }}
                    />
                  </div>
                </button>
              ))}
            </div>

            {/* Feature strip */}
            <div className="mt-12 grid gap-6 border-t border-white/10 pt-8 sm:grid-cols-3 sm:gap-4">
              {[
                {
                  icon: Camera,
                  label: "Actualizaciones en tiempo real",
                },
                {
                  icon: Crown,
                  label: "Acceso prioritario antes que todos",
                },
                {
                  icon: Lock,
                  label: "Solo miembros acceso exclusivo",
                },
              ].map((item) => (
                <div
                  key={item.label}
                  className="flex items-start gap-3 sm:flex-col sm:items-center sm:text-center"
                >
                  <item.icon
                    size={18}
                    strokeWidth={1.5}
                    className="mt-0.5 shrink-0 text-[#c4a574] sm:mt-0"
                  />
                  <p className="text-[9px] leading-relaxed tracking-[0.2em] text-[#c4a574]/90 uppercase md:text-[10px]">
                    {item.label}
                  </p>
                </div>
              ))}
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
