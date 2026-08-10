"use client";

import Image from "next/image";
import Link from "next/link";
import { ChevronDown, ArrowRight, Play } from "lucide-react";
import { motion, useScroll, useTransform } from "framer-motion";
import { useRef } from "react";
import { Logo } from "@/components/Logo";
import { VideoResidenceFeed } from "@/components/VideoResidenceFeed";
import { useNova } from "@/context/NovaContext";

export default function HomePage() {
  const heroRef = useRef<HTMLElement>(null);
  const { membership } = useNova();
  const { scrollYProgress } = useScroll({
    target: heroRef,
    offset: ["start start", "end start"],
  });
  const imageScale = useTransform(scrollYProgress, [0, 1], [1, 1.15]);
  const contentOpacity = useTransform(scrollYProgress, [0, 0.5], [1, 0]);
  const contentY = useTransform(scrollYProgress, [0, 0.5], [0, -50]);

  return (
    <main className="overflow-x-hidden bg-ink">
      {/* HERO — full viewport only; next section hidden until scroll */}
      <section
        ref={heroRef}
        className="relative isolate h-svh max-h-svh min-h-svh overflow-hidden"
      >
        <motion.div style={{ scale: imageScale }} className="absolute inset-0">
          <Image
            src="/images/monroe.jpg"
            alt="Omar Corp residence"
            fill
            priority
            className="animate-ken object-cover object-[center_38%]"
            sizes="100vw"
          />
        </motion.div>

        <div className="absolute inset-0 bg-[linear-gradient(180deg,rgba(5,5,5,0.72)_0%,rgba(5,5,5,0.28)_35%,rgba(5,5,5,0.4)_55%,rgba(5,5,5,0.92)_100%)]" />
        <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_70%_40%,transparent_0%,rgba(0,0,0,0.55)_100%)]" />
        <div className="absolute inset-0 bg-gradient-to-r from-black/45 via-transparent to-transparent" />

        <header className="absolute inset-x-0 top-0 z-20 flex items-center justify-between px-5 py-6 md:px-10">
          <Logo light size="md" />
          <div className="flex items-center gap-3">
            <span className="hidden items-center gap-2 rounded-full border border-gold-soft/30 bg-black/30 px-3 py-1.5 text-[10px] tracking-[0.22em] text-gold-soft uppercase backdrop-blur-md sm:inline-flex">
              <span className="live-dot" />
              En vivo
            </span>
            <Link
              href={membership.status === "approved" ? "/private/status" : "/private"}
              className="rounded-full border border-white/20 bg-white/10 px-4 py-2 text-[10px] tracking-[0.2em] text-white uppercase backdrop-blur-md transition hover:border-gold-soft hover:text-gold-soft"
            >
              {membership.status === "approved" ? "Miembro" : "Private"}
            </Link>
          </div>
        </header>

        <motion.div
          style={{ opacity: contentOpacity, y: contentY }}
          className="relative z-10 flex h-full flex-col justify-end px-5 pb-8 md:px-12 md:pb-12 lg:px-16"
        >
          <motion.div
            initial={{ opacity: 0, y: 36 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 1, ease: [0.22, 1, 0.36, 1] }}
            className="max-w-4xl"
          >
            <motion.p
              initial={{ opacity: 0, letterSpacing: "0.8em" }}
              animate={{ opacity: 1, letterSpacing: "0.55em" }}
              transition={{ duration: 1.2, delay: 0.1 }}
              className="text-[clamp(1.1rem,3vw,1.75rem)] font-semibold text-white"
            >
              OMAR
            </motion.p>
            <p className="mt-1 text-[10px] tracking-[0.7em] text-gold-soft uppercase md:text-xs">
              Corp
            </p>

            <div className="mt-5 h-px w-16 origin-left bg-gold-soft animate-shimmer md:w-24" />

            <p className="mt-5 text-[11px] font-medium tracking-[0.38em] text-gold-soft uppercase md:text-xs">
              Residencias en construcción · Indiana
            </p>

            <h1 className="mt-3 text-[clamp(2.4rem,7.5vw,6.5rem)] font-light leading-[0.92] tracking-[0.04em] text-white drop-shadow-[0_4px_24px_rgba(0,0,0,0.75)]">
              EL FUTURO
              <br />
              DE VIVIR
            </h1>

            <motion.p
              initial={{ opacity: 0, x: -16 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: 0.4, duration: 0.85 }}
              className="script mt-2 text-[clamp(1.9rem,4.5vw,3.5rem)] text-gold-soft drop-shadow-[0_2px_14px_rgba(0,0,0,0.85)]"
            >
              Entra ahora.
            </motion.p>

            <p className="mt-4 max-w-md text-[14px] leading-relaxed text-white/85 md:text-base drop-shadow-[0_2px_10px_rgba(0,0,0,0.8)]">
              Mira cómo nace tu próxima casa. Síguele el pulso. Anótate antes de que se cierre.
            </p>

            <div className="mt-7 flex flex-col gap-3 sm:flex-row sm:items-center">
              <Link
                href="/#casas"
                className="group inline-flex items-center justify-center gap-3 rounded-full bg-gold-soft px-8 py-3.5 text-[12px] font-medium tracking-[0.22em] text-ink uppercase shadow-[0_0_40px_rgba(224,197,122,0.35)] transition hover:bg-white"
              >
                <Play size={14} fill="currentColor" />
                Explorar residencias
                <ArrowRight size={16} className="transition group-hover:translate-x-1" />
              </Link>
              <Link
                href="/private"
                className="inline-flex items-center justify-center rounded-full border border-white/30 px-7 py-3.5 text-[11px] tracking-[0.2em] text-white uppercase transition hover:border-gold-soft hover:text-gold-soft"
              >
                Omar Private
              </Link>
            </div>
          </motion.div>

          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 1.15, duration: 0.8 }}
            className="mt-6 flex flex-col items-center gap-1.5 self-center text-white/40"
          >
            <span className="text-[9px] tracking-[0.35em] uppercase">Desliza</span>
            <ChevronDown className="animate-bounce" size={18} />
          </motion.div>
        </motion.div>
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
                copy: "Recorre residencias activas con precio de preventa, avance de obra y demanda en vivo.",
              },
              {
                step: "02",
                title: "Reserva tu lugar",
                copy: "Lista de espera limitada. Prioridad real para quien actúa a tiempo.",
              },
              {
                step: "03",
                title: "Omar Private",
                copy: "Acceso anticipado por membresía. Para quien está listo de verdad.",
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
