"use client";

import { AppShell } from "@/components/homehub/AppShell";

export default function MessagesPage() {
  return (
    <AppShell>
      <h1 className="text-[1.5rem] font-semibold tracking-tight text-[#111]">Messages</h1>
      <p className="mt-2 text-[14px] text-[#6a6a6a]">
        Builder ↔ buyer messages for tours and offers will live here.
      </p>
    </AppShell>
  );
}
