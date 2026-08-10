"use client";

import { AppShell } from "@/components/homehub/AppShell";
import { DiscoverView } from "@/components/homehub/DiscoverView";

export default function HomePage() {
  return (
    <AppShell>
      <DiscoverView />
    </AppShell>
  );
}
