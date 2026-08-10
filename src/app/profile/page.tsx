"use client";

import { AppShell } from "@/components/homehub/AppShell";

export default function ProfilePage() {
  return (
    <AppShell>
      <h1 className="text-[1.5rem] font-semibold tracking-tight text-[#111]">Profile</h1>
      <p className="mt-2 text-[14px] text-[#6a6a6a]">
        Buyer preferences (budget, beds, city, timeline) will power AI matching next.
      </p>
    </AppShell>
  );
}
