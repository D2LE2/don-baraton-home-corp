"use client";

import Image from "next/image";
import Link from "next/link";
import { Heart } from "lucide-react";
import { formatPriceRange, type PreMarketHome } from "@/data/homes";

const AVATARS = ["S", "M", "A", "C", "L"];

type HomeCardProps = {
  home: PreMarketHome;
  saved?: boolean;
  onToggleSave?: () => void;
  priority?: boolean;
};

export function HomeCard({ home, saved, onToggleSave, priority }: HomeCardProps) {
  return (
    <article className="group">
      <Link
        href={`/homes/${home.id}`}
        className="relative block aspect-[4/3] overflow-hidden rounded-2xl bg-[#eee]"
      >
        <Image
          src={home.image}
          alt={home.address}
          fill
          priority={priority}
          className="object-cover transition duration-500 group-hover:scale-[1.03]"
          sizes="(max-width: 768px) 100vw, 33vw"
        />
        <div className="absolute top-3 left-3 rounded-full bg-white px-2.5 py-1 text-[12px] font-semibold text-[#111] shadow-sm">
          {home.progress}%
        </div>
        <button
          type="button"
          aria-label={saved ? "Unsave" : "Save"}
          onClick={(e) => {
            e.preventDefault();
            onToggleSave?.();
          }}
          className="absolute top-3 right-3 flex h-8 w-8 items-center justify-center rounded-full bg-white/95 text-[#111] shadow-sm transition hover:scale-105"
        >
          <Heart
            size={15}
            className={saved ? "fill-[#111] text-[#111]" : ""}
            strokeWidth={1.75}
          />
        </button>
      </Link>

      <div className="mt-3 space-y-1">
        <div className="flex items-start justify-between gap-2">
          <Link href={`/homes/${home.id}`} className="min-w-0">
            <h3 className="truncate text-[15px] font-semibold tracking-tight text-[#111]">
              {home.address}
            </h3>
            <p className="mt-0.5 text-[13px] text-[#6a6a6a]">
              {home.city}, {home.state} · {home.status.replace(/_/g, " ")}
            </p>
          </Link>
        </div>
        <p className="text-[13px] text-[#6a6a6a]">
          Est. {home.expectedCompletion} · {formatPriceRange(home.priceMin, home.priceMax)}
        </p>
        <div className="flex items-center gap-2 pt-1">
          <div className="flex -space-x-1.5">
            {AVATARS.slice(0, 3).map((a) => (
              <span
                key={a}
                className="flex h-6 w-6 items-center justify-center rounded-full border-2 border-white bg-[#e8e8e8] text-[9px] font-semibold text-[#444]"
              >
                {a}
              </span>
            ))}
          </div>
          <p className="text-[12px] text-[#6a6a6a]">
            <span className="font-semibold text-[#111]">{home.interested}</span> interested
          </p>
        </div>
      </div>
    </article>
  );
}
