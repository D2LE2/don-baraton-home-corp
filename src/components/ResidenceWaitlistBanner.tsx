"use client";

import { Lock } from "lucide-react";
import { useState } from "react";
import { Countdown } from "@/components/Countdown";
import { WaitlistJoin } from "@/components/WaitlistJoin";
import { useNova } from "@/context/NovaContext";
import type { Residence } from "@/data/residences";

export function ResidenceWaitlistBanner({ residence }: { residence: Residence }) {
  const { isOnWaitlist } = useNova();
  const [open, setOpen] = useState(false);
  const joined = isOnWaitlist(residence.id);

  return (
    <section id="waitlist" className="border-b border-border bg-white px-5 py-12 md:px-10">
      <div className="mx-auto flex max-w-5xl flex-col gap-8 md:flex-row md:items-end md:justify-between">
        <div className="max-w-xl">
          <p className="text-[11px] tracking-[0.3em] text-gold uppercase">Lanzamiento activo</p>
          <h2 className="mt-3 text-2xl font-light tracking-wide text-ink md:text-3xl">
            Tiempo restante para terminarse
          </h2>
          <p className="mt-3 text-sm leading-relaxed text-muted">
            {residence.progress}% construida. {residence.waitlistCount}+ personas ya están en la
            lista
            {residence.waitlistLimited ? " — cupos limitados." : "."}
          </p>
          <div className="mt-6">
            <Countdown targetDate={residence.completionDate} variant="light" size="md" />
          </div>
        </div>

        <button
          type="button"
          onClick={() => setOpen(true)}
          className="inline-flex items-center justify-center gap-2 rounded-full bg-ink px-8 py-4 text-[12px] tracking-[0.2em] text-gold-soft uppercase transition hover:bg-ink/90"
        >
          <Lock size={14} />
          {joined ? "Ya estás en la lista" : "Únete a la lista de espera"}
        </button>
      </div>

      <WaitlistJoin residence={residence} open={open} onClose={() => setOpen(false)} />
    </section>
  );
}
