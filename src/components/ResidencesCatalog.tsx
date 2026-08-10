"use client";

import Image from "next/image";
import Link from "next/link";
import { ArrowUpRight, Check } from "lucide-react";
import { motion } from "framer-motion";
import { useState } from "react";
import { ProgressBar } from "@/components/ProgressBar";
import { WaitlistJoin } from "@/components/WaitlistJoin";
import { useNova } from "@/context/NovaContext";
import { residences, type Residence } from "@/data/residences";

/** Compact premium index — each residence has its own waitlist CTA */
export function ResidencesCatalog() {
  const { isOnWaitlist } = useNova();
  const [active, setActive] = useState<Residence | null>(null);

  return (
    <section id="catalogo" className="bg-white px-5 py-16 md:px-12 md:py-20 lg:px-16">
      <div className="mx-auto max-w-[1100px]">
        <div className="flex flex-col gap-3 border-b border-[#e8e2d8] pb-6 sm:flex-row sm:items-end sm:justify-between">
          <div>
            <p className="text-[10px] tracking-[0.35em] text-[#9a8660] uppercase">Catálogo</p>
            <h2 className="mt-2 text-2xl font-light tracking-[0.06em] text-ink uppercase md:text-3xl">
              Residencias
            </h2>
          </div>
          <p className="max-w-sm text-[12px] leading-relaxed text-[#8a847a]">
            Cada propiedad tiene su propia lista de espera. Únete solo a la que te interesa.
          </p>
        </div>

        <ul className="mt-2 divide-y divide-[#ece7df]">
          {residences.map((r, i) => {
            const joined = isOnWaitlist(r.id);
            return (
              <motion.li
                key={r.id}
                initial={{ opacity: 0, y: 12 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true, margin: "-40px" }}
                transition={{ duration: 0.45, delay: i * 0.06 }}
                className="grid grid-cols-[72px_1fr] items-center gap-3 py-4 md:grid-cols-[96px_minmax(0,1fr)_132px_auto] md:gap-5 md:py-5"
              >
                <Link
                  href={`/residences/${r.id}`}
                  className="relative h-[56px] w-[72px] overflow-hidden bg-[#f3efe8] md:h-[72px] md:w-[96px]"
                >
                  <Image
                    src={r.image}
                    alt={r.name}
                    fill
                    className="object-cover transition duration-500 hover:scale-[1.04]"
                    sizes="96px"
                  />
                </Link>

                <div className="min-w-0">
                  <div className="flex items-start justify-between gap-2">
                    <div className="min-w-0">
                      <p className="text-[9px] tracking-[0.28em] text-[#b8924a] uppercase">
                        {r.code}
                      </p>
                      <Link
                        href={`/residences/${r.id}`}
                        className="mt-0.5 block truncate text-[14px] font-medium tracking-[0.06em] text-ink uppercase transition hover:text-[#8a6b2e] md:text-[15px]"
                      >
                        {r.name}
                      </Link>
                      <p className="mt-0.5 truncate text-[11px] text-[#8a847a]">{r.location}</p>
                    </div>
                    <Link
                      href={`/residences/${r.id}`}
                      className="flex h-8 w-8 shrink-0 items-center justify-center text-[#9a8660] transition hover:text-ink md:hidden"
                      aria-label={`Ver ${r.name}`}
                    >
                      <ArrowUpRight size={16} strokeWidth={1.5} />
                    </Link>
                  </div>

                  <p className="mt-1.5 text-[10px] tracking-[0.06em] text-[#6a655e] uppercase">
                    {r.beds} hab · {r.baths} ba · {r.waitlistCount}+ en lista
                    {r.waitlistLimited ? " · cupos limitados" : ""}
                  </p>
                  <ProgressBar
                    value={r.progress}
                    size="sm"
                    showLabel
                    className="mt-2 max-w-[220px] md:hidden"
                  />

                  <div className="mt-3 flex items-center gap-2 md:hidden">
                    {joined ? (
                      <span className="inline-flex items-center gap-1.5 border border-[#e8e2d8] px-3 py-2 text-[9px] tracking-[0.16em] text-[#6a655e] uppercase">
                        <Check size={11} className="text-[#b8924a]" />
                        En esta lista
                      </span>
                    ) : (
                      <button
                        type="button"
                        onClick={() => setActive(r)}
                        className="bg-ink px-3.5 py-2 text-[9px] font-medium tracking-[0.16em] text-[#e0c57a] uppercase transition hover:bg-ink/90"
                      >
                        Unirse a lista
                      </button>
                    )}
                  </div>
                </div>

                <div className="hidden md:block">
                  <p className="mb-2 text-[10px] tracking-[0.08em] text-[#6a655e] uppercase">
                    {r.beds} hab · {r.baths} ba · lista {r.waitlistCount}+
                  </p>
                  <ProgressBar value={r.progress} showLabel className="w-full" />
                </div>

                <div className="hidden items-center gap-2 md:flex">
                  {joined ? (
                    <span className="inline-flex items-center gap-1.5 border border-[#e8e2d8] px-3 py-2.5 text-[9px] tracking-[0.16em] text-[#6a655e] uppercase">
                      <Check size={12} className="text-[#b8924a]" />
                      En lista
                    </span>
                  ) : (
                    <button
                      type="button"
                      onClick={() => setActive(r)}
                      className="bg-ink px-3.5 py-2.5 text-[9px] font-medium tracking-[0.16em] text-[#e0c57a] uppercase transition hover:bg-ink/90"
                    >
                      Unirse a lista
                    </button>
                  )}
                  <Link
                    href={`/residences/${r.id}`}
                    className="flex h-9 w-9 items-center justify-center text-[#9a8660] transition hover:text-ink"
                    aria-label={`Ver ${r.name}`}
                  >
                    <ArrowUpRight size={16} strokeWidth={1.5} />
                  </Link>
                </div>
              </motion.li>
            );
          })}
        </ul>

        <div className="mt-6 flex justify-end border-t border-[#e8e2d8] pt-5">
          <Link
            href="/residences"
            className="text-[10px] tracking-[0.22em] text-[#9a8660] uppercase transition hover:text-ink"
          >
            Ver showroom completo →
          </Link>
        </div>
      </div>

      {active && (
        <WaitlistJoin
          residence={active}
          open={Boolean(active)}
          onClose={() => setActive(null)}
        />
      )}
    </section>
  );
}
