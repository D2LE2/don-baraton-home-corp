"use client";

import { AppShell } from "@/components/homehub/AppShell";
import { HomeCard } from "@/components/homehub/HomeCard";
import { homes } from "@/data/homes";

export default function SavedPage() {
  // Demo: show first home as sample saved — real save state comes next
  const sample = homes.slice(0, 1);

  return (
    <AppShell>
      <h1 className="text-[1.5rem] font-semibold tracking-tight text-[#111]">Saved</h1>
      <p className="mt-2 max-w-lg text-[14px] text-[#6a6a6a]">
        Homes you heart stay here so you can track progress and jump into early access.
      </p>
      <div className="mt-8 grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
        {sample.map((home) => (
          <HomeCard key={home.id} home={home} saved />
        ))}
      </div>
    </AppShell>
  );
}
