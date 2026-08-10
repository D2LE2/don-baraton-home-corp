"use client";

import Image from "next/image";
import Link from "next/link";
import { Heart } from "lucide-react";
import { motion } from "framer-motion";
import { useState } from "react";
import { ProgressBar } from "@/components/ProgressBar";
import { WaitlistJoin } from "@/components/WaitlistJoin";
import { useNova } from "@/context/NovaContext";
import { residences, type Residence } from "@/data/residences";

/** Airbnb-style listing grid — photo first, calm meta, clear CTA */
export function ResidencesCatalog() {
  const { isOnWaitlist } = useNova();
  const [active, setActive] = useState<Residence | null>(null);

  return (
    <section id="catalogo" className="bg-[#f7f4ef] px-5 py-14 md:px-12 md:py-20 lg:px-16">
      <div className="mx-auto max-w-[1180px]">
        <div className="mb-8 flex flex-col gap-2 md:mb-10 md:flex-row md:items-end md:justify-between">
          <div>
            <p className="text-[11px] font-medium tracking-[0.08em] text-[#8a6b2e]">
              Catálogo
            </p>
            <h2 className="mt-1 text-[1.65rem] font-semibold tracking-tight text-ink md:text-[2rem]">
              Elige tu residencia
            </h2>
          </div>
          <p className="max-w-sm text-[14px] leading-relaxed text-[#6f6a63]">
            Cada casa con su progreso y su propia lista de espera.
          </p>
        </div>

        <ul className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3 lg:gap-7">
          {residences.map((r, i) => {
            const joined = isOnWaitlist(r.id);
            return (
              <motion.li
                key={r.id}
                initial={{ opacity: 0, y: 16 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true, margin: "-40px" }}
                transition={{ duration: 0.45, delay: i * 0.06 }}
                className="group"
              >
                <Link
                  href={`/residences/${r.id}`}
                  className="relative block aspect-[4/3] overflow-hidden rounded-2xl bg-[#e8e2d8]"
                >
                  <Image
                    src={r.image}
                    alt={r.name}
                    fill
                    className="object-cover transition duration-700 ease-out group-hover:scale-[1.04]"
                    sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 380px"
                  />
                  <div className="absolute top-3 left-3 rounded-full bg-white/95 px-2.5 py-1 text-[11px] font-medium text-ink shadow-sm backdrop-blur-sm">
                    {r.progress}% obra
                  </div>
                  <button
                    type="button"
                    aria-label="Guardar"
                    onClick={(e) => {
                      e.preventDefault();
                      if (!joined) setActive(r);
                    }}
                    className="absolute top-3 right-3 flex h-8 w-8 items-center justify-center rounded-full bg-black/25 text-white backdrop-blur-sm transition hover:bg-black/40"
                  >
                    <Heart
                      size={15}
                      className={joined ? "fill-[#e0c57a] text-[#e0c57a]" : ""}
                      strokeWidth={1.75}
                    />
                  </button>
                </Link>

                <div className="mt-3.5 space-y-1.5">
                  <div className="flex items-start justify-between gap-3">
                    <div className="min-w-0">
                      <Link
                        href={`/residences/${r.id}`}
                        className="block truncate text-[15px] font-semibold tracking-tight text-ink transition hover:underline"
                      >
                        {r.name}
                      </Link>
                      <p className="mt-0.5 truncate text-[13px] text-[#6f6a63]">
                        {r.location}
                      </p>
                    </div>
                    <p className="shrink-0 text-[12px] font-medium text-[#8a6b2e]">
                      {r.code.replace("RESIDENCE ", "R.")}
                    </p>
                  </div>

                  <p className="text-[13px] text-[#6f6a63]">
                    {r.beds} hab · {r.baths} ba · {r.sqft.toLocaleString()} ft²
                  </p>

                  <ProgressBar value={r.progress} size="sm" className="mt-2 max-w-[200px]" />

                  <div className="flex items-center justify-between gap-3 pt-2">
                    <p className="text-[12px] text-[#8a847a]">
                      <span className="font-semibold text-ink">{r.waitlistCount}+</span> en lista
                    </p>
                    {joined ? (
                      <span className="text-[12px] font-medium text-[#8a6b2e]">En tu lista</span>
                    ) : (
                      <button
                        type="button"
                        onClick={() => setActive(r)}
                        className="rounded-full bg-ink px-3.5 py-2 text-[12px] font-medium text-white transition hover:bg-ink/90"
                      >
                        Unirse
                      </button>
                    )}
                  </div>
                </div>
              </motion.li>
            );
          })}
        </ul>

        <div className="mt-10 flex justify-center">
          <Link
            href="/residences"
            className="rounded-full border border-[#d9d0c3] bg-white px-5 py-2.5 text-[13px] font-medium text-ink transition hover:border-ink"
          >
            Ver showroom completo
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
