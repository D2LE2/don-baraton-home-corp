"use client";

import Image from "next/image";
import Link from "next/link";
import { ChevronDown, Lock, ArrowRight } from "lucide-react";
import { motion, useScroll, useTransform } from "framer-motion";
import { useRef } from "react";
import { Logo } from "@/components/Logo";
import { ActiveLaunch } from "@/components/ActiveLaunch";
import { useNova } from "@/context/NovaContext";

export default function HomePage() {
  const heroRef = useRef<HTMLElement>(null);
  const { membership } = useNova();
  const { scrollYProgress } = useScroll({
    target: heroRef,
    offset: ["start start", "end start"],
  });
  const imageScale = useTransform(scrollYProgress, [0, 1], [1, 1.12]);
  const contentOpacity = useTransform(scrollYProgress, [0, 0.55], [1, 0]);
  const contentY = useTransform(scrollYProgress, [0, 0.55], [0, -40]);

  return (
    <main className="overflow-x-hidden bg-ink">
      {/* ── HERO: one composition, full-bleed ── */}
      <section ref={heroRef} className="relative h-[100dvh] min-h-[680px] overflow-hidden">
        <motion.div style={{ scale: imageScale }} className="absolute inset-0">
          <Image
            src="/images/monroe.jpg"
            alt="NOVA HOMES residence"
            fill
            priority
            className="object-cover object-[center_40%]"
            sizes="100vw"
          />
        </motion.div>

        <div className="absolute inset-0 bg-[linear-gradient(180deg,rgba(8,8,8,0.55)_0%,rgba(8,8,8,0.25)_38%,rgba(8,8,8,0.15)_55%,rgba(8,8,8,0.78)_100%)]" />
        <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_center,transparent_0%,rgba(0,0,0,0.35)_100%)]" />

        <header className="absolute inset-x-0 top-0 z-20 flex items-center justify-between px-5 py-6 md:px-10">
          <Logo light size="md" />
          <div className="flex items-center gap-3">
            <Link
              href="/residences"
              className="hidden text-[10px] tracking-[0.22em] text-white/70 uppercase transition hover:text-gold-soft md:inline"
            >
              Residences
            </Link>
            <Link
              href={membership.status === "approved" ? "/private/status" : "/private"}
              className="flex h-11 w-11 items-center justify-center rounded-full border border-white/20 bg-white/10 text-white backdrop-blur-md md:h-auto md:w-auto md:px-4 md:py-2 md:text-[10px] md:tracking-[0.2em] md:uppercase"
            >
              <span className="hidden md:inline">
                {membership.status === "approved" ? "Member" : "Private"}
              </span>
              <Lock size={16} className="md:hidden" />
            </Link>
          </div>
        </header>

        <motion.div
          style={{ opacity: contentOpacity, y: contentY }}
          className="relative z-10 flex h-full flex-col justify-end px-5 pb-16 md:px-12 md:pb-20 lg:px-16"
        >
          <motion.div
            initial={{ opacity: 0, y: 28 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.9, ease: [0.22, 1, 0.36, 1] }}
            className="max-w-3xl"
          >
            <p className="text-[13px] font-medium tracking-[0.55em] text-white md:text-sm">
              NOVA
            </p>
            <p className="mt-1 text-[9px] tracking-[0.6em] text-white/50 uppercase md:text-[10px]">
              Homes
            </p>

            <p className="mt-8 text-[11px] font-medium tracking-[0.4em] text-gold-soft uppercase md:text-xs">
              Modern Living. Reimagined.
            </p>

            <h1 className="mt-5 text-[clamp(2.6rem,7vw,5.75rem)] font-light leading-[0.95] tracking-[0.06em] text-white">
              EL FUTURO
              <br />
              DE VIVIR
            </h1>

            <motion.p
              initial={{ opacity: 0, x: -12 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: 0.35, duration: 0.8 }}
              className="script mt-3 text-[clamp(2rem,4.5vw,3.25rem)] text-gold-soft"
            >
              Comienza aquí.
            </motion.p>

            <p className="mt-6 max-w-md text-[15px] leading-relaxed text-white/70 md:text-base">
              Casas modernas diseñadas para una nueva forma de vivir en Indiana.
            </p>

            <div className="mt-10 flex flex-col gap-5 sm:flex-row sm:items-center">
              <Link
                href="/residences"
                className="group inline-flex items-center justify-center gap-3 rounded-full bg-white px-8 py-4 text-[12px] tracking-[0.24em] text-ink uppercase transition hover:bg-gold-soft"
              >
                Descubrir Residencias
                <ArrowRight
                  size={16}
                  className="transition group-hover:translate-x-1"
                />
              </Link>
            </div>

            <Link
              href="/private"
              className="mt-6 inline-flex items-center gap-2.5 text-[11px] tracking-[0.2em] text-white/55 uppercase transition hover:text-gold-soft"
            >
              <Lock size={13} className="text-gold-soft" />
              NOVA PRIVATE — Request Access
            </Link>
          </motion.div>

          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 1.1, duration: 0.8 }}
            className="mt-12 flex flex-col items-center gap-2 self-center text-white/40"
          >
            <span className="text-[9px] tracking-[0.35em] uppercase">Desliza para descubrir</span>
            <ChevronDown className="animate-bounce" size={18} />
          </motion.div>
        </motion.div>
      </section>

      {/* ── Active launch: countdown + waitlist ── */}
      <ActiveLaunch />

      {/* ── Promise: emotion, not listings ── */}
      <section className="relative bg-[#0a0a0a] px-5 py-24 md:px-12 md:py-32 lg:px-16">
        <div className="mx-auto max-w-6xl">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, margin: "-80px" }}
            transition={{ duration: 0.7 }}
            className="max-w-2xl"
          >
            <p className="text-[11px] tracking-[0.35em] text-gold-soft uppercase">
              The NOVA Difference
            </p>
            <h2 className="mt-5 text-3xl font-light leading-tight tracking-wide text-white md:text-5xl">
              No compras una casa terminada.
              <span className="script ml-2 text-gold-soft">La ves nacer.</span>
            </h2>
            <p className="mt-6 max-w-lg text-base leading-relaxed text-white/55">
              Cada residencia es un lanzamiento. Sigues el terreno, la estructura, el techo, los
              interiores — hasta el día en que se convierte en hogar.
            </p>
          </motion.div>

          <div className="mt-16 grid gap-3 md:grid-cols-3">
            {[
              {
                step: "01",
                title: "Watch the build",
                copy: "Timeline visual con fotos y video reales de cada etapa.",
              },
              {
                step: "02",
                title: "Follow the home",
                copy: "Notificaciones cuando tu residencia favorita avanza.",
              },
              {
                step: "03",
                title: "Private access",
                copy: "Miembros ven oportunidades antes del mercado.",
              },
            ].map((item, i) => (
              <motion.div
                key={item.step}
                initial={{ opacity: 0, y: 24 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: i * 0.12, duration: 0.55 }}
                className="border-t border-white/15 pt-6"
              >
                <p className="text-[11px] tracking-[0.3em] text-gold-soft">{item.step}</p>
                <h3 className="mt-3 text-xl font-light tracking-wide text-white">{item.title}</h3>
                <p className="mt-3 text-sm leading-relaxed text-white/50">{item.copy}</p>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* ── Cinematic teaser → residences (organized, not a grid dump) ── */}
      <section className="relative min-h-[90vh] overflow-hidden">
        <Image
          src="/images/harrison.jpg"
          alt=""
          fill
          className="object-cover"
          sizes="100vw"
        />
        <div className="absolute inset-0 bg-ink/55" />
        <div className="absolute inset-0 bg-gradient-to-r from-ink via-ink/70 to-transparent" />

        <div className="relative z-10 flex min-h-[90vh] flex-col justify-center px-5 py-24 md:px-12 lg:px-16">
          <motion.div
            initial={{ opacity: 0, y: 24 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.7 }}
            className="max-w-xl"
          >
            <p className="text-[11px] tracking-[0.35em] text-gold-soft uppercase">
              Current Residences
            </p>
            <h2 className="mt-4 text-4xl font-light tracking-[0.06em] text-white md:text-6xl">
              TRES LANZAMIENTOS.
              <br />
              UNA EXPERIENCIA.
            </h2>
            <p className="mt-5 max-w-md text-base leading-relaxed text-white/60">
              No es un catálogo. Es un showroom en vivo — una residencia por pantalla, con su
              propia historia de construcción.
            </p>
            <Link
              href="/residences"
              className="group mt-10 inline-flex items-center gap-3 rounded-full border border-white/30 px-8 py-4 text-[12px] tracking-[0.22em] text-white uppercase transition hover:border-gold-soft hover:bg-gold-soft hover:text-ink"
            >
              Entrar al showroom
              <ArrowRight size={16} className="transition group-hover:translate-x-1" />
            </Link>
          </motion.div>
        </div>
      </section>

      {/* ── Private world ── */}
      <section className="bg-[#f7f5f1] px-5 py-24 md:px-12 md:py-32 lg:px-16">
        <div className="mx-auto grid max-w-6xl items-center gap-14 md:grid-cols-2">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
          >
            <p className="text-[11px] tracking-[0.35em] text-gold uppercase">Mundo privado</p>
            <h2 className="mt-4 text-3xl font-light tracking-[0.08em] text-ink md:text-5xl">
              NOVA PRIVATE
            </h2>
            <p className="script mt-2 text-3xl text-gold">Solo para miembros.</p>
            <p className="mt-6 max-w-md text-base leading-relaxed text-muted">
              Acceso privado a residencias antes de que salgan al mercado. No es una lista de
              espera — es membresía por solicitud.
            </p>
            <Link
              href="/private"
              className="mt-10 inline-flex items-center gap-2 rounded-full bg-ink px-8 py-4 text-[12px] tracking-[0.22em] text-gold-soft uppercase transition hover:bg-ink/90"
            >
              Request Membership →
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
              alt="NOVA Private"
              fill
              className="object-cover"
              sizes="(max-width: 768px) 100vw, 50vw"
            />
            <div className="absolute inset-0 bg-gradient-to-t from-ink/50 to-transparent" />
            <p className="absolute bottom-8 left-8 text-[11px] tracking-[0.3em] text-gold-soft uppercase">
              Before the market sees it
            </p>
          </motion.div>
        </div>
      </section>

      <footer className="border-t border-white/10 bg-ink px-5 py-10 md:px-12">
        <div className="mx-auto flex max-w-6xl flex-col items-start justify-between gap-6 sm:flex-row sm:items-center">
          <Logo light size="sm" />
          <p className="text-[11px] tracking-[0.15em] text-white/35 uppercase">
            Indiana · Modern residences · Live build stories
          </p>
        </div>
      </footer>
    </main>
  );
}
