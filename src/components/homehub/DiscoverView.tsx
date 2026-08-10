"use client";

import Image from "next/image";
import Link from "next/link";
import { Search, TrendingUp } from "lucide-react";
import { useMemo, useState } from "react";
import { HomeCard } from "@/components/homehub/HomeCard";
import { JoinListModal } from "@/components/homehub/JoinListModal";
import { useNova } from "@/context/NovaContext";
import {
  FILTERS,
  homes,
  neighborhoods,
  type PreMarketHome,
} from "@/data/homes";

export function DiscoverView() {
  const { isOnWaitlist, follow } = useNova();
  const [filter, setFilter] = useState<string>("all");
  const [query, setQuery] = useState("");
  const [saved, setSaved] = useState<Set<string>>(() => new Set());
  const [joinHome, setJoinHome] = useState<PreMarketHome | null>(null);

  const filtered = useMemo(() => {
    const q = query.trim().toLowerCase();
    return homes.filter((h) => {
      const okFilter = filter === "all" || h.category === filter;
      const okQuery =
        !q ||
        h.address.toLowerCase().includes(q) ||
        h.city.toLowerCase().includes(q) ||
        h.neighborhood.toLowerCase().includes(q);
      return okFilter && okQuery;
    });
  }, [filter, query]);

  const toggleSave = (id: string) => {
    setSaved((prev) => {
      const next = new Set(prev);
      if (next.has(id)) next.delete(id);
      else next.add(id);
      return next;
    });
  };

  return (
    <div>
      {/* Top bar */}
      <div className="mb-6 flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
        <div className="relative max-w-md flex-1">
          <Search
            size={16}
            className="pointer-events-none absolute top-1/2 left-3.5 -translate-y-1/2 text-[#8a8a8a]"
          />
          <input
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            placeholder="Search Logansport, Lafayette, Kokomo…"
            className="w-full rounded-full border border-[#e8e8e8] bg-white py-2.5 pr-4 pl-10 text-[14px] outline-none transition focus:border-[#111]"
          />
        </div>
        <div className="inline-flex items-center gap-2 rounded-full border border-[#e8e8e8] bg-white px-3.5 py-2 text-[12px] text-[#5c5c5c]">
          <TrendingUp size={14} className="text-[#111]" />
          <span className="font-semibold text-[#111]">{homes.length}</span> homes in progress
          <span className="text-[#aaa]">·</span>
          Updated today
        </div>
      </div>

      {/* Hero copy */}
      <div className="mb-6 max-w-2xl">
        <h1 className="text-[1.75rem] font-semibold tracking-tight text-[#111] md:text-[2.1rem]">
          Discover homes before they hit the market
        </h1>
        <p className="mt-2 text-[15px] leading-relaxed text-[#6a6a6a]">
          Follow the transformation. Get access first. Builders measure demand before they finish.
        </p>
      </div>

      {/* Filters */}
      <div className="mb-6 flex gap-2 overflow-x-auto pb-1">
        {FILTERS.map((f) => (
          <button
            key={f.id}
            type="button"
            onClick={() => setFilter(f.id)}
            className={`shrink-0 rounded-full px-4 py-2 text-[13px] font-medium transition ${
              filter === f.id
                ? "bg-[#111] text-white"
                : "border border-[#e8e8e8] bg-white text-[#5c5c5c] hover:border-[#111]"
            }`}
          >
            {f.label}
          </button>
        ))}
      </div>

      {/* Cards grid */}
      <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
        {filtered.map((home, i) => (
          <div key={home.id}>
            <HomeCard
              home={home}
              priority={i === 0}
              saved={saved.has(home.id)}
              onToggleSave={() => toggleSave(home.id)}
            />
            <div className="mt-3">
              {isOnWaitlist(home.id) ? (
                <span className="text-[12px] font-medium text-[#111]">On early access list</span>
              ) : (
                <button
                  type="button"
                  onClick={() => setJoinHome(home)}
                  className="rounded-full bg-[#111] px-3.5 py-2 text-[12px] font-semibold text-white transition hover:bg-black/80"
                >
                  Request early access
                </button>
              )}
            </div>
          </div>
        ))}
      </div>

      {filtered.length === 0 && (
        <p className="py-16 text-center text-[14px] text-[#8a8a8a]">No homes match that search.</p>
      )}

      {/* Neighborhoods */}
      <section className="mt-12">
        <h2 className="text-[1.25rem] font-semibold tracking-tight text-[#111]">
          Popular neighborhoods
        </h2>
        <div className="mt-4 flex gap-4 overflow-x-auto pb-2">
          {neighborhoods.map((n) => (
            <Link
              key={n.id}
              href={`/?q=${encodeURIComponent(n.name)}`}
              className="w-[240px] shrink-0 overflow-hidden rounded-2xl border border-[#ececec] bg-white"
            >
              <div className="relative h-[120px]">
                <Image src={n.image} alt={n.name} fill className="object-cover" sizes="240px" />
              </div>
              <div className="p-3">
                <p className="text-[14px] font-semibold text-[#111]">{n.name}</p>
                <p className="mt-0.5 text-[12px] text-[#6a6a6a]">
                  {n.homesInProgress} homes in progress
                </p>
              </div>
            </Link>
          ))}
        </div>
      </section>

      {/* Early access CTA */}
      <section className="mt-12 overflow-hidden rounded-3xl bg-[#111] px-6 py-8 text-white md:px-10 md:py-10">
        <div className="flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
          <div>
            <p className="text-[12px] font-medium text-white/60">Early Access</p>
            <h2 className="mt-1 text-[1.35rem] font-semibold tracking-tight md:text-[1.6rem]">
              Be first when a home opens
            </h2>
            <p className="mt-2 max-w-md text-[14px] text-white/65">
              Join the priority list for homes still under renovation — before Zillow, before the
              open market.
            </p>
          </div>
          <Link
            href="/early-access"
            className="inline-flex shrink-0 items-center justify-center rounded-full bg-white px-5 py-3 text-[14px] font-semibold text-[#111]"
          >
            Join Early Access
          </Link>
        </div>
        {follow?.email && (
          <p className="mt-4 text-[12px] text-white/45">Signed in as {follow.email}</p>
        )}
      </section>

      {joinHome && (
        <JoinListModal home={joinHome} open onClose={() => setJoinHome(null)} />
      )}
    </div>
  );
}
