"use client";

import Image from "next/image";
import Link from "next/link";
import { ArrowUpRight } from "lucide-react";
import { motion } from "framer-motion";
import { residences } from "@/data/residences";

/** Compact premium index — small tiles so every residence is easy to scan */
export function ResidencesCatalog() {
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
          <p className="max-w-xs text-[12px] leading-relaxed text-[#8a847a]">
            Vista rápida. Identifica cada propiedad y entra al avance.
          </p>
        </div>

        <ul className="mt-2 divide-y divide-[#ece7df]">
          {residences.map((r, i) => (
            <motion.li
              key={r.id}
              initial={{ opacity: 0, y: 12 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, margin: "-40px" }}
              transition={{ duration: 0.45, delay: i * 0.06 }}
            >
              <Link
                href={`/residences/${r.id}`}
                className="group grid grid-cols-[72px_1fr_auto] items-center gap-3 py-4 transition md:grid-cols-[96px_1fr_auto_auto] md:gap-5 md:py-5"
              >
                <div className="relative h-[56px] w-[72px] overflow-hidden bg-[#f3efe8] md:h-[72px] md:w-[96px]">
                  <Image
                    src={r.image}
                    alt={r.name}
                    fill
                    className="object-cover transition duration-500 group-hover:scale-[1.04]"
                    sizes="96px"
                  />
                </div>

                <div className="min-w-0">
                  <p className="text-[9px] tracking-[0.28em] text-[#b8924a] uppercase">
                    {r.code}
                  </p>
                  <p className="mt-0.5 truncate text-[14px] font-medium tracking-[0.06em] text-ink uppercase md:text-[15px]">
                    {r.name}
                  </p>
                  <p className="mt-0.5 truncate text-[11px] text-[#8a847a]">{r.location}</p>
                  <p className="mt-1.5 text-[10px] tracking-[0.06em] text-[#6a655e] uppercase md:hidden">
                    {r.beds} hab · {r.baths} ba · {r.progress}%
                  </p>
                </div>

                <div className="hidden items-center gap-8 md:flex">
                  <p className="text-[11px] tracking-[0.08em] text-[#6a655e] uppercase">
                    {r.beds} hab · {r.baths} ba · {r.sqft.toLocaleString()} sqft
                  </p>
                  <div className="w-[88px]">
                    <div className="flex items-baseline justify-between gap-2">
                      <span className="text-[9px] tracking-[0.14em] text-[#9a8660] uppercase">
                        Obra
                      </span>
                      <span className="text-[11px] font-medium text-ink tabular-nums">
                        {r.progress}%
                      </span>
                    </div>
                    <div className="mt-1 h-px w-full bg-[#ece7df]">
                      <div
                        className="h-px bg-[#c4a574] transition-[width] duration-500"
                        style={{ width: `${r.progress}%` }}
                      />
                    </div>
                  </div>
                </div>

                <span className="flex h-8 w-8 items-center justify-center text-[#9a8660] transition group-hover:text-ink">
                  <ArrowUpRight size={16} strokeWidth={1.5} />
                </span>
              </Link>
            </motion.li>
          ))}
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
    </section>
  );
}
