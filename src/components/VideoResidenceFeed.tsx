"use client";

import Image from "next/image";
import Link from "next/link";
import {
  ArrowLeftRight,
  ArrowRight,
  CalendarDays,
  ChevronRight,
  Lock,
  MapPin,
  Menu,
  Pause,
  Play,
  UserRound,
  X,
} from "lucide-react";
import { AnimatePresence, motion, type PanInfo } from "framer-motion";
import { useCallback, useEffect, useRef, useState } from "react";
import { Logo } from "@/components/Logo";
import { useNova } from "@/context/NovaContext";
import { residences, type Residence } from "@/data/residences";

const slideVariants = {
  enter: (dir: number) => ({ x: dir > 0 ? "18%" : "-18%", opacity: 0 }),
  center: { x: 0, opacity: 1 },
  exit: (dir: number) => ({ x: dir > 0 ? "-14%" : "14%", opacity: 0 }),
};

function transformLabel(residence: Residence) {
  if (residence.status === "COMING SOON") return "Early stage";
  return "Active transform";
}

export function VideoResidenceFeed() {
  const total = residences.length;
  const [index, setIndex] = useState(0);
  const [direction, setDirection] = useState(1);
  const [playing, setPlaying] = useState(false);
  const [hintVisible, setHintVisible] = useState(true);
  const [menuOpen, setMenuOpen] = useState(false);
  const videoRef = useRef<HTMLVideoElement>(null);
  const { membership } = useNova();

  const current = residences[index];

  const goTo = useCallback(
    (i: number, dir?: number) => {
      const next = Math.max(0, Math.min(total - 1, i));
      if (next === index) return;
      setDirection(dir ?? (next > index ? 1 : -1));
      setIndex(next);
      setPlaying(false);
      setHintVisible(false);
    },
    [index, total],
  );

  const goNext = useCallback(() => {
    if (index < total - 1) goTo(index + 1, 1);
  }, [goTo, index, total]);

  const goPrev = useCallback(() => {
    if (index > 0) goTo(index - 1, -1);
  }, [goTo, index]);

  useEffect(() => {
    const el = videoRef.current;
    if (!el) return;
    if (playing) {
      void el.play().catch(() => undefined);
      return;
    }
    el.pause();
  }, [playing, index]);

  useEffect(() => {
    residences.forEach((r) => {
      const link = document.createElement("link");
      link.rel = "preload";
      link.as = "video";
      link.href = r.video;
      document.head.appendChild(link);
    });
  }, []);

  useEffect(() => {
    const onPlayAvance = (event: Event) => {
      const id = (event as CustomEvent<{ id?: string }>).detail?.id;
      const i = id ? residences.findIndex((r) => r.id === id) : 0;
      const next = i >= 0 ? i : 0;

      setIndex((prev) => {
        if (next !== prev) setDirection(next > prev ? 1 : -1);
        return next;
      });
      setHintVisible(false);
      window.setTimeout(() => setPlaying(true), 380);
    };

    window.addEventListener("omar:play-avance", onPlayAvance);
    return () => window.removeEventListener("omar:play-avance", onPlayAvance);
  }, []);

  useEffect(() => {
    if (!hintVisible || index >= total - 1) return;
    const t = window.setTimeout(() => setHintVisible(false), 4800);
    return () => window.clearTimeout(t);
  }, [hintVisible, index, total]);

  function onDragEnd(_: unknown, info: PanInfo) {
    if (info.offset.x < -56 || info.velocity.x < -400) goNext();
    else if (info.offset.x > 56 || info.velocity.x > 400) goPrev();
  }

  return (
    <section id="casas" className="relative bg-black text-white">
      {/* 1 — VIDEO */}
      <div className="residence-video-frame relative overflow-hidden">
        <motion.div
          className="absolute inset-0 touch-pan-y"
          drag="x"
          dragConstraints={{ left: 0, right: 0 }}
          dragElastic={0.14}
          onDragEnd={onDragEnd}
        >
          <AnimatePresence initial={false} custom={direction} mode="popLayout">
            <motion.div
              key={current.id}
              custom={direction}
              variants={slideVariants}
              initial="enter"
              animate="center"
              exit="exit"
              transition={{ duration: 0.42, ease: [0.22, 1, 0.36, 1] }}
              className="absolute inset-0"
            >
              <Image
                src={current.image}
                alt={current.name}
                fill
                priority
                className={`object-cover object-center transition-opacity duration-500 ${
                  playing ? "opacity-0" : "opacity-100"
                }`}
                sizes="100vw"
              />
              <video
                ref={videoRef}
                className={`absolute inset-0 h-full w-full object-cover transition-opacity duration-500 ${
                  playing ? "opacity-100" : "opacity-0"
                }`}
                src={current.video}
                poster={current.image}
                playsInline
                loop
                muted
                preload="auto"
                controls={false}
                disablePictureInPicture
              />
            </motion.div>
          </AnimatePresence>
        </motion.div>

        <div className="pointer-events-none absolute inset-0 bg-gradient-to-b from-black/55 via-transparent to-black/75" />

        {/* Feed header — visible once hero has scrolled away */}
        <header className="absolute inset-x-0 top-0 z-30 flex items-center justify-between px-5 pt-5 md:px-10 md:pt-6">
          <Logo light size="sm" />
          <div className="flex items-center gap-2.5">
            <Link
              href={membership.status === "approved" ? "/private/status" : "/private"}
              className="inline-flex items-center gap-2 rounded-full border border-[#c4a574]/70 px-3 py-1.5 text-[9px] tracking-[0.2em] text-[#e0c57a] uppercase backdrop-blur-md"
            >
              <Lock size={10} strokeWidth={1.75} />
              {membership.status === "approved" ? "Miembro" : "Private"}
            </Link>
            <button
              type="button"
              aria-label={menuOpen ? "Cerrar menú" : "Abrir menú"}
              onClick={() => setMenuOpen((v) => !v)}
              className="flex h-9 w-9 items-center justify-center rounded-full border border-white/25 text-white backdrop-blur-md"
            >
              {menuOpen ? <X size={14} /> : <Menu size={14} />}
            </button>
          </div>
        </header>

        <AnimatePresence>
          {menuOpen && (
            <motion.nav
              initial={{ opacity: 0, y: -6 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0 }}
              className="absolute top-[3.75rem] right-5 z-40 w-44 border border-white/15 bg-black/90 p-4 backdrop-blur-md md:right-10"
            >
              <div className="flex flex-col gap-3 text-[11px] tracking-[0.22em] text-white/80 uppercase">
                <Link href="/" onClick={() => setMenuOpen(false)}>
                  Inicio
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

        <div className="absolute inset-x-0 top-[3.85rem] z-20 flex items-center justify-between px-5 md:top-[4.25rem] md:px-10">
          <p className="text-[11px] tracking-[0.28em] text-white/90 uppercase">
            <span className="font-medium text-white">
              {String(index + 1).padStart(2, "0")}
            </span>
            <span className="text-white/45">
              {" "}
              / {String(total).padStart(2, "0")}
            </span>
          </p>
          <p className="text-[11px] tracking-[0.22em] text-[#e0c57a] uppercase tabular-nums">
            {current.progress}% transformed
          </p>
        </div>

        <div className="pointer-events-none absolute inset-0 z-20 flex items-center justify-center">
          <button
            type="button"
            onClick={() => setPlaying((p) => !p)}
            aria-label={playing ? "Pausar" : "Ver transformación"}
            className="pointer-events-auto flex h-16 w-16 items-center justify-center rounded-full border border-white/55 bg-black/25 text-white backdrop-blur-[2px] transition hover:border-white hover:bg-black/40 md:h-[72px] md:w-[72px]"
          >
            {playing ? (
              <Pause size={22} fill="currentColor" />
            ) : (
              <Play size={22} fill="currentColor" className="ml-0.5" />
            )}
          </button>
        </div>

        <p className="pointer-events-none absolute inset-x-0 bottom-5 z-20 flex items-center justify-center gap-2 text-[9px] tracking-[0.28em] text-white/55 uppercase">
          <ArrowLeftRight size={12} strokeWidth={1.5} />
          Drag to explore
        </p>

        {index < total - 1 && (
          <button
            type="button"
            aria-label="Siguiente"
            onClick={goNext}
            className="absolute top-1/2 right-3 z-30 -translate-y-1/2 text-white/70 md:right-6"
          >
            <motion.span
              animate={hintVisible ? { x: [0, 5, 0] } : { x: 0 }}
              transition={
                hintVisible
                  ? { duration: 1.5, repeat: Infinity, ease: "easeInOut" }
                  : undefined
              }
            >
              <ChevronRight size={26} strokeWidth={1.15} />
            </motion.span>
          </button>
        )}
        {index > 0 && (
          <button
            type="button"
            aria-label="Anterior"
            onClick={goPrev}
            className="absolute top-1/2 left-3 z-30 -translate-y-1/2 rotate-180 text-white/60 md:left-6"
          >
            <ChevronRight size={24} strokeWidth={1.15} />
          </button>
        )}
      </div>

      {/* 2 — Living transform status (mockup) */}
      <div className="bg-black px-5 pb-12 pt-7 md:px-12 md:pb-16 md:pt-9 lg:px-16">
        <AnimatePresence initial={false} custom={direction} mode="wait">
          <motion.div
            key={current.id}
            custom={direction}
            variants={slideVariants}
            initial="enter"
            animate="center"
            exit="exit"
            transition={{ duration: 0.36, ease: [0.22, 1, 0.36, 1] }}
            className="mx-auto max-w-xl"
          >
            <p className="text-[10px] tracking-[0.4em] text-[#c4a574] uppercase">
              {current.code}
            </p>
            <h2 className="mt-2.5 text-[clamp(2rem,7vw,3.5rem)] font-semibold tracking-[0.04em] text-white uppercase">
              {current.name}
            </h2>

            <p className="mt-2.5 flex items-center gap-1.5 text-[13px] text-white/50">
              <MapPin size={13} className="shrink-0 text-white/40" />
              {current.location}
            </p>

            <p className="mt-4 inline-flex items-center gap-2 text-[10px] tracking-[0.28em] text-emerald-400 uppercase">
              <span className="live-dot !bg-emerald-400" />
              {transformLabel(current)}
            </p>

            {/* Progress: big % + bar beside */}
            <div className="mt-7 flex items-end gap-4">
              <div className="shrink-0">
                <p className="text-[clamp(2.6rem,9vw,3.75rem)] font-light leading-none tracking-tight text-[#e0c57a] tabular-nums">
                  {current.progress}%
                </p>
                <p className="mt-2 text-[9px] tracking-[0.28em] text-white/40 uppercase">
                  Current progress
                </p>
              </div>
              <div className="mb-7 min-w-0 flex-1">
                <div className="h-[2px] overflow-hidden rounded-full bg-white/15">
                  <motion.div
                    key={`progress-${current.id}`}
                    className="h-full bg-[#e0c57a]"
                    initial={{ width: 0 }}
                    animate={{ width: `${current.progress}%` }}
                    transition={{ duration: 0.9, ease: [0.22, 1, 0.36, 1] }}
                  />
                </div>
              </div>
            </div>

            {current.latestUpdate && (
              <Link
                href={`/residences/${current.id}`}
                className="group mt-7 flex items-center gap-3 overflow-hidden rounded-xl border border-white/10 bg-white/[0.04] p-3 transition hover:border-[#c4a574]/45 hover:bg-white/[0.06]"
              >
                <span className="flex h-10 w-10 shrink-0 items-center justify-center rounded-full bg-[#c4a574]/15 text-[#e0c57a]">
                  <CalendarDays size={16} strokeWidth={1.75} />
                </span>
                <div className="min-w-0 flex-1">
                  <p className="text-[9px] tracking-[0.24em] text-[#e0c57a] uppercase">
                    Latest update · {current.latestUpdate.date}
                  </p>
                  <p className="mt-1 flex items-center gap-1.5 text-[13px] text-white">
                    <span className="truncate">{current.latestUpdate.title}</span>
                    <ArrowRight
                      size={13}
                      className="shrink-0 opacity-70 transition group-hover:translate-x-0.5"
                    />
                  </p>
                </div>
                {current.latestUpdate.image && (
                  <span className="relative h-14 w-[4.5rem] shrink-0 overflow-hidden rounded-md">
                    <Image
                      src={current.latestUpdate.image}
                      alt=""
                      fill
                      className="object-cover"
                      sizes="72px"
                    />
                  </span>
                )}
              </Link>
            )}

            <p className="mt-7 flex items-start gap-2 text-[11px] leading-relaxed tracking-[0.06em] text-white/50 uppercase">
              <UserRound size={14} className="mt-0.5 shrink-0 text-white/35" />
              Sigue cada avance. Obtén prioridad cuando esté disponible.
            </p>

            <Link
              href={`/residences/${current.id}#follow`}
              className="mt-5 flex w-full items-center justify-center gap-2.5 rounded-lg bg-[#c4a574] px-5 py-3.5 text-[11px] font-semibold tracking-[0.22em] text-ink uppercase transition hover:bg-[#e0c57a]"
            >
              Follow this residence
              <ArrowRight size={15} />
            </Link>

            <p className="mt-4 flex items-center justify-center gap-1.5 text-[8px] tracking-[0.22em] text-white/35 uppercase">
              <Lock size={9} />
              Private list · Limited access
            </p>
          </motion.div>
        </AnimatePresence>
      </div>

      {/* 3 — CATALOG */}
      <div className="bg-[#faf8f4] px-5 py-14 md:px-12 md:py-20 lg:px-16">
        <div className="mx-auto max-w-[1100px]">
          <p className="text-[11px] tracking-[0.4em] text-[#9a8660] uppercase">
            Private collection
          </p>
          <h3 className="display mt-3 text-3xl font-light text-ink md:text-4xl">
            Explore the residences.
          </h3>

          <div className="mt-10 grid gap-5 sm:grid-cols-3">
            {residences.map((r, i) => {
              const active = i === index;
              return (
                <button
                  key={r.id}
                  type="button"
                  onClick={() => goTo(i, i > index ? 1 : -1)}
                  className={`group text-left transition ${
                    active ? "opacity-100" : "opacity-80 hover:opacity-100"
                  }`}
                >
                  <div className="relative aspect-[4/3] overflow-hidden">
                    <Image
                      src={r.image}
                      alt={r.name}
                      fill
                      className="object-cover transition duration-700 group-hover:scale-[1.03]"
                      sizes="(max-width: 640px) 100vw, 33vw"
                    />
                    <div className="absolute inset-0 bg-gradient-to-t from-black/55 via-transparent to-transparent" />
                    {active && (
                      <span className="absolute bottom-0 left-0 h-0.5 w-full bg-[#c4a574]" />
                    )}
                  </div>
                  <div className="mt-4 flex items-baseline justify-between gap-3">
                    <p className="text-[13px] font-medium tracking-[0.18em] text-ink uppercase">
                      {r.name}
                    </p>
                    <p className="text-[11px] tracking-[0.14em] text-[#9a8660] uppercase tabular-nums">
                      {r.progress}%
                    </p>
                  </div>
                </button>
              );
            })}
          </div>
        </div>
      </div>
    </section>
  );
}
