"use client";

import { AppShell } from "@/components/homehub/AppShell";

export default function UpdatesPage() {
  return (
    <AppShell>
      <h1 className="text-[1.5rem] font-semibold tracking-tight text-[#111]">Updates</h1>
      <p className="mt-2 max-w-lg text-[14px] text-[#6a6a6a]">
        Live renovation updates from homes you follow will appear here — photos, milestones, and
        early access alerts.
      </p>
      <div className="mt-8 rounded-2xl border border-dashed border-[#e0e0e0] bg-white px-5 py-10 text-center text-[14px] text-[#8a8a8a]">
        Follow a home on Discover to start your feed.
      </div>
    </AppShell>
  );
}
