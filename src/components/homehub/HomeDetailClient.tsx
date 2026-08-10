"use client";

import Image from "next/image";
import Link from "next/link";
import { ArrowLeft, Bath, BedDouble, Ruler } from "lucide-react";
import { useState } from "react";
import { JoinListModal } from "@/components/homehub/JoinListModal";
import { useNova } from "@/context/NovaContext";
import { formatPriceRange, type PreMarketHome } from "@/data/homes";

const TABS = ["Overview", "Photos", "Progress", "Details", "Neighborhood"] as const;

export function HomeDetailClient({ home }: { home: PreMarketHome }) {
  const { isOnWaitlist } = useNova();
  const [tab, setTab] = useState<(typeof TABS)[number]>("Progress");
  const [joinOpen, setJoinOpen] = useState(false);
  const joined = isOnWaitlist(home.id);

  const gallery = [
    home.image,
    ...home.stages.map((s) => s.image).filter(Boolean),
  ].filter((v, i, a) => a.indexOf(v) === i) as string[];

  return (
    <div>
      <Link
        href="/"
        className="mb-4 inline-flex items-center gap-1.5 text-[13px] font-medium text-[#6a6a6a] hover:text-[#111]"
      >
        <ArrowLeft size={14} />
        Back to Discover
      </Link>

      {/* Hero */}
      <div className="grid gap-4 lg:grid-cols-[1.4fr_0.85fr]">
        <div className="relative aspect-[16/11] overflow-hidden rounded-3xl bg-[#eee] lg:aspect-auto lg:min-h-[420px]">
          <Image
            src={home.image}
            alt={home.address}
            fill
            priority
            className="object-cover"
            sizes="(max-width: 1024px) 100vw, 65vw"
          />
          <div className="absolute top-4 left-4 rounded-full bg-white px-3 py-1.5 text-[13px] font-semibold text-[#111] shadow-sm">
            {home.progress}% · {home.status}
          </div>
          <div className="absolute inset-x-0 bottom-0 bg-gradient-to-t from-black/50 to-transparent p-5">
            <h1 className="text-[1.5rem] font-semibold tracking-tight text-white md:text-[1.75rem]">
              {home.address}
            </h1>
            <p className="mt-1 flex flex-wrap gap-x-3 text-[13px] text-white/85">
              <span className="inline-flex items-center gap-1">
                <BedDouble size={14} /> {home.beds} beds
              </span>
              <span className="inline-flex items-center gap-1">
                <Bath size={14} /> {home.baths} baths
              </span>
              <span className="inline-flex items-center gap-1">
                <Ruler size={14} /> {home.sqft.toLocaleString()} sqft
              </span>
            </p>
          </div>
        </div>

        {/* Priority list card */}
        <aside className="flex flex-col justify-between rounded-3xl border border-[#ececec] bg-white p-5 shadow-[0_8px_30px_rgba(0,0,0,0.04)] md:p-6">
          <div>
            <p className="text-[12px] font-medium text-[#8a8a8a]">Priority list</p>
            <h2 className="mt-2 text-[1.35rem] font-semibold tracking-tight text-[#111]">
              Join the list
            </h2>
            <p className="mt-2 text-[14px] leading-relaxed text-[#6a6a6a]">
              Get early access before this home hits the open market. Publisher: {home.publisher}.
            </p>
            <div className="mt-4 flex items-center gap-2">
              <div className="flex -space-x-1.5">
                {["S", "M", "A"].map((a) => (
                  <span
                    key={a}
                    className="flex h-7 w-7 items-center justify-center rounded-full border-2 border-white bg-[#e8e8e8] text-[10px] font-semibold"
                  >
                    {a}
                  </span>
                ))}
              </div>
              <p className="text-[13px] text-[#6a6a6a]">
                <span className="font-semibold text-[#111]">{home.interested}</span> people ahead of
                you
              </p>
            </div>

            <div className="mt-5 grid grid-cols-2 gap-3">
              <div className="rounded-2xl border border-[#f0f0f0] bg-[#fafafa] px-3 py-3">
                <p className="text-[11px] text-[#8a8a8a]">Expected completion</p>
                <p className="mt-1 text-[14px] font-semibold text-[#111]">
                  {home.expectedCompletion}
                </p>
              </div>
              <div className="rounded-2xl border border-[#f0f0f0] bg-[#fafafa] px-3 py-3">
                <p className="text-[11px] text-[#8a8a8a]">Estimated price</p>
                <p className="mt-1 text-[14px] font-semibold text-[#111]">
                  {formatPriceRange(home.priceMin, home.priceMax)}
                </p>
              </div>
            </div>
          </div>

          <div className="mt-6 space-y-2">
            {joined ? (
              <span className="block rounded-full border border-[#e8e8e8] py-3.5 text-center text-[14px] font-semibold text-[#111]">
                You&apos;re on the list
              </span>
            ) : (
              <button
                type="button"
                onClick={() => setJoinOpen(true)}
                className="w-full rounded-full bg-[#111] py-3.5 text-[14px] font-semibold text-white"
              >
                Join the List
              </button>
            )}
            <p className="text-center text-[12px] text-[#8a8a8a]">
              Follow updates · Request tour later
            </p>
          </div>
        </aside>
      </div>

      {/* Tabs */}
      <div className="mt-8 flex gap-1 overflow-x-auto border-b border-[#ececec]">
        {TABS.map((t) => (
          <button
            key={t}
            type="button"
            onClick={() => setTab(t)}
            className={`shrink-0 border-b-2 px-4 py-3 text-[14px] font-medium transition ${
              tab === t
                ? "border-[#111] text-[#111]"
                : "border-transparent text-[#8a8a8a] hover:text-[#111]"
            }`}
          >
            {t}
          </button>
        ))}
      </div>

      <div className="mt-6 grid gap-8 lg:grid-cols-[1.35fr_0.75fr]">
        <div>
          {tab === "Overview" && (
            <div>
              <h3 className="text-[1.1rem] font-semibold text-[#111]">About this project</h3>
              <p className="mt-3 text-[15px] leading-relaxed text-[#5c5c5c]">{home.about}</p>
              {home.yearBuilt && (
                <p className="mt-4 text-[13px] text-[#8a8a8a]">Year built: {home.yearBuilt}</p>
              )}
            </div>
          )}

          {tab === "Photos" && (
            <div className="grid grid-cols-2 gap-2 md:grid-cols-3">
              {gallery.map((src) => (
                <div key={src} className="relative aspect-[4/3] overflow-hidden rounded-2xl bg-[#eee]">
                  <Image src={src} alt="" fill className="object-cover" sizes="33vw" />
                </div>
              ))}
            </div>
          )}

          {tab === "Progress" && (
            <div>
              <h3 className="text-[1.1rem] font-semibold text-[#111]">Transformation timeline</h3>
              <ol className="mt-5 space-y-0">
                {home.stages.map((stage, i) => (
                  <li key={stage.id} className="relative flex gap-4 pb-8 last:pb-0">
                    {i < home.stages.length - 1 && (
                      <span className="absolute top-3 left-[11px] h-[calc(100%-12px)] w-px bg-[#e8e8e8]" />
                    )}
                    <span
                      className={`relative z-10 mt-1 h-[22px] w-[22px] shrink-0 rounded-full border-2 ${
                        stage.status === "done"
                          ? "border-[#111] bg-[#111]"
                          : stage.status === "current"
                            ? "border-[#111] bg-white"
                            : "border-[#ddd] bg-white"
                      }`}
                    />
                    <div className="min-w-0 flex-1">
                      <div className="flex flex-wrap items-baseline justify-between gap-2">
                        <p className="text-[15px] font-semibold text-[#111]">
                          {stage.status === "current" ? `TODAY: ${stage.label}` : stage.label}
                        </p>
                        <p className="text-[12px] text-[#8a8a8a]">{stage.date}</p>
                      </div>
                      <p className="mt-1 text-[13px] text-[#6a6a6a]">{stage.description}</p>
                      {stage.image && (
                        <div className="relative mt-3 h-[120px] w-full max-w-[220px] overflow-hidden rounded-xl bg-[#eee]">
                          <Image
                            src={stage.image}
                            alt={stage.label}
                            fill
                            className="object-cover"
                            sizes="220px"
                          />
                        </div>
                      )}
                    </div>
                  </li>
                ))}
              </ol>
            </div>
          )}

          {tab === "Details" && (
            <div className="grid gap-3 sm:grid-cols-2">
              {[
                ["Beds", String(home.beds)],
                ["Baths", String(home.baths)],
                ["Sqft", home.sqft.toLocaleString()],
                ["Category", home.category.replace("_", " ")],
                ["Status", home.status],
                ["Publisher", home.publisher],
              ].map(([k, v]) => (
                <div key={k} className="rounded-2xl border border-[#ececec] bg-white px-4 py-3">
                  <p className="text-[11px] text-[#8a8a8a]">{k}</p>
                  <p className="mt-1 text-[14px] font-semibold capitalize text-[#111]">{v}</p>
                </div>
              ))}
            </div>
          )}

          {tab === "Neighborhood" && (
            <div>
              <h3 className="text-[1.1rem] font-semibold text-[#111]">{home.neighborhood}</h3>
              <p className="mt-2 text-[15px] leading-relaxed text-[#5c5c5c]">
                {home.city}, {home.state}. Follow homes in this area from Discover to catch
                renovations months before they list.
              </p>
            </div>
          )}
        </div>

        <aside className="space-y-3">
          <div className="rounded-2xl border border-[#ececec] bg-white p-4">
            <p className="text-[11px] text-[#8a8a8a]">Expected completion</p>
            <p className="mt-1 text-[15px] font-semibold text-[#111]">{home.expectedCompletion}</p>
          </div>
          <div className="rounded-2xl border border-[#ececec] bg-white p-4">
            <p className="text-[11px] text-[#8a8a8a]">Estimated price</p>
            <p className="mt-1 text-[15px] font-semibold text-[#111]">
              {formatPriceRange(home.priceMin, home.priceMax)}
            </p>
          </div>
          <div className="rounded-2xl border border-[#ececec] bg-white p-4">
            <p className="text-[11px] text-[#8a8a8a]">Progress</p>
            <p className="mt-1 text-[15px] font-semibold text-[#111]">{home.progress}% complete</p>
            <div className="mt-2 h-1.5 overflow-hidden rounded-full bg-[#eee]">
              <div
                className="h-full rounded-full bg-[#111]"
                style={{ width: `${home.progress}%` }}
              />
            </div>
          </div>
        </aside>
      </div>

      <JoinListModal home={home} open={joinOpen} onClose={() => setJoinOpen(false)} />
    </div>
  );
}
