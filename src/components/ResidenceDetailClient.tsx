"use client";

import Image from "next/image";
import Link from "next/link";
import { ArrowLeft, Lock, Play } from "lucide-react";
import { useState } from "react";
import { BuildStory } from "@/components/BuildStory";
import { FollowHome } from "@/components/FollowHome";
import { LiveProgress } from "@/components/LiveProgress";
import { Logo } from "@/components/Logo";
import { ResidenceWaitlistBanner } from "@/components/ResidenceWaitlistBanner";
import { UnlockModal } from "@/components/UnlockModal";
import { useNova } from "@/context/NovaContext";
import type { Residence } from "@/data/residences";
import { formatUsd, savingsPercent } from "@/lib/pricing";

export function ResidenceDetailClient({ residence }: { residence: Residence }) {
  const { ready, isUnlocked } = useNova();
  const unlocked = ready && isUnlocked(residence.id);
  const [unlockOpen, setUnlockOpen] = useState(false);

  return (
    <main className="min-h-screen bg-background">
      <header className="sticky top-0 z-40 flex items-center justify-between border-b border-border/60 bg-white/90 px-5 py-4 backdrop-blur-md md:px-10">
        <Link
          href="/#casas"
          className="flex items-center gap-2 text-[11px] tracking-[0.2em] text-muted uppercase"
        >
          <ArrowLeft size={16} />
          Casas
        </Link>
        <Logo size="sm" />
        <Link href="/private" className="text-[10px] tracking-[0.2em] text-gold uppercase">
          Private
        </Link>
      </header>

      {/* Hero video teaser — always free */}
      <section className="relative h-[72vh] min-h-[440px] overflow-hidden bg-ink">
        <video
          className="absolute inset-0 h-full w-full object-cover"
          src={residence.video}
          poster={residence.image}
          autoPlay
          muted
          loop
          playsInline
        />
        <div className="absolute inset-0 bg-gradient-to-t from-black/75 via-black/25 to-black/35" />
        <div className="absolute inset-x-0 bottom-0 px-5 pb-10 md:px-10">
          <p className="inline-flex items-center gap-2 text-[11px] tracking-[0.3em] text-gold-soft uppercase">
            <span className="live-dot" />
            {residence.code}
          </p>
          <h1 className="mt-2 text-4xl font-light tracking-[0.08em] text-white md:text-6xl">
            {residence.name}
          </h1>
          <p className="script mt-3 text-3xl text-gold-soft">{residence.teaser}</p>
          <p className="mt-3 text-white/65">{residence.location}</p>
          <p className="mt-4 text-sm tracking-[0.12em] text-white/80 uppercase">
            {residence.progress}% Built · Expected {residence.expected}
          </p>
          <div className="mt-5 inline-flex flex-col rounded-2xl border border-gold-soft/30 bg-black/45 px-4 py-3 backdrop-blur-md">
            <p className="text-[10px] tracking-[0.24em] text-gold-soft uppercase">
              Precio de preventa
            </p>
            <p className="mt-1 display text-2xl text-white md:text-3xl">
              Desde {formatUsd(residence.priceFrom)}
            </p>
            <p className="mt-1 text-xs text-white/60">
              Mercado ~{formatUsd(residence.marketValue)} · ahorras{" "}
              {savingsPercent(residence.priceFrom, residence.marketValue)}%
            </p>
          </div>
        </div>
      </section>

      {!unlocked ? (
        <section className="px-5 py-16 md:px-10">
          <div className="mx-auto max-w-xl text-center">
            <div className="mx-auto flex h-14 w-14 items-center justify-center rounded-full border border-gold/40 bg-gold/10 text-gold">
              <Lock size={22} />
            </div>
            <h2 className="mt-6 text-2xl font-light tracking-wide text-ink md:text-3xl">
              Ya sentiste la magia.
            </h2>
            <p className="script mt-2 text-3xl text-gold">Ahora desbloquea el resto.</p>
            <p className="mt-4 text-sm leading-relaxed text-muted">
              Precio completo, Build Story, etapas con fotos, progreso en vivo y lista de espera —
              con tus datos abres esta propiedad.
            </p>
            <p className="mt-3 text-sm font-medium text-ink">
              Desde {formatUsd(residence.priceFrom)} · {residence.priceHook}
            </p>

            <div className="relative mx-auto mt-10 aspect-[16/10] max-w-md overflow-hidden rounded-3xl">
              <Image
                src={residence.image}
                alt=""
                fill
                className="scale-105 object-cover blur-md"
              />
              <div className="absolute inset-0 flex items-center justify-center bg-black/35">
                <Play className="text-white" size={36} fill="currentColor" />
              </div>
            </div>

            <button
              type="button"
              onClick={() => setUnlockOpen(true)}
              className="mt-8 inline-flex items-center gap-2 rounded-full bg-gold-soft px-8 py-4 text-[12px] font-medium tracking-[0.2em] text-ink uppercase"
            >
              <Lock size={14} />
              Desbloquear con mis datos
            </button>
          </div>
        </section>
      ) : (
        <>
          <ResidenceWaitlistBanner residence={residence} />
          <BuildStory stages={residence.stages} />
          <LiveProgress progress={residence.progress} stages={residence.stages} />
          <div id="follow">
            <FollowHome residence={residence} />
          </div>
          <section className="border-t border-border bg-ink px-5 py-16 text-center text-white md:px-10">
            <p className="text-[11px] tracking-[0.3em] text-gold-soft uppercase">Omar Private</p>
            <h2 className="mx-auto mt-3 max-w-lg text-2xl font-light tracking-wide">
              Acceso privado a residencias antes de que salgan al mercado.
            </h2>
            <Link
              href="/private/apply"
              className="mt-8 inline-flex rounded-full bg-gold-soft px-8 py-3.5 text-[11px] tracking-[0.22em] text-ink uppercase"
            >
              Solicitar membresía →
            </Link>
          </section>
        </>
      )}

      <UnlockModal
        residence={residence}
        open={unlockOpen}
        onClose={() => setUnlockOpen(false)}
      />
    </main>
  );
}
