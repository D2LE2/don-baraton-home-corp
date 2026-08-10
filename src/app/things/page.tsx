"use client";

import { Wrench } from "lucide-react";
import { AppShell } from "@/components/homehub/AppShell";
import { MarketplaceStub } from "@/components/homehub/MarketplaceStub";

export default function ThingsPage() {
  return (
    <AppShell>
      <MarketplaceStub
        eyebrow="Things"
        title="Rent tools & everyday gear"
        description="Drills, ladders, movers’ kits, and the gear you need for a project — without buying it."
        icon={Wrench}
        related={[
          { href: "/rentals", label: "Browse home rentals" },
          { href: "/discover", label: "Browse homes for sale" },
        ]}
      />
    </AppShell>
  );
}
