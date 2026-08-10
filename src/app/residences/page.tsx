"use client";

import Link from "next/link";
import { ArrowLeft } from "lucide-react";
import { useState } from "react";
import { Logo } from "@/components/Logo";
import { ResidenceCard } from "@/components/ResidenceCard";
import { WaitlistJoin } from "@/components/WaitlistJoin";
import { useNova } from "@/context/NovaContext";
import { residences, type Residence } from "@/data/residences";

/** Full showroom — Airbnb-clean card grid, light and consistent with homepage */
export default function ResidencesPage() {
  const { isOnWaitlist } = useNova();
  const [active, setActive] = useState<Residence | null>(null);

  return (
    <main className="min-h-screen bg-[#f7f7f5] text-ink">
      <header className="sticky top-0 z-30 border-b border-[#ebe7e0]/80 bg-[#f7f7f5]/90 backdrop-blur-md">
        <div className="mx-auto flex max-w-[1200px] items-center justify-between px-5 py-4 md:px-10 lg:px-12">
          <Logo size="sm" />
          <Link
            href="/"
            className="inline-flex items-center gap-1.5 rounded-full border border-[#ddd6cb] bg-white px-3.5 py-2 text-[12px] font-medium text-ink transition hover:border-ink"
          >
            <ArrowLeft size={14} />
            Inicio
          </Link>
        </div>
      </header>

      <section className="mx-auto max-w-[1200px] px-5 py-10 md:px-10 md:py-14 lg:px-12">
        <p className="text-[12px] font-medium text-[#8a6b2e]">Showroom</p>
        <h1 className="mt-1.5 text-[1.85rem] font-semibold tracking-tight text-ink md:text-[2.25rem]">
          Todas las residencias
        </h1>
        <p className="mt-2 max-w-lg text-[15px] leading-relaxed text-[#6a6660]">
          Cada casa con su progreso y su lista. Elige la tuya y entra antes del mercado.
        </p>

        <div className="mt-8 grid gap-6 sm:grid-cols-2 lg:grid-cols-3 lg:gap-7">
          {residences.map((r, i) => (
            <ResidenceCard
              key={r.id}
              residence={r}
              joined={isOnWaitlist(r.id)}
              priority={i === 0}
              onJoin={() => setActive(r)}
            />
          ))}
        </div>
      </section>

      {active && (
        <WaitlistJoin
          residence={active}
          open={Boolean(active)}
          onClose={() => setActive(null)}
        />
      )}
    </main>
  );
}
