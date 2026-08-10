"use client";

import Image from "next/image";
import Link from "next/link";
import { Heart } from "lucide-react";
import { ProgressBar } from "@/components/ProgressBar";
import type { Residence } from "@/data/residences";

type ResidenceCardProps = {
  residence: Residence;
  joined?: boolean;
  onJoin?: () => void;
  priority?: boolean;
  className?: string;
};

/** Shared Airbnb-clean listing card — photo first, calm meta, soft CTAs */
export function ResidenceCard({
  residence: r,
  joined = false,
  onJoin,
  priority = false,
  className = "",
}: ResidenceCardProps) {
  return (
    <article className={`group ${className}`}>
      <Link
        href={`/residences/${r.id}`}
        className="relative block aspect-[4/3] overflow-hidden rounded-[1.25rem] bg-[#eceae6] shadow-[0_10px_28px_rgba(20,16,10,0.07)]"
      >
        <Image
          src={r.image}
          alt={r.name}
          fill
          priority={priority}
          className="object-cover transition duration-700 ease-out group-hover:scale-[1.04]"
          sizes="(max-width: 768px) 80vw, 360px"
        />
        <div className="absolute top-3 left-3 rounded-full bg-white/95 px-2.5 py-1 text-[11px] font-semibold text-ink shadow-sm">
          {r.progress}% obra
        </div>
        {onJoin && (
          <button
            type="button"
            aria-label="Unirse a lista"
            onClick={(e) => {
              e.preventDefault();
              if (!joined) onJoin();
            }}
            className="absolute top-3 right-3 flex h-9 w-9 items-center justify-center rounded-full bg-white/95 text-ink shadow-sm transition hover:scale-105"
          >
            <Heart
              size={15}
              className={joined ? "fill-[#c4a574] text-[#c4a574]" : ""}
              strokeWidth={1.75}
            />
          </button>
        )}
      </Link>

      <div className="mt-3.5 px-0.5">
        <div className="flex items-start justify-between gap-2">
          <div className="min-w-0">
            <Link
              href={`/residences/${r.id}`}
              className="block truncate text-[15px] font-semibold tracking-tight text-ink hover:underline"
            >
              {r.name}
            </Link>
            <p className="mt-0.5 truncate text-[13px] text-[#6a6660]">{r.location}</p>
          </div>
          <span className="shrink-0 rounded-full bg-[#f0ebe4] px-2 py-0.5 text-[11px] font-medium text-[#8a6b2e]">
            {r.code.replace("RESIDENCE ", "R.")}
          </span>
        </div>

        <p className="mt-1.5 text-[13px] text-[#6a6660]">
          {r.beds} hab · {r.baths} ba · {r.waitlistCount}+ en lista
        </p>

        <ProgressBar value={r.progress} size="sm" className="mt-2.5 max-w-[180px]" />

        <div className="mt-3 flex items-center gap-2">
          {joined ? (
            <span className="text-[12px] font-medium text-[#8a6b2e]">En tu lista</span>
          ) : onJoin ? (
            <button
              type="button"
              onClick={onJoin}
              className="rounded-full bg-ink px-3.5 py-2 text-[12px] font-semibold text-white transition hover:bg-ink/90"
            >
              Unirse
            </button>
          ) : null}
          <Link
            href={`/residences/${r.id}`}
            className="rounded-full border border-[#ddd6cb] bg-white px-3.5 py-2 text-[12px] font-medium text-ink transition hover:border-ink"
          >
            Ver
          </Link>
        </div>
      </div>
    </article>
  );
}
